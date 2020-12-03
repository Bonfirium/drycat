const canvas = <HTMLCanvasElement>document.getElementById('canvas');

const ctx = canvas.getContext('2d')!;
const canvas_width = canvas.width = window.innerWidth;
const canvas_height = canvas.height = window.innerHeight;

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
	// @ts-ignore
	return '#' + rgb.map((v) => Math.floor(v * 255).toString(16).padStart(2, '0')).join('');
}

const y1 = canvas_height / 2;
const y2 = canvas_height / 2;
const pong_size = 32;
const pong_width = 8;
const count = 1000;
const balls_posses: Array<{ x: number, y: number }> = new Array(count)
	// @ts-ignore
	.fill({ x: 0, y: 0 })
	.map(() => ({ x: canvas_width / 2, y: canvas_height / 2 }));
const ball_radius = 8;
const angles: Array<number> = new Array(count).fill(0)
	.map(() => (Math.floor(Math.random() * 2) + 1) * Math.PI + Math.random() * Math.PI / 2 - Math.PI / 4);
const hues: Array<number> = new Array(count).fill(0).map(() => Math.random());
const ball_speed = 100;
let time = new Date().getTime();

function render() {
	const curr_time = new Date().getTime();
	const delta = (curr_time - time) / 1000;
	for (let i = 0; i < count; i++) {
		angles[i] += (Math.random() - 0.5) * 15 * Math.PI * delta;
		if (angles[i] < 0) angles[i] = 2 * Math.PI + angles[i];
		else if (angles[i] > 2 * Math.PI) angles[i] = angles[i] - 2 * Math.PI;
		time = curr_time;
		const speed_x = Math.cos(angles[i]) * ball_speed;
		const speed_y = -Math.sin(angles[i]) * ball_speed;
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
	for (let i = 0; i < count; i++) {
		const ball_pos = balls_posses[i];
		hues[i] += (Math.random() - 0.5) * delta * 5;
		while (hues[i] > 1) hues[i] -= 1;
		while (hues[i] < 0) hues[i] += 1;
		const hue = hues[i];
		ctx.fillStyle = hueToHex(hue % 1);
		ctx.beginPath();
		ctx.arc(ball_pos.x, ball_pos.y, ball_radius, 0, 360);
		ctx.fill();
		ctx.closePath();
	}
}

setInterval(() => render(), 17);
