
export type ArrayIndex<Size extends number, A extends any[] = [], T = never> =
    A["length"] extends Size ? T : ArrayIndex<Size, [...A, any], T | A["length"]>;

export type Vec2 = [number, number];

export function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

export function pickRandom<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}
