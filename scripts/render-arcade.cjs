/* Native, looping GIF renderer: no image service, browser, or npm dependencies. */
const font = {
 A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110'],
 '/':['00001','00001','00010','00100','01000','10000','10000'],':':['00000','00100','00100','00000','00100','00100','00000'],'.':['00000','00000','00000','00000','00000','00100','00100'],'-':['00000','00000','00000','11111','00000','00000','00000'],'+':['00000','00100','00100','11111','00100','00100','00000'],'>':['10000','01000','00100','00010','00100','01000','10000']
};
function lzw(pixels, minSize = 4) {
  const clear = 1 << minSize, end = clear + 1, output = [];
  let map = new Map(), next = end + 1, bits = minSize + 1, accumulator = 0, length = 0;
  function emit(code) {
    accumulator |= code << length; length += bits;
    while (length >= 8) { output.push(accumulator & 255); accumulator >>>= 8; length -= 8; }
    // GIF decoders add dictionary entries one code behind the encoder.
    if (next >= (1 << bits) && bits < 12) bits++;
  }
  emit(clear); let prefix = pixels[0];
  for (let i = 1; i < pixels.length; i++) {
    const suffix = pixels[i], key = prefix * 16 + suffix;
    if (map.has(key)) prefix = map.get(key);
    else { emit(prefix); if (next < 4096) map.set(key, next++); else { emit(clear); map = new Map(); next = end + 1; bits = minSize + 1; } prefix = suffix; }
  }
  emit(prefix); emit(end); if (length) output.push(accumulator & 255);
  return Buffer.from(output);
}
function encodeGIF(frames, width, height, delay = 10) {
  const chunks = [], word = n => Buffer.from([n & 255, n >> 8 & 255]);
  chunks.push(Buffer.from('GIF89a'), word(width), word(height), Buffer.from([0xF3, 0, 0]));
  const palette = ['1b1c19','252620','ffe34b','f7f6ef','a4ddd6','8b7e36','b5d79a','b6b7af','c8b33e','45473c','e8884f','ffffff','e8884f','b5d79a','30312b','b6a6ff'];
  chunks.push(Buffer.from(palette.flatMap(hex => hex.match(/../g).map(n => parseInt(n,16)))));
  chunks.push(Buffer.from([0x21,0xFF,0x0B]), Buffer.from('NETSCAPE2.0'), Buffer.from([3,1,0,0,0]));
  for (const frame of frames) {
    chunks.push(Buffer.from([0x21,0xF9,4,4]), word(delay), Buffer.from([0,0,0x2C]), word(0), word(0), word(width), word(height), Buffer.from([0,4]));
    const data = lzw(frame);
    for (let i = 0; i < data.length; i += 255) { const block = data.subarray(i, i + 255); chunks.push(Buffer.from([block.length]), block); }
    chunks.push(Buffer.from([0]));
  }
  chunks.push(Buffer.from([0x3B])); return Buffer.concat(chunks);
}
function makeSnakeGIF() {
  const {Snake,DIR}=require('../snake-engine.js');let seed=336;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const game=new Snake({random}),width=1200,height=540,frames=[],cell=22,ox=730,oy=60;
  for(let i=0;i<40;i++)game.step(true);
  for(let f=0;f<128;f++){
    if(game.over)game.reset();game.step(true);
    const pixels=new Uint8Array(width*height);
    const rect=(x,y,w,h,color)=>{x=Math.round(x);y=Math.round(y);w=Math.ceil(w);h=Math.ceil(h);for(let py=Math.max(0,y);py<Math.min(height,y+h);py++)pixels.fill(color,py*width+Math.max(0,x),py*width+Math.min(width,x+w));};
    const label=(value,x,y,color=7,scale=1)=>{for(const letter of String(value).toUpperCase()){const glyph=font[letter];if(glyph)glyph.forEach((row,py)=>[...row].forEach((bit,px)=>{if(bit==='1')rect(x+px*scale,y+py*scale,scale,scale,color);}));x+=6*scale;}};
    label('02 / THE LONG GAME',35,32,2);label('SNAKE.',30,87,3,9);label('ONE MORE TURN.',35,177,7,3);
    label('SCORE',35,251,7);label(String(game.score).padStart(5,'0'),35,277,2,4);label('LEVEL '+String(game.level).padStart(2,'0'),282,252,3,2);label('COMBO X'+game.combo,282,287,7,2);
    rect(35,338,570,1,9);label('LINKED PORTALS / POWER-UPS / COMBOS',35,363,7);label('AUTOPILOT + PLAYER MODE + SWIPE',35,386,7);
    label('FOLLOW THE SIGNAL.',35,437,2,2);label('FIND THE RHYTHM.',35,464,7,2);
    label('THARINDU / ALWAYS BUILDING.',35,510,7);label('CONTINUOUS SIMULATION / AUTOPILOT',730,523,7);
    rect(ox-12,oy-12,464,464,1);for(let i=1;i<20;i++){rect(ox+i*cell,oy,1,440,14);rect(ox,oy+i*cell,440,1,14);}
    for(const p of game.obstacles){rect(ox+p.x*cell+3,oy+p.y*cell+3,16,16,9);rect(ox+p.x*cell+7,oy+p.y*cell+7,8,8,5);}
    for(const [i,p] of game.portals.entries()){const x=ox+(p.x+.5)*cell,y=oy+(p.y+.5)*cell;for(let a=0;a<12;a++){const angle=a*Math.PI/6+f*.14*(i?1:-1);rect(x+Math.cos(angle)*8,y+Math.sin(angle)*8,2,2,15);}}
    if(game.food){const p=game.food;rect(ox+p.x*cell+7,oy+p.y*cell+7,8,8,4);rect(ox+p.x*cell+10,oy+p.y*cell+10,2,2,11);}
    if(game.power){const p=game.power;rect(ox+p.x*cell+5,oy+p.y*cell+5,12,12,p.type==='shield'?2:6);}
    game.body.forEach((p,i)=>rect(ox+p.x*cell+2,oy+p.y*cell+2,18,18,i===0?3:i<6?2:i<12?8:5));
    const d=DIR[game.direction],head=game.body[0];for(const sign of [-1,1])rect(ox+(head.x+.5+d.x*.22+d.y*.2*sign)*cell,oy+(head.y+.5+d.y*.22+d.x*.2*sign)*cell,3,3,0);
    frames.push(pixels);
  }
  return encodeGIF(frames,width,height,12);
}
module.exports={makeSnakeGIF,encodeGIF,lzw};
