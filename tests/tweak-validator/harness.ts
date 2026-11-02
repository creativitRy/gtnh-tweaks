import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  buildTweakRegistry,
  type ConfigSchema,
  type ConfigValue,
  DownloadContext,
  GTNH_VERSIONS,
  GTNH_VERSIONS_LOOKUP,
  supportsVersion,
  tryDownloadGtnhConfig,
  type TweakConfig,
  type TweakDef,
  type TweakId,
} from '@gtnh-tweaks/core';

const TWEAKS_GLOB = 'src/lib/data/tweaks/*/*.ts';
const TWEAK_PATH = /tweaks[/\\]([^/\\]+)[/\\]([^/\\]+)\.ts$/;

export interface TweakPermutation {
  label: string;
  config: TweakConfig;
}

export interface TweakFailure {
  tweak: TweakId;
  version: string;
  permutation: string;
  detail: string;
}

export async function loadTweaks(): Promise<Map<TweakId, TweakDef>> {
  const modules: Record<string, { default: unknown }> = {};
  for (const path of Array.from(new Bun.Glob(TWEAKS_GLOB).scanSync('.')).sort()) {
    const match = TWEAK_PATH.exec(path);
    if (match === null) throw new Error(`Unexpected tweak path: ${path}`);
    const [, group, id] = match;
    modules[`./tweaks/${group}/${id}.ts`] = await import(pathToFileURL(resolve(path)).href);
  }
  return buildTweakRegistry(modules);
}

/**
 * Every combination of the tweak's config values: checkboxes try both values, selects try every option,
 * numbers/sliders/textboxes try `default` plus `toVerify`.
 */
export function configPermutations(tweak: TweakDef): TweakPermutation[] {
  const schemas = Object.entries(tweak.configs ?? {});
  if (schemas.length === 0) return [{ label: 'defaults', config: {} }];

  let permutations: TweakConfig[] = [{}];
  for (const [key, schema] of schemas) {
    const values = candidateValues(schema);
    permutations = permutations.flatMap(config => values.map(value => ({ ...config, [key]: value })));
  }
  return permutations.map(config => ({
    label:
      Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ') || 'defaults',
    config,
  }));
}

export async function validateTweak(tweak: TweakDef, allTweaks: Map<TweakId, TweakDef>): Promise<TweakFailure[]> {
  const failures: TweakFailure[] = [];
  for (const version of GTNH_VERSIONS.map(v => v.id).filter(id => supportsVersion(tweak, id))) {
    for (const permutation of configPermutations(tweak)) {
      const fail = (detail: string) =>
        failures.push({ tweak: tweak.id, version, permutation: permutation.label, detail });
      const context = new DownloadContext(version, {}, allTweaks);
      try {
        await tweak.onDownload(permutation.config, context);
      } catch (e) {
        fail(firstLine(e));
        continue;
      }
      for (const path of context.created.keys()) {
        const upstream = await tryDownloadGtnhConfig(GTNH_VERSIONS_LOOKUP.get(version)!.gitCommit, path);
        if (upstream !== undefined) fail(`created file already exists upstream: ${path}`);
      }
    }
  }
  return failures;
}

export function formatFailures(failures: TweakFailure[]): string {
  return failures.map(f => `${f.tweak} [${f.version}] (${f.permutation}): ${f.detail}`).join('\n');
}

function candidateValues(schema: ConfigSchema): ConfigValue[] {
  switch (schema.type) {
    case 'checkbox':
      return [schema.default, !schema.default];
    case 'select':
      return [schema.default, ...schema.options.filter(option => option !== schema.default)];
    default:
      return [...new Set<ConfigValue>([schema.default, ...(schema.toVerify ?? [])])];
  }
}

function firstLine(error: unknown): string {
  return String(error).split('\n', 1)[0];
}
