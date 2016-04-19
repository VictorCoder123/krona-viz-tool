/**
 * This is a Class used to generate processed HTML string based on
 * the template passed into constructor as parameter, you can also
 * use customized template with <% KronaXML %> inside to be replaced
 * in EJS processing.
 *
 * Change to use "xmldom" to parse XML instead jQuery as XML parsing is not
 * supported in node.js version of jQuery
 *
 * @author Qishen  https://github.com/VictorCoder123
 */

// Load dependencies for conversion
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var ejs = require('ejs');
var _ = require('lodash');

var KronaConvert = function (kronaTemplate) {
    var mainNodeString = '<node name="Grenanda RNA no rRNA"></node>';
    var parser = new DOMParser();
    this.$xml = parser.parseFromString(mainNodeString);
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
    var xmlString = serializer.serializeToString(this.$xml);
    var result = ejs.render(this.kronaTemplate, {
      KronaXML: xmlString
    });
    return result;
  }

  /**
   * Helper method for xmldom to filter nodes with given attribute
   * @param  {XMLNode} node
   * @param  {String}  attr
   * @param  {String}  value
   * @return {List}    list of nodes
   */
  KronaConvert.prototype.childrenByAttribute = function (node, attr, value) {
    var nodes = node.getElementsByTagName('node');
    var result = [];
    for(var i=0; i<nodes.length; i++){
      var child = nodes[i];
      //console.log(child.documentElement);
      //console.log(child.getAttribute(attr) == value);
      if(child.getAttribute(attr) === value)
        result.push(child.ownerDocument);
    }
    //console.log(result.length);
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
    var main_node = this.$xml.getElementsByTagName('node')[0].ownerDocument;
    var parent_node = main_node;

    list.forEach(function(item){
      self.updateValue(parent_node, magnitude);
      var child_nodes = self.childrenByAttribute(parent_node, 'name', item);
      // Create new node if name doesn't match in current level
      if(child_nodes.length === 0){
        var new_node = self.$xml.createElement('node');
        new_node.setAttribute('name', item);
        parent_node.appendChild(new_node);
        parent_node = new_node;
      }
      else{
        parent_node = child_nodes[0];
      }
    });
    this.updateValue(parent_node, magnitude);
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
    if(node.getElementsByTagName('magnitude').length === 0){
      var mag_node = this.$xml.createElement('magnitude');
      var val_node = this.$xml.createElement('val');
      var text_node = this.$xml.createTextNode(value.toString());
      val_node.appendChild(text_node);
      mag_node.appendChild(val_node);
      node.appendChild(mag_node);
    }
    else{
      var mag_node = node.getElementsByTagName('magnitude')[0].ownerDocument;
      var val_node = mag_node.getElementsByTagName('val')[0];
      var old_value = parseInt(val_node.childNodes[0].nodeValue);
      val_node.childNodes[0].nodeValue = (old_value + value).toString();
    }
  }

  module.exports = KronaConvert;