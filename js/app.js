'use strict';

const D = window.CLASS_DATA;
if (!D) {
  document.body.innerHTML = '<div class="p-5 text-center"><h2>Ошибка</h2><p>Файл data.js не подключён.</p></div>';
  throw new Error('CLASS_DATA not found');
}

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

let uid = 0;
let likes = {};
try { likes = JSON.parse(localStorage.getItem('1b_likes_v2') || '{}'); } catch { likes = {}; }

let currentPhotoList = [];
let currentVideoList = [];
let kmMediaList = [];
let lbList = [], lbIndex = 0;
let schedDay = (() => { const d = new Date().getDay(); return d >= 1 && d <= 5 ? d - 1 : 0; })();

const bs = window.bootstrap;
const lbModal = new bs.Modal('#lightboxModal');
const kidModal = new bs.Modal('#kidModal');

/* ─────────── Utils ─────────── */
function rng(seed) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
function plural(n, a, b, c) {
  const m = n % 100;
  if (m >= 11 && m <= 14) return c;
  return ({ 1:a, 2:b, 3:b, 4:b }[n % 10]) || c;
}
function bdayStr(b) { const [m,d] = b.split('-').map(Number); return `${d} ${MONTHS_GEN[m-1]}`; }
function translit(s) {
  const map = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return String(s).toLowerCase().split('').map(c => map[c] ?? c).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function extFromUrl(url, fb = 'jpg') {
  const m = String(url || '').split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : fb;
}
function fileName(prefix, item) { return `1b-${prefix}-${item.id}-${translit(item.title || 'media')}`; }
function byId(arr, id) { return arr.find(x => x.id === Number(id)); }
function likeKey(kind, id) { return `${kind}:${id}`; }
function isLiked(kind, id) { return !!likes[likeKey(kind, id)]; }
function baseLikes(kind, id) {
  const src = { photo: D.photos, video: D.videos, craft: D.crafts }[kind];
  return (src?.find(x => x.id === Number(id))?.likes) || 0;
}
function likeCount(kind, id) { return baseLikes(kind, id) + (isLiked(kind, id) ? 1 : 0); }
function likeBtn(kind, item, compact = false) {
  const liked = isLiked(kind, item.id);
  return `<button class="${compact ? 'icon-btn' : 'btn btn-sm btn-paper'} ${liked ? 'liked' : ''}" data-like="${kind}:${item.id}" aria-label="Нравится">
    <i class="bi ${liked ? 'bi-heart-fill' : 'bi-heart'}"></i>${compact ? '' : ` <span class="like-n">${likeCount(kind,item.id)}</span>`}
  </button>`;
}

/* ─────────── Toast ─────────── */
function toast(msg, type = 'info', delay = 3200) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="d-flex align-items-center gap-2 px-3 py-2"><span>${esc(msg)}</span><button class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Закрыть"></button></div>`;
  $('#toastBox').appendChild(el);
  const t = new bs.Toast(el, { delay });
  el.addEventListener('hidden.bs.toast', () => el.remove());
  t.show();
}

/* ─────────── SVG Assets ─────────── */
function avatarSVG(kid, size = 120) {
  const r = rng(kid.id * 77 + 5);
  const skins = ['#FFDFC4','#F2C9A0','#E7B48C'], hairs = ['#4A342E','#6B4F2A','#B5651D','#2F2F2F','#8A5A2B','#D9A05B'];
  const shirts = ['#E63946','#274690','#2A9D8F','#FFB703','#4CC9F0','#F4845F'], bgs = ['#FDEBD3','#E3F2EC','#E4E9F7','#FBE3E6','#FFF3C9'];
  const skin = skins[Math.floor(r()*3)], hair = hairs[Math.floor(r()*6)], shirt = shirts[Math.floor(r()*6)], bg = bgs[kid.id%5];
  const ht = Math.floor(r()*4), glasses = r() > .72;
  const cap = `<path d='M33 58 Q29 26 60 26 Q91 26 87 58 Q83 40 60 40 Q37 40 33 58 Z' fill='${hair}'/>`;
  let behind = '', front = cap;
  if (ht === 1) front += `<circle cx='30' cy='62' r='9' fill='${hair}'/><circle cx='90' cy='62' r='9' fill='${hair}'/><circle cx='30' cy='55' r='3' fill='#E63946'/><circle cx='90' cy='55' r='3' fill='#E63946'/>`;
  if (ht === 2) { let c=''; for(let i=0;i<5;i++){const a=Math.PI*(.15+.175*i);c+=`<circle cx='${(60-30*Math.cos(a)).toFixed(1)}' cy='${(56-30*Math.sin(a)).toFixed(1)}' r='8' fill='${hair}'/>`;} front=c+cap; }
  if (ht === 3) { behind=`<path d='M30 62 Q26 22 60 22 Q94 22 90 62 L88 84 Q80 90 74 84 L74 58 L46 58 L46 84 Q40 90 32 84 Z' fill='${hair}'/>`; front=`<path d='M34 52 Q36 32 60 32 Q84 32 86 52 Q78 42 60 42 Q42 42 34 52 Z' fill='${hair}'/>`; }
  const eyes = glasses
    ? `<circle cx='50' cy='58' r='7' fill='none' stroke='#22304A' stroke-width='2'/><circle cx='70' cy='58' r='7' fill='none' stroke='#22304A' stroke-width='2'/><path d='M57 58 h6' stroke='#22304A' stroke-width='2'/><circle cx='50' cy='58' r='2.4' fill='#22304A'/><circle cx='70' cy='58' r='2.4' fill='#22304A'/>`
    : `<circle cx='50' cy='58' r='2.6' fill='#22304A'/><circle cx='70' cy='58' r='2.6' fill='#22304A'/>`;
  return `<svg viewBox='0 0 120 120' width='${size}' height='${size}' xmlns='http://www.w3.org/2000/svg'><circle cx='60' cy='60' r='58' fill='${bg}'/>${behind}<path d='M26 120 Q30 90 60 90 Q90 90 94 120 Z' fill='${shirt}'/><circle cx='60' cy='58' r='27' fill='${skin}'/>${front}${eyes}<circle cx='45' cy='66' r='3.4' fill='#F4A7A7' opacity='.65'/><circle cx='75' cy='66' r='3.4' fill='#F4A7A7' opacity='.65'/><path d='M53 69 Q60 75 67 69' fill='none' stroke='#22304A' stroke-width='2.4' stroke-linecap='round'/></svg>`;
}

