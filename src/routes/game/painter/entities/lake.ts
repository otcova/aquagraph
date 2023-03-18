import type { Lake } from "../..";
import type { Vec2 } from "../../../utils";
import { Group } from "../drawing_element";

const colors = [
    "#008080",
    "#004455",
    "#00222b",
];

export class LakePainter {
    image: Group;

    constructor(lake: Lake) {
        this.image = new Group();


        //const path = lake.polygon.map(([x, y]) => x + "," + y).join(" ");
        const path = createSmoothPath(lake.polygon);

        const polygon = 
            `<path fill="${colors[2]}" stroke="${colors[2]}" d="${path}" style="stroke-width: 20;" transform="translate(-1 2) rotate(-3) scale(1.04 1.02)"/>` +
            `<path fill="${colors[1]}" stroke="${colors[1]}" d="${path}" style="stroke-width: 10;" transform="translate(2 4) rotate(1) scale(1.01 1.02)"/>` +
            `<path fill="${colors[0]}" d="${path}" />`;

        this.image.content(polygon);

        this.update(lake);
    }

    update(lake: Lake) {
        this.image.position(...lake.position);
    }
}

function lineProperties(pointA: Vec2, pointB: Vec2) {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

function controlPointCalc(current: Vec2, previous: Vec2, next: Vec2, reverse = false) {
    const c = current
    const p = previous ? previous : c
    const n = next ? next : c
    const smoothing = 0.2
    const o = lineProperties(p, n)
    const rev = reverse ? Math.PI : 0

    const x = c[0] + Math.cos(o.angle + rev) * o.length * smoothing
    const y = c[1] + Math.sin(o.angle + rev) * o.length * smoothing

    return [x, y]
}

function createSmoothPath(points: Vec2[]): string {
    points = [...points, points[0]];
    let path = `M ${points[0][0]},${points[0][1]}`;

    for (let i = 1; i < points.length; ++i) {
        const cs = controlPointCalc(points[i - 1], points[i - 2] ?? points[points.length - 2], points[i]);
        const ce = controlPointCalc(points[i], points[i - 1], points[i + 1] ?? points[1], true);

        path += ` C ${cs[0]},${cs[1]} ${ce[0]},${ce[1]} ${points[i][0]},${points[i][1]}`;
    }

    return path;
}
