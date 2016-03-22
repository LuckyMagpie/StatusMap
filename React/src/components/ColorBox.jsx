var React = require('react');
var PubSub = require('pubsub-js');

var ColorBox = React.createClass({
  getInitialState: function(){
    return{
       color: this.props.color,
       clazz: 'colorBox',
       status: 'off',
       isDisabled: false
    };
  },
  changeClass: function(newClass, disabled){
      this.setState({clazz: newClass, isDisabled: disabled});
  },
  onSet: function(){
    PubSub.publish('buttons', this.props.code);
  },
  /*clickColor: function(){

  },*/
  render: function(){
    return(
      <div onClick={this.props.clickColor}>
        <img src={this.props.route} data-toggle="tooltip" title={this.props.info} className={this.state.clazz} />
      </div>
    );
  }
});

module.exports = ColorBox;