function sceneSVG(type, seed = 1) {
  const r = rng(seed*31+7), gid = 'g'+(++uid);
  const C = { red:'#E63946',blue:'#274690',green:'#2A9D8F',amber:'#FFB703',sky:'#4CC9F0',ink:'#22304A',pink:'#F4845F',brown:'#8B5E34' };
  const wrap = i => `<svg viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid slice'>${i}</svg>`;
  const sky = (a,b) => `<defs><linearGradient id='${gid}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='600' fill='url(#${gid})'/>`;
  const cloud = (x,y,s) => `<g fill='#fff' opacity='.9'><ellipse cx='${x}' cy='${y}' rx='${46*s}' ry='${18*s}'/><ellipse cx='${x+32*s}' cy='${y-12*s}' rx='${30*s}' ry='${15*s}'/><ellipse cx='${x-34*s}' cy='${y-7*s}' rx='${26*s}' ry='${13*s}'/></g>`;
  const sun = (x,y,rad) => { let o=''; for(let i=0;i<8;i++){const a=i*Math.PI/4;o+=`<line x1='${(x+Math.cos(a)*(rad+8)).toFixed(1)}' y1='${(y+Math.sin(a)*(rad+8)).toFixed(1)}' x2='${(x+Math.cos(a)*(rad+20)).toFixed(1)}' y2='${(y+Math.sin(a)*(rad+20)).toFixed(1)}' stroke='${C.amber}' stroke-width='6' stroke-linecap='round'/>`;} return o+`<circle cx='${x}' cy='${y}' r='${rad}' fill='${C.amber}'/>`; };
  const kid = (x,y,s,shirt) => { const skin=['#FFDFC4','#F2C9A0','#E7B48C'][Math.floor(r()*3)]; return `<g><path d='M${x-13*s} ${y-36*s} Q${x} ${y-44*s} ${x+13*s} ${y-36*s} L${x+11*s} ${y} L${x-11*s} ${y} Z' fill='${shirt}'/><circle cx='${x}' cy='${y-50*s}' r='${13*s}' fill='${skin}'/><path d='M${x-13*s} ${y-52*s} A${13*s} ${13*s} 0 0 1 ${x+13*s} ${y-52*s} Z' fill='#4A342E'/><path d='M${x-5*s} ${y} L${x-7*s} ${y+20*s} M${x+5*s} ${y} L${x+7*s} ${y+20*s}' stroke='${C.ink}' stroke-width='${4.5*s}' stroke-linecap='round' fill='none'/></g>`; };
  const conf = n => { let o=''; const cols=[C.red,C.blue,C.green,C.amber,C.sky,C.pink]; for(let i=0;i<n;i++){const x=(r()*780).toFixed(0),y=(r()*560).toFixed(0);o+=`<rect x='${x}' y='${y}' width='9' height='6' rx='2' fill='${cols[i%6]}' opacity='.7' transform='rotate(${(r()*90).toFixed(0)} ${x} ${y})'/>`;} return o; };

  switch(type) {
    case 'classroom': return wrap(`${sky('#FFF3DC','#FFE7C2')}<rect y='440' width='800' height='160' fill='#EAD9B8'/><rect x='150' y='80' width='500' height='250' rx='14' fill='#2A6F5C' stroke='#B08954' stroke-width='14'/><text x='400' y='185' text-anchor='middle' font-family='Caveat,cursive' font-size='72' fill='#fff' opacity='.92'>АБВГД</text><text x='400' y='265' text-anchor='middle' font-family='Caveat,cursive' font-size='46' fill='#fff' opacity='.8'>2 + 2 = 4</text><rect x='680' y='100' width='90' height='140' rx='10' fill='#BFE3F2' stroke='#fff' stroke-width='8'/><line x1='725' y1='100' x2='725' y2='240' stroke='#fff' stroke-width='6'/><line x1='680' y1='170' x2='770' y2='170' stroke='#fff' stroke-width='6'/><circle cx='748' cy='135' r='16' fill='${C.amber}'/><rect x='40' y='110' width='80' height='100' rx='8' fill='#fff' stroke='#E3D9C6' stroke-width='4'/><path d='M80 130 l8 18 20 2 -15 14 4 20 -17 -10 -17 10 4 -20 -15 -14 20 -2 z' fill='${C.amber}'/>${kid(210,470,1.15,C.red)}${kid(400,475,1.15,C.blue)}${kid(590,470,1.15,C.green)}<rect x='140' y='470' width='140' height='16' rx='6' fill='#C98F5A'/><rect x='330' y='475' width='140' height='16' rx='6' fill='#C98F5A'/><rect x='520' y='470' width='140' height='16' rx='6' fill='#C98F5A'/>`);
    case 'playground': return wrap(`${sky('#A8D8F0','#E6F6FD')}${sun(110,100,42)}${cloud(300,90,1)}${cloud(620,140,.8)}<ellipse cx='200' cy='660' rx='400' ry='160' fill='#8FCB9B'/><ellipse cx='640' cy='680' rx='440' ry='180' fill='#6FBF8A'/><path d='M660 60 L702 122 L660 184 L618 122 Z' fill='${C.red}'/><path d='M660 60 L660 184 M618 122 L702 122' stroke='#fff' stroke-width='3'/><circle cx='400' cy='510' r='32' fill='${C.red}'/><path d='M380 495 Q400 480 420 495' stroke='#fff' stroke-width='5' fill='none' opacity='.6'/>${kid(250,490,1.3,C.blue)}${kid(520,480,1.3,C.amber)}${kid(650,510,1.1,C.green)}`);
    case 'museum': { let cols=''; for(let i=0;i<4;i++) cols+=`<rect x='${272+i*72}' y='252' width='26' height='180' fill='#FFFDF8' stroke='#E3D9C6' stroke-width='3'/>`; return wrap(`${sky('#C9E4F2','#F2F8FC')}${cloud(150,90,.9)}${cloud(640,80,1)}${sun(700,150,30)}<rect y='500' width='800' height='100' fill='#E7E3C8'/><rect x='200' y='480' width='400' height='20' fill='#D9CDB8'/><rect x='240' y='220' width='320' height='242' fill='#F3E9D2' stroke='#D9CDB8' stroke-width='4'/><path d='M215 222 L400 128 L585 222 Z' fill='#E8DCC2' stroke='#D9CDB8' stroke-width='4'/><text x='400' y='245' text-anchor='middle' font-family='Comfortaa,sans-serif' font-weight='700' font-size='20' fill='#8B8578'>МУЗЕЙ</text>${cols}<rect x='372' y='362' width='56' height='100' rx='6' fill='${C.brown}'/><line x1='400' y1='128' x2='400' y2='86' stroke='${C.ink}' stroke-width='4'/><path d='M400 86 L448 96 L400 108 Z' fill='${C.red}'/>${kid(330,530,1,C.red)}${kid(470,535,1,C.blue)}`); }
    case 'party': { let flags='',balloons='',candles=''; const cols=[C.red,C.blue,C.amber,C.green,C.sky]; for(let i=0;i<10;i++){const x=40+i*80,t=x/800,y=55+180*t*(1-t);flags+=`<path d='M${x-15} ${y.toFixed(1)} L${x+15} ${y.toFixed(1)} L${x} ${(y+28).toFixed(1)} Z' fill='${cols[i%5]}'/>`;} [[180,250,C.red],[300,205,C.blue],[520,225,C.amber],[645,260,C.green]].forEach(b=>{balloons+=`<path d='M${b[0]} ${b[1]+52} Q${b[0]-14} ${b[1]+110} ${b[0]+6} ${b[1]+160}' stroke='#8B8578' stroke-width='2.5' fill='none'/><ellipse cx='${b[0]}' cy='${b[1]}' rx='42' ry='52' fill='${b[2]}'/><ellipse cx='${b[0]-14}' cy='${b[1]-16}' rx='10' ry='16' fill='#fff' opacity='.45'/>`;}); [360,400,440].forEach((x,i)=>{candles+=`<rect x='${x-4}' y='385' width='8' height='30' rx='3' fill='${cols[i]}'/><ellipse cx='${x}' cy='378' rx='5' ry='8' fill='${C.amber}'/>`;}); return wrap(`${sky('#FFE9EC','#FFF6E3')}<path d='M0 55 Q400 145 800 55' stroke='#B9A88F' stroke-width='3' fill='none'/>${flags}${conf(36)}${balloons}<ellipse cx='400' cy='545' rx='150' ry='16' fill='#fff'/><rect x='290' y='475' width='220' height='68' rx='12' fill='${C.pink}'/><rect x='315' y='415' width='170' height='62' rx='10' fill='#FFFDF8'/><rect x='315' y='415' width='170' height='16' rx='8' fill='#FBD9E8'/>${candles}<text x='400' y='524' text-anchor='middle' font-family='Caveat,cursive' font-size='40' fill='#fff'>1Б класс</text>`); }
    case 'park': { let leaves=''; const lc=['#E8A33D','#D97B29','#C9572B']; for(let i=0;i<9;i++) leaves+=`<ellipse cx='${(60+r()*680).toFixed(0)}' cy='${(120+r()*320).toFixed(0)}' rx='9' ry='5' fill='${lc[i%3]}' transform='rotate(${(r()*180).toFixed(0)} 400 300)'/>`; return wrap(`${sky('#CDE8F6','#F6EFDD')}${sun(680,95,36)}${cloud(200,80,.9)}<rect y='460' width='800' height='140' fill='#E3DFA8'/><path d='M300 600 Q350 510 400 465 Q450 510 500 600 Z' fill='#EAD9B8'/><rect x='141' y='390' width='18' height='170' fill='${C.brown}'/><circle cx='150' cy='370' r='58' fill='#E8A33D'/><circle cx='115' cy='395' r='38' fill='#D97B29'/><rect x='641' y='370' width='18' height='190' fill='${C.brown}'/><circle cx='650' cy='350' r='56' fill='#D97B29'/><circle cx='685' cy='375' r='34' fill='#C9572B'/>${leaves}${kid(360,505,1.2,C.blue)}${kid(445,510,1.1,C.red)}`); }
    case 'art': return wrap(`${sky('#FFF6E3','#FFEEDD')}<rect y='480' width='800' height='120' fill='#EAD9B8'/><path d='M330 525 L372 300 M470 525 L428 300 M400 525 L400 330' stroke='${C.brown}' stroke-width='10' stroke-linecap='round' fill='none'/><rect x='295' y='175' width='210' height='165' rx='8' fill='#fff' stroke='#D9CDB8' stroke-width='6'/><rect x='310' y='190' width='180' height='100' fill='#BFE3F2'/><circle cx='355' cy='225' r='20' fill='${C.amber}'/><path d='M310 290 Q360 245 405 275 Q450 245 490 280 L490 290 Z' fill='#8FCB9B'/><rect x='545' y='455' width='34' height='45' rx='6' fill='${C.red}'/><rect x='590' y='455' width='34' height='45' rx='6' fill='${C.blue}'/><rect x='635' y='455' width='34' height='45' rx='6' fill='${C.green}'/><ellipse cx='190' cy='505' rx='62' ry='32' fill='#D9B382'/><circle cx='205' cy='495' r='7' fill='${C.red}'/><circle cx='225' cy='505' r='7' fill='${C.blue}'/><circle cx='200' cy='520' r='7' fill='${C.amber}'/>`);
    case 'reading': { let lines=''; for(let i=0;i<4;i++){const y=315+i*32;lines+=`<path d='M225 ${y} Q300 ${y-14} 375 ${y+4}' stroke='#C9CFDD' stroke-width='5' fill='none' stroke-linecap='round'/><path d='M425 ${y+4} Q500 ${y-14} 575 ${y}' stroke='#C9CFDD' stroke-width='5' fill='none' stroke-linecap='round'/>`;} return wrap(`${sky('#E4ECFB','#F6F9FF')}<text x='170' y='190' font-family='Caveat,cursive' font-size='80' fill='${C.red}' transform='rotate(-10 170 190)'>А</text><text x='610' y='180' font-family='Caveat,cursive' font-size='72' fill='${C.blue}' transform='rotate(8 610 180)'>Б</text><text x='520' y='120' font-family='Caveat,cursive' font-size='60' fill='${C.green}' transform='rotate(-6 520 120)'>В</text><path d='M400 460 Q300 415 195 435 L195 275 Q300 255 400 300 Z' fill='#fff' stroke='#D9CDB8' stroke-width='5'/><path d='M400 460 Q500 415 605 435 L605 275 Q500 255 400 300 Z' fill='#FFFDF8' stroke='#D9CDB8' stroke-width='5'/><line x1='400' y1='300' x2='400' y2='460' stroke='#D9CDB8' stroke-width='4'/>${lines}<path d='M560 270 L560 330 L575 318 L590 330 L590 270 Z' fill='${C.red}'/>`); }
    case 'sport': return wrap(`${sky('#A8D8F0','#E6F6FD')}${sun(110,95,40)}${cloud(320,85,.9)}<rect y='330' width='800' height='270' fill='#7FB069'/><ellipse cx='400' cy='465' rx='120' ry='45' fill='none' stroke='#fff' stroke-width='5' opacity='.7'/><line x1='400' y1='330' x2='400' y2='600' stroke='#fff' stroke-width='5' opacity='.7'/><rect x='176' y='175' width='10' height='190' fill='${C.ink}'/><rect x='614' y='175' width='10' height='190' fill='${C.ink}'/><defs><pattern id='ck${gid}' width='24' height='24' patternUnits='userSpaceOnUse'><rect width='24' height='24' fill='#fff'/><rect width='12' height='12' fill='${C.ink}'/><rect x='12' y='12' width='12' height='12' fill='${C.ink}'/></pattern></defs><rect x='186' y='175' width='428' height='46' fill='url(#ck${gid})' stroke='${C.ink}' stroke-width='3'/>${kid(320,480,1.3,C.red)}${kid(480,470,1.3,C.blue)}${kid(580,500,1.1,C.amber)}`);
    default: return wrap(`${sky('#A8D8F0','#E6F6FD')}${sun(110,100,42)}${cloud(400,90,1)}`);
  }
}

