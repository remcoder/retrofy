/*globals _ */
var Retrofy = (function() {
  "use strict";

  var colors = Retrofy.Colors.C64;
  var keys = _.keys(colors);
  var weights;
  var threshhold = 2; 

  function createWeights () {
    var weights = {};
    _.each(colors, function(v, k) { weights[k] = 1; });
    return weights;
  }

  function getColorsAndWeights() { 
    var result = {};
    _.each(colors, function(value, key) { 
      value.key = key;
      result[key] = { color: value, weight : weights[key] } ;
    });

    return result;
  }

  // time to beat: 282ms
  // time to beat: 145ms (2x)
  // time to beat: 73ms (-3.86x)
  // FIXME: try optimizing by reusing a color object to avoid memory allocation inside the loop
  function convert(imagedata, alpha) {
    var bmp = imagedata.data;
    var matches = new Array(bmp.length/4);
    var blockSize  = 4;
    
    for (var y = 0 ; y < imagedata.height ; y+=blockSize )
    for (var x = 0 ; x < imagedata.width ; x+=blockSize )
    {
      // sample
      var sx = Math.min(x+Math.floor(blockSize/2), imagedata.width-1);
      var sy = Math.min(y+Math.floor(blockSize/2), imagedata.height-1);
      var i = (sy * imagedata.width + sx) * 4;
      var red = bmp[i];
      var green = bmp[i+1];
      var blue = bmp[i+2];
      var a = bmp[i+3];

      var match = convertColor(red, green, blue);
      var color = match.color.rgb;

      for (var ty = 0 ; ty < blockSize ; ty++ )
      for (var tx = 0 ; tx < blockSize ; tx++ )
      {
        var ry = Math.min(y+ty, imagedata.height-1);
        var rx = Math.min(x+tx, imagedata.width-1);
        var k = ( ry*imagedata.width + rx ) * 4;
        bmp[k] = color[0];
        bmp[k+1] = color[1];
        bmp[k+2] = color[2];
        // bmp[k+3] = a;
      } 
    }
  }
  
  function convertColor(red,green,blue) {
    var c64_color = null;
    var min_error = Infinity;

    for (var c=0 ; c<keys.length ; c++)
    {
      var color = colors[c];
      var guess = color.rgb;
      var w = weights[c];
      //var abs = Math.sqr;
      var dr = red - guess[0];
      var dg = green - guess[1];
      var db = blue - guess[2];
      var error = dr*dr/w + dg*dg/w + db*db/w;
      
      if (error < min_error)
      {
        c64_color = color;
        min_error = error;
      }

      if (error < threshhold) 
      {
        break;
      }
    }
    

    return { color: c64_color, error:min_error, earlyExit : c };
  }

  function setWeight(key, value) {
    weights[key] = value;
  }

  function setThreshold(t) {
    threshhold = t*t;
  }

  function init() {
    weights = createWeights();
  }

  init();

  return {
    getColorsAndWeights :  getColorsAndWeights, // TODO : not expose this as immutable
    convert : convert,
    convertColor : convertColor,
    setWeight : setWeight,
    setThreshold : setThreshold
  };
  
}());

