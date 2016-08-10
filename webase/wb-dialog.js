/*
	Utilidades para popups
*/
define([
	'webase/wb-view',
	'webase/wb-utils'
], function(AbstractView, Utils){

	var Dialog = AbstractView.extend({

		className: "wb-dialog",
		options: {
			anchor: "body",
			view: null,
			html: null,
			title: "",

			//custombox
			customboxConfig: {
				effect: 'fadein',
				overlaySpeed: "200",
				overlayColor: "#36404a"
			}
		},

		neverShown: true,

    template: Handlebars.compile(`
			<div id="{{options.name}}" class="modal-demo" style="display:none">
				<button type="button" class="close">
					<span>×</span><span class="sr-only">Close</span>
				</button>
				<h4 class="custom-modal-title">{{options.title}}</h4>
				<div class="custom-modal-text"></div>
			</div>
		`),

		onCreate: function(fn){
			var me = this;

			me.options.customboxConfig.target = "#" + me.options.name;
			me.options.customboxConfig.close = function(){ me.close(); };

			fn(null, null);
		},

		render: function(fn){
			var me = this;

			//Create HTML from compiled template and put it in $el (DOM element)
			me.$el.html(me.template({ options: me.options }));

			me.control = {
				title: me.$(".custom-modal-title"),
				body: me.$(".custom-modal-text"),
				btnClose: me.$(".close")
			};

			//Button close
			me.control.btnClose.on("click", function(){ me.close(); });

			if(fn != null){
				fn(null, null);
			}
		},

		show: function(){
			var me = this;

			//Render view inside dialog
			if(me.neverShown){
				me.neverShown = false;
				if(me.options.html != null){
					me.control.body.append(me.options.html);
					me.$(".wb-close-dialog").on("click", function(){ me.close(); });
				}
			}
			if(me.options.view != null){
				me.options.view.render(function(){

					//Show dialog
					me.$(".wb-close-dialog").on("click", function(){ me.close(); });
					Custombox.open(me.options.customboxConfig);
				});
			}else{

				//Show dialog
				Custombox.open(me.options.customboxConfig);
			}
		},

		close: function(){
			var me = this;

			Custombox.close();
			if(me.options.view != null){
				me.options.view.remove();
			}
			me.remove();
		},

		isOpen: function(){
			var me = this;

			return me.$el.is(":visible");
		}
	});

	return Dialog;
});
