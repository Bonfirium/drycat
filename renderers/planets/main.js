"use strict";
var HEIGHT_MAP_ID = 'height_map';
var TEMP_MAP_ID = 'temp_map';
var RENDER_ID = 'render';
var height_map = document.getElementById(HEIGHT_MAP_ID);
var height_map_ctx = height_map.getContext('2d');
var canvas_width = height_map.width;
var canvas_height = height_map.height;
var temp_map = document.getElementById(TEMP_MAP_ID);
var temp_map_ctx = temp_map.getContext('2d');
for (var _i = 0, _a = [height_map_ctx, temp_map_ctx]; _i < _a.length; _i++) {
    var ctx_1 = _a[_i];
    ctx_1.fillStyle = 'rgb(127, 127, 127)';
    ctx_1.fillRect(0, 0, canvas_width, canvas_height);
    ctx_1.fill();
}
var step = 256;
function update_map(ctx) {
    var t = Math.random() * canvas_width;
    var b = t + (Math.random() - 0.5) * canvas_width;
    // TODO: check left and right joints
    var tw = Math.random() * canvas_width / 2;
    var bw = Math.random() * canvas_width / 2;
    var tl = t - tw;
    var tr = t + tw;
    var bl = b - bw;
    var br = b + bw;
    if (step > 2)
        step -= 1;
    var alpha = step.toString(16).padStart(2, '0');
    ctx.fillStyle = "#000000" + alpha;
    for (var i = -canvas_width; i <= canvas_width; i += canvas_width) {
        ctx.moveTo(tl + i, 0);
        ctx.beginPath();
        ctx.lineTo(tr + i, 0);
        ctx.lineTo(br + i, canvas_height);
        ctx.lineTo(bl + i, canvas_height);
        ctx.lineTo(tl + i, 0);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillStyle = "#ffffff" + alpha;
    for (var i = -canvas_width; i <= 0; i += canvas_width) {
        ctx.moveTo(tr + i, 0);
        ctx.beginPath();
        ctx.lineTo(tl + i + canvas_width, 0);
        ctx.lineTo(bl + i + canvas_width, canvas_height);
        ctx.lineTo(br + i, canvas_height);
        ctx.lineTo(tr + i, 0);
        ctx.fill();
    }
}
for (var i = 0; i < 1024; i += 1)
    update_map(height_map_ctx);
step = 256;
for (var i = 0; i < 1024; i += 1)
    update_map(temp_map_ctx);
var render = document.getElementById(RENDER_ID);
var gl = render.getContext('webgl');
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, "\n\tattribute vec2 aPosition;\n\tattribute vec2 aTextureCoord;\n\n\tvarying vec2 vTextureCoord;\n\n\tvoid main() {\n\t\tgl_Position = vec4(aPosition, 0, 1);\n\t\tvTextureCoord = aTextureCoord;\n\t}\n");
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader));
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, "\n\t#define PIP2 1.5707963\n\t#define PI 3.1415629\n\t#define TWOPI 6.2831853\n\n\tprecision mediump float;\n\n\tvarying vec2 vTextureCoord;\n\tuniform sampler2D uSampler;\n\tuniform sampler2D uColors;\n\tuniform sampler2D uTemp;\n\tuniform float uRotation;\n\n\tvoid main() {\n\t\tvec2 pos = (vTextureCoord.xy - 0.5) * 2.0;\n\t\tfloat d = pos.x * pos.x + pos.y * pos.y;\n\t\tif (d >= 1.0) {\n\t\t\tgl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n\t\t\treturn;\n\t\t}\n\t\tfloat z = sqrt(1.0 - d);\n\t\tvec4 point = vec4(pos.xy, z, 1.0);\n\t\tfloat x = (atan(point.x, point.z) + PI) / TWOPI + uRotation;\n\t\tfloat y = (asin(point.y) + PIP2) / PI;\n\t\tx -= floor(x);\n\t\tgl_FragColor = texture2D(uSampler, vec2(x, y));\n\t\tfloat pos_temp = y < 0.5 ? y * 2.0 : 1.0 - (y - 0.5) * 2.0;\n\t\tfloat rand_temp = (texture2D(uTemp, vec2(x, y)).r - 0.5) * 2.0 + 0.5;\n\t\tfloat temperature = max(0.0, min(1.0, (rand_temp + pos_temp) / 2.0));\n\t\tgl_FragColor = texture2D(uColors, vec2(temperature, gl_FragColor.r));\n\t\t// if (gl_FragColor.r > 0.52) gl_FragColor = vec4(0.3, 1.0, 0.3, 1.0);\n\t\t// else gl_FragColor = vec4(0.3, 0.3, 1.0, 1.0);\n\t}\n");
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));
var shader = gl.createProgram();
gl.attachShader(shader, vertexShader);
gl.attachShader(shader, fragmentShader);
gl.linkProgram(shader);
gl.useProgram(shader);
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
]), gl.STATIC_DRAW);
var vertexPositionAttribute = gl.getAttribLocation(shader, 'aPosition');
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
var textureCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    1, 1,
]), gl.STATIC_DRAW);
var textureCoordAttribute = gl.getAttribLocation(shader, 'aTextureCoord');
gl.enableVertexAttribArray(textureCoordAttribute);
gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
var rotateAttribute = gl.getUniformLocation(shader, 'uRotation');
var height_map_texture = gl.createTexture();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
var temp_map_texture = gl.createTexture();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
var colors_texture = gl.createTexture();
var colors_image = new Image();
colors_image.onload = function () { return start(); };
colors_image.src = 'colors.png';
var start_time = new Date().getTime();
function start() {
    gl.bindTexture(gl.TEXTURE_2D, colors_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colors_image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.uniform1i(gl.getUniformLocation(shader, 'uColors'), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, height_map_texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, colors_texture);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, temp_map_texture);
    setInterval(function () {
        update_map(height_map_ctx);
        update_map(temp_map_ctx);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, height_map_texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, height_map);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(gl.getUniformLocation(shader, 'uSampler'), 0);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, temp_map_texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, temp_map);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(gl.getUniformLocation(shader, 'uTemp'), 2);
        gl.uniform1f(rotateAttribute, (new Date().getTime() - start_time) / 1e4 % 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 17);
}
