import './DrawerItem.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Motion, spring } from 'react-motion';
import RelatedItem from './RelatedItem';
import MaterialIcon from 'material-icons-react';

class DrawerItem extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var relatedClasses = "related " + (this.props.item.visible ? 'visible' : '');
    return (
      <div className="drawer-item" onClick={ (e) => this.props.onSelectItem(e, this.props.item) }>
        <div>
          <img src={ this.props.item['ht:picture'][0] }/>
          <div className="drawer-container">
            <h3>{ this.props.item.title } 
              <span onClick={ (e) => this.props.toggleRelated(e, this.props.index) }>
              {  this.props.item.visible ? 
                  <MaterialIcon icon="expand_less" /> :
                  <MaterialIcon icon="expand_more" />
              }
              </span>
            </h3>
          </div>
        </div>
        <div className={ relatedClasses }>
          { this.props.item['ht:news_item'].map(function(newsItem,i){
            return <RelatedItem key={i} item={newsItem}></RelatedItem>
          })}
        </div>
      </div>
    );
  }
}

export default DrawerItem;