import React, { Component } from 'react';
import './TwitterItem.css';
import Moment from 'react-moment';
import 'moment-timezone';
import MaterialIcon from 'material-icons-react';

let controller;
class TwitterItem extends Component {
  constructor(props){
    super(props);
    controller = this;
  }

  formatLongNumber(value, fixedDecimals) {
    if(value == 0) {
      return 0;
    }
    else
    {
      // hundreds
      if(value <= 999){
        return value;
      }
      // thousands
      else if(value >= 1000 && value <= 999999){
        return (value / 1000).toFixed(fixedDecimals) + 'K';
      }
      // millions
      else if(value >= 1000000 && value <= 999999999){
        return (value / 1000000).toFixed(fixedDecimals) + 'M';
      }
      // billions
      else if(value >= 1000000000 && value <= 999999999999){
        return (value / 1000000000).toFixed(fixedDecimals) + 'B';
      }
      else
        return value.toFixed(fixedDecimals);
    }
  }

  render() {
    let item = this.props.item;
    return (
      <div className="twitter-item">   
        <img src={ item.user.profile_image_url_https } />
        <div className="twitter-content">
          <div className="title">
            <strong>{ item.user.name }</strong> { item.user.verified && <MaterialIcon icon="verified_user" /> } <span>@{ item.user.screen_name }</span> 
            <div className="time-since">
              <Moment tz="America/New_York" fromNow>{ new Date(item.created_at) }</Moment>
            </div>
          </div>
          <div className="status">
            { item.text }
          </div>
          <div className="social">
            <div className="retweet"><MaterialIcon icon="favorite_border" /> { controller.formatLongNumber(item.retweet_count, 0) }</div>
            <div className="favorited"><MaterialIcon icon="autorenew" /> { controller.formatLongNumber(item.favorite_count, 0) }</div>
          </div>
        </div>
      </div>
    );
  }
}

export default TwitterItem;