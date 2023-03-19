import type { Lake } from "../..";
import type { Vec2 } from "../../../utils";
import { smoothSubdividePolygon } from "../../server/game_creation/lake";
import { Group } from "../drawing_element";
import type { PainterCanvas } from "../painter";

const color = "#008080";

class LakeAnimation {
    fromPosition: Vec2 = [0, 0];
    toPosition: Vec2 = [0, 0];
    fromSize = 0;
    toSize = 0;
    startTime = -Infinity;
    duration = 5;

    /** Returns the progress (time) of the animation from 0 to 1 */
    progress(time: number): number {
        return Math.min(1, Math.max(0, (time - this.startTime) / this.duration));
    }

    currentPosition(time: number): Vec2 {
        const t = this.progress(time);
        return [
            this.fromPosition[0] * (1 - t) + this.toPosition[0] * t,
            this.fromPosition[1] * (1 - t) + this.toPosition[1] * t,
        ];
    }

    currentSize(time: number): number {
        const t = this.progress(time);
        return this.fromSize * (1 - t) + this.toSize * t;
    }
}

export class LakePainter {
    polygons: SVGPolygonElement[] = [];
    vertices: Vec2[];
    animations: LakeAnimation[] = [];

    constructor(canvas: PainterCanvas, lake: Lake) {
        this.vertices = lake.polygon.map(
            ([x, y]) => [x + lake.position[0], y + lake.position[1]]
        );

        for (let i = 0; i < 4; ++i) {
            const lake = `<polygon fill="${color}" style="transition: all 1s;"/>`;
            this.polygons.push(canvas.addElement(0, lake) as SVGPolygonElement);

            this.animations.push(new LakeAnimation());
        }

        // Draw hitbox
        // const hitboxPoints = toSvgPoints(this.vertices);
        // canvas.addElement(0, `<polygon stroke="#f00a" fill="#0000" points="${hitboxPoints}" />`);

        canvas.onAnimationFrame(this.frame.bind(this));
    }

    frame(elapsedSeconds: number) {
        const time = performance.now() / 1000;

        const topIndex = this.animations.length - 1;

        for (let i = 0; i < this.polygons.length; ++i) {
            const animation = this.animations[i];

            if (animation.progress(time) >= 1) {
                animation.fromPosition = this.animations[topIndex].currentPosition(time);
                animation.fromPosition[0] ||= 0;
                animation.fromPosition[1] ||= 1;

                animation.fromSize = this.animations[topIndex].currentSize(time) || 0;

                if (i == topIndex) {
                    animation.toPosition = [
                        Math.random() * 4 - 2,
                        Math.random() * 4 - 2,
                    ];
                    animation.toSize = Math.random() * 18 - 10;
                } else {
                    animation.toPosition = [
                        animation.fromPosition[0] + Math.random() * 9 - 2,
                        animation.fromPosition[1] + Math.random() * 9 - 2,
                    ];
                    animation.toSize = animation.fromSize + 25;
                }

                if (i == 0) {
                    if (elapsedSeconds < 1 && Number.isFinite(animation.startTime)) animation.startTime = time;
                    else animation.startTime = time - animation.duration;
                } else {
                    const timeStep = animation.duration / (this.animations.length - 1);
                    animation.startTime = this.animations[i - 1].startTime + timeStep;
                }
            }

            const level = this.polygons.length - i;
            const size = animation.currentSize(time);
            const position = animation.currentPosition(time);

            const points = scalePolygon(this.vertices, size);

            for (const p of points) {
                p[0] += position[0];
                p[1] += position[1];
            }

            const smoothPoints = smoothSubdividePolygon(points, 8);
            this.polygons[i].setAttribute("points", toSvgPoints(smoothPoints));

            if (i != topIndex) {
                const t = Math.max(0, animation.progress(time));

                const g = 0x80 + 0x60 * ((1 - t) ** 2 - 1);
                const b = 0x80 + 0x50 * ((1 - t) ** 2 - 1);
                const alpha = 220 * (1 - t) ** 2;

                const hex = (n: number) =>
                    Math.min(255, Math.max(0, Math.trunc(n))).toString(16).padStart(2, "0");

                this.polygons[i].setAttribute("fill", "#00" + hex(g) + hex(b) + hex(alpha));
            }
        }
    }
}

function toSvgPoints(points: Vec2[]): string {
    return `${points.map(([x, y]) => x + "," + y).join(" ")}`;
}


function normalize(v: Vec2): Vec2 {
    const size = Math.hypot(v[0], v[1]);
    return [v[0] / size, v[1] / size]
}

function scalePolygon(points: Vec2[], size: number): Vec2[] {
    const shrinked: Vec2[] = [];

    for (let i = 0; i < points.length; ++i) {
        const p0 = points[i - 1] ?? points[points.length - 1];
        const p1 = points[i];
        const p2 = points[i + 1] ?? points[0];

        const normal01 = ([p1[1] - p0[1], p0[0] - p1[0]]);
        const normal12 = ([p2[1] - p1[1], p1[0] - p2[0]]);

        const p1Normal = normalize([normal01[0] + normal12[0], normal01[1] + normal12[1]]);

        shrinked.push([
            p1[0] + size * p1Normal[0],
            p1[1] + size * p1Normal[1],
        ]);
    }

    return shrinked;
}
