import { Layer, Stage } from "@pixi/layers";
import { AmbientLight, diffuseGroup, lightGroup, normalGroup } from "@pixi/lights";
import { Application, Container } from "pixi.js";
import type { Camera, Game } from "..";
import { GameDif } from "../dif";
import type { MinigameManager } from "../minigame";
import { Background } from "./background";
import { CameraFrame } from "./cameraFrame";
import { EntitiesPainter } from "./entities";
import { AppLayers } from "./layers";
import { UI } from "./ui";
import type { Vec2 } from "../../utils";

const transitionTime = .5; // time in seconds

export class Painter {
    private host!: MinigameManager;
    private previousGameDrawn?: Game;
    private pastTime?: number;

    private background: Background;
    private entities: EntitiesPainter;
    private cameraFrame: CameraFrame;

    private transition?: {
        background: Background;
        entities: EntitiesPainter;
        cameraFrame: CameraFrame;
        ui: UI;
        layers: AppLayers;
    };

    camera: CameraContainer;

    sceneLight = new AmbientLight(0xffffff, 0);
    diffuseLayer = new Layer(diffuseGroup);
    app: Application;
    layers = new AppLayers();
    ui: UI;

    constructor(container: HTMLElement) {
        this.app = new Application({
            resizeTo: container,
            backgroundColor: 0x000000,
            resolution: Math.max(2, window.devicePixelRatio || 2),
            antialias: true,
            autoDensity: true,
        });

        this.app.stage = new Stage();

        const normalLayer = new Layer(normalGroup);
        const lightLayer = new Layer(lightGroup);

        this.app.stage.addChild(
            this.diffuseLayer,
            normalLayer,
            lightLayer,
            this.sceneLight,
        );

        this.background = new Background(this);
        this.camera = new CameraContainer(this);
        this.entities = new EntitiesPainter(this);
        this.cameraFrame = new CameraFrame(this);
        this.ui = new UI(this);

        this.camera.cameraContainer.addChild(...this.layers.listCameraLayers());
        this.camera.frameContainer.addChild(...this.layers.listFrameLayers());

        container.appendChild(this.app.view as HTMLCanvasElement);
    }

    start(minigame: MinigameManager) {
        this.host = minigame;
        this.app.ticker.add(this.update.bind(this));
    }

    startTransition() {
        this.endTransition();
        
        this.ui.startTransition();
        
        this.transition = {
            layers: this.layers,
            cameraFrame: this.cameraFrame,
            entities: this.entities,
            background: this.background,
            ui: this.ui,
        };
        this.layers = new AppLayers();
        this.camera.startTransition();
        
        this.camera.cameraContainer.addChild(...this.layers.listCameraLayers());
        this.camera.frameContainer.addChild(...this.layers.listFrameLayers());
        
        this.cameraFrame = new CameraFrame(this);
        this.entities = new EntitiesPainter(this);
        this.background = new Background(this);
        this.ui = new UI(this);
        this.pastTime = undefined;
        this.previousGameDrawn = undefined;
    }

    private endTransition() {
        if (this.transition) {
            this.transition.cameraFrame.destroy();
            this.transition.entities.destroy();
            this.transition.layers.destroy();
            this.transition.background.destroy();
            this.transition.ui.destroy();

            this.transition = undefined;
        }
    }

    reset() {
        this.previousGameDrawn = undefined;
        this.entities.destroy();
        this.entities = new EntitiesPainter(this);
    }

    private update() {
        const now = performance.now() / 1000;

        if (this.pastTime) {
            const stepTime = now - this.pastTime;

            const currentGame = this.host.getGame();
            if (currentGame && this.previousGameDrawn != currentGame) {
                const gameDif = new GameDif(this.previousGameDrawn, currentGame);
                this.previousGameDrawn = currentGame;

                if (gameDif.light) this.sceneLight.brightness = gameDif.light;
                if (gameDif.camera || this.transition) {
                    this.camera.update(gameDif);
                    if (this.transition && !this.camera.transition) this.endTransition();
                }
                this.background.update(gameDif);
                this.cameraFrame.update(gameDif);
                this.entities.updateGame(gameDif);
            }


            this.entities.animate(stepTime);
        }

        this.pastTime = now;
    }

