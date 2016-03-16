var React = require('react');
var PubSub = require('pubsub-js');

var EmojiBox = React.createClass({
  getInitialState: function(){
    return{
      emojiName: this.props.emoji,
      clazz: 'img_emoji',
      isDisabled: false
    };
  },
  onSet: function(){
    PubSub.publish('buttons', this.props.code);
  },
  changeClass: function(newClass, disabled){
      this.setState({clazz: newClass, isDisabled: disabled});
  },
  render: function(){
    return(
      <div onClick={this.props.clickEmoji}>
        <img className={this.state.clazz} src={this.props.route} data-toggle="tooltip" title={this.props.info}/>
      </div>
    );
  }
});

module.exports = EmojiBox;
