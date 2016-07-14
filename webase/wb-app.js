require.config({
	waitSeconds: 40,
	baseUrl: app.config.rootPath,
	paths: {
		jquery: 'resources/js/jquery-fix',
		underscore: 'resources/js/underscore',
		backbone: 'resources/js/backbone',
		handlebars: 'resources/js/handlebars',
		localStorage: 'resources/js/backbone.localStorage',
		async: 'resources/js/async',
		bootstrap: 'resources/js/bootstrap',
		leaflet: 'resources/plugins/leaflet/leaflet',
		'leaflet.idw': 'resources/plugins/leaflet/leaflet-idw'
	},
	shim: {
		'handlebars': { exports: 'Handlebars' },
    'underscore': { exports: '_' },
		'bootstrap': { deps: ['jquery'] },
    'backbone': {
      deps: ['underscore', 'jquery'],
    	exports: 'Backbone'
		},
		'localStorage': { deps: ['backbone'] },
		'leaflet.idw': { deps: ['leaflet'] }
	}
});

require([
	'underscore',
	'handlebars',
	'backbone',
	'async'
], function(_, Handlebars, Backbone, Async){

  window.Handlebars = Handlebars;
	window._ = _;
	window.Backbone = Backbone;
	window.Async = Async;

	require([
		'webase/wb-router',
		'webase/wb-config',
		'webase/wb-cache',
		'webase/wb-utils',
		'resources/js/i18n!resources/nls/strings',
		'app'
	], function(Router, Config, Cache, Utils, Strings, App){

		//Loading
		function hideLoading(fn){
			fn = fn || function(){};
			var appLoading = $("#appLoading");
			var viewport = $("#viewport");
			if(appLoading.length > 0){
				appLoading.fadeOut(800, function(){
					viewport.show();
					fn();
				});
			}else{
				viewport.show();
				fn();
			}
		}
		function showLoading(){
			var appLoading = $("#appLoading");
			var viewport = $("#viewport");
			$("#viewport").hide();
			if(appLoading.length > 0){
				appLoading.show();
			}
		}

		//add view to app domain
		function registerView(view){
			if(app.view[view.className] == null){
				app.view[view.className] = [];
			}
			app.view[view.className].push(view);
		}

		//add repository to app domain
		function registerRepository(Repo){
			var repoName = Repo.prototype.name;
			if(app.repository[repoName] == null){
				app.repository[repoName] = new Repo();
			}
			return app.repository[repoName];
		}

		//Global access to some objects
		_.extend(app, {
			view: {},
			repository: {},
			globals: {},
			router: new Router(),
			config: _.extend(Config, app.config),
			cache: Cache,
			strings: Strings,
			showLoading: showLoading,
			hideLoading: hideLoading,
			registerRepository: registerRepository,
			registerView: registerView
		});

		//console.log and console.error support
		window.console = window.console || {
			log: function(){},
			error: function(){}
		};

		//Built-in Handlebars custom helpers
		function registerHandlebarsCustomHelpers(){

			//Dates
			Handlebars.registerHelper('formatDate', function(timestamp){
				if(typeof timestamp != "number"){
					return "";
				}
				return new Handlebars.SafeString(
					Utils.formatDate(timestamp)
				);
			});

			//Images
			Handlebars.registerHelper('printImage', function(image){
				if(Utils.isNullOrBlank(image)){
					image = app.config.defaultImage;
				}
				return new Handlebars.SafeString(
					'<img alt="" src="' + image + '" />'
				);
			});
		}
		registerHandlebarsCustomHelpers();

		//Load persistent objects from local storage
		Cache.refresh(function(collection, response, options){

			//Initialize application
			if(typeof App.initialize == "function"){
				App.initialize();
			}

			//Launch application
			Backbone.history.start();
		});
	});

})
