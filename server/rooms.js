import {randomBytes,randomUUID} from 'node:crypto';
import {dailyQuestions,judge} from '../src/engine.js';

export class GameError extends Error { constructor(message,status=400){super(message);this.status=status;} }
export class Rooms {
  constructor({now=()=>Date.now(),roundMs=25000,revealMs=7000,idleMs=60000}={}){
    this.rooms=new Map();this.now=now;this.roundMs=roundMs;this.revealMs=revealMs;this.idleMs=idleMs;
  }
  name(value){if(typeof value!=='string'||!value.trim()||value.trim().length>20)throw new GameError('Use a name between 1 and 20 characters.');return value.trim();}
  player(name){return {id:randomUUID(),token:randomBytes(24).toString('hex'),name:this.name(name),score:0,lastSeen:this.now(),active:true};}
  create(name){if(this.rooms.size>=1000)throw new GameError('Server is busy. Try again shortly.',503);let code;do{code=Array.from(randomBytes(6),n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('');}while(this.rooms.has(code));const player=this.player(name),room={code,hostId:player.id,players:[player],phase:'lobby',round:0,match:0,submissions:new Map(),history:[],lastTouched:this.now()};this.rooms.set(code,room);return this.credentials(room,player);}
  get(code){const room=this.rooms.get(String(code).toUpperCase());if(!room)throw new GameError('Room not found or expired.',404);return room;}
  join(code,name){const room=this.get(code);this.advance(room);if(room.phase!=='lobby')throw new GameError('This match has started. Join a new room.');if(room.players.filter(p=>p.active).length>=4)throw new GameError('Room is full (4 players).',409);const player=this.player(name);if(room.players.some(p=>p.active&&p.name.toLowerCase()===player.name.toLowerCase()))throw new GameError('That name is already in this room.');room.players=room.players.filter(p=>p.active);room.players.push(player);room.lastTouched=this.now();return this.credentials(room,player);}
  credentials(room,player){return {code:room.code,playerId:player.id,token:player.token,state:this.view(room,player)};}
  authenticate(room,token){const player=room.players.find(p=>p.token===token&&p.active);if(!player)throw new GameError('Your room session has ended. Rejoin from the main menu.',401);player.lastSeen=this.now();room.lastTouched=this.now();return player;}
  state(code,token){const room=this.get(code),player=this.authenticate(room,token);this.advance(room);return this.view(room,player);}
  action(code,token,action,payload={}){const room=this.get(code),player=this.authenticate(room,token);this.advance(room);
    if(action==='start'){
      if(room.hostId!==player.id)throw new GameError('Only the host can start the match.',403);
      if(!['lobby','finished'].includes(room.phase))throw new GameError('A match is already in progress.',409);
      room.players=room.players.filter(p=>p.active);if(room.players.length<2)throw new GameError('At least 2 players are needed.');
      room.match++;room.questions=dailyQuestions(`${room.code}:${room.match}:${this.now()}`);room.round=0;room.history=[];for(const p of room.players)p.score=0;this.beginRound(room);
    }else if(action==='answer'){
      if(room.phase!=='answer'||payload.round!==room.round||payload.match!==room.match)throw new GameError('That round has ended.',409);
      if(room.submissions.has(player.id))throw new GameError('Your answer is already locked.',409);
      if(typeof payload.answer!=='string'||payload.answer.length>80)throw new GameError('Answer must be at most 80 characters.');
      room.submissions.set(player.id,payload.answer.trim());this.advance(room);
    }else if(action==='leave'){
      player.active=false;this.advance(room);
    }else throw new GameError('Unknown room action.',404);
    return this.view(room,player);
  }
  beginRound(room){room.phase='answer';room.deadline=this.now()+this.roundMs;room.submissions=new Map();room.reveal=null;}
  resolve(room){const q=room.questions[room.round];const entries=room.players.map(p=>({playerId:p.id,name:p.name,submitted:room.submissions.get(p.id)||'',...judge(q,room.submissions.get(p.id)||'')}));
    for(const entry of entries){entry.sharedWith=entry.valid?entries.filter(e=>e.valid&&e.answer===entry.answer).length:0;entry.earned=entry.valid?Math.floor(entry.points/entry.sharedWith):0;const p=room.players.find(p=>p.id===entry.playerId);p.score+=entry.earned;entry.total=p.score;}
    room.reveal={prompt:q.prompt,entries};room.history.push(room.reveal);room.phase='reveal';room.deadline=this.now()+this.revealMs;
  }
  advance(room){const now=this.now();for(const p of room.players)if(p.active&&now-p.lastSeen>this.idleMs)p.active=false;
    if(!room.players.some(p=>p.active&&p.id===room.hostId))room.hostId=room.players.find(p=>p.active)?.id||null;
    if(room.phase==='answer'&&(now>=room.deadline||room.players.filter(p=>p.active).every(p=>room.submissions.has(p.id))))this.resolve(room);
    else if(room.phase==='reveal'&&now>=room.deadline){if(room.round===4){room.phase='finished';room.deadline=null;}else{room.round++;this.beginRound(room);}}
  }
  view(room,player){const players=room.players.map(p=>({id:p.id,name:p.name,score:p.score,active:p.active,submitted:room.submissions.has(p.id)}));const max=Math.max(...players.map(p=>p.score));return {code:room.code,you:player.id,hostId:room.hostId,phase:room.phase,round:room.round,match:room.match,serverNow:this.now(),deadline:room.deadline||null,question:room.phase==='answer'?{prompt:room.questions[room.round].prompt}:null,players,submitted:room.submissions.has(player.id),reveal:['reveal','finished'].includes(room.phase)?room.reveal:null,history:room.phase==='finished'?room.history:[],winners:room.phase==='finished'?players.filter(p=>p.score===max).map(p=>p.id):[]};}
  sweep(){for(const [code,room]of this.rooms){this.advance(room);if(this.now()-room.lastTouched>2*60*60*1000)this.rooms.delete(code);}}
}
