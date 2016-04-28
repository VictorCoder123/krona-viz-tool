/**
 * KronaGenerator Class is used to generate Krona HTML file based on
 * string input.
 *
 * Note that input string is not validated in this class
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

define([
  'common/util/ejs'
  ], function(
  ejs){

  var KronaGenerator = function (template) {
    var mainNodeString = '<node name="Grenanda RNA no rRNA"></node>';
    this.xml = $.parseXML(mainNodeString);
    this.$xml = $(this.xml);
    this.kronaTemplate = template;
  }
  // KronaGenerator constructor method
  KronaGenerator.prototype.constructor = KronaGenerator;

  /**
   * Convert plain text into XML and insert into HTML template.
   * @param  {string}  data
   * @params {Integer} threshold   minimum value for filtering
   * @return {string}              String of whole html file
   */
  KronaGenerator.prototype.convert = function (data, threshold) {
    var self = this;
    var serializer = new XMLSerializer();
    var re = /\S+/g; // Match all non-space strings
    var lines = data.split('\n');
    lines.forEach(function(line){
      var words = line.match(re);
      if(words !== null) self.add(words);
    });
    // Convert xml into string text and insert into ejs template
    var xmlString = serializer.serializeToString(this.$xml.children('node').get(0));
    console.log(xmlString);
    var result = ejs.render(this.kronaTemplate, {
      KronaXML: xmlString
    });
    return result;
  }

  /**
   * Helper method to convert single line into main XML
   * @param {Array} words  A list of names and attributes
   */
  KronaGenerator.prototype.add = function (words, threshold) {
    var self = this;
    threshold = threshold || 1000;
    var magnitude = parseInt(words[1]);
    var score = 1 - parseFloat(words[4]);

    // Filter out small reads under threshold
    if(magnitude < threshold) return;

    var list = words.slice(5);

    //console.log(list);

    var main_node = this.$xml.children('node').first();
    var parent_node = main_node;
    list.forEach(function(item){
      self.updateValue(parent_node, magnitude, score);
      var child_node = parent_node.children('[name="' + item + '"]').first();
      // Create new node if name doesn't match in current level
      if(child_node.length === 0){
        var new_node = $('<node></node>').attr('name', item);
        parent_node.append(new_node);
        parent_node = new_node;
      }
      else{
        parent_node = child_node;
      }
    });
    self.updateValue(parent_node, magnitude, score);
  }

  /**
   * Set value if attribute magnitude does not exist, otherwise
   * add it to old value and update magnitude attribute.
   * @param  {Object} node
   * @param  {Integer} magValue
   * @params {Integer} scoreValue
   * @return {void}
   */
  KronaGenerator.prototype.updateValue = function (node, magValue, scoreValue) {
    // Create new magnitude value if not existing.
    if(node.children('magnitude').length === 0){
      console.log(scoreValue);
      var new_magnitude = $('<magnitude><val>' + magValue + '</val></magnitude>');
      var new_score = $('<score><val>' + scoreValue + '</val></score>');
      node.append(new_magnitude);
      node.append(new_score);
      //node.children('magnitude').first().children('val').first().text(value);
    }
    else{
      var val_node = node.children('magnitude').first().children('val').first();
      var old_value = parseInt(val_node.text());
      val_node.text(old_value + magValue);
    }
  }

  return KronaGenerator;
});