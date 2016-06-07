/**
 * Entry point for Krona-viz-tool package and the script can be used in
 * command line to directly generate Krona HTML file.
 *
 * Usage:
 *
 * node index.js --template='path/to/templates/template.ejs'
 *               --data='path/to/data'
 *               --result_file='path/to/result'
 *               --filter=5
 *               --root_name='SomeName'
 *
 * Parameters:
 *   -template <FILE> Path of template file to be used to create HTML, default template
 *   will be used if this arg is left empty.
 *   -data <FILE> Path of data file, a small txt file will be used for demo if this arg
 *   is left empty.
 *   -result_file <File> Path of the generated krona HTML file.
 *   -filter <INT> Minimum count for reads*weights.
 *   -root_name <String> Name of the root node.
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

// Import external dependencies
var parseArgs = require('minimist');

var KronaGenerator = require('./src/krona-generate.js');
var KronaConvertor = require('./src/krona-convert.js');

module.exports = {
  KronaGenerator: KronaGenerator,
  KronaConvertor: KronaConvertor
}

// Running this script
if(require.main === module){
  // Get all params
  //var argvs = process.argv.slice(2);
  var argvs = parseArgs(process.argv.slice(2));

  var template = argvs['template'];
  var data     = argvs['data'];
  var filter   = argvs['filter'];
  var result_file = argvs['result_file'];
  var root_name   = argvs['root_name'] || 'Unknown';

  var options = {
    'template': template, 'data': data, 'filter': filter, 'result_file': result_file,
    'root_name': root_name
  };

  // Create generator and write result to file system, if template and data
  // are not specified, then default files will be loaded.
  var generator = new KronaGenerator(options);
  var resultContent = generator.generate();
  //console.log(resultContent);
  generator.writeSync(result_file);
}