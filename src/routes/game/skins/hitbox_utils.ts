
export function squareHitbox(x: number, y: number, size: number) {
    return rectHitbox(x, y, size, size);
}

export function rectHitbox(x: number, y: number, width: number, height: number) {
    return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
}
