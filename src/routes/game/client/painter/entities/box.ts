import { normalGroup, PointLight } from "@pixi/lights";
import { Container, Sprite } from "pixi.js";
import type { Painter } from "..";
import type { Box } from "../../..";
import type { Vec2 } from "../../../../utils";
import { boxGraphics, type BoxGraphics } from "../../../skins/box";

export class BoxPainter {
    container = new Container();
    graphics: BoxGraphics;
    lamps: Lamp[] = [];

    constructor(painter: Painter, box: Box) {
        this.container.position.set(...box.position);
        this.container.rotation = box.angle;
        
        this.graphics = boxGraphics(box.skin);
        this.graphics.normal.parentGroup = normalGroup;        
        
        for (const lampPos of box.lamps || []) {
            this.lamps.push(new Lamp(painter, this.container, box, lampPos));
        }

        painter.layers.box.addChild(this.container);
        this.container.addChild(this.graphics.diffuse);
        this.container.addChild(this.graphics.normal);
    }
    
    animate(deltaTime: number) {
        for (const lamp of this.lamps) {
            lamp.animate(deltaTime);
        }
    }

    destroy() {
        this.container.destroy();
        this.graphics.diffuse.destroy();
        this.graphics.normal.destroy();
        for (const lamp of this.lamps) lamp.destroy();
    }
}

class Lamp {
    container = new Container();
    img = Sprite.from('assets/lamp.png');
    imgNormal = Sprite.from('assets/lampNorm.png');
    light: PointLight;

    constructor(painter: Painter, parent: Container, box: Box, pos: Vec2) {
        this.light = new PointLight(0xaa4203 , 1.5 - painter.ambientLightBrightness);
        
        parent.addChild(this.container);
        this.container.addChild(this.img);
        this.container.addChild(this.imgNormal);
        this.container.addChild(this.light);

        this.container.position.set(...pos);
        this.container.rotation = -box.angle;
        this.container.scale.set(0.05, 0.05);

        const width = 87;
        this.img.position.set(-width / 2, 0);
        this.imgNormal.position.set(-width / 2, 0);

        this.imgNormal.parentGroup = normalGroup;
        this.light.position.set(0, 240);
    }
    
    animate(deltaTime: number) {
        this.light.brightness += (0.5 - Math.random()) * Math.min(0.5, deltaTime) * 4;
        this.light.brightness = Math.max(0.1, Math.min(3, this.light.brightness));
    }
    
    destroy() {
        this.container.destroy();
        this.img.destroy();
        this.imgNormal.destroy();
        this.light.destroy();
    }
}