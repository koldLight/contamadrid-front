/*
	Utilidades generales
*/
define([

], function(){

	var Common = {

		pad: function(number){
			return (number < 10) ? "0" + number : "" + number;
		},

		serializeDate: function(d){
			var me = this;

      return d.getFullYear() + "-" + me.pad(d.getMonth() + 1) + "-" + me.pad(d.getDate());
    }

	};

	return Common;
});
