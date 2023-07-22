import { diffuseGroup } from "@pixi/lights";
import { Container } from "pixi.js";

export class AppLayers {
    background = new Container();
    lake = new Container();

    bottomParticles = new Container();
    player = new Container();
    box = new Container();
    topParticles = new Container();

    frame = new Container();
    topFrame = new Container();

    // Layers that are relative to the camera position.
    listCameraLayers(): Container[] {
        return [
            this.background,
            this.lake,

            this.bottomParticles,
            this.player,
            this.box,
            this.topParticles,
            
            // this.frame,
            // this.topFrame,
        ];
    }

    // Layers that are not relative to the camera position.
    listFrameLayers(): Container[] {
        // this.frame.parentGroup = diffuseGroup;
        // this.topFrame.parentGroup = diffuseGroup;
        return [
            this.frame,
            this.topFrame,
        ];
    }
}