function craftSVG(art, seed = 1) {
  const r = rng(seed*17+3), gid='c'+(++uid);
  const C={red:'#E63946',blue:'#274690',green:'#2A9D8F',amber:'#FFB703',sky:'#4CC9F0',ink:'#22304A',pink:'#F4845F',brown:'#8B5E34'};
  const wrap=i=>`<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid slice'><rect width='400' height='300' fill='#FFFDF8'/><circle cx='30' cy='30' r='4' fill='#E3D9C6'/><circle cx='370' cy='270' r='4' fill='#E3D9C6'/><circle cx='370' cy='30' r='4' fill='#E3D9C6'/><circle cx='30' cy='270' r='4' fill='#E3D9C6'/>${i}</svg>`;
  switch(art){
    case 'leaf': return wrap(`<defs><linearGradient id='${gid}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${C.amber}'/><stop offset='1' stop-color='${C.red}'/></linearGradient></defs><path d='M200 222 Q202 250 198 268' stroke='${C.brown}' stroke-width='6' fill='none' stroke-linecap='round'/><path d='M200 55 L216 95 L254 78 L244 120 L284 124 L252 152 L272 192 L228 180 L220 222 L200 188 L180 222 L172 180 L128 192 L148 152 L116 124 L156 120 L146 78 L184 95 Z' fill='url(#${gid})'/><path d='M200 90 L200 210 M200 130 L160 110 M200 130 L240 110 M200 165 L155 155 M200 165 L245 155' stroke='#B3541E' stroke-width='3' opacity='.5' fill='none'/>`);
    case 'house': return wrap(`<rect y='240' width='400' height='60' fill='#B7D9A8'/><path d='M100 142 L200 60 L300 142 Z' fill='${C.red}'/><rect x='120' y='140' width='160' height='110' fill='${C.amber}'/><rect x='180' y='190' width='40' height='60' rx='6' fill='${C.blue}'/><rect x='140' y='160' width='36' height='36' fill='#fff' stroke='${C.ink}' stroke-width='3'/><rect x='224' y='160' width='36' height='36' fill='#fff' stroke='${C.ink}' stroke-width='3'/><circle cx='332' cy='58' r='24' fill='${C.amber}'/>`);
    case 'flower': { let p=''; for(let i=0;i<6;i++) p+=`<ellipse cx='200' cy='76' rx='24' ry='40' fill='${i%2?C.red:C.pink}' transform='rotate(${i*60} 200 120)'/>`; return wrap(`<path d='M200 142 Q195 220 200 282' stroke='${C.green}' stroke-width='8' fill='none' stroke-linecap='round'/><ellipse cx='168' cy='230' rx='26' ry='12' fill='${C.green}' transform='rotate(-30 168 230)'/><ellipse cx='232' cy='210' rx='26' ry='12' fill='${C.green}' transform='rotate(30 232 210)'/>${p}<circle cx='200' cy='120' r='22' fill='${C.amber}' stroke='#E8A33D' stroke-width='3'/>`); }
    case 'mask': return wrap(`<path d='M120 92 L150 30 L176 86 Z' fill='#E8833A'/><path d='M280 92 L250 30 L224 86 Z' fill='#E8833A'/><path d='M120 92 Q110 180 200 212 Q290 180 280 92 Q240 60 200 62 Q160 60 120 92 Z' fill='#F4A259'/><path d='M158 158 Q200 202 242 158 Q222 188 200 190 Q178 188 158 158 Z' fill='#fff'/><ellipse cx='165' cy='120' rx='16' ry='10' fill='${C.ink}'/><ellipse cx='235' cy='120' rx='16' ry='10' fill='${C.ink}'/><path d='M190 166 L210 166 L200 180 Z' fill='${C.ink}'/>`);
    case 'car': return wrap(`<rect y='220' width='400' height='80' fill='#D9CDB8'/><line x1='0' y1='260' x2='400' y2='260' stroke='#fff' stroke-width='5' stroke-dasharray='26 18'/><path d='M70 200 Q70 162 110 158 L150 156 Q170 120 210 118 L260 118 Q295 120 310 156 L340 160 Q360 164 360 190 L360 205 Q360 215 350 215 L80 215 Q70 215 70 205 Z' fill='${C.red}'/><path d='M162 154 Q178 128 210 126 L222 126 L222 154 Z' fill='#BFE3F2'/><path d='M232 126 L258 126 Q282 128 296 154 L232 154 Z' fill='#BFE3F2'/><circle cx='130' cy='215' r='26' fill='${C.ink}'/><circle cx='130' cy='215' r='10' fill='#D9CDB8'/><circle cx='290' cy='215' r='26' fill='${C.ink}'/><circle cx='290' cy='215' r='10' fill='#D9CDB8'/>`);
    case 'rocket': { let stars=''; for(let i=0;i<14;i++) stars+=`<circle cx='${(r()*400).toFixed(0)}' cy='${(r()*300).toFixed(0)}' r='${(1.2+r()*2).toFixed(1)}' fill='#fff' opacity='${(.4+r()*.6).toFixed(2)}'/>`; return wrap(`<defs><linearGradient id='${gid}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1B2A4A'/><stop offset='1' stop-color='#274690'/></linearGradient></defs><rect width='400' height='300' fill='url(#${gid})'/>${stars}<path d='M160 190 L128 226 L160 216 Z' fill='${C.red}'/><path d='M240 190 L272 226 L240 216 Z' fill='${C.red}'/><path d='M200 38 Q240 88 240 158 L240 202 L160 202 L160 158 Q160 88 200 38 Z' fill='#FFFDF8'/><path d='M200 38 Q228 74 236 108 L164 108 Q172 74 200 38 Z' fill='${C.red}'/><circle cx='200' cy='150' r='20' fill='${C.sky}' stroke='${C.blue}' stroke-width='6'/><path d='M176 206 Q200 278 224 206 Z' fill='${C.amber}'/>`); }
    case 'butterfly': return wrap(`<rect width='400' height='300' fill='#F6F9FF'/><ellipse cx='148' cy='108' rx='56' ry='42' fill='${C.sky}' opacity='.9' transform='rotate(-28 148 108)'/><ellipse cx='252' cy='108' rx='56' ry='42' fill='${C.sky}' opacity='.9' transform='rotate(28 252 108)'/><ellipse cx='160' cy='188' rx='42' ry='32' fill='${C.blue}' opacity='.85' transform='rotate(20 160 188)'/><ellipse cx='240' cy='188' rx='42' ry='32' fill='${C.blue}' opacity='.85' transform='rotate(-20 240 188)'/><ellipse cx='200' cy='150' rx='10' ry='55' fill='${C.ink}'/><circle cx='200' cy='92' r='12' fill='${C.ink}'/><path d='M192 84 Q178 62 168 60 M208 84 Q222 62 232 60' stroke='${C.ink}' stroke-width='3.5' fill='none' stroke-linecap='round'/>`);
    case 'snowflake': { let arms=''; for(let i=0;i<6;i++) arms+=`<g transform='rotate(${i*60} 200 150)'><line x1='200' y1='150' x2='200' y2='58' stroke='${C.blue}' stroke-width='6' stroke-linecap='round'/><path d='M200 104 L178 87 M200 104 L222 87 M200 78 L184 66 M200 78 L216 66' stroke='${C.blue}' stroke-width='4' stroke-linecap='round' fill='none'/></g>`; return wrap(`<rect width='400' height='300' fill='#EAF4FB'/>${arms}<circle cx='200' cy='150' r='13' fill='${C.sky}' stroke='${C.blue}' stroke-width='4'/>`); }
    default: return wrap(`<circle cx='200' cy='150' r='70' fill='${C.amber}'/>`);
  }
}

