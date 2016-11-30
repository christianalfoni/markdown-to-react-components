# markdown-to-react-components
Convert markdown into react components

## Whats different?
There are several projects that claims to convert markdown using React, but that is not exactly right. They produce one single React component with some plain markdown converted HTML in it. They do not produce React components of the markdown syntax. **But this project does!**

## Features
- Converts markdown syntax to React components. It is a lot more performant on live changes
- Define your own components to be used as headers, lists etc.
- Code highlighting using Prism.js
- Also returns a TOC (Table Of Contents), based on headers used
- TOC and Header ids match so that you can use anchor links (&lt;a href="#my-heading&gt;My heading&lt;/a&gt;)

## Install
`npm install markdown-to-react-components`

## How to use
```js
import React from 'react';
import MTRC from 'markdown-to-react-components';

MTRC.configure({
  h1: React.createClass({
    render() {
      return <h1 id={this.props.id} style={{color: 'red'}}>{this.props.children}</h1>
    }
  })
});

const Editor = React.createClass({
  getInitialState() {
    return {
      content: null
    };
  },
  onTextareaChange(event) {
    this.setState({
      content: MTRC(event.target.value).tree
    });
  },
  render() {
    return (
      <div>
        <div>{this.state.content}</div>
        <textarea onChange={this.onTextareaChange}/>
      </div>
    );
  }
});

export default Editor;
```

## Code highlight
You will have to include the [Prism.js](https://prismjs.com/) library and its css manually in your project. Look in the example app to see how this is done.

```js

    ```javascript
    var foo = 'bar';
    ```

    ```html
    <h1>Hello world!</h1>
    ```

```
Supported languages can be found over at [prism.js](https://prismjs.com/).

## API

### Configure
Allows you to configure custom elements for your markdown.

```js
MTRC.configure({
  h1: React.createClass({
    render() {
      return <h1 style={{color: 'red'}}>{this.props.children}</h1>
    }
  })
});
```

- **h1**: this.props.children, this.props.id
- **h2**: this.props.children, this.props.id
- **h3**: this.props.children, this.props.id
- **h4**: this.props.children, this.props.id
- **blockquote**: this.props.children
- **hr**: -
- **ol**: this.props.children
- **ul**: this.props.children
- **p**: this.props.children
- **table**: this.props.children
- **tr**: this.props.children
- **th**: this.props.children
- **td**: this.props.children
- **td**: this.props.children
- **a**: this.props.children, this.props.href, this.props.title, this.props.target
- **strong**: this.props.children
- **em**: this.props.children
- **br**: -
- **del**: this.props.children
- **img**: this.props.src, this.props.alt
- **code**: this.props.language, this.props.code
- **codespan**: this.props.children

### Convert
```js
MTRC('# Hello there').tree // React virtual dom tree
MTRC('# Hello there').toc // [{children: [], level: 1, title: 'Hello there', id: 'hello-there'}]
```

## Run demo
- `npm install`
- `npm start`
- Go to: `http://localhost:8080/webpack-dev-server/bundle`
