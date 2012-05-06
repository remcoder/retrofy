var Utils = (function() {


  String.prototype.format = function (o) {
    return this.replace(/\{([^{}]*)\}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };

  function rgbString(r,g,b) {
    return "rgb({r},{g},{b})".format({r:r,g:g,b:b});
  }

  return {
    rgbString : rgbString
  };

}());