var React = require('react');
var ReactDOM = require('react-dom');
var Maps = require('./components/Maps.jsx');
var Box = require('./components/Box.jsx');

ReactDOM.render(<Maps/>,document.getElementById('main'));
ReactDOM.render(<Box/>, document.getElementById('floating'));
