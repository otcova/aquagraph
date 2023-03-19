import type { Skin } from "../..";

const boxShapes: Skin[] = [
    {
        hitbox: [[[0, 0], [147, 142]]],
        image: `
<rect x="10" y="10" width="130" height="130" fill="#280b0b" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="2.3151" y="1.239" width="65.081" height="63.743" rx="7.5469" ry="7.572" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="1.6738" y="78.51" width="139.49" height="63.743" rx="7.5469" ry="7.572" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="81.508" y="-.017463" width="65.081" height="142.27" rx="7.5469" ry="7.572" />
`
    },
    {
        hitbox: [[[0, 0], [310, 164]]],
        image: `
<rect x="10" y="10" width="280" height="145" fill="#280b0b" />
<rect fill="#784421" x="2.8814" y="1.445" width="73.372" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="98.342" y="1.445" width="120.04" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="147.12" y="90.389" width="120.04" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="-.002408" y="90.389" width="126.89" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="237.12" y="-.0012769" width="73.372" height="163.76" rx="8.7326" ry="8.4924" />
`
    },
];

interface BoxDecorations {
    lamp?: boolean;
}

export function boxSkin(shapeIndex: number, decorations: BoxDecorations = {}): Skin {
    let shape = boxShapes[shapeIndex % boxShapes.length];

    return shape;
}
