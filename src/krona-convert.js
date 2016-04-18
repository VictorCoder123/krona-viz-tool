/**
 * This is a Class used to generate processed HTML string based on
 * the template passed into constructor as parameter, you can also
 * use customized template with <% KronaXML %> inside to be replaced
 * in EJS processing.
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

var $ = require('jquery');

var KronaConvert = function (kronaTemplate) {
    var mainNodeString = '<node name="Grenanda RNA no rRNA"></node>';
    this.xml = $.parseXML(mainNodeString);
    this.$xml = $(this.xml);
    this.kronaTemplate = kronaTemplate;
  }

  // KronaConvert constructor method
  KronaConvert.prototype.constructor = KronaConvert;

  /**
   * Convert plain text into XML and insert into HTML template.
   * @param  {string} data
   * @return {string}      String of whole html file
   */
  KronaConvert.prototype.convert = function (data) {
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
    var result = ejs.render(this.kronaTemplate, {
      KronaXML: xmlString
    });
    return result;
  }

  /**
   * Helper method to convert single line into main XML
   * @param {Array} words  A list of names and attributes
   */
  KronaConvert.prototype.add = function (words) {
    var self = this;
    var magnitude = parseInt(words[1]);
    var list = words.slice(2);
    var main_node = this.$xml.children('node').first();
    var parent_node = main_node;
    list.forEach(function(item){
      self.updateValue(parent_node, magnitude);
      var child_node = parent_node.children('[name="' + item + '"]').first();
      // Create new node if name doesn't match in current level
      if(child_node.length === 0){
        var new_node = $('<node>none</node>').attr('name', item);
        parent_node.append(new_node);
        parent_node = new_node;
      }
      else{
        parent_node = child_node;
      }
    });
    self.updateValue(parent_node, magnitude);
  }

  /**
   * Set value if attribute magnitude does not exist, otherwise
   * add it to old value and update magnitude attribute.
   * @param  {Object} node
   * @param  {Integer} value
   * @return {void}
   */
  KronaConvert.prototype.updateValue = function (node, value) {
    // Create new magnitude value if not existing.
    if(node.children('magnitude').length === 0){
      var new_magnitude = $('<magnitude><val>none</val></magnitude>');
      node.append(new_magnitude);
      node.children('magnitude').first().children('val').first().text(value);
    }
    else{
      var val_node = node.children('magnitude').first().children('val').first();
      var old_value = parseInt(val_node.text());
      val_node.text(old_value + value);
    }
  }

  module.exports = KronaConvert;