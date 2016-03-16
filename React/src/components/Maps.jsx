/*
name: Maps
author: Juan Ortiz Jr.
project: Ubi
date: 03/March/2016
*/
var React = require('react');
var ReactDOM = require('react-dom');
var ReactGoogleMaps = require('react-google-maps');
var Modal = require('react-modal');
var GoogleMapsAPI = window.google.maps;
var Map = ReactGoogleMaps.Map;
var LatLng = GoogleMapsAPI.LatLng;
var Marker = ReactGoogleMaps.Marker;
var infowindow = new google.maps.InfoWindow();
var PubSub = require('pubsub-js');

var isTransition = document.cookie.replace(/(?:(?:^|.*;\s*)transitions\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var howManyMinutes = document.cookie.replace(/(?:(?:^|.*;\s*)minutes\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var newHowManyMinutes = 60000;


if(howManyMinutes == "0"){
  newHowManyMinutes = 60000;
}else if(howManyMinutes == "1"){
  newHowManyMinutes = 300000;
}else if(howManyMinutes == "2"){
  newHowManyMinutes = 600000;
}

//Component
var Maps = React.createClass({
  //Default props or variables to set into the map
  getInitialState: function(){
      return{
          markers: [],
          info: '',
          counter: 0,
          map: null,
          source: 'http://148.244.75.41:7080/points',
          positions: [],
          modalIsOpen: false,
          moveCamera: isTransition,
          selection: 'none'
      };
  },
  getDefaultProps: function () {
      return {
          initialZoom: 3,
          modifiedZoom: 15,
          latitude: 8.345513,
          longitude: -81.359785,
          interval : 30000,
          cameraInterval: newHowManyMinutes
      };
  },
  //Subscribe events asynchronously
  componentWillMount: function(){
    var pubsub_token = PubSub.subscribe('buttons', function(topic, type) {
       var url;
       if(type == "yellow"){
        url = "http://192.168.11.31:7080/points/?indicator_count=2&q=e";
       }else if(type == "red"){
          url = "http://192.168.11.31:7080/points/?indicator_count=3&q=gte";
       }else if(type == "blue"){
          url = "http://192.168.11.31:7080/points/?indicator_count=0&q=e";
       }else if(type == "norefe"){
          url = "http://192.168.11.31:7080/points/?overall_status=NO";
       }else if(type == "refe"){
          url = "http://192.168.11.31:7080/points/?overall_status=referenciable";
       }else if(type == "cues"){
          url = "http://192.168.11.31:7080/points/?overall_status=?";
       }else if(type == "proceso"){
          url = "http://192.168.11.31:7080/points/?overall_status=proceso";
       }else if(type == "all"){
         url = "http://192.168.11.31:7080/points";
       }
       //TODO
       this.clearMarkers();
       this.setState({source: url});
       this.getData();
   }.bind(this));
  },
  clearMarkers: function(){
    try{
      for (var i = 0; i < this.state.markers.length; i++) {
             this.state.markers[i].setMap(null);
      }
      this.setState({markers: []});
    }catch(err){}
  },
  //Unsubscribe events
  componentWillUnmount: function(){
    pubsub.unsubscribe(this.pubsub_token);
  },
  //This will run when DOM be ready
  componentDidMount: function (rootNode) {
      var mapOptions = {
          center: this.mapCenterLatLng(),
          zoom: this.props.initialZoom,
          disableDefaultUI: true
      },
      map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);
      this.setState({map: map});
      try{
        this.getData();
      }catch(err){
        this.getData();
      }

      if(this.state.moveCamera == "ON"){
        setInterval(this.changeCamera,this.props.cameraInterval);
      }else{
        setInterval(this.getUpdatedData, this.props.interval);
      }
  },
  getData: function(){
    var markerList = [], coordinatesList=[];
    this.serverRequest = $.get(this.state.source, function (result) {
        for(var i = 0; i < result.length; i++){
            var lat = result[i].latitude;
            var lng = result[i].longitude;
            var coordinates = [lat,lng];
            var hospital = result[i].name;
            var tickets = result[i].indicator_count;
            var routeToEmoji = this.getHappiness(result[i].overall_status);

            var info = "<h2>"+ result[i].name +
                "<img src='"+routeToEmoji+"' class='emoji'/></h2>";
                info += "<p><h5>Customer Success: </h5>"+ result[i].overall_status +" </p> ";
                if(!result[i].address.includes("-"))
                    info += "<p><h5>Dirección:</h5> "+ result[i].address +" </p> ";
                if(!result[i].contact.includes("-"))
                info += "<p><h5>Contacto: </h5>" + result[i].contact +" </p> ";
                if(!result[i].phone.includes("-"))
                info += "<p><h5>Teléfono: </h5>" + result[i].phone + " </p> ";

                info += "<p><h5>Tickets: </h5>" + result[i].indicator_count + " </p> ";
                info += "<ul>";

            if(result[i].indicator_count != 0){
                for(var j = 0; j < result[i].indicator_count; j++){
                    info += "<li><a href="+result[i].indicator_detail[j].url+" target='_blank'>"+result[i].indicator_detail[j].description+"</a></li>"
                }
            }
            info += "</ul>";
            markerList.push(this.createMarker(lat,lng, hospital,this.state.map, info, tickets));
            coordinatesList.push(coordinates);
        }
        this.setState({markers: markerList, positions: coordinatesList});
      }.bind(this));
  },
  getUpdatedData: function(){
    this.serverRequest = $.get(this.state.source, function (result) {
        var markerList = [];

          for(var i = 0; i < result.length; i++){
              var tickets = result[i].indicator_count;
              var routeToEmoji = this.getHappiness(result[i].overall_status);

              var info = "<h2>"+ result[i].name +
                  "<img src='"+routeToEmoji+"' class='emoji'/></h2>";
                  info += "<p><h5>Customer Success: </h5>"+ result[i].overall_status +" </p> ";
                  if(!result[i].address.includes("-"))
                      info += "<p><h5>Dirección:</h5> "+ result[i].address +" </p> ";
                  if(!result[i].contact.includes("-"))
                      info += "<p><h5>Contacto: </h5>" + result[i].contact +" </p> ";
                  if(!result[i].phone.includes("-"))
                      info += "<p><h5>Teléfono: </h5>" + result[i].phone + " </p> ";

                  info += "<p><h5>Tickets: </h5>" + result[i].indicator_count + " </p> ";
                  info += "<ul>";

                for(var j = 0; j < result[i].indicator_count; j++){
                    info += "<li><a href="+result[i].indicator_detail[j].url+" target='_blank'>"+result[i].indicator_detail[j].description+"</a></li>"
                }

              info += "</ul>";
              markerList.push(this.updateMarkers(this.state.map, info, i, tickets));
          }
          this.setState({markers: markerList});

      }.bind(this));
  },
  //Function that creates a marker on the map
  createMarker: function(lat,lng, hospital,map,info, tickets){
    var iconRoute = "";
    if(tickets == 0){
        iconRoute="icons/blue.png";
    }else if(tickets <= 2){
        iconRoute="icons/yellow.png";
    }else if(tickets >= 3){
        iconRoute="icons/red.png";
    }
    var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          title: hospital,
          icon: iconRoute,
          animation: google.maps.Animation.DROP,
          map: map
    });
    marker.addListener('click', function() {
      infowindow.setContent(info);
      infowindow.open(map, marker);
    });
    return marker;
  },
  //Function that returns latitude and longitude google coordinates
  mapCenterLatLng: function () {
    return new google.maps.LatLng(this.props.latitude, this.props.longitude);
  },
  updateMarkers: function(map, info, position, tickets){
      var mark = this.state.markers[position];
      var iconRoute = "";
      if(tickets == 0){
          iconRoute="icons/blue.png";
      }else if(tickets <= 2){
          iconRoute="icons/yellow.png";
      }else if(tickets >= 3){
          iconRoute="icons/red.png";
      }
      mark.setIcon(iconRoute);
      mark.addListener('click', function() {
        infowindow.setContent(info);
        infowindow.open(map, mark);
      });
      return mark;
  },
  changeCamera: function(){
    this.getUpdatedData();
    var map = this.state.map;
    var counter = this.state.counter;

    map.setCenter(new google.maps.LatLng(this.state.positions[counter][0],this.state.positions[counter][1]));
    map.setZoom(this.props.modifiedZoom);

    counter++;
    if(counter >= this.state.positions.length){
        this.setState({counter: 0});
    }else{
        this.setState({counter: counter});
    }
  },
  getHappiness: function(status){
    var routeToEmoji = "";
    if (status.includes("?")) {
      routeToEmoji = "icons/cues.png";
    }else if (status.includes("proceso")) {
      routeToEmoji = "icons/proceso.png";
    }else if (status.includes("NO")) {
      routeToEmoji = "icons/norefe.png";
    }else if (status.includes("referenciable")) {
      routeToEmoji = "icons/refe.png";
    }
    return routeToEmoji;
  },
  //Render
  render: function () {
        return (
            <div className='map-gic'></div>
        );
    }
});

module.exports = Maps;
