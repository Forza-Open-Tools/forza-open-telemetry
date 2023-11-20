export class PropertyToIndexMap {
  byNameMap: Record<string, number> = {};
  byIndexMap: Record<number, string> = {};

  constructor(propertyNames: string[]) {
    propertyNames.forEach((name, index) => {
      this.byIndexMap[index] = name;
      this.byNameMap[name] = index;
    })
  }

  indexOf(name: string): number {
    return this.byNameMap[name];
  }

  nameOf(index: number): string {
    return this.byIndexMap[index];
  }
}
