import BaseTest from "./BaseTest";
import TestCase from "./TestCase";

export default class Directory extends TestCase {


  private name: string;

  private map: { [key: string]: TestCase } = {};

  addChild(child: TestCase) {
    this.map[child.getTestId()] = child;
  }
  getChildren(): TestCase[] {
    return Object.values(this.map);
  }
  getChildById(id: string): TestCase {
    return this.map[id];
  }
  getDirectoryById(id: string): Directory {
    let ret = this.getChildById(id);
    if (ret instanceof Directory) {
      return ret;
    }
    return null;
  }

  constructor(name: string) {
    super();
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  protected buildActions(): BaseTest[] {
    return [];
  }

  toJson(): any {
    let json = super.toJson();
    json.type = 'directory';
    return json;
  }

  toString(): string {
    return `directory:${this.name}`;
  }
}
