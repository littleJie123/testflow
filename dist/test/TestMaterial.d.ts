import ITest from "../inf/ITest";
import TestCase from "../testCase/TestCase";
export default class extends TestCase {
    getActions(): ITest[];
    getName(): string;
}
