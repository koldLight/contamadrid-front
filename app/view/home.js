define([
  'resources/js/text!app/template/homeTpl.html',
  'resources/js/text!app/template/splashTpl.html',
  'webase/wb-view',
  'webase/wb-utils',
  'webase/wb-dialog',
  'app/repository/stationRepo',
  'app/repository/pollutionRepo',
  'app/util/common',
  'app/view/alertActions',
  'leaflet.idw',
  'leaflet.awesome-markers',
  'resources/plugins/seiyria-bootstrap-slider/dist/bootstrap-slider.min'
], function(Template, SplashTpl, AbstractView, Utils, Dialog, StationRepo, PollutionRepo, Common, AlertActions) {

  var View = AbstractView.extend({

    className: "home-view",
    options: {
      anchor: "#viewport",
      dateRange: app.config.home_dateRange,
      initialDate: '2016-07-15',//Common.serializeDate(new Date()),
      initialHour: 12,
      sliderOffset: app.config.home_sliderOffset
    },

    template: Handlebars.compile(Template),
    splashTpl: Handlebars.compile(SplashTpl),

    leaflet: null,
    tileLayer: null,
    idwLayer: null,
    markers: [],

    slider: null,
    sliderMin: 0,
    sliderMax: 0,
    currentDate: null,
    playInterval: null,

    events: {
      "click .btnNext": "onBtnNextClick",
      "click .btnPrev": "onBtnPrevClick",
      "click .btnPlay": "onBtnPlayClick",
      "click .btnPause": "onBtnPauseClick",
      "click .legend": "onLegendClick",
      "click .btnShowAlertInfo": "onBtnShowAlertInfoClick",
      "click .btnShowMarkers": "onBtnShowMarkersClick"
    },

    onCreate: function(fn) {
      var me = this;

      me.updateCurrentDate(0);

      Async.parallel([
        function(fn){

          //Obtenemos estaciones
          StationRepo.getAll(fn);
        },
        function(fn){

          //Obtenemos mediciones
          var oneDayInMillis = 24 * 3600 * 1000,
            minDate = me.currentDate.getTime() - (me.options.dateRange * oneDayInMillis),
            maxDate = me.currentDate.getTime() + (me.options.dateRange * oneDayInMillis),
            start = Common.serializeDate(new Date(minDate)),
            end = Common.serializeDate(new Date(maxDate));

          PollutionRepo.getByDateRange(start, end, fn);
        },
        function(fn){

          //Tiempo mínimo de respuesta 1s
          //(duración de la animación de ocultar loading)
          setTimeout(function(){
            fn(null, null);
          }, 1000);
        }
      ], fn);
    },

    render: function(fn) {
      var me = this;

      //Create HTML from compiled template and put it in $el (DOM element)
      me.$el.html(me.template({
        strings: app.strings,
        config: app.config,
        options: me.options
      }));

      //Reference to view controls
      me.control = {
        map: me.$(".map"),
        slider: me.$(".currentTime"),
        btnPlay: me.$(".btnPlay"),
        btnPause: me.$(".btnPause"),
        btnShowAlertInfo: me.$(".btnShowAlertInfo"),
        btnShowMarkers: me.$(".btnShowMarkers")
      };

      //Slider
      me.initSlider();

      //Init map
      var stations = StationRepo.toJSON(),
        measurements = _(PollutionRepo.toJSON()).where({
          date: Common.serializeDate(me.currentDate),
          hour: me.currentDate.getHours()
        });
      me.initMap(stations, measurements);

      fn(null, null);
    },

    afterFirstRender: function(fn) {
      var me = this;

      var lastLoad = app.cache.read("lastSplashLoad"),
        oneDayInMillis = 24 * 3600 * 1000;

      if((Date.now() - lastLoad) < (app.config.splash_loadInterval * oneDayInMillis)){
        return;
      }
      app.cache.write("lastSplashLoad", Date.now());

      var dialog = new Dialog({
        title: app.strings.splash_popup_title,
        html: me.splashTpl({ strings: app.strings, config: app.config })
      });
      dialog.options.customboxConfig.width = "full";
      dialog.options.customboxConfig.effect = app.config.splash_popupEffect;
      dialog.show();

      fn(null, null);
    },

    /****************************
    	EVENT HANDLERS
    *****************************/

    onBtnShowMarkersClick: function(e){
      var me = this;

      me.control.btnShowMarkers.toggleClass("active");
      if(me.control.btnShowMarkers.hasClass("active")){
        me.showMarkers();
      }else{
        me.hideMarkers();
      }
    },

    onBtnShowAlertInfoClick: function(e){
      var me = this;

      //Creamos modal
      var dialog = new Dialog({
        title: app.strings.home_popupAlert_title
      });
      var isMobile = ($(window).width() <= app.config.widthXS);
      dialog.options.customboxConfig.effect = (isMobile) ? app.config.home_popupEffect_mobile : app.config.home_popupEffect;
      dialog.options.customboxConfig.width = (isMobile) ? "full" : null;

      //Creamos vista que va dentro del modal
      dialog.options.view = new AlertActions({
        riskLevel: me.control.btnShowAlertInfo.data("risk"),
        action: me.control.btnShowAlertInfo.data("action"),
        anchor: "#" + dialog.options.name + " .custom-modal-text",
        autoRender: false
      });

      //Mostramos modal
      dialog.show();
    },

    onLegendClick: function(e){
      var me = this;

      var dialog = new Dialog({
        title: app.strings.home_popupLegend_title,
        html: '<img src=' + app.strings.home_mapLegend_image + ' alt="" />'
      });
      var isMobile = ($(window).width() <= app.config.widthXS);
      dialog.options.customboxConfig.effect = (isMobile) ? app.config.home_popupEffect_mobile : app.config.home_popupEffect;
      dialog.options.customboxConfig.width = (isMobile) ? "full" : null;
      dialog.show();
    },

    onSliderChange: function(e){
      var me = e.data;

      var stations = StationRepo.toJSON(),
        measurements = _(PollutionRepo.toJSON()).where({
          date: Common.serializeDate(me.currentDate),
          hour: me.currentDate.getHours()
        });
      me.updateMap(stations, measurements);
    },

    onBtnNextClick: function(e){
      var me = this;

      var newValue = me.control.slider.slider('getValue') + 1;
      me.control.slider.slider('setValue', newValue, true, true);
    },

    onBtnPrevClick: function(e){
      var me = this;

      var newValue = me.control.slider.slider('getValue') - 1;
      me.control.slider.slider('setValue', newValue, true, true);
    },

    onBtnPlayClick: function(e){
      var me = this;

      if(me.playInterval != null){
        return;
      }

      me.control.slider.slider('disable');
      me.control.btnPlay.hide();
      me.control.btnPause.show();

      me.playInterval = setInterval(function(){
        if(me.control.slider.slider('getValue') == me.sliderMax){
          me.control.slider.slider('setValue', me.sliderMin, true, true);
        }else{
          me.onBtnNextClick();
        }
      }, 1000);
    },

    onBtnPauseClick: function(e){
      var me = this;

      if(me.playInterval == null){
        return;
      }

      me.control.slider.slider('enable');
      me.control.btnPlay.show();
      me.control.btnPause.hide();

      clearInterval(me.playInterval);
      me.playInterval = null;
    },

    /****************************
    	METHODS
    *****************************/

    initMap: function(stations, measurements) {
      var me = this;

      //Formateado de datos
      var data = me.prepareDataForLeaflet(stations, measurements);

      //Mapa
      me.leaflet = L.map(me.control.map[0], app.config.home_mapOptions);
      me.tileLayer = L.tileLayer(app.config.home_tileLayerUrl, app.config.home_tileLayerOptions).addTo(me.leaflet);
      me.idwLayer = L.idwLayer(data, app.config.home_idwLayerOptions).addTo(me.leaflet);
      if(app.config.home_labelLayerUrl != null){
        me.tileLayer = L.tileLayer(app.config.home_labelLayerUrl, app.config.home_labelLayerOptions).addTo(me.leaflet);
      }

      //Markers
      _(stations).each(function(station){
        var marker = L.marker(
          [station.latitude, station.longitude], {
            icon: L.AwesomeMarkers.icon(app.config.home_markerIconOptions)
          }
        );
        me.markers.push(marker);
        marker.bindPopup(
          app.strings.home_marker_namePre + " " + station.name
          + '<br />' + app.strings.home_marker_addressPre + " " + station.address
          + '<br />' + app.strings.home_marker_altitudePre + " " + station.altitude + "m"
          + '<br />' + app.strings.home_marker_typePre + " " + station.type
        )
        .addTo(me.leaflet);
      });
    },

    updateMap: function(stations, measurements){
      var me = this;

      var data = me.prepareDataForLeaflet(stations, measurements);
      me.idwLayer.setLatLngs(data);

      /*
      console.log("------------------------");
      console.log("stations: " + stations.length);
      console.log("measures: " + measurements.length);
      console.log(_(measurements).findWhere({ station_id: 20 }));
      console.log("date: " + _(measurements).findWhere({ station_id: 20 }).date);
      console.log("------------------------");
      */
    },

    prepareDataForLeaflet: function(stations, measurements){
      var me = this;

      var data = _(measurements).chain()
        .map(function(m){
          var station = _(stations).findWhere({ id: m.station_id });
          if(station == null){ return null; }
          return [ station.latitude, station.longitude, m.value ];
        })
        .without(null)
        .value();

      return data;
    },

    initSlider: function(){
      var me = this;

      var totalValues = ((me.options.dateRange * 2) + 1) * 24;
      me.sliderMin = -(totalValues / 2);
      me.sliderMax = (totalValues / 2) - 1;

      var options = _.extend({
        min: me.sliderMin,
        max: me.sliderMax,
        value: 0
      }, app.config.home_sliderOptions);

      options.formatter = function(value) {

        me.updateCurrentDate(value);

        var day = me.currentDate.getDate() + "";
        day = ((day.length < 2) ? "0" : "") + day;
        var month = (me.currentDate.getMonth() + 1) + "";
        month = ((month.length < 2) ? "0" : "") + month;
        var year = me.currentDate.getFullYear() + "";
        var strDate = day + "/" + month + "/" + year;
        var strHour = me.currentDate.getHours() + "";
        strHour = ((strHour.length < 2) ? "0" : "") + strHour + ":00";

        return strDate + " " + strHour;
      };

      me.control.slider = me.control.slider.slider(options);

      me.control.slider.on('change', me, me.onSliderChange);
    },

    updateCurrentDate: function(sliderValue){
      var me = this;

      var splitted = me.options.initialDate.split("-"),
        year = splitted[0],
        month = splitted[1] - 1,
        day = splitted[2],
        hour = me.options.initialHour,
        zero = (new Date(year, month, day, hour, 0, 0)).getTime(),
        offset = sliderValue * 3600 * 1000;

      me.currentDate = new Date(zero + offset);
    },

    hideMarkers: function(){
      var me = this;

      _(me.markers).each(function(marker){
        me.leaflet.removeLayer(marker);
      });
    },

    showMarkers: function(){
      var me = this;

      _(me.markers).each(function(marker){
        marker.addTo(me.leaflet);
      });
    }

  });


  return View;

});
