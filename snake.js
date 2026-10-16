(() => {
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('snake-canvas'),ctx=canvas.getContext('2d');
  let game=new NeonSnake.Snake(),ai=true,paused=false,best=0,visible=false,last=0,endedAt=0,particles=[],less=matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{best=Math.max(0,Number(localStorage.getItem('tharindu-snake-overdrive-best'))||0);if(!Number.isSafeInteger(best))best=0;}catch{}
  const fmt=n=>String(n).padStart(5,'0');
  function sync(){
    $('game-score').textContent=fmt(game.score);$('game-best').textContent=fmt(best);$('game-level').textContent=String(game.level).padStart(2,'0');$('game-combo').textContent=game.combo?'×'+game.combo:'—';$('game-length').textContent=String(game.body.length).padStart(2,'0');
    $('game-mode').textContent=ai?'AI DEMO':'YOUR TURN';$('game-policy').textContent=ai?'BFS / AUTOPILOT':'PLAYER / CIRCUIT';$('game-speed').textContent=(1000/game.interval).toFixed(1)+' CELLS / SEC';
    $('game-overlay').hidden=!(paused||game.over);$('game-message').textContent=game.over?(game.won?'Circuit complete.':'Signal lost.'):'Run paused';$('game-submessage').textContent=game.over?'Score '+game.score+' · Restart to chase your record.':'Resume when you’re ready.';
    $('game-pause').textContent=paused?'Resume':'Pause';$('game-pause').disabled=game.over;
    $('game-demo').setAttribute('aria-pressed',String(ai));$('game-play').setAttribute('aria-pressed',String(!ai));
    $('game-help').textContent=ai?'The agent routes through linked portals and navigates around obstacles. Take control to set your personal best.':'Collect cyan signals. Chain meals for ×5 combos. Portals cross the arena; shields rescue one collision.';
    const power=game.shield?'SHIELD / '+game.shield+' TICKS':game.slow?'SLOW TIME / '+game.slow+' TICKS':'NO ACTIVE POWER-UP';$('game-power').textContent=power;$('game-power-meter').style.width=Math.max(game.shield/90,game.slow/65)*100+'%';
  }
  function reset(){game.reset();paused=false;endedAt=0;last=performance.now();particles=[];sync();draw(last);}
  function mode(name){ai=name;reset();if(!ai)canvas.focus({preventScroll:true});}
  $('game-play').onclick=()=>mode(false);$('game-demo').onclick=()=>mode(true);$('game-restart').onclick=reset;$('game-pause').onclick=()=>{paused=!paused;last=performance.now();sync();};
  for(const b of document.querySelectorAll('[data-snake-rules]'))b.onclick=()=>{game.mode=b.dataset.snakeRules;for(const button of document.querySelectorAll('[data-snake-rules]'))button.setAttribute('aria-pressed',String(button===b));reset();};
  for(const b of document.querySelectorAll('[data-direction]'))b.onclick=()=>{if(!ai&&!paused)game.steer(b.dataset.direction);};
  canvas.addEventListener('keydown',e=>{const direction={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left',w:'up',d:'right',s:'down',a:'left'}[e.key]||{W:'up',D:'right',S:'down',A:'left'}[e.key];if(direction){e.preventDefault();if(!ai&&!paused)game.steer(direction);}if(e.code==='Space'){e.preventDefault();if(!game.over)$('game-pause').click();}if(e.key.toLowerCase()==='r')reset();});
  let touch=null;canvas.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};if(e.isTrusted)canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});canvas.addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;if(Math.hypot(dx,dy)>12&&!ai&&!paused)game.steer(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touch=null;});canvas.addEventListener('pointercancel',()=>{touch=null;});
  function motion(){ $('snake-motion').setAttribute('aria-pressed',String(less));$('snake-motion').textContent=less?'Enable effects':'Reduce effects';}motion();$('snake-motion').onclick=()=>{less=!less;motion();};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=performance.now();},{threshold:.05}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{last=performance.now();});
  const palette={food:'#a4ddd6',portal:'#b6a6ff',shield:'#ffe34b',slow:'#b5d79a',rescue:'#fff3af'};
  function draw(stamp){const r=canvas.getBoundingClientRect();if(!r.width)return;const dpr=Math.min(devicePixelRatio||1,2),size=r.width;if(canvas.width!==Math.round(size*dpr)){canvas.width=canvas.height=Math.round(size*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);const c=size/20;ctx.clearRect(0,0,size,size);ctx.fillStyle='#161714';ctx.fillRect(0,0,size,size);
    ctx.strokeStyle='#ffffff06';ctx.lineWidth=1;for(let i=1;i<20;i++){ctx.beginPath();ctx.moveTo(i*c,0);ctx.lineTo(i*c,size);ctx.moveTo(0,i*c);ctx.lineTo(size,i*c);ctx.stroke();}
    if(!less){const scan=stamp*.024%size;const grad=ctx.createLinearGradient(0,scan-40,0,scan+40);grad.addColorStop(0,'#ffe34b00');grad.addColorStop(.5,'#ffe34b08');grad.addColorStop(1,'#ffe34b00');ctx.fillStyle=grad;ctx.fillRect(0,scan-40,size,80);}
    game.obstacles.forEach(p=>{ctx.fillStyle='#45473c';ctx.fillRect(p.x*c+3,p.y*c+3,c-6,c-6);ctx.strokeStyle='#777b65';ctx.strokeRect(p.x*c+5,p.y*c+5,c-10,c-10);});
    game.portals.forEach((p,i)=>{ctx.save();ctx.translate((p.x+.5)*c,(p.y+.5)*c);ctx.rotate(less?0:stamp*.002*(i?1:-1));ctx.strokeStyle='#b6a6ff';ctx.lineWidth=2;ctx.shadowColor='#b6a6ff';ctx.shadowBlur=less?0:13;ctx.beginPath();ctx.arc(0,0,c*.37,0,Math.PI*1.6);ctx.stroke();ctx.strokeStyle='#b6a6ff55';ctx.strokeRect(-c*.24,-c*.24,c*.48,c*.48);ctx.restore();});
    if(ai&&game.path.length){ctx.strokeStyle='#ffe34b25';ctx.setLineDash([3,6]);ctx.beginPath();let previous=game.body[0];ctx.moveTo((previous.x+.5)*c,(previous.y+.5)*c);for(const {point:p} of game.path){if(Math.abs(p.x-previous.x)+Math.abs(p.y-previous.y)>1)ctx.moveTo((p.x+.5)*c,(p.y+.5)*c);else ctx.lineTo((p.x+.5)*c,(p.y+.5)*c);previous=p;}ctx.stroke();ctx.setLineDash([]);}
    const orb=(p,color,radius)=>{ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=less?0:15;ctx.beginPath();ctx.arc((p.x+.5)*c,(p.y+.5)*c,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;};
    if(game.food){orb(game.food,palette.food,c*(.22+(less?0:Math.sin(stamp*.005)*.035)));ctx.strokeStyle='#a4ddd655';ctx.beginPath();ctx.arc((game.food.x+.5)*c,(game.food.y+.5)*c,c*.4,0,Math.PI*2);ctx.stroke();}
    if(game.power){orb(game.power,palette[game.power.type],c*.3);ctx.fillStyle='#191a17';ctx.font='bold '+Math.round(c*.35)+'px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(game.power.type==='shield'?'S':'T',(game.power.x+.5)*c,(game.power.y+.5)*c);}
    for(let i=game.body.length-1;i>=0;i--){const p=game.body[i];ctx.fillStyle=i===0?'#fff5b2':`rgba(255,227,75,${.35+.65*(1-i/game.body.length)})`;ctx.shadowBlur=!less&&i<3?10:0;ctx.shadowColor='#ffe34b';ctx.beginPath();ctx.roundRect(p.x*c+1.8,p.y*c+1.8,c-3.6,c-3.6,c*.2);ctx.fill();}ctx.shadowBlur=0;
    const head=game.body[0],d=NeonSnake.DIR[game.direction];ctx.fillStyle='#191a17';for(const sign of [-1,1]){const x=(head.x+.5+d.x*.2+d.y*.19*sign)*c,y=(head.y+.5+d.y*.2+d.x*.19*sign)*c;ctx.beginPath();ctx.arc(x,y,c*.055,0,Math.PI*2);ctx.fill();}
    if(game.shield){ctx.strokeStyle='#ffe34b';ctx.lineWidth=2;ctx.beginPath();ctx.arc((head.x+.5)*c,(head.y+.5)*c,c*.65,0,Math.PI*2);ctx.stroke();}
    if(!less)particles=particles.filter(p=>{const age=(stamp-p.born)/600;if(age>1)return false;ctx.globalAlpha=1-age;ctx.fillStyle=p.color;ctx.fillRect((p.x+.5)*c+p.dx*age*c,(p.y+.5)*c+p.dy*age*c,3,3);ctx.globalAlpha=1;return true;});
  }
  function frame(stamp){if(visible&&!document.hidden&&!$('command-dialog').open){if(!paused&&!game.over&&stamp-last>=game.interval){game.step(ai);last=stamp;if(game.effect){if(!less)for(let i=0;i<12;i++)particles.push({...game.effect,born:stamp,dx:Math.cos(i*Math.PI/6)*2,dy:Math.sin(i*Math.PI/6)*2,color:palette[game.effect.type]||palette.food});$('game-event').textContent={food:'SIGNAL CAPTURED / COMBO ×'+game.combo,portal:'PORTAL TRANSIT COMPLETE',shield:'SHIELD ONLINE / ONE COLLISION RESCUE',slow:'TIME DILATION ONLINE',rescue:'SHIELD USED / COURSE CORRECTED'}[game.effect.type];}if(!ai&&game.score>best){best=game.score;try{localStorage.setItem('tharindu-snake-overdrive-best',String(best));}catch{}}sync();}if(game.over&&ai){if(!endedAt)endedAt=stamp;if(stamp-endedAt>1800)reset();}draw(stamp);}requestAnimationFrame(frame);}
  new ResizeObserver(()=>draw(performance.now())).observe(canvas);reset();requestAnimationFrame(frame);
})();
