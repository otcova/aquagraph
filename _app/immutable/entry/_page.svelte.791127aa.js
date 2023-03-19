var Z=Object.defineProperty;var tt=(s,e,t)=>e in s?Z(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var c=(s,e,t)=>(tt(s,typeof e!="symbol"?e+"":e,t),t);import{S as X,i as Y,s as K,J as et,K as it,L as nt,m as st,h as O,n as A,b as ot,M as rt,H as q,o as at,w as lt,y as ct,z as ht,A as mt,g as ft,d as dt,B as ut}from"../chunks/index.2ed2b89f.js";class pt{constructor(e,t){c(this,"camera");c(this,"entities");this.entities={players:new B(e==null?void 0:e.entities.players,t.entities.players),boxes:new B(e==null?void 0:e.entities.boxes,t.entities.boxes),lakes:new B(e==null?void 0:e.entities.lakes,t.entities.lakes)},JSON.stringify(e==null?void 0:e.camera)!=JSON.stringify(t.camera)&&(this.camera=t.camera)}}class B{constructor(e,t){c(this,"removed",[]);c(this,"updated",[]);c(this,"added",[]);if(e){for(const[i,n]of t)e.has(i)?JSON.stringify(e.get(i))!=JSON.stringify(n)&&this.updated.push([i,n]):this.added.push([i,n]);for(const i of e.keys())t.has(i)||this.removed.push(i)}else this.added=Array.from(t)}}class Q{constructor(){c(this,"element");c(this,"x",0);c(this,"y",0);c(this,"degrees",0);this.element=document.createElementNS(z,"g")}content(e){this.element.innerHTML=e}position(e,t){this.x=e,this.y=t,this.updateTransform()}angle(e){this.degrees=e*180/Math.PI,this.updateTransform()}updateTransform(){this.element.setAttribute("transform",`translate(${this.x}, ${this.y}) rotate(${this.degrees})`)}}class gt{constructor(e,t){c(this,"image");this.image=new Q,e.addElement(8,this.image.element),this.image.content(t.skin.image),this.update(t)}update(e){this.image.position(...e.position),this.image.angle(e.angle)}}const yt=.5*(Math.sqrt(3)-1),M=(3-Math.sqrt(3))/6,R=s=>Math.floor(s)|0,D=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]);function vt(s=Math.random){const e=wt(s),t=new Float64Array(e).map(n=>D[n%12*2]),i=new Float64Array(e).map(n=>D[n%12*2+1]);return function(o,r){let a=0,h=0,l=0;const d=(o+r)*yt,f=R(o+d),m=R(r+d),y=(f+m)*M,$=f-y,L=m-y,u=o-$,p=r-L;let k,P;u>p?(k=1,P=0):(k=0,P=1);const F=u-k+M,C=p-P+M,T=u-1+2*M,N=p-1+2*M,G=f&255,I=m&255;let v=.5-u*u-p*p;if(v>=0){const g=G+e[I],b=t[g],S=i[g];v*=v,a=v*v*(b*u+S*p)}let w=.5-F*F-C*C;if(w>=0){const g=G+k+e[I+P],b=t[g],S=i[g];w*=w,h=w*w*(b*F+S*C)}let x=.5-T*T-N*N;if(x>=0){const g=G+1+e[I+1],b=t[g],S=i[g];x*=x,l=x*x*(b*T+S*N)}return 70*(a+h+l)}}function wt(s){const t=new Uint8Array(512);for(let i=0;i<512/2;i++)t[i]=i;for(let i=0;i<512/2-1;i++){const n=i+~~(s()*(256-i)),o=t[i];t[i]=t[n],t[n]=o}for(let i=256;i<512;i++)t[i]=t[i-256];return t}var xt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},J={},bt={get exports(){return J},set exports(s){J=s}};(function(s,e){(function(t,i){s.exports=i()})(xt,function(){return t.importState=function(n){var o=new t;return o.importState(n),o},t;function t(){return function(n){var o=0,r=0,a=0,h=1;n.length==0&&(n=[+new Date]);var l=i();o=l(" "),r=l(" "),a=l(" ");for(var d=0;d<n.length;d++)o-=l(n[d]),o<0&&(o+=1),r-=l(n[d]),r<0&&(r+=1),a-=l(n[d]),a<0&&(a+=1);l=null;var f=function(){var m=2091639*o+h*23283064365386963e-26;return o=r,r=a,a=m-(h=m|0)};return f.next=f,f.uint32=function(){return f()*4294967296},f.fract53=function(){return f()+(f()*2097152|0)*11102230246251565e-32},f.version="Alea 0.9",f.args=n,f.exportState=function(){return[o,r,a,h]},f.importState=function(m){o=+m[0]||0,r=+m[1]||0,a=+m[2]||0,h=+m[3]||0},f}(Array.prototype.slice.call(arguments))}function i(){var n=4022871197,o=function(r){r=r.toString();for(var a=0;a<r.length;a++){n+=r.charCodeAt(a);var h=.02519603282416938*n;n=h>>>0,h-=n,h*=n,n=h>>>0,h-=n,n+=h*4294967296}return(n>>>0)*23283064365386963e-26};return o.version="Mash 0.9",o}})})(bt);const St=J;function E(s){const e=St(s),t=vt(e),i=8,n=2*Math.PI/i;let o=80+200*e.next();o<100&&e.next()>.5&&(o+=120);const r=o*.6,a=o/300,h=new Array(i);let l=0;for(let d=0;d<i;++d){const f=Math.cos(l),m=Math.sin(l),y=o+r*t(f*a,m*a);h[d]=[y*f,y*m],l+=n}return V(h,4)}function V(s,e){const t=[],i=1/e;for(let n=0;n<s.length;++n){const o=s[n-1]??s[s.length-1],r=s[n],a=s[(n+1)%s.length],h=s[(n+2)%s.length];t.push(r);for(let l=i;l<1-Number.EPSILON;l+=i)t.push([r[0]+.5*l*(a[0]-o[0]+l*(2*o[0]-5*r[0]+4*a[0]-h[0]+l*(3*(r[0]-a[0])+h[0]-o[0]))),r[1]+.5*l*(a[1]-o[1]+l*(2*o[1]-5*r[1]+4*a[1]-h[1]+l*(3*(r[1]-a[1])+h[1]-o[1])))])}return t}const Mt="#008080";class kt{constructor(){c(this,"fromPosition",[0,0]);c(this,"toPosition",[0,0]);c(this,"fromSize",0);c(this,"toSize",0);c(this,"startTime",-1/0);c(this,"duration",5)}progress(e){return Math.min(1,Math.max(0,(e-this.startTime)/this.duration))}currentPosition(e){const t=this.progress(e);return[this.fromPosition[0]*(1-t)+this.toPosition[0]*t,this.fromPosition[1]*(1-t)+this.toPosition[1]*t]}currentSize(e){const t=this.progress(e);return this.fromSize*(1-t)+this.toSize*t}}class Pt{constructor(e,t){c(this,"polygons",[]);c(this,"vertices");c(this,"animations",[]);this.vertices=t.polygon.map(([i,n])=>[i+t.position[0],n+t.position[1]]);for(let i=0;i<4;++i){const n=`<polygon fill="${Mt}" style="transition: all 1s;"/>`;this.polygons.push(e.addElement(0,n)),this.animations.push(new kt)}e.onAnimationFrame(this.frame.bind(this))}frame(e){var n,o;const t=performance.now()/1e3,i=this.animations.length-1;for(let r=0;r<this.polygons.length;++r){const a=this.animations[r];if(a.progress(t)>=1)if(a.fromPosition=this.animations[i].currentPosition(t),(n=a.fromPosition)[0]||(n[0]=0),(o=a.fromPosition)[1]||(o[1]=1),a.fromSize=this.animations[i].currentSize(t)||0,r==i?(a.toPosition=[Math.random()*4-2,Math.random()*4-2],a.toSize=Math.random()*18-10):(a.toPosition=[a.fromPosition[0]+Math.random()*9-2,a.fromPosition[1]+Math.random()*9-2],a.toSize=a.fromSize+25),r==0)e<1&&Number.isFinite(a.startTime)?a.startTime=t:a.startTime=t-a.duration;else{const m=a.duration/(this.animations.length-1);a.startTime=this.animations[r-1].startTime+m}this.polygons.length-r;const h=a.currentSize(t),l=a.currentPosition(t),d=_t(this.vertices,h);for(const m of d)m[0]+=l[0],m[1]+=l[1];const f=V(d,8);if(this.polygons[r].setAttribute("points",At(f)),r!=i){const m=Math.max(0,a.progress(t)),y=128+96*((1-m)**2-1),$=128+80*((1-m)**2-1),L=220*(1-m)**2,u=p=>Math.min(255,Math.max(0,Math.trunc(p))).toString(16).padStart(2,"0");this.polygons[r].setAttribute("fill","#00"+u(y)+u($)+u(L))}}}}function At(s){return`${s.map(([e,t])=>e+","+t).join(" ")}`}function Et(s){const e=Math.hypot(s[0],s[1]);return[s[0]/e,s[1]/e]}function _t(s,e){const t=[];for(let i=0;i<s.length;++i){const n=s[i-1]??s[s.length-1],o=s[i],r=s[i+1]??s[0],a=[o[1]-n[1],n[0]-o[0]],h=[r[1]-o[1],o[0]-r[0]],l=Et([a[0]+h[0],a[1]+h[1]]);t.push([o[0]+e*l[0],o[1]+e*l[1]])}return t}function H(s=0,e=1){return Math.random()*(e-s)+s}class zt{constructor(e,t){c(this,"image");c(this,"eye");this.image=new Q,this.image.content(t.skin.image),this.update(t),this.eye=this.image.element.getElementsByClassName("eye")[0],this.eye.setAttribute("style","transition: all 1000ms linear;"),e.addElement(3,this.image.element),e.setInterval(this.moveEye.bind(this),1e3)}update(e){this.image.position(...e.position),this.image.angle(e.angle)}moveEye(){this.eye.setAttribute("transform",`translate(${H(-2,2)}, ${H(-2,2)}) rotate(${H(-20,20)})`)}}const z="http://www.w3.org/2000/svg";class $t{constructor(e){c(this,"layers");c(this,"parserLayer");c(this,"entitiesData",new Map);c(this,"activeEntity");this.layers=new Array(10);const t=document.createElementNS(z,"g");e.appendChild(t),this.parserLayer=t;for(let i=0;i<this.layers.length;++i){const n=document.createElementNS(z,"g");e.appendChild(n),this.layers[i]=n}}setActiveEntity(e){let t=this.entitiesData.get(e);t||(t={elements:[],intervals:[]},this.entitiesData.set(e,t)),this.activeEntity=t}removeEntity(e){const t=this.entitiesData.get(e);if(t){for(const i of t.elements)i.remove();for(const i of t.intervals)clearInterval(i)}}addElement(e,t){return typeof t=="string"&&(this.parserLayer.innerHTML=t,t=this.parserLayer.lastElementChild,this.parserLayer.innerHTML=""),this.layers[e].append(t),this.activeEntity.elements.push(t),t}setInterval(e,t){const i=setInterval(e,t);return this.activeEntity.intervals.push(i),i}onAnimationFrame(e){this.activeEntity.onAnimationFrame=e}animateEntities(e){var t;for(const i of this.entitiesData.values())(t=i.onAnimationFrame)==null||t.call(i,e)}}class Lt extends $t{constructor(t,i){const n=document.createElementNS(z,"g");i.appendChild(n);super(n);c(this,"loop",!0);c(this,"svg");c(this,"svgCamera");c(this,"entities");c(this,"server");c(this,"pastGameDrawed");c(this,"pastFrameSeconds");this.svg=i,this.svgCamera=n,this.server=t,this.entities={players:new Map,lakes:new Map,boxes:new Map},this.pastFrameSeconds=performance.now()/1e3,this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}frame(){const t=performance.now()/1e3,i=t-this.pastFrameSeconds;if(this.pastFrameSeconds=t,this.pastGameDrawed!=this.server.game){const n=new pt(this.pastGameDrawed,this.server.game);this.pastGameDrawed=this.server.game,this.updateCamera(n),this.updateEntities(n)}this.animateEntities(i),this.loop&&requestAnimationFrame(this.frame)}updateCamera(t){if(t.camera){const i=t.camera.bottomRight[0]-t.camera.topLeft[0],n=t.camera.bottomRight[1]-t.camera.topLeft[1],o=this.svg.clientWidth,r=this.svg.clientHeight,a=Math.min(o/i,r/n),h=(o/a-i)/2-t.camera.topLeft[0],l=(r/a-n)/2-t.camera.topLeft[1];this.svgCamera.setAttribute("transform",`scale(${a}) translate(${h} ${l})`)}}updateEntities(t){var i,n;for(const[o,r]of t.entities.players.added){this.setActiveEntity("players"+o);const a=new zt(this,r);this.entities.players.set(o,a)}for(const[o,r]of t.entities.players.updated)this.setActiveEntity("players"+o),(i=this.entities.players.get(o))==null||i.update(r);for(const[o,r]of t.entities.boxes.added){this.setActiveEntity("boxes"+o);const a=new gt(this,r);this.entities.boxes.set(o,a)}for(const[o,r]of t.entities.boxes.updated)this.setActiveEntity("boxes"+o),(n=this.entities.boxes.get(o))==null||n.update(r);for(const[o,r]of t.entities.lakes.updated)this.removeEntity("lakes"+o),t.entities.lakes.added.push([o,r]);for(const[o,r]of t.entities.lakes.added){this.setActiveEntity("lakes"+o);const a=new Pt(this,r);this.entities.lakes.set(o,a)}for(const o of["players","boxes","lakes"])for(const r of t.entities[o].removed)this.removeEntity(o+r)}stop(){this.loop=!0}}function Ft(s){let e,t,i;return et(s[4]),{c(){e=it("svg"),this.h()},l(n){e=nt(n,"svg",{width:!0,height:!0}),st(e).forEach(O),this.h()},h(){A(e,"width",s[0]),A(e,"height",s[1])},m(n,o){ot(n,e,o),s[5](e),t||(i=rt(window,"resize",s[4]),t=!0)},p(n,[o]){o&1&&A(e,"width",n[0]),o&2&&A(e,"height",n[1])},i:q,o:q,d(n){n&&O(e),s[5](null),t=!1,i()}}}function Ct(s,e,t){let{server:i}=e,n,o,r;at(()=>{const l=new Lt(i,r);return()=>l.stop()});function a(){t(0,n=window.innerWidth),t(1,o=window.innerHeight)}function h(l){lt[l?"unshift":"push"](()=>{r=l,t(2,r)})}return s.$$set=l=>{"server"in l&&t(3,i=l.server)},[n,o,r,i,a,h]}class Tt extends X{constructor(e){super(),Y(this,e,Ct,Ft,K,{server:3})}}const W=[{hitbox:[[[0,0],[147,142]]],image:`
<rect x="10" y="10" width="130" height="130" fill="#280b0b" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="2.3151" y="1.239" width="65.081" height="63.743" rx="7.5469" ry="7.572" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="1.6738" y="78.51" width="139.49" height="63.743" rx="7.5469" ry="7.572" />
<rect fill="#784421" transform="matrix(1 .00019608 -.012423 .99992 0 0)" x="81.508" y="-.017463" width="65.081" height="142.27" rx="7.5469" ry="7.572" />
`},{hitbox:[[[0,0],[310,164]]],image:`
<rect x="10" y="10" width="280" height="145" fill="#280b0b" />
<rect fill="#784421" x="2.8814" y="1.445" width="73.372" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="98.342" y="1.445" width="120.04" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="147.12" y="90.389" width="120.04" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="-.002408" y="90.389" width="126.89" height="73.372" rx="8.7326" ry="8.4924" />
<rect fill="#784421" x="237.12" y="-.0012769" width="73.372" height="163.76" rx="8.7326" ry="8.4924" />
`}];function j(s,e={}){return W[s%W.length]}const U=[{hitbox:[[[0,-18],[18,0],[0,18],[-18,0]]],image:'<path fill="$body" d="M0,-18 18,0 0,18 -18,0" /><rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />'},{hitbox:[[[15,-20],[15,20],[-20,0]]],image:'<polygon fill="$body" points="15,-20 15,20 -20,0" /><rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />'},{hitbox:[[[16,0],[-5,21],[-15.5,10.5],[-5,0],[-15.5,-10.5],[-5,-21]]],image:'<path fill="$body" d="M 16,0 -5,21 -15.5,10.5 -5,0 -15.5,-10.5 -5,-21" /><rect class="eye" x="0" y="-5.5" width="11" height="11" fill="#000" />'}],Nt=["#55ff55","#ff9955","#ffe680","#d35f8d"];function _(s,e){return{hitbox:U[s].hitbox,image:U[s].image.replaceAll("$body",Nt[e])}}function Gt(){const s=[{user:{name:"A"},skin:_(0,0),position:[0,0],velocity:[0,0],angle:-.5,angular_velocity:0},{user:{name:"B"},skin:_(0,3),position:[-150,-100],velocity:[0,0],angle:0,angular_velocity:0},{user:{name:"C"},skin:_(1,2),position:[-250,-400],velocity:[0,0],angle:2,angular_velocity:0},{user:{name:"D"},skin:_(2,1),position:[300,400],velocity:[0,0],angle:-1,angular_velocity:0}],e=[{skin:j(1,{lamp:!0}),position:[-500,200],angle:-.3},{skin:j(1),position:[400,-500],angle:1.2},{skin:j(0),position:[350,100],angle:.1}],t=[{position:[300,200],polygon:E(0)},{position:[-300,200],polygon:E(1)},{position:[300,-300],polygon:E(2)},{position:[-400,-200],polygon:E(3)}];return{game:{camera:{topLeft:[-700,-500],bottomRight:[700,500]},entities:{players:new Map(s.map((i,n)=>[n,i])),boxes:new Map(e.map((i,n)=>[n,i])),lakes:new Map(t.map((i,n)=>[n,i]))}}}}function It(s){let e,t;return e=new Tt({props:{server:s[0]}}),{c(){ct(e.$$.fragment)},l(i){ht(e.$$.fragment,i)},m(i,n){mt(e,i,n),t=!0},p:q,i(i){t||(ft(e.$$.fragment,i),t=!0)},o(i){dt(e.$$.fragment,i),t=!1},d(i){ut(e,i)}}}function Bt(s){return[Gt()]}class qt extends X{constructor(e){super(),Y(this,e,Bt,It,K,{})}}export{qt as default};
