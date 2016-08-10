define([
], function() {

  var environment = "PRODUCTION";

  var configByEnv = {
    DEVELOPMENT: {
      environment: "DEVELOPMENT",
      servicePath: "http://192.168.1.18:8080/"
    },
    PRODUCTION: {
      environment: "PRODUCTION",
      servicePath: "http://api.contamadrid.es/"
    }
  };

  var config = {

    //Mockups
    enableMockups: false,

    //router
    defaultView: "home",

    //Images
    defaultImage: "resources/images/default.jpg",

    //SPLASH
    splash_loadInterval: 1, //dias

    //fadein | slide | newspaper | fall
    //sidefall | blur | flip | sign | superscaled
    //slit | rotate | letmein | makeway | slip
    //corner | slidetogether | scale | door
    //push | contentscale | swell | rotatedown | flash
    splash_popupEffect: "fadein",

    //HOME
    home_dateRange: 1, //dias
    home_mapOptions: {
      center: [40.4383173, -3.6984889], //lat, lng
      zoom: 12
    },
    home_tileLayerUrl: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png',
    home_tileLayerOptions: {
      attribution: '<a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    home_labelLayerUrl: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    home_labelLayerOptions: {
      attribution: '&copy; <a href="http://cartodb.com/attributions">Carto</a>'
    },
    home_idwLayerOptions: {
      opacity: 0.4, //alpha (0 - 1)
      cellSize: 5,
      exp: 4, //Linealidad del cambio de color (1 - 4)
      max: 200, //Valor de NO2 considerado el 100% a la hora de asignar colores
      gradient: {
        0.1: '#DDDDDD',
        0.21: '#63CB00', 0.32: '#D5EE27',
        0.43: '#F2FD00', 0.54: '#F8AA10',
        0.65: '#FF8400', 0.76: '#FF5208',
        0.87: '#EF0F0F', 1: '#CD0872'
      }
    },
    home_markerIconOptions: {
      prefix: 'fa',
      icon: "dashboard",
      iconColor: "white",
      markerColor: 'red' //hacked (cambie el PNG de markers y ahora solo esta el color negro)
    },
    home_sliderOptions: {
      orientation: "horizontal",
      tooltip_position:'bottom',
      tooltip: "always",
      provide: "slider",
      step: "1"
    },
    //fadein | slide | newspaper | fall
    //sidefall | blur | flip | sign | superscaled
    //slit | rotate | letmein | makeway | slip
    //corner | slidetogether | scale | door
    //push | contentscale | swell | rotatedown | flash
    home_popupEffect: "swell",
    home_popupEffect_mobile: "push"


  };

  return _.extend({}, config, configByEnv[environment]);

});
