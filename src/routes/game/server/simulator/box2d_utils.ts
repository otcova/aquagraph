import Box2D from "box2dweb";
import type { Vec2 } from "../../../utils";

export function shapeFromVertices(vertices: ArrayLike<number>) {
    const verts = new Array(vertices.length / 2);
    for (let i = 0; i < verts.length; ++i) {
        verts[i] = new Box2D.Common.Math.b2Vec2(
            vertices[i * 2], vertices[i * 2 + 1]
        );
    }

    const polygon = new Box2D.Collision.Shapes.b2PolygonShape();
    polygon.SetAsVector(verts, verts.length);
    return polygon
}

export const CATEGORY_BIT = {
    LAKE: 1 << 0,
    PLAYER: 1 << 1,
    BOX: 1 << 2,
} as const;
