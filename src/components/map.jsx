import React from 'react';
import L from 'leaflet';
import accessToken from '../config/access_token.js'
import DatePicker from '../components/date-picker'
import '../assets/css/map.css'
import { runInThisContext } from 'vm';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      baseLayer: null,
      tileLayer: null,
      layersControl: null,
      tile_url: null,
      info_url: null,
      baseUrl: "https://api2.terravion.com",
      userId: '5bad4dfa-7262-4a0a-b1e5-da30793cec65',
      blockId: '48ed28ca-d272-4d1f-bfe0-cb95b61eecbc',
      product: "NC",
      epochStart: 0,
      epochEnd: 0,
      firstEpoch: 0,
      dates: [],
      info: null
    }

    this.captureEpochs = this.captureEpochs.bind(this);
    this.getTiles = this.getTiles.bind(this);
    this.initMap = this.initMap.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  getDate(startDate, endDate) {
    startDate = startDate.getTime() / 1000;
    endDate = endDate.getTime() / 1000;
    this.setState({epochStart: startDate, epochEnd: endDate})
    this.getTiles();
  }


  getTiles() {
    var epochStart = this.state.epochStart;  //smaller
    var epochEnd = this.state.epochEnd;  //larger
    var tileUrl = `${this.state.baseUrl}/users/${this.state.userId}`
    tileUrl += '/{z}/{x}/{y}.png'
    tileUrl += `?epochStart=${this.state.epochStart}&epochEnd=${this.state.epochEnd}`
    tileUrl += `&access_token=${accessToken}`
    tileUrl += `&product=${this.state.product}`
    this.setState({ 'tile_url': tileUrl });
  }

  captureEpochs() {
    var that = this;
    var layersEndpoint = `${this.state.baseUrl}/layers/getLayersFromBlockId?`
    layersEndpoint += `blockId=${this.state.blockId}`
    layersEndpoint += `&access_token=${accessToken}`
    console.log('testing');

    fetch(layersEndpoint)
      .then(response => response.json())
      .then(function(json) {
        var parseDates = json.map(layer => layer.layerDateEpoch * 1000);
        that.setState({
          dates: parseDates,
          data: json,
          firstEpoch: parseDates.slice(-1)[0],
          epochStart: parseDates.slice(-1)[0],
          epochEnd: parseDates[0]
        })
        that.getTiles();
      });
  }

  getInfo() {
    var infoEndpoint = `${this.state.baseUrl}/userBlocks/getUserBlocksForMap?`
    infoEndpoint += `userId=${this.state.userId}`
    infoEndpoint += `&access_token=${accessToken}`
    console.log(infoEndpoint);
    fetch(infoEndpoint)
      .then(response => response.json())
      .then(json => {
        var currBlockId = this.state.blockId;
        var plotInfo = null;
        for(var i = 0; i < json.length; i++) {
          var plotData = json[i];
          if(plotData.blockId === currBlockId) {
            plotInfo = {
              geom: JSON.parse(plotData.geom),
              farm: plotData.farm,
              field: plotData.field
            }
            this.setState({info: plotInfo});
            break;
          }
        }
      });



  }

  initMap() {
    var map = L.map('map').setView([38.540580, -121.877271], 15)
    var layersControl = L.control.layers();
    var baseLayer = L.layerGroup();
    var tileLayer = L.layerGroup();

    var imageTile = "https://api.tiles.mapbox.com/v2/"
    imageTile += "cgwright.ca5740e5/{z}/{x}/{y}.jpg"

    var mapbox_Layer = L.tileLayer(imageTile, {
      drawControl: false,
      maxZoom: 22,
      maxNativeZoom: 19
    })

    baseLayer.addLayer(mapbox_Layer);
    baseLayer.addTo(map);
    this.setState({map, baseLayer, tileLayer, layersControl})
  }

  updateMap() {
    if(this.state.tile_url !== null) {
      var nc_layer = L.tileLayer(this.state.tile_url, {
        attribution: 'TerrAvion',
        maxZoom: 19,
        tms: true
      })

      this.state.tileLayer.clearLayers();
      this.state.tileLayer.addLayer(nc_layer)
      this.state.tileLayer.addTo(this.state.map)
    }
  }

  componentDidMount() {
    this.captureEpochs();
    this.getInfo();
    this.initMap();

  }

  componentDidUpdate() {
    console.log("update")
    this.updateMap();
  }

  render() {
    return (
      <>

        <div id="map"></div>
        <DatePicker
          getDate={this.getDate}
          dates={this.state.dates.map(date => new Date(date))}
          firstEpoch={this.state.firstEpoch}
        />
        {/* <Details info={this.state.info}/> */}
      </>
    )
  }
}
