define([
	'webase/wb-repository',
	'app/model/pollution',
	'app/service/getPollutionByDateRange'
], function(Repository, Model, GetPollutionByDateRange){

	var name = "pollutionRepo";

	var Repo = Repository.extend({

		name: name,
		model: Model,
		clearOnLogout: false,

		getByDateRange: function(start, end, fn){
			var me = this;

			me.callService(GetPollutionByDateRange, { start: start, end: end }, fn);
		}

	});

	//Singleton
	var repo = app.registerRepository(Repo);

	return repo;
});
