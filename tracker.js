(() => {
  const $=id=>document.getElementById(id);let snapshot=null,range=7,stream=null,stopped=false,connecting=false,retryTimer=null;
  const viewId=globalThis.crypto?.randomUUID?.()||'view-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);let recorded=false;
  const endpoint=new URL('./api/views',location.href.split('#')[0]);
  function chart(){if(!snapshot)return;const days=snapshot.days.slice(-range),max=Math.max(1,...days.map(d=>d.count));$('live-view-bars').replaceChildren(...days.map(d=>{const b=document.createElement('button'),fill=document.createElement('i');b.type='button';b.setAttribute('aria-label',d.date+': '+d.count+' page views');fill.style.height=Math.max(3,d.count/max*100)+'%';b.append(fill);b.onclick=()=>{$('live-view-insight').textContent=d.date+' / '+d.count+' page views';};return b;}));$('live-view-insight').textContent=days.reduce((n,d)=>n+d.count,0)+' views across '+days.length+' days';}
  function render(data){snapshot=data;$('live-view-total').textContent=data.total.toLocaleString('en');$('live-view-today').textContent=data.today.toLocaleString('en');$('live-view-connected').textContent=data.connected.toLocaleString('en');$('live-view-status').textContent='Live connection';$('live-view-status').dataset.state='live';$('live-view-updated').textContent='Latest view '+(data.updatedAt?new Date(data.updatedAt).toLocaleTimeString('en-GB',{timeZone:'Asia/Colombo',hour12:false})+' LKT':'not recorded yet');chart();}
  function unavailable(){if(stopped)return;$('live-view-status').textContent=snapshot?'Reconnecting…':'Live service unavailable';$('live-view-status').dataset.state='offline';if(!snapshot)$('live-view-insight').textContent='Live tracking needs the profile server. The GitHub badge and local notebook are separate.';}
  async function connect(){if(connecting||stopped)return;connecting=true;clearTimeout(retryTimer);
    try{const res=await fetch(endpoint,{method:recorded?'GET':'POST',headers:recorded?{}:{'Content-Type':'application/json'},body:recorded?undefined:JSON.stringify({viewId}),cache:'no-store',signal:AbortSignal.timeout(5000)});if(!res.ok)throw Error();const data=await res.json();if(!Number.isSafeInteger(data.total)||!Array.isArray(data.days))throw Error();recorded=true;render(data);stream?.close();stream=new EventSource(endpoint.href+'/stream');stream.addEventListener('views',e=>{try{const value=JSON.parse(e.data);if(Number.isSafeInteger(value.total)&&Array.isArray(value.days))render(value);}catch{unavailable();}});stream.onerror=unavailable;
    }catch{unavailable();retryTimer=setTimeout(connect,15000);}finally{connecting=false;}
  }
  for(const b of document.querySelectorAll('[data-view-range]'))b.onclick=()=>{range=Number(b.dataset.viewRange);for(const button of document.querySelectorAll('[data-view-range]'))button.setAttribute('aria-pressed',String(button===b));chart();};
  $('retry-live-views').onclick=connect;
  addEventListener('pagehide',()=>{stopped=true;clearTimeout(retryTimer);stream?.close();});addEventListener('pageshow',e=>{if(e.persisted){stopped=false;connect();}});
  connect();
})();