    destroy() {
        this.background.destroy();
        this.ui.destroy();
        this.entities.destroy();
        this.cameraFrame.destroy();
        this.layers.destroy();
        this.app.destroy(true);
    }
}

class CameraContainer {
    private camera?: Camera;
    cameraContainer = new Container();
    frameContainer = new Container();
    transition?: {
        cameraContainer: Container;
        frameContainer: Container;
        startTime: number;
        dir: Vec2;
    };

    // The amount of pixels in one unit
    uiScale = 1;

    constructor(private painter: Painter) {
        this.frameContainer.addChild(this.cameraContainer);
        painter.diffuseLayer.addChild(this.frameContainer);
        this.painter.app.renderer.on("resize", this.update.bind(this));
    }

    startTransition() {
        this.endTransition();
        
        const length = 100;
        const angle = Math.random() * Math.PI * 2;

        this.transition = {
            cameraContainer: this.cameraContainer,
            frameContainer: this.frameContainer,
            startTime: performance.now() / 1000,
            dir: [1.5 * length * Math.cos(angle), length * Math.sin(angle)],
        };
        this.cameraContainer = new Container();
        this.frameContainer = new Container();

        this.frameContainer.addChild(this.cameraContainer);
        this.painter.diffuseLayer.addChildAt(this.frameContainer,0);
    }

    update(gameDif?: GameDif) {
        if (gameDif && gameDif.camera) this.camera = gameDif.camera;
        if (this.camera) {

            if (this.transition) {
                const stage = this.transitionStage();
                if (stage > 1) {
                    this.endTransition();
                } else {
                    const leaveOffset = [
                        -this.transition.dir[0] * stage,
                        -this.transition.dir[1] * stage,
                    ];

                    const enterOffset = [
                        this.transition.dir[0] * (1 - stage),
                        this.transition.dir[1] * (1 - stage),
                    ];

                    this.transition.frameContainer.position.set(...leaveOffset);
                    this.frameContainer.position.set(...enterOffset);
                }
            }

            const margin = 1;

            let frameWidth = this.painter.app.screen.width;
            let frameHeight = this.painter.app.screen.height;

            // Check if it needs a 90 degre rotation
            if (frameWidth < frameHeight) {
                this.painter.app.stage.rotation = Math.PI / 2;
                [frameWidth, frameHeight] = [frameHeight, frameWidth];
            } else {
                this.painter.app.stage.rotation = 0;
            }

            const uiWidth = 100 + margin * 2;
            const uiHeight = 100 * this.camera.size[1] / this.camera.size[0] + margin * 2;
            this.uiScale = Math.min(frameWidth / uiWidth, frameHeight / uiHeight);

            this.painter.app.stage.position.set(
                this.painter.app.screen.width / 2,
                this.painter.app.screen.height / 2
            );
            this.painter.app.stage.scale.set(this.uiScale);

            const scale = 100 / this.camera.size[0];
            this.cameraContainer.position.set(-this.camera.position[0] * scale, -this.camera.position[1] * scale);
            this.cameraContainer.scale.set(scale);
        }
    }

    private transitionStage(): number {
        if (!this.transition) return 0;
        const now = performance.now() / 1000;
        const x = (now - this.transition.startTime) / transitionTime;
        if (x > 1) return x;
        return x < 0.5 ? 2 * x * x : 4 * x - 2 * x * x - 1;
    }

    private endTransition() {
        if (this.transition) {
            this.transition.cameraContainer.destroy();
            this.transition.frameContainer.destroy();
            this.transition = undefined;

            this.frameContainer.position.set(0);
        }
    }
}
