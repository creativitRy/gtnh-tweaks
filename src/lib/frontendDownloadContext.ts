import JSZip from 'jszip';
import type { Writable } from 'svelte/store';
import { DownloadContext, type SelectedTweaksMap, type TweakDef } from '@gtnh-tweaks/core';

export class FrontendDownloadContext extends DownloadContext {
  private readonly zip = new JSZip();

  constructor(version: string, selections: SelectedTweaksMap, allTweaks: Map<string, TweakDef>) {
    super(version, selections, allTweaks);
  }

  async generate(zipProgress: Writable<number | undefined>, part1Progress: number): Promise<Blob> {
    const FINAL_ZIP_PROGRESS = 0.9;
    const part2ProgressDelta = (FINAL_ZIP_PROGRESS - part1Progress) * 0.9;
    let i = 0;
    const div = this.modified.size + this.created.size;
    for (const [id, content] of this.modified) {
      this.zip.file(id, content);
      i++;
      zipProgress.set(Math.min(FINAL_ZIP_PROGRESS, part1Progress + (i * part2ProgressDelta) / div));
    }
    for (const [id, content] of this.created) {
      this.zip.file(id, content);
      i++;
      zipProgress.set(Math.min(FINAL_ZIP_PROGRESS, part1Progress + (i * part2ProgressDelta) / div));
    }

    for (const [id, tweakConfig] of Object.entries(this.selections)) {
      const tweak = this.ALL_TWEAKS.get(id)!;
      for (const mod of tweak.filesToDownload ? tweak.filesToDownload(this.version, tweakConfig) : []) {
        this.addPlaceholder(`.minecraft/mods/${mod.filename}`);
      }
    }
    this.collectDeletions();

    this.zip.file('.minecraft/gtnh-tweaks.txt', this.buildManifest(window.location.href));
    zipProgress.set(FINAL_ZIP_PROGRESS);
    return this.zip.generateAsync({ type: 'blob' });
  }
}
