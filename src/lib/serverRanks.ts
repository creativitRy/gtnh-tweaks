export class ServerRanks {
  private readonly data = new Map<string, Map<string, string>>();
  constructor(raw: string) {
    let group = undefined;
    const groupRegex = /\[([^\]]+)]/;
    for (let line of raw.split('\n')) {
      line = line.split('//', 2)[0];
      const match = line.match(groupRegex);
      if (match) {
        group = match[1];
        if (!this.data.has(group)) {
          this.data.set(group, new Map());
        }
        continue;
      }
      let [key, value] = line.split(':', 2);
      if (!key || !value) continue;
      key = key.trim();
      value = value.trim();
      if (!key || !value) continue;
      if (!group) throw new Error(`Invalid line in server ranks: ${line}`);
      this.data.get(group)!.set(key, value);
    }
  }

  generate(): string {
    let result = '// For more info visit https://github.com/GTNewHorizons/ServerUtilities';
    for (let [group, ranks] of this.data.entries()) {
      result += `\n\n[${group}]`;
      for (let [key, value] of ranks) {
        result += `\n${key}: ${value}`;
      }
    }
    return result;
  }

  patch(rankName: string | undefined, key: string, value: string | undefined) {
    if (rankName === undefined) {
      for (let ranks of this.data.values()) {
        if (value === undefined) {
          ranks.delete(key);
        } else {
          ranks.set(key, value);
        }
      }
    } else {
      if (!this.data.has(rankName)) {
        this.data.set(rankName, new Map());
      }
      const ranks = this.data.get(rankName)!;
      if (value === undefined) {
        ranks.delete(key);
      } else {
        ranks.set(key, value);
      }
    }
  }
}
