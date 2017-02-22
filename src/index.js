var React = require('react');
var marked = require('marked');
var he = require('he');
var CodeComponent = React.createFactory(require('./CodeComponent.js'));
var renderer = new marked.Renderer();
var options = {};
var inlineIds = 0;
var keys = 0;
var inlines = {};
var result = [];
var toc = [];

// Converts inline IDs to actual elements
var createBlockContent = function (content) {
  var textWithInlines = content.split(/(\{\{.*?\}\})/);
  content = textWithInlines.map(function (text) {
    var inline = text.match(/\{\{(.*)\}\}/);
    if (inline) {
      return inlines[inline[1]];
    } else {
      return he.decode(text);
    }
  });
  return content;
};

var getTocPosition = function (toc, level) {
  var currentLevel = toc.children;
  while (true) {
    if (!currentLevel.length || currentLevel[currentLevel.length - 1].level === level) {
      return currentLevel;
    } else {
      currentLevel = currentLevel[currentLevel.length - 1].children;
    }
  }
};

renderer.code = function (code, language) {
  var props = {
    key: keys++,
    language: language,
    code: code
  };

  if (options.code) {
    result.push(React.createElement(options.code, props));
  } else {
    result.push(CodeComponent(props));
  }
};

renderer.blockquote = function (text) {
  var count = text.split(/(\{\{.*?\}\})/).filter(function(n){ return n != ""});
  
  count.forEach(function(){
    result.pop();
  });
  
  result.push(React.createElement(options.blockquote || 'blockquote', {key: keys++}, createBlockContent(text)));
};

renderer.html = function (html) {
    result.push(React.createElement(options.html || React.createClass({
        render: function render () {
            return React.createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: this.props.html
                }
            });
        }
    }), {
        html: html
    }));
};

renderer.heading = function (text, level) {
  var type = 'h' + level;
  type = options[type] || type;
  var id = text.replace(/\s/g, '-').toLowerCase();
  var lastToc = toc[toc.length -1];
  if (!lastToc || lastToc.level > level) {
    toc.push({
      id: id,
      title: text,
      level: level,
      children: []
    });
  } else {
    var tocPosition = getTocPosition(lastToc, level);
    tocPosition.push({
      id: id,
      title: text,
      level: level,
      children: []
    });
  }
  var inId = inlineIds++;
  inlines[inId] = React.createElement(type, {
    key: keys++,
    id: id
  },
    createBlockContent(text));
  result.push(inlines[inId]);
  return '{{' + inId + '}}';
};

renderer.hr = function () {
  result.push(React.createElement(options.hr || 'hr', {key: keys++}));
};

renderer.list = function (body, ordered) {
  var id = inlineIds++;
  inlines[id] = React.createElement(ordered ? options.ol || 'ol' : options.ul || 'ul', {key: keys++}, createBlockContent(body));
  result.push(inlines[id]);
  return '{{' + id + '}}';

};

renderer.listitem = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.li || 'li', {key: keys++}, createBlockContent(text));
  return '{{' + id + '}}';
};

renderer.paragraph = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.p || 'p', {key: keys++}, createBlockContent(text));
  result.push(inlines[id]);
  return '{{' + id + '}}';
};

renderer.table = function (header, body) {
  var id = inlineIds++;
  inlines[id] =  React.createElement(options.table || 'table', {key: keys++},
    createBlockContent(header),
    createBlockContent(body)
  );
  result.push(inlines[id]);
  return '{{' + id + '}}';
};

renderer.tablerow = function (content) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.tr || 'tr', {key: keys++}, createBlockContent(content));
  return '{{' + id + '}}';
};

renderer.tablecell = function (content, flags) {
  var id = inlineIds++;
  var props =  flags.align ? {className: 'text-' + flags.align} : {key: keys++};
  inlines[id] = React.createElement(flags.header ? options.th || 'th' : options.td || 'td', props, createBlockContent(content));
  return '{{' + id + '}}';
};

renderer.link = function (href, title, text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.a || 'a', {
    href: href,
    title: title,
    key: keys++,
    target: 'new'
  }, createBlockContent(text));
  return '{{' + id + '}}';
};

renderer.strong = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.strong || 'strong', {key: keys++}, createBlockContent(text));
  return '{{' + id + '}}';
};

renderer.em = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.em || 'em', {key: keys++}, createBlockContent(text));
  return '{{' + id + '}}';
};

renderer.codespan = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.codespan || 'code', {key: keys++}, he.decode(text));
  return '{{' + id + '}}';
};

renderer.br = function () {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.br || 'br', {key: keys++});
  return '{{' + id + '}}';
};

renderer.del = function (text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.del || 'del', {key: keys++}, he.decode(text));
  return '{{' + id + '}}';
};

renderer.image = function (href, title, text) {
  var id = inlineIds++;
  inlines[id] = React.createElement(options.img || 'img', {src: href, alt: title, key: keys++});
  return '{{' + id + '}}';
};

var exec = function (content) {
  result = [];
  toc = [];
  inlines = {};
  keys = 0;
  marked(content, {renderer: renderer, smartypants: true});
  return {
    tree: result,
    toc: toc
  };
};

exec.configure = function (newOptions) {
  options = newOptions;
};

module.exports = exec;
