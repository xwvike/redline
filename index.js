function slope(x1, y1, x2, y2) {
    return (y2 - y1) / (x2 - x1);
}

function getNewPoint(ax, ay, bx, by, lengthToSubtract) {
    const distance = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
    const newDistance = lengthToSubtract - distance;
    const x = ax + (bx - ax) * (newDistance / distance);
    const y = ay + (by - ay) * (newDistance / distance);
    return {x, y};
}

function findSymmetricPoint(ax, ay, bx, by, cx, cy) {
    const A = by - ay;
    const B = ax - bx;
    const C = bx * ay - ax * by;
    const footX = (B * B * cx - A * B * cy - A * C) / (A * A + B * B);
    const footY = (A * A * cy - A * B * cx - B * C) / (A * A + B * B);

    const dx = 2 * footX - cx;
    const dy = 2 * footY - cy;
    return {x: dx, y: dy, fx: footX, fy: footY};
}

function findCircleLineSegmentIntersections(ax, ay, bx, by, cx, cy, r) {
    const m = (by - ay) / (bx - ax);
    const b = ay - m * ax;

    const A = 1 + m * m;
    const B = -2 * cx + 2 * m * (b - cy);
    const C = cx * cx + (b - cy) * (b - cy) - r * r;

    const discriminant = B * B - 4 * A * C;
    if (discriminant < 0) {
        return [];
    }
    const x1 = (-B + Math.sqrt(discriminant)) / (2 * A);
    const x2 = (-B - Math.sqrt(discriminant)) / (2 * A);
    const y1 = m * x1 + b;
    const y2 = m * x2 + b;

    const intersections = [];
    [x1, x2].forEach((x, i) => {
        const y = (i === 0 ? y1 : y2);
        if (x >= Math.min(ax, bx) && x <= Math.max(ax, bx) &&
            y >= Math.min(ay, by) && y <= Math.max(ay, by)) {
            intersections.push({x, y});
        }
    });

    return intersections;
}


function renderLine() {
    const ctx = arguments[0];
    const line = arguments[1];
    const mouse = arguments[2];
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = 'rgb(255,0,0)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 2;
    line.forEach(point => {
        if (this.language==='zh-CN1'||this.language==='zh-Hans-CN1') {
            ctx.beginPath();
            ctx.moveTo(point[0].x, point[0].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.lineTo(point[1].x, point[1].y);
            ctx.stroke();
        }else {
            const intersections = findCircleLineSegmentIntersections(point[0].x, point[0].y, point[1].x, point[1].y, mouse.x, mouse.y, 40);
            const _slope = slope(point[0].x, point[0].y, point[1].x, point[1].y);
            if (intersections.length >= 2) {
                const D = findSymmetricPoint(intersections[0].x, intersections[0].y, intersections[1].x, intersections[1].y, mouse.x, mouse.y);
                const ND = getNewPoint(D.fx, D.fy, D.x, D.y, 40);
                ctx.beginPath()
                ctx.moveTo(intersections[0].x, intersections[0].y);
                ctx.quadraticCurveTo(ND.x, ND.y, intersections[1].x, intersections[1].y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(intersections[0].x, intersections[0].y);
                ctx.lineTo(point[_slope > 0 ? 0 : 1].x, point[_slope > 0 ? 0 : 1].y);
                ctx.stroke();
                ctx.beginPath()
                ctx.moveTo(intersections[1].x, intersections[1].y);
                ctx.lineTo(point[_slope > 0 ? 1 : 0].x, point[_slope > 0 ? 1 : 0].y)
                ctx.stroke();
            } else {
                ctx.strokeStyle = 'rgb(255,0,0)';
                ctx.beginPath();
                ctx.moveTo(point[0].x, point[0].y);
                ctx.lineTo(point[1].x, point[1].y)
                ctx.stroke();
            }
        }
    })
}

function drawMousePointer() {
    const ctx = arguments[0];
    const mouse = arguments[1];
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
    ctx.fill();
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

(function (lineNumber) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute("style", "width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:999;pointer-events:none;");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.mosue = {x: 0, y: 0}
    this.line = []
    this.language = navigator.language
    window.addEventListener('mousemove', e => {
        this.mosue.x = e.clientX
        this.mosue.y = e.clientY
    })
    const render = () => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height)
        renderLine.call(this, context, this.line, this.mosue,this.language)
        window?.redline?.Debugging && drawMousePointer.call(this, context, this.mosue);
        requestAnimationFrame(render)
    }
    queueMicrotask(_ => {
        for (let i = 0; i < lineNumber; i++) {
            let x1x = randomNum(canvas.width * -.1, canvas.width * 1.1)
            x1x = x1x <= 0 ? 0 : x1x >= canvas.width ? canvas.width : x1x;
            let x2x = x1x <= 0 ? randomNum(canvas.width * .2, canvas.width * 1.1) : x1x >= canvas.width ? randomNum(canvas.width * -.1, canvas.width * .8) : randomNum(canvas.width * -.1, canvas.width * 1.1)
            x2x = x2x <= 0 ? 0 : x2x >= canvas.width ? canvas.width : x2x;
            let x1y = x1x > 0 ? 0 : randomNum(canvas.height * -.1, canvas.height * 1.1)
            x1y = x1y <= 0 ? 0 : x1y >= canvas.height ? canvas.height : x1y;
            let x2y = (x2x > 0 && x2x < canvas.width) ? canvas.height : randomNum(0, canvas.height)

            const start = {x: x1x, y: x1y}
            const end = {x: x2x, y: x2y}
            const points = [start, end].sort((a, b) => b.y - a.y)
            this.line.push(points)
        }
        document.body.appendChild(canvas);
        requestAnimationFrame(render)
    })
})(window?.redline?.lineNumber || 1)