/* ─────────── Media HTML ─────────── */
function kidAvatar(k, size) { return k.avatar ? `<img src="${esc(k.avatar)}" alt="${esc(k.name)}" loading="lazy">` : avatarSVG(k, size); }
function photoHTML(p) { return p.src ? `<img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">` : sceneSVG(p.scene || 'classroom', p.seed || p.id); }
function videoPosterHTML(v) { return v.poster ? `<img src="${esc(v.poster)}" alt="${esc(v.title)}" loading="lazy">` : sceneSVG(v.scene || 'party', v.seed || v.id); }
function craftHTML(c) { return c.src ? `<img src="${esc(c.src)}" alt="${esc(c.title)}" loading="lazy">` : craftSVG(c.art, c.seed || c.id); }
function eventHTML(ev) { return ev.src ? `<img src="${esc(ev.src)}" alt="${esc(ev.title)}" loading="lazy">` : sceneSVG(ev.scene || 'party', ev.seed || ev.id); }

/* ─────────── Downloads ─────────── */
function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
async function downloadUrl(url, filename) {
  toast('⬇️ Готовим файл…', 'info', 1600);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    triggerBlobDownload(await res.blob(), filename);
    toast('✅ Скачивание началось', 'ok');
  } catch {
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    toast('Файл открыт в новой вкладке. Сохраните его вручную.', 'warn', 5000);
  }
}
function svgToPngBlob(svg, w = 1200, h = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#FFFDF8'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? resolve(b) : reject(new Error('PNG error')), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG error')); };
    img.src = url;
  });
}
async function downloadPhoto(p) {
  const base = fileName('photo', p);
  if (p.src) return downloadUrl(p.src, `${base}.${extFromUrl(p.src)}`);
  try { triggerBlobDownload(await svgToPngBlob(photoHTML(p)), `${base}.png`); toast('✅ Фото скачано', 'ok'); }
  catch { triggerBlobDownload(new Blob([photoHTML(p)], { type:'image/svg+xml' }), `${base}.svg`); toast('✅ Фото скачано как SVG', 'ok'); }
}
async function downloadVideo(v) {
  if (!v.src) return toast('У видео нет файла', 'warn');
  return downloadUrl(v.src, `${fileName('video', v)}.${extFromUrl(v.src,'mp4')}`);
}
async function downloadCraft(c) {
  const base = fileName('craft', c);
  if (c.src) return downloadUrl(c.src, `${base}.${extFromUrl(c.src)}`);
  try { triggerBlobDownload(await svgToPngBlob(craftHTML(c)), `${base}.png`); toast('✅ Работа скачана', 'ok'); }
  catch { triggerBlobDownload(new Blob([craftHTML(c)], { type:'image/svg+xml' }), `${base}.svg`); toast('✅ Работа скачана как SVG', 'ok'); }
}
async function downloadEvent(ev) {
  const base = fileName('event', ev);
  if (ev.src) return downloadUrl(ev.src, `${base}.${extFromUrl(ev.src)}`);
  try { triggerBlobDownload(await svgToPngBlob(eventHTML(ev), 1200, 675), `${base}.png`); toast('✅ Фото события скачано', 'ok'); }
  catch { triggerBlobDownload(new Blob([eventHTML(ev)], { type:'image/svg+xml' }), `${base}.svg`); toast('✅ Изображение скачано', 'ok'); }
}
function downloadByKind(kind, id) {
  if (kind === 'photo') { const p = byId(D.photos, id); if (p) return downloadPhoto(p); }
  if (kind === 'video') { const v = byId(D.videos, id); if (v) return downloadVideo(v); }
  if (kind === 'craft') { const c = byId(D.crafts, id); if (c) return downloadCraft(c); }
  if (kind === 'event') { const e = byId(D.events, id); if (e) return downloadEvent(e); }
  toast('Файл не найден', 'err');
}
function setZipProgress(pct) {
  $('#zipProgressWrap').classList.toggle('d-none', pct <= 0 || pct >= 100);
  $('#zipProgress').style.width = `${pct}%`;
}
async function zipPhotos(photos, label, kid = null) {
  if (!photos.length) return toast('Нет фото для архива', 'warn');
  if (!window.JSZip) return toast('ZIP библиотека не загрузилась. Скачайте фото по одному.', 'warn', 5000);
  toast('📦 Собираем архив…', 'info', 2000);
  const zip = new JSZip();
  const folder = zip.folder(label);
  let done = 0;
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i], base = fileName('photo', p);
    try {
      if (p.src) { const res = await fetch(p.src); if (res.ok) folder.file(`${base}.${extFromUrl(p.src)}`, await res.blob()); else throw 0; }
      else folder.file(`${base}.png`, await svgToPngBlob(photoHTML(p)));
      done++;
    } catch { folder.file(`${base}-info.txt`, `Не удалось загрузить: ${p.title}`); }
    setZipProgress(Math.round(((i + 1) / photos.length) * 100));
  }
  if (!done) { setZipProgress(0); return toast('Не удалось собрать архив', 'err'); }
  folder.file('README.txt', `Класс: ${D.site.className}\nФото: ${done}\n${kid ? 'Ученик: ' + kid.name + ' ' + kid.surname : 'Все фото класса'}\nСайт: ${location.href}`);
  triggerBlobDownload(await zip.generateAsync({ type:'blob' }), `${label}.zip`);
  setZipProgress(0);
  toast(`✅ Архив готов: ${done} фото`, 'ok');
}

