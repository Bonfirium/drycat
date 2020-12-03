var CANVAS_ID = 'canvas';
function rand(x) {
    return Math.random() * x;
}
function d_rand(x) {
    return rand(x) - x / 2;
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
function correctSV(x, min, max) {
    x = Math.abs(x);
    if (x >= 2)
        x %= 2;
    if (x >= 1)
        x = 1 - x % 1;
    return x * (max - min) + min;
}
function correctH(h) {
    if (h < 0)
        h = 1 - h % 1;
    if (h >= 1)
        h %= 1;
    return h;
}
function hsvToHex(h, s, v) {
    return '#' + hsvToRgb(correctH(h), correctSV(s, .25, .75), correctSV(v, .25, .75))
        .map(function (v) { return Math.floor(v * 255).toString(16).padStart(2, '0'); }).join('');
}
var canvas = document.getElementById(CANVAS_ID);
var ctx = canvas.getContext('2d', { alpha: false });
var canvas_width = canvas.width = window.innerWidth;
var canvas_height = canvas.height = window.innerHeight;
var min_side = Math.min(canvas_width, canvas_height);
var offset = canvas_width > canvas_height
    ? { x: (canvas_width - min_side) / 2, y: 0 }
    : { x: 0, y: (canvas_height - min_side) / 2 };
var ThreeCircles = /** @class */ (function () {
    function ThreeCircles(speed) {
        this.speed = speed;
        this.pos = Math.random();
        var angle = Math.random() * 2 * Math.PI;
        this.points = new Array(3).fill(0).map(function (_, i) { return angle + i * 2 * Math.PI / 3; });
        this.run();
    }
    Object.defineProperty(ThreeCircles.prototype, "positions", {
        get: function () {
            var _this = this;
            // const pos = this.pos < .5 ? (1 - Math.cos(this.pos * 2 * Math.PI)) / 2 : 1;
            var pos = (1 - Math.cos(this.pos * Math.PI)) / 2;
            return new Array(3).fill(0).map(function (_, i) {
                if (_this.swap === i) {
                    var start = { x: Math.cos(_this.points[i]), y: -Math.sin(_this.points[i]) };
                    var finish = { x: Math.cos(_this.points_dest[i]), y: -Math.sin(_this.points_dest[i]) };
                    return { x: start.x + (finish.x - start.x) * pos, y: start.y + (finish.y - start.y) * pos };
                }
                else {
                    var angle = _this.points[i] + (_this.points_dest[i] - _this.points[i]) * pos;
                    return { x: Math.cos(angle), y: -Math.sin(angle) };
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    ThreeCircles.prototype.step = function (delta) {
        var _a;
        this.pos += this.speed * delta;
        if (this.pos > 1) {
            this.pos %= 1;
            this.points = this.points_dest;
            if (this.swap !== undefined) {
                var swapped = (this.swap + 1) % 3;
                _a = [this.points[swapped], this.points[this.swap]], this.points[this.swap] = _a[0], this.points[swapped] = _a[1];
            }
            this.run();
        }
    };
    ThreeCircles.prototype.run = function () {
        var _this = this;
        if (Math.random() < .3) {
            this.swap = this.swap === undefined ? Math.floor(Math.random() * 3) : (function () {
                var res = Math.floor(Math.random() * 2);
                return res >= (_this.swap + 1) % 3 ? (res + 1) % 3 : res;
            })();
        }
        else
            this.swap = undefined;
        if (this.swap !== undefined) {
            this.points_dest = this.points.slice();
            this.points_dest[this.swap] += Math.PI;
            this.points_dest[(this.swap + 1) % 3] -= Math.PI / 3;
            this.points_dest[(this.swap + 2) % 3] += Math.PI / 3;
        }
        else {
            var angle_1 = (Math.random() * Math.PI / 3 + Math.PI / 3) * (Math.random() < .5 ? 1 : -1);
            this.points_dest = this.points.map(function (point) { return point + angle_1; });
        }
    };
    return ThreeCircles;
}());
var DValue = /** @class */ (function () {
    function DValue(max_d, value, d_speed) {
        this.max_d = max_d;
        this.value = value;
        this.d_speed = d_speed;
        this.d = rand(this.max_d * 2) - max_d;
    }
    DValue.prototype.step = function (d_time) {
        this.value += this.d * d_time;
        this.d += rand(this.d_speed * 2) - this.d_speed;
        if (this.d > this.max_d)
            this.d = this.max_d;
        else if (this.d < -this.max_d)
            this.d = -this.max_d;
    };
    return DValue;
}());
var hue = new DValue(0.05, rand(1), 0.005);
var dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
var rad = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
var big_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
var main_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
var out_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
var color = new ThreeCircles(1);
var time = new Date().getTime();
function degtorad(degrees) {
    return degrees * Math.PI / 180;
}
;
function customCircleDraw(x, y, radius) {
    var steps_count = 50;
    var step_size = 2 * Math.PI / steps_count;
    var angle = 0;
    var first = true;
    while (angle < 2 * Math.PI + step_size * 2) {
        var px = (Math.sin(angle) * radius) + x;
        var py = (-Math.cos(angle) * radius) + y;
        if (first) {
            ctx.moveTo(px, py);
            first = false;
        }
        else {
            ctx.lineTo(px, py);
        }
        angle = angle + step_size;
    }
}
function render() {
    var new_time = new Date().getTime();
    var d_time = (new_time - time) * .3e-3;
    time = new_time;
    // const d_time = 5e-3;
    for (var _i = 0, _a = [hue, dir, rad, big_dir, main_dir, color]; _i < _a.length; _i++) {
        var dValue = _a[_i];
        dValue.step(d_time);
    }
    var center_offset = Math.cos(rad.value);
    var color_positions = color.positions;
    function toHex(pos) {
        return hsvToHex(hue.value, pos.x * .2 + .5, pos.y * .2 + .5);
    }
    ctx.fillStyle = toHex(color_positions[0]);
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    var small_center = {
        x: (Math.cos(dir.value) * center_offset * min_side + min_side) / 2,
        y: (-Math.sin(dir.value) * center_offset * min_side + min_side) / 2,
    };
    ctx.beginPath();
    ctx.fillStyle = toHex(color_positions[1]);
    var main_center = {
        x: small_center.x + Math.cos(main_dir.value) * min_side * .55 / 2,
        y: small_center.y - Math.sin(main_dir.value) * min_side * .55 / 2,
    };
    customCircleDraw(main_center.x + offset.x, main_center.y + offset.y, min_side * .47);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = min_side * .04;
    ctx.strokeStyle = toHex(color_positions[2]);
    customCircleDraw(small_center.x + offset.x, small_center.y + offset.y, min_side * .35 / 2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    var big_center = {
        x: small_center.x + Math.cos(big_dir.value) * min_side * .35 / 2,
        y: small_center.y - Math.sin(big_dir.value) * min_side * .35 / 2,
    };
    customCircleDraw(big_center.x + offset.x, big_center.y + offset.y, min_side * .35);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    var out_center = {
        x: small_center.x + Math.cos(out_dir.value) * min_side * .85 / 2,
        y: small_center.y - Math.sin(out_dir.value) * min_side * .85 / 2,
    };
    customCircleDraw(out_center.x + offset.x, out_center.y + offset.y, min_side * .60);
    ctx.stroke();
    ctx.closePath();
    requestAnimationFrame(render);
}
;
render();
