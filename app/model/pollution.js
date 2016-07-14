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

      attributes.id = attributes.station + "_" + attributes.date + "_" + attributes.hour;
      //console.log(arguments);

      Backbone.Model.apply(this, arguments);
    }
  });

  // Return the model for the module
  return Model;
});
