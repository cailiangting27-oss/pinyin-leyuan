// 课程数据：三个孩子各自一套
// 单个条目写法："拼音 读音字 表情"，例如 "bā 八 8️⃣"
// ok 是“算读对”的拼音（数字声调），带 * 表示任意声调都算

// ---------- 基础素材 ----------
const SHENGMU = [
  // [显示, 呼读音字, 认可读音, 表情, 小提示, 标签]
  ['b', '玻', ['bo*'], '📻', '像收音机 bō bō bō', ''],
  ['p', '坡', ['po*'], '⛰️', '小坡 pō pō pō', ''],
  ['m', '摸', ['mo*'], '🚪', '两个门洞 mō mō mō', ''],
  ['f', '佛', ['fo*'], '🦯', '一根拐杖 fó fó fó', ''],
  ['d', '得', ['de*'], '🥁', '马蹄声 dē dē dē', ''],
  ['t', '特', ['te*'], '☂️', '一把伞 tē tē tē', ''],
  ['n', '讷', ['ne*'], '🚪', '一个门洞 nē nē nē', ''],
  ['l', '勒', ['le*'], '🥢', '一根小棍 lē lē lē', ''],
  ['g', '哥', ['ge*'], '🕊️', '鸽子 gē gē gē', ''],
  ['k', '科', ['ke*'], '🐸', '蝌蚪 kē kē kē', ''],
  ['h', '喝', ['he*'], '🪑', '一把椅子 hē hē hē', ''],
  ['j', '鸡', ['ji*'], '🐔', '小鸡 jī jī jī', ''],
  ['q', '七', ['qi*'], '🎈', '气球 qī qī qī', ''],
  ['x', '西', ['xi*'], '🍉', '西瓜 xī xī xī', ''],
  ['zh', '知', ['zhi*'], '🕷️', '翘舌音：舌尖翘起来', '翘舌音'],
  ['ch', '吃', ['chi*'], '🍽️', '翘舌音：舌尖翘起来', '翘舌音'],
  ['sh', '诗', ['shi*'], '🦁', '翘舌音：舌尖翘起来', '翘舌音'],
  ['r', '日', ['ri*'], '☀️', '翘舌音：舌尖翘起来', '翘舌音'],
  ['z', '资', ['zi*'], '✍️', '平舌音：舌尖平平的', '平舌音'],
  ['c', '刺', ['ci*'], '🦔', '平舌音：舌尖平平的', '平舌音'],
  ['s', '丝', ['si*'], '🐛', '平舌音：舌尖平平的', '平舌音'],
  ['y', '衣', ['yi*'], '👕', '衣服 yī yī yī', ''],
  ['w', '乌', ['wu*'], '🐦‍⬛', '乌鸦 wū wū wū', ''],
];

const DAN_YUNMU = [
  ['a', '啊', ['a*'], '😮', '嘴巴张大 ā ā ā'],
  ['o', '喔', ['o*'], '🐓', '公鸡叫 ō ō ō'],
  ['e', '鹅', ['e*'], '🦢', '白鹅 é é é'],
  ['i', '衣', ['yi*'], '👕', '衣服 yī yī yī'],
  ['u', '乌', ['wu*'], '🐦‍⬛', '乌鸦 wū wū wū'],
  ['ü', '鱼', ['yu*'], '🐟', '小鱼吐泡泡 ǖ ǖ ǖ'],
];

// 单韵母四声：显示、读音字、认可读音
const TONES = [
  ['ā', '啊', ['a1']], ['á', '啊', ['a2']], ['ǎ', '啊', ['a3']], ['à', '啊', ['a4']],
  ['ō', '喔', ['o1']], ['ó', '哦', ['o2']], ['ǒ', '嚄', ['o3']], ['ò', '哦', ['o4']],
  ['ē', '婀', ['e1']], ['é', '鹅', ['e2']], ['ě', '恶', ['e3']], ['è', '饿', ['e4']],
  ['ī', '衣', ['yi1']], ['í', '姨', ['yi2']], ['ǐ', '椅', ['yi3']], ['ì', '亿', ['yi4']],
  ['ū', '乌', ['wu1']], ['ú', '无', ['wu2']], ['ǔ', '五', ['wu3']], ['ù', '物', ['wu4']],
  ['ǖ', '迂', ['yu1']], ['ǘ', '鱼', ['yu2']], ['ǚ', '雨', ['yu3']], ['ǜ', '玉', ['yu4']],
];

