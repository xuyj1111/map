var map = document.getElementById("main").getElementsByTagName("canvas")[0];
var mapContext = map.getContext("2d");
var thumbnail = document.getElementById("operation").getElementsByTagName("canvas")[0];
var thumbnailContext = thumbnail.getContext("2d");
var perText = document.getElementById("operation").getElementsByClassName("button")[0].getElementsByTagName("span")[0];
var form = document.getElementsByClassName("info")[0].getElementsByTagName("form")[0];

var minWidth = 400;
var minHeight = 300;
var maxWidth = 2400;
var maxHeight = 1800;
var width = 800;
var height = 600;
var per = 20;
var shapes = [];

window.onload = init();

function init() {
    map.setAttribute("width", width);
    map.setAttribute("height", height);
    perText.innerText = per + "%";
    draw();
}

function mySubmit(type) {
    var formData = new FormData(form);
    if (type.value == "save" && saveValidation(formData) == true) {
        doSave(formData);
        form.reset();
    } else if (type.value == "delete" && deleteValidation(formData == true)) {
        doDelete(formData);
        form.reset();
    }
    init();
}

function saveValidation(formData) {
    if (isEmpty(formData.get("id"))) {
        window.alert("请输入设备编号");
    } else if (isEmpty(formData.get("coordX"))) {
        window.alert("请输入坐标x");
    } else if (isEmpty(formData.get("coordY"))) {
        window.alert("请输入坐标y");
    } else if (isEmpty(formData.get("width"))) {
        window.alert("请输入宽度");
    } else if (isEmpty(formData.get("height"))) {
        window.alert("请输入高度");
    } else {
        for (var i = 0; i < shapes.length; i++) {
            if (shapes[i]["id"] == formData.get("id")) {
                window.alert("该设备编号已存在");
                return false;
            }
            if (!isEmpty(formData.get("tag")) && shapes[i]["tag"] == formData.get("tag")) {
                window.alert("该工位号已存在");
                return false;
            }
        }
        if (parseInt(formData.get("coordX")) + parseInt(formData.get("width")) > 400) {
            window.alert("坐标x加宽度不可超过400");
            return false;
        }
        if (parseInt(formData.get("coordY")) + parseInt(formData.get("height")) > 300) {
            window.alert("坐标y加高度不可超过300");
            return false;
        }
        return true;
    }
    return false;
}

function deleteValidation(formData) {

}

function doSave(formData) {
    console.log(shapes.length);
    var newShape = new Object();
    newShape["id"] = formData.get("id");
    if (!isEmpty(formData.get("tag"))) {
        newShape["tag"] = formData.get("tag");
    }
    newShape["coordX"] = formData.get("coordX");
    newShape["coordY"] = formData.get("coordY");
    newShape["width"] = formData.get("width");
    newShape["height"] = formData.get("height");
    shapes[shapes.length] = newShape;
    console.log(shapes);
}

function doDelete(formData) {

}

function bigger() {
    if (per < 100) {
        width += 10 * ((maxWidth - minWidth) / 100);
        height += 10 * ((maxHeight - minHeight) / 100);
        per += 10;
        mapContext.clearRect(0, 0, map.width, map.height);
        init();
    }
}

function smaller() {
    if (per > 0) {
        width -= 10 * ((maxWidth - minWidth) / 100);
        height -= 10 * ((maxHeight - minHeight) / 100);
        per -= 10;
        mapContext.clearRect(0, 0, map.width, map.height);
        init();
    }
}

function draw() {
    mapContext.fillStyle = "black";
    thumbnailContext.strokeStyle = "black";

    var multiple = (1.0 + 0.05 * per);
    for (var i = 0; i < shapes.length; i++) {
        mapContext.beginPath();
        thumbnailContext.beginPath();
        mapContext.strokeRect(
            shapes[i]["coordX"] * multiple,
            shapes[i]["coordY"] * multiple,
            shapes[i]["width"] * multiple,
            shapes[i]["height"] * multiple
        );
        thumbnailContext.strokeRect(
            shapes[i]["coordX"] * 0.45,
            shapes[i]["coordY"] * 0.4,
            shapes[i]["width"] * 0.45,
            shapes[i]["height"] * 0.4
        );
    }

    thumbnailContext.beginPath();
    thumbnailContext.strokeStyle = "blue";
    thumbnailContext.strokeRect(
        0,
        0,
        180,
        120
    );

}

function isEmpty(str) {
    if (str == null || str.trim() == "") {
        return true;
    }
    return false;
}