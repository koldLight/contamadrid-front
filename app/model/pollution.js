define([], function() {

  var Model = Backbone.Model.extend({

    idAttribute: "id",

    defaults: {
      station: "",
      date: "",
      hour: 0,
      value: 0
    },

    constructor: function(attributes, options) {
      var me = this;

      //TODO: arreglar scraping de mediciones (los ids de estación no coinciden)
      /*
      var station = "" +
        attributes.station[0] +
        attributes.station[1] +
        "0" +
        attributes.station[2] +
        attributes.station[3] +
        "0" +
        attributes.station[4] +
        attributes.station[5];
      attributes.station = station;
      */

      //Composited primary key
      attributes.id = attributes.station + "_" + attributes.date + "_" + attributes.hour;

      Backbone.Model.apply(this, arguments);
    }
  });

  // Return the model for the module
  return Model;
});
