define([
  'webase/wb-utils'
], function(Utils) {

  //Template functions
  function registerHandlebarsCustomHelpers() {

  }

  //Application views
  function registerApplicationViews() {

    //Home
    app.router.registerView("home", {
      "home": function() {
        require([
          'app/view/desktop',
          'app/view/home'
        ], function(Master, View) {

          if (app.view.desktop == null) {
            new Master();
          }
          new View({
            anchor: "#mainContainer"
          });
        });
      }
    });
  }

  function loadViewWithMasterAndParams(Master, View, params) {

    //Cargamos vista master
    if (app.globals.desktop == null) {
      app.globals.desktop = new Master();
      $("#viewport").append(app.globals.desktop.$el);
    }

    var view = new View(params);
    app.router.showView(view);
  }

  //Custom code before launch application
  function initialize() {

    //Template functions
    registerHandlebarsCustomHelpers();

    //Application views
    registerApplicationViews();
  }


  return {
    initialize: initialize
  };
});
