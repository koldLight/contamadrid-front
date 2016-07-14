
define([
  'bootstrap',
  'webase/wb-view',
  'resources/js/text!app/template/desktopTpl.html'
], function(Bootstrap, AbstractView, Template) {

  var View = AbstractView.extend({

    className: "desktop-view",
    options: {
      anchor: "#viewport",
      contactEmailAccount: "luzfrias",
      contactEmailDomain: "@gmail.com",
      copyYear: (new Date()).getFullYear() + ""
    },

    template: Handlebars.compile(Template),

    events: {
      "click .footer .contact": "onBtnContactClick"
    },

    onCreate: function(fn) {
      var me = this;

      fn(null, null);
    },

    render: function(fn) {
      var me = this;

      //Create HTML from compiled template and put it in $el (DOM element)
      me.$el.html(me.template({
        strings: app.strings,
        app: app,
        options: me.options
      }));

      //Elements references
      me.control = {
        desktop: me.$el,
        container: me.$el.children(".wrapper").children(".container"),
        menu: me.$(".navigation-menu"),
        menuAction: me.$(".navigation-menu>li"),
        mainContainer: me.$("#mainContainer"),
        footer: me.$(".footer")
      };

			//Toggle menu in mobile
			me.initNavbar();

      //MainMenu selected option
      me.highlightCurrentMenuOption();

      //Resize
      $(window).on("resize", function(e){ me.onResize(e); });

      //Initial focus
      //me.control.email.focus();

      fn(null, null);
    },

    afterFirstRender: function(fn){
      var me = this;

      app.hideLoading(function(){
        me.onResize();
      });

      fn(null, null);
    },

    /****************************
    	EVENT HANDLERS
    *****************************/

    onResize: function(e){
      var me = this;

      var viewportHeight = me.control.container.innerHeight();
      var containerMinHeight = viewportHeight - me.control.footer.outerHeight();
      me.control.mainContainer.css("min-height", containerMinHeight + "px");
    },

    onMenuActionClick: function(e) {
      var me = e.data;

      me.control.menuAction.removeClass("active");
      $(this).addClass("active");
    },

    onLogoClick: function(e) {
      var me = e.data;

      if ($(window).width() < app.config.widthXS) {
        me.toggleMenu();
      } else {
        window.location.assign(app.config.rootPath + "#");
      }
    },

    onBtnContactClick: function(e){
      var me = this;

      var email = me.options.contactEmailAccount + me.options.contactEmailDomain;
      window.open("mailto:" + email, "_blank");
    },

    /****************************
    	METHODS
    *****************************/

    highlightCurrentMenuOption: function() {
      var me = this;

      me.control.menuAction.removeClass("active");
      var href = window.location.href;
      href = href.split("#");
      if (href.length < 2) {
        me.control.menu.find('a[href="#' + app.config.defaultView + '"]').parent().addClass("active");
      } else {
        href = href[1].split("/")[0];
        me.control.menu.find('a[href="#' + href + '"]').parent().addClass("active");
      }
    },

    initNavbar: function() {
      $('.navbar-toggle').on('click', function(event) {
        $(this).toggleClass('open');
        $('#navigation').slideToggle(100);
        $('.cart, .search').removeClass('open');
      });
			$('.navigation-menu>li>a').on('click', function(e) {
				if ($(window).width() < 992) {
					$('.navbar-toggle').removeClass('open');
					$('#navigation').slideToggle(100);
				}
			});
      $('.navigation-menu>li').slice(-1).addClass('last-elements');
      $('.navigation-menu li.has-submenu a[href="#"]').on('click', function(e) {
        if ($(window).width() < 992) {
          e.preventDefault();
          $(this).parent('li').toggleClass('open').find('.submenu:first').toggleClass('open');
        }
      });
    }

  });

  return View;

});
