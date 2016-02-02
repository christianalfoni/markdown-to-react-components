require('./prism.css');
require('./prism.js');
var React = require('react');
var lib = require('markdown-to-react-components');
var DOM = React.DOM;

var HalfColumn = {
  width: '50%',
  verticalAlign: 'top',
  display: 'inline-block'
};

lib.configure({
  h1: React.createClass({
    render: function () {
      return DOM.h1({
        style: {color: 'red'}
      }, this.props.children)
    }
  })
});

var App = React.createClass({
  getInitialState: function () {
    return {
      tree: null
    };
  },
  onTextareaChange: function (event) {
    this.setState({
      tree: lib(event.target.value).tree
    });
  },
  render: function () {
    return DOM.div(null,
      DOM.div({
        style: HalfColumn
      }, this.state.tree),
      DOM.textarea({
        style: {
          width: 500,
          height: 500
        },
        onChange: this.onTextareaChange
      })
    );
  }
});

React.render(React.createElement(App), document.body);
