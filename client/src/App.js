import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MainMap from './core/map/MainMap';
import ErrorDialog from './core/dialog/ErrorDialog';

let controller = this;
class App extends Component {
  constructor(props){
    super(props);
    controller = this;
    controller.state = {
      errorMessage: false
    }
  }

  onError( message ){
    controller.setState({
      errorMessage: message
    });
  }

  render() {
    return (
      <div className="App">
        <MainMap
          onError={ controller.onError.bind(this) }
        ></MainMap>
        <ErrorDialog
          message={ controller.state.errorMessage }
        ></ErrorDialog>
      </div>
    );
  }
}

export default App;
