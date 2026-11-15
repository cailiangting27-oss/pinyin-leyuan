// 判定逻辑回归测试：node test-judge.js
const fs=require('fs');const vm=require('vm');
const ctx={window:{pinyinPro:require('pinyin-pro')},console};ctx.window.window=ctx.window;vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/data.js','utf8')+'\n'+fs.readFileSync('app/content.js','utf8').replace('window.cnNumber','this.cnNumber')+';this.COURSES=COURSES;',ctx);
const src=fs.readFileSync('app/app.js','utf8');
const body=src.slice(src.indexOf('const TONE_MAP'),src.indexOf('// ---------- 声音'));
const J=new Function('P',body+';return {judge};')(ctx.window.pinyinPro);
const all=Object.values(ctx.COURSES).flat().flatMap(s=>s.units).flatMap(u=>u.lessons.flat());
const find=(s,type)=>all.find(i=>i.show===s&&(!type||i.type===type));
const cases=[['b','玻',1],['b','爸',0],['zh','知',1],['zh','资',0],['zhǎo','找',1],['zhǎo','早',0],['bà','爸',1],['bà','八',0],
['ǘ','鱼',1],['ǘ','雨',0],['lǜ','绿',1],['lǜ','路',0],['妈妈','妈妈',1],['妈妈','马马',0],['苹果','平果',1],['xióng','熊',1],['xióng','胸',0],['b','',0],
['床前明月光，疑是地上霜','床前明月光疑是地上霜',1],['床前明月光，疑是地上霜','床前明月光',0],['床前明月光，疑是地上霜','窗前明月光，疑是地上霜',1],
['3 × 7 = ?','三七二十一',1],['3 × 7 = ?','21',1],['3 × 7 = ?','3×7=21',1],['3 × 7 = ?','二十',0],['3 × 7 = ?','二十七',0],
['apple','apple',1],['apple','Apples',1],['apple','happy',0],['I am fine thank you',"I'm fine, thank you.",1],['How are you','how old are you',1],['How are you','hello',0],
['B b','bee',1],['B b','B',1],['B b','D',0],['W w','double you',1]];
let bad=0;
for(const [s,heard,exp] of cases){const it=find(s);if(!it){console.log('缺条目',s);bad++;continue;}
 const got=J.judge([heard],it)?1:0;if(got!==exp){bad++;console.log('错',s,'|',heard,'期望',exp,'实际',got);}}
// 每一题用标准答案都应能通过；数学再用中文读法测
for(const it of all){
 let heard=it.type==='math'?String(it.ans):it.type==='en'?(it.accept?it.accept[0]:it.show):it.word?it.show:it.say;
 if(!J.judge([heard],it)){bad++;console.log('标准答案不过',it.kind,it.show,heard);}
 if(it.type==='math'&&!J.judge([ctx.cnNumber(it.ans)],it)){bad++;console.log('中文答案不过',it.show,ctx.cnNumber(it.ans));}
 if(it.kj&&!J.judge([it.kj],it)){bad++;console.log('口诀不过',it.kj);}
}
const by={};for(const s of Object.entries(ctx.COURSES))for(const sub of s[1])by[s[0]+'/'+sub.name]=sub.units.flatMap(u=>u.lessons.flat()).length;
console.log(JSON.stringify(by));
console.log(bad?`失败 ${bad}`:`全部通过，题目 ${all.length}`);process.exit(bad?1:0);
