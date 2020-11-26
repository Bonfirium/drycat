export {}
const bound = {
    height: window.innerHeight + 3,
    width: window.innerWidth + 3,
};


const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const img = <HTMLOrSVGImageElement>document.getElementById("cat");
canvas.setAttribute("height", bound.height.toString());
canvas.setAttribute("width", bound.width.toString());
const ctx = canvas.getContext("2d");

const speed = { x: 5, y: 5 };
const add = { width: <number>img.width, height: <number>img.height };
const position = {
    x: Math.floor(canvas.width / 2) - add.width,
    y: Math.floor(canvas.height / 2) - add.height,
};

function anim() {
    ctx.clearRect(position.x, position.y, position.x + add.width, position.y + add.height);
    const newPos = { x: position.x + speed.x, y: position.y + speed.y };
    if (newPos.y <= 0 || newPos.y + add.height >= canvas.height) {
        speed.y = -1 * speed.y;
    }
    if (newPos.x <= 0 || newPos.x + add.width >= canvas.width) {
        speed.x = -1 * speed.x;
    }
    position.x += speed.x;
    position.y += speed.y;
    ctx.fillStyle = "blue";
    ctx.drawImage(img, position.x, position.y);
    window.requestAnimationFrame(anim)
}

anim();
