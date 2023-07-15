import type Box2D from "box2dweb";
import type { EntityId, GameEntities } from "../../..";
import type { GameDif } from "../../../dif";
import { BoxSimulator } from "./box";
import { LakeSimulator } from "./lake";
import { PlayerSimulator } from "./player";

export class EntitiesSimulator {
    players = new Map<EntityId, PlayerSimulator>();
    boxes = new Map<EntityId, BoxSimulator>();
    lakes = new Map<EntityId, LakeSimulator>();

    constructor(private world: Box2D.Dynamics.b2World) { }
    update(gameDif: GameDif) {
        // Create Lakes
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            const painter = new LakeSimulator(this.world, newLake);
            this.lakes.set(id, painter);
        }

        // Create Players
        for (const [id, newPlayer] of gameDif.entities.players.added) {
            const painter = new PlayerSimulator(this.world, newPlayer);
            this.players.set(id, painter);
        }

        console.error("TODO! simulator update player update");

        // Create Boxes
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const painter = new BoxSimulator(this.world, newBox);
            this.boxes.set(id, painter);
        }

        // Delete
        for (const entityType of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[entityType].removed) {
                this[entityType].get(id)?.delete();
                this[entityType].delete(id);
            }
        }
    }

    step() {
        for (const entityType of ["players"] as const) {
            for (const entity of this[entityType].values()) {
                entity.step();
            }
        }
    }

    recordState(): GameEntities {
        return {
            players: mapKeys(this.players, player => player.recordState()),
            boxes: mapKeys(this.boxes, box => box.recordState()),
            lakes: mapKeys(this.lakes, lake => lake.recordState()),
        };
    }
}

function mapKeys<K, V1, V2>(
    map: Map<K, V1>,
    mapper: (value: V1, key: K) => V2
): Map<K, V2> {
    const mappedMap = new Map();
    for (const [k, v] of map) {
        mappedMap.set(k, mapper(v, k));
    }
    return mappedMap;
}
