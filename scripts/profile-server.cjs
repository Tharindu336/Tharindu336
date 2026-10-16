const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const dateKey=time=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Colombo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(time));
class ViewStore {
  constructor(file,now=()=>Date.now()){
    this.file=file;this.now=now;this.data={total:0,days:{},recent:{},startedAt:new Date(now()).toISOString(),updatedAt:null};
    if(file&&fs.existsSync(file)){const saved=JSON.parse(fs.readFileSync(file,'utf8'));if(!Number.isSafeInteger(saved.total)||saved.total<0||!saved.days||!saved.recent)throw Error('Invalid visitor store; refusing to overwrite existing counts.');this.data=saved;}
  }
  record(id){
    if(!/^[a-zA-Z0-9-]{16,80}$/.test(id))throw Error('Invalid page-view ID.');
    const now=this.now();if(this.data.recent[id]&&now-this.data.recent[id]<86400000)return false;
    const day=dateKey(now),next={...this.data,total:this.data.total+1,updatedAt:new Date(now).toISOString(),days:{...this.data.days,[day]:(this.data.days[day]||0)+1},recent:Object.fromEntries(Object.entries(this.data.recent).filter(([,time])=>now-time<86400000))};next.recent[id]=now;
    if(this.file){fs.mkdirSync(path.dirname(this.file),{recursive:true});const temp=this.file+'.tmp';fs.writeFileSync(temp,JSON.stringify(next));fs.renameSync(temp,this.file);}this.data=next;return true;
  }
  snapshot(connected=0){const now=this.now(),days=Array.from({length:30},(_,i)=>{const date=dateKey(now-(29-i)*86400000);return {date,count:this.data.days[date]||0};});return {total:this.data.total,today:this.data.days[dateKey(now)]||0,connected,days,startedAt:this.data.startedAt,updatedAt:this.data.updatedAt};}
}
function createProfileServer({root=path.resolve(__dirname,'..'),storeFile=path.join(root,'.runtime/profile-views.json'),now}={}){
  const store=new ViewStore(storeFile,now),streams=new Set();
  const broadcast=()=>{const event='event: views\ndata: '+JSON.stringify(store.snapshot(streams.size))+'\n\n';for(const res of streams)res.write(event);};
  const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  const server=http.createServer(async(req,res)=>{
    let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
    if(pathname.startsWith('/api/')){
      if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host){json(res,403,{error:'Same-origin requests only.'});return;}}catch{json(res,403,{error:'Invalid origin.'});return;}}
      if(req.method==='GET'&&pathname==='/api/views'){json(res,200,store.snapshot(streams.size));return;}
      if(req.method==='GET'&&pathname==='/api/views/stream'){
        if(streams.size>=500){json(res,503,{error:'Live connection limit reached.'});return;}
        res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 3000\n\n');streams.add(res);broadcast();res.on('close',()=>{streams.delete(res);broadcast();});return;
      }
      if(req.method==='POST'&&pathname==='/api/views'){
        try{if(!String(req.headers['content-type']||'').startsWith('application/json')){json(res,415,{error:'Expected JSON.'});return;}let body='';for await(const chunk of req){body+=chunk;if(body.length>512){json(res,413,{error:'Request too large.'});return;}}
          let payload;try{payload=JSON.parse(body);if(!payload||typeof payload.viewId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(payload.viewId))throw Error();}catch{json(res,400,{error:'Invalid page-view ID.'});return;}
          const added=store.record(payload.viewId);json(res,200,{...store.snapshot(streams.size),recorded:added});if(added)broadcast();
        }catch{if(!res.headersSent)json(res,503,{error:'Unable to save this view.'});}return;
      }
      if(req.method==='GET'&&pathname==='/api/profile-views.svg'){const n=store.snapshot().total;res.writeHead(200,{'Content-Type':'image/svg+xml','Cache-Control':'no-store'});res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="38" role="img" aria-label="Website profile views: ${n}"><rect width="240" height="38" rx="5" fill="#1b1c19"/><text x="13" y="24" fill="#ffe34b" font-family="Arial" font-size="12">PROFILE VIEWS</text><text x="225" y="25" text-anchor="end" fill="#fff" font-family="Arial" font-size="18">${n}</text></svg>`);return;}
      json(res,404,{error:'Unknown endpoint.'});return;
    }
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
    if(pathname.split('/').some(part=>part.startsWith('.'))||/^\/(scripts|tests)\//.test(pathname)){res.writeHead(404);res.end();return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.gif':'image/gif','.png':'image/png','.json':'application/json'};
    if(!types[path.extname(file)]){res.writeHead(404);res.end();return;}fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-cache'});res.end(error?'Not found':req.method==='HEAD'?undefined:data);});
  });
  const heartbeat=setInterval(()=>{for(const res of streams)res.write(': heartbeat\n\n');},25000);heartbeat.unref();
  server.stopTracker=()=>{clearInterval(heartbeat);for(const res of streams)res.end();streams.clear();};server.viewStore=store;return server;
}
module.exports={createProfileServer,ViewStore,dateKey};
