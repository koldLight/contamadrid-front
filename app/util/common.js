/*
	Utilidades generales
*/
define([

], function(){

	var Common = {

		serializeDate: function(d){
      return d.toISOString().split("T")[0];
    }

	};

	return Common;
});
