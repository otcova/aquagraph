import type { Box, EntityId, Game, Lake, Player } from ".";
import type { Vec2 } from "../utils";

export class GameDif {
    camera: {
        topLeft: Vec2,
        bottomRight: Vec2,
    } | undefined;
    entities: {
        players: MapDif<EntityId, Player>,
        boxes: MapDif<EntityId, Box>,
        lakes: MapDif<EntityId, Lake>,
    };

    constructor(past: Game | undefined, current: Game) {
        this.entities = {
            players: new MapDif(past?.entities.players, current.entities.players),
            boxes: new MapDif(past?.entities.boxes, current.entities.boxes),
            lakes: new MapDif(past?.entities.lakes, current.entities.lakes),
        };
        
        if (JSON.stringify(past?.camera) != JSON.stringify(current.camera)) {
            this.camera = current.camera;
        }
    }
}

export class MapDif<Key, Value> {
    removed: Key[] = [];
    updated: [Key, Value][] = [];
    added: [Key, Value][] = [];

    constructor(past: Map<Key, Value> | undefined, current: Map<Key, Value>) {
        if (past) {
            for (const [key, value] of current) {
                if (past.has(key)) {
                    if (JSON.stringify(past.get(key)) != JSON.stringify(value)) {
                        this.updated.push([key, value]);
                    }
                } else {
                    this.added.push([key, value]);
                }
            }

            for (const key of past.keys()) {
                if (!current.has(key)) {
                    this.removed.push(key);
                }
            }
        } else {
            this.added = Array.from(current);
        }
    }
}

