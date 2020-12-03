"use strict";
var CANVAS_ID = 'canvas';
var CELL_SIZE = 128;
var COLOR_SPEED = 0.1;
var DX = [1, 0, -1, 0];
var DY = [0, -1, 0, 1];
var canvas = document.getElementById(CANVAS_ID);
var ctx = canvas.getContext('2d');
var canvas_width = canvas.width = window.innerWidth;
var canvas_height = canvas.height = window.innerHeight;
var map_width = Math.ceil(canvas_width / CELL_SIZE);
var map_height = Math.ceil(canvas_height / CELL_SIZE);
var offset_x = (map_width * CELL_SIZE - canvas_width) / 2;
var offset_y = (map_height * CELL_SIZE - canvas_height) / 2;
var hue = Math.random();
var x = Math.floor(Math.random() * map_width);
var y = Math.floor(Math.random() * map_height);
var first_step = true;
var prev_direction = -1;
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
    var rgb = hsvToRgb(hue, 1, 1);
    return '#' + rgb.map(function (v) { return Math.floor(v * 255).toString(16).padStart(2, '0'); }).join('');
}
setInterval(function () {
    ctx.fillStyle = hueToHex(hue);
    ctx.fillRect(x * CELL_SIZE - offset_x, y * CELL_SIZE - offset_y, CELL_SIZE, CELL_SIZE);
    ctx.fill();
    hue += (Math.random() - 0.5) * COLOR_SPEED;
    if (hue < 0)
        hue += 1;
    else if (hue >= 1)
        hue -= 1;
    var directions = new Array(4).fill(0).map(function (_, i) { return i; });
    if (first_step)
        first_step = false;
    else {
        directions[(prev_direction + 2) % 4] = directions[directions.length - 1];
        directions.pop();
    }
    while (true) {
        var directionIndex = Math.floor(Math.random() * directions.length);
        var direction = directions[directionIndex];
        var xx = x + DX[direction];
        var yy = y + DY[direction];
        if (xx >= 0 && xx < map_width && yy >= 0 && yy < map_height) {
            x = xx;
            y = yy;
            prev_direction = direction;
            break;
        }
        directions[directionIndex] = directions[directions.length - 1];
        directions.pop();
    }
}, 17);
