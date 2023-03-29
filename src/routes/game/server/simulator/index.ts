import type { Game } from "../..";
import Box2D from "box2dweb";
import { EntitiesSimulator } from "./entities";
import { GameDif } from "../../dif";

export class Simulator {
    private lastUpdateTime?: number;
    private world: Box2D.Dynamics.b2World;
    private entities: EntitiesSimulator;

    constructor(public game: Game) {
        const gravity = new Box2D.Common.Math.b2Vec2(0, 150);
        const doSleep = true;
        this.world = new Box2D.Dynamics.b2World(gravity, doSleep);

        const gameDif = new GameDif(undefined, game);

        this.entities = new EntitiesSimulator(this.world);
        this.entities.update(gameDif);

        this.run = this.run.bind(this);
        this.run();
    }

    update(game: Game) {
        if (this.game != game) {
            const gameDif = new GameDif(this.game, game);
            this.game = game;

            this.entities.update(gameDif);
        }
    }

    private run() {
        const now = performance.now() / 1000;
        if (this.lastUpdateTime) {
            const deltaTime = now - this.lastUpdateTime;
            const stepsPerFrame = 2;
            this.step(stepsPerFrame, deltaTime / stepsPerFrame);
        }
        this.lastUpdateTime = now;
        requestAnimationFrame(this.run);
    }

    private step(num_of_steps: number, timeStep: number) {
        const velocityIterations = 6;
        const positionIterations = 2;

        for (let i = 0; i < num_of_steps; ++i) {
            this.entities.step();
            this.world.Step(timeStep, velocityIterations, positionIterations);
        }

        this.game = this.recordGameState();
    }

    private recordGameState(): Game {
        return {
            camera: this.game.camera,
            entities: this.entities.recordState(),
        };
    }
}
