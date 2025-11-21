import BaseTest from "./BaseTest";
import TestCase from "./TestCase";

export default class DirectoryTestCase extends TestCase {
  private name: string;

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
}
