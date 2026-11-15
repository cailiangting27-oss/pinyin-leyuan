// 姐姐的语文、数学、英语（一至三年级），全部靠“读出来”过关
(function () {
  // 古诗里的多音字按课本读音校正
  if (window.pinyinPro && window.pinyinPro.customPinyin) window.pinyinPro.customPinyin({ '曲项': 'qū xiàng', '一日还': 'yī rì huán', '朝辞': 'zhāo cí', '见牛羊': 'xiàn niú yáng', '笼盖': 'lǒng gài' });
  const COL = { yw: '#e0457b', sx: '#2f7bf6', yy: '#22a35a', gs: '#9b5de5' };

  // ---------- 语文 ----------
  // 古诗：每首一课，每句（到句号）一关
  const POEMS = {
    1: [
      ['咏鹅', '骆宾王', '鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。'],
      ['静夜思', '李白', '床前明月光，疑是地上霜。举头望明月，低头思故乡。'],
      ['春晓', '孟浩然', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'],
      ['悯农', '李绅', '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。'],
      ['画', '佚名', '远看山有色，近听水无声。春去花还在，人来鸟不惊。'],
      ['风', '李峤', '解落三秋叶，能开二月花。过江千尺浪，入竹万竿斜。'],
      ['小池', '杨万里', '泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。'],
    ],
    2: [
      ['村居', '高鼎', '草长莺飞二月天，拂堤杨柳醉春烟。儿童散学归来早，忙趁东风放纸鸢。'],
      ['咏柳', '贺知章', '碧玉妆成一树高，万条垂下绿丝绦。不知细叶谁裁出，二月春风似剪刀。'],
      ['登鹳雀楼', '王之涣', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'],
      ['望庐山瀑布', '李白', '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。'],
      ['绝句', '杜甫', '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。'],
      ['晓出净慈寺送林子方', '杨万里', '毕竟西湖六月中，风光不与四时同。接天莲叶无穷碧，映日荷花别样红。'],
      ['夜宿山寺', '李白', '危楼高百尺，手可摘星辰。不敢高声语，恐惊天上人。'],
      ['敕勒歌', '北朝民歌', '敕勒川，阴山下。天似穹庐，笼盖四野。天苍苍，野茫茫，风吹草低见牛羊。'],
    ],
    3: [
      ['所见', '袁枚', '牧童骑黄牛，歌声振林樾。意欲捕鸣蝉，忽然闭口立。'],
      ['山行', '杜牧', '远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。'],
      ['赠刘景文', '苏轼', '荷尽已无擎雨盖，菊残犹有傲霜枝。一年好景君须记，最是橙黄橘绿时。'],
      ['夜书所见', '叶绍翁', '萧萧梧叶送寒声，江上秋风动客情。知有儿童挑促织，夜深篱落一灯明。'],
      ['望天门山', '李白', '天门中断楚江开，碧水东流至此回。两岸青山相对出，孤帆一片日边来。'],
      ['饮湖上初晴后雨', '苏轼', '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。'],
      ['望洞庭', '刘禹锡', '湖光秋月两相和，潭面无风镜未磨。遥望洞庭山水翠，白银盘里一青螺。'],
      ['早发白帝城', '李白', '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。'],
      ['清明', '杜牧', '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。'],
      ['元日', '王安石', '爆竹声中一岁除，春风送暖入屠苏。千门万户曈曈日，总把新桃换旧符。'],
      ['九月九日忆山东兄弟', '王维', '独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。'],
    ],
  };
  const WORDS = {
    1: ['春天', '花朵', '小鸟', '白云', '青草', '大海', '雨点', '彩虹', '树叶', '雪花', '太阳', '月亮', '星星', '同学', '老师', '朋友', '学校', '书包', '铅笔', '尺子', '天空', '田野', '小河', '鲜花'],
    2: ['秋天', '邮票', '葫芦', '植物', '知识', '脑袋', '雷雨', '清澈', '温暖', '欢迎', '美丽', '勇敢', '聪明', '快乐', '安静', '认真', '整齐', '奇怪', '茂盛', '闪烁', '飘落', '碧绿', '雪白', '火红', '金黄', '明亮', '仔细', '舒服', '已经', '突然'],
    3: ['春暖花开', '鸟语花香', '五颜六色', '万紫千红', '一心一意', '自言自语', '兴高采烈', '争先恐后', '四面八方', '千言万语', '井井有条', '山清水秀', '欣赏', '鲜艳', '粗壮', '凉爽', '丰收', '灿烂', '辽阔', '繁华', '慌张', '寂静', '湿润', '演奏'],
  };

  function poemUnit(grade) {
    return {
      title: `${'一二三'[grade - 1]}年级 · 古诗`, color: COL.gs,
      lessons: POEMS[grade].map(([title, author, text]) => {
        const lines = text.split('。').filter(Boolean);
        return lines.map((line, i) => ({
          type: 'poem', kind: '古诗', title, author, lines, idx: i, show: line, say: line, emoji: '',
        }));
      }),
    };
  }
  function wordUnit(grade, size) {
    const items = WORDS[grade].map(w => ({ show: w, say: w, ok: null, emoji: '', kind: grade === 3 && w.length === 4 ? '成语' : '词语', word: true }));
    return unit(`${'一二三'[grade - 1]}年级 · 词语`, COL.yw, items, size);
  }

  // ---------- 数学 ----------
  // 固定随机种子，保证每次打开题目一样
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const CN = '零一二三四五六七八九';
  function cn(n) { // 0~9999 的中文读法
    if (n < 10) return CN[n];
    if (n < 20) return '十' + (n % 10 ? CN[n % 10] : '');
    const parts = [[1000, '千'], [100, '百'], [10, '十']];
    let s = '', zero = false, started = false;
    for (const [v, u] of parts) {
      const d = Math.floor(n / v) % 10;
      if (d) { if (zero) s += '零'; s += CN[d] + u; zero = false; started = true; }
      else if (started) zero = true;
    }
    if (n % 10) { if (zero) s += '零'; s += CN[n % 10]; }
    return s;
  }
  const OPS = { '+': '加', '-': '减', '×': '乘', '÷': '除以' };
  function q(a, op, b, ans) { return { type: 'math', kind: '口算', show: `${a} ${op} ${b} = ?`, ans, say: `${a}${OPS[op]}${b}等于几`, emoji: '' }; }
  function gen(seed, n, make) {
    const r = rng(seed), out = [], seen = new Set();
    let guard = 0;
    while (out.length < n && guard++ < 2000) { const x = make(r); if (x && !seen.has(x.show)) { seen.add(x.show); out.push(x); } }
    return out;
  }
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));

  function kouJue() { // 乘法口诀，按“一”到“九”分课
    const lessons = [];
    for (let b = 1; b <= 9; b++) {
      const ls = [];
      for (let a = 1; a <= b; a++) {
        const p = a * b;
        const tail = p < 10 ? '得' + CN[p] : (p === 10 ? '一十' : cn(p));
        const kj = CN[a] + CN[b] + tail;
        ls.push({ type: 'math', kind: '乘法口诀', show: `${a} × ${b} = ?`, ans: p, kj, say: kj, hint: '可以背口诀：' + kj, emoji: '' });
      }
      lessons.push(ls);
    }
    return { title: '二年级 · 乘法口诀', color: COL.sx, lessons };
  }

  const MATH = [
    unit('一年级 · 10 以内加减', COL.sx, gen(11, 12, r => { const a = ri(r, 0, 10), b = ri(r, 0, 10); return r() < .5 ? (a + b <= 10 ? q(a, '+', b, a + b) : null) : (a >= b ? q(a, '-', b, a - b) : null); }), 6),
    unit('一年级 · 20 以内进位加法', COL.sx, gen(12, 12, r => { const a = ri(r, 2, 9), b = ri(r, 2, 9); return a + b > 10 ? q(a, '+', b, a + b) : null; }), 6),
    unit('一年级 · 20 以内退位减法', COL.sx, gen(13, 12, r => { const a = ri(r, 11, 18), b = ri(r, 2, 9); return a - b < 10 && a - b > 0 ? q(a, '-', b, a - b) : null; }), 6),
    unit('一年级 · 100 以内整十加减', COL.sx, gen(14, 12, r => { const a = ri(r, 1, 9) * 10, b = ri(r, 1, 9) * 10; return r() < .5 ? (a + b <= 100 ? q(a, '+', b, a + b) : null) : (a > b ? q(a, '-', b, a - b) : null); }), 6),
    unit('二年级 · 100 以内加减法', COL.sx, gen(21, 18, r => { const a = ri(r, 11, 89), b = ri(r, 5, 49); return r() < .5 ? (a + b < 100 ? q(a, '+', b, a + b) : null) : (a > b ? q(a, '-', b, a - b) : null); }), 6),
    kouJue(),
    unit('二年级 · 表内乘法', COL.sx, gen(22, 18, r => { const a = ri(r, 2, 9), b = ri(r, 2, 9); return q(a, '×', b, a * b); }), 6),
    unit('二年级 · 表内除法', COL.sx, gen(23, 18, r => { const a = ri(r, 2, 9), b = ri(r, 2, 9); return q(a * b, '÷', b, a); }), 6),
    unit('三年级 · 几百几十加减', COL.sx, gen(31, 12, r => { const a = ri(r, 11, 69) * 10, b = ri(r, 11, 39) * 10; return r() < .5 ? q(a, '+', b, a + b) : (a > b ? q(a, '-', b, a - b) : null); }), 6),
    unit('三年级 · 两位数乘一位数', COL.sx, gen(32, 12, r => { const a = ri(r, 11, 49), b = ri(r, 2, 9); return q(a, '×', b, a * b); }), 6),
    unit('三年级 · 两位数除以一位数', COL.sx, gen(33, 12, r => { const b = ri(r, 2, 9), c = ri(r, 11, 30); return b * c < 100 ? q(b * c, '÷', b, c) : null; }), 6),
    unit('三年级 · 整十整百乘除', COL.sx, gen(34, 12, r => { const a = ri(r, 2, 9) * (r() < .5 ? 10 : 100), b = ri(r, 2, 9); return r() < .5 ? q(a, '×', b, a * b) : q(a * b, '÷', b, a); }), 6),
  ];

  // ---------- 英语 ----------
  const LETTERS = {
    A: ['a', 'ay', 'hey', 'eh'], B: ['b', 'bee', 'be'], C: ['c', 'see', 'sea'], D: ['d', 'dee'], E: ['e'], F: ['f', 'eff'], G: ['g', 'gee'],
    H: ['h', 'aitch', 'age', 'each'], I: ['i', 'eye', 'aye'], J: ['j', 'jay'], K: ['k', 'kay', 'okay', 'ok'], L: ['l', 'el', 'elle', 'ell'],
    M: ['m', 'em'], N: ['n', 'en'], O: ['o', 'oh', 'owe'], P: ['p', 'pee', 'pea'], Q: ['q', 'queue', 'cue'], R: ['r', 'are', 'our'],
    S: ['s', 'ess'], T: ['t', 'tea', 'tee'], U: ['u', 'you'], V: ['v', 'vee'], W: ['w', 'double u', 'double you'], X: ['x', 'ex'],
    Y: ['y', 'why'], Z: ['z', 'zee', 'zed'],
  };
  const en = (s, zh, emoji) => ({ type: 'en', kind: s.includes(' ') ? '英语句子' : '英语单词', show: s, say: s, zh, emoji: emoji || '' });
  const EN = [
    unit('一年级 · 字母', COL.yy, Object.keys(LETTERS).map(L => ({ type: 'en', kind: '英语字母', show: L + ' ' + L.toLowerCase(), say: L, accept: LETTERS[L], zh: '', emoji: '' })), 6),
    unit('一年级 · 数字', COL.yy, [['one', '一', '1️⃣'], ['two', '二', '2️⃣'], ['three', '三', '3️⃣'], ['four', '四', '4️⃣'], ['five', '五', '5️⃣'], ['six', '六', '6️⃣'], ['seven', '七', '7️⃣'], ['eight', '八', '8️⃣'], ['nine', '九', '9️⃣'], ['ten', '十', '🔟']].map(a => en(...a)), 5),
    unit('二年级 · 颜色', COL.yy, [['red', '红色', '🔴'], ['blue', '蓝色', '🔵'], ['yellow', '黄色', '🟡'], ['green', '绿色', '🟢'], ['black', '黑色', '⚫'], ['white', '白色', '⚪'], ['orange', '橙色', '🟠'], ['purple', '紫色', '🟣']].map(a => en(...a)), 4),
    unit('二年级 · 动物', COL.yy, [['cat', '猫', '🐱'], ['dog', '狗', '🐶'], ['pig', '猪', '🐷'], ['duck', '鸭子', '🦆'], ['bird', '鸟', '🐦'], ['fish', '鱼', '🐟'], ['monkey', '猴子', '🐵'], ['panda', '熊猫', '🐼'], ['tiger', '老虎', '🐯'], ['rabbit', '兔子', '🐰'], ['elephant', '大象', '🐘'], ['bear', '熊', '🐻']].map(a => en(...a)), 6),
    unit('二年级 · 水果食物', COL.yy, [['apple', '苹果', '🍎'], ['banana', '香蕉', '🍌'], ['orange', '橙子', '🍊'], ['pear', '梨', '🍐'], ['grape', '葡萄', '🍇'], ['milk', '牛奶', '🥛'], ['bread', '面包', '🍞'], ['egg', '鸡蛋', '🥚'], ['rice', '米饭', '🍚'], ['water', '水', '💧'], ['cake', '蛋糕', '🍰'], ['juice', '果汁', '🧃']].map(a => en(...a)), 6),
    unit('二年级 · 身体', COL.yy, [['head', '头', '🙂'], ['face', '脸', '😊'], ['eye', '眼睛', '👁️'], ['ear', '耳朵', '👂'], ['nose', '鼻子', '👃'], ['mouth', '嘴巴', '👄'], ['hand', '手', '✋'], ['arm', '胳膊', '💪'], ['leg', '腿', '🦵'], ['foot', '脚', '🦶']].map(a => en(...a)), 5),
    unit('三年级 · 家人与学校', COL.yy, [['father', '爸爸', '👨'], ['mother', '妈妈', '👩'], ['sister', '姐妹', '👧'], ['brother', '兄弟', '👦'], ['grandpa', '爷爷', '👴'], ['grandma', '奶奶', '👵'], ['teacher', '老师', '👩‍🏫'], ['student', '学生', '🧒'], ['book', '书', '📕'], ['pen', '钢笔', '🖊️'], ['pencil', '铅笔', '✏️'], ['ruler', '尺子', '📏'], ['bag', '书包', '🎒'], ['desk', '课桌', '🪑']].map(a => en(...a)), 7),
    unit('三年级 · 日常句子', COL.yy, [
      ['Hello', '你好', '👋'], ['Good morning', '早上好', '🌅'], ['Good afternoon', '下午好', '🌤️'], ['Goodbye', '再见', '👋'],
      ['Thank you', '谢谢', '🙏'], ['How are you', '你好吗', '🙂'], ['I am fine thank you', '我很好，谢谢', '😊'],
      ['What is your name', '你叫什么名字', '❓'], ['My name is Lily', '我叫莉莉', '🙋‍♀️'], ['Nice to meet you', '很高兴认识你', '🤝'],
      ['How old are you', '你几岁了', '🎂'], ['I am eight years old', '我八岁了', '8️⃣'], ['What color is it', '它是什么颜色', '🎨'],
      ['It is red', '它是红色的', '🔴'], ['I like apples', '我喜欢苹果', '🍎'], ['Let us go to school', '我们去上学吧', '🏫'],
    ].map(a => en(...a)), 4),
  ];

  const YW = [poemUnit(1), wordUnit(1, 6), poemUnit(2), wordUnit(2, 6), poemUnit(3), wordUnit(3, 6)];

  COURSES.big.push(
    { id: 'yuwen', name: '语文', icon: '📖', units: YW },
    { id: 'math', name: '数学', icon: '🔢', units: MATH },
    { id: 'english', name: '英语', icon: '🔠', units: EN },
  );
  window.cnNumber = cn;
})();
