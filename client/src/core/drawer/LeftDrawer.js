import './LeftDrawer.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Motion, spring } from 'react-motion';
import DrawerItem from './item/DrawerItem';

let controller;
class LeftDrawer extends Component {
  constructor(props){
    super(props);

    controller = this;
    this.state = {
      items: []
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleRelated = this.toggleRelated.bind(this);
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(nextProps){
    let items = Object.keys(nextProps.items).map(function(key){
      var item = nextProps.items[key];
      item.visible = item.visible ? item.visible : false;
      return item;
    });
    controller.setState({ items: items });
  }

  setWrapperRef(node){
    this.wrapperRef = node;
  }

  handleClickOutside(event){
    if(this.wrapperRef && !this.wrapperRef.contains(event.target) && this.props.visible){
      let refNode = event.target;
      let isTopDrawer = false;
      while(refNode){
        if(refNode.classList.contains('top-drawer')){
          isTopDrawer = true;
          break;
        }
        refNode = refNode.parentElement;
      }
      if(!isTopDrawer){
        this.props.onClickOutside();
      }
    }
  }

  toggleRelated(event, index){
    var items = controller.state.items;
    items[index].visible = !items[index].visible;
    controller.setState({items: items});
    event.stopPropagation();
  }

  render() {
    var classes = 'left-drawer ' + (this.props.visible ? 'visible' : '');
    return (
      <div className={ classes } ref={ this.setWrapperRef }>
        <div className="country">{ this.props.location }</div>
        {
          controller.state.items.map(function(item, i){
            return <DrawerItem onSelectItem={ controller.props.onSelectItem } toggleRelated={ controller.toggleRelated } key={ i } index={i} item={ item }></DrawerItem>;
          })
        }
      </div>
    );
  }
}

export default LeftDrawer;