// Original low-resolution dungeon art. Each floor has its own entrance and ambient motion.
export const FLOORS = [
  {name:'MOSSBOUND CELLAR',depth:'B1 · 12 METERS',entry:'stairs',floor:'#456d4d',brick:'#6f8060',dark:'#233d35',light:'#b5bc82'},
  {name:'DROWNED ARCHIVES',depth:'B2 · 35 METERS',entry:'sink',floor:'#3d6d79',brick:'#668b90',dark:'#203f53',light:'#b2d9ce'},
  {name:'CRYSTAL HOLLOW',depth:'B3 · 80 METERS',entry:'iris',floor:'#514862',brick:'#79718b',dark:'#2b263d',light:'#d9bbee'},
  {name:'EMBER FORGE',depth:'B4 · 150 METERS',entry:'bridge',floor:'#624d45',brick:'#927060',dark:'#342b30',light:'#e6b482'},
  {name:'THE EMERALD VAULT',depth:'B5 · 300 METERS',entry:'doors',floor:'#284f49',brick:'#4e7c67',dark:'#102d30',light:'#a8d7a2'}
];
const DURATION=1800;
export function createDungeon(ctx,{explorer,chest,reducedMotion=false}={}){
  let active=null,key=null,started=0;
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
  const poly=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
  const glow=(x,y,color)=>{rect(x-7,y-7,16,16,color);rect(x-4,y-4,10,10,'#d8edb6');rect(x-1,y-1,4,4,'#ffefb9');};
  const flame=(x,y,t)=>{const jump=reducedMotion?0:Math.floor(t/150)%3;rect(x,y,4,10,'#473a34');rect(x-2,y-7-jump,8,8+jump,'#d87841');rect(x,y-8-jump,4,8+jump,'#f1c267');rect(x+1,y-4,2,4,'#fff0ad');};
  function stone(f){rect(0,0,320,192,f.dark);rect(15,15,290,162,f.floor);for(let y=17;y<177;y+=16)for(let x=17;x<304;x+=16){rect(x,y,14,14,f.brick);rect(x+1,y+1,12,2,f.floor);rect(x+12,y+4,1,9,f.dark);}rect(0,0,320,19,f.dark);for(let y=0;y<31;y+=8)for(let x=(y%16?8:0);x<320;x+=16){rect(x,y,15,7,f.brick);rect(x+1,y+1,12,1,f.light);}rect(0,27,14,165,f.dark);rect(306,27,14,165,f.dark);rect(14,174,292,18,f.dark);for(const x of [27,282]){rect(x,40,11,111,f.dark);rect(x+2,43,7,103,f.light);rect(x-2,37,15,5,f.brick);rect(x-2,149,15,5,f.brick);}rect(137,148,46,25,f.dark);for(let i=0;i<5;i++)rect(140-i*2,150+i*4,40+i*4,2,f.light);}
  function scene(index,t){const f=FLOORS[index];stone(f);const drift=reducedMotion?0:t;
    if(index===0){
      // Moss creeps over the stairs. Dust floats through shafts of daylight.
      for(const [x,y]of [[18,34],[277,29],[61,83],[212,140],[45,150]]){rect(x,y,23,5,'#6b945b');rect(x+4,y+4,11,5,'#47794b');rect(x+15,y+3,4,10,'#8ba964');}
      for(const x of [66,245]){rect(x,49,13,21,'#243e35');rect(x+2,50,9,17,'#bdd2a2');rect(x+6,49,2,20,'#526b48');poly([[x+2,69],[x+11,69],[x+43,150],[x-21,150]],'#a8be8030');}
      for(let i=0;i<12;i++){const y=40+(i*13+drift/60)%103;rect(57+(i*19)%210,y,1,1,'#c7d09b');}
      rect(112,44,95,6,'#293e32');rect(119,50,80,8,'#8b9b6d');for(let i=0;i<4;i++){rect(101+i*6,59+i*8,115-i*12,7,'#b2bb89');rect(105+i*6,60+i*8,108-i*12,2,'#d2cfa0');}flame(52,114,drift);flame(263,114,drift+100);
    }else if(index===1){
      // A flooded archive: shelves above the water and rippling reflections below.
      rect(15,91,291,82,'#275869');for(let y=95;y<173;y+=8)for(let x=20;x<299;x+=24)rect(x+Math.floor(drift/180)%5,y,11,1,'#74aba9');
      for(const x of [51,211]){rect(x,41,59,41,'#374944');for(let y=43;y<78;y+=13){rect(x,y,59,3,'#ba9d6a');for(let k=0;k<9;k++)rect(x+3+k*6,y+3,4,9,['#9a7972','#7ea092','#c1ae7c'][k%3]);}}
      rect(123,83,75,82,'#8ba79b');for(let y=89;y<160;y+=10)rect(127,y,67,2,'#bccaba');for(let i=0;i<10;i++){const x=39+(i*29)%240,y=170-(i*17+drift/35)%95;rect(x,y,3,4,'#86c7c1');rect(x+1,y+1,2,2,'#326c7c');}glow(156,59,'#6aafa2');
    }else if(index===2){
      // Purple crystal formations sparkle at different phases.
      for(const [x,y,size]of [[51,75,17],[77,138,11],[237,72,23],[261,134,14],[139,54,10]]){poly([[x,y-size],[x+size/2,y-4],[x+size/3,y+size],[x-size/2,y+size/2]],'#ac85cd');poly([[x,y-size],[x,y+size],[x-size/2,y+size/2]],'#705b9d');rect(x-1,y-size+4,2,size,'#e1cef3');const pulse=Math.floor(drift/300+x)%4;if(pulse===0){rect(x+size,y-5,1,5,'#eee7fd');rect(x+size-2,y-3,5,1,'#eee7fd');}}
      for(let i=0;i<9;i++){const x=95+(i*21)%134,y=70+(i*13)%65;rect(x,y,2,2,i%2?'#9c8aba':'#736580');}rect(119,95,83,28,'#514261');rect(126,100,68,2,'#a688c1');
    }else if(index===3){
      // A stone bridge across flowing lava, drifting embers and working furnaces.
      rect(15,72,290,78,'#9f4733');for(let y=78;y<148;y+=9)for(let x=18;x<300;x+=23){rect(x+Math.floor(drift/110)%7,y,14,3,'#e3813e');rect(x+3,y+1,7,1,'#ffd078');}rect(128,61,65,101,'#3e3536');for(let y=64;y<160;y+=11){rect(133,y,55,9,'#a98b68');rect(136,y+1,49,2,'#cfb083');}
      for(const x of [56,234]){rect(x,34,28,35,'#413334');rect(x+5,40,18,22,'#b14e32');flame(x+12,53,drift);rect(x-3,64,34,5,'#a48465');}
      for(let i=0;i<14;i++){const y=153-(i*17+drift/30)%114;rect(28+(i*23)%264,y,1,2,i%2?'#e89149':'#ffd58d');}
    }else{
      // Deepest chamber: golden inlays, emerald altar and sweeping spectral light.
      for(let y=41;y<163;y+=24){rect(65,y,191,1,'#b6a773');rect(65,y,1,23,'#b6a773');rect(255,y,1,23,'#b6a773');}rect(122,57,78,59,'#203e39');rect(127,61,68,50,'#668e67');rect(136,103,49,7,'#c8b779');rect(145,73,30,30,'#d4c18b');poly([[160,46],[176,64],[160,86],[145,64]],'#62c794');poly([[160,46],[160,86],[145,64]],'#348d71');poly([[160,48],[169,62],[160,65]],'#b4e6b9');
      for(let i=0;i<18;i++){const angle=i*.8+drift/1800,x=160+Math.cos(angle)*(28+i*3),y=82+Math.sin(angle)*(18+i*2);rect(x,y,2,2,i%3?'#7fc1a0':'#efe6ac');}for(const x of [63,251]){flame(x,65,drift);rect(x-1,54,6,5,'#79cead');}poly([[155,25],[165,25],[204,123],[119,123]],'#b3edb317');
    }
    chest?.(154,119,false);
  }
  function entry(index,t,p){const f=FLOORS[index],eased=1-Math.pow(1-p,3);
    if(f.entry==='stairs'){ctx.save();ctx.translate(0,Math.round((1-eased)*-78));scene(index,t);explorer?.(153,57+eased*83,Math.floor(t/100));ctx.restore();for(let i=0;i<8;i++)rect(0,i*24+p*20,15,2,'#b4bd8d');}
    else if(f.entry==='sink'){scene(index,t);const y=35+eased*105;rect(130,y+21,60,5,'#acc6bb');rect(131,0,2,y+20,'#587c78');rect(188,0,2,y+20,'#587c78');explorer?.(153,y,Math.floor(t/130));for(let i=0;i<7;i++)rect(116+(i*17)%83,180-(p*150+i*21)%155,3,4,'#c6e9d1');}
    else if(f.entry==='iris'){scene(index,t);explorer?.(153,140,0);const cover=180*(1-eased);poly([[0,0],[160,0],[160-cover,96],[0,192]],f.dark);poly([[320,0],[160,0],[160+cover,96],[320,192]],f.dark);poly([[0,0],[320,0],[160,96-cover]],f.dark);poly([[0,192],[320,192],[160,96+cover]],f.dark);}
    else if(f.entry==='bridge'){ctx.save();ctx.translate(Math.round(Math.sin(p*45)*(1-p)*2),0);scene(index,t);explorer?.(153,32+eased*108,Math.floor(t/100));ctx.restore();rect(0,0,320,Math.round((1-eased)*18),f.dark);}
    else{scene(index,t);explorer?.(153,140,0);const w=Math.round(160*(1-eased));for(const x of [0,320-w]){rect(x,0,w,192,'#1f4940');rect(x+4,4,Math.max(0,w-8),184,'#47745b');rect(x+9,12,Math.max(0,w-18),168,'#294f44');if(w>25){rect(x+w/2,40,3,111,'#cdb879');rect(x+15,90,Math.max(0,w-30),3,'#cdb879');}}}
    ctx.fillStyle=f.light;ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText(`DESCENDING · ${f.depth}`,160,184);ctx.textAlign='start';
  }
  return {
    enter(round,nextKey,time=0){if(nextKey===key)return false;active=Math.max(0,Math.min(4,round));key=nextKey;started=time;return true;},
    reset(){active=null;key=null;},
    get floor(){return active===null?null:FLOORS[active];},
    draw(time){if(active===null)return false;const elapsed=Math.max(0,time-started),t=reducedMotion?0:time,p=reducedMotion?1:Math.min(1,elapsed/DURATION);if(p<1)entry(active,t,p);else{scene(active,t);explorer?.(153,140,Math.floor(t/500));}return true;}
  };
}
