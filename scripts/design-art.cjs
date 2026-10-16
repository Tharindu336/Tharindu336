const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors=['#e9bd00','#141414','#7a6bf0','#438775','#e8884f','#8f9799'];
const text=(x,y,value,size=14,fill='#141414',extra='')=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" ${extra}>${esc(value)}</text>`;
const mono=(x,y,value,size=11,fill='#6c6c64',extra='')=>text(x,y,value,size,fill,`letter-spacing="1" ${extra}`).replace('Arial,Helvetica,sans-serif','monospace');
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
  const hues=['#f4d64e','#c8df83','#85bec5','#b9a5df','#e9a96a','#8f9a78'];
  let b=mono(36,38,'01 / THE ORIGINAL TOOLKIT',11,'#f4d64e')+text(36,88,'The tools behind the curiosity.',35,'#eef2df','font-weight="bold" letter-spacing="-1"')+mono(1164,38,'18 TOOLS / ENDLESS COMBINATIONS',9,'#a7b195','text-anchor="end"');
  data.languages.slice(0,6).forEach((l,i)=>{const x=i%2?630:36,y=143+Math.floor(i/2)*65;b+=text(x,y,l.name,15,'#eef2df')+mono(x+534,y,l.percent.toFixed(1)+'%',12,'#f4d64e','text-anchor="end"')+`<rect x="${x}" y="${y+15}" width="534" height="7" rx="3" fill="#303728"/><rect x="${x}" y="${y+15}" width="${534*l.percent/100}" height="7" rx="3" fill="${hues[i%hues.length]}"/>`;});
  b+='<path d="M36 323H1164" stroke="#f4d64e" stroke-opacity=".2"/>'+mono(36,358,'LANGUAGES / WEB & API / DATA TOOLS / DEVELOPMENT WORKSPACE',10,'#a7b195');
  tools.forEach((tool,i)=>{const x=36+i%6*190,y=388+Math.floor(i/6)*115,prefix='tool-'+tool.id+'-';let icon=Buffer.from(tool.icon,'base64').toString('utf8');icon=icon.replace(/id="([^"]+)"/g,(_,id)=>'id="'+prefix+id+'"').replace(/url\(#([^\)]+)\)/g,(_,id)=>'url(#'+prefix+id+')').replace(/(href=")#([^"]+)/g,(_,a,id)=>a+'#'+prefix+id);icon=icon.replace(/<svg\b([^>]*)>/,(_,attrs)=>'<svg '+attrs.replace(/\s(?:width|height)="[^"]*"/g,'')+` x="${x+16}" y="${y+15}" width="30" height="30">`);b+=`<rect x="${x}" y="${y}" width="176" height="102" rx="7" fill="#22271b" stroke="#f4d64e" stroke-opacity=".15"/>`;if(['nextjs','github','rasa','langchain','neo4j'].includes(tool.id))b+=`<rect x="${x+13}" y="${y+12}" width="36" height="36" rx="5" fill="#eef2df"/>`;b+=icon+text(x+16,y+68,tool.name,13,'#eef2df')+mono(x+16,y+86,tool.category.toUpperCase(),7,'#a7b195');});
  b+='<path d="M36 755H1164" stroke="#f4d64e" stroke-opacity=".2"/>'+mono(36,791,'METERS: PUBLIC CODE SHARE, NOT PROFICIENCY / NOTEBOOKS EXCLUDED',9,'#a7b195')+mono(1164,791,data.generatedAt.slice(0,10),10,'#a7b195','text-anchor="end"');return frame(1200,820,'Original dark yellow tech stack: 18 tool icons and real public language meters',b,'#151a11');
}
function makeDashboard(data){
  const s=data.stats;let b=mono(36,39,'03 / SMALL STEPS, REAL PROGRESS',11,'#b6b7af')+text(36,90,'The work adds up.',38,'#f7f6ef','font-weight="bold" letter-spacing="-1"')+mono(1164,39,'GITHUB / LAST 365 DAYS',10,'#b6b7af','text-anchor="end"');
  const stats=[[s.total,'CONTRIBUTIONS'],[s.currentStreak,'CURRENT STREAK / DAYS'],[s.longestStreak,'LONGEST STREAK / DAYS'],[s.ownRepos,'PUBLIC REPOSITORIES']];
  stats.forEach(([n,label],i)=>{const x=36+i*289;if(i)b+=`<path d="M${x-18} 128v110" stroke="#3c3c36"/>`;b+=text(x,183,n,62,i===0?'#ffe34b':'#f7f6ef','font-weight="bold" letter-spacing="-3"')+mono(x,216,label,9,'#b6b7af');});
  b+='<path d="M36 253H1164" stroke="#3c3c36"/>';
  const offset=new Date(data.days[0].date+'T12:00:00Z').getUTCDay(),max=Math.max(1,...data.days.map(d=>d.count));
  data.days.forEach((d,i)=>{const n=i+offset,x=36+Math.floor(n/7)*21.3,y=290+n%7*21;const level=d.count?Math.max(1,Math.ceil(d.count/max*4)):0;b+=`<rect x="${x}" y="${y}" width="15.5" height="15.5" rx="3" fill="${['#30312b','#6b6226','#a08e2f','#d2b635','#ffe34b'][level]}"><title>${d.date}: ${d.count} contributions</title></rect>`;});
  b+=mono(36,487,'PUBLIC ACTIVITY / '+data.days[0].date+' — '+data.days.at(-1).date,10,'#b6b7af')+mono(1164,487,'SNAPSHOT '+data.generatedAt.slice(0,16).replace('T',' ')+' UTC',9,'#b6b7af','text-anchor="end"');
  return frame(1200,520,'GitHub contributions, streaks and calendar for '+data.username,b,'#1b1c19');
}
function makeSnakeSVG(){
  const {Snake}=require('../snake-engine.js'),s=new Snake({random:()=>.36});for(let i=0;i<55;i++)s.step(true);
  let b=mono(35,37,'02 / THE LONG GAME',11,'#ffe34b')+text(35,107,'SNAKE.',66,'#f7f6ef','font-weight="bold" letter-spacing="-3"')+text(35,158,'One more turn.',30,'#c6c7bc')+mono(35,218,'PORTALS / POWER-UPS / COMBOS',11,'#b6b7af')+mono(35,250,'CONTINUOUS SIMULATION / AUTOPILOT',11,'#b6b7af')+mono(35,334,'FOLLOW THE SIGNAL. FIND THE RHYTHM.',12,'#ffe34b');
  b+='<rect x="680" y="30" width="480" height="480" rx="10" fill="#292a25"/>';for(let i=1;i<20;i++)b+=`<path d="M${680+i*24} 30v480M680 ${30+i*24}h480" stroke="#ffffff06"/>`;
  s.obstacles.forEach(p=>b+=`<rect x="${683+p.x*24}" y="${33+p.y*24}" width="18" height="18" rx="3" fill="#5b5b4c"/>`);s.portals.forEach(p=>b+=`<circle cx="${692+p.x*24}" cy="${42+p.y*24}" r="9" fill="none" stroke="#b6a6ff" stroke-width="3"/>`);s.body.forEach((p,i)=>b+=`<rect x="${682+p.x*24}" y="${32+p.y*24}" width="20" height="20" rx="5" fill="${i===0?'#fff5b2':'#ffe34b'}" opacity="${Math.max(.35,1-i*.035)}"/>`);if(s.food)b+=`<circle cx="${692+s.food.x*24}" cy="${42+s.food.y*24}" r="6" fill="#a4ddd6"/>`;return frame(1200,540,'Snake — The long game. Play the interactive arena.',b,'#1b1c19');
}
module.exports={makeCover,makeTechMeters,makeDashboard,makeSnakeSVG};
