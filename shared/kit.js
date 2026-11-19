/* Kutty Games shared kit: helpers, sound, voice, picture library, drag, tracing. */
(function(){
"use strict";
const K={};
const PI=Math.PI,TAU=PI*2,INK="#2b2540";
K.PI=PI;K.TAU=TAU;K.INK=INK;
K.$=s=>document.querySelector(s);
K.store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
K.lerp=(a,b,t)=>a+(b-a)*t;K.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
K.rng=function(seed){return function(){seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
K.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
K.pick=a=>a[Math.floor(Math.random()*a.length)];
K.rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

/* ---------- canvas helpers (100-unit box) ---------- */
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function fs(c,fill,stroke,lw){if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||1;c.stroke()}}
function circ(c,x,y,r,fill,stroke,lw){c.beginPath();c.arc(x,y,Math.max(.01,r),0,TAU);fs(c,fill,stroke,lw)}
function ell(c,x,y,rx,ry,fill,stroke,lw,rot){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),rot||0,0,TAU);fs(c,fill,stroke,lw)}
function seg(c,x1,y1,x2,y2,col,lw){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=lw;c.lineCap="round";c.stroke()}
function poly(c,pts,fill,stroke,lw){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();fs(c,fill,stroke,lw)}
function star5(c,x,y,R,r,fill,stroke,lw){const p=[];for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,q=i%2?r:R;p.push([x+q*Math.cos(a),y+q*Math.sin(a)])}poly(c,p,fill,stroke,lw)}
function heart(c,x,y,s,col){c.beginPath();c.moveTo(x,y+s*.35);c.bezierCurveTo(x,y-s*.25,x-s,y-s*.25,x-s,y+s*.25);c.bezierCurveTo(x-s,y+s*.7,x,y+s,x,y+s*1.2);c.bezierCurveTo(x,y+s,x+s,y+s*.7,x+s,y+s*.25);c.bezierCurveTo(x+s,y-s*.25,x,y-s*.25,x,y+s*.35);c.closePath();c.fillStyle=col;c.fill()}
const shine=(c,x,y,rx,ry,rot)=>ell(c,x,y,rx,ry,"rgba(255,255,255,.45)",null,0,rot||-.6);
Object.assign(K,{rrect,fs,circ,ell,seg,poly,star5,heart});

/* ---------- animal heads ---------- */
const ANIMALS={
  bear:{col:"#b9845a",ear:"round",muzzle:"#ecd0ad"},cat:{col:"#ffb04d",ear:"pointy",muzzle:"#fff1dc"},
  elephant:{col:"#a9b4cc",ear:"big"},puppy:{col:"#e3b98a",ear:"flop",muzzle:"#fff1dc"},
  bunny:{col:"#f4efff",ear:"long",muzzle:"#ffffff"},zebra:{col:"#ffffff",ear:"oval",muzzle:"#5b5670"},
  goat:{col:"#efe7d8",ear:"side",muzzle:"#f8f2e8"},mouse:{col:"#b8b8c8",ear:"mouse",muzzle:"#d9d9e4"}};
K.ANIMALS=ANIMALS;
K.animal=function(c,kind,x,y,s,happy,t,body){
  const A=ANIMALS[kind];c.save();c.translate(x,y+(t?Math.sin(t*3)*.7:0));c.scale(s,s);const L=1.1;
  if(body!==false)ell(c,0,24,21,12,A.col,INK,L);
  for(const k of [-1,1]){
    if(A.ear==="round"){circ(c,k*13,-13,6.5,A.col,INK,L);circ(c,k*13,-13,3.4,"#e7a98a")}
    if(A.ear==="pointy"){poly(c,[[k*16,-6],[k*14,-23],[k*4,-15]],A.col,INK,L);poly(c,[[k*13.5,-9],[k*12.8,-19],[k*7,-14]],"#ffb8c8")}
    if(A.ear==="big"){ell(c,k*20,2,11,14,A.col,INK,L);ell(c,k*20,2,7,10,"#f3bccb")}
    if(A.ear==="flop")ell(c,k*16,0,6,12.5,"#b8875a",INK,L,k*.45);
    if(A.ear==="long"){ell(c,k*6.5,-27,4.8,13.5,A.col,INK,L,k*.12);ell(c,k*6.5,-26,2.3,9.5,"#ffc2d6",null,0,k*.12)}
    if(A.ear==="oval"){ell(c,k*12,-17,4,8,A.col,INK,L,k*.4);ell(c,k*12,-16.5,1.8,5,"#ffc2d6",null,0,k*.4)}
    if(A.ear==="side"){ell(c,k*20,-2,8,3.6,A.col,INK,L,k*.3);c.beginPath();c.moveTo(k*6,-15);c.quadraticCurveTo(k*12,-27,k*4,-28);c.strokeStyle="#c9b48f";c.lineWidth=3;c.lineCap="round";c.stroke()}
    if(A.ear==="mouse"){circ(c,k*15,-14,9,A.col,INK,L);circ(c,k*15,-14,5.6,"#ffc2d6")}
  }
  if(kind==="zebra"){ell(c,0,-2,14,20,A.col,INK,L);c.save();c.beginPath();c.ellipse(0,-2,14,20,0,0,TAU);c.clip();for(let i=-3;i<3;i++)seg(c,-16,-14+i*7,-5,-12+i*7,INK,2.4),seg(c,16,-14+i*7,5,-12+i*7,INK,2.4);c.restore();ell(c,0,12,10,8,A.muzzle,INK,L);for(let i=0;i<5;i++)ell(c,0,-22+i*1.5,2.4,3,INK);}
  else circ(c,0,0,18,A.col,INK,L);
  if(kind==="goat"){ell(c,0,7,8,7,A.muzzle);poly(c,[[-3,17],[3,17],[0,25]],"#e2d6bf",INK,.8)}
  else if(A.muzzle&&kind!=="zebra")ell(c,0,6,8.5,6.2,A.muzzle);
  if(kind==="cat"||kind==="mouse")for(const k of [-1,1]){seg(c,k*9,5,k*16,3,INK,.6);seg(c,k*9,7,k*16,8,INK,.6)}
  if(happy){for(const k of [-1,1]){c.beginPath();c.arc(k*6.5,-1,2.6,PI*1.1,PI*1.9);c.strokeStyle=INK;c.lineWidth=1.3;c.lineCap="round";c.stroke()}c.globalAlpha=.6;circ(c,-11,5,3,"#ff8fb8");circ(c,11,5,3,"#ff8fb8");c.globalAlpha=1}
  else for(const k of [-1,1]){circ(c,k*6.5,-2,2.4,INK);circ(c,k*6.5+.8,-2.8,.8,"#fff")}
  if(kind==="elephant"){c.beginPath();c.moveTo(-3.5,2);c.quadraticCurveTo(-4,13,1,17);c.quadraticCurveTo(5,19,6,15);c.quadraticCurveTo(2,14,3.5,2);c.closePath();fs(c,A.col,INK,L)}
  else if(kind==="zebra"){ell(c,-3,10,1.2,1,INK);ell(c,3,10,1.2,1,INK)}
  else ell(c,0,3,2.4,1.7,kind==="mouse"?"#ff8fb8":INK);
  const mx=kind==="elephant"?-9:0,my=kind==="elephant"?9:kind==="zebra"?14:8.5;
  if(happy){c.beginPath();c.moveTo(mx-4,my);c.quadraticCurveTo(mx,my+6,mx+4,my);c.closePath();fs(c,"#7a2e3a");ell(c,mx,my+2.6,2,1.2,"#ff8fa3")}
  else{c.beginPath();c.arc(mx,my,2.6,.15*PI,.85*PI);c.strokeStyle=INK;c.lineWidth=1.1;c.lineCap="round";c.stroke()}
  c.restore();
};
const head=(kind,y,s)=>c=>K.animal(c,kind,50,y||56,s||1.9,false,0,false);

