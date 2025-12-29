import { program } from 'commander';
import { GTNH_VERSIONS, GTNH_VERSIONS_LOOKUP } from '../../src/lib/data/versions';
import { Glob } from 'bun';
import type { Node } from 'ts-morph';
import { Project, ts } from 'ts-morph';
import { getGtnhConfigHistoryUrl, tryDownloadGtnhConfig } from '../../src/lib/githubDownloader';
import { applyPatch } from 'diff';
import { confirm, select } from '@inquirer/prompts';
import SyntaxKind = ts.SyntaxKind;

const tweaksBasePath = '../../src/lib/data/tweaks/';

program.argument('<versions...>', 'version(s) to update to');
program.parse();

function userError(message: string): Error {
  console.error(message);
  process.exit(1);
}

const filesNeedingUpdate: {
  tweakPath: string;
  version: string;
  type: 'incompatible (auto)' | 'incompatible (manual)' | 'needs manual check';
  reason: string;
  link?: string;
}[] = [];

for (const version of program.args) {
  const versionData = GTNH_VERSIONS_LOOKUP.get(version);
  if (versionData === undefined) {
    throw userError(`Unknown version: \`${version}\`. Make sure to add the version to versions.ts first`);
  }
}

const lastValidVersion = GTNH_VERSIONS.filter(v => !program.args.includes(v.id)).sort((a, b) =>
  b.date.localeCompare(a.date),
)[0];

const fullySupportedFiles = new Set<string>();

