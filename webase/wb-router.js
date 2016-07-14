define([
], function(){

	var AppRouter = Backbone.Router.extend({

		routes: {
			// Default
			'*filter': 'defaultLoader'
		},

		views: [],

		/*
			Registra una vista en la aplicación

			viewName: nombre del fichero en la carpeta app/view/
			(opt) routes: mapa(ruta, callback)
		*/
		registerView: function(viewName, routes){
			var me = this;

			if(!_.contains(me.views, viewName)){
				me.views.push(viewName);
			}

			_.each(routes, function(value, key){
				me.route(key, viewName, value);
			});
		},

		execute: function(callback, args, name) {
			var me = this;

			//Se elimina la vista actual
			if(app.globals.currentView){
				app.globals.currentView.remove();
				app.globals.currentView = null;
			}

			//Fix error en popovers de bootstrap
			$("body>.popover").remove();

			if (callback) callback.apply(me, args);
		},

		defaultLoader: function(queryString){
      var me = this;

			// Parse view name and parameters
			var parsed = me.parseQueryString(queryString);
			var params = parsed.params;
			var viewName = parsed.viewName;

			//Redirect
			if(viewName.length == 0){
				me.navigateToDefaultView();
			}else if(_.contains(me.views, viewName)){
				me.loadView(viewName, params);
			}else{
				me.navigateTo404();
			}
		},

    loadView: function(viewName, options){
      var me = this;

			require([
				'app/view/' + viewName
			], function(View){

				//Cargamos la nueva
				me.showView(new View(options));
			});
    },

		showView: function(view, pageTitle){

			//Cambiamos título de la página
			var title = app.config.pageTitlePrefix;
			if(pageTitle != null){
				title += " - " + pageTitle;
			}
			$("html>head>title").text(title);

			//Cargamos la nueva
			app.globals.currentView = view;
		},

		parseQueryString: function(queryString){
			queryString = queryString || "";
			var splitted = queryString.split("/");
			var viewName = (splitted.length == 0) ? "" : splitted[0];
			var params = {};
			for(var i = 1; i < splitted.length; i += 2){
				if(i < splitted.length - 1){
					params[splitted[i]] = splitted[i + 1];
				}else{
					params[splitted[i]] == true;
				}
			}
			return {
				viewName: viewName,
				params: params
			};
		},

		navigateToDefaultView: function(){
			window.location.replace("#" + app.config.defaultView);
		},

		navigateTo404: function(){
			window.location.replace(app.config.rootPath + app.config.page404);
		},

		navigateTo500: function(){
			window.location.replace(app.config.rootPath + app.config.page500);
		}

	});

	return AppRouter;

});
