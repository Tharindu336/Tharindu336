const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors=['#e9bd00','#141414','#7a6bf0','#438775','#e8884f','#8f9799'];
const text=(x,y,value,size=14,fill='#141414',extra='')=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${size}"${extra?' '+extra:''}>${esc(value)}</text>`;
const mono=(x,y,value,size=11,fill='#6c6c64',extra='')=>text(x,y,value,size,fill,`letter-spacing="1"${extra?' '+extra:''}`).replace('Arial,Helvetica,sans-serif','monospace');
function frame(w,h,title,content,bg='#f7f6ef'){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><rect width="${w}" height="${h}" rx="18" fill="${bg}"/>${content}</svg>`;}
function makeCover(){
  const b=[
    '<defs>',
    '<linearGradient id="glass-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8f7e9"/><stop offset=".48" stop-color="#d8eee2"/><stop offset="1" stop-color="#e2dcf2"/></linearGradient>',
    '<linearGradient id="glass-panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".82"/><stop offset=".56" stop-color="#f5fff9" stop-opacity=".46"/><stop offset="1" stop-color="#e9e3f7" stop-opacity=".42"/></linearGradient>',
    '<linearGradient id="glass-dark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#385848" stop-opacity=".96"/><stop offset=".55" stop-color="#1d352e" stop-opacity=".96"/><stop offset="1" stop-color="#38324d" stop-opacity=".96"/></linearGradient>',
    '<linearGradient id="glass-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff3aa"/><stop offset="1" stop-color="#ffdc4e"/></linearGradient>',
    '<filter id="glass-shadow" x="-.2" y="-.2" width="1.4" height="1.5"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
    '<filter id="glass-glow" x="-.5" y="-.5" width="2" height="2"><feGaussianBlur stdDeviation="20"/></filter>',
    '</defs>',
    '<rect width="1200" height="448" fill="url(#glass-bg)"/>',
    '<circle cx="1100" cy="34" r="140" fill="#92d7b5" opacity=".3" filter="url(#glass-glow)"/>',
    '<circle cx="930" cy="440" r="170" fill="#b7a7e3" opacity=".24" filter="url(#glass-glow)"/>',
    '<circle cx="126" cy="26" r="125" fill="#ffe58b" opacity=".28" filter="url(#glass-glow)"/>',
    '<rect x="24" y="20" width="1152" height="62" rx="24" fill="url(#glass-panel)" stroke="#fff" stroke-opacity=".94"/>',
    '<path d="M48 21h1100" stroke="#fff" stroke-opacity=".8"/>',
    text(50,58,'t↗',35,'#1c3026','font-weight="700" letter-spacing="-4"'),
    mono(111,48,'THARINDU',11,'#20372c','font-weight="bold"'),
    mono(111,63,'ALWAYS BUILDING.',7,'#718078'),
    mono(843,57,'SOFTWARE  /  CREATIVE SYSTEMS  /  SRI LANKA',9,'#51645a'),
    '<rect x="1067" y="33" width="86" height="35" rx="18" fill="#fff" fill-opacity=".65" stroke="#fff"/>',
    mono(1110,55,'EXPLORE ↗',8,'#20372c','text-anchor="middle"'),
    '<rect x="24" y="98" width="708" height="326" rx="30" fill="url(#glass-panel)" stroke="#fff" stroke-opacity=".96" filter="url(#glass-shadow)"/>',
    '<path d="M46 99h650" stroke="#fff" stroke-opacity=".82"/>',
    mono(58,138,'COMPUTER SCIENCE  /  CREATIVE SYSTEMS',9,'#425b4c'),
    '<circle cx="47" cy="134" r="3" fill="#678b68"/>',
    text(51,235,'Always',84,'#1b211c','font-weight="700" letter-spacing="-5"'),
    text(51,316,'building.',84,'#1b211c','font-weight="700" letter-spacing="-5"'),
    '<circle cx="346" cy="306" r="8" fill="#eadc87"/>',
    text(59,362,"I'm Tharindu Abeysinghe. A student, software builder,",13,'#35463b'),
    text(59,383,'and curious mind. Turning “what if” into “here it is.”',13,'#35463b'),
    '<path d="M58 400h630" stroke="#56715e" stroke-opacity=".22"/>',
    mono(59,415,'KANDY, SRI LANKA     LEARN. MAKE. REPEAT.',7,'#63746a'),
    '<rect x="750" y="98" width="426" height="174" rx="30" fill="url(#glass-dark)" stroke="#f4fff6" stroke-opacity=".66" filter="url(#glass-shadow)"/>',
    '<rect x="763" y="111" width="400" height="148" rx="21" fill="none" stroke="#f4fff6" stroke-opacity=".16"/>',
    '<path d="M763 137h400M798 111v148M828 111v148M858 111v148M888 111v148M918 111v148M948 111v148M978 111v148M1008 111v148M1038 111v148M1068 111v148M1098 111v148M1128 111v148" stroke="#f4fff6" stroke-opacity=".055"/>',
    '<circle cx="963" cy="184" r="57" fill="#b8ebc4" opacity=".2" filter="url(#glass-glow)"/>',
    '<circle cx="963" cy="184" r="66" fill="none" stroke="#f1df75" stroke-opacity=".34"/>',
    '<path d="M924 196v-35q0-17 17-17h45q17 0 17 17v35q0 17-17 17h-33" fill="none" stroke="url(#glass-gold)" stroke-width="23" stroke-linecap="round"/>',
    '<circle cx="951" cy="215" r="3" fill="#1d352e"/><circle cx="951" cy="222" r="3" fill="#1d352e"/>',
    mono(780,248,'FOLLOW THE CURIOSITY ↗',7,'#f1df75'),
    mono(1137,126,'336',8,'#e1eee3','text-anchor="end"'),
    '<rect x="750" y="288" width="426" height="136" rx="30" fill="url(#glass-panel)" stroke="#fff" stroke-opacity=".96" filter="url(#glass-shadow)"/>',
    '<rect x="770" y="307" width="75" height="23" rx="12" fill="#fff" fill-opacity=".76" stroke="#fff"/>',
    '<rect x="853" y="307" width="74" height="23" rx="12" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".7"/>',
    '<rect x="935" y="307" width="80" height="23" rx="12" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".7"/>',
    mono(807,322,'BUILDING',6,'#40594a','text-anchor="middle"'),
    mono(890,322,'LEARNING',6,'#607168','text-anchor="middle"'),
    mono(975,322,'EXPLORING',6,'#607168','text-anchor="middle"'),
    text(772,354,'Thoughtful interfaces. Useful software.',11,'#35463b'),
    text(772,373,'Ideas made clearer through interaction.',11,'#35463b'),
    '<path d="M772 395h382" stroke="#56715e" stroke-opacity=".2"/>',
    text(772,412,"LET'S CONNECT",9,'#20372c','font-weight="bold"'),
    text(1147,413,'↗',17,'#20372c','font-weight="bold"')
  ].join('');
  return frame(1200,448,'Tharindu Abeysinghe — A glass-inspired preview of the interactive portfolio.',b,'#e8eee8');
}
function makeTechMeters(data){
  const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tools.js'),'utf8'),scope);const tools=scope.window.PORTFOLIO_TOOLS;
  const hues=['#d4ad35','#8bb993','#75aaa7','#a494c9','#d58d68','#899b76'];
  let b='<defs><linearGradient id="tech-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5f4e9"/><stop offset=".55" stop-color="#dcefe4"/><stop offset="1" stop-color="#e5def2"/></linearGradient><linearGradient id="tech-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".82"/><stop offset=".56" stop-color="#f7fffa" stop-opacity=".52"/><stop offset="1" stop-color="#e9e4f5" stop-opacity=".46"/></linearGradient></defs><rect width="1200" height="820" fill="url(#tech-bg)"/><circle cx="1110" cy="90" r="145" fill="#9bd4b7" opacity=".25"/><circle cx="90" cy="730" r="170" fill="#eadb8d" opacity=".19"/>';
  b+='<rect x="24" y="20" width="1152" height="780" rx="30" fill="url(#tech-glass)" stroke="#fff" stroke-opacity=".96"/><path d="M46 21h1100" stroke="#fff"/>';
  b+=mono(52,60,'01 / THE TOOLBOX',10,'#526c5b')+text(50,111,'A little of everything.',36,'#1d2820','font-weight="bold" letter-spacing="-1"')+mono(1148,59,'LANGUAGES / TOOLS / IDEAS',8,'#60756a','text-anchor="end"');
  b+='<rect x="48" y="131" width="1104" height="180" rx="22" fill="url(#tech-glass)" stroke="#fff" stroke-opacity=".92"/>'+mono(70,159,'PUBLIC CODE SHARE',8,'#5b7063')+mono(1128,159,'BY LANGUAGE  /  NOTEBOOKS EXCLUDED',7,'#718178','text-anchor="end"');
  data.languages.slice(0,6).forEach((l,i)=>{const x=i%2?630:70,y=197+Math.floor(i/2)*35;b+=text(x,y,l.name,12,'#29382e','font-weight="600"')+mono(x+498,y,l.percent.toFixed(1)+'%',9,'#526f5a','text-anchor="end"')+`<rect x="${x}" y="${y+9}" width="498" height="6" rx="3" fill="#294838" fill-opacity=".13"/><rect x="${x}" y="${y+9}" width="${498*l.percent/100}" height="6" rx="3" fill="${hues[i%hues.length]}"/>`;});
  b+=mono(52,352,'THE TOOLKIT',9,'#526c5b')+text(50,385,'18 tools. Many directions.',20,'#24352a','font-weight="600"')+mono(1148,380,'SELECTED FROM THE DAILY WORKFLOW',7,'#718178','text-anchor="end"');
  tools.forEach((tool,i)=>{const x=48+i%6*185,y=402+Math.floor(i/6)*116,prefix='tool-'+tool.id+'-';let icon=Buffer.from(tool.icon,'base64').toString('utf8').replace(/\r\n?/g,' ');icon=icon.replace(/id="([^"]+)"/g,(_,id)=>'id="'+prefix+id+'"').replace(/url\(#([^\)]+)\)/g,(_,id)=>'url(#'+prefix+id+')').replace(/(href=")#([^"]+)/g,(_,a,id)=>a+'#'+prefix+id);icon=icon.replace(/<svg\b([^>]*)>/,(_,attrs)=>'<svg '+attrs.replace(/\s(?:width|height)="[^"]*"/g,'')+` x="${x+16}" y="${y+15}" width="28" height="28">`);b+=`<rect x="${x}" y="${y}" width="169" height="101" rx="19" fill="url(#tech-glass)" stroke="#fff" stroke-opacity=".95"/>`;if(['nextjs','github','rasa','langchain','neo4j'].includes(tool.id))b+=`<rect x="${x+12}" y="${y+11}" width="36" height="36" rx="12" fill="#243b2d" fill-opacity=".92"/>`;b+=icon+text(x+14,y+66,tool.name,12,'#26382c','font-weight="600"')+mono(x+14,y+84,tool.category.toUpperCase(),6,'#758078');});
  b+=mono(52,766,'LANGUAGE METERS SHOW CODE DISTRIBUTION, NOT PROFICIENCY.',8,'#60756a')+mono(1148,766,data.generatedAt.slice(0,10),8,'#60756a','text-anchor="end"');
  return frame(1200,820,'A glass-inspired view of Tharindu’s developer toolkit and real public language meters.',b,'#e8eee8');
}
function makeDashboard(data){
  const s=data.stats;let b='<defs><linearGradient id="activity-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5f4e9"/><stop offset=".55" stop-color="#dcefe4"/><stop offset="1" stop-color="#e5def2"/></linearGradient><linearGradient id="activity-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".82"/><stop offset=".56" stop-color="#f7fffa" stop-opacity=".52"/><stop offset="1" stop-color="#e9e4f5" stop-opacity=".46"/></linearGradient></defs><rect width="1200" height="520" fill="url(#activity-bg)"/><circle cx="1100" cy="60" r="140" fill="#9bd4b7" opacity=".22"/><circle cx="160" cy="490" r="145" fill="#b8a8df" opacity=".16"/>';
  b+='<rect x="24" y="20" width="1152" height="480" rx="30" fill="url(#activity-glass)" stroke="#fff" stroke-opacity=".96"/><path d="M46 21h1100" stroke="#fff"/>';
  b+=mono(52,58,'03 / SMALL STEPS, REAL PROGRESS',9,'#526c5b')+text(50,105,'The work adds up.',34,'#1d2820','font-weight="bold" letter-spacing="-1"')+mono(1148,57,'PUBLIC GITHUB SNAPSHOT',8,'#60756a','text-anchor="end"');
  const stats=[[s.total,'CONTRIBUTIONS'],[s.currentStreak,'CURRENT STREAK / DAYS'],[s.longestStreak,'LONGEST STREAK / DAYS'],[s.ownRepos,'PUBLIC REPOSITORIES']];
  stats.forEach(([n,label],i)=>{const x=50+i*280;b+=`<rect x="${x}" y="126" width="264" height="100" rx="20" fill="url(#activity-glass)" stroke="#fff" stroke-opacity=".9"/>`;b+=text(x+17,178,n,42,i===0?'#486d51':'#24342a','font-weight="bold" letter-spacing="-2"')+mono(x+18,203,label,7,'#67776c');});
  b+=mono(52,260,'CONTRIBUTIONS / LAST 365 DAYS',8,'#526c5b')+'<rect x="48" y="273" width="1104" height="160" rx="20" fill="url(#activity-glass)" stroke="#fff" stroke-opacity=".92"/>';
  const offset=new Date(data.days[0].date+'T12:00:00Z').getUTCDay(),max=Math.max(1,...data.days.map(d=>d.count));
  const palette=['#dce9df','#aecdb5','#83b993','#57996e','#347753'];
  data.days.forEach((d,i)=>{const n=i+offset,x=65+Math.floor(n/7)*20.2,y=291+n%7*19;const level=d.count?Math.max(1,Math.ceil(d.count/max*4)):0;b+=`<rect x="${x}" y="${y}" width="13.5" height="13.5" rx="4" fill="${palette[level]}" stroke="#fff" stroke-opacity=".45"><title>${d.date}: ${d.count} contributions</title></rect>`;});
  b+=mono(52,466,'PUBLIC ACTIVITY / '+data.days[0].date+' — '+data.days.at(-1).date,8,'#60756a')+mono(1148,466,'SNAPSHOT '+data.generatedAt.slice(0,16).replace('T',' ')+' UTC',8,'#60756a','text-anchor="end"');
  return frame(1200,520,'A glass-inspired view of GitHub contributions, streaks and activity for '+data.username+'.',b,'#e8eee8');
}
function makeSnakeSVG(){
  const {Snake}=require('../snake-engine.js'),s=new Snake({random:()=>.36});for(let i=0;i<55;i++)s.step(true);
  let b='<defs><linearGradient id="snake-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5f4e9"/><stop offset=".55" stop-color="#dcefe4"/><stop offset="1" stop-color="#e5def2"/></linearGradient><linearGradient id="snake-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".55" stop-color="#effff5" stop-opacity=".4"/><stop offset="1" stop-color="#d8cdee" stop-opacity=".25"/></linearGradient></defs><rect width="1200" height="540" fill="url(#snake-bg)"/><circle cx="490" cy="490" r="175" fill="#f5df86" opacity=".2"/><rect x="24" y="20" width="1152" height="500" rx="30" fill="url(#snake-glass)" stroke="#fff" stroke-opacity=".96"/>';
  b+='<rect x="48" y="46" width="550" height="448" rx="24" fill="url(#snake-glass)" stroke="#fff" stroke-opacity=".95"/>'+mono(76,88,'02 / THE LONG GAME',9,'#526c5b')+text(72,170,'SNAKE.',64,'#1d2820','font-weight="bold" letter-spacing="-3"')+text(76,214,'A familiar game. A few unexpected turns.',16,'#45584b')+mono(76,270,'PORTALS  /  POWER-UPS  /  COMBOS',9,'#60756a')+mono(76,296,'WATCH THE AGENT PLAY OR TAKE THE WHEEL',8,'#738178')+'<path d="M76 325h490" stroke="#60756a" stroke-opacity=".2"/><circle cx="91" cy="370" r="6" fill="#83b993"/>'+text(108,375,'SIGNALS GROW YOUR SCORE',11,'#3e5546')+'<circle cx="91" cy="404" r="6" fill="#aa98d2"/>'+text(108,409,'LINKED PORTALS CROSS THE BOARD',11,'#3e5546')+'<circle cx="91" cy="438" r="6" fill="#e1c754"/>'+text(108,443,'SHIELDS AND SLOW TIME CHANGE THE RUN',11,'#3e5546')+mono(76,474,'ARROWS / WASD / SWIPE / TOUCH',8,'#60756a');
  b+='<rect x="620" y="46" width="532" height="448" rx="24" fill="#20372d" stroke="#fff" stroke-opacity=".88"/><rect x="636" y="62" width="500" height="416" rx="18" fill="none" stroke="#f1fff4" stroke-opacity=".17"/><circle cx="890" cy="270" r="220" fill="#84c99b" opacity=".13"/>';
  for(let i=1;i<20;i++)b+=`<path d="M${644+i*24} 70v400M644 ${70+i*20}h484" stroke="#edfff2" stroke-opacity=".07"/>`;
  s.obstacles.forEach(p=>b+=`<rect x="${647+p.x*24}" y="${73+p.y*20}" width="18" height="16" rx="6" fill="#b5d8bd" fill-opacity=".24" stroke="#dfffe5" stroke-opacity=".3"/>`);s.portals.forEach(p=>b+=`<circle cx="${656+p.x*24}" cy="${82+p.y*20}" r="10" fill="#b6a6ff" fill-opacity=".12" stroke="#d3caff" stroke-width="3"/>`);s.body.forEach((p,i)=>b+=`<rect x="${646+p.x*24}" y="${72+p.y*20}" width="20" height="18" rx="7" fill="${i===0?'#fff0a8':'#9ed8aa'}" stroke="#fff" stroke-opacity=".5" opacity="${Math.max(.4,1-i*.035)}"/>`);if(s.food)b+=`<circle cx="${656+s.food.x*24}" cy="${82+s.food.y*20}" r="7" fill="#ffdf63" stroke="#fff4bd" stroke-width="2"/>`;
  return frame(1200,540,'Glass-inspired Snake game preview with linked portals, power-ups, combos and an autopilot.',b,'#e8eee8');
}
module.exports={makeCover,makeTechMeters,makeDashboard,makeSnakeSVG};