const FU_YUNMU = [
  ['ai', '哎', ['ai*'], '😲'], ['ei', '诶', ['ei*'], '🙋'], ['ui', '威', ['wei*'], '🦁'],
  ['ao', '凹', ['ao*'], '🥣'], ['ou', '欧', ['ou*'], '🌊'], ['iu', '优', ['you*'], '🏅'],
  ['ie', '耶', ['ye*'], '🥥'], ['üe', '约', ['yue*'], '🌙'],
];

const TESHU_YUNMU = [['er', '儿', ['er*'], '👂', '特殊韵母：只能自己当音节']];

const QIAN_BI = [
  ['an', '安', ['an*'], '🏠'], ['en', '恩', ['en*'], '🙏'], ['in', '音', ['yin*'], '🎵'],
  ['un', '温', ['wen*'], '🌡️'], ['ün', '晕', ['yun*'], '☁️'],
];
const HOU_BI = [
  ['ang', '昂', ['ang*'], '🦒'], ['eng', '鞥', ['eng*', 'en*'], '💡'], ['ing', '英', ['ying*'], '🦅'],
  ['ong', '翁', ['weng*', 'ong*'], '🔔'],
];

const ZHENGTI = [
  ['zhi', '知', ['zhi1'], '🕷️', '翘舌音'], ['chi', '吃', ['chi1'], '🍽️', '翘舌音'],
  ['shi', '诗', ['shi1'], '📜', '翘舌音'], ['ri', '日', ['ri4'], '☀️', '翘舌音'],
  ['zi', '资', ['zi1'], '✍️', '平舌音'], ['ci', '刺', ['ci4'], '🦔', '平舌音'],
  ['si', '丝', ['si1'], '🐛', '平舌音'], ['yi', '衣', ['yi1'], '👕', ''],
  ['wu', '乌', ['wu1'], '🐦‍⬛', ''], ['yu', '鱼', ['yu2'], '🐟', ''],
  ['ye', '椰', ['ye1'], '🥥', ''], ['yue', '月', ['yue4'], '🌙', ''],
  ['yuan', '圆', ['yuan2'], '⭕', ''], ['yin', '音', ['yin1'], '🎵', ''],
  ['yun', '云', ['yun2'], '☁️', ''], ['ying', '鹰', ['ying1'], '🦅', ''],
];
// 整体认读音节显示时带上声调
const ZHENGTI_SHOW = {zhi:'zhī',chi:'chī',shi:'shī',ri:'rì',zi:'zī',ci:'cì',si:'sī',yi:'yī',wu:'wū',yu:'yú',ye:'yē',yue:'yuè',yuan:'yuán',yin:'yīn',yun:'yún',ying:'yīng'};

const PINGQIAO = [
  'zǎo 早 🌅', 'zhǎo 找 🔍', 'cǎo 草 🌿', 'chǎo 炒 🍳', 'sān 三 3️⃣', 'shān 山 ⛰️',
  'zì 字 🔤', 'zhì 志 🚩', 'cí 词 📖', 'chí 池 🏊', 'sì 四 4️⃣', 'shì 是 ✅',
];

// 两拼音节（声母+韵母）
const LIANGPIN_EASY = [
  'bà 爸 👨', 'mā 妈 👩', 'gē 哥 👦', 'dà 大 🐘', 'pà 怕 😨', 'mǎ 马 🐴',
  'tā 他 🙋', 'ná 拿 🤲', 'lā 拉 🤝', 'mǐ 米 🍚', 'yú 鱼 🐟', 'māo 猫 🐱',
  'gǒu 狗 🐶', 'niú 牛 🐮', 'bái 白 ⚪', 'hǎo 好 👍',
];
const LIANGPIN_MORE = [
  'fā 发 💇', 'kě 渴 🥤', 'hē 喝 🥛', 'jī 鸡 🐔', 'qī 七 7️⃣', 'xī 西 🧭',
  'zhū 猪 🐷', 'chī 吃 🍽️', 'shū 书 📚', 'rè 热 🔥', 'zǐ 紫 🟣', 'cǎo 草 🌿',
  'sān 三 3️⃣', 'wǒ 我 🙋', 'lái 来 👋', 'bǐ 笔 ✏️', 'tù 兔 🐰', 'mén 门 🚪',
  'pí 皮 🍌', 'dēng 灯 💡', 'fēng 风 🌬️', 'hóng 红 🔴', 'lǜ 绿 🟢', 'nǚ 女 👧',
];
// 三拼音节（声母+介母+韵母）
const SANPIN_EASY = [
  'guā 瓜 🍉', 'huā 花 🌸', 'jiā 家 🏠', 'xiā 虾 🦐', 'xiǎo 小 🐣', 'niǎo 鸟 🐦',
  'guǒ 果 🍎', 'huǒ 火 🔥',
];
const SANPIN_MORE = [
  'kuài 快 🏃', 'guāi 乖 😇', 'shuā 刷 🪥', 'chuáng 床 🛏️', 'guāng 光 💡', 'huáng 黄 🟡',
  'shuāng 双 👯', 'jiāng 江 🏞️', 'xiǎng 想 💭', 'liǎng 两 2️⃣', 'xióng 熊 🐻', 'zhuō 桌 🪑',
  'chuán 船 ⛵', 'duō 多 ➕', 'qiáo 桥 🌉', 'tiào 跳 🦘',
];

