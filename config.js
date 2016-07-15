define([
], function() {

  var environment = "DEVELOPMENT";

  var configByEnv = {
    DEVELOPMENT: {
      environment: "DEVELOPMENT",
      pageTitlePrefix: "[dev] contamadrid",
      servicePath: "/"
    },
    PRODUCTION: {
      environment: "PRODUCTION",
      pageTitlePrefix: "contamadrid",
      servicePath: "/"
    }
  };

  var config = {

    //router
    defaultView: "home",

    //Images
    defaultImage: "resources/images/default.jpg",

    //HOME
    home_dateRange: 7 * 24 * 3600 * 1000,
    home_tileLayerUrl: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    home_tileLayerOptions: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    },
    home_idwLayerOptions: {
      opacity: 0.3,
      cellSize: 5,
      exp: 1,
      max: 400,
      gradient: {
        0.08: '#63CB00', 0.16: '#D5EE27',
        0.25: '#F2FD00', 0.33: '#F8AA10',
        0.45: '#FF8400', 0.5: '#FF5208',
        0.75: '#EF0F0F', 1: '#CD0872'
      }
    }
  };

  return _.extend({}, config, configByEnv[environment]);

});
