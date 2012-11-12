/*global $,dat,_,Retrofy */
function Dashboard($elements) {
  "use strict";

  var $dashboard, $button, $controls, 
    debug = false,
    showOverlay = false;

  var colorsAndWeights = Retrofy.getColorsAndWeights();
  var labels = {};
  // dat.gui.js
  var gui = new dat.GUI({ autoPlace: false });

  function slideDown() {
    $dashboard.css({
      top : -$dashboard.height() - $button.height()
    });

    $dashboard.animate({
      top : -$dashboard.height()
    },
    {
      duration: 400,
      easing: "ease-out"
    });
  }

  function toggleDashboard() {
    debug=!debug;
    $dashboard.animate({ 
      top : debug ? 0 : -$dashboard.height()
    }, 
    { 
      duration : 200
    }); 
  }

  //console.log(colorsAndWeights);

  function createColorController(colorAndWeight) {
    var label = colorAndWeight.color.name;
    var controller = gui.add(labels, label , 0, 3); 
    var key = colorAndWeight.color.key;
    controller.onChange(_.throttle(function(value) {
      //console.log("update ",key , value);
      Retrofy.setWeight(key,value);
      $elements.retrofy();
    },200));
  }

  // init

  // inject css
  var css = "#dashboard {  position: fixed;  background-color: rgba(0,0,0,1);  color: lime;  left:0;  font-family: 'PT Mono', sans-serif;  font-size: 14px;  padding: 20px;  border-radius: 10px;}.dashboard-panel, .dashboard-widget {  margin-right: 15px;  display: inline-block;  vertical-align: top;}#controls {  display: inline-block;  vertical-align: top;}#dashboard .close-button {   display: none;}.dg.main {  font-size: 13px;}button.dashboard-button {  display: inline-block;  font-size: 16px;  border:0;  background-color: black;  color: #eee;  border-radius: 5px 5px 5px 5px;  padding: 10px;  font-family: c64;}button:hover {  text-shadow: #8f8 0px 0px 5px;}.bottom-panel {  position: absolute;  bottom: -40px;}";
  $("head").append($("<style>").text(css));

  // inject html
  $dashboard = $('<div id="dashboard" class="hidden"><div class="widgets"><div id="controls" class="dashboard-widget"></div><div id="status" class="dashboard-widget"></div></div><div class="bottom-panel"><button class="dashboard-button retro" data-role="dashboard-open">retrofy</button></div></div>');
  $("body").append($dashboard);

  $button = $dashboard.find("[data-role~='dashboard-open']");
  $controls = $("#controls");

  //gui.remember(Settings);
  $controls.append( gui.domElement );

  $(document).keydown(function(e) { 
    if ( e.which == 27 ) toggleDashboard();    
    if ( e.which == 79 ) showOverlay = !showOverlay;
  });

  $button.click(toggleDashboard);

  _.each(colorsAndWeights, function(obj) {
    labels[obj.color.name] = 1;
  });

  for (var key in colorsAndWeights)
    createColorController( colorsAndWeights[key] )  ;

  labels.threshhold = 1;

  var threshholdController = gui.add(labels, "threshhold" , 0, 88); 
  threshholdController.onChange(function(value) {
    Retrofy.setThreshold(value);
    $elements.retrofy();
  });


  $dashboard.show();
  slideDown();

  return {};
}
