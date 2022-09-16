// 有问题，暂时存一下
var map = document.getElementById("main").getElementsByTagName("canvas");
var mapContext = map.getContext("2d");

var thumbnail = document.getElementById("operation").getElementsByTagName("canvas");
var thumbnailContext = thumbnail.getContext("2d");

var graphicWidth = 5;
var graphicHeight = 5;
var interval = 5;
var width = 1200;
var height = 800;

window.onload = init();

function init() {
    map.setAttribute("width", width);
    map.setAttribute("height", height);
    draw();

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
    mapContext.strokeRect(
        100,
        100,
        100,
        100
    );
    mapContext.strokeRect(
        200,
        100,
        50,
        50
    );
    mapContext.closePath();
    mapContext.fillStyle = "rgb(255,255,255)";
    mapContext.fill();



    thumbnailContext.beginPath();
    thumbnailContext.strokeStyle = "black";
    thumbnailContext.strokeRect(
        100/6.66,
        100/6.66,
        100/6.66,
        100/6.66
    );
    thumbnailContext.strokeRect(
        200/6.66,
        100/6.66,
        50/6.66,
        50/6.66
    );


    thumbnailContext.strokeStyle = "blue";
    thumbnailContext.strokeRect(
        100/6.66,
        100/6.66,
        100/6.66,
        100/6.66
    );
    thumbnailContext.strokeRect(
        0,
        0,
        180,
        120
    );

    thumbnailContext.closePath();
    thumbnailContext.fillStyle = "rgb(255,255,255)";
    thumbnailContext.fill();

}

