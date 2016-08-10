define([], function() {

  var Model = Backbone.Model.extend({

    idAttribute: "id",

    defaults: {
      hour: 0,
      station_id: 0,
      date: "1970-01-01",
      value: 0
    },

    constructor: function(attributes, options) {
      var me = this;

      //Composited primary key
      //attributes.id = attributes.station + "_" + attributes.date + "_" + attributes.hour;
      attributes.value = (typeof attributes.value == "string") ? parseFloat(attributes.value) : attributes.value;

      Backbone.Model.apply(this, arguments);
    }
  });

  // Return the model for the module
  return Model;
});
