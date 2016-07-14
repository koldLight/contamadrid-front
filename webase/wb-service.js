define([
	"webase/wb-utils"
], function(Utils){

	var Service = Backbone.Model.extend({

		/*
			Atributos que debe sobreecribir la clase que herede
		*/

		defaults: {
			name: "wb-service",
			params: {},
			expires: 0,
			refreshTimestamp: 0 //Dejar a 0
		},

		/*
		Atributos que NO se deben sobreecribir
		*/

		repository: null,

		/*
			Metodos que debe sobreecribir la clase que herede
		*/

		//Logica de filtrado de los datos del repository
		/*
		fromCache: function(fn){
			var me = this;

			var repo = me.repository;
			if(repo == null){
				throw new Error("Missing repository");
			}
			fn(null, repo.toJSON());
		},
		*/

		//Logica de llamada al servidor (ajax, lambda, etc)
		/*
		fromServer: function(fn){
			fn(true);
		},
		*/

		/*
			Metodos que NO se deben sobreecribir
		*/

		constructor: function() {
			var me = this;

			Backbone.Model.apply(me, arguments);

			//Initialize id
		  me.id = me.generateId();
		},

		call: function(fn, scope, expires){
			var me = this;

			//Optional params
			scope = scope || me;
			fn = fn || Utils.emptyFn;
			expires = (typeof expires == "number") ? expires : me.get("expires");

			//Check if data is expired
			var now = (new Date()).getTime();
			if(expires + me.get("refreshTimestamp") > now){

				//Load from repository
				me.loadDataFromCache(fn, scope);
			}else{

				//Load from server
				me.loadDataFromServer(fn, scope);
			}
		},

		loadDataFromCache: function(fn, scope){
			var me = this;

			//Ejecutamos logica de filtrado sobre el repository
			me.fromCache(function(err, models){
				if(err != null){

					//Ocultamos errores
					return fn.call(scope, null, []);
				}

				//Llamada al callback
				fn.call(scope, null, models);
			});
		},

		loadDataFromServer: function(fn, scope){
			var me = this;

			//Ejecutamos llamada al servidor
			me.fromServer(function(err, models){
				if(err != null){

					//En caso de error, cargamos desde cache
					return me.loadDataFromCache(fn, scope);
				}

				//Set timestamp
				var now = (new Date()).getTime();
				me.save({ refreshTimestamp: now });

				//Save new data in repository
				var repo = me.repository;
				if(repo != null && models.length > 0){
					models = repo.addNewData(models);
				}

				fn.call(scope, null, models);
			});
		},

		//Generacion del id para que el repository pueda gestionar el cache de llamada
		generateId: function(name, params){
			var me = this;

			if(name == null || params == null){
				name =  me.get("name");
				params = me.get("params");
			}

			var id = name + JSON.stringify(params);
			id = id.replace(/[\t\s]/g, "");

			return id;
		}
	});

	return Service;
});
