define([
  'config'
], function(Config) {

  var webaseConfig = {

    //default environment
    environment: "DEVELOPMENT",

    //screen
    widthXS: 768,
    widthSM: 992,
    widthMD: 1200,

    //chartjs
    lineChartLimit: 20,
    chartFillColors: ["rgba(220,220,220,0.2)", "rgba(220,220,220,0.2)", "rgba(220,220,220,0.2)", "rgba(220,220,220,0.2)"],
    chartStrokeColors: ["rgba(236,241,100,1)", "rgba(95,190,108,1)", "rgba(93,156,236,1)", "rgba(54,64,74,1)"],
    chartPointColors: ["rgba(236,241,100,1)", "rgba(95,190,108,1)", "rgba(93,156,236,1)", "rgba(54,64,74,1)"],
    chartPointStrokeColors: ["#fff", "#fff", "#fff", "#fff"],
    chartPointHighlightFillColors: ["#fff", "#fff", "#fff", "#fff"],
    chartPointHighlightStrokeColors: ["rgba(236,241,100,1)", "rgba(95,190,108,1)", "rgba(93,156,236,1)", "rgba(54,64,74,1)"],

    //Images
    defaultUserImage: "resources/images/icon_user_default.png",
    defaultImage: "resources/images/default.png",

    //router
    pageTitlePrefix: "Webase",
    defaultView: "home",
    page404: "page-404.html",
    page500: "page-500.html"
  };

  return _.extend({}, webaseConfig, Config);

});
