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
var choose;

window.onload = init();

{
    map.addEventListener('click', function (e) {
        p = getEventPosition(e);
        draw(p);
    }, false);
}

function init() {
    map.setAttribute("width", width);
    map.setAttribute("height", height);
    perText.innerText = per + "%";
    drawAll();
}

function mySubmit(type) {
    var formData = new FormData(form);
    if (type.value == "save" && saveValidation(formData)) {
        doSave(formData);
        form.reset();
        mapContext.clearRect(0, 0, map.width, map.height);
        thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
        choose = null;
    } else if (type.value == "delete" && deleteValidation(formData) && window.confirm("是否删除选中的设备？")) {
        shapes.splice(choose, 1);
        form.reset();
        mapContext.clearRect(0, 0, map.width, map.height);
        thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
        choose = null;
    } else if (type.value == "deleteLast" && window.confirm("是否删除上次添加的设备？")) {
        shapes.pop();
        form.reset();
        mapContext.clearRect(0, 0, map.width, map.height);
        thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
        choose = null;
    } else if (type.value == "deleteAll" && window.confirm("是否删除所有设备？")) {
        shapes = [];
        form.reset();
        mapContext.clearRect(0, 0, map.width, map.height);
        thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
        choose = null;
    }
    init();
}

function saveValidation(formData) {
    if (isEmpty(formData.get("id"))) {
        window.alert("请输入设备编号");
    } else if (isEmpty(formData.get("name"))) {
        window.alert("请输入设备名");
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
            if (shapes[i]["id"] == formData.get("id") && choose == null) {
                if (shapes[i]["tag"] == formData.get("tag") || (isEmpty(shapes[i]["tag"]) && isEmpty(formData.get("tag")))) {
                    window.alert("该设备编号和工位号已存在");
                    return false;
                }
            }
            if (!isEmpty(formData.get("tag")) && shapes[i]["tag"] == formData.get("tag") && choose == null) {
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
    if (choose == null) {
        window.alert("请选中一个设备");
        return false;
    }
    return true;
}

function doSave(formData) {
    var newShape = new Object();
    newShape["id"] = formData.get("id");
    newShape["name"] = formData.get("name");
    if (!isEmpty(formData.get("tag"))) {
        newShape["tag"] = formData.get("tag");
    }
    newShape["coordX"] = formData.get("coordX");
    newShape["coordY"] = formData.get("coordY");
    newShape["width"] = formData.get("width");
    newShape["height"] = formData.get("height");
    if (choose == null) {
        shapes[shapes.length] = newShape;
    } else {
        shapes[choose] = newShape;
    }
    console.log(shapes);
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

function getEventPosition(ev) {
    var x, y;
    x = ev.offsetX;
    y = ev.offsetY;
    return { x: x, y: y };
}

function draw(p) {
    var multiple = (1.0 + 0.05 * per);
    var formData = new FormData(form);
    choose = null;

    mapContext.strokeStyle = "black";
    mapContext.clearRect(0, 0, map.width, map.height);
    thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
    shapes.forEach(function (v, i) {
        mapContext.beginPath();
        mapContext.rect(v.coordX * multiple, v.coordY * multiple, v.width * multiple, v.height * multiple);
        thumbnailContext.beginPath();
        thumbnailContext.rect(v.coordX * 0.45, v.coordY * 0.4, v.width * 0.45, v.height * 0.4);
        if (p && mapContext.isPointInPath(p.x, p.y)) {
            choose = i;
            mapContext.fillStyle = "black";
            mapContext.fill();
            thumbnailContext.fillStyle = "black";
            thumbnailContext.fill();

            form.children[0].value = shapes[i]["id"];
            form.children[1].value = shapes[i]["name"];
            form.children[2].value = isEmpty(shapes[i]["tag"]) ? null : shapes[i]["tag"];
            form.children[3].value = shapes[i]["coordX"];
            form.children[4].value = shapes[i]["coordY"];
            form.children[5].value = shapes[i]["width"];
            form.children[6].value = shapes[i]["height"];
        } else {
            mapContext.stroke();
            thumbnailContext.stroke();
        }
    });
    if (choose == null) {
        form.reset();
    }
}

function drawAll() {
    mapContext.strokeStyle = "black";
    thumbnailContext.strokeStyle = "black";
    var multiple = (1.0 + 0.05 * per);
    for (var i = 0; i < shapes.length; i++) {
        mapContext.beginPath();
        thumbnailContext.beginPath();
        mapContext.rect(
            shapes[i]["coordX"] * multiple,
            shapes[i]["coordY"] * multiple,
            shapes[i]["width"] * multiple,
            shapes[i]["height"] * multiple
        );
        thumbnailContext.rect(
            shapes[i]["coordX"] * 0.45,
            shapes[i]["coordY"] * 0.4,
            shapes[i]["width"] * 0.45,
            shapes[i]["height"] * 0.4
        );
        if (i == choose) {
            mapContext.fillStyle = "black";
            mapContext.fill();
            thumbnailContext.fillStyle = "black";
            thumbnailContext.fill();
        } else {
            mapContext.stroke();
            thumbnailContext.stroke();
        }
    }

    // thumbnailContext.beginPath();
    // thumbnailContext.strokeStyle = "blue";
    // thumbnailContext.strokeRect(
    //     0,
    //     0,
    //     180,
    //     120
    // );
}

function isEmpty(str) {
    if (str == null || str.trim() == "") {
        return true;
    }
    return false;
}