var map = document.getElementById("map");
var mapContext = map.getContext("2d");

var graphicWidth = 5;
var graphicHeight = 5;
var interval = 5;
var width = 1200;
var height = 800;

window.onload = init();

function init() {
    map.setAttribute("width", width);
    map.setAttribute("height", height);
    // draw();

}

function bigger() {
    graphicWidth = graphicWidth * 2;
    graphicHeight = graphicHeight * 2;
    width = width * 2;
    height = height * 2;
    mapContext.clearRect(0, 0, map.width, map.height);
    init();
}

function smaller() {
    if (graphicWidth / 2 >= 5) {
        graphicWidth = graphicWidth / 2;
        graphicHeight = graphicHeight / 2;
        width = width / 2;
        height = height / 2;
        mapContext.clearRect(0, 0, map.width, map.height);
        init();
    }
}

function draw() {
    mapContext.beginPath();
    mapContext.fillStyle = "black";
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 50; j++) {
            mapContext.fillRect(
                10 + (graphicWidth + interval) * i,
                10 + (graphicHeight + interval) * j,
                graphicWidth,
                graphicHeight
            );
        }
    }
    mapContext.closePath();
    mapContext.fillStyle = "rgb(255,255,255)";
    mapContext.fill();
}

