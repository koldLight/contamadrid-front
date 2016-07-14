/*
	Validación de formularios
*/

/*
Definitions
{
	textVariable: {
		type: "text",
		min: 3,
		max: 30,
		chars: "a-zA-Z0-9",
		requiredChars: ["a-z", "A-Z", "0-9"]
	},
	integerVariable: {
		type: "int",
		min: Number.NEGATIVE_INFINITY,
		max: Number.POSITIVE_INFINITY,
		onlyPositive: false,
		onlyNegative: false,
		isZeroAllowed: true
	},
	floatVariable: {
		type: "float",
		min: Number.NEGATIVE_INFINITY,
		max: Number.POSITIVE_INFINITY,
		onlyPositive: false,
		onlyNegative: false,
		isZeroAllowed: true,
		precision: 2
	},
	phoneVariable: {
		type: "phone"
	},
	emailVariable: {
		type: "email"
	},
	colorVariable: {
		type: "color"
	}
}

Options
{
	filterInvalidValues: true,
	validateOnBlur: true,
	showErrorMessages: true,
	onValueChanged: null,
	onSubmitClick: null
}
*/

define([
	'resources/js/i18n!resources/nls/strings',
	'webase/wb-utils'
], function(Strings, Utils){

	throw new Error("Not implemented yet");

	//Constructor

	var FormCls = function Form(form, definitions, initialValues, options){
		var me = this;

		//Comprobamos parámetros
		if(!form || !definitions){
			throw new Error("Parameters 'form' and 'definitions' are required");
		}

		//Inicializamos propiedades
		me.form = $(form);
		me.fields = me.form.find("input,textarea,select");
		me.submit = me.form.find("[type='submit']");
		me.initialValues = initialValues || {};
		me.options = _.extend({}, me._defaultOptions, options);
		me.definitions = {};
		_.each(definitions, function(def, key){
			if(def.type == null){ return; }
			var defaultDef = me._defaultDefinitions[def.type];
			me.definitions[key] = _.extend({}, defaultDef, def);
		});

		//Mensajes de error
		if(me.options.showErrorMessages){
			me._createErrorMesagges();
		}

		//Alteramos comportamiento del formulario
		me.form.on("submit.cancelSubmit", function(){
			return false;
		});
		me.submit.on("click.validate", function(e){
			return me._onSubmitClick(e);
		});
		me.fields.on("keydown.nextInputOnKeyEnter", function(e){
			return me._nextInputOnKeyEnterTap(this, e);
		});
		me.fields.on("blur.validateOnBlur", function(e){
			return me._onFieldBlur($(this), e);
		});

		//Pintamos valores iniciales
		me.resetValues();
	};

	FormCls.prototype.destroy = function(){
		var me = this;

		me.fields.off("keydown.nextInputOnKeyEnter");
		me.fields.off("blur.validateOnBlur");
		me.form.off("submit.cancelSubmit");
	};


	//Métodos públicos

	FormCls.prototype.setValues = function(values){
		var me = this;

		for(var key in values){
			var value = values[key];
			var field = me.fields.filter(".input-" + key);
			field.val(value);
		}
	};

	FormCls.prototype.resetValues = function(){
		var me = this;

		me.fields.val("");
		me.setValues(me.initialValues);
	};

	FormCls.prototype.getValues = function(defaults){
		var me = this;

		var values = defaults || {};

		me.fields.each(function(i, field, length){
			var name = Utils.getPropertyStoredInClass(field, "input-");
			values[name] = $(field).val();

			if(me.definitions[name] != null){
				var type = me.definitions[name].type;
				var method = me["_parseValue_" + type];

				if(typeof method == "function"){
					values[name] = method.call(me, values[name]);
				}
			}
		});
		return values;
	};

	FormCls.prototype.validate = function(){
		var me = this;

		me._cleanInputs();

		var values = me.getValues();
		var tests = _.mapObject(values, function(value, key){
			return me._validateField(value, key);
		});

		return tests;
	};


	//Templates

	FormCls.prototype._errorMessagesTpl_text = Handlebars.compile(
		'<span class="help-block error-message message-text-min" style="display:none">{{strings.errorMessageTextMin}}{{def.min}}</span>' +
		'<span class="help-block error-message message-text-max" style="display:none">{{strings.errorMessageTextMax}}{{def.max}}</span>' +
		'<span class="help-block error-message message-text-chars" style="display:none">{{strings.errorMessageTextChars}}{{def.chars}}</span>' +
		'<span class="help-block error-message message-text-requiredChars" style="display:none">{{strings.errorMessageTextRequiredChars}}{{def.requiredChars}}</span>'
	);
	FormCls.prototype._errorMessagesTpl_int = Handlebars.compile(
		'<span class="help-block error-message message-int" style="display:none">{{strings.errorMessageInt}}</span>' +
		'<span class="help-block error-message message-int-min" style="display:none">{{strings.errorMessageIntMin}}{{def.min}}</span>' +
		'<span class="help-block error-message message-int-max" style="display:none">{{strings.errorMessageIntMax}}{{def.max}}</span>' +
		'<span class="help-block error-message message-int-onlyPositive" style="display:none">{{strings.errorMessageIntOnlyPositive}}</span>' +
		'<span class="help-block error-message message-int-onlyNegative" style="display:none">{{strings.errorMessageIntOnlyNegative}}</span>' +
		'<span class="help-block error-message message-int-isZeroAllowed" style="display:none">{{strings.errorMessageIntIsZeroAllowed}}</span>'
	);
	FormCls.prototype._errorMessagesTpl_float = Handlebars.compile(
		'<span class="help-block error-message message-float" style="display:none">{{strings.errorMessageFloat}}</span>' +
		'<span class="help-block error-message message-float-min" style="display:none">{{strings.errorMessageFloatMin}}{{def.min}}</span>' +
		'<span class="help-block error-message message-float-max" style="display:none">{{strings.errorMessageFloatMax}}{{def.max}}</span>' +
		'<span class="help-block error-message message-float-onlyPositive" style="display:none">{{strings.errorMessageFloatOnlyPositive}}</span>' +
		'<span class="help-block error-message message-float-onlyNegative" style="display:none">{{strings.errorMessageFloatOnlyNegative}}</span>' +
		'<span class="help-block error-message message-float-isZeroAllowed" style="display:none">{{strings.errorMessageFloatIsZeroAllowed}}</span>' +
		'<span class="help-block error-message message-float-precision" style="display:none">{{strings.errorMessageFloatPrecision}}</span>'
	);


	//Métodos privados

	FormCls.prototype._cleanInputs = function () {
		var me = this;

		_.each(me.definitions, function(def, key){
			me._cleanInput(def, key);
		});
	};

	FormCls.prototype._cleanInput = function (def, key) {
		var me = this;

		var field = me.form.find(".input-" + key);
		if(def.type == "int"){
			me._cleanIntegerInput(field);
		}
		if(def.type == "float"){
			me._cleanFloatInput(field, def.precision);
		}
	};

	FormCls.prototype._createErrorMesagges = function(){
		var me = this;

		_.each(me.definitions, function(def, key){
			me._createFieldErrorMessages(def, key);
		});
	};

	FormCls.prototype._createFieldErrorMessages = function(def, key){
		var me = this;

		var field = me.form.find(".input-" + key);
		var template = me["_errorMessagesTpl_" + def.type];
		if(template != null){
			field.after(template({ strings: Strings, def: def }));
		}
	};

	FormCls.prototype._onSubmitClick = function(e){
		var me = this;

		var tests = me.validate();
		var values = me.getValues();
		var isValid = _.every(tests, function(test){
			return (test.length == 0);
		});

		if(me.options.showErrorMessages){
			if(isValid){
				me._hideMessages();
			}else{
				me._showMessages(tests);
			}
		}

		if(typeof me.options.onSubmitClick == "function"){
			var scope = (me.option.scope == "object") ? me.options.scope : me;
			me.options.onSubmitClick.call(scope, values, isValid, tests);
		}
	};

	FormCls.prototype._onFieldBlur = function(field, e){
		var me = this;

		var key = Utils.getPropertyStoredInClass(field, "input-");
		var def = me.definitions[key];

		if(def != null){
			me._cleanInput(def, key);
		}

		var value = field.val();
		var tests = me._validateField(value, key);
		var isValid = (tests.length == 0);

		if(me.options.showErrorMessages && me.options.validateOnBlur){
			if(isValid){
				me._hideMessage(field);
			}else{
				me._showFieldMessages(field, tests);
			}
		}

		if(typeof me.options.onValueChanged == "function"){
			var scope = (me.option.scope == "object") ? me.options.scope : me;
			me.options.onValueChanged.call(scope, field, key, value, isValid, e);
		}
	};

	FormCls.prototype._showMessages = function(tests){
		var me = this;

		_.each(tests, function(test, key){
			var field = me.form.find("input-" + key);
			me._showFieldMessages(field, test);
		});
	};

	FormCls.prototype._showFieldMessages = function(field, tests){
		var me = this;

		me._hideMessage(field);

		var group = field.closest(".form-group");
		group.addClass("has-error");
		_.each(tests, function(test){
			var errorMessage = group.find(".message-" + test.replace(/_/g, "-"));
			errorMessage.fadeIn();
		});
	};

	FormCls.prototype._hideMessage = function (field) {
		var me = this;

		var group = field.closest(".form-group");
		if(group.length > 0){
			group.removeClass("has-error")
				.find(".error-message").fadeOut();
		}
	};

	FormCls.prototype._hideMessages = function () {
		var me = this;

		me.form.find(".has-error").removeClass("has-error");
		me.form.find(".error-message").fadeOut();
	};

	FormCls.prototype._validateField = function(value, key){
		var me = this;

		var def = me.definitions[key];

		var tests = _.map(def, function(ruleValue, ruleKey){
			var testName = (ruleKey != "type") ? def.type + "_" + ruleKey : ruleValue;
			var method = me["_validate_" + testName];
			if(typeof method == "function"){
				var isValid = method.call(me, value, ruleValue);
				return (isValid) ? null : testName;
			}
			return null;
		});

		return _.without(tests, null);;
	};

	FormCls.prototype._nextInputOnKeyEnterTap = function(input, e){
		var me = this;

		if (e.keyCode != 13){ return true; }

		var $input = $(input);
		if(me.fields.last()[0] === $input[0]){
			me.submit.trigger("click");
		}else{
			var index;
			me.fields.each(function(i, item, length){
				if($(item)[0] === $input[0]){ index = i; }
			});
			if(index != null){
				me.fields.eq(index + 1).trigger("focus");
			}
		}
	};

	FormCls.prototype._cleanFloatInput = function(input, precision){
		var me = this;

		input = $(input);
		var value = input.val();
		if(value == ""){
			value = 0;
		}else{
			value = value.replace(/[^\-\.\d,]/gi, "").replace(",", ".").trim();
			value = parseFloat(value);
			if(Number.isNaN(value)){
				value = 0;
			}
		}
		input.val(value.toFixed(precision));
		return value;
	};

	FormCls.prototype._cleanIntegerInput = function(input){
		var me = this;

		input = $(input);
		var value = input.val();
		if(value == ""){
			value = 0;
		}else{
			value = value.replace(/[^\-\.\d,]/gi, "").replace(",", ".").trim();
			value = parseInt(value, 10);
			if(Number.isNaN(value)){
				value = 0;
			}
		}
		input.val(value);
		return value;
	};

	FormCls.prototype._parseValue_int = function(value){
		return parseInt(value, 10);
	};

	FormCls.prototype._parseValue_float = function(value){
		return parseFloat(value);
	};

	FormCls.prototype._validate_text = function(value){
		return (typeof value == "string");
	};

	FormCls.prototype._validate_text_min = function(value, minLength){
		return (value.length >= minLength);
	};

	FormCls.prototype._validate_text_max = function(value, maxLength){
		return (value.length <= maxLength);
	};

	FormCls.prototype._validate_text_chars = function(value, exp){
		var r = new RegExp("[^" + exp + "]", "g");
		return !r.test(value);
	};

	FormCls.prototype._validate_text_requiredChars = function(value, expList){
		var isValid = _.every(expList, function(exp){
			var r = new RegExp("[" + exp + "]", "g");
			return r.test(value);
		});
		return isValid;
	};

	FormCls.prototype._validate_int = function(value){
		if(!Utils.isNumeric(value)){
			return false;
		}
		return (value - Math.floor(value) == 0);
	};

	FormCls.prototype._validate_int_min = function(value, minValue){
		return (value >= minValue);
	};

	FormCls.prototype._validate_int_max = function(value, maxValue){
		return (value <= maxValue);
	};

	FormCls.prototype._validate_int_onlyPositive = function(value, enabled){
		return (!enabled || value >= 0);
	};

	FormCls.prototype._validate_int_onlyNegative = function(value, enabled){
		return (!enabled || value <= 0);
	};

	FormCls.prototype._validate_int_isZeroAllowed = function(value, enabled){
		return (enabled || value != 0);
	};

	FormCls.prototype._validate_float = function(value){
		return Utils.isNumeric(value);
	};

	FormCls.prototype._validate_float_min = function(value, minValue){
		return (value >= minValue);
	};

	FormCls.prototype._validate_float_max = function(value, maxValue){
		return (value <= maxValue);
	};

	FormCls.prototype._validate_float_onlyPositive = function(value, enabled){
		return (!enabled || value >= 0);
	};

	FormCls.prototype._validate_float_onlyNegative = function(value, enabled){
		return (!enabled || value <= 0);
	};

	FormCls.prototype._validate_float_isZeroAllowed = function(value, enabled){
		return (enabled || value != 0);
	};

	FormCls.prototype._validate_float_precision = function(value, precision){
		var str = (value + "").split(".");
		if(str.length > 1){
			return (str[1].length <= precision);
		}
		return true;
	};

	FormCls.prototype._defaultDefinitions = {
		text: {
			type: "text",
			min: 3,
			max: 80,
			chars: "a-zA-Z0-9" + Utils.escapeRegExp("+-*/_.,()[]{}¿?¡!@#ºª$%&=€")
		},
		int: {
			type: "int",
			min: Number.NEGATIVE_INFINITY,
			max: Number.POSITIVE_INFINITY,
			onlyPositive: false,
			onlyNegative: false,
			isZeroAllowed: true
		},
		float: {
			type: "float",
			min: Number.NEGATIVE_INFINITY,
			max: Number.POSITIVE_INFINITY,
			onlyPositive: false,
			onlyNegative: false,
			isZeroAllowed: true,
			precision: 2
		},
		phone: {
			type: "phone"
		},
		email: {
			type: "email"
		},
		color: {
			type: "color"
		}
	};

	FormCls.prototype._defaultOptions = {
		filterInvalidValues: true,
		validateOnBlur: true,
		showErrorMessages: true
	};

	return FormCls;
});