const tsProject = new Project({ tsConfigFilePath: '../../tsconfig.json' });
for (const version of program.args) {
  const versionData = GTNH_VERSIONS_LOOKUP.get(version)!;

  let needsDefaultKeybindCheck = false;
  const prevDefaultKeybind = await tryDownloadGtnhConfig(versionData.gitCommit, '.minecraft/config/defaultkeys.txt');
  if (prevDefaultKeybind !== undefined) {
    needsDefaultKeybindCheck = true;
  }
  let needsServerRanksCheck = false;
  console.log(
    `---
Please check the following link to see if there were any changes since ${lastValidVersion.date}:
${getGtnhConfigHistoryUrl(versionData.gitCommit, '.minecraft/serverutilities/server/ranks.txt')}`,
  );
  const answer = await confirm({ message: `Is it compatible (were there no changes since ${lastValidVersion.date})?` });
  if (!answer) {
    needsServerRanksCheck = true;
  }

  for await (const tweakFile of new Glob('**/*.ts').scan(tweaksBasePath)) {
    console.log(`Processing: ${tweakFile}`);
    let isCompatible = true;

    const tweakAst = tsProject.getSourceFileOrThrow(tweaksBasePath + tweakFile);
    for (const callExpr of tweakAst.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      if (callExpr.getArguments().length <= 0) continue;
      const funcFullName = callExpr.getExpression().getText();

      if (funcFullName.endsWith('createRawFile')) {
        const patchFilePath = extractStringLiteral(callExpr.getArguments()[0]);
        if (patchFilePath === undefined) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'needs manual check',
            reason: `Unable to check ${tweakFile} due to complex argument to createRawFile: ${callExpr.getArguments()[0]}`,
          });
          isCompatible = false;
          continue;
        }
        if ((await tryDownloadGtnhConfig(versionData.gitCommit, patchFilePath)) !== undefined) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'incompatible (auto)',
            reason: `File exists: ${patchFilePath}`,
            link: getGtnhConfigHistoryUrl(versionData.gitCommit, patchFilePath),
          });
          isCompatible = false;
        }
      } else if (funcFullName.endsWith('patchFile')) {
        const patchFilePath = extractStringLiteral(callExpr.getArguments()[0]);
        if (patchFilePath === undefined) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'needs manual check',
            reason: `Unable to check ${tweakFile} due to complex argument to createRawFile: ${callExpr.getArguments()[0]}`,
          });
          isCompatible = false;
          continue;
        }
        if (fullySupportedFiles.has(patchFilePath)) {
          continue;
        }
        const prev = await tryDownloadGtnhConfig(versionData.gitCommit, patchFilePath);
        if (prev === undefined) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'incompatible (auto)',
            reason: `File was deleted: ${patchFilePath}`,
            link: getGtnhConfigHistoryUrl(versionData.gitCommit, patchFilePath),
          });
          isCompatible = false;
          continue;
        }
        const patch = extractStringLiteral(callExpr.getArguments()[1]);
        if (patch) {
          const patchResult = applyPatch(prev, patch, { fuzzFactor: 16, autoConvertLineEndings: true });
          if (patchResult === false) {
            filesNeedingUpdate.push({
              tweakPath: tweakFile,
              version: version,
              type: 'incompatible (auto)',
              reason: `Patch was incompatible: ${patchFilePath}\n${patch}`,
              link: getGtnhConfigHistoryUrl(versionData.gitCommit, patchFilePath),
            });
            isCompatible = false;
            continue;
          }
        }
        console.log(
          `---
Please check the following link to see if there were any incompatible changes:`,
        );
        console.log('Patch:');
        console.log(patch || callExpr.getArguments()[1].getText());
        console.log(`Link: ${getGtnhConfigHistoryUrl(versionData.gitCommit, patchFilePath)}`);
        const answer = await select({
          message: 'Is it compatible?',
          choices: [
            {
              name: `yes (no changes in git since last version ${lastValidVersion.date})`,
              value: 'noChangesSinceLastVersion',
            },
            {
              name: 'yes (changes since last version are compatible)',
              value: 'changesSinceLastVersionAreCompatible',
            },
            {
              name: 'no',
              value: 'no',
            },
          ],
        });
        if (answer === 'no') {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'incompatible (manual)',
            reason: `Patch was incompatible: ${patchFilePath}\n${patch}`,
            link: getGtnhConfigHistoryUrl(versionData.gitCommit, patchFilePath),
          });
          isCompatible = false;
        } else if (answer == 'noChangesSinceLastVersion') {
          fullySupportedFiles.add(patchFilePath);
        }
      } else if (funcFullName.endsWith('patchDefaultKeybind')) {
        if (needsDefaultKeybindCheck) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'needs manual check',
            reason: `Check compatibility: .minecraft/config/defaultkeys.txt`,
            link: getGtnhConfigHistoryUrl(versionData.gitCommit, '.minecraft/config/defaultkeys.txt'),
          });
          isCompatible = false;
        }
      } else if (funcFullName.endsWith('patchServerRanks')) {
        if (needsServerRanksCheck) {
          filesNeedingUpdate.push({
            tweakPath: tweakFile,
            version: version,
            type: 'needs manual check',
            reason: `Check compatibility: .minecraft/serverutilities/server/ranks.txt\n${callExpr.getArguments()}`,
            link: getGtnhConfigHistoryUrl(versionData.gitCommit, '.minecraft/serverutilities/server/ranks.txt'),
          });
          isCompatible = false;
        }
      }
    }

    if (isCompatible) {
      let modified = false;
      let importsNeededExpr = false;
      for (const importSpecifier of tweakAst.getDescendantsOfKind(SyntaxKind.ImportSpecifier)) {
        if (importSpecifier.getName() === 'gtnhVersionIds') {
          importsNeededExpr = true;
          break;
        }
      }
      if (!importsNeededExpr) continue;
      for (const arrayLiteral of tweakAst.getDescendantsOfKind(SyntaxKind.ArrayLiteralExpression)) {
        const parent = arrayLiteral.getParent()?.asKind(SyntaxKind.PropertyAssignment);
        if (parent) {
          if (parent.getName() === 'supportedVersions') {
            modified = true;
            arrayLiteral.addElement('gtnhVersionIds.v' + version.replaceAll('.', '_'));
            await tweakAst.save();
            break;
          }
        }
      }
      if (modified) {
        console.log('Successfully updated: ' + tweakFile);
      }
    }
  }
}

{
  let prevTweakPath = undefined;
  let prevVersion = undefined;
  for (const entry of filesNeedingUpdate) {
    if (entry.tweakPath !== prevTweakPath || entry.version !== prevVersion) {
      console.log(`\n---\n${entry.tweakPath} (${entry.version})\n---`);
    }
    prevTweakPath = entry.tweakPath;
    prevVersion = entry.version;
    console.log(`\n${entry.type}: ${entry.reason}`);
    if (entry.link !== undefined) {
      console.log(`\n${entry.link}`);
    }
  }
}

function extractStringLiteral(expr: Node): string | undefined {
  if (expr.getKind() === SyntaxKind.StringLiteral) {
    return expr.asKind(SyntaxKind.StringLiteral)!.getLiteralValue();
  }
  if (expr.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) {
    return expr.asKind(SyntaxKind.NoSubstitutionTemplateLiteral)!.getLiteralValue();
  }
  return undefined;
}
