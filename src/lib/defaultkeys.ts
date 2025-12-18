export class DefaultKeys {
  private readonly data = new Map<string, number>();
  constructor(raw: string = '') {
    for (const line of raw.split('\n')) {
      let [key, value] = line.split(':', 2);
      if (!key || !value) continue;
      key = key.trim();
      value = value.trim();
      if (!key || !value) continue;
      this.data.set(key, parseInt(value));
    }
  }

  generate(): string {
    let result = '';
    for (const key of [...this.data.keys()].sort()) {
      result += `${key}:${this.data.get(key)}\n`;
    }
    return result;
  }

  patch(key: string, value: number | undefined) {
    if (value === undefined) {
      this.data.delete(key);
    } else {
      this.data.set(key, value);
    }
  }
}
