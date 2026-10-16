const {test}=require('node:test');const assert=require('node:assert/strict');
const {calendarFromHTML,summarizeCalendar,languageSummary}=require('../scripts/profile-data.cjs');
test('calendar parser reads counts from dated tooltips rather than intensity colors',()=>{
  const start=Date.parse('2025-10-17T00:00:00Z');let html='';
  for(let i=0;i<365;i++){const date=new Date(start+i*86400000).toISOString().slice(0,10),count=i===120?1234:i===364?7:0;html+=`<td data-date="${date}" id="day-${i}" data-level="1"></td><tool-tip for="day-${i}">${count?count.toLocaleString('en')+' contributions':'No contributions'} on a day.</tool-tip>`}
  const days=calendarFromHTML(html,'2026-10-16');assert.equal(days.length,365);assert.equal(days[120].count,1234);assert.equal(days.at(-1).count,7);assert.equal(summarizeCalendar(days,'2026-10-16').total,1241);
  assert.throws(()=>calendarFromHTML(html.replace('for="day-0"','for="missing"'),'2026-10-16'),/tooltip missing/);
});
test('a streak remains active through today when yesterday has contributions',()=>{
  const days=[{date:'2026-10-12',count:1},{date:'2026-10-13',count:3},{date:'2026-10-14',count:0},{date:'2026-10-15',count:2},{date:'2026-10-16',count:0}];
  const s=summarizeCalendar(days,'2026-10-16');assert.equal(s.total,6);assert.equal(s.currentStreak,1);assert.equal(s.longestStreak,2);assert.equal(s.activeDays,3);assert.deepEqual(s.bestDay,{date:'2026-10-13',count:3});assert.equal(s.months.reduce((n,m)=>n+m.count,0),s.total);
});
test('language percentages aggregate bytes, exclude notebook files, and sum to 100%',()=>{
  const languages=languageSummary([{Python:10,JavaScript:20,'Jupyter Notebook':1000},{Python:30,CSS:40}]);assert.equal(languages.find(l=>l.name==='Python').percent,40);assert.equal(languages.find(l=>l.name==='CSS').percent,40);assert.equal(languages.reduce((n,l)=>n+l.percent,0),100);assert.equal(languages.some(l=>l.name==='Jupyter Notebook'),false);assert.deepEqual(languageSummary([]),[]);
});
test('the saved dashboard contains a complete, consistent real-data snapshot',()=>{
  const data=require('../generated/profile-data.json');assert.equal(data.days.length,365);assert.equal(data.stats.total,data.days.reduce((n,d)=>n+d.count,0));assert.equal(data.stats.activeDays,data.days.filter(d=>d.count>0).length);assert.ok(Math.abs(data.languages.reduce((n,l)=>n+l.percent,0)-100)<1e-8);assert.match(data.generatedAt,/Z$/);
});
