var React = require('react')
  , Header = require('./Header')
  , Diagram = require('./Diagram');

var Landing = React.createClass({

  getInitialState: function() {
    return null;
  },

  componentDidMount: function() {

  },

  render: function() {
    return (
      <div>
      <Header />
      <Diagram />
      </div> 
    );
  }
});

module.exports = Landing;
