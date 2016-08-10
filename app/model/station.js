define([], function() {

  var Model = Backbone.Model.extend({

    idAttribute: "id",

    defaults: {
      external_id: "",
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      altitude: 0,
      type: ""
    },

    constructor: function(attributes, options) {
      var me = this;

      //Composited primary key
      //attributes.id = attributes.station + "_" + attributes.date + "_" + attributes.hour;
      attributes.latitude = (typeof attributes.latitude == "string") ? parseFloat(attributes.latitude) : attributes.latitude;
      attributes.longitude = (typeof attributes.longitude == "string") ? parseFloat(attributes.longitude) : attributes.longitude;

      Backbone.Model.apply(this, arguments);
    }
  });

  // Return the model for the module
  return Model;
});
