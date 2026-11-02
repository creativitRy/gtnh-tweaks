const MAX_CONCURRENT_DOWNLOADS = 8;

type DownloadOutcome = { status: 'ok'; text: string } | { status: 'missing'; httpStatus: number };

const downloads = new Map<string, Promise<DownloadOutcome>>();
const waiting: (() => void)[] = [];
let activeDownloads = 0;

export async function downloadGtnhConfig(commit: string, filePath: string): Promise<string> {
  const url = gtnhConfigUrl(commit, filePath);
  const outcome = await load(url);
  if (outcome.status === 'ok') return outcome.text;
  console.log(`Failed to download [${url}]: HTTP ${outcome.httpStatus}`);
  throw new Error(`Unable to reach [${url}]. Are you getting rate limited?`);
}

export async function tryDownloadGtnhConfig(commit: string, filePath: string): Promise<string | undefined> {
  const outcome = await load(gtnhConfigUrl(commit, filePath));
  return outcome.status === 'ok' ? outcome.text : undefined;
}

export function getGtnhConfigHistoryUrl(commit: string, filePath: string): string {
  return `https://github.com/GTNewHorizons/GT-New-Horizons-Modpack/commits/${commit}/${gtnhConfigPath(filePath)}`;
}

function gtnhConfigUrl(commit: string, filePath: string): string {
  return `https://raw.githubusercontent.com/GTNewHorizons/GT-New-Horizons-Modpack/${commit}/${gtnhConfigPath(filePath)}`;
}

function gtnhConfigPath(filePath: string): string {
  if (!filePath.startsWith('.minecraft/')) {
    throw new Error('malformed filepath: ' + filePath);
  }
  return filePath.substring('.minecraft/'.length);
}

/**
 * Downloads and caches a file
 */
function load(url: string): Promise<DownloadOutcome> {
  let download = downloads.get(url);
  if (download === undefined) {
    download = limit(() => fetchConfig(url));
    downloads.set(url, download);
    download.catch(() => downloads.delete(url));
  }
  return download;
}

async function fetchConfig(url: string): Promise<DownloadOutcome> {
  for (let i = 0; i < 4; i++) {
    const response = await fetch(url);
    if (response.ok) {
      return { status: 'ok', text: await response.text() };
    }
    if (response.status === 408 || response.status === 429 || response.status >= 500) {
      console.log(`Failed to download [${url}]: ${response.statusText}, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * i * i + 1000));
      continue;
    }
    return { status: 'missing', httpStatus: response.status };
  }
  throw new Error(`Unable to reach [${url}]. Are you getting rate limited?`);
}

async function limit<T>(task: () => Promise<T>): Promise<T> {
  if (activeDownloads >= MAX_CONCURRENT_DOWNLOADS) {
    await new Promise<void>(resolve => waiting.push(resolve));
  }
  activeDownloads++;
  try {
    return await task();
  } finally {
    activeDownloads--;
    waiting.shift()?.();
  }
}