/* ─────────── Lightbox ─────────── */
function photoItem(p) { return { key:`photo:${p.id}`, kind:'photo', title:p.title, sub:`${p.date} · ${D.categories[p.cat] || ''}`, html:photoHTML(p), download:()=>downloadPhoto(p) }; }
function videoItem(v) { return { key:`video:${v.id}`, kind:'video', title:v.title, sub:`${v.date} · ${D.categories[v.cat] || ''}${v.duration ? ' · '+v.duration : ''}`, html:`<video controls playsinline preload="metadata" ${v.poster ? `poster="${esc(v.poster)}"` : ''} src="${esc(v.src)}"></video>`, download:()=>downloadVideo(v) }; }
function craftItem(c) { return { key:`craft:${c.id}`, kind:'craft', title:c.title, sub:`${c.author} · ${c.materials}`, html:craftHTML(c), download:()=>downloadCraft(c) }; }
function eventItem(ev) { return { key:`event:${ev.id}`, kind:'event', title:ev.title, sub:ev.date, html:eventHTML(ev), download:()=>downloadEvent(ev) }; }

function openLB(list, i) {
  lbList = list; lbIndex = i;
  updateLB();
  lbModal.show();
}
function updateLB() {
  const it = lbList[lbIndex]; if (!it) return;
  const old = $('#lbMedia video'); if (old) old.pause();
  const ratio = it.kind === 'video' ? '16x9' : '4x3';
  $('#lbMedia').className = `lb-media ratio ratio-${ratio}`;
  $('#lbMedia').innerHTML = it.html;
  $('#lbTitle').textContent = it.title;
  $('#lbSub').textContent = it.sub;
  $('#lbCounter').textContent = `${lbIndex+1} / ${lbList.length}`;
  $('#lbPrev').style.display = $('#lbNext').style.display = lbList.length > 1 ? '' : 'none';
}
function lbNav(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; updateLB(); }
$('#lightboxModal').addEventListener('hidden.bs.modal', () => { const v = $('#lbMedia video'); if (v) v.pause(); $('#lbMedia').innerHTML = ''; });

/* ─────────── Kid modal ─────────── */
function openKid(id) {
  const k = byId(D.kids, id); if (!k) return;
  $('#kmAva').innerHTML = kidAvatar(k, 128);
  $('#kmName').textContent = `${k.name} ${k.surname}`;
  $('#kmChips').innerHTML = `<span class="km-chip">🎂 ${bdayStr(k.bday)}</span><span class="km-chip">🎯 ${esc(k.hobby)}</span>`;
  $('#kmDream').textContent = `Мечтает стать: ${k.dream.toLowerCase()} ✨`;

  const photos = D.photos.filter(p => (p.kids || []).includes(k.id));
  const videos = D.videos.filter(v => (v.kids || []).includes(k.id));
  kmMediaList = [...photos.map(photoItem), ...videos.map(videoItem)];

  $('#kmMedia').innerHTML = kmMediaList.length
    ? kmMediaList.map(it => {
        const [kind,id] = it.key.split(':');
        const item = kind === 'photo' ? byId(D.photos,id) : byId(D.videos,id);
        const thumb = kind === 'photo' ? photoHTML(item) : videoPosterHTML(item);
        return `<div class="col"><div class="km-thumb" data-open="${it.key}" data-context="kid" tabindex="0" role="button" aria-label="${esc(it.title)}">${thumb}${kind==='video'?'<span class="play-badge sm">▶</span>':''}<button class="km-dl" data-dl="${it.key}" aria-label="Скачать">⬇</button></div></div>`;
      }).join('')
    : '<div class="col-12"><div class="alert alert-light text-center fw-bold mb-0">Пока нет фото или видео с этим ребёнком.</div></div>';

  $('#kmZip').disabled = !photos.length;
  $('#kmZip').dataset.kid = k.id;
  kidModal.show();
}

