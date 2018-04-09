import './TopDrawer.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Motion, spring } from 'react-motion';
import TwitterItem from './item/TwitterItem';
import MaterialIcon from 'material-icons-react';

let controller;
class TopDrawer extends Component {
  constructor(props){
    super(props);

    controller = this;
  }

  handleCollapse(){
    this.props.onTwitterDrawerCollapse();
  }

  render() {
    let classes = 'top-drawer ' + (this.props.visible ? 'visible' : '');
    return (
      <div className={ classes }>
        <div className="top-drawer-container">
          <div className="tweets">
            { this.props.tweets && this.props.tweets.statuses &&
              this.props.tweets.statuses.map(function(tweet,i){
              return <TwitterItem key={i} item={tweet}></TwitterItem>
            })}
          </div>
          { 
            !this.props.tweets || (this.props.tweets.statuses && this.props.tweets.statuses.length === 0) ? 
              <div className="no-results">No results for { this.props.query } found.</div> : <span />
          }
        </div>
        <div 
          className="handle"
          onClick={ this.handleCollapse.bind(this) }
        >
          <MaterialIcon icon="chevron_right" /> 
        </div>
        <div className="black-overlay"></div>
      </div>
    );
  }
}

export default TopDrawer;