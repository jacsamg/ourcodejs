export class OakTree<Branches extends Record<string, string>> {
  constructor(
    public root: string,
    public trunk: string,
    public branches: Branches
  ) { }

  public getFullPath(path: string): string {
    return `${this.root}${this.trunk}${path}`;
  }

  public getFullPathWithArgs(path: string, ...args: string[]): string {
    for (const arg of args) {
      path = path.replace(/:\w+/, arg);
    }

    return this.getFullPath(path);
  }

  public getRouterPath(path: string): string {
    return this.getFullPath(path).substring(1); // Without slash ('/')
  }
}
