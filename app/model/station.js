define([], function() {

  var Model = Backbone.Model.extend({

    idAttribute: "station",

    defaults: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      altitude: 0,
      type: ""
    }
  });

  // Return the model for the module
  return Model;
});
