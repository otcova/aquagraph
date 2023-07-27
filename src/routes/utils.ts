export type Vec2 = [number, number];

export function randomRange(min: number, max: number, rnd: NextRandom = Math.random) {
    return rnd() * (max - min) + min;
}

export function easeInOutQuad(x: number): number {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x < 0.5 ? 2 * x * x : 4 * x - 2 * x * x - 1
}

export type NextRandom = () => number;

export function pointInsideTriangle(P: Vec2, A: Vec2, B: Vec2, C: Vec2): boolean {
    // Barycentric coordinates
    
    const a = (B[1] - C[1]) * (P[0] - C[0]) + (C[0] - B[0]) * (P[1] - C[1]);
    if (a < 0) return false;
    
    const b = (C[1] - A[1]) * (P[0] - C[0]) + (A[0] - C[0]) * (P[1] - C[1]);
    if (b < 0) return false;
    
    const denominator = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
    const c = 1 - (a + b) / denominator;
    
    return c >= 0;
}