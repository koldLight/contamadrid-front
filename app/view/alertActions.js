define([
  'resources/js/text!app/template/alertActionsTpl.html',
  'webase/wb-view',
  'webase/wb-utils',
  'app/util/common'
], function(Template, AbstractView, Utils, Common) {

  var View = AbstractView.extend({

    className: "alertActions-view",
    options: {
      anchor: "#viewport",
      riskLevel: 1,
      action: 1
    },

    template: Handlebars.compile(Template),

    events: {

    },

    onCreate: function(fn) {
      var me = this;

      fn(null, null);
    },

    render: function(fn) {
      var me = this;

      var r = me.options.riskLevel,
        a = me.options.action,
        text = {
          riskLevelName: app.strings["alertActions_riskLevel" + r + "_name"],
          riskLevelDescription: app.strings["alertActions_riskLevel" + r + "_description"],
          actionCondition: app.strings["alertActions_riskLevel" + r + "_action" + a + "_condition"],
          actionPoints: []
        };

      var i = 1, exists;
      do{
        var point = app.strings["alertActions_riskLevel" + r + "_action" + a + "_point" + i];
        exists = (point != null);
        if(exists){
          text.actionPoints.push(point);
        }
        i++;
      }while(exists);

      //Create HTML from compiled template and put it in $el (DOM element)
      me.$el.html(me.template({
        strings: app.strings,
        config: app.config,
        options: me.options,
        text: text
      }));

      //Reference to view controls
      me.control = {

      };

      fn(null, null);
    },

    afterFirstRender: function(fn) {
      var me = this;

      fn(null, null);
    }

    /****************************
    	EVENT HANDLERS
    *****************************/



    /****************************
    	METHODS
    *****************************/



  });


  return View;

});
