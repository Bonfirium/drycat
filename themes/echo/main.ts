const CANVAS_ID = 'canvas';

function rand(x: number): number {
	return Math.random() * x;
}

function d_rand(x: number): number {
	return rand(x) - x / 2;
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

function correctSV(x: number, min: number, max: number): number {
	x = Math.abs(x);
	if (x >= 2) x %= 2;
	if (x >= 1) x = 1 - x % 1;
	return x * (max - min) + min;
}

function correctH(h: number): number {
	if (h < 0) h = 1 - h % 1;
	if (h >= 1) h %= 1;
	return h;
}

function hsvToHex(h: number, s: number, v: number): string {
	return '#' + hsvToRgb(correctH(h), correctSV(s, .25, .75), correctSV(v, .25, .75))
		.map((v) => Math.floor(v * 255).toString(16).padStart(2, '0')).join('');
}


const canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false });
const canvas_width = canvas.width = window.innerWidth;
const canvas_height = canvas.height = window.innerHeight;

const min_side = Math.min(canvas_width, canvas_height);
const offset = canvas_width > canvas_height
	? { x: (canvas_width - min_side) / 2, y: 0 }
	: { x: 0, y: (canvas_height - min_side) / 2 };

interface Point { x: number; y: number; }

class ThreeCircles {
	public pos: number;
	public swap?: number;
	public points: [number, number, number];
	public points_dest: [number, number, number];
	constructor(public speed: number) {
		this.pos = Math.random();
		const angle = Math.random() * 2 * Math.PI;
		this.points = new Array(3).fill(0).map((_, i) => angle + i * 2 * Math.PI / 3) as ThreeCircles['points'];
		this.run();
	}
	get positions(): [Point, Point, Point] {
		// const pos = this.pos < .5 ? (1 - Math.cos(this.pos * 2 * Math.PI)) / 2 : 1;
		const pos = (1 - Math.cos(this.pos * Math.PI)) / 2;
		return new Array(3).fill(0).map<Point>((_, i) => {
			if (this.swap === i) {
				const start: Point = { x: Math.cos(this.points[i]), y: -Math.sin(this.points[i]) };
				const finish: Point = { x: Math.cos(this.points_dest[i]), y: -Math.sin(this.points_dest[i]) };
				return { x: start.x + (finish.x - start.x) * pos, y: start.y + (finish.y - start.y) * pos };
			} else {
				const angle = this.points[i] + (this.points_dest[i] - this.points[i]) * pos;
				return { x: Math.cos(angle), y: -Math.sin(angle) };
			}
		}) as ThreeCircles['positions'];
	}
	step(delta: number) {
		this.pos += this.speed * delta;
		if (this.pos > 1) {
			this.pos %= 1;
			this.points = this.points_dest;
			if (this.swap !== undefined) {
				const swapped = (this.swap + 1) % 3;
				[this.points[this.swap], this.points[swapped]] = [this.points[swapped], this.points[this.swap]];
			}
			this.run();
		}
	}
	run() {
		if (Math.random() < .3) {
			this.swap = this.swap === undefined ? Math.floor(Math.random() * 3) : (() => {
				const res = Math.floor(Math.random() * 2);
				return res >= (this.swap + 1) % 3 ? (res + 1) % 3 : res;
			})();
		} else this.swap = undefined;
		if (this.swap !== undefined) {
			this.points_dest = [...this.points] as ThreeCircles['points_dest'];
			this.points_dest[this.swap] += Math.PI;
			this.points_dest[(this.swap + 1) % 3] -= Math.PI / 3;
			this.points_dest[(this.swap + 2) % 3] += Math.PI / 3;
		} else {
			const angle = (Math.random() * Math.PI / 3 + Math.PI / 3) * (Math.random() < .5 ? 1 : -1);
			this.points_dest = this.points.map((point) => point + angle) as ThreeCircles['points_dest'];
		}
	}
}

class DValue {
	public d: number;
	constructor(public readonly max_d: number, public value: number, public d_speed: number) {
		this.d = rand(this.max_d * 2) - max_d;
	}
	step(d_time: number) {
		this.value += this.d * d_time;
		this.d += rand(this.d_speed * 2) - this.d_speed;
		if (this.d > this.max_d) this.d = this.max_d;
		else if (this.d < -this.max_d) this.d = -this.max_d;
	}
}

const hue = new DValue(0.05, rand(1), 0.005);
const dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
const rad = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
const big_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
const main_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
const out_dir = new DValue(Math.PI / 8, rand(2 * Math.PI), Math.PI / 256);
const color = new ThreeCircles(1);

let time = new Date().getTime();

function degtorad(degrees: number) {
	return degrees * Math.PI / 180;
};

function customCircleDraw(x: number, y: number, radius: number) {
	const steps_count = 50;
	var step_size = 2 * Math.PI / steps_count;
	var angle = 0;
	var first = true;
	while (angle < 2 * Math.PI + step_size * 2) {
		let px = (Math.sin(angle) * radius) + x;
		let py = (-Math.cos(angle) * radius) + y;
		if (first) {
			ctx.moveTo(px, py);
			first = false;
		} else {
			ctx.lineTo(px, py);
		}
		angle = angle + step_size;
	}
}

function render() {
	const new_time = new Date().getTime();
	const d_time = (new_time - time) * .3e-3;
	time = new_time;
	// const d_time = 5e-3;
	for (const dValue of [hue, dir, rad, big_dir, main_dir, color]) dValue.step(d_time);
	const center_offset = Math.cos(rad.value);
	const color_positions = color.positions;

	function toHex(pos: typeof color_positions[0]) {
		return hsvToHex(hue.value, pos.x * .2 + .5, pos.y * .2 + .5);
	}

	ctx.fillStyle = toHex(color_positions[0]);
	ctx.fillRect(0, 0, canvas_width, canvas_height);

	const small_center = {
		x: (Math.cos(dir.value) * center_offset * min_side + min_side) / 2,
		y: (-Math.sin(dir.value) * center_offset * min_side + min_side) / 2,
	};

	ctx.beginPath();
	ctx.fillStyle = toHex(color_positions[1]);
	const main_center = {
		x: small_center.x + Math.cos(main_dir.value) * min_side * .55 / 2,
		y: small_center.y - Math.sin(main_dir.value) * min_side * .55 / 2,
	}
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
	const big_center = {
		x: small_center.x + Math.cos(big_dir.value) * min_side * .35 / 2,
		y: small_center.y - Math.sin(big_dir.value) * min_side * .35 / 2,
	}
	customCircleDraw(big_center.x + offset.x, big_center.y + offset.y, min_side * .35);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = 'white';
	const out_center = {
		x: small_center.x + Math.cos(out_dir.value) * min_side * .85 / 2,
		y: small_center.y - Math.sin(out_dir.value) * min_side * .85 / 2,
	}
	customCircleDraw(out_center.x + offset.x, out_center.y + offset.y, min_side * .60);
	ctx.stroke();
	ctx.closePath();
	requestAnimationFrame(render);
};

render();
