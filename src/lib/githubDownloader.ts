export async function downloadGtnhConfig(commit: string, filePath: string): Promise<string> {
  if (!filePath.startsWith('.minecraft/')) {
    throw new Error('malformed filepath: ' + filePath);
  }
  filePath = filePath.substring('.minecraft/'.length);
  const url = `https://raw.githubusercontent.com/GTNewHorizons/GT-New-Horizons-Modpack/${commit}/${filePath}`;
  for (let i = 0; i < 4; i++) {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.log(`Failed to download [${url}]: ${response.statusText}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * i * i + 1000));
        continue;
      }
      console.log(`Failed to download [${url}]: ${response}`);
      break;
    }
    return response.text();
  }
  throw new Error(`Unable to reach [${url}]. Are you getting rate limited?`);
}

export async function tryDownloadGtnhConfig(commit: string, filePath: string): Promise<string | undefined> {
  if (!filePath.startsWith('.minecraft/')) {
    throw new Error('malformed filepath: ' + filePath);
  }
  filePath = filePath.substring('.minecraft/'.length);
  const url = `https://raw.githubusercontent.com/GTNewHorizons/GT-New-Horizons-Modpack/${commit}/${filePath}`;
  for (let i = 0; i < 4; i++) {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 408 || response.status === 429 || response.status >= 500) {
        console.log(`Failed to download [${url}]: ${response.statusText}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * i * i + 1000));
        continue;
      }
      return undefined;
    }
    return response.text();
  }
  throw new Error(`Unable to reach [${url}]. Are you getting rate limited?`);
}

export function getGtnhConfigHistoryUrl(commit: string, filePath: string): string {
  if (!filePath.startsWith('.minecraft/')) {
    throw new Error('malformed filepath: ' + filePath);
  }
  filePath = filePath.substring('.minecraft/'.length);
  return `https://github.com/GTNewHorizons/GT-New-Horizons-Modpack/commits/${commit}/${filePath}`;
}
