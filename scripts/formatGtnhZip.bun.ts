import { $, Glob } from 'bun';
import { Command, Option, runExit } from 'clipanion';
import * as path from 'node:path';
import { formatPatch, structuredPatch } from 'diff';

await runExit(
  class Cmd extends Command {
    static usage = Command.Usage({
      description: `Unzips desired files from a new gtnh version and checks if there were any changes.`,
      details: `
      For all files in static/gtnh/<from>/**, we will unzip the file static/gtnh/<to>/..
      and check if those two files have any diffs.
      GT_New_Horizons_<to>_Java_17-25.zip must be in current working directory.
    `,
    });
    from = Option.String({ required: true });
    to = Option.String({ required: true });

    async execute() {
      const hasDiffs: [string, ReturnType<typeof structuredPatch>][] = [];
      for await (let file of new Glob('**/*').scan(`../static/gtnh/${this.from}/`)) {
        file = file.replaceAll('\\', '/');
        const dir = path.dirname(file).replaceAll('\\', '/');
        if (await Bun.file(`../static/gtnh/${this.to}/${file}`).exists()) {
          continue;
        }
        console.log(
          `unzip -j GT_New_Horizons_${this.to}_Java_17-25.zip "GT New Horizons ${this.to}/.minecraft/${file}" -d "../static/gtnh/${this.to}/${dir}"`,
        );
        await $`mkdir -p "../static/gtnh/${this.to}/${dir}"`;
        await $`bash -c 'unzip -j GT_New_Horizons_${this.to}_Java_17-25.zip "GT New Horizons ${this.to}/.minecraft/${file}" -d "../static/gtnh/${this.to}/${dir}"'`;

        const diffed = structuredPatch(
          `../static/gtnh/${this.from}/${file}`,
          `../static/gtnh/${this.to}/${file}`,
          await Bun.file(`../static/gtnh/${this.from}/${file}`).text(),
          await Bun.file(`../static/gtnh/${this.to}/${file}`).text(),
          undefined,
          undefined,
          { stripTrailingCr: true },
        );
        if (diffed.hunks.length > 0) {
          hasDiffs.push([file, diffed]);
        }
      }
      for (const [file, diffed] of hasDiffs.sort((a, b) =>
        a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }),
      )) {
        console.log(`File ${file} has differences between ${this.from} and ${this.to}:\n${formatPatch(diffed)}`);
      }
    }
  },
);
