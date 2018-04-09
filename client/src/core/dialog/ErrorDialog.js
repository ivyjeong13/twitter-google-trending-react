import React, { Component } from 'react';
import './ErrorDialog.css';
import MaterialIcon from 'material-icons-react';

let controller;
let timer;
class ErrorDialog extends Component {
  constructor(props){
    super(props);
    controller = this;
    controller.state = {
      delay: 2000,
      visible: false
    };
  }

  componentDidMount(){
    controller.setTimer();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.message !== controller.props.message){
      controller.setTimer();
      controller.setState({ visible: true });
    }
  }

  setTimer(){
    if(timer !== null){
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(function(){
      controller.setState({ visible : false });
      timer = null;
    }.bind(controller), controller.state.delay);
  }

  componentWillUnmount(){
    clearTimeout(timer);
  }
  
  render() {
    let classes = 'error-dialog' + (this.state.visible ? ' visible ' : '' );
    return (
      <div className={ classes }>
        <MaterialIcon icon="report" /> 
        { this.props.message }
      </div>
    );
  }
}

export default ErrorDialog;
