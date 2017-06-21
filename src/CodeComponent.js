var React = require('react');
var createReactClass = require('create-react-class');

var CodeComponent = createReactClass({
  componentDidMount: function () {
    if (typeof Prism === 'undefined') {
      console.warn('You do not have Prism included as a global object');
      return;
    }
    Prism.highlightAll();
  },
  componentDidUpdate: function () {
    if (typeof Prism === 'undefined') {
      console.warn('You do not have Prism included as a global object');
      return;
    }
    Prism.highlightAll();
  },
  render: function () {
    return React.createElement('pre', {key: this.props.key},
      React.createElement('code', {
          ref: 'code',
          className: 'language-' + this.props.language
        }, this.props.code)
    );
  }
});

module.exports = CodeComponent;
