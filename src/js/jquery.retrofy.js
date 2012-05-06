/*globals jQuery, document,RGBColor,Utils,Retrofy,console */
(function($) {
  "use strict";

  $.fn.retrofy = function(method) {
    var defaults = {}, settings = {};

    function init($elements, options) {
      settings = $.extend({}, defaults, options);
      $.fn.retrofy.defaults = defaults;
      $.fn.retrofy.settings = settings;
      
      return $elements.each(function() {
        var element = this;    

        //console.log(this.tagName);
        switch (element.tagName)
        {
          case "HTML":
          case "HEAD":
          case "STYLE":
          case "SCRIPT":
          case "TITLE":
          case "META":
          case "LINK":
            break;

          case "IMG":
            convert(element);
            break;
          
          default:
            convertDIV(element);
            break;
        }
          
          
      });
    }

    function convertDIV(el) {
      var colorProps = ["color", "background-color", "border-color"];
      var $el = $(el);
      $.each(colorProps, function(i,propName) {
        var oldColor = $el.css(propName);
        if (!oldColor | oldColor == "rgba(0, 0, 0, 0)") return;
        var parsedColor = new RGBColor(oldColor);
        // console.log(parsedColor);
        var rgb = Retrofy.convertColor(parsedColor.r, parsedColor.g, parsedColor.b).color.rgb;
        // console.log(rgb);
        var newColor = Utils.rgbString(rgb[0],rgb[1],rgb[2]);
        // console.log(el.tagName, propName,oldColor, parsedColor, rgb, newColor);
        $el.css(propName, newColor);
      });
      
      $el.css("font-family", "'c64'");
    }

    function convert(el) {
      // console.log("be converted!" , el);
      
      try 
      {
        convertImage(el);
      }
      catch(ex)
      {
        // console.warn(ex,"image not loaded yet, attaching load event");
        $(el).load( function () {
          console.log("converting second try");
          try 
          {
            convertImage(el);
          }
          catch(ex2)
          {
            console.error(ex2);
          }
        });
      }
    }

    // FIXME: move to Retrofy
    function convertImage(img) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0,0);
      var bmp = ctx.getImageData(0,0,canvas.width,canvas.height);
      
      Retrofy.convert(bmp);
      
      ctx.putImageData(bmp,0,0);
      img.src = canvas.toDataURL();
      //$(img).replaceWith(canvas);
    }

    return init(this, arguments);
  };

}(jQuery));