var map = document.getElementById("main").getElementsByTagName("canvas")[0];
var mapContext = map.getContext("2d");
var thumbnail = document.getElementById("operation").getElementsByTagName("canvas")[0];
var thumbnailContext = thumbnail.getContext("2d");
var perText = document.getElementById("operation").getElementsByClassName("button")[0].getElementsByTagName("span")[0];
var form = document.getElementsByClassName("info")[0].getElementsByTagName("form")[0];
var mapJson = document.getElementsByClassName("import")[0].getElementsByTagName("input")[0];
var searchId = document.getElementsByClassName("search")[0].getElementsByTagName("form")[0].getElementsByTagName("input")[0];

// 画布最小长宽，即0%
var minWidth = 580;
var minHeight = 380;
// 画布最大长宽，即100%
var maxWidth = 3480;
var maxHeight = 2280;
// 画布初始长宽
var width = 870;
var height = 570;
// 画布比例，初始10%
var per = 10;
// 所有的设备
var shapes = [];
// 选中设备的下标，未选中为null
var choose;

window.onload = init();

// 给画布添加“点击”事件，只执行一次
{
    map.addEventListener('click', function (e) {
        var x, y;
        x = e.offsetX;
        y = e.offsetY;
        draw({ x: x, y: y });
    }, false);
}

function init() {
    map.setAttribute("width", width);
    map.setAttribute("height", height);
    perText.innerText = per + "%";
    drawAll();
}

// 表单提交【临时】
function mySubmit(type) {
    var formData = new FormData(form);
    if (type.value == "save" && saveValidation(formData)) {
        doSave(formData);
        form.reset();
        clear();
        choose = null;
    } else if (type.value == "delete" && deleteValidation(formData) && window.confirm("是否删除选中的设备？")) {
        shapes.splice(choose, 1);
        form.reset();
        clear();
        choose = null;
    } else if (type.value == "deleteLast" && window.confirm("是否删除上次添加的设备？")) {
        shapes.pop();
        form.reset();
        clear();
        choose = null;
    } else if (type.value == "deleteAll" && window.confirm("是否删除所有设备？")) {
        shapes = [];
        form.reset();
        clear();
        choose = null;
    }
    init();
}

// 表单提交校验【临时】
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
            if (!isEmpty(formData.get("tag")) && shapes[i]["tag"] == formData.get("tag") && choose == null) {
                window.alert("该工位号[" + formData.get("tag") + "]已存在");
                return false;
            }
        }
        if (parseInt(formData.get("coordX")) + parseInt(formData.get("width")) > 580) {
            window.alert("坐标x加宽度不可超过580");
            return false;
        }
        if (parseInt(formData.get("coordY")) + parseInt(formData.get("height")) > 380) {
            window.alert("坐标y加高度不可超过380");
            return false;
        }
        return true;
    }
    return false;
}

// 搜索设备
function search() {
    for (var i = 0; i < shapes.length; i++) {
        if (shapes[i]["id"] == searchId.value) {
            choose = i;
            clear();
            init();
            form.children[0].value = shapes[i]["id"];
            form.children[1].value = shapes[i]["name"];
            form.children[2].value = isEmpty(shapes[i]["tag"]) ? null : shapes[i]["tag"];
            form.children[3].value = shapes[i]["coordX"];
            form.children[4].value = shapes[i]["coordY"];
            form.children[5].value = shapes[i]["width"];
            form.children[6].value = shapes[i]["height"];
            return;
        }
    }
    choose = null;
    clear();
    init();
    form.reset();
    window.alert("没有此编号的设备");
}

// 导入设备校验【临时】
function importValidation(data, num) {
    if (isEmpty(data["id"])) {
        window.alert("第" + num + "个！请输入设备编号");
    } else if (isEmpty(data["name"])) {
        window.alert("第" + num + "个！请输入设备名");
    } else if (isEmpty(data["coordX"])) {
        window.alert("第" + num + "个！请输入坐标x");
    } else if (isEmpty(data["coordY"])) {
        window.alert("第" + num + "个！请输入坐标y");
    } else if (isEmpty(data["width"])) {
        window.alert("第" + num + "个！请输入宽度");
    } else if (isEmpty(data["height"])) {
        window.alert("第" + num + "个！请输入高度");
    } else {
        for (var i = 0; i < shapes.length; i++) {
            if (!isEmpty(data["tag"]) && shapes[i]["tag"] == data["tag"]) {
                window.alert("该工位号[" + data["tag"] + "]已存在");
                return false;
            }
        }
        if (parseInt(data["coordX"]) + parseInt(data["width"]) > 580) {
            window.alert("编号[" + data["id"] + "] 坐标x加宽度不可超过580");
            return false;
        }
        if (parseInt(data["coordY"]) + parseInt(data["height"]) > 380) {
            window.alert("编号[" + data["id"] + "] 坐标y加高度不可超过380");
            return false;
        }
        return true;
    }
    return false;
}

// 删除设备【临时】
function deleteValidation(formData) {
    if (choose == null) {
        window.alert("请选中一个设备");
        return false;
    }
    return true;
}

// 保存｜更新设备【临时】
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
    // var dataJSON = JSON.stringify(shapes);
    // console.log("json:" + dataJSON);
}

// 导入设备【临时】
function importShapes() {
    try {
        var jsonObj = JSON.parse(mapJson.value);
        shapes = [];
        for (var i = 0; i < jsonObj.length; i++) {
            if (!importValidation(jsonObj[i], i + 1)) {
                return;
            }
            shapes[shapes.length] = jsonObj[i];
        }
    } catch (e) {
        window.alert(e);
    } finally {
        clear();
        choose = null;
        init();
    }
}

// 画布放大
function bigger() {
    if (per < 100) {
        width += 10 * ((maxWidth - minWidth) / 100);
        height += 10 * ((maxHeight - minHeight) / 100);
        per += 10;
        clear();
        init();
    }
}

// 画布缩小
function smaller() {
    if (per > 0) {
        width -= 10 * ((maxWidth - minWidth) / 100);
        height -= 10 * ((maxHeight - minHeight) / 100);
        per -= 10;
        clear();
        init();
    }
}

function draw(p) {
    var multiple = (1.0 + 0.05 * per);
    choose = null;

    mapContext.strokeStyle = "black";
    thumbnailContext.strokeStyle = "black";
    clear();
    shapes.forEach(function (v, i) {
        mapContext.beginPath();
        mapContext.rect(v.coordX * multiple, v.coordY * multiple, v.width * multiple, v.height * multiple);
        thumbnailContext.beginPath();
        thumbnailContext.rect(v.coordX * 0.35, v.coordY * 0.35, v.width * 0.35, v.height * 0.35);
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
            shapes[i]["coordX"] * 0.35,
            shapes[i]["coordY"] * 0.35,
            shapes[i]["width"] * 0.35,
            shapes[i]["height"] * 0.35
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
}

function clear(){
    mapContext.clearRect(0, 0, map.width, map.height);
    thumbnailContext.clearRect(0, 0, thumbnail.width, thumbnail.height);
}


// 工具方法：判断字符串是否为空
function isEmpty(str) {
    if (str == null || str.trim() == "") {
        return true;
    }
    return false;
}