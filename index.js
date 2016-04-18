var KronaGenerator = require('./src/krona-generate.js');

// Entry point for Krona-viz-tool package.
module.exports = {
  KronaGenerator: KronaGenerator
}

// Running this script
if(require.main === module){
  var generator = new KronaGenerator();
  var result = generator.generate();

  console.log(process.argv.slice(2));
  console.log(result);
}