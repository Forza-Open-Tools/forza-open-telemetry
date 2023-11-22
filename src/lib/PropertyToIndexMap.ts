export class PropertyToIndexMap {
  byNameMap: Record<string, number> = {};
  byIndexMap: Record<number, string> = {};

  constructor(private propertyNames: string[]) {
    propertyNames.forEach((name, index) => {
      this.byIndexMap[index] = name;
      this.byNameMap[name] = index;
    })
  }

  get length() {
    return this.propertyNames.length;
  }

  indexOf(name: string): number {
    return this.byNameMap[name];
  }

  nameOf(index: number): string {
    return this.byIndexMap[index];
  }
}
