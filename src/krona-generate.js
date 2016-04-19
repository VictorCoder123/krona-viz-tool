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
 * @param {String} template  Path for template in file system
 * @param {String} data      Path for data in file system
 */
var KronaGenerator = function (template, data) {
  // Set path with default value if not specified in params
  var templatePath = template || path.join(__dirname, './templates/krona.processed.html.ejs');
  var dataPath = data || path.join(__dirname, './templates/data_example.txt');

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
  // Use convertor to get result
  var kronaConvertor = new KronaConvert(this.templateContent);
  var resultContent = kronaConvertor.convert(this.dataContent);
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