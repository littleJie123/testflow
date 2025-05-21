import TestRunner from "./testRunner/TestRunner";
import path from 'path';
let testRunner = TestRunner.get();
testRunner.regEnvConfig('local',{
  host:'http://127.0.0.1:8080/'
})
testRunner.start({
  testPath:path.join(__dirname,'./test')
})