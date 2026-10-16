const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
module.exports=async function check(cdp,port,root){
  const ev=s=>cdp.evaluate(s),data=require('../generated/profile-data.json');
  const shot=async name=>{const p=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(root,'artifacts',name),Buffer.from(p.data,'base64'));};
  fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
  assert.equal(await ev("document.querySelectorAll('.tool-card').length"),18);
  assert.equal(await ev("document.querySelector('#visit-count').textContent"),'01');
  assert.equal(await ev("document.querySelector('#intro-title').textContent"),'Alwaysbuilding.');
  assert.equal(await ev("document.querySelector('#work')"),null);
  assert.equal(await ev("document.querySelector('#lab')"),null);
  assert.equal(await ev("document.querySelector('#defender-panel')"),null);
  assert.equal(await ev("document.querySelector('#toolkit-panel').hidden"),false);
  await ev("document.querySelector('#tab-meters').click()");
  assert.equal(await ev("document.querySelectorAll('.tech-meter[role=meter]').length"),data.languages.length);
  assert.equal(await ev("Number(document.querySelector('.tech-meter').getAttribute('aria-valuenow'))"),Number(data.languages[0].percent.toFixed(1)));
  await ev("document.querySelector('#meter-order').value='name';document.querySelector('#meter-order').dispatchEvent(new Event('change'))");
  assert.equal(await ev("document.querySelector('.tech-heading strong').textContent"),[...data.languages].sort((a,b)=>a.name.localeCompare(b.name))[0].name);
  await ev("document.querySelector('#meter-order').value='share';document.querySelector('#meter-order').dispatchEvent(new Event('change'));document.querySelector('#tab-meters').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}))");
  assert.equal(await ev("document.querySelector('#toolkit-panel').hidden"),false);
  await ev("document.querySelector('[data-filter=\"Web & API\"]').click()");
  assert.ok(await ev("[...document.querySelectorAll('.tool-card')].filter(c=>!c.hidden).every(c=>c.dataset.category==='Web & API')"));
  await ev("document.querySelector('[data-tool=nodejs]').click()");
  assert.equal(await ev("document.querySelector('#tool-detail-name').textContent"),'Node.js');
  assert.ok(await ev("document.querySelector('#tool-detail-link').href.includes('nodejs.org')"));
  await ev("document.querySelector('[data-filter=all]').click();document.querySelector('#tool-search').value='javascript';document.querySelector('#tool-search').dispatchEvent(new Event('input'))");
  assert.equal(await ev("[...document.querySelectorAll('.tool-card')].filter(c=>!c.hidden).length"),1);
  assert.equal(await ev("document.querySelector('#tool-detail-name').textContent"),'JavaScript');
  await ev("document.querySelector('#tool-search').value='no-such-tool';document.querySelector('#tool-search').dispatchEvent(new Event('input'))");
  assert.equal(await ev("document.querySelector('#tool-empty').hidden"),false);
  await ev("document.querySelector('#tool-search').value='';document.querySelector('#tool-search').dispatchEvent(new Event('input'));document.querySelector('[data-approach=learning]').click()");
  assert.ok(await ev("document.querySelector('#approach-note').textContent.includes('Learning by making')"));
  await ev("document.querySelector('[data-approach=building]').click();document.querySelector('#tab-meters').click()");
  await ev("document.querySelector('#shared-profile-views').dispatchEvent(new Event('error'))");
  assert.equal(await ev("document.querySelector('#profile-counter-fallback').hidden"),false);
  await ev("document.querySelector('#refresh-profile-counter').click()");
  assert.ok(await ev("document.querySelector('#shared-profile-views').src.includes('&t=')"));
  for(let i=0;i<100;i++){if(await ev("document.querySelector('#live-view-status').dataset.state==='live'&&document.querySelector('#live-view-total').textContent==='1'"))break;await sleep(50);}
  assert.equal(await ev("document.querySelector('#live-view-total').textContent"),'1');
  const nextView=await fetch(`http://127.0.0.1:${port}/api/views`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({viewId:'browser-other-navigation-001'})});
  assert.equal(nextView.status,200);
  for(let i=0;i<100;i++){if(await ev("document.querySelector('#live-view-total').textContent==='2'"))break;await sleep(50);}
  assert.equal(await ev("document.querySelector('#live-view-total').textContent"),'2','another page view streams to the open page');
  await ev("document.querySelector('#retry-live-views').click();document.querySelector('[data-view-range=\"30\"]').click()");
  assert.equal(await ev("document.querySelectorAll('#live-view-bars button').length"),30);
  await ev("document.querySelector('#live-view-bars button').click()");
  assert.ok(await ev("document.querySelector('#live-view-insight').textContent.includes('page views')"));
  assert.equal((await(await fetch(`http://127.0.0.1:${port}/api/views`)).json()).total,2,'reconnect does not record another view');
  assert.equal(await ev("Number(document.querySelector('#gh-contributions').textContent)"),data.stats.total);
  assert.equal(await ev("document.querySelectorAll('#contribution-grid button').length"),365);
  await ev("document.querySelector('[data-calendar-range=\"30\"]').click();document.querySelector('#contribution-grid button').focus();document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}))");
  assert.equal(await ev("document.activeElement.dataset.date"),data.days.slice(-30)[7].date);
  assert.ok(await ev("document.querySelector('#calendar-insight').textContent.includes('contributions')"));
  await ev("document.querySelector('[data-calendar-range=\"365\"]').click();document.querySelector('#command-open').click();document.querySelector('#command-search').value='visitor';document.querySelector('#command-search').dispatchEvent(new Event('input'))");
  assert.equal(await ev("document.querySelector('#command-dialog').open"),true);
  assert.equal(await ev("[...document.querySelectorAll('#command-results a')].filter(a=>!a.hidden).length"),1);
  await ev("document.querySelector('#command-results a[href=\"#visitors\"]').click()");
  assert.equal(await ev("document.querySelector('#command-dialog').open"),false);
  await ev("document.querySelector('#snake-canvas').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('#game-demo').click()");
  for(let i=0;i<90;i++){if(Number(await ev("document.querySelector('#game-score').textContent"))>0)break;await sleep(100);}
  assert.ok(Number(await ev("document.querySelector('#game-score').textContent"))>0,'AI reaches a real food target');
  await ev("document.querySelector('#game-play').click();document.querySelector('#game-pause').click()");
  assert.equal(await ev("document.querySelector('#game-mode').textContent"),'YOUR TURN');
  assert.equal(await ev("document.querySelector('#game-overlay').hidden"),false);
  await ev("document.querySelector('#game-restart').click();document.querySelector('#snake-canvas').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true}))");await sleep(180);
  await ev("document.querySelector('#game-pause').click()");
  const headUp="(()=>{const c=document.querySelector('#snake-canvas'),r=c.getBoundingClientRect(),s=c.width/r.width,cell=r.width/20;for(let y=0;y<10;y++){const p=c.getContext('2d').getImageData(Math.floor(6.5*cell*s),Math.floor((y+.5)*cell*s),1,1).data;if(p[0]>250&&p[1]>230&&p[2]>140)return true;}return false;})()";
  assert.ok(await ev(headUp),'keyboard steers the rendered snake');
  await ev("document.querySelector('#game-restart').click();document.querySelector('[data-direction=up]').click()");await sleep(180);await ev("document.querySelector('#game-pause').click()");assert.ok(await ev(headUp),'touch direction buttons steer the rendered snake');
  await ev("document.querySelector('[data-snake-rules=classic]').click();document.querySelector('#snake-canvas').dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,clientX:200,clientY:200}));document.querySelector('#snake-canvas').dispatchEvent(new PointerEvent('pointerup',{pointerId:1,clientX:200,clientY:80}))");await sleep(180);await ev("document.querySelector('#game-pause').click()");assert.ok(await ev(headUp),'swipe steers the rendered snake');
  await ev("document.querySelector('[data-snake-rules=circuit]').click()");
  await cdp.send('Page.reload');
  for(let i=0;i<100;i++){if(await ev("document.querySelector('#visit-count')?.textContent==='02'"))break;await sleep(100);}
  assert.equal(await ev("document.querySelector('#return-status').textContent"),'Welcome back');
  await ev("window.scrollTo({top:0,behavior:'instant'})");await sleep(250);await shot('desktop.png');
  await ev("document.querySelector('#visitors').scrollIntoView({behavior:'instant'})");await sleep(1100);await shot('visitors.png');
  assert.notEqual(await ev("document.querySelector('#visit-duration').textContent"),'00:00');
  await ev("document.querySelector('#tools').scrollIntoView({behavior:'instant'})");await sleep(200);await shot('toolbox.png');
  await ev("document.querySelector('#game-demo').click();document.querySelector('#arena').scrollIntoView({behavior:'instant'})");await sleep(400);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1450,deviceScaleFactor:1,mobile:false});await shot('snake.png');
  for(const width of [320,390,768,1440]){
    await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<800});
    for(const section of ['home','visitors','tools','arena','activity']){await ev(`document.querySelector('#${section}').scrollIntoView({behavior:'instant'})`);await sleep(60);assert.equal(await ev("document.documentElement.scrollWidth<=innerWidth"),true,section+' fits '+width+'px');}
    if(width===390){await ev("window.scrollTo({top:0,behavior:'instant'})");await shot('mobile.png');await ev("document.querySelector('#arena').scrollIntoView({behavior:'instant'})");await shot('snake-mobile.png');}
  }
  await ev("window.scrollTo({top:0,behavior:'instant'});window.gifCheck=new Image();gifCheck.style.cssText='position:fixed;top:0;left:0;width:360px;height:162px;z-index:100';document.body.append(gifCheck);gifCheck.src='profile-snake.gif';new Promise((resolve,reject)=>{gifCheck.onload=resolve;gifCheck.onerror=()=>reject(Error('Snake GIF decode failed'))})");
  assert.equal(await ev('gifCheck.naturalWidth'),1200);
  const first=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:360,height:162,scale:1}});await sleep(600);const second=await cdp.send('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:360,height:162,scale:1}});assert.notEqual(first.data,second.data,'Snake preview visibly animates');await ev('gifCheck.remove()');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:"const nativeFetch=window.fetch;window.fetch=(url,options)=>String(url).includes('/api/views')?Promise.resolve(new Response('',{status:404})):nativeFetch(url,options);Storage.prototype.getItem=function(){throw Error('Test storage unavailable')};Storage.prototype.setItem=function(){throw Error('Test storage unavailable')}"});
  await cdp.send('Page.reload');for(let i=0;i<100;i++){if(await ev("document.querySelector('#storage-status')?.textContent.includes('unavailable')"))break;await sleep(100);}
  assert.equal(await ev("document.querySelector('#visit-count').textContent"),'01');assert.equal(await ev("document.querySelectorAll('.tool-card').length"),18);
  for(let i=0;i<50;i++){if(await ev("document.querySelector('#live-view-status').dataset.state==='offline'"))break;await sleep(50);}
  assert.equal(await ev("document.querySelector('#live-view-status').dataset.state"),'offline','static hosting shows an honest unavailable state');
  assert.deepEqual(cdp.errors,[],'no uncaught page errors');
  require('../scripts/readme-preview.cjs').makePreview();
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1200,height:2400,deviceScaleFactor:1,mobile:false});
  await cdp.send('Page.navigate',{url:`http://127.0.0.1:${port}/artifacts/readme-preview.html`});
  for(let i=0;i<100;i++){if(await ev("document.querySelectorAll('.art').length===4&&[...document.querySelectorAll('.art')].every(i=>i.complete&&i.naturalWidth>0)"))break;await sleep(100);}
  assert.equal(await ev("[...document.querySelectorAll('.art')].length===4&&[...document.querySelectorAll('.art')].every(i=>i.naturalWidth>0)"),true,'every README asset renders');
  await shot('readme-preview.png');
  await ev("new Promise((resolve,reject)=>{const i=new Image();i.onload=resolve;i.onerror=()=>reject(Error('Reduced-motion still is broken'));i.src='../profile-snake-still.svg'})");
  assert.deepEqual(cdp.errors,[]);
  console.log('PASS: redesigned desktop/mobile layouts; real-time streamed totals without refresh inflation, visitor persistence, active timer and service fallback; meter sorting, restored toolkit icons, search, inspector and approach tabs; accessible calendar; Snake AI, keyboard, touch, swipe and pause; animated GIF; all README images; blocked-storage fallback.');
};
