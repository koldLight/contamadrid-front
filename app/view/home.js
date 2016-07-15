
define([
  'resources/js/text!app/template/homeTpl.html',
  'webase/wb-view',
  'webase/wb-utils',
  'app/repository/stationRepo',
  'app/repository/pollutionRepo',
  'app/util/common',
  'leaflet',
  'leaflet.idw'
], function(Template, AbstractView, Utils, StationRepo, PollutionRepo, Common) {

  var View = AbstractView.extend({

    className: "home-view",
    options: {
      anchor: "#viewport",
      dateRange: app.config.home_dateRange
    },

    template: Handlebars.compile(Template),

    events: {
      //"click .button.edit": "openEditDialog"
    },

    onCreate: function(fn) {
      var me = this;

      Async.parallel([
        function(fn){

          //Obtenemos estaciones
          StationRepo.getAll(fn);
        },
        function(fn){

          //Obtenemos mediciones
          var now = (new Date()).getTime(),
            from = Common.serializeDate(new Date(now - me.options.dateRange)),
            to = Common.serializeDate(new Date(now + me.options.dateRange));
          PollutionRepo.getByDateRange(from, to, fn);
        }
      ], fn);
    },

    render: function(fn) {
      var me = this;

      Async.parallel({
        stations: function(fn){

          //Obtenemos estaciones
          StationRepo.getAll(fn);
        },
        measurements: function(fn){

          //Obtenemos mediciones
          var now = (new Date()).getTime(),
            from = Common.serializeDate(new Date(now - me.options.dateRange)),
            to = Common.serializeDate(new Date(now + me.options.dateRange));
          PollutionRepo.getByDateRange(from, to, fn);
        }
      }, function(err, results){

        //Create HTML from compiled template and put it in $el (DOM element)
        me.$el.html(me.template({
          strings: app.strings,
          config: app.config,
          options: me.options
        }));

        //Reference to view controls
        me.control = {
          map: me.$(".map")
        };

        //Resize
        $(window).resize(function() {
          me.onResize();
        });

        //Init map
        setTimeout(function() {
          var now = new Date();
          //var measurements = _(results.measurements).where({ hour: now.getHours() });
          var measurements = _(results.measurements).where({ hour: 12 });
          me.initMap(results.stations, measurements);
        }, 1000);

        //Initial focus
        //me.control.input.trigger("focus");

        fn(null, null);
      });
    },

    afterFirstRender: function(fn) {
      var me = this;

      //me.bindCollection("projects", ProjectRepo);

      fn(null, null);
    },

    remove: function() {
      var me = this;

      //app.globals.desktop.showSideMenu();

      Backbone.View.prototype.remove.apply(me, arguments);
    },

    /****************************
    	EVENT HANDLERS
    *****************************/

    onResize: function(e) {
      var me = this;

      var w = $(me.options.anchor).innerWidth(),
        h = $(window).height() / 2;

      me.control.map.css({
        width: w + " px",
        height: h + " px"
      });
    },

    onProjectsUpdate: function(key, list) {
      var me = this;

      me.render(Utils.emptyFn);
    },

    onProjectsReset: function(key, list) {
      var me = this;

      me.render(Utils.emptyFn);
    },

    /****************************
    	METHODS
    *****************************/

    initMap: function(stations, measurements) {
      var me = this;

      var map = L.map(me.control.map[0], {
        center: [40.416773, -3.703333],
        zoom: 13
      });

      L.tileLayer(app.config.home_tileLayerUrl, app.config.home_tileLayerOptions).addTo(map);

      var data = _(measurements).chain()
        .map(function(m){
          var station = _(stations).findWhere({ station: m.station });
          if(station == null){ return null; }
          return [ station.latitude, station.longitude, m.value ];
        })
        .without(null)
        .value();

      L.idwLayer(data, app.config.home_idwLayerOptions).addTo(map);
    }

  });


  return View;

});
