(() => {
"use strict";
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const $ = id => document.getElementById(id);
let W=innerWidth,H=innerHeight, running=false, paused=false, ended=false, noteOpen=false;
const FOV=Math.PI/3, MAX_DEPTH=18;
const map=[
"################",
"#..............#",
"#.####.#######.#",
"#.#....#.....#.#",
"#.#.##.#.###.#.#",
"#...##...#...#.#",
"###.####.#.###.#",
"#...#....#.....#",
"#.###.####.###.#",
"#.....#....#...#",
"#.###.#.##.#.#.#",
"#...#...##...#.#",
"###.###.####.#.#",
"#..............#",
"################"
];
const player={x:1.7,y:1.55,a:0,move:0};
const monster={x:13.2,y:1.5,active:false,stun:0,attack:0};
const fuses=[{x:6.5,y:1.55,taken:false},{x:3.45,y:5.5,taken:false},{x:10.5,y:9.5,taken:false}];
const note={x:11.5,y:7.5,taken:false};
const keycard={x:14.5,y:11.5,taken:false};
const exit={x:14.2,y:13.45};
const state={battery:100,sanity:100,fuses:0,key:false,hasNote:false,flash:true,time:0,steps:0,damage:0,ending:""};
const keys={};
let zBuffer=[], last=performance.now(), msgTimer=0, toastTimer=0, audioCtx=null, hum=null;
function resize(){W=canvas.width=Math.floor(innerWidth*devicePixelRatio);H=canvas.height=Math.floor(innerHeight*devicePixelRatio);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(1,0,0,1,0,0)}
addEventListener("resize",resize);resize();
function wall(x,y){let mx=Math.floor(x),my=Math.floor(y);return !map[my]||map[my][mx]==="#"}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function normalize(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
function say(t,d=2400){$("message").textContent=t;$("message").classList.add("show");msgTimer=d}
function toast(t,d=2200){$("toast").textContent=t;$("toast").classList.add("show");toastTimer=d}
function startAudio(){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();hum=audioCtx.createOscillator();let gain=audioCtx.createGain();hum.type="sawtooth";hum.frequency.value=48;gain.gain.value=.018;hum.connect(gain);gain.connect(audioCtx.destination);hum.start()}catch(e){}}
function tone(freq=110,dur=.12,type="sawtooth",vol=.04){if(!audioCtx)return;let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}
function lock(){canvas.requestPointerLock?.()}
function start(){ $("startScreen").classList.remove("visible");running=true;paused=false;startAudio();lock();say("Смена началась. Найдите три предохранителя.");last=performance.now();requestAnimationFrame(loop)}
$("startBtn").addEventListener("click",start);
$("restartBtn").addEventListener("click",()=>location.reload());
$("closeNote").addEventListener("click",closeNote);
document.addEventListener("pointerlockchange",()=>{if(!running||ended)return;paused=document.pointerLockElement!==canvas;$("pauseLabel").classList.toggle("show",paused)});
document.addEventListener("mousemove",e=>{if(running&&!paused&&!noteOpen&&document.pointerLockElement===canvas)player.a=normalize(player.a+e.movementX*.0024)});
document.addEventListener("keydown",e=>{keys[e.code]=true;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();if(e.code==="Escape"&&running&&!ended){if(document.pointerLockElement===canvas)document.exitPointerLock();else if(!noteOpen)lock()}if(e.code==="KeyE")interact();if(e.code==="KeyF")toggleFlash();if(e.code==="KeyM")toast("Карта больницы повреждена. Ищите путь по указателям.");});
document.addEventListener("keyup",e=>keys[e.code]=false);
canvas.addEventListener("click",()=>{if(running&&!paused&&!ended&&!noteOpen)lock()});
function toggleFlash(){if(!running||ended||noteOpen)return;if(state.battery<=0){toast("Батарея разряжена.");return}state.flash=!state.flash;tone(state.flash?500:180,.06,"sine",.025);toast(state.flash?"ФОНАРИК ВКЛЮЧЁН":"ФОНАРИК ВЫКЛЮЧЕН")}
function movePlayer(dt){let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0);if(keys.ArrowLeft)player.a-=dt*1.8;if(keys.ArrowRight)player.a+=dt*1.8;if(!f&&!s){player.move*=.85;return}
let speed=(keys.ShiftLeft||keys.ShiftRight)?3.05:2.05;let len=Math.hypot(f,s)||1;f/=len;s/=len;let dx=(Math.cos(player.a)*f-Math.sin(player.a)*s)*speed*dt,dy=(Math.sin(player.a)*f+Math.cos(player.a)*s)*speed*dt;
if(!wall(player.x+dx,player.y))player.x+=dx;if(!wall(player.x,player.y+dy))player.y+=dy;player.move+=dt*speed;state.steps+=Math.abs(dx)+Math.abs(dy);if((keys.ShiftLeft||keys.ShiftRight)&&Math.random()<.03)tone(70,.04,"triangle",.015)}
function castRay(angle){let sin=Math.sin(angle),cos=Math.cos(angle),d=0,hitSide=0;while(d<MAX_DEPTH){d+=.025;let x=player.x+cos*d,y=player.y+sin*d;if(wall(x,y)){hitSide=Math.floor(x)!==Math.floor(x-cos*.025)?1:0;break}}return {d,side:hitSide,x:player.x+cos*d,y:player.y+sin*d}}
function renderWorld(){let horizon=H*.5+Math.sin(player.move*2)*Math.min(2,player.move*.15)*devicePixelRatio;
let ceiling=ctx.createLinearGradient(0,0,0,horizon);ceiling.addColorStop(0,"#080b0e");ceiling.addColorStop(1,"#242321");ctx.fillStyle=ceiling;ctx.fillRect(0,0,W,horizon);
let floor=ctx.createLinearGradient(0,horizon,0,H);floor.addColorStop(0,"#302c27");floor.addColorStop(1,"#08090a");ctx.fillStyle=floor;ctx.fillRect(0,horizon,W,H-horizon);
let rays=Math.ceil(W/2);zBuffer=new Array(rays);
for(let i=0;i<rays;i++){let camera=(i/rays-.5)*FOV,angle=player.a+camera,r=castRay(angle),corrected=r.d*Math.cos(camera);zBuffer[i]=corrected;let wallH=Math.min(H*2,H/(corrected+.001));let top=horizon-wallH/2;let shade=Math.max(0,1-corrected/11);let side=r.side?.72:1;let flicker=state.flash?(Math.random()>.998?.35:1):.52;let light=shade*side*flicker;let base=state.flash? [91,86,75]:[40,42,42];let fog=Math.min(1,corrected/13);let rr=base[0]*light*(1-fog)+7*fog,gg=base[1]*light*(1-fog)+8*fog,bb=base[2]*light*(1-fog)+9*fog;
ctx.fillStyle=`rgb(${rr|0},${gg|0},${bb|0})`;let x=i*W/rays;ctx.fillRect(x,top,W/rays+1,wallH);
if(Math.floor(r.x*2)%2===0&&corrected<7){ctx.fillStyle=`rgba(10,10,10,${.08*(1-fog)})`;ctx.fillRect(x,top,W/rays+1,wallH)}
}
drawSprites(horizon,rays);
if(state.flash){let g=ctx.createRadialGradient(W/2,horizon,W*.025,W/2,horizon,W*.46);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(.45,"rgba(0,0,0,.05)");g.addColorStop(1,"rgba(0,0,0,.78)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
else{ctx.fillStyle="rgba(0,0,0,.58)";ctx.fillRect(0,0,W,H)}
}
function drawSprites(horizon,rays){let sprites=[];fuses.forEach((o,i)=>{if(!o.taken)sprites.push({...o,type:"fuse",idx:i})});if(!note.taken)sprites.push({...note,type:"note"});if(!keycard.taken)sprites.push({...keycard,type:"key"});if(monster.active)sprites.push({...monster,type:"monster"});
sprites.sort((a,b)=>dist(b,player)-dist(a,player));
for(let sp of sprites){let dx=sp.x-player.x,dy=sp.y-player.y,d=Math.hypot(dx,dy),ang=normalize(Math.atan2(dy,dx)-player.a);if(Math.abs(ang)>FOV*.7||d<.15)continue;let screenX=(.5+ang/FOV)*W,idx=Math.max(0,Math.min(rays-1,Math.floor(screenX/W*rays)));if(d>zBuffer[idx]+.2)continue;let size=Math.min(H*1.1,H/(d+.2)*.55),x=screenX-size*.5,y=horizon-size*.52;let glow=state.flash?Math.max(.15,1-d/9):.15;
ctx.save();ctx.globalAlpha=glow;
if(sp.type==="monster"){ctx.shadowColor="#9b0c17";ctx.shadowBlur=30*devicePixelRatio;ctx.fillStyle="#08090a";ctx.beginPath();ctx.ellipse(screenX,y+size*.55,size*.23,size*.48,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#b9252d";ctx.fillRect(screenX-size*.12,y+size*.25,size*.07,size*.025);ctx.fillRect(screenX+size*.05,y+size*.25,size*.07,size*.025);ctx.fillStyle="#1a090b";ctx.beginPath();ctx.moveTo(screenX-size*.16,y+size*.94);ctx.lineTo(screenX-size*.27,y+size*1.5);ctx.lineTo(screenX+size*.25,y+size*1.5);ctx.lineTo(screenX+size*.16,y+size*.94);ctx.fill();}
else if(sp.type==="fuse"){ctx.shadowColor="#f0b45b";ctx.shadowBlur=18*devicePixelRatio;ctx.fillStyle="#d4a65e";ctx.fillRect(screenX-size*.12,y+size*.35,size*.24,size*.42);ctx.fillStyle="#453a28";ctx.fillRect(screenX-size*.08,y+size*.3,size*.16,size*.08)}
else if(sp.type==="key"){ctx.shadowColor="#d4c28a";ctx.shadowBlur=15;ctx.fillStyle="#c9b77b";ctx.fillRect(screenX-size*.22,y+size*.4,size*.44,size*.22);ctx.fillStyle="#514a39";ctx.fillRect(screenX-size*.1,y+size*.45,size*.2,size*.1)}
else{ctx.shadowColor="#ddd";ctx.shadowBlur=10;ctx.fillStyle="#d4cbb7";ctx.fillRect(screenX-size*.24,y+size*.3,size*.48,size*.4);ctx.strokeStyle="#716b60";ctx.strokeRect(screenX-size*.24,y+size*.3,size*.48,size*.4)}
ctx.restore()}
}
function interactable(){let all=[];fuses.forEach((o,i)=>{if(!o.taken)all.push({...o,type:"fuse",idx:i})});if(!note.taken)all.push({...note,type:"note"});if(!keycard.taken)all.push({...keycard,type:"key"});all.push({...exit,type:"exit"});let best=null,bd=1.45;for(let o of all){let d=dist(o,player);let a=Math.abs(normalize(Math.atan2(o.y-player.y,o.x-player.x)-player.a));if(d<bd&&a<.8){best=o;bd=d}}return best}
function interact(){if(!running||paused||ended)return;if(noteOpen){closeNote();return}let o=interactable();if(!o){toast("Здесь нечего использовать.");return}
if(o.type==="fuse"){o.taken=true;state.fuses++;tone(720,.12,"sine");say("Предохранитель найден. "+state.fuses+" / 3");updateHUD();if(state.fuses===3){monster.active=true;say("Где-то в здании раздался тяжёлый удар...",3200);tone(55,.7,"sawtooth",.07)}}
if(o.type==="note"){note.taken=true;state.hasNote=true;showNote("Записка санитара","«Они отключили питание в 03:13. Код от щитка — день открытия больницы.\\n\\nЕсли существо услышит шаги, оно придёт. Не беги без необходимости.\\n\\nКлюч-карту я спрятал возле поста медсестры. Палата №13 находится за северным крылом.»");}
if(o.type==="key"){keycard.taken=true;state.key=true;tone(850,.12,"sine");say("Ключ-карта получена.");updateHUD()}
if(o.type==="exit"){if(state.fuses<3){toast("Дверь заперта. Сначала восстановите питание.");return}if(!state.key){toast("Нужна ключ-карта.");return}finish(true)}
}
function showNote(title,body){noteOpen=true;document.exitPointerLock?.();$("noteTitle").textContent=title;$("noteBody").textContent=body;$("noteScreen").classList.add("visible")}
function closeNote(){noteOpen=false;$("noteScreen").classList.remove("visible");if(running&&!ended)lock()}
function updateHUD(){$("battery").textContent=Math.ceil(state.battery)+"%";$("sanity").textContent=Math.ceil(state.sanity)+"%";$("fuseCount").textContent=state.fuses+"/3";$("keyState").textContent=state.key?"ЕСТЬ":"НЕТ";$("noteState").textContent=state.hasNote?"ЕСТЬ":"НЕТ";$("objectiveText").textContent=state.fuses<3?"Найти три предохранителя: "+state.fuses+" / 3":!state.key?"Найти ключ-карту у поста медсестры":"Добраться до выхода";$("objectiveProgress").style.width=(state.fuses/3*100)+"%";$("slotFuse").style.opacity=state.fuses?".95":".5";$("slotKey").style.opacity=state.key?".95":".5";$("slotNote").style.opacity=state.hasNote?".95":".5"}
function monsterAI(dt){if(!monster.active)return;let d=dist(monster,player);if(monster.stun>0){monster.stun-=dt;return}if(d<9){let dx=player.x-monster.x,dy=player.y-monster.y,len=Math.hypot(dx,dy)||1;let speed=d<2.5?1.15:.72;let nx=monster.x+dx/len*speed*dt,ny=monster.y+dy/len*speed*dt;if(!wall(nx,monster.y))monster.x=nx;if(!wall(monster.x,ny))monster.y=ny;if(d<6)state.sanity-=dt*(d<3?7:2.2);if(d<.72&&monster.attack<=0){monster.attack=2;state.sanity-=18;state.battery=Math.max(0,state.battery-12);$("damage").classList.remove("hit");void $("damage").offsetWidth;$("damage").classList.add("hit");tone(42,.5,"sawtooth",.12);say("ОНА КАСАЕТСЯ ТЕБЯ. БЕГИ!",1800);monster.stun=.8}}
else{monster.x+=(13.2-monster.x)*dt*.15;monster.y+=(1.5-monster.y)*dt*.15}monster.attack=Math.max(0,monster.attack-dt)}
function update(dt){if(!running||paused||ended||noteOpen)return;state.time+=dt;let runningFast=keys.ShiftLeft||keys.ShiftRight;movePlayer(dt);if(state.flash){state.battery=Math.max(0,state.battery-dt*(runningFast?.8:.34));if(state.battery<=0){state.flash=false;say("Фонарик разрядился.",2200);tone(100,.4)}}else if(!runningFast)state.battery=Math.min(100,state.battery+dt*.12);
monsterAI(dt);state.sanity=Math.max(0,state.sanity-dt*(state.flash?0:.35));if(state.sanity<=0){finish(false,"Рассудок не выдержал. Больница оставила тебя себе.");return}
let mins=Math.floor(state.time/60),secs=Math.floor(state.time%60);$("clock").textContent="02:"+String((47+mins)%60).padStart(2,"0");updateHUD();
if(msgTimer>0){msgTimer-=dt*1000;if(msgTimer<=0)$("message").classList.remove("show")}if(toastTimer>0){toastTimer-=dt*1000;if(toastTimer<=0)$("toast").classList.remove("show")}
if(monster.active&&dist(monster,player)<1.15&&state.sanity<20){finish(false,"Ты споткнулся в темноте. Последнее, что ты услышал, — собственное дыхание.");}
}
function finish(win,custom){ended=true;running=false;document.exitPointerLock?.();$("endScreen").classList.add("visible");$("endOverline").textContent=win?"СМЕНА ОКОНЧЕНА":"СВЯЗЬ ПОТЕРЯНА";$("endTitle").textContent=win?"ТЫ ВЫБРАЛСЯ":"ТЫ НЕ ВЫБРАЛСЯ";$("endText").textContent=custom||(state.hasNote?"Ты вышел из больницы на рассвете. В кармане лежала записка, которой раньше не было: «Следующая смена — твоя».":"Ты покинул корпус, но так и не узнал, что произошло в палате №13.");$("endStats").innerHTML=`<div>ПРЕДМЕТЫ<b>${state.fuses+Number(state.key)}/4</b></div><div>РАССУДОК<b>${Math.ceil(state.sanity)}%</b></div><div>ВРЕМЯ<b>${Math.floor(state.time)}с</b></div>`;tone(win?330:45,.7,"sawtooth",.08)}
function loop(now){if(!running)return;let dt=Math.min(.05,(now-last)/1000);last=now;update(dt);if(!ended){renderWorld();requestAnimationFrame(loop)}}
updateHUD();
})();