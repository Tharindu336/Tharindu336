const {createProfileServer}=require('./profile-server.cjs');
const port=Number(process.argv.find(a=>a.startsWith('--port='))?.split('=')[1]||process.env.PORT)||8000;
const server=createProfileServer();
server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log('Live profile: http://127.0.0.1:'+port+'/'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.stopTracker();server.close(()=>process.exit(0));});
