import React, { Component } from 'react';
import './RelatedItem.css';

let controller;
class RelatedItem extends Component {
  constructor(props){
    super(props);
    controller = this;
  }

  render() {
    return (
      <div className="related-item">   
        <span className="source" dangerouslySetInnerHTML={{ __html: this.props.item['ht:news_item_source'][0] }}></span>
        <span className="title" dangerouslySetInnerHTML={{ __html: this.props.item['ht:news_item_title'][0] }}></span>
      </div>
    );
  }
}

export default RelatedItem;