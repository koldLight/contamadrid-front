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

    homeMap_dateRange: 7 * 24 * 3600 * 1000
  };

  return _.extend({}, config, configByEnv[environment]);

});
