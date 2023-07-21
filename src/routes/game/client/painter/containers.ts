import { Container } from "pixi.js";

export class AppContainers {
    background = new Container();
    lake = new Container();

    bottomParticles = new Container();
    player = new Container();
    box = new Container();
    topParticles = new Container();

    screenFrame = new Container();

    listAll(): Container[] {
        return [
            this.background,
            this.lake,

            this.bottomParticles,
            this.player,
            this.box,
            this.topParticles,

            this.screenFrame,
        ];
    }
}