/* ─────────── Renderers ─────────── */
function applySite() {
  $$('[data-site]').forEach(el => { const k = el.dataset.site; if (D.site[k] != null) el.textContent = D.site[k]; });
  document.title = `${D.site.className} класс — ${D.site.school}, ${D.site.city}`;
  $('#heroKidCount').textContent = D.kids.length;
  $('#yearNow').textContent = new Date().getFullYear();
  $('#heroBadge1').textContent = `⭐ ${D.achievements.length} номинации`;
  $('#heroBadge2').textContent = `🎨 ${D.crafts.length} поделок`;

  const t = D.site.teacher;
  $('#teacherCard').innerHTML = `<div class="teacher-card reveal"><div class="row align-items-center g-4"><div class="col-lg-auto"><div class="teacher-ava">${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.name)}">` : '👩‍🏫'}</div></div><div class="col-lg"><div class="teacher-info"><span class="sticker s-amber">${esc(t.role)}</span><h3>${esc(t.name)}</h3><p class="teacher-quote">${esc(t.quote)}</p><div class="d-flex gap-2 flex-wrap justify-content-lg-start justify-content-center">${t.email?`<a class="chip-light" href="mailto:${esc(t.email)}"><i class="bi bi-envelope"></i> ${esc(t.email)}</a>`:''}${t.phone?`<a class="chip-light" href="tel:${esc(t.phone.replace(/[^+\d]/g,''))}"><i class="bi bi-telephone"></i> ${esc(t.phone)}</a>`:''}</div></div></div></div></div>`;

  const c = D.contacts[1] || D.contacts[0];
  $('#footerContacts').innerHTML = c ? `<h4>Контакты</h4><p>${esc(c.name)}:${c.phone?`<br><a href="tel:${esc(c.phone.replace(/[^+\d]/g,''))}">${esc(c.phone)}</a>`:''}${c.email?`<br><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`:''}</p>` : '';
}
function renderStats() {
  $('#statsGrid').innerHTML = D.stats.map((s,i)=>`<div class="col"><div class="paper-card stat-card h-100 reveal ${esc(s.tint)}" style="transition-delay:${i*60}ms"><span class="stat-ico">${s.icon}</span><span class="stat-num" data-count="${s.value}" data-suffix="${esc(s.suffix||'')}">0</span><span class="stat-label">${esc(s.label)}</span></div></div>`).join('');
}
function renderFilters(container, items, type) {
  const counts = { all: items.length };
  Object.keys(D.categories).forEach(c => counts[c] = items.filter(x => x.cat === c).length);
  $(container).innerHTML = `<button class="btn active" data-filter="all" data-type="${type}">Все <span class="cnt">${counts.all}</span></button>` + Object.entries(D.categories).map(([k,v])=>`<button class="btn" data-filter="${k}" data-type="${type}">${v} <span class="cnt">${counts[k]}</span></button>`).join('');
}
function renderGallery(filter='all') {
  currentPhotoList = [...D.photos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||'')).filter(p=>filter==='all'||p.cat===filter);
  $('#galleryGrid').innerHTML = currentPhotoList.map((p,i)=>`<div class="col photo-col"><article class="polaroid h-100" style="animation:popIn .45s ease ${i*40}ms backwards"><div class="ph" data-open="photo:${p.id}" tabindex="0" role="button"><span class="badge badge-cat position-absolute m-2">${D.categories[p.cat]||''}</span>${photoHTML(p)}</div><div class="g-meta"><span class="g-title">${esc(p.title)}</span><span class="g-date">${esc(p.date)}</span></div><div class="g-actions">${likeBtn('photo',p,true)}<button class="icon-btn" data-dl="photo:${p.id}" aria-label="Скачать"><i class="bi bi-download"></i></button><button class="icon-btn ms-auto" data-open="photo:${p.id}" aria-label="Открыть"><i class="bi bi-arrows-fullscreen"></i></button></div></article></div>`).join('');
}
function videoCardHTML(v,i) {
  return `<div class="col"><article class="paper-card video-card h-100 reveal" style="transition-delay:${i*40}ms"><div class="video-thumb" data-open="video:${v.id}" tabindex="0" role="button">${videoPosterHTML(v)}<span class="play-badge"><i class="bi bi-play-fill"></i></span><span class="video-duration">${esc(v.duration||'')}</span><span class="badge badge-cat position-absolute top-0 start-0 m-2">${D.categories[v.cat]||''}</span></div><div class="video-body"><h3>${esc(v.title)}</h3><p class="video-meta">${esc(v.date)} · ${esc(v.desc||'')}</p><div class="d-flex gap-2 flex-wrap mt-auto pt-2">${likeBtn('video',v)}<button class="btn btn-dl btn-sm" data-dl="video:${v.id}"><i class="bi bi-download me-1"></i>Скачать</button><button class="btn btn-ink btn-sm ms-auto" data-open="video:${v.id}"><i class="bi bi-play-fill"></i></button></div></div></article></div>`;
}
function renderVideos(filter='all') {
  currentVideoList = [...D.videos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||'')).filter(v=>filter==='all'||v.cat===filter);
  $('#videosGrid').innerHTML = currentVideoList.map(videoCardHTML).join('');
}
function renderCrafts() {
  $('#craftsGrid').innerHTML = D.crafts.map((c, i) => {
    const k = byId(D.kids, c.kidId) || D.kids[0];

    return `
      <div class="col">
        <article class="paper-card craft-card h-100 reveal" style="transition-delay:${i * 40}ms">
          <div class="craft-art" data-open="craft:${c.id}" tabindex="0" role="button" aria-label="Открыть работу: ${esc(c.title)}">
            ${craftHTML(c)}
          </div>

          <div class="craft-body">
            <h3 class="craft-title">${esc(c.title)}</h3>

            <div class="craft-author">
              <span class="mini-ava">${kidAvatar(k, 30)}</span>
              ${esc(c.author)}
            </div>

            <p class="craft-mat">🧰 ${esc(c.materials)}</p>

            <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-auto pt-2 border-top">
              <span class="badge badge-soft">${esc(c.date)}</span>

              <div class="d-flex gap-2">
                ${likeBtn('craft', c)}
                <button class="icon-btn" data-dl="craft:${c.id}" aria-label="Скачать">
                  <i class="bi bi-download"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  }).join('');
}
function renderEvents() {
  $('#eventsTimeline').innerHTML = D.events.map(ev=>`<div class="t-item reveal ${ev.upcoming?'upcoming':''}"><div class="t-marker">${ev.icon}</div><div class="t-card"><span class="badge badge-date">${esc(ev.date)}</span>${ev.upcoming?'<span class="badge badge-soon ms-2">Скоро!</span>':''}<h3>${esc(ev.title)}</h3><p>${esc(ev.desc)}</p><div class="d-flex gap-2 flex-wrap">${ev.tags.map(t=>`<span class="badge badge-soft">${esc(t)}</span>`).join('')}</div><div class="t-photo" data-open="event:${ev.id}" tabindex="0" role="button">${eventHTML(ev)}</div></div></div>`).join('');
}
function renderAchievements() {
  $('#achieveGrid').innerHTML = D.achievements.map((a,i)=>{const k=byId(D.kids,a.kidId)||D.kids[0];return `<div class="col"><div class="paper-card achieve-card h-100 reveal" style="transition-delay:${i*60}ms"><div class="ava">${kidAvatar(k,76)}</div><div class="fs-3">${a.icon}</div><h4>${esc(a.title)}</h4><p>${esc(k.name)} ${esc(k.surname)}</p><span class="badge badge-soft mt-2">${esc(a.month)}</span></div></div>`;}).join('');
}
function renderKids(q='') {
  const list = D.kids.filter(k=>`${k.name} ${k.surname} ${k.hobby}`.toLowerCase().includes(q.toLowerCase()));
  $('#kidsGrid').innerHTML = list.map((k,i)=>`<div class="col"><div class="paper-card kid-card h-100 reveal in" style="animation:popIn .4s ease ${Math.min(i*30,300)}ms backwards" data-kid="${k.id}" tabindex="0" role="button"><div class="ava">${kidAvatar(k,96)}</div><h3>${esc(k.name)} ${esc(k.surname)}</h3><span class="bday-pill">🎂 ${bdayStr(k.bday)}</span><p class="hobby">🎯 ${esc(k.hobby)}</p></div></div>`).join('');
  $('#kidsEmpty').hidden = list.length > 0;
}
function nextBirthday() {
  const now = new Date(), today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  let best = null;
  D.kids.forEach(k=>{const[m,d]=k.bday.split('-').map(Number);let dt=new Date(now.getFullYear(),m-1,d);if(dt<today)dt=new Date(now.getFullYear()+1,m-1,d);const diff=Math.round((dt-today)/864e5);if(!best||diff<best.diff)best={kid:k,diff};});
  return best;
}
function renderBirthdays() {
  const b = nextBirthday(); if (!b) return;
  const txt = b.diff===0?'Сегодня! 🎉':'через '+b.diff+' '+plural(b.diff,'день','дня','дней');
  $('#bdayName').textContent = `${b.kid.name} ${b.kid.surname}`;
  $('#bdayDate').textContent = `${bdayStr(b.kid.bday)} · увлекается: ${b.kid.hobby.toLowerCase()}`;
  $('#bdayCount').textContent = txt;
  $('#bdayBanner').innerHTML = `<span class="fs-2">🎂</span><span>Ближайший праздник: <b class="text-danger">${esc(b.kid.name)} ${esc(b.kid.surname)}</b> — ${bdayStr(b.kid.bday)} (${txt})</span>`;
  const cur = new Date().getMonth(), td = new Date().getDate();
  $('#monthsGrid').innerHTML = MONTHS.map((m,i)=>{const kids=D.kids.filter(k=>+k.bday.split('-')[0]===i+1).sort((a,b)=>a.bday.localeCompare(b.bday));return `<div class="col"><div class="month-card ${i===cur?'current':''}"><h4>${m}${i===cur?'<span class="badge badge-soft ms-2">сейчас</span>':''}</h4><ul>${kids.map(k=>{const d=+k.bday.split('-')[1],isT=i===cur&&d===td;return `<li class="${isT?'today-b':''}"><b>${d}</b> ${esc(k.name)} ${esc(k.surname)}${isT?' 🎉':''}</li>`;}).join('')}</ul></div></div>`;}).join('');
}
function renderScheduleTabs() {
  const td=new Date().getDay(),todayIdx=td>=1&&td<=5?td-1:-1;
  $('#dayTabs').innerHTML = D.schedule.days.map((d,i)=>`<button class="btn ${i===schedDay?'active':''} ${i===todayIdx?'today':''}" data-day="${i}">${esc(d.short)}</button>`).join('');
}
function renderLessons() {
  $('#lessonsList').innerHTML = D.schedule.days[schedDay].lessons.map((s,i)=>`<li class="list-group-item d-flex align-items-center gap-3"><span class="lesson-time">${esc(D.schedule.times[i]||'')}</span><span class="lesson-ico">${D.subjects[s]||'📘'}</span><span class="lesson-name">${esc(s)}</span><span class="ms-auto small fw-bold text-secondary d-none d-sm-inline">${i+1}-й урок</span></li>`).join('');
}
function renderContacts() {
  $('#contactsGrid').innerHTML = D.contacts.map(c=>`<div class="col"><div class="contact-card"><div class="fs-1">${c.icon}</div><h4>${esc(c.name)}</h4><p>${esc(c.role)}</p>${c.addr?`<p>📍 ${esc(c.addr)}</p>`:''}${c.phone?`<a href="tel:${esc(c.phone.replace(/[^+\d]/g,''))}"><i class="bi bi-telephone me-1"></i>${esc(c.phone)}</a>`:''}${c.email?`<a href="mailto:${esc(c.email)}"><i class="bi bi-envelope me-1"></i>${esc(c.email)}</a>`:''}</div></div>`).join('');
}
function renderLinks() {
  $('#linksGrid').innerHTML = D.links.map(l=>`<div class="col"><a class="link-card" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="fs-2">${l.icon}</span><span><h4>${esc(l.title)}</h4><p>${esc(l.desc)}</p></span><i class="bi bi-box-arrow-up-right ms-auto text-primary fw-bold"></i></a></div>`).join('');
}
function renderNotes() {
  $('#notesAccordion').innerHTML = D.notes.map((n,i)=>`<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#note-${i}">${esc(n.title)}</button></h2><div id="note-${i}" class="accordion-collapse collapse" data-bs-parent="#notesAccordion"><div class="accordion-body"><ul class="mb-0">${n.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></div>`).join('');
}
function renderHome() {
  $('#heroAvatars').innerHTML = D.kids.slice(0,5).map(k=>`<span class="h-ava">${kidAvatar(k,46)}</span>`).join('');
  const latest = [...D.photos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||''));
  $('#heroPh1').innerHTML = photoHTML(D.photos[0]);
  $('#heroPh2').innerHTML = photoHTML(D.photos.find(p=>p.scene==='park')||D.photos[1]);
  $('#heroPh3').innerHTML = photoHTML(D.photos.find(p=>p.scene==='playground')||D.photos[2]);
  $('#homePhotos').innerHTML = latest.slice(0,4).map(p=>`<div class="col photo-col"><div class="polaroid" data-open="photo:${p.id}" data-context="home" tabindex="0" role="button"><div class="ph">${photoHTML(p)}</div><div class="pc">${esc(p.title)}</div></div></div>`).join('');
  $('#homeVideos').innerHTML = [...D.videos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||'')).slice(0,3).map(videoCardHTML).join('');
}
function initQuotes() {
  $('#quotesInner').innerHTML = D.quotes.map((q,i)=>`<div class="carousel-item ${i===0?'active':''}"><div class="quote-slide"><p class="quote-text">${esc(q.text)}</p><div class="quote-author">— ${esc(q.author)}</div></div></div>`).join('');
  $('#quotesIndicators').innerHTML = D.quotes.map((_,i)=>`<button type="button" data-bs-target="#quotesCarousel" data-bs-slide-to="${i}" class="${i===0?'active':''}" aria-label="Цитата ${i+1}"></button>`).join('');
  new bs.Carousel('#quotesCarousel', { interval:6500, pause:'hover', ride:'carousel' });
}

