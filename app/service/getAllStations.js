define([
	'webase/wb-service'
], function(Service){

	var Srv = Service.extend({

    defaults: {

			name: "getAllStations",
			params: {},
			expires: 7 * 24 * 3600 * 1000,
      refreshTimestamp: 0
		},

		//Logica de filtrado de los datos del repository
		fromCache: function(fn){
			var me = this;

      var models = me.repository.toJSON();

			fn(null, models);
		},

		//Logica de llamada al servidor (ajax, lambda, etc)
		fromServer: function(fn){
      var me = this;

      $.ajax({
        method: "GET",
        url: app.config.servicePath + ((app.config.enableMockups) ? "resources/mockup/stations.json" : "stations"),
        success: function(response, textStatus, jqXHR){
					if(response.status != 0){
						console.error("Error while loading stations");
						fn("Error: service " + me.get("name") + " (" + response.status + ")");
					}
          fn(null, response.data);
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.error("Error while loading stations");
          fn(errorThrown);
        }
      });
		}

	});

	return Srv;
});
