"use strict";
var CANVAS_ID = 'canvas';
var CELL_SIZE = 6;
var LINE_WIDTH = 2;
var COLOR_LENGTH = 1024;
function rand(x) {
    return Math.floor(Math.random() * x);
}
function hsvToRgb(h, s, v) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: return [v, t, p];
        case 1: return [q, v, p];
        case 2: return [p, v, t];
        case 3: return [p, q, v];
        case 4: return [t, p, v];
        case 5: return [v, p, q];
        default: throw new Error();
    }
}
function hueToHex(hue) {
    var rgb = hsvToRgb(hue / COLOR_LENGTH, 1, 1);
    // @ts-ignore
    return '#' + rgb.map(function (v) { return Math.floor(v * 255).toString(16).padStart(2, '0'); }).join('');
}
var DX = [1, 0, -1, 0];
var DY = [0, -1, 0, 1];
var canvas = document.getElementById(CANVAS_ID);
var ctx = canvas.getContext('2d');
var canvas_width = canvas.width = window.innerWidth;
var canvas_height = canvas.height = window.innerHeight;
var map_width = Math.floor(canvas_width / CELL_SIZE);
var map_height = Math.floor(canvas_height / CELL_SIZE);
var offset_x = (map_width * CELL_SIZE - canvas_width + CELL_SIZE) / 2;
var offset_y = (map_height * CELL_SIZE - canvas_height + CELL_SIZE) / 2;
var start_x = rand(map_width);
var start_y = rand(map_height);
var is_used = new Array(map_width).fill(0).map(function () { return new Array(map_height).fill(false); });
is_used[start_x][start_y] = true;
var hues = new Array(map_width).fill(0).map(function () { return new Array(map_height).fill(null); });
var deadends = [];
var max_target = map_width * map_height;
var ways = new Array(map_width).fill(0).map(function () { return new Array(map_height).fill(0).map(function () { return new Array(4).fill(false); }); });
var hue = Math.random();
var x = start_x;
var y = start_y;
hues[x][y] = hue;
var cells_count = 1;
var target = rand(max_target) + 1;
var front = true;
var q = [{ x: x, y: y }];
setInterval(function () {
    step();
}, 17);
function go_front() {
    var _a;
    if (hue >= COLOR_LENGTH)
        hue %= COLOR_LENGTH;
    var dirs = new Array(4).fill(0).map(function (_, i) { return i; });
    for (var i = 0; i < 4; i++) {
        var swap = rand(4);
        _a = [dirs[swap], dirs[i]], dirs[i] = _a[0], dirs[swap] = _a[1];
    }
    for (var i = 0; i < 4; i++) {
        var d = dirs[i];
        var dx = DX[d];
        var dy = DY[d];
        var xx = x + dx;
        var yy = y + dy;
        if (xx < 0 || xx >= map_width || yy < 0 || yy >= map_height || is_used[xx][yy])
            continue;
        hue += 1;
        hues[xx][yy] = hue;
        ways[x][y][d] = true;
        ways[xx][yy][(d + 2) % 4] = true;
        cells_count += 1;
        is_used[xx][yy] = true;
        ctx.strokeStyle = hueToHex(hue);
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE + offset_x, y * CELL_SIZE + offset_y);
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineTo(xx * CELL_SIZE + offset_x, yy * CELL_SIZE + offset_y);
        ctx.stroke();
        ctx.closePath();
        x = xx;
        y = yy;
        q.push({ x: x, y: y });
        return true;
    }
    return false;
}
function go_back() {
    var variants_ds = [];
    for (var i = 0; i < 4; i++) {
        var xx = x + DX[i];
        var yy = y + DY[i];
        if (xx < 0 || xx >= map_width || yy < 0 || yy >= map_height || !ways[x][y][i])
            continue;
        variants_ds.push(i);
    }
    if (variants_ds.length === 0 || variants_ds.length > 1)
        return false;
    cells_count -= 1;
    is_used[x][y] = false;
    var d = variants_ds[0];
    var x_to = x + DX[d];
    var y_to = y + DY[d];
    ways[x][y][d] = false;
    ways[x_to][y_to][(d + 2) % 4] = false;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE + offset_x, y * CELL_SIZE + offset_y);
    ctx.lineWidth = LINE_WIDTH + 2;
    ctx.lineTo(x_to * CELL_SIZE + offset_x, y_to * CELL_SIZE + offset_y);
    ctx.stroke();
    ctx.closePath();
    x = x_to;
    y = y_to;
    return true;
}
function add_deadend(x, y) {
    deadends.push({ x: x, y: y });
    ctx.fillStyle = '#ffffff';
    // ctx.fillRect(x * CELL_SIZE - CELL_SIZE / 2 + 2, y * CELL_SIZE - CELL_SIZE / 2 + 2, CELL_SIZE - 2, CELL_SIZE - 2);
}
function pop_random_deadend() {
    var deadead_index = rand(deadends.length);
    var result = deadends[deadead_index];
    if (deadead_index < deadends.length - 1)
        deadends[deadead_index] = deadends.pop();
    else
        deadends.pop();
    ctx.fillStyle = '#ff00ff';
    var x = result.x, y = result.y;
    // ctx.fillRect(x * CELL_SIZE - CELL_SIZE / 2 + 2, y * CELL_SIZE - CELL_SIZE / 2 + 2, CELL_SIZE - 2, CELL_SIZE - 2);
    return result;
}
function change_diraction() {
    var _a;
    if (front) {
        front = false;
        target = rand(cells_count);
        add_deadend(x, y);
        (_a = pop_random_deadend(), x = _a.x, y = _a.y);
    }
    else {
        front = true;
        target = rand(max_target - cells_count - 1) + cells_count + 1;
        hue = hues[x][y];
    }
}
function step() {
    var _a, _b;
    if (front) {
        var backed = false;
        while (!go_front()) {
            if (!backed) {
                add_deadend(x, y);
                backed = true;
            }
            // if (q.length === 0) return change_diraction();
            if (q.length === 0)
                return;
            (_a = q.pop(), x = _a.x, y = _a.y);
            hue -= 1;
            if (hue < 0)
                hue = COLOR_LENGTH - (-hue % COLOR_LENGTH);
        }
        ;
        // if (cells_count === target) change_diraction();
    }
    else {
        while (!go_back()) {
            if (deadends.length === 0)
                return;
            (_b = pop_random_deadend(), x = _b.x, y = _b.y);
        }
        if (cells_count === target)
            change_diraction();
    }
}