// 拼字（读汉字/词语）
const ZI_BABY = ['爸爸 👨', '妈妈 👩', '哥哥 👦', '姐姐 👧', '弟弟 👶', '妹妹 👧', '宝宝 🍼', '猫 🐱', '狗 🐶', '鱼 🐟', '大 🐘', '小 🐣'];
const ZI_MID = ['爸爸 👨', '妈妈 👩', '哥哥 👦', '姐姐 👧', '弟弟 👶', '妹妹 👧', '人 🧍', '口 👄', '手 ✋', '日 ☀️', '月 🌙', '水 💧', '火 🔥', '山 ⛰️', '花 🌸', '鸟 🐦', '小猫 🐱', '小狗 🐶', '苹果 🍎', '太阳 ☀️', '月亮 🌙', '熊猫 🐼'];
const ZI_BIG = ['天 🌤️', '地 🌍', '人 🧍', '你 👉', '我 🙋', '他 🙋‍♂️', '上 ⬆️', '下 ⬇️', '大 🐘', '小 🐣', '多 ➕', '少 ➖', '老师 👩‍🏫', '学校 🏫', '书包 🎒', '同学 🧒', '朋友 🤝', '太阳 ☀️', '月亮 🌙', '星星 ⭐', '花朵 🌸', '苹果 🍎', '熊猫 🐼', '你好 👋', '谢谢 🙏', '再见 👋', '上学 🚸', '放学 🏃', '春天 🌱', '秋天 🍂'];

// ---------- 组装工具 ----------
function fromRow(row, kind, extra) {
  const [show, say, ok, emoji, hint, tag] = row;
  return Object.assign({ show, say, ok, emoji: emoji || '', hint: hint || '', tag: tag || '', kind }, extra || {});
}
function fromSyl(str, kind) {
  const [show, say, emoji] = str.split(' ');
  return { show, say, ok: null, emoji: emoji || '', hint: say, kind, syllable: true };
}
function fromZi(str) {
  const [word, emoji] = str.split(' ');
  return { show: word, say: word, ok: null, emoji: emoji || '', kind: '拼字', word: true };
}
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
// 一个单元 = 标题 + 一串条目，按每课 size 个切成小课
function unit(title, color, items, size) {
  return { title, color, lessons: chunk(items, size) };
}

const C = { shengmu: '#2f7bf6', yunmu: '#f08a24', zhengti: '#22a35a', teshu: '#9b5de5', pin: '#e0457b', zi: '#c9a227' };

const sm = (filter) => SHENGMU.filter(filter || (() => true)).map(r => fromRow(r, '声母'));
const dan = () => DAN_YUNMU.map(r => fromRow(r, '单韵母'));
const tones = () => TONES.map(r => ({ show: r[0], say: r[1], ok: r[2], emoji: '', hint: '注意声调', kind: '单韵母·四声', tag: '' }));
const fu = () => FU_YUNMU.map(r => fromRow(r, '复韵母'));
const teshu = () => TESHU_YUNMU.map(r => fromRow(r, '特殊韵母', { tag: '特殊韵母' }));
const qian = () => QIAN_BI.map(r => fromRow(r, '前鼻韵母'));
const hou = () => HOU_BI.map(r => fromRow(r, '后鼻韵母'));
const zt = (list) => ZHENGTI.filter(r => !list || list.includes(r[0])).map(r => ({
  show: ZHENGTI_SHOW[r[0]], say: r[1], ok: r[2], emoji: r[3], hint: '整体认读，不用拼', tag: r[4], kind: '整体认读音节'
}));
const syl = (list, kind) => list.map(s => fromSyl(s, kind));
const zi = (list) => list.map(fromZi);

