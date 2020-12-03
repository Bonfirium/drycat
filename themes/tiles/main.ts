const CANVAS_ID = 'canvas';
const CELL_SIZE = 128;
const COLOR_SPEED = 0.1;

const DX = [1, 0, -1, 0];
const DY = [0, -1, 0, 1];
const canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
const ctx = canvas.getContext('2d')!;
const canvas_width = canvas.width = window.innerWidth;
const canvas_height = canvas.height = window.innerHeight;
const map_width = Math.ceil(canvas_width / CELL_SIZE);
const map_height = Math.ceil(canvas_height / CELL_SIZE);
const offset_x = (map_width * CELL_SIZE - canvas_width) / 2;
const offset_y = (map_height * CELL_SIZE - canvas_height) / 2;

let hue = Math.random();
let x = Math.floor(Math.random() * map_width);
let y = Math.floor(Math.random() * map_height);
let first_step = true;
let prev_direction = -1;

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
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

function hueToHex(hue: number): string {
	const rgb = hsvToRgb(hue, 1, 1);
	return '#' + rgb.map((v) => Math.floor(v * 255).toString(16).padStart(2, '0')).join('');
}

setInterval(() => {
	ctx.fillStyle = hueToHex(hue);
	ctx.fillRect(x * CELL_SIZE - offset_x, y * CELL_SIZE - offset_y, CELL_SIZE, CELL_SIZE);
	ctx.fill();
	hue += (Math.random() - 0.5) * COLOR_SPEED;
	if (hue < 0) hue += 1;
	else if (hue >= 1) hue -= 1;
	const directions = new Array(4).fill(0).map((_, i) => i);
	if (first_step) first_step = false;
	else {
		directions[(prev_direction + 2) % 4] = directions[directions.length - 1];
		directions.pop();
	}
	while (true) {
		const directionIndex = Math.floor(Math.random() * directions.length);
		const direction = directions[directionIndex];
		const xx = x + DX[direction];
		const yy = y + DY[direction];
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
