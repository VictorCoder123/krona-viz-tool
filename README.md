## Krona Visualization Tool

### Description
`krona-viz-tool` is a tool used to create Krona HTML file for Meta-Genome data visualization.

### Get Started
* Install npm package `npm install krona-viz-tool` from command line.
* Import package in file to get processed HTML string or write to file system.
```javascript
var KronaGenerator = require('krona-viz-tool').KronaGenerator;
var KronaConvertor = require('krona-viz-tool').KronaConvertor;
// Specify the path of template and data file, otherwise use default.
var generator = new KronaGenerator(template, data);
// Get the content of generated HTML file.
var result = generator.generate();
// Write to given path, use default if not specified.
generator.writeSync(result_path);
```
* Run script from package to generate Krona HTML file, open `krona-viz-tool` directory inside `node_modules` folder and run script directly with command `node index.js` using default template, data and result path, or use your own by adding parameters with command `node index.js template_path data_path result_path`.

### Command line Usage
```bash
node index.js --template='path/to/templates/template.ejs'
              --data='path/to/data'
              --result_file='path/to/result'
              --filter=5
              --root_name='SomeName'
```
#### Parameters:
* -template <FILE> Path of template file to be used to create HTML, default template will be used if this arg is left empty.
* -data <FILE> Path of data file, a small txt file will be used for demo if this arg is left empty.
* -result_file <File> Path of the generated krona HTML file.
* -filter <INT> Minimum count for reads*weights.
* -root_name <String> Name of the root node.