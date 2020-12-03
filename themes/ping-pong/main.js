"use strict";
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvas_width = canvas.width = window.innerWidth;
var canvas_height = canvas.height = window.innerHeight;
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
    // @ts-ignore
    return '#' + rgb.map(function (v) { return Math.floor(v * 255).toString(16).padStart(2, '0'); }).join('');
}
var y1 = canvas_height / 2;
var y2 = canvas_height / 2;
var pong_size = 32;
var pong_width = 8;
var count = 1000;
var balls_posses = new Array(count)
    // @ts-ignore
    .fill({ x: 0, y: 0 })
    .map(function () { return ({ x: canvas_width / 2, y: canvas_height / 2 }); });
var ball_radius = 8;
var angles = new Array(count).fill(0)
    .map(function () { return (Math.floor(Math.random() * 2) + 1) * Math.PI + Math.random() * Math.PI / 2 - Math.PI / 4; });
var hues = new Array(count).fill(0).map(function () { return Math.random(); });
var ball_speed = 100;
var time = new Date().getTime();
function render() {
    var curr_time = new Date().getTime();
    var delta = (curr_time - time) / 1000;
    for (var i = 0; i < count; i++) {
        angles[i] += (Math.random() - 0.5) * 15 * Math.PI * delta;
        if (angles[i] < 0)
            angles[i] = 2 * Math.PI + angles[i];
        else if (angles[i] > 2 * Math.PI)
            angles[i] = angles[i] - 2 * Math.PI;
        time = curr_time;
        var speed_x = Math.cos(angles[i]) * ball_speed;
        var speed_y = -Math.sin(angles[i]) * ball_speed;
        balls_posses[i].x += speed_x * delta;
        balls_posses[i].y += speed_y * delta;
        if (balls_posses[i].y < ball_radius) {
            angles[i] = Math.PI / 2 - angles[i] + 3 / 2 * Math.PI;
            balls_posses[i].y = ball_radius;
        }
        if (balls_posses[i].y > canvas_height - ball_radius) {
            angles[i] = 2 * Math.PI - angles[i];
            balls_posses[i].y = canvas_height - ball_radius;
        }
        if (balls_posses[i].x < ball_radius) {
            angles[i] = Math.PI - angles[i];
            balls_posses[i].x = ball_radius;
        }
        if (balls_posses[i].x > canvas_width - ball_radius) {
            angles[i] = (2 * Math.PI - 2 * angles[i]) / 2;
            balls_posses[i].x = canvas_width - ball_radius;
        }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    // ctx.clearRect(0, 0, canvas_width, canvas_height);
    // ctx.fillRect(0, y1 - pong_size, pong_width, 2 * pong_size);
    // ctx.fillRect(canvas_width - pong_width, y2 - pong_size, pong_width, 2 * pong_size);
    ctx.fill();
    for (var i = 0; i < count; i++) {
        var ball_pos = balls_posses[i];
        hues[i] += (Math.random() - 0.5) * delta * 5;
        while (hues[i] > 1)
            hues[i] -= 1;
        while (hues[i] < 0)
            hues[i] += 1;
        var hue_1 = hues[i];
        ctx.fillStyle = hueToHex(hue_1 % 1);
        ctx.beginPath();
        ctx.arc(ball_pos.x, ball_pos.y, ball_radius, 0, 360);
        ctx.fill();
        ctx.closePath();
    }
}
setInterval(function () { return render(); }, 17);