/* ---------- picture library ---------- */
const ART={
  apple(c){circ(c,50,57,31,"#ff4d4d","#c93232",2);shine(c,39,44,8,5);seg(c,50,27,53,14,"#6b4a1a",4);ell(c,63,18,11,5,"#4caf50","#2e8a3c",1,-.4)},
  banana(c){c.lineCap="round";c.beginPath();c.arc(50,112,64,PI*1.24,PI*1.76);c.strokeStyle="#d9ab25";c.lineWidth=24;c.stroke();c.strokeStyle="#ffd84d";c.lineWidth=19;c.stroke();c.beginPath();c.arc(50,118,66,PI*1.34,PI*1.6);c.strokeStyle="#fff1a8";c.lineWidth=3;c.stroke();circ(c,50+64*Math.cos(PI*1.24),112+64*Math.sin(PI*1.24),4,"#6b4a1a");circ(c,50+64*Math.cos(PI*1.76),112+64*Math.sin(PI*1.76),4,"#6b4a1a")},
  mango(c){ell(c,52,58,27,34,"#ffc93c","#e0a020",2,-.5);ell(c,62,66,12,15,"rgba(255,110,50,.35)",null,0,-.5);shine(c,42,44,6,9,-.5);seg(c,40,27,36,18,"#6b4a1a",3.5);ell(c,30,16,10,4.5,"#4caf50","#2e8a3c",1,.3)},
  orange(c){circ(c,50,57,31,"#ff9f1c","#e07d00",2);c.fillStyle="rgba(200,100,0,.25)";for(let i=0;i<14;i++){const a=i*2.3,d=10+(i*7)%18;c.beginPath();c.arc(50+Math.cos(a)*d,57+Math.sin(a)*d,1,0,TAU);c.fill()}shine(c,39,45,8,5);ell(c,58,24,9,4,"#4caf50","#2e8a3c",1,-.3);circ(c,50,27,2.5,"#6b8a2a")},
  grapes(c){seg(c,50,18,55,6,"#6b4a1a",4);ell(c,64,14,9,4,"#4caf50",null,0,-.3);[[38,30],[50,30],[62,30],[32,44],[44,44],[56,44],[68,44],[38,58],[50,58],[62,58],[44,72],[56,72],[50,85]].forEach(p=>{circ(c,p[0],p[1],8.5,"#9be15d","#6fb33a",1.4);circ(c,p[0]-2.6,p[1]-2.6,2.2,"rgba(255,255,255,.7)")})},
  strawberry(c){c.beginPath();c.moveTo(50,92);c.bezierCurveTo(18,70,14,30,34,26);c.bezierCurveTo(44,24,48,28,50,30);c.bezierCurveTo(52,28,56,24,66,26);c.bezierCurveTo(86,30,82,70,50,92);c.closePath();fs(c,"#ff3b4e","#c9203a",2);c.fillStyle="#ffe48a";for(let i=0;i<14;i++){const x=32+(i*13)%36,y=40+(i*7)%40;ell(c,x,y,1.3,2,"#ffe48a")}star5(c,50,26,16,6,"#4caf50","#2e8a3c",1)},
  cherry(c){c.beginPath();c.moveTo(32,64);c.quadraticCurveTo(42,26,58,14);c.moveTo(68,68);c.quadraticCurveTo(66,36,58,14);c.strokeStyle="#4a7a2a";c.lineWidth=3.5;c.stroke();ell(c,66,14,10,4.5,"#4caf50",null,0,-.4);circ(c,32,70,16,"#e3263a","#b01a2b",1.6);circ(c,68,72,16,"#e3263a","#b01a2b",1.6);circ(c,26,64,4,"rgba(255,255,255,.7)");circ(c,62,66,4,"rgba(255,255,255,.7)")},
  watermelon(c){c.beginPath();c.arc(50,36,44,0,PI);c.closePath();fs(c,"#2fa84a");c.beginPath();c.arc(50,36,38,0,PI);c.closePath();fs(c,"#eafbd8");c.beginPath();c.arc(50,36,34,0,PI);c.closePath();fs(c,"#ff5a6e");for(let i=0;i<7;i++){const a=.35+i*.4;ell(c,50+Math.cos(a)*22,36+Math.sin(a)*20,1.6,2.8,INK,null,0,a)}},
  pineapple(c){for(let i=-2;i<=2;i++)poly(c,[[50+i*6-4,36],[50+i*9,6+Math.abs(i)*6],[50+i*6+4,36]],"#4caf50","#2e8a3c",1);ell(c,50,64,24,30,"#ffc93c","#d99a1a",2);c.save();c.beginPath();c.ellipse(50,64,24,30,0,0,TAU);c.clip();c.strokeStyle="#c9861a";c.lineWidth=1.3;for(let i=-60;i<60;i+=9){c.beginPath();c.moveTo(20+i,34);c.lineTo(80+i,94);c.moveTo(80-i,34);c.lineTo(20-i,94);c.stroke()}c.restore()},
  lemon(c){ell(c,50,56,32,24,"#ffe14d","#e5b800",2);ell(c,17,56,5,4,"#ffe14d","#e5b800",1.5);ell(c,83,56,5,4,"#ffe14d","#e5b800",1.5);shine(c,40,47,10,4,-.2)},
  carrot(c){c.save();c.translate(50,54);c.rotate(.6);poly(c,[[-12,-26],[12,-26],[0,40]],"#ff8a1f","#d96500",1.6);for(let i=0;i<4;i++)seg(c,-8+i*2,-14+i*13,-2+i*2,-12+i*13,"#d96500",1.4);for(let i=-1;i<=1;i++)ell(c,i*7,-36,4,11,"#4caf50","#2e8a3c",1,i*.4);c.restore()},
  tomato(c){circ(c,50,58,30,"#ff4433","#c9281c",2);shine(c,38,46,8,5);star5(c,50,30,13,5,"#4caf50","#2e8a3c",1);seg(c,50,30,50,20,"#2e8a3c",3)},
  cat:head("cat",58),bear:head("bear",58),elephant:head("elephant",54,1.65),puppy:head("puppy",56),bunny:head("bunny",66,1.5),zebra:head("zebra",54,1.85),goat:head("goat",60,1.75),mouse:head("mouse",60,1.7),
  fish(c){poly(c,[[70,52],[92,34],[88,52],[92,70]],"#ff9f1c","#d97c00",1.6);ell(c,44,52,32,22,"#4cc9f0","#2a9cc4",2);c.save();c.beginPath();c.ellipse(44,52,32,22,0,0,TAU);c.clip();for(let i=0;i<3;i++)for(let j=0;j<3;j++){c.beginPath();c.arc(46+i*9,40+j*10,5,-PI/2,PI/2);c.strokeStyle="rgba(255,255,255,.5)";c.lineWidth=1.2;c.stroke()}c.restore();circ(c,26,46,5,"#fff",INK,1);circ(c,25,46,2.4,INK);poly(c,[[40,32],[52,18],[58,33]],"#ff9f1c","#d97c00",1.2);c.beginPath();c.arc(16,56,4,-.2,.9);c.strokeStyle=INK;c.lineWidth=1.4;c.stroke()},
  bird(c){poly(c,[[60,70],[86,92],[72,64]],"#2e8a3c");poly(c,[[56,72],[70,98],[66,66]],"#3fbf5a");ell(c,52,58,24,28,"#3fbf5a","#2e8a3c",2);ell(c,58,62,12,18,"#2e8a3c",null,0,-.3);circ(c,42,32,17,"#3fbf5a","#2e8a3c",2);c.beginPath();c.moveTo(28,30);c.quadraticCurveTo(14,32,22,46);c.quadraticCurveTo(26,38,30,38);c.closePath();fs(c,"#ff9f1c","#d97c00",1.4);circ(c,40,28,4.5,"#fff",INK,1);circ(c,39,28,2.2,INK);ell(c,50,20,6,3,"#ff5a5f",null,0,-.5)},
  car(c){rrect(c,8,48,84,26,9);fs(c,"#ff5a5f","#c93232",2);c.beginPath();c.moveTo(24,48);c.lineTo(34,28);c.lineTo(66,28);c.lineTo(78,48);c.closePath();fs(c,"#ff5a5f","#c93232",2);poly(c,[[37,32],[48,32],[48,46],[30,46]],"#cdeeff");poly(c,[[52,32],[64,32],[73,46],[52,46]],"#cdeeff");circ(c,28,76,10,INK);circ(c,28,76,4,"#cfc8de");circ(c,72,76,10,INK);circ(c,72,76,4,"#cfc8de");circ(c,88,56,3,"#ffd23f")},
  van(c){rrect(c,8,26,84,48,8);fs(c,"#3a9df0","#2878c0",2);rrect(c,14,32,20,16,3);fs(c,"#cdeeff");rrect(c,38,32,20,16,3);fs(c,"#cdeeff");poly(c,[[64,32],[80,32],[88,48],[64,48]],"#cdeeff");seg(c,8,58,92,58,"#ffffff",3);circ(c,26,76,10,INK);circ(c,26,76,4,"#cfc8de");circ(c,74,76,10,INK);circ(c,74,76,4,"#cfc8de")},
  bus(c){rrect(c,6,22,88,52,8);fs(c,"#ffd23f","#d9a800",2);for(let i=0;i<4;i++){rrect(c,12+i*19,30,15,16,3);fs(c,"#cdeeff")}seg(c,6,56,94,56,"#ff9f1c",3);circ(c,24,76,10,INK);circ(c,24,76,4,"#cfc8de");circ(c,76,76,10,INK);circ(c,76,76,4,"#cfc8de")},
  boat(c){c.beginPath();c.moveTo(10,62);c.lineTo(90,62);c.lineTo(76,82);c.lineTo(24,82);c.closePath();fs(c,"#a0643c","#7a4a28",2);seg(c,50,62,50,10,"#7a4a28",3);poly(c,[[52,14],[82,56],[52,56]],"#ffffff",INK,1.4);poly(c,[[48,22],[48,56],[24,56]],"#ff8fb8",INK,1.4);c.beginPath();for(let x=0;x<=100;x+=10)c.quadraticCurveTo(x-5,88,x,84);c.strokeStyle="#4cc9f0";c.lineWidth=3;c.stroke()},
  ball(c){const cols=["#ff5a5f","#ffd23f","#3a9df0","#ffffff","#2ec27e","#ffffff"];for(let i=0;i<6;i++){c.beginPath();c.moveTo(50,52);c.arc(50,52,36,i*TAU/6,(i+1)*TAU/6);c.closePath();fs(c,cols[i])}circ(c,50,52,36,null,INK,2);circ(c,50,52,7,"#fff",INK,1.4);shine(c,36,38,9,5)},
  star(c){star5(c,50,54,42,18,"#ffd23f","#e0a800",2.4);circ(c,42,52,2.6,INK);circ(c,58,52,2.6,INK);c.beginPath();c.arc(50,58,5,.15*PI,.85*PI);c.strokeStyle=INK;c.lineWidth=1.6;c.stroke()},
  sun(c){for(let i=0;i<12;i++){const a=i*TAU/12;seg(c,50+Math.cos(a)*32,50+Math.sin(a)*32,50+Math.cos(a)*44,50+Math.sin(a)*44,"#ff9f1c",4.5)}circ(c,50,50,26,"#ffd23f","#ff9f1c",2);circ(c,42,46,2.6,INK);circ(c,58,46,2.6,INK);c.beginPath();c.arc(50,52,8,.15*PI,.85*PI);c.strokeStyle=INK;c.lineWidth=1.8;c.stroke();ell(c,37,56,4,2.5,"rgba(255,120,120,.5)");ell(c,63,56,4,2.5,"rgba(255,120,120,.5)")},
  moon(c){c.beginPath();c.arc(50,50,36,PI*.35,PI*1.65);c.arc(66,42,30,PI*1.45,PI*.55,true);c.closePath();fs(c,"#ffe58a","#e0b400",2);circ(c,34,48,2.4,INK)},
  house(c){rrect(c,18,46,64,44,3);fs(c,"#ffd9a8","#c98d4f",2);poly(c,[[10,48],[50,14],[90,48]],"#ff5a5f","#c93232",2);rrect(c,42,62,16,28,3);fs(c,"#a0643c");circ(c,54,77,1.4,"#ffd23f");rrect(c,24,56,13,12,2);fs(c,"#cdeeff","#fff",1.6);rrect(c,63,56,13,12,2);fs(c,"#cdeeff","#fff",1.6)},
  flower(c){seg(c,50,54,50,96,"#2e8a3c",4);ell(c,40,80,10,4,"#4caf50",null,0,.5);ell(c,60,74,10,4,"#4caf50",null,0,-.5);for(let i=0;i<6;i++){const a=i*TAU/6;ell(c,50+Math.cos(a)*16,40+Math.sin(a)*16,11,8,"#ff8fb8","#e0608f",1.4,a)}circ(c,50,40,11,"#ffd23f","#e0a800",1.4)},
  tree(c){rrect(c,42,56,16,38,4);fs(c,"#a0643c","#7a4a28",1.6);circ(c,34,46,20,"#4caf50","#2e8a3c",1.6);circ(c,66,46,20,"#4caf50","#2e8a3c",1.6);circ(c,50,30,24,"#5cc95e","#2e8a3c",1.6);circ(c,38,40,3.5,"#ff4d4d");circ(c,60,30,3.5,"#ff4d4d");circ(c,66,52,3.5,"#ff4d4d")},
  balloon(c){c.beginPath();c.moveTo(50,72);c.quadraticCurveTo(44,84,52,98);c.strokeStyle=INK;c.lineWidth=1.4;c.stroke();ell(c,50,40,26,32,"#ff5a5f","#c93232",2);poly(c,[[46,74],[54,74],[50,69]],"#c93232");shine(c,40,28,6,10,-.4)},
  umbrella(c){c.beginPath();c.moveTo(50,48);c.lineTo(50,86);c.arc(43,86,7,0,PI);c.strokeStyle="#7a4a28";c.lineWidth=4;c.lineCap="round";c.stroke();c.beginPath();c.arc(50,50,40,PI,TAU);for(let i=4;i>=1;i--)c.arc(10+i*20-10,50,10,0,PI,true);c.closePath();fs(c,"#8e6cff","#6a4ad0",2);seg(c,50,10,50,48,"#6a4ad0",1.4);circ(c,50,9,3,"#ffd23f")},
  cupcake(c){c.beginPath();c.moveTo(24,56);c.lineTo(76,56);c.lineTo(68,92);c.lineTo(32,92);c.closePath();fs(c,"#ff8fb8","#e0608f",1.6);for(let i=1;i<6;i++)seg(c,24+i*9,57,32+i*6,91,"#ec74a3",1.2);[[50,56,30,10],[50,45,24,9],[50,35,16,8],[50,27,8,6]].forEach(e=>ell(c,e[0],e[1],e[2],e[3],"#fff0f6","#e8b8cc",1.2));circ(c,50,16,6,"#e3263a","#b01a2b",1)},
  kite(c){poly(c,[[50,6],[80,40],[50,76],[20,40]],"#ffd23f","#d9a800",2);poly(c,[[50,6],[80,40],[50,40]],"#ff5a5f");poly(c,[[50,40],[20,40],[50,76]],"#3a9df0");seg(c,50,6,50,76,INK,1.2);seg(c,20,40,80,40,INK,1.2);c.beginPath();c.moveTo(50,76);c.quadraticCurveTo(40,86,54,92);c.quadraticCurveTo(64,96,58,100);c.strokeStyle=INK;c.lineWidth=1.4;c.stroke();poly(c,[[46,84],[38,80],[38,88]],"#ff8fb8");poly(c,[[46,84],[54,80],[54,88]],"#ff8fb8")},
  icecream(c){poly(c,[[30,50],[70,50],[50,96]],"#f2b56b","#c98d4f",1.6);c.save();c.beginPath();c.moveTo(30,50);c.lineTo(70,50);c.lineTo(50,96);c.closePath();c.clip();c.strokeStyle="#c98d4f";c.lineWidth=1.2;for(let i=-30;i<40;i+=8){seg(c,30+i,50,60+i,96,"#c98d4f",1.2);seg(c,70-i,50,40-i,96,"#c98d4f",1.2)}c.restore();circ(c,40,44,14,"#ff8fb8","#e0608f",1.4);circ(c,60,44,14,"#b9f0d8","#5cc9a0",1.4);circ(c,50,28,15,"#fff3d6","#e3c58e",1.4);circ(c,52,13,4,"#e3263a")},
  jug(c){c.beginPath();c.moveTo(30,22);c.lineTo(70,22);c.lineTo(74,88);c.lineTo(26,88);c.closePath();fs(c,"#d7efff");c.save();c.clip();c.fillStyle="#7cc4ff";c.fillRect(0,46,100,50);c.restore();c.beginPath();c.moveTo(30,22);c.lineTo(70,22);c.lineTo(74,88);c.lineTo(26,88);c.closePath();fs(c,null,INK,2);c.beginPath();c.moveTo(72,34);c.quadraticCurveTo(94,40,73,72);c.strokeStyle=INK;c.lineWidth=5;c.stroke();poly(c,[[30,22],[18,16],[32,32]],"#d7efff",INK,2)},
  nest(c){circ(c,40,48,10,"#e9f5ff","#a9c4dd",1.4);circ(c,58,46,10,"#e9f5ff","#a9c4dd",1.4);circ(c,50,52,10,"#e9f5ff","#a9c4dd",1.4);c.beginPath();c.moveTo(12,52);c.quadraticCurveTo(50,96,88,52);c.closePath();fs(c,"#a0643c","#7a4a28",2);c.strokeStyle="#c98d4f";c.lineWidth=1.4;for(let i=0;i<6;i++){c.beginPath();c.moveTo(16+i*4,56+i*3);c.quadraticCurveTo(50,62+i*5,84-i*4,56+i*3);c.stroke()}},
  crown(c){poly(c,[[14,74],[14,34],[32,52],[50,24],[68,52],[86,34],[86,74]],"#ffd23f","#d9a800",2.4);rrect(c,14,70,72,12,3);fs(c,"#ffb800","#d9a800",2);circ(c,50,60,5,"#ff5a5f");circ(c,30,64,4,"#3a9df0");circ(c,70,64,4,"#2ec27e");circ(c,14,32,4,"#ff8fb8");circ(c,50,22,4,"#ff8fb8");circ(c,86,32,4,"#ff8fb8")},
  xylophone(c){const cols=["#ff5a5f","#ff9f1c","#ffd23f","#2ec27e","#3a9df0","#8e6cff"];seg(c,10,34,90,44,"#a0643c",4);seg(c,10,78,90,66,"#a0643c",4);cols.forEach((col,i)=>{const x=13+i*13,h=46-i*4.4;rrect(c,x,56-h/2+i*1.5,10,h,3);fs(c,col,INK,1.2)});seg(c,60,92,90,86,"#a0643c",3);circ(c,58,92,5,"#ff5a5f",INK,1.2)},
  yoyo(c){c.beginPath();c.moveTo(50,4);c.lineTo(50,30);c.strokeStyle=INK;c.lineWidth=1.6;c.stroke();circ(c,50,30,3,"#fff",INK,1.2);circ(c,50,62,32,"#ff5a5f","#c93232",2);circ(c,50,62,22,"#ff8a8a");circ(c,50,62,8,"#ffd23f","#d9a800",1.4);shine(c,38,48,8,5)},
  leaf(c){c.save();c.translate(50,52);c.rotate(-.5);c.beginPath();c.moveTo(-40,0);c.quadraticCurveTo(0,-32,40,0);c.quadraticCurveTo(0,32,-40,0);c.closePath();fs(c,"#4caf50","#2e8a3c",2);seg(c,-46,0,38,0,"#a6e39a",2);for(let i=-28;i<30;i+=10){seg(c,i,0,i+8,-12,"#a6e39a",1.2);seg(c,i,0,i+8,12,"#a6e39a",1.2)}c.restore()},
  fly(c){ell(c,36,40,16,22,"rgba(205,235,255,.75)","#9fc9e8",1.4,-.6);ell(c,64,40,16,22,"rgba(205,235,255,.75)","#9fc9e8",1.4,.6);ell(c,50,60,13,20,"#3b3550");circ(c,50,38,11,"#3b3550");circ(c,45,36,4.5,"#ff5a5f");circ(c,55,36,4.5,"#ff5a5f");for(const k of [-1,1])for(let i=0;i<3;i++)seg(c,50+k*10,54+i*7,50+k*20,58+i*9,"#3b3550",1.8)},
  ladder(c){seg(c,32,8,26,94,"#a0643c",5);seg(c,68,8,74,94,"#a0643c",5);for(let i=0;i<6;i++){const y=18+i*14;seg(c,32-(y-8)*.07,y,68+(y-8)*.07,y,"#c98d4f",4)}},
  swing(c){seg(c,6,10,94,10,"#7a4a28",6);seg(c,30,10,32,70,"#a0643c",2);seg(c,70,10,68,70,"#a0643c",2);rrect(c,24,68,52,8,3);fs(c,"#ff5a5f","#c93232",1.6);ell(c,20,92,20,5,"#9be15d");ell(c,78,94,22,5,"#9be15d")},
  bottle(c){rrect(c,26,30,48,62,12);fs(c,"#cdb8ff","#8e6cff",2);rrect(c,36,14,28,18,4);fs(c,"#ffffff",INK,1.6);rrect(c,32,48,36,26,5);fs(c,"#fff");rrect(c,46,52,8,18,1.5);fs(c,"#ff5a5f");rrect(c,41,57,18,8,1.5);fs(c,"#ff5a5f")},
  ural(c){ell(c,50,86,30,8,"#8d8a99");rrect(c,24,40,52,46,6);fs(c,"#b4adc6","#8d8a99",2);ell(c,50,40,26,7,"#8d8a99","#6f6b80",1.6);ell(c,50,40,18,4.5,"#5f5a70");rrect(c,46,4,8,40,4);fs(c,"#a0643c","#7a4a28",1.4)},
  one(c){c.fillStyle="#3a9df0";c.font='800 70px "Baloo Thambi 2",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText("1",50,46);circ(c,50,86,7,"#ff5a5f")},
  five(c){c.fillStyle="#8e6cff";c.font='800 66px "Baloo Thambi 2",sans-serif';c.textAlign="center";c.textBaseline="middle";c.fillText("5",50,42);[22,36,50,64,78].forEach(x=>circ(c,x,86,5.5,"#ff5a5f"))},
  basket(c){c.beginPath();c.moveTo(16,44);c.quadraticCurveTo(50,8,84,44);c.strokeStyle="#a0643c";c.lineWidth=5;c.stroke();c.beginPath();c.moveTo(10,44);c.lineTo(90,44);c.lineTo(80,88);c.lineTo(20,88);c.closePath();fs(c,"#e0a060","#a0643c",2);c.strokeStyle="#c98d4f";c.lineWidth=1.6;for(let i=0;i<4;i++)seg(c,12+i*.5,54+i*10,88-i*.5,54+i*10,"#c98d4f",1.6);for(let i=1;i<7;i++)seg(c,10+i*11.4,44,20+i*8.6,88,"#c98d4f",1.4)}
};
K.ART=ART;
const META={apple:["Apple","fruit","red"],banana:["Banana","fruit","yellow"],mango:["Mango","fruit","yellow"],orange:["Orange","fruit","orange"],grapes:["Grapes","fruit","green"],strawberry:["Strawberry","fruit","red"],cherry:["Cherry","fruit","red"],watermelon:["Watermelon","fruit","red"],pineapple:["Pineapple","fruit","yellow"],lemon:["Lemon","fruit","yellow"],
  carrot:["Carrot","veg","orange"],tomato:["Tomato","veg","red"],
  cat:["Cat","animal","orange"],bear:["Bear","animal","brown"],elephant:["Elephant","animal","grey"],puppy:["Dog","animal","brown"],bunny:["Rabbit","animal","white"],zebra:["Zebra","animal","white"],goat:["Goat","animal","white"],mouse:["Mouse","animal","grey"],fish:["Fish","animal","blue"],bird:["Parrot","animal","green"],
  car:["Car","vehicle","red"],van:["Van","vehicle","blue"],bus:["Bus","vehicle","yellow"],boat:["Boat","vehicle","brown"],
  ball:["Ball","toy","red"],kite:["Kite","toy","yellow"],yoyo:["Yo-yo","toy","red"],xylophone:["Xylophone","toy","red"],balloon:["Balloon","toy","red"],
  star:["Star","sky","yellow"],sun:["Sun","sky","yellow"],moon:["Moon","sky","yellow"],
  house:["House","thing","red"],flower:["Flower","plant","pink"],tree:["Tree","plant","green"],leaf:["Leaf","plant","green"],umbrella:["Umbrella","thing","purple"],cupcake:["Cupcake","food","pink"],icecream:["Ice cream","food","pink"],jug:["Jug","thing","blue"],nest:["Nest","thing","brown"],crown:["Crown","thing","yellow"]};
K.META=META;
K.label=n=>META[n]?META[n][0]:n;
K.cat=n=>META[n]?META[n][1]:"";
K.ofCat=cat=>Object.keys(META).filter(n=>META[n][1]===cat);
K.drawArt=function(c,name){c.save();ART[name](c);c.restore()};
const dprOf=()=>Math.min(window.devicePixelRatio||1,2.5);
K.canvas=function(draw,px,opt){opt=opt||{};const cv=document.createElement("canvas"),d=dprOf();cv.width=cv.height=Math.round(px*d);cv.style.width=cv.style.height=px+"px";const c=cv.getContext("2d");c.setTransform(px*d/100,0,0,px*d/100,0,0);
  if(opt.bg){circ(c,50,50,50,opt.bg)}
  if(opt.scale){c.translate(50,50);c.scale(opt.scale,opt.scale);c.translate(-50,-50)}
  draw(c);
  if(opt.shadow){c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation="source-in";c.fillStyle=opt.shadow===true?"#4a4460":opt.shadow;c.fillRect(0,0,cv.width,cv.height);c.globalCompositeOperation="source-over"}
  return cv};
K.art=(name,px,opt)=>K.canvas(c=>K.drawArt(c,name),px,opt);

/* ---------- sound ---------- */
let ac=null,noiseBuf=null;K.sound=K.store.get("kg_sound",true);
K.actx=function(){if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ac=new AC()}if(ac.state==="suspended")ac.resume();return ac};
function tone(f,d,type,v,delay){if(!K.sound)return;const a=K.actx();if(!a)return;try{const o=a.createOscillator(),g=a.createGain(),s=a.currentTime+(delay||0);o.type=type||"sine";o.frequency.value=f;g.gain.setValueAtTime(v||.12,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g).connect(a.destination);o.start(s);o.stop(s+d+.02)}catch(e){}}
function noise(d,f,q,v){if(!K.sound)return;const a=K.actx();if(!a)return;try{if(!noiseBuf){noiseBuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const x=noiseBuf.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1}const s=a.createBufferSource();s.buffer=noiseBuf;const fl=a.createBiquadFilter();fl.type="bandpass";fl.frequency.value=f;fl.Q.value=q;const g=a.createGain(),t=a.currentTime;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(a.destination);s.start(t);s.stop(t+d+.02)}catch(e){}}
K.sfx={pop(){tone(520,.08,"triangle",.14);tone(780,.1,"triangle",.1,.05)},tap(){tone(620+Math.random()*260,.07,"sine",.11)},flip(){noise(.06,1400,1,.25)},
  ding(){tone(784,.2,"triangle",.12);tone(1046,.25,"triangle",.12,.08)},yay(){[523,659,784,1046,1318].forEach((f,i)=>tone(f,.25,"triangle",.13,i*.08))},
  oops(){tone(300,.12,"sine",.12);tone(240,.16,"sine",.1,.1)},whoosh(){noise(.18,700,.8,.25)},count(n){tone(440+n*40,.12,"triangle",.12)}};