/* ─────────── Animation / counters ─────────── */
const revealIO = new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');revealIO.unobserve(en.target);}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
function observeReveals(){ $$('.reveal:not(.in)').forEach(el=>revealIO.observe(el)); }
const counterIO = new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;counterIO.unobserve(el);const target=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now();(function tick(t){const p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(target*e).toLocaleString('ru-RU')+suf;if(p<1)requestAnimationFrame(tick);})(t0);}),{threshold:.4});
function observeCounters(){ $$('.stat-num').forEach(el=>counterIO.observe(el)); }
function nyTick() {
  const now=new Date(),ny=new Date(now.getFullYear()+1,0,1),diff=ny-now;
  const d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3),pad=n=>String(n).padStart(2,'0');
  $$('[data-ny-days]').forEach(el=>el.textContent=`${d} ${plural(d,'день','дня','дней')}`);
  $$('[data-ny-full]').forEach(el=>el.textContent=`${d} ${plural(d,'день','дня','дней')} ${pad(h)}:${pad(m)}:${pad(s)}`);
}
function confetti(x,y) {
  const colors=['#E63946','#274690','#2A9D8F','#FFB703','#4CC9F0','#F4845F'];
  for(let i=0;i<28;i++){const s=document.createElement('span');s.className='confetti';const sz=6+Math.random()*8;s.style.cssText=`left:${x}px;top:${y}px;width:${sz}px;height:${(sz*(.5+Math.random())).toFixed(1)}px;background:${colors[i%6]};--dx:${((Math.random()-.5)*360).toFixed(0)}px;--dy:${(60+Math.random()*240).toFixed(0)}px;--rot:${((Math.random()-.5)*720).toFixed(0)}deg`;document.body.appendChild(s);s.addEventListener('animationend',()=>s.remove());}
}

