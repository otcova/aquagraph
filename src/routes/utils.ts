export type Vec2 = [number, number];

export function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}