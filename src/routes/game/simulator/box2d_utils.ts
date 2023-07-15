import Box2D from "box2dweb";
import { utils } from "pixi.js";

const b2Vec2 = Box2D.Common.Math.b2Vec2;

export function shapesFromConvexVertices(vertices: ArrayLike<number>): Box2D.Collision.Shapes.b2Shape[] {
    const triangles = utils.earcut(vertices).map(n => n * 2);
    const shapes = new Array(triangles.length / 3);

    let vertexIndex = 0;
    for (let i = 0; i < shapes.length; ++i) {
        const v0 = triangles[vertexIndex++];
        const v1 = triangles[vertexIndex++];
        const v2 = triangles[vertexIndex++];

        shapes[i] = new Box2D.Collision.Shapes.b2PolygonShape();
        shapes[i].SetAsVector([
            new b2Vec2(vertices[v0], vertices[v0 + 1]),
            new b2Vec2(vertices[v1], vertices[v1 + 1]),
            new b2Vec2(vertices[v2], vertices[v2 + 1]),
        ], 3);
    }

    return shapes;
}

export function shapeFromVertices(vertices: ArrayLike<number>) {

    const verts = new Array(vertices.length / 2);
    for (let i = 0; i < verts.length; ++i) {
        verts[i] = new b2Vec2(
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
