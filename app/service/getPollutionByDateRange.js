define([
	'webase/wb-service',
	'app/util/common'
], function(Service, Common){

	var now = Common.serializeDate(new Date());

	var Srv = Service.extend({

    defaults: {

			name: "getPollutionByDateRange",
			params: { from: now, to: now },
			expires: 1 * 3600 * 1000,
      refreshTimestamp: 0
		},

		//Logica de filtrado de los datos del repository
		fromCache: function(fn){
			var me = this;

      var models = me.repository.toJSON();
			var measurements = _(models).filter(function(m){
				return (me.get("params").from < m.date && m.date < me.get("params").to);
			});

			fn(null, measurements);
		},

		//Logica de llamada al servidor (ajax, lambda, etc)
		fromServer: function(fn){
      var me = this;

      $.ajax({
        method: "GET",
        url: app.config.servicePath + ((app.config.enableMockups) ? "resources/mockup/pollution.json" : "/measurements"),
				data: me.get("params"),
        success: function(response, textStatus, jqXHR){
					if(response.status != 0){
						console.error("Error while loading pollution measurements");
						fn("Error: servicio " + me.get("name") + " (" + response.status + ")");
					}
          fn(null, response.data);
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.error("Error while loading pollution measurements");
          fn(errorThrown);
        }
      });
		}

	});

	return Srv;
});
