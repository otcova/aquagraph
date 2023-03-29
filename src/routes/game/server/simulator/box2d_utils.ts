import Box2D from "box2dweb";
import type { Vec2 } from "../../../utils";

export function shapeFromVertices(vertices: Vec2[]) {
    const polygon = new Box2D.Collision.Shapes.b2PolygonShape();
    polygon.SetAsArray(vertices.map(
        ([x, y]) => new Box2D.Common.Math.b2Vec2(x, y)
    ), vertices.length);
    return polygon
}