const isPing = r => ['z', 'c', 's'].includes(r[0]);
const isQiao = r => ['zh', 'ch', 'sh', 'r'].includes(r[0]);

// ---------- 三个孩子的课程 ----------
const COURSES = {
  // 一年级姐姐：全套，按课本顺序，每课 6 个
  big: [
    unit('单韵母', C.yunmu, dan(), 6),
    unit('单韵母四声', C.yunmu, tones(), 8),
    unit('声母', C.shengmu, sm(r => !isPing(r) && !isQiao(r)), 6),
    unit('平舌音 z c s', C.shengmu, sm(isPing), 3),
    unit('翘舌音 zh ch sh r', C.shengmu, sm(isQiao), 4),
    unit('复韵母', C.yunmu, fu(), 4),
    unit('特殊韵母 er', C.teshu, teshu(), 1),
    unit('前鼻韵母', C.yunmu, qian(), 5),
    unit('后鼻韵母', C.yunmu, hou(), 4),
    unit('整体认读音节', C.zhengti, zt(), 6),
    unit('平翘舌对比', C.shengmu, syl(PINGQIAO, '平翘舌对比'), 6),
    unit('两拼音节', C.pin, syl(LIANGPIN_EASY.concat(LIANGPIN_MORE), '两拼音节'), 6),
    unit('三拼音节', C.pin, syl(SANPIN_EASY.concat(SANPIN_MORE), '三拼音节'), 6),
    unit('拼字', C.zi, zi(ZI_BIG), 6),
  ],
  // 幼儿园妹妹：内容全，但每课 3~4 个，三拼和拼字用简单的
  mid: [
    unit('单韵母', C.yunmu, dan(), 3),
    unit('单韵母四声', C.yunmu, tones(), 4),
    unit('声母', C.shengmu, sm(r => !isPing(r) && !isQiao(r)), 4),
    unit('平舌音 z c s', C.shengmu, sm(isPing), 3),
    unit('翘舌音 zh ch sh r', C.shengmu, sm(isQiao), 4),
    unit('复韵母', C.yunmu, fu(), 4),
    unit('特殊韵母 er', C.teshu, teshu(), 1),
    unit('前鼻韵母', C.yunmu, qian(), 3),
    unit('后鼻韵母', C.yunmu, hou(), 4),
    unit('整体认读音节', C.zhengti, zt(), 4),
    unit('两拼音节', C.pin, syl(LIANGPIN_EASY, '两拼音节'), 4),
    unit('三拼音节', C.pin, syl(SANPIN_EASY, '三拼音节'), 4),
    unit('拼字', C.zi, zi(ZI_MID), 4),
  ],
  // 两岁弟弟：启蒙版，每课 2~3 个，先单韵母和常见声母，拼字只读家人和小动物
  baby: [
    unit('单韵母', C.yunmu, dan(), 2),
    unit('单韵母四声 a', C.yunmu, tones().slice(0, 4), 2),
    unit('声母 b p m f', C.shengmu, sm(r => ['b', 'p', 'm', 'f'].includes(r[0])), 2),
    unit('声母 d t n l', C.shengmu, sm(r => ['d', 't', 'n', 'l'].includes(r[0])), 2),
    unit('声母 g k h', C.shengmu, sm(r => ['g', 'k', 'h'].includes(r[0])), 3),
    unit('两拼音节', C.pin, syl(LIANGPIN_EASY.slice(0, 12), '两拼音节'), 3),
    unit('拼字', C.zi, zi(ZI_BABY), 2),
  ],
};

const KIDS_DEFAULT = [
  { id: 'big', name: '姐姐', desc: '一年级', avatar: '🦄', course: 'big', autoPlay: false },
  { id: 'mid', name: '妹妹', desc: '幼儿园', avatar: '🐰', course: 'mid', autoPlay: true },
  { id: 'baby', name: '弟弟', desc: '2 岁', avatar: '🐻', course: 'baby', autoPlay: true },
];

const INITIALS = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'];