/* ─────────── Router ─────────── */
const PAGES = { home:'Главная',class:'Наш класс',gallery:'Галерея',videos:'Видео',creativity:'Творчество',events:'События',useful:'Полезное' };
function route() {
  let h = location.hash.replace('#',''); if (!PAGES[h]) h='home';
  $$('.page').forEach(p=>p.classList.remove('active'));
  $('#page-'+h).classList.add('active');
  $$('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===h));
  document.title = `${PAGES[h]} — ${D.site.className} класс · ${D.site.school}`;
  window.scrollTo(0,0);
  const oc = bs.Offcanvas.getInstance($('#mobileMenu')); if (oc) oc.hide();
  observeReveals();
}

/* ─────────── Likes ─────────── */
function toggleLike(kind,id) {
  const key = likeKey(kind,id);
  likes[key] = !likes[key];
  if (!likes[key]) delete likes[key];
  try { localStorage.setItem('1b_likes_v2',JSON.stringify(likes)); } catch {}
  $$(`[data-like="${key}"]`).forEach(btn=>{
    const liked = isLiked(kind,id);
    btn.classList.toggle('liked',liked);
    const icon = btn.querySelector('i');
    if (icon) icon.className = `bi ${liked?'bi-heart-fill':'bi-heart'}`;
    const n = btn.querySelector('.like-n');
    if (n) n.textContent = likeCount(kind,id);
  });
  toast(isLiked(kind,id) ? '❤️ Отмечено как понравившееся (в этом браузере)' : 'Отметка снята', 'info', 2000);
}

/* ─────────── Events ─────────── */
function bindEvents() {
  window.addEventListener('hashchange',route);
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.go;}));
  $('#galleryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;$$('#galleryFilters .btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderGallery(b.dataset.filter);});
  $('#videosFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;$$('#videosFilters .btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVideos(b.dataset.filter);});
  $('#dayTabs').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;schedDay=+b.dataset.day;renderScheduleTabs();renderLessons();});
  $('#kidSearch').addEventListener('input',e=>renderKids(e.target.value.trim()));
  $('#kidsReset').addEventListener('click',()=>{$('#kidSearch').value='';renderKids('');});
  $('#lbPrev').addEventListener('click',()=>lbNav(-1));
  $('#lbNext').addEventListener('click',()=>lbNav(1));
  $('#lbDownload').addEventListener('click',()=>{const it=lbList[lbIndex];if(it?.download)it.download();});
  $('#zipAllPhotos').addEventListener('click',()=>zipPhotos(currentPhotoList,'1b-all-photos'));
  $('#kmZip').addEventListener('click',e=>{const k=byId(D.kids,e.currentTarget.dataset.kid);if(k)zipPhotos(D.photos.filter(p=>(p.kids||[]).includes(k.id)),`1b-${translit(k.name)}-photos`,k);});
  $('#bdayCake').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();confetti(r.left+r.width/2,r.top+r.height/2);});
  const toTop=$('#toTop');
  window.addEventListener('scroll',()=>{$('#mainNav').classList.toggle('scrolled',scrollY>10);toTop.classList.toggle('show',scrollY>600);},{passive:true});
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.addEventListener('keydown',e=>{
    if (!$('#lightboxModal').classList.contains('show')) return;
    if (e.key==='ArrowLeft'&&lbList.length>1) lbNav(-1);
    if (e.key==='ArrowRight'&&lbList.length>1) lbNav(1);
  });
  document.addEventListener('click',e=>{
    const dl=e.target.closest('[data-dl]');
    if(dl){e.preventDefault();e.stopPropagation();downloadByKind(...dl.dataset.dl.split(':'));return;}
    const like=e.target.closest('[data-like]');
    if(like){e.preventDefault();e.stopPropagation();toggleLike(...like.dataset.like.split(':'));return;}
    const open=e.target.closest('[data-open]');
    if(open){
      const key=open.dataset.open,[kind,id]=key.split(':');
      let list=[],idx=0;
      if(open.dataset.context==='kid'||open.closest('#kidModal')){list=kmMediaList;idx=kmMediaList.findIndex(x=>x.key===key);}
      else if(kind==='photo'){const src=open.dataset.context==='home'?[...D.photos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||'')):currentPhotoList;list=src.map(photoItem);idx=list.findIndex(x=>x.key===key);}
      else if(kind==='video'){const src=open.closest('#homeVideos')?[...D.videos].sort((a,b)=>(b.sort||'').localeCompare(a.sort||'')):currentVideoList;list=src.map(videoItem);idx=list.findIndex(x=>x.key===key);}
      else if(kind==='craft'){const c=byId(D.crafts,id);if(c)list=[craftItem(c)];}
      else if(kind==='event'){const ev=byId(D.events,id);if(ev)list=[eventItem(ev)];}
      if(list.length)openLB(list,Math.max(idx,0));
      return;
    }
    const kid=e.target.closest('[data-kid]');
    if(kid)openKid(+kid.dataset.kid);
  });
  document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[data-open],[data-kid]'))e.target.click();});
}

/* ─────────── Init ─────────── */
applySite();
renderStats();
renderFilters('#galleryFilters',D.photos,'gallery');
renderFilters('#videosFilters',D.videos,'videos');
renderGallery();
renderVideos();
renderCrafts();
renderEvents();
renderAchievements();
renderKids();
renderBirthdays();
renderScheduleTabs();
renderLessons();
renderContacts();
renderLinks();
renderNotes();
renderHome();
initQuotes();
bindEvents();
route();
observeReveals();
observeCounters();
nyTick();
setInterval(nyTick,1000);
if (nextBirthday()?.diff===0) setTimeout(()=>confetti(innerWidth/2,180),900);