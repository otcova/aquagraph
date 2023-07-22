import type { Painter } from "..";
import type { EntityId } from "../../..";
import type { GameDif } from "../../../dif";
import { BoxPainter } from "./box";
import { FrameBoxPainter } from "./frameBox";
import { LakePainter } from "./lake";
import { PlayerPainter } from "./player";

export class EntitiesPainter {
    players = new Map<EntityId, PlayerPainter>();
    boxes = new Map<EntityId, BoxPainter>();
    lakes = new Map<EntityId, LakePainter>();
    frameBoxes = new Map<EntityId, FrameBoxPainter>();

    constructor(private painter: Painter) { }

    updateGame(gameDif: GameDif) {
        // Create Painters ------------------
        for (const [id, newLake] of gameDif.entities.lakes.added) {
            const painter = new LakePainter(this.painter, newLake);
            this.lakes.set(id, painter);
        }

        for (const [id, newPlayer] of gameDif.entities.players.added) {
            const painter = new PlayerPainter(this.painter, newPlayer);
            this.players.set(id, painter);
        }

        for (const [id, newBox] of gameDif.entities.boxes.added) {
            const painter = new BoxPainter(this.painter, newBox);
            this.boxes.set(id, painter);
        }

        for (const [id, newBox] of gameDif.entities.frameBoxes.added) {
            const painter = new FrameBoxPainter(this.painter, newBox);
            this.frameBoxes.set(id, painter);
        }

        // Update Players
        for (const [id, updatedPlayer] of gameDif.entities.players.updated) {
            this.players.get(id)?.update(updatedPlayer);
        }

        // Delete Painters ------------------
        for (const entityType of ["players", "boxes", "lakes"] as const) {
            for (const id of gameDif.entities[entityType].removed) {
                this[entityType].get(id)?.destroy();
                this[entityType].delete(id);
            }
        }
    }

    animate(stepTime: number) {
        for (const entityType of ["players", "lakes", "boxes"] as const) {
            for (const entity of this[entityType].values()) {
                entity.animate(stepTime);
            }
        }
    }
}
