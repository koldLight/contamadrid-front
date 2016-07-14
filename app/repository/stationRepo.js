define([
	'webase/wb-repository',
	'app/model/station',
	'app/service/getAllStations'
], function(Repository, Model, GetAllStations){

	var name = "stationRepo";

	var Repo = Repository.extend({

		name: name,
		model: Model,
		clearOnLogout: false,

		getAll: function(fn){
			var me = this;

			me.callService(GetAllStations, {}, fn);
		}

	});

	//Singleton
	var repo = app.registerRepository(Repo);

	return repo;
});
