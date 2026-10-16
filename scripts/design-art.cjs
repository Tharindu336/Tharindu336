const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors=['#e9bd00','#141414','#7a6bf0','#438775','#e8884f','#8f9799'];
const text=(x,y,value,size=14,fill='#141414',extra='')=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" ${extra}>${esc(value)}</text>`;
const mono=(x,y,value,size=11,fill='#6c6c64',extra='')=>text(x,y,value,size,fill,`letter-spacing="1" ${extra}`).replace('Arial,Helvetica,sans-serif','monospace');
function frame(w,h,title,content,bg='#f7f6ef'){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><rect width="${w}" height="${h}" rx="18" fill="${bg}"/>${content}</svg>`;}
function makeCover(){
  let b=mono(40,40,'THARINDU ABEYSINGHE',12,'#141414')+mono(1160,40,'KANDY, SRI LANKA / 07.29° N',10,'#141414','text-anchor="end"');
  b+='<path d="M40 62H1160" stroke="#141414" stroke-opacity=".25"/>';
  b+=text(34,187,'ALWAYS',110,'#141414','font-weight="900" letter-spacing="-7"')+text(34,294,'BUILDING.',110,'#141414','font-weight="900" letter-spacing="-7"');
  b+=text(41,345,'Computer science student. Software builder. Curious by default.',18,'#343322');
  b+='<g transform="translate(903 212)"><circle r="132" fill="none" stroke="#141414" stroke-width="1"/><circle r="100" fill="#141414"/><path d="M-54 32V-32Q-54-56-30-56H30Q54-56 54-32V32Q54 56 30 56H-10" fill="none" stroke="#ffe34b" stroke-width="27" stroke-linecap="round"/><circle cx="-13" cy="52" r="3" fill="#141414"/><circle cx="-13" cy="60" r="3" fill="#141414"/><path d="M-144 0H144M0-144V144" stroke="#141414" stroke-opacity=".2"/><circle cx="110" cy="-74" r="14" fill="#f7f6ef" stroke="#141414"/></g>';
  b+='<path d="M40 384H1160" stroke="#141414" stroke-opacity=".25"/>'+mono(40,418,'SOFTWARE / CREATIVE SYSTEMS / THE LONG GAME',10,'#141414')+mono(1160,418,'LEARN. MAKE. REPEAT. ↗',11,'#141414','text-anchor="end"');
  return frame(1200,448,'Tharindu Abeysinghe — Always building. Computer science student and software builder in Sri Lanka.',b,'#ffe34b');
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
