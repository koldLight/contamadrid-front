/*
	Utilidades para popups
*/
define([
	'webase/wb-view'
], function(AbstractView){

	var Dialog = AbstractView.extend({

		className: "wb-dialog",
		options: {
			anchor: "body",
			view: new Backbone.View(),
			title: "",

			//custombox
			customboxConfig: {
				effect: 'fadein',
				overlaySpeed: "200",
				overlayColor: "#36404a"
			}
		},

    template: Handlebars.compile(`
			<div class="hidden">
				<button type="button" class="wb-dialog-close close">
					<span>×</span><span class="sr-only">Close</span>
				</button>
				<h4 class="wb-dialog-title">{{title}}</h4>
				<div class="wb-dialog-body"></div>
			</div>
		`),

		events: {
	    "click .wb-dialog-close": "close"
	  },

		onCreate: function(options){
			var me = this;

			me.options.customboxConfig.target = me.$el;
		},

		render: function(){
			var me = this;

			//Create HTML from compiled template and put it in $el (DOM element)
			me.$el.html(me.template({ title: me.options.title }));

			me.control = {
				title: me.$("dialog-title"),
				body: me.$(".dialog-body"),
				btnClose: me.$("dialog-close")
			};

			//Render view inside dialog
			me.control.body.append(me.options.view);
		},

		show: function(){
			var me = this;

			Custombox.open(me.options.customboxConfig);
		},

		close: function(){
			var me = this;

			Custombox.close();
		},

		isOpen: function(){
			var me = this;

			return me.$el.is(":visible");
		}
	};

	return Dialog;
});
