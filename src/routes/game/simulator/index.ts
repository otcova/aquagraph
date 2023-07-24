import type { Game } from "..";
import Box2D from "box2dweb";
import { EntitiesSimulator } from "./entities";
import { GameDif } from "../dif";
import { ContactListener } from "./contact_listener";
import { FrameCollision } from "./frameCollision";

export class Simulator {
    private lastUpdateTime?: number;
    private world: Box2D.Dynamics.b2World;
    entities: EntitiesSimulator;
    private frameCollision: FrameCollision;
    beforeStep?: (deltatTime: number) => void;

    constructor(public game: Game) {
        const gravity = new Box2D.Common.Math.b2Vec2(0, 100);
        const doSleep = true;
        this.world = new Box2D.Dynamics.b2World(gravity, doSleep);
        this.world.SetContactListener(new ContactListener());

        const gameDif = new GameDif(undefined, game);

        this.entities = new EntitiesSimulator(this.world);
        this.entities.update(gameDif);

        this.frameCollision = new FrameCollision(this.world);
        this.frameCollision.update(game.camera);

        this.simulate = this.simulate.bind(this);
        // Check initial contacts
        this.world.Step(0, 1, 1);
    }

    updateGame(game: Game) {
        if (this.game != game) {
            const gameDif = new GameDif(this.game, game);
            this.game = game;
            this.lastUpdateTime = performance.now() / 1000;

            if (gameDif.camera) this.frameCollision.update(gameDif.camera);
            this.entities.update(gameDif);
        }
    }

    updateGameDif(gameDif: GameDif) {
        this.game = gameDif.apply(this.game);
        
        if (gameDif.camera) this.frameCollision.update(gameDif.camera);
        this.entities.update(gameDif);
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
            this.beforeStep?.(timeStep);
            this.entities.step(timeStep);
            this.world.Step(timeStep, velocityIterations, positionIterations);
            this.world.ClearForces();

            this.game.time += timeStep;
        }

        this.recordGameState();
    }

    private recordGameState() {
        this.game = {
            camera: {
                position: [...this.game.camera.position],
                size: [...this.game.camera.size],
            },
            entities: this.entities.recordState(),
            time: this.game.time,
            light: this.game.light,
        };
    }
}
