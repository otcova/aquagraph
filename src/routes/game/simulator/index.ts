import type { Game } from "..";
import Box2D from "box2dweb";
import { EntitiesSimulator } from "./entities";
import { GameDif } from "../dif";
import { ContactListener } from "./contact_listener";

export class Simulator {
    private lastUpdateTime?: number;
    private world: Box2D.Dynamics.b2World;
    entities: EntitiesSimulator;

    constructor(public game: Game) {
        const gravity = new Box2D.Common.Math.b2Vec2(0, 100);
        const doSleep = true;
        this.world = new Box2D.Dynamics.b2World(gravity, doSleep);
        this.world.SetContactListener(new ContactListener());

        const gameDif = new GameDif(undefined, game);

        this.entities = new EntitiesSimulator(this.world);
        this.entities.update(gameDif);

        this.simulate = this.simulate.bind(this);
        // Check initial contacts
        this.world.Step(0, 1, 1);
    }

    updateGame(game: Game) {
        if (this.game != game) {
            const gameDif = new GameDif(this.game, game);
            this.game = game;
            this.lastUpdateTime = performance.now() / 1000;

            this.entities.update(gameDif);
        }
    }

    // Does the required steps to advance the game
    simulate() {
        const now = performance.now() / 1000;
        if (this.lastUpdateTime) {
            const deltaTime = now - this.lastUpdateTime;
            
            // If lowering this, check: https://gamedev.stackexchange.com/questions/194011/what-could-effectively-affect-the-falling-speed-of-a-b2body
            const stepsPerFrame = 40;
            
            this.step(stepsPerFrame, deltaTime / stepsPerFrame);
        }
        this.lastUpdateTime = now;
    }

    private step(num_of_steps: number, timeStep: number) {
        const velocityIterations = 6;
        const positionIterations = 2;

        for (let i = 0; i < num_of_steps; ++i) {
            this.entities.step(timeStep);
            this.world.Step(timeStep, velocityIterations, positionIterations);
            this.world.ClearForces();
        }

        this.game = this.recordGameState();
    }

    private recordGameState(): Game {
        return {
            camera: this.game.camera,
            entities: this.entities.recordState(),
            effects: [],
        };
    }
}
