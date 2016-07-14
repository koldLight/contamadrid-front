define([
	'webase/wb-utils'
], function(Utils){

	var View = Backbone.View.extend({

		models: {},
		collections: {},

		//Metodos publicos

		getModelKey: function(modelA){
			var me = this;

			var key;
			_.each(me.models, function(modelB, keyB){
				if(modelA.cid == modelB.cid){
					key = keyB;
				}
			});
			return key;
		},

		getCollectionKey: function(collectionA){
			var me = this;

			var key;
			_.each(me.collections, function(collectionB, keyB){
				if(collectionA.cid == collectionB.cid){
					key = keyB;
				}
			});
			return key;
		},

		bindModel: function(key, model){
			var me = this;

			if(typeof key != "string" || model == null){
				return me;
			}

			if(me.models[key] != null){
				me.unbindModel(key);
			}
			me.models[key] = model;
			model.on("all", me.dispatchModelEvent, me);

			return me;
		},

		bindCollection: function(key, collection){
			var me = this;

			if(typeof key != "string" || collection == null){
				return me;
			}

			if(collection.cid == null){
				collection.cid = "cs" + (new Date()).getTime();
			}

			if(me.collections[key] != null){
				me.unbindCollection(key);
			}
			me.collections[key] = collection;
			collection.on("all", me.dispatchCollectionEvent, me);

			return me;
		},

		unbindModel: function(key){
			var me = this;

			if(me.models[key] != null){
				me.models[key].off("all", me.dispatchModelEvent);
				delete me.models[key];
			}

			return me;
		},

		unbindCollection: function(key){
			var me = this;

			if(me.collections[key] != null){
				me.collections[key].off("all", me.dispatchCollectionEvent);
				delete me.collections[key];
			}

			return me;
		},

		//Metodos privados

		dispatchModelEvent: function(eventName, model){
			var me = this;

			var key = me.getModelKey(model),
				method = "on" + Utils.capitalizeFirstLetter(key)
					+ Utils.capitalizeFirstLetter(me.getAttributeName(eventName))
					+ Utils.capitalizeFirstLetter(me.getEventName(eventName)),
				params = [key, model];

			if(arguments.length > 2){
				params = _.union(params, Array.prototype.slice.call(arguments, 2));
			}

			if(typeof me[method] == "function"){
				me[method].apply(me, params);
			}
		},

		dispatchCollectionEvent: function(eventName, arg1, arg2){
			var me = this;

			var model, collection;
			if(arg1.attributes != null){
				model = arg1;
			}else{
				collection = arg1;
			}
			if(model != null){
				if(arg2.length != null){
					collection = arg2;
				}else if(model.collection != null){
					collection = model.collection;
				}else{
					throw new Error("No se ha encontrado la collection en los parametros del evento");
				}
			}

			var key = me.getCollectionKey(collection),
				method = "on" + Utils.capitalizeFirstLetter(key)
					+ Utils.capitalizeFirstLetter(me.getAttributeName(eventName))
					+ Utils.capitalizeFirstLetter(me.getEventName(eventName)),
				params = (model != null) ? [key, collection, model] : [key, collection];

			if(typeof me[method] == "function"){
				me[method].apply(me, params);
			}
		},

		getEventName: function(str){
			var splitted = str.split(":");
			var ret = (splitted.length > 0) ? splitted[0] : "";
			return ret;
		},

		getAttributeName: function(str){
			var splitted = str.split(":");
			var ret = (splitted.length > 1) ? splitted[1] : "";
			return ret;
		},

		initialize: function(options){
			var me = this;

			//Default options
			if(me.options == null){
				me.options = {};
			}
			me.options = _.extend({
				autoRender: true,
				name: me.className + "-" + (new Date()).getTime(),
				anchor: "#viewport"
			}, me.options, options);

			//Add view to app domain
			app.registerView(me);

			//Auto-bind models and collections
			_.each(me.options.collections, function(collection, key){
				me.bindCollection(key, collection);
			});
			_.each(me.options.models, function(model, key){
				me.bindModel(key, model);
			});

			//DOM anchor for this component
			if(me.options.anchor != null){
				$(me.options.anchor).append(me.$el);
			}

			Async.waterfall([
				function(fn){

					//After initialize (and before render) event
					if(typeof me.onCreate == "function"){
						me.onCreate(fn);
					}else{
						fn(null, null);
					}
				},
				function(results, fn){

					//Auto-render
					if(me.options.autoRender){
						me.render(fn);
					}else{
						fn(null, null);
					}
				},
				function(results, fn){

					//After first render
					if(typeof me.afterFirstRender == "function"){
						me.afterFirstRender(fn);
					}else{
						fn(null, null);
					}
				}
			], function(err, results){

				//Hide app Loading
				//app.hideLoading();
			});
		},

		remove: function(){
			var me = this;

			Backbone.View.prototype.remove.apply(me, arguments);
		}
	});

	return View;
});
