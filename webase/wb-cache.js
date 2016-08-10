define([
  'backbone',
  'localStorage'
], function(Backbone, localStorage) {

  var CacheRecord = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      value: '',
      createdAt: 0,
      updatedAt: 0,
      expires: 10 * 365 * 24 * 60 * 60 * 1000 //10 years
    },

    constructor: function(attributes, options) {
      var now = (new Date()).getTime();

      //timestamp
      attributes.createdAt = now;
      attributes.updatedAt = now;

      Backbone.Model.apply(this, arguments);
    }
  });

  var Cache = Backbone.Collection.extend({

    localStorage: new Backbone.LocalStorage("app.cache"),
    model: CacheRecord,

    read: function(key) {
      var record = this.get(key);
      if (record) {
        return record.get("value");
      }
    },

    write: function(key, value) {
      var record = this.get(key);

      //If record exists, update it
      if (record) {
        var now = (new Date()).getTime();
        record.save({ value: value, updatedAt: now });
      }else{

        //If not exists, create it
        this.create({ key: key, value: value });
      }

      return this;
    },

    destroy: function(key) {
      var record = this.get(key);
      if (record) {
        record.destroy();
      }
      return this;
    },

    clear: function() {
      while (this.length > 0) {
        this.at(0).destroy();
      }
      return this;
    },

    refresh: function(callback) {
      var now = (new Date()).getTime();

      //Load from explorer database
      this.fetch({
        reset: true,
        success: function(collection, response, options){

          //Check expiration date
          collection.each(function(record){
            if(record.get("createdAt") + record.get("expires") < now){
              record.destroy();
            }
          });
          callback(null, collection);
        },
        error: function(collection, response, options){
          callback(response);
        }
      });

      return this;
    }
  });

  //Singleton
  if(typeof app.cache == "undefined"){
    app.cache = new Cache();
  }

  return app.cache;
});
