import type Box2D from "box2dweb";
import type { EntityId, GameEntities, Player } from "../..";
import type { GameDif } from "../../dif";
import { BoxSimulator } from "./box";
import { FrameBoxSimulator } from "./frameBox";
import { LakeSimulator } from "./lake";
import { PlayerSimulator } from "./player";

export class EntitiesSimulator {
    players = new Map<EntityId, PlayerSimulator>();
    boxes = new Map<EntityId, BoxSimulator>();
    lakes = new Map<EntityId, LakeSimulator>();
    frameBoxes = new Map<EntityId, FrameBoxSimulator>();

    constructor(private world: Box2D.Dynamics.b2World) { }
    update(gameDif: GameDif) {
        // Create Entities ------------------
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            const painter = new LakeSimulator(this.world, newLake);
            this.lakes.set(id, painter);
        }
        
        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const box = new BoxSimulator(this.world, newBox);
            this.boxes.set(id, box);
        }
        
        for (const [id, newPlayer] of gameDif.entities.players.added) {
            this.addPlayer(id, newPlayer);
        }
        
        for (const [id, newBox] of gameDif.entities.frameBoxes.added) {
            const box = new FrameBoxSimulator(this.world, newBox);
            this.frameBoxes.set(id, box);
        }
        
        // Update Players --------------------
        
        for (const [id, player] of gameDif.entities.players.updated) {
            this.players.get(id)?.update(player);
        }
        
        if (gameDif.camera) {
            for (const [_, box] of this.frameBoxes) box.update(gameDif.camera);
        }

        // Delete Entities --------------------
        for (const entityType of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[entityType].removed) {
                this[entityType].get(id)?.destroy();
                this[entityType].delete(id);
            }
        }
    }
    
    addPlayer(id: EntityId, newPlayer: Player) {
        const painter = new PlayerSimulator(this.world, newPlayer);
        this.players.set(id, painter);
    }

    step(timeStep: number) {
        for (const entityType of ["players"] as const) {
            for (const entity of this[entityType].values()) {
                entity.step(timeStep);
            }
        }
    }

    recordState(): GameEntities {
        return {
            players: mapKeys(this.players, player => player.recordState()),
            boxes: mapKeys(this.boxes, box => box.recordState()),
            lakes: mapKeys(this.lakes, lake => lake.recordState()),
            frameBoxes: mapKeys(this.frameBoxes, box => box.recordState()),
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
