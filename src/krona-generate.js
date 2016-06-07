/**
 * This class is used to read template and data file from local
 * file system and generate result file, a writeSync() method
 * is provided to write result content to given path in local file
 * system.
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

var fs = require('fs');
var path = require('path');
var KronaConvert = require('./krona-convert.js');

/**
 * Constructor for KronaGenerator class
 * @params {Object} options  Options for KronaGenerator configuration
 */
var KronaGenerator = function (options) {
  // Set path with default value if not specified in params
  var templatePath = options.template || path.join(__dirname, './templates/krona.processed.html.ejs');
  var dataPath     = options.data || path.join(__dirname, './templates/data_example.txt');

  this.root_name = options.root_name;
  this.filter = options.filter;

  // Get template and data content
  this.templateContent = fs.readFileSync(templatePath, {'encoding': 'utf-8'});
  this.dataContent = fs.readFileSync(dataPath, {'encoding': 'utf-8'});
}

// KronaGenerator constructor method
KronaGenerator.prototype.constructor = KronaGenerator;

/**
 * Use KronaConvertor to get result content after conversion.
 * @return {String}
 */
KronaGenerator.prototype.generate = function () {
  // Create and use convertor to get result, root name and filter need be specified.
  var kronaConvertor = new KronaConvert(this.templateContent, this.root_name);
  var resultContent = kronaConvertor.convert(this.dataContent, this.filter);
  return resultContent;
}

/**
 * Invoke generate() method to get result and write to
 * given path in local file system.
 * @param  {String} resultPath
 * @return {void}
 */
KronaGenerator.prototype.writeSync = function (resultPath) {
  var resultContent = this.generate();
  this.resultPath = resultPath || path.join(__dirname, './result.html');
  fs.writeFileSync(this.resultPath, resultContent);
}

module.exports = KronaGenerator;