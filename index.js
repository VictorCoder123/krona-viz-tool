/**
 * Entry point for Krona-viz-tool package.
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

var KronaGenerator = require('./src/krona-generate.js');
var KronaConvertor = require('./src/krona-convert.js');

module.exports = {
  KronaGenerator: KronaGenerator,
  KronaConvertor: KronaConvertor
}

// Running this script
if(require.main === module){
  // Get all params
  var argvs = process.argv.slice(2);
  var template = argvs[0], data = argvs[1], result = argvs[2];

  // Create generator and write result to file system, if template and data
  // are not specified, then default files will be loaded.
  var generator = new KronaGenerator(template, data);
  var resultContent = generator.generate();
  console.log(resultContent);
  generator.writeSync(result);
}