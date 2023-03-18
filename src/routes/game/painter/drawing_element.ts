import { svgNamespaceURI } from "./painter";

export interface DrawingElement {
    readonly element: SVGElement,
}

export class Group {
    element: SVGGElement;
    x = 0;
    y = 0;
    degrees = 0;

    constructor() {
        this.element = document.createElementNS(svgNamespaceURI, "g");
    }

    content(content: string) {
        this.element.innerHTML = content;
    }

    position(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.updateTransform();
    }


    angle(radians: number) {
        this.degrees = radians * 180 / Math.PI;
        this.updateTransform();
    }

    protected updateTransform() {
        this.element.setAttribute("transform", `translate(${this.x}, ${this.y}) rotate(${this.degrees})`);
    }
}

