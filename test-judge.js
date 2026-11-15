// 判定逻辑回归测试：node test-judge.js
const fs=require('fs');global.window={pinyinPro:require('pinyin-pro')};
const vm=require('vm');const ctx={window,console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('app/data.js','utf8')+';this.COURSES=COURSES;',ctx);
// 取出 app.js 中的判定函数
const src=fs.readFileSync('app/app.js','utf8');
const body=src.slice(src.indexOf('const TONE_MAP'),src.indexOf('// ---------- 声音'));
const judge=new Function('P',body+';return {judge,toNum};')(window.pinyinPro);
const all=Object.values(ctx.COURSES).flat().flatMap(u=>u.lessons.flat());
const find=s=>all.find(i=>i.show===s);
const cases=[['b','玻',1],['b','波',1],['b','爸',0],['zh','知',1],['zh','资',0],['z','资',1],['zhǎo','找',1],['zhǎo','早',0],['zhǎo','照',0],
['bà','爸',1],['bà','八',0],['ǘ','鱼',1],['ǘ','雨',0],['lǜ','绿',1],['lǜ','路',0],['妈妈','妈妈',1],['妈妈','马马',0],['苹果','苹果',1],['苹果','平果',1],['xióng','熊',1],['xióng','胸',0],['er','儿',1],['yuè','月',1],['yuè','约',0],['b','',0]];
let bad=0;for(const [s,heard,exp] of cases){const it=find(s);if(!it){console.log('缺条目',s);bad++;continue;}
const got=judge.judge([heard],it)?1:0;if(got!==exp){bad++;console.log('错',s,heard,'期望',exp,'实际',got);}}
// 每个条目用自己的读音字测一遍应能通过（拼字/音节用 show 或 say）
for(const it of all){const heard=it.word?it.show:it.say;if(!judge.judge([heard],it)){bad++;console.log('自身读音不过',it.kind,it.show,it.say);}}
console.log(bad?`失败 ${bad}`:`全部通过，条目 ${all.length}`);process.exit(bad?1:0);
