/*global Zepto,Retrofy,Dashboard */
(function($) {
  "use strict";

  $.fn.retrofy = function(options) {
    var defaults = {}, settings = {};
    var dashboard;

    function init($elements, options) {
      settings = $.extend({}, defaults, options);
      $.fn.retrofy.defaults = defaults;
      $.fn.retrofy.settings = settings;
      
      if (settings.dashboard === true)
        dashboard = dashboard || new Dashboard($elements);

      return $elements.each(function() { Retrofy.retrofy(this); });
    }

    return init(this, options);
  };

}(window.jQuery || Zepto)); // fallback to the included Zepto if jQuery is not found