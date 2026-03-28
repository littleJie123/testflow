import BaseTest from "./BaseTest";
import TestCase from "./TestCase";
export default class Directory extends TestCase {
    private name;
    private map;
    addChild(child: TestCase): void;
    getChildren(): TestCase[];
    getChildById(id: string): TestCase;
    getDirectoryById(id: string): Directory;
    constructor(name: string);
    getName(): string;
    protected buildActions(): BaseTest[];
    toJson(): any;
    toString(): string;
}
