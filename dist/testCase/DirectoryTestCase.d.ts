import BaseTest from "./BaseTest";
import TestCase from "./TestCase";
export default class DirectoryTestCase extends TestCase {
    private name;
    constructor(name: string);
    getName(): string;
    protected buildActions(): BaseTest[];
    toJson(): any;
}
