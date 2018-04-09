import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Graticule,
} from 'react-simple-maps';
import { Motion, spring } from 'react-motion';
import * as CENTROIDS from '../constants/centroids';
import * as COUNTRIES from '../constants/countries';
import LeftDrawer from '../drawer/LeftDrawer';
import TopDrawer from '../drawer/TopDrawer';

let controller;
class MainMap extends Component {
  constructor(props){
    super(props);
    controller = this;
    controller.state = {
      mapHeight : 0,
      zoomCenter: [0, 0],
      zoomLevel: 1,
      items: {},
      showDrawer: false,
      tweets: [],
      showTwitter: false,
      query: '',
      selected: false
    };
  }

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions(){
    controller.setState({ mapHeight : window.innerHeight });
  }

  handleClick(geography, event){
    var googleId = COUNTRIES.trendingCountries[geography.id] ? COUNTRIES.trendingCountries[geography.id] : false;
    if(googleId){
      controller.callApi(googleId)
        .then(function( res ){
          let match = CENTROIDS.centroids.filter(function(item){
            return item.name.toLowerCase() === geography.properties.name.toLowerCase();
          });

          let position = match.length ? [match[0].long, match[0].lat] : [0, 0];
          let zoomLevel = match.length ? 3 : 1;

          controller.setState({ items: res, showDrawer: true, zoomCenter: position, zoomLevel: zoomLevel, selected: geography.id });
        })
        .catch(err => console.log(err));
    } else {
      controller.setState({ items: {}, selected: false });
      controller.props.onError( geography.properties.name + ' does not have an associated Google Trending ID.');
    }
  }

  handleClickOutside(){
    controller.setState({ showDrawer: false, zoomCenter: [0, 0], zoomLevel: 1, selected: false });
  }

  handleTwitterDrawerCollapse(){
    controller.setState({ showTwitter: false });
  }

  handleSelectedItem(event, item){
    controller.setState({ showTwitter: false, query: '' });
    const query = item.title.join(' ');
    controller.callTwitter(query)
      .then(res => controller.setState({ tweets: res, showTwitter: true, query: query }))
      .catch(err => console.log(err));
    event.preventDefault();
  }

  callTwitter = async (query) => {
    const response = await fetch('/api/getpopulartweets/' + query);
    const body = await response.json();

    if(response.status !== 200) throw Error(body.message);
    return body;
  };

  callApi = async (countryId) => {
    const response = await fetch('/api/trending/' + countryId);
    const body = await response.json();

    if(response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    return (
      <div className="main-map-wrapper">
        <LeftDrawer
          items={ this.state.items }
          visible={ this.state.showDrawer }
          onClickOutside={ this.handleClickOutside.bind(this) }
          onSelectItem={ this.handleSelectedItem.bind(this) }
        ></LeftDrawer>
        <TopDrawer
          tweets={ this.state.tweets }
          visible={ this.state.showTwitter }
          query={ this.state.query }
          onTwitterDrawerCollapse={ this.handleTwitterDrawerCollapse.bind(this) }
        >
        </TopDrawer>
        <Motion
          defaultStyle={{
            zoom: 1,
            x: 0,
            y: 0
          }}

          style={{
            zoom: spring(this.state.zoomLevel, { stiffness: 210, damping: 20 }),
            x: spring(this.state.zoomCenter[0], { stiffness: 210, damping: 20}),
            y: spring(this.state.zoomCenter[1], { stiffness: 210, damping: 20}),
          }}
        >
        {({zoom, x, y }) => (
          <ComposableMap
            projectionConfig={{ rotation: [0, 0, 0]}}
            style={{
              width: '100%',
              height: "auto"
            }}
          >
            <ZoomableGroup 
              center={[x, y]} 
              zoom={ zoom }
              disablePanning={true}
            >
              <Geographies
                geography={process.env.PUBLIC_URL + '/json/world-50m.json'}
              >
                {(geographies, projection) => geographies.map((geography, i) => (
                  <Geography
                    key={i}
                    onClick={this.handleClick.bind(this)}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: COUNTRIES.trendingCountries[geography.id] ? "#8fa4ad" : "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.50,
                        outline: "none",
                      },
                      hover: {
                        fill: COUNTRIES.trendingCountries[geography.id] ? "#607D8B" : "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.50,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#435761",
                        stroke: "#607D8B",
                        strokeWidth: 0.50,
                        outline: "none",
                      },
                    }}
                  />
                ))}
              </Geographies>
              <Graticule />
            </ZoomableGroup>
          </ComposableMap>
        )}
        </Motion>
      </div>
    );
  }
}

export default MainMap;
