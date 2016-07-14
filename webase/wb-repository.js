define([
	'localStorage',
	'webase/wb-utils',
	'webase/wb-service'
], function(LocalStorage, Utils, Service){

	var Repository = Backbone.Collection.extend({

		/*
			Propiedades que debe cambiar la clase que herede
		*/

		name: "wb-repository-" + Utils.generateUuid(),
		model: Backbone.Model,
		clearOnLogout: false,

		/*
			Propiedades que no se deben cambiar
		*/

		services: null,

		/*
			Metodos privados
		*/

		initialize: function(){
			var me = this;

			//Set cache key for data
			var ServiceCollection = Backbone.Collection.extend({
				model: Service,
				localStorage: new Backbone.LocalStorage(me.name + "-calls")
			});
			me.services = new ServiceCollection();
			me.localStorage = new Backbone.LocalStorage(me.name);


			//Load data from cache
			me.fetch();

			/*
			TODO:
			arreglar el problema de herencia tras carga desde cache
			y descomentar esto
			*/
			//me.services.fetch();
		},

		callService: function(ServiceCls, params, fn, scope, expires){
			var me = this;

			//Required params
			if(typeof ServiceCls == "undefined"){
				throw new Error('Missing "ServiceCls" argument');
			}

			//Optional params
			params = params || {};
			fn = fn || Utils.emptyFn;
			scope = scope || me;

			//Search call in cache
			var sId = ServiceCls.prototype.generateId(ServiceCls.prototype.defaults.name, params);
			var service = me.services.find(function(s){
				return s.id == sId;
			});

			//Create service
			if(!service){
				var attrs = { repository: me, params: params };
				service = new ServiceCls(attrs);
				me.services.create(service);
			}
			service.repository = me;

			//Call service
			service.call(fn, scope, expires);
		},

		addNewData: function(models){
			var me = this;

			if(models.length == 0){
				return;
			}

			//Save models in browser DB without trigger any events
			var results = [];
			_.each(models, function(model){
				var cachedModel = me.get(model.id);
				if(cachedModel != null){
					cachedModel.destroy({ silent: true });
				}
				model = me.create(model, { silent: true });
				results.push(model.toJSON());
			});

			//Trigger reset event
			me.reset(me.models);

			return results;
		},

		invalidateCache: function(){
			var me = this;

			me.each(function(model){
				model.destroy({ silent: true });
			});
			me.reset();
		}
	});

	return Repository;
});
