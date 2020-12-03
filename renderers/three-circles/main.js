var CANVAS_ID = 'canvas';
var LOADER_RADIUS = 128;
var CIRCLE_RADIUS = 32;
var SPEED = 1.5;
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
var canvas = document.getElementById(CANVAS_ID);
var ctx = canvas.getContext('2d');
var canvas_width = canvas.width = window.innerWidth;
var canvas_height = canvas.height = window.innerHeight;
var canvas_center = { x: canvas_width / 2, y: canvas_height / 2 };
var three_circles = new ThreeCircles(SPEED);
var time = new Date().getTime();
function main() {
    var new_time = new Date().getTime();
    var delta = (new_time - time) / 1e3;
    time = new_time;
    three_circles.step(delta);
    var positions = three_circles.positions;
    ctx.fillStyle = '#0008';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var _a = positions_1[_i], x = _a.x, y = _a.y;
        ctx.beginPath();
        ctx.fillStyle = hsvToHex(new Date().getTime() / 6000 % 1, x / 2 + .5, y / 2 + .5);
        ctx.arc(canvas_center.x + x * LOADER_RADIUS, canvas_center.y + y * LOADER_RADIUS, CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    requestAnimationFrame(main);
}
main();
