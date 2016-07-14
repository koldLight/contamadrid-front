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

		getByDateRange: function(from, to, fn){
			var me = this;

			me.callService(GetPollutionByDateRange, { from: from, to: to }, fn);
		}

	});

	//Singleton
	var repo = app.registerRepository(Repo);

	return repo;
});
