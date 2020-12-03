const HEIGHT_MAP_ID = 'height_map';
const TEMP_MAP_ID = 'temp_map';
const RENDER_ID = 'render';

const height_map = <HTMLCanvasElement>document.getElementById(HEIGHT_MAP_ID);
const height_map_ctx = height_map.getContext('2d')!;
const canvas_width = height_map.width;
const canvas_height = height_map.height;
const temp_map = <HTMLCanvasElement>document.getElementById(TEMP_MAP_ID);
const temp_map_ctx = temp_map.getContext('2d')!;

for (const ctx of [height_map_ctx, temp_map_ctx]) {
	ctx.fillStyle = 'rgb(127, 127, 127)';
	ctx.fillRect(0, 0, canvas_width, canvas_height);
	ctx.fill();
}

let step = 256;

function update_map(ctx: CanvasRenderingContext2D) {
	const t = Math.random() * canvas_width;
	const b = t + (Math.random() - 0.5) * canvas_width;
	// TODO: check left and right joints
	const tw = Math.random() * canvas_width / 2;
	const bw = Math.random() * canvas_width / 2;
	const tl = t - tw;
	const tr = t + tw;
	const bl = b - bw;
	const br = b + bw;
	if (step > 2) step -= 1;
	const alpha = step.toString(16).padStart(2, '0');
	ctx.fillStyle = `#000000${alpha}`;
	for (let i = -canvas_width; i <= canvas_width; i += canvas_width) {
		ctx.moveTo(tl + i, 0);
		ctx.beginPath();
		ctx.lineTo(tr + i, 0);
		ctx.lineTo(br + i, canvas_height);
		ctx.lineTo(bl + i, canvas_height);
		ctx.lineTo(tl + i, 0);
		ctx.closePath();
		ctx.fill();
	}
	ctx.fillStyle = `#ffffff${alpha}`;
	for (let i = -canvas_width; i <= 0; i += canvas_width) {
		ctx.moveTo(tr + i, 0);
		ctx.beginPath();
		ctx.lineTo(tl + i + canvas_width, 0);
		ctx.lineTo(bl + i + canvas_width, canvas_height);
		ctx.lineTo(br + i, canvas_height);
		ctx.lineTo(tr + i, 0);
		ctx.fill();
	}
}

for (let i = 0; i < 1024; i += 1) update_map(height_map_ctx);
step = 256;
for (let i = 0; i < 1024; i += 1) update_map(temp_map_ctx);

const render = <HTMLCanvasElement>document.getElementById(RENDER_ID);
const gl = render.getContext('webgl');

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	attribute vec2 aPosition;
	attribute vec2 aTextureCoord;

	varying vec2 vTextureCoord;

	void main() {
		gl_Position = vec4(aPosition, 0, 1);
		vTextureCoord = aTextureCoord;
	}
`);
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader));

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
	#define PIP2 1.5707963
	#define PI 3.1415629
	#define TWOPI 6.2831853

	precision mediump float;

	varying vec2 vTextureCoord;
	uniform sampler2D uSampler;
	uniform sampler2D uColors;
	uniform sampler2D uTemp;
	uniform float uRotation;

	void main() {
		vec2 pos = (vTextureCoord.xy - 0.5) * 2.0;
		float d = pos.x * pos.x + pos.y * pos.y;
		if (d >= 1.0) {
			gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
			return;
		}
		float z = sqrt(1.0 - d);
		vec4 point = vec4(pos.xy, z, 1.0);
		float x = (atan(point.x, point.z) + PI) / TWOPI + uRotation;
		float y = (asin(point.y) + PIP2) / PI;
		x -= floor(x);
		gl_FragColor = texture2D(uSampler, vec2(x, y));
		float pos_temp = y < 0.5 ? y * 2.0 : 1.0 - (y - 0.5) * 2.0;
		float rand_temp = (texture2D(uTemp, vec2(x, y)).r - 0.5) * 2.0 + 0.5;
		float temperature = max(0.0, min(1.0, (rand_temp + pos_temp) / 2.0));
		gl_FragColor = texture2D(uColors, vec2(temperature, gl_FragColor.r));
		// if (gl_FragColor.r > 0.52) gl_FragColor = vec4(0.3, 1.0, 0.3, 1.0);
		// else gl_FragColor = vec4(0.3, 0.3, 1.0, 1.0);
	}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const shader = gl.createProgram();
gl.attachShader(shader, vertexShader);
gl.attachShader(shader, fragmentShader);
gl.linkProgram(shader);
gl.useProgram(shader);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
	gl.ARRAY_BUFFER,
	new Float32Array([
		-1, -1,
		1, -1,
		-1, 1,
		1, 1,
	]),
	gl.STATIC_DRAW,
);

const vertexPositionAttribute = gl.getAttribLocation(shader, 'aPosition');
gl.enableVertexAttribArray(vertexPositionAttribute);
gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

const textureCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	0, 0,
	1, 0,
	0, 1,
	1, 1,
]), gl.STATIC_DRAW);

const textureCoordAttribute = gl.getAttribLocation(shader, 'aTextureCoord');
gl.enableVertexAttribArray(textureCoordAttribute);
gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

const rotateAttribute = gl.getUniformLocation(shader, 'uRotation');

const height_map_texture = gl.createTexture();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

const temp_map_texture = gl.createTexture();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

const colors_texture = gl.createTexture();
const colors_image = new Image();
colors_image.onload = () => start();
colors_image.src = 'colors.png';

const start_time = new Date().getTime();

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

	setInterval(() => {
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
