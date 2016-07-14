/*
	Utilidades generales
*/
define([

], function(){

	var Utils = {

		capitalizeFirstLetter: function(str){
			if(typeof str != "string"){
				return "";
			}
			if(str.length == 0){
				return str;
			}
			if(str.length == 1){
				return str.toUpperCase();
			}
			return str.charAt(0).toUpperCase() + str.slice(1);
		},

		escapeRegExp: function(str) {
		  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},

		getArrayPage: function(ar, page, pageSize){
			var start = page * pageSize;
			var end = start + pageSize;
			return ar.slice(start, end);
		},

		getPropertyStoredInClass: function(item, prefix){
			var cls = $(item).attr("class");
			var startIndex = cls.indexOf(prefix);
			if(startIndex < 0){ return; }
			var prop = cls.substr(startIndex + prefix.length);
			var endIndex = prop.indexOf(" ");
			if(endIndex > 0){
				prop = prop.substr(0, endIndex);
			}
			return prop;
		},

		/*
		Obtiene los parámetros GET de la URL

			return = {
				url: string,
				param1: string,
				param2: string,
				...
			}
		*/
		getUrlParams: function(){
			var paramDictionary = {};
			var getParams = document.URL.split("?");
			paramDictionary.url = decodeURI(getParams[0]);
			if(getParams.length == 1){ return paramDictionary; }

			getParams = getParams[1].split("#")[0];
			getParams = getParams.split("&");
			for(var i = 0; i < getParams.length; i++){
				var splitted = getParams[i].split("=");
				var key = splitted[0];
				var value = (splitted.length > 1) ? splitted[1] : null;
				paramDictionary[key] = value;
			}
			return paramDictionary;
		},

		isNumeric: function(n){
			if(typeof n == "string"){
				if(Number.isNaN(parseInt(n, 10))){
					return false;
				}
				for(var i = 0; i < n.length; i++){
					if(Number.isNaN(parseInt(n[i], 10)) && n[i] != "-" && n[i] != "," && n[i] != "."){
						return false;
					}
				}
				return true;
			}else{
				return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
			}
		},

		generateUuid: function(){
			var now = (new Date()).getTime();
			var uuid = now + "" + (Math.round(Math.random() * 1000000));
			return parseInt(uuid, 10);
		},

		formatDate: function(timestamp){
		  return (new Date(timestamp)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
		},

		isNullOrBlank: function(s){
			if(s == null || typeof s != "string"){
				return true;
			}
			return (s.trim() == "");
		},

		emptyFn: function(){}

	};

	return Utils;
});
