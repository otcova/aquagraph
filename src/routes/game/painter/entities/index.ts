import type { Painter } from "..";
import type { GameDif } from "../../dif";
import { BoxPainter } from "./box";
import { CoinPainter } from "./coin";
import { FrameBoxPainter } from "./frameBox";
import { LakePainter } from "./lake";
import { PlayerPainter } from "./player";

interface EntityPainter {
    // new(painter: Painter, entity: EntityData): void
    update?(data: any): void;

    lightUpdate?(brightness: number): void;

    /// Amount of seconds between the frames
    animate?(deltaTime: number): void;

    destroy(): void;
}

const paintersConstructor = {
    players: PlayerPainter,
    boxes: BoxPainter,
    lakes: LakePainter,
    frameBoxes: FrameBoxPainter,
    coins: CoinPainter,
};

export class EntitiesPainter {
    entities = new Map<string, EntityPainter>();

    constructor(private painter: Painter) {
        this.entities.set("coin1",
            new CoinPainter(painter, { position: [0, 0], type: 0 })
        );
    }

    updateGame(gameDif: GameDif) {

        for (const entityNameStr in gameDif.entities) {
            const entityName = entityNameStr as keyof typeof gameDif.entities;

            // Create Entity Painters ------------------
            for (const [id, newEntity] of gameDif.entities[entityName].added) {
                this.entities.get(entityName + id)?.destroy();

                const Paintor = paintersConstructor[entityName];
                this.entities.set(entityName + id, new Paintor(this.painter, newEntity as any));
            }

            // Update Entity Painters ------------------
            for (const [id, updatedEntity] of gameDif.entities[entityName].updated) {
                this.entities.get(entityName + id)?.update?.(updatedEntity);
            }

            // Remove Entity Painters ------------------
            for (const id of gameDif.entities[entityName].removed) {
                this.entities.get(entityName + id)?.destroy();
                this.entities.delete(entityName + id);
            }
        }

        if (gameDif.light !== undefined) {
            for (const entity of this.entities.values()) {
                entity.lightUpdate?.(gameDif.light);
            }
        }
    }

    destroy() {
        for (const entity of this.entities.values()) entity.destroy();
        this.entities.clear();
    }

    animate(stepTime: number) {
        for (const entity of this.entities.values()) {
            entity.animate?.(stepTime);
        }
    }
}