/* ---------- voice (English + Tamil) ---------- */
let vEn=null,vTa=null;
function pickVoices(){try{const v=speechSynthesis.getVoices();vEn=v.find(x=>/en[-_]IN/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;vTa=v.find(x=>/^ta/i.test(x.lang))||null}catch(e){}}
if("speechSynthesis" in window){pickVoices();try{speechSynthesis.addEventListener("voiceschanged",pickVoices)}catch(e){}}
K.hasTamilVoice=()=>!!vTa;
/* parts: string, or [{t:"three"},{t:"மூன்று",ta:"moondru"}] */
K.speak=function(parts){if(!K.sound||!("speechSynthesis" in window))return;if(typeof parts==="string")parts=[{t:parts}];
  try{speechSynthesis.cancel();for(const p of parts){let u;if(p.ta!==undefined){if(vTa){u=new SpeechSynthesisUtterance(p.t);u.voice=vTa;u.lang=vTa.lang}else{u=new SpeechSynthesisUtterance(p.ta);if(vEn)u.voice=vEn;u.lang=vEn?vEn.lang:"en-IN"}}else{u=new SpeechSynthesisUtterance(p.t);if(vEn)u.voice=vEn;u.lang=vEn?vEn.lang:"en-IN"}u.rate=p.rate||.9;u.pitch=1.2;speechSynthesis.speak(u)}}catch(e){}};
K.hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
K.soundButton=function(btn,onChange){const draw=()=>{btn.innerHTML=K.sound?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';btn.setAttribute("aria-label",K.sound?"Sound on":"Sound off")};
  draw();btn.onclick=()=>{K.sound=!K.sound;K.store.set("kg_sound",K.sound);draw();if(!K.sound)K.hush();else K.sfx.pop();onChange&&onChange()}};
K.HEAR='<svg viewBox="0 0 24 24" fill="none" stroke="#2b2540" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#2b2540"/><path d="M16 9a4 4 0 010 6"/></svg>';
K.HOME='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
K.GRID='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>';

/* ---------- toast & confetti ---------- */
K.toast=function(t){let el=K.$("#toast");if(!el){el=document.createElement("div");el.id="toast";el.className="toast";document.body.append(el)}el.textContent=t;el.classList.add("on");clearTimeout(K.toast.t);K.toast.t=setTimeout(()=>el.classList.remove("on"),1200)};
K.confetti=function(n){const cs=["#ff5a5f","#ffd23f","#4cc9f0","#8e6cff","#2ec27e","#ff7ac6"];for(let i=0;i<n;i++){const s=document.createElement("i");s.className="conf";s.style.left=Math.random()*100+"vw";s.style.background=cs[i%cs.length];s.style.setProperty("--d",(1.4+Math.random()*1.2)+"s");s.style.setProperty("--dx",(Math.random()*160-80)+"px");s.style.setProperty("--r",(Math.random()*900-450)+"deg");s.style.animationDelay=Math.random()*.3+"s";document.body.append(s);setTimeout(()=>s.remove(),3200)}};
K.praise=()=>K.pick(["Super!","Well done!","Great job!","You got it!","Wow!","Clever!"]);
K.shake=el=>{el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake")};

/* ---------- drag helper ----------
   K.drag(el,{make:()=>canvas, offset:true, drop:(x,y)=>bool, start:()=>bool}) */
K.drag=function(el,o){
  el.style.touchAction="none";
  el.addEventListener("pointerdown",e=>{
    if(o.start&&o.start()===false)return;e.preventDefault();K.actx();
    const pid=e.pointerId,touch=e.pointerType==="touch",g=o.make();g.classList.add("ghost");document.body.append(g);
    const w=g.offsetWidth||parseFloat(g.style.width)||80,h=g.offsetHeight||w;
    const off=touch?[0,-Math.min(70,h*.6)]:[0,0];let cx=e.clientX+off[0],cy=e.clientY+off[1];
    const place=()=>{g.style.transform=`translate(${cx-w/2}px,${cy-h/2}px)`};place();el.style.opacity=".3";
    const mv=ev=>{if(ev.pointerId!==pid)return;cx=ev.clientX+off[0];cy=ev.clientY+off[1];place()};
    const up=ev=>{if(ev.pointerId!==pid)return;removeEventListener("pointermove",mv);removeEventListener("pointerup",up);removeEventListener("pointercancel",up);
      const ok=ev.type==="pointerup"&&o.drop(cx,cy);
      if(ok){g.remove();el.style.opacity=""}
      else{const r=el.getBoundingClientRect();g.classList.add("back");g.style.transform=`translate(${r.left+r.width/2-w/2}px,${r.top+r.height/2-h/2}px) scale(.8)`;g.style.opacity="0";setTimeout(()=>{g.remove();el.style.opacity=""},300);if(ev.type==="pointerup")o.miss&&o.miss()}};
    addEventListener("pointermove",mv);addEventListener("pointerup",up);addEventListener("pointercancel",up);
  });
};
K.hit=(el,x,y,pad)=>{const r=el.getBoundingClientRect(),p=pad||0;return x>=r.left-p&&x<=r.right+p&&y>=r.top-p&&y<=r.bottom+p};

/* ---------- letter / number tracing ---------- */
K.fontsReady=function(){try{return Promise.race([document.fonts.load('800 100px "Baloo Thambi 2"',"Aஅ1"),new Promise(r=>setTimeout(r,2500))])}catch(e){return Promise.resolve()}};
K.Trace=function(ch){
  const N=240,cv=document.createElement("canvas");cv.width=cv.height=N;const c=cv.getContext("2d");
  let size=N*.74;const font=s=>`800 ${s}px "Baloo Thambi 2","Nirmala UI","Latha",sans-serif`;c.font=font(size);
  let m=c.measureText(ch);const maxW=N*.84;if(m.width>maxW){size*=maxW/m.width;c.font=font(size);m=c.measureText(ch)}
  const asc=m.actualBoundingBoxAscent||size*.7,desc=m.actualBoundingBoxDescent||0;
  if(asc+desc>N*.8){size*=N*.8/(asc+desc);c.font=font(size);m=c.measureText(ch)}
  const a2=m.actualBoundingBoxAscent||size*.7,d2=m.actualBoundingBoxDescent||0,y=N/2+(a2-d2)/2;
  c.textAlign="center";c.textBaseline="alphabetic";c.fillStyle="#000";c.fillText(ch,N/2,y);
  const data=c.getImageData(0,0,N,N).data,pts=[];const step=2.4;
  for(let py=0;py<N;py+=step)for(let px=0;px<N;px+=step){const i=(Math.floor(py)*N+Math.floor(px))*4+3;if(data[i]>140)pts.push(px*100/N,py*100/N)}
  this.ch=ch;this.size=size*100/N;this.y=y*100/N;this.pts=pts;this.cov=new Uint8Array(pts.length/2);this.n=0;this.strokes=[];this.off=0;this.on=0;
  let sx=1e9,sy=1e9;for(let i=0;i<pts.length;i+=2){if(pts[i+1]<sy-2||(Math.abs(pts[i+1]-sy)<=2&&pts[i]<sx)){sx=pts[i];sy=pts[i+1]}}this.start=[sx,sy];
};
K.Trace.prototype.font=function(){return`800 ${this.size}px "Baloo Thambi 2","Nirmala UI","Latha",sans-serif`};
K.Trace.prototype.add=function(a,b,r){
  r=r||7.5;const rr=r*r,n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.5)),P=this.pts,C=this.cov;let got=0;
  for(let s=0;s<=n;s++){const qx=a[0]+(b[0]-a[0])*s/n,qy=a[1]+(b[1]-a[1])*s/n;let near=false;
    for(let j=0;j<C.length;j++){const dx=P[j*2]-qx,dy=P[j*2+1]-qy,d=dx*dx+dy*dy;if(d<rr*1.6)near=true;if(!C[j]&&d<rr){C[j]=1;this.n++;got++}}
    if(near)this.on++;else this.off++}
  return got};
K.Trace.prototype.progress=function(){return this.cov.length?this.n/this.cov.length:0};
K.Trace.prototype.draw=function(c,col,done,t){
  c.save();c.font=this.font();c.textAlign="center";c.textBaseline="alphabetic";
  if(done){c.fillStyle=col;c.fillText(this.ch,50,this.y);c.lineWidth=1.2;c.strokeStyle="rgba(43,37,64,.35)";c.strokeText(this.ch,50,this.y)}
  else{c.fillStyle="#efe9fa";c.fillText(this.ch,50,this.y);c.setLineDash([1.6,2.2]);c.lineWidth=.9;c.strokeStyle="#a49cbd";c.strokeText(this.ch,50,this.y);c.setLineDash([]);
    c.save();c.beginPath();c.rect(0,0,100,100);c.clip();c.lineCap="round";c.lineJoin="round";c.strokeStyle=col;c.lineWidth=11;
    for(const s of this.strokes){c.beginPath();c.moveTo(s[0][0],s[0][1]);if(s.length===1)c.lineTo(s[0][0]+.01,s[0][1]);for(let i=1;i<s.length;i++)c.lineTo(s[i][0],s[i][1]);c.stroke()}c.restore();
    if(this.n<4){const ph=((t||0)*1.3)%1;c.globalAlpha=1-ph;circ(c,this.start[0],this.start[1],2+ph*7,null,"#ff6b5a",1.6);c.globalAlpha=1;circ(c,this.start[0],this.start[1],2.4,"#ff6b5a","#fff",1)}}
  c.restore()};

/* Tamil number words */
K.TA_NUM=[null,["ஒன்று","ondru"],["இரண்டு","irandu"],["மூன்று","moondru"],["நான்கு","naangu"],["ஐந்து","ainthu"],["ஆறு","aaru"],["ஏழு","ezhu"],["எட்டு","ettu"],["ஒன்பது","onbathu"],["பத்து","pathu"]];
K.EN_NUM=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
K.sayNumber=n=>K.speak([{t:K.EN_NUM[n]},{t:K.TA_NUM[n][0],ta:K.TA_NUM[n][1]}]);

K.sw=function(){if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("../sw.js",{scope:"../"}).catch(()=>{}))};
window.Kit=K;
})();
