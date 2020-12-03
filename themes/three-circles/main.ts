const CANVAS_ID = 'canvas';
const LOADER_RADIUS = 128;
const CIRCLE_RADIUS = 32;
const SPEED = 1.5;

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

const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const canvas_width = canvas.width = window.innerWidth;
const canvas_height = canvas.height = window.innerHeight;
const canvas_center: Point = { x: canvas_width / 2, y: canvas_height / 2 };
const three_circles = new ThreeCircles(SPEED);

let time = new Date().getTime();

function main() {
	const new_time = new Date().getTime();
	const delta = (new_time - time) / 1e3;
	time = new_time;
	three_circles.step(delta);
	const positions = three_circles.positions;
	ctx.fillStyle = '#0008';
	ctx.fillRect(0, 0, canvas_width, canvas_height);
	for (const { x, y } of positions) {
		ctx.beginPath();
		ctx.fillStyle = hsvToHex(new Date().getTime() / 6000 % 1, x / 2 + .5, y / 2 + .5);
		ctx.arc(
			canvas_center.x + x * LOADER_RADIUS,
			canvas_center.y + y * LOADER_RADIUS,
			CIRCLE_RADIUS,
			0,
			2 * Math.PI,
		);
		ctx.fill();
		ctx.closePath();
	}
	requestAnimationFrame(main);
}

main();
