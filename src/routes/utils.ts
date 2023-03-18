
export type Vec2 = [number, number];

export function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

export function pickRandom<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}
