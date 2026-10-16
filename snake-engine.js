/* Shared deterministic rules for the playable arena and README animation. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.NeonSnake=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  const DIR={up:{x:0,y:-1},right:{x:1,y:0},down:{x:0,y:1},left:{x:-1,y:0}};
  const key=p=>p.x+','+p.y,eq=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y;
  class Snake {
    constructor({random=Math.random,mode='circuit'}={}){this.random=random;this.mode=mode;this.reset();}
    reset(){this.body=[{x:6,y:10},{x:5,y:10},{x:4,y:10},{x:3,y:10}];this.direction='right';this.pending=null;this.score=0;this.eaten=0;this.level=1;this.combo=0;this.ticks=0;this.lastMeal=-100;this.over=false;this.won=false;this.shield=0;this.slow=0;this.power=null;this.effect=null;this.path=[];this.obstacles=this.mode==='classic'?[]:[{x:9,y:5},{x:10,y:5},{x:11,y:5},{x:8,y:14},{x:9,y:14},{x:10,y:14}];this.portals=this.mode==='classic'?[]:[{x:1,y:4},{x:18,y:15}];this.food=null;this.food=this.spawn();return this;}
    inside(p){return p.x>=0&&p.y>=0&&p.x<20&&p.y<20;}
    spawn(){const occupied=new Set([...this.body,...this.obstacles,...this.portals,...(this.food?[this.food]:[]),...(this.power?[this.power]:[])].map(key));const free=[];for(let y=0;y<20;y++)for(let x=0;x<20;x++)if(!occupied.has(x+','+y))free.push({x,y});return free[Math.floor(this.random()*free.length)]||null;}
    steer(name){if(this.over||this.pending||!DIR[name])return false;const a=DIR[this.direction],b=DIR[name];if(a.x===-b.x&&a.y===-b.y)return false;this.pending=name;return true;}
    destination(from,name){const d=DIR[name],p={x:from.x+d.x,y:from.y+d.y};const i=this.portals.findIndex(a=>eq(a,p));if(i>=0)return {...this.portals[1-i]};return p;}
    blocked(p,eating=false){return !this.inside(p)||this.obstacles.some(o=>eq(o,p))||(eating?this.body:this.body.slice(0,-1)).some(o=>eq(o,p));}
    route(){const start=this.body[0],queue=[start],parent=new Map([[key(start),null]]),move=new Map();const occupied=new Set(this.body.slice(0,-1).map(key));let found=null;
      for(let i=0;i<queue.length;i++){const p=queue[i];if(eq(p,this.food)){found=p;break;}for(const name of Object.keys(DIR)){if(i===0){const d=DIR[this.direction],n=DIR[name];if(d.x===-n.x&&d.y===-n.y)continue;}const n=this.destination(p,name),k=key(n);if(this.inside(n)&&!occupied.has(k)&&!this.obstacles.some(o=>eq(o,n))&&!parent.has(k)){parent.set(k,p);move.set(k,name);queue.push(n);}}}
      const path=[];while(found&&!eq(found,start)){path.unshift({point:found,name:move.get(key(found))});found=parent.get(key(found));}return path;
    }
    choose(){this.path=this.route();if(this.path.length)return this.path[0].name;
      // When the food is unreachable, maximize reachable space rather than enter a pocket.
      let best=null,area=-1;for(const name of Object.keys(DIR)){const d=DIR[this.direction],n=DIR[name];if(d.x===-n.x&&d.y===-n.y)continue;const p=this.destination(this.body[0],name);if(this.blocked(p))continue;const q=[p],seen=new Set([key(p)]);for(let i=0;i<q.length;i++)for(const move of Object.keys(DIR)){const next=this.destination(q[i],move);if(!this.blocked(next)&&!seen.has(key(next))){seen.add(key(next));q.push(next);}}if(seen.size>area){area=seen.size;best=name;}}return best||this.direction;
    }
    get interval(){return Math.max(66,155-(this.level-1)*10)*(this.slow>0?1.65:1);}
    step(ai=false){if(this.over)return;this.effect=null;this.ticks++;this.shield=Math.max(0,this.shield-1);this.slow=Math.max(0,this.slow-1);if(this.power&&this.ticks>=this.power.expires)this.power=null;
      this.direction=ai?this.choose():(this.pending||this.direction);this.pending=null;
      const next=this.destination(this.body[0],this.direction),eating=eq(next,this.food);
      if(this.blocked(next,eating)){if(this.shield){this.shield=0;this.effect={type:'rescue',...this.body[0]};const safe=Object.keys(DIR).filter(n=>!this.blocked(this.destination(this.body[0],n)));if(safe.length){this.direction=safe[0];this.pending=null;return;} }this.over=true;return;}
      if(Math.abs(next.x-this.body[0].x)>1||Math.abs(next.y-this.body[0].y)>1)this.effect={type:'portal',...next};
      this.body.unshift(next);
      if(eating){this.combo=this.ticks-this.lastMeal<=35?Math.min(5,this.combo+1):1;this.lastMeal=this.ticks;this.eaten++;this.score+=10*this.combo;this.level=1+Math.floor(this.eaten/4);this.effect={type:'food',...next};this.food=null;this.food=this.spawn();if(!this.food){this.over=true;this.won=true;}if(this.mode==='circuit'&&this.eaten%3===0&&!this.power){const p=this.spawn();if(p)this.power={...p,type:this.eaten%6===0?'slow':'shield',expires:this.ticks+65};}}
      else this.body.pop();
      if(this.power&&eq(next,this.power)){const type=this.power.type;this[type]=type==='shield'?90:65;this.score+=25;this.effect={type,...next};this.power=null;}
      if(this.ticks-this.lastMeal>35)this.combo=0;
    }
  }
  return {Snake,DIR};
});
