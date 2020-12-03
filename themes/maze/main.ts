const CANVAS_ID = 'canvas';
const CELL_SIZE = 6;
const LINE_WIDTH = 2;
const COLOR_LENGTH = 1024;

function rand(x: number): number {
	return Math.floor(Math.random() * x);
}

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
	const rgb = hsvToRgb(hue / COLOR_LENGTH, 1, 1);
	// @ts-ignore
	return '#' + rgb.map((v) => Math.floor(v * 255).toString(16).padStart(2, '0')).join('');
}

const DX = [1, 0, -1, 0];
const DY = [0, -1, 0, 1];

const canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const canvas_width = canvas.width = window.innerWidth;
const canvas_height = canvas.height = window.innerHeight;
const map_width = Math.floor(canvas_width / CELL_SIZE);
const map_height = Math.floor(canvas_height / CELL_SIZE);
const offset_x = (map_width * CELL_SIZE - canvas_width + CELL_SIZE) / 2;
const offset_y = (map_height * CELL_SIZE - canvas_height + CELL_SIZE) / 2;
const start_x = rand(map_width);
const start_y = rand(map_height);
const is_used = new Array(map_width).fill(0).map(() => new Array(map_height).fill(false));
is_used[start_x][start_y] = true;
const hues: (null | number)[][] = new Array(map_width).fill(0).map(() => new Array(map_height).fill(null));
const deadends: { x: number, y: number }[] = [];
const max_target = map_width * map_height;
const ways = new Array(map_width).fill(0).map(() => new Array(map_height).fill(0).map(() => new Array(4).fill(false)));

let hue = Math.random();
let x = start_x;
let y = start_y;
hues[x][y] = hue;
let cells_count = 1;
let target = rand(max_target) + 1;
let front = true;

const q = [{ x, y }];

setInterval(() => {
	step();
}, 17);

function go_front() {
	if (hue >= COLOR_LENGTH) hue %= COLOR_LENGTH;
	const dirs = new Array(4).fill(0).map((_, i) => i);
	for (let i = 0; i < 4; i++) {
		const swap = rand(4);
		[dirs[i], dirs[swap]] = [dirs[swap], dirs[i]];
	}
	for (let i = 0; i < 4; i++) {
		const d = dirs[i];
		const dx = DX[d];
		const dy = DY[d];
		const xx = x + dx;
		const yy = y + dy;
		if (xx < 0 || xx >= map_width || yy < 0 || yy >= map_height || is_used[xx][yy]) continue;
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
		q.push({ x, y });
		return true;
	}
	return false;
}

function go_back(): boolean {
	const variants_ds: number[] = [];
	for (let i = 0; i < 4; i++) {
		const xx = x + DX[i];
		const yy = y + DY[i];
		if (xx < 0 || xx >= map_width || yy < 0 || yy >= map_height || !ways[x][y][i]) continue;
		variants_ds.push(i);
	}
	if (variants_ds.length === 0 || variants_ds.length > 1) return false;
	cells_count -= 1;
	is_used[x][y] = false;
	const d = variants_ds[0];
	const x_to = x + DX[d];
	const y_to = y + DY[d];
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

function add_deadend(x: number, y: number) {
	deadends.push({ x, y });
	ctx.fillStyle = '#ffffff';
	// ctx.fillRect(x * CELL_SIZE - CELL_SIZE / 2 + 2, y * CELL_SIZE - CELL_SIZE / 2 + 2, CELL_SIZE - 2, CELL_SIZE - 2);
}

function pop_random_deadend() {
	const deadead_index = rand(deadends.length);
	const result = deadends[deadead_index];
	if (deadead_index < deadends.length - 1) deadends[deadead_index] = deadends.pop();
	else deadends.pop();
	ctx.fillStyle = '#ff00ff';
	const { x, y } = result;
	// ctx.fillRect(x * CELL_SIZE - CELL_SIZE / 2 + 2, y * CELL_SIZE - CELL_SIZE / 2 + 2, CELL_SIZE - 2, CELL_SIZE - 2);
	return result;
}

function change_diraction() {
	if (front) {
		front = false;
		target = rand(cells_count);
		add_deadend(x, y);
		({ x, y } = pop_random_deadend());
	} else {
		front = true;
		target = rand(max_target - cells_count - 1) + cells_count + 1;
		hue = hues[x][y];
	}
}

function step() {
	if (front) {
		let backed = false;
		while (!go_front()) {
			if (!backed) {
				add_deadend(x, y);
				backed = true;
			}
			// if (q.length === 0) return change_diraction();
			if (q.length === 0) return;
			({ x, y } = q.pop());
			hue -= 1;
			if (hue < 0) hue = COLOR_LENGTH - (-hue % COLOR_LENGTH);
		};
		// if (cells_count === target) change_diraction();
	} else {
		while (!go_back()) {
			if (deadends.length === 0) return;
			({ x, y } = pop_random_deadend());
		}
		if (cells_count === target) change_diraction();
	}
}
