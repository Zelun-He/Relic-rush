import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {Rooms,GameError} from './rooms.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const publicFiles=new Set(['index.html','src/main.js','src/multiplayer.js','src/engine.js','src/style.css']);
export function createGameServer({rooms=new Rooms()}={}){
  const limits=new Map();
  const server=createServer(async(req,res)=>{
    const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
    try{
      const url=new URL(req.url,'http://localhost');
      if(url.pathname.startsWith('/api/')){
        if(!['GET','POST'].includes(req.method))throw new GameError('Method not allowed.',405);
        if(req.method==='POST'&&req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)throw new GameError('Cross-origin request denied.',403);
        let body={};if(req.method==='POST'){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4096)throw new GameError('Request too large.',413);}try{body=JSON.parse(raw||'{}');}catch{throw new GameError('Invalid JSON.');}if(!body||typeof body!=='object'||Array.isArray(body))throw new GameError('Invalid request.');}
        if(url.pathname==='/api/rooms'&&req.method==='POST'){
          const key=req.socket.remoteAddress,now=Date.now(),bucket=limits.get(key);if(bucket&&now-bucket.start<60000&&bucket.count>=20)throw new GameError('Too many new rooms. Try again in a minute.',429);limits.set(key,bucket&&now-bucket.start<60000?{start:bucket.start,count:bucket.count+1}:{start:now,count:1});return json(201,rooms.create(body.name));
        }
        const match=url.pathname.match(/^\/api\/rooms\/([A-Z0-9]{6})(?:\/(join|start|answer|leave))?$/i);if(!match)throw new GameError('Endpoint not found.',404);
        const [,code,action]=match,token=(req.headers.authorization||'').replace(/^Bearer /,'');
        if(action==='join'&&req.method==='POST')return json(200,rooms.join(code,body.name));
        if(!action&&req.method==='GET')return json(200,rooms.state(code,token));
        if(action&&req.method==='POST')return json(200,rooms.action(code,token,action,body));
        throw new GameError('Method not allowed.',405);
      }
      if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
      const path=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!publicFiles.has(path)){res.writeHead(404);return res.end('Not found');}
      const bytes=await readFile(resolve(root,path));res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[extname(path)],'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);
    }catch(error){json(error.status||500,{error:error.status?error.message:'Server error. Please try again.'});}
  });
  const cleanup=setInterval(()=>{rooms.sweep();for(const [key,value]of limits)if(Date.now()-value.start>60000)limits.delete(key);},5000);cleanup.unref();server.on('close',()=>clearInterval(cleanup));return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||5173);createGameServer().listen(port,process.env.HOST||'0.0.0.0',()=>console.log(`Relic Rush multiplayer listening on port ${port}`));}
