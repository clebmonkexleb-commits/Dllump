const express = require('express');
const http = require('http');
const crypto = require('crypto');
const cors = require('cors');
const { Server } = require('socket.io');
const {
  getUser, saveUser, addWinToHistory, getAllUsers, topPlayers, allUsersCount,
  createPromoCode, redeemPromoCode, getPromoCodes, deletePromoCode, resetPlayer,
  toggleHidePfp,
} = require('./store');

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ALLOW_DEV_LOGIN = process.env.ALLOW_DEV_LOGIN === 'true';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-in-production';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }, transports: ['websocket', 'polling'] });

function verifyInitData(initData) {
  if (!BOT_TOKEN) return null;
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    const dataCheckArr = [];
    for (const [key, value] of [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      dataCheckArr.push(`${key}=${value}`);
    }
    const dataCheckString = dataCheckArr.join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    if (computedHash !== hash) return null;
    const authDate = parseInt(params.get('auth_date') || '0', 10);
    if (Date.now() / 1000 - authDate > 86400) return null;
    const userJson = params.get('user');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (e) { console.error('Auth error:', e); return null; }
}

const ARENA_SIZE = 400;
const CORNER_RADIUS = ARENA_SIZE * 0.35;

function generatePerimeter(size, cornerRadius, numPoints = 300) {
  const half = size / 2;
  const r = Math.min(cornerRadius, half);
  const sections = [
    { type: 'line', x1: -half + r, y1: -half, x2: half - r, y2: -half },
    { type: 'arc', cx: half - r, cy: -half + r, start: -Math.PI / 2, end: 0 },
    { type: 'line', x1: half, y1: -half + r, x2: half, y2: half - r },
    { type: 'arc', cx: half - r, cy: half - r, start: 0, end: Math.PI / 2 },
    { type: 'line', x1: half - r, y1: half, x2: -half + r, y2: half },
    { type: 'arc', cx: -half + r, cy: half - r, start: Math.PI / 2, end: Math.PI },
    { type: 'line', x1: -half, y1: half - r, x2: -half, y2: -half + r },
    { type: 'arc', cx: -half + r, cy: -half + r, start: Math.PI, end: 3 * Math.PI / 2 }
  ];
  const segLengths = sections.map(seg => seg.type === 'line'
    ? Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1)
    : r * (seg.end - seg.start));
  const totalLen = segLengths.reduce((a, b) => a + b, 0);
  const step = totalLen / numPoints;
  const points = [];
  let accumulated = 0, segIdx = 0;
  for (let i = 0; i < numPoints; i++) {
    const target = i * step;
    while (accumulated + segLengths[segIdx] < target) {
      accumulated += segLengths[segIdx];
      segIdx = (segIdx + 1) % sections.length;
    }
    const localT = (target - accumulated) / segLengths[segIdx];
    const seg = sections[segIdx];
    let px, py;
    if (seg.type === 'line') {
      px = seg.x1 + localT * (seg.x2 - seg.x1);
      py = seg.y1 + localT * (seg.y2 - seg.y1);
    } else {
      const angle = seg.start + localT * (seg.end - seg.start);
      px = seg.cx + r * Math.cos(angle);
      py = seg.cy + r * Math.sin(angle);
    }
    points.push({ x: px + half, y: py + half });
  }
  return points;
}

const PERIMETER = generatePerimeter(ARENA_SIZE, CORNER_RADIUS, 300);

function speedForRadius(radius) {
  const minR = 18, maxR = 52;
  const norm = Math.min(1, Math.max(0, (radius - minR) / (maxR - minR)));
  const speed = 28.0 - norm * 20.0;
  return Math.max(8.0, Math.min(28.0, speed));
}

const COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#e84393'];
const MAX_PLAYERS = 8;

const LEVEL_RANKS = [
  'Starter','Rookie','Pepe Lover','Meme Fan','NFT Lover','Degen','Crypto Bro',
  'Airdrop Hunter','Diamond Hands','Whale','Ice Skater','Puck Master','Arena Regular',
  'High Roller','Ice Veteran','Rink Legend','Arena Champion','Ice King','Arena Master',
  'Ice Lord','Rink Royalty','Arena Friend'
];
const MAX_LEVEL = LEVEL_RANKS.length;
const LEVEL_XP = (() => { const arr = [0];
  for (let l = 1; l < MAX_LEVEL; l++) arr.push(arr[l - 1] + 100 + (l - 1) * 50);
  return arr; })();

function levelFromXp(xp) {
  xp = Math.max(0, xp | 0);
  let lvl = 1;
  for (let i = 1; i < MAX_LEVEL; i++) { if (xp >= LEVEL_XP[i]) lvl = i + 1; else break; }
  return lvl;
}
function getLevelInfo(user) {
  const xp = Math.max(0, (user && user.xp) | 0);
  const level = levelFromXp(xp);
  const rank = LEVEL_RANKS[level - 1];
  const curBase = LEVEL_XP[level - 1];
  const nextBase = level < MAX_LEVEL ? LEVEL_XP[level] : curBase;
  const isMax = level >= MAX_LEVEL;
  const span = Math.max(1, nextBase - curBase);
  const progress = isMax ? 1 : Math.min(1, Math.max(0, (xp - curBase) / span));
  const edges = 3 + Math.floor((level - 1) / 2);
  return {
    level, rank, xp, edges, maxLevel: MAX_LEVEL,
    currentLevelXp: curBase,
    nextLevelXp: isMax ? null : nextBase,
    xpIntoLevel: xp - curBase,
    xpForLevel: isMax ? 0 : nextBase - curBase,
    xpToNext: isMax ? 0 : nextBase - xp,
    progress, isMax,
  };
}

const QUESTS = [
  { id: 'ice_bets_5', title: 'Arena Regular', description: 'Place 5 bets in the Ice Arena', target: 5, reward: 250 },
  { id: 'ice_win_1', title: 'First Victory', description: 'Win 1 Ice Arena game', target: 1, reward: 500 },
];
function buildQuestList(user) {
  return QUESTS.map(q => {
    const progress = Math.max(0, (user['q_' + q.id + '_p'] | 0));
    const claimed  = !!user['q_' + q.id + '_c'];
    return { id: q.id, title: q.title, description: q.description, target: q.target, reward: q.reward,
      progress: Math.min(progress, q.target), claimed, complete: progress >= q.target };
  });
}

function createRoom(id) {
  return { id, gameState: 'idle', players: [], pot: 0, opening: null, openingTimer: 0,
    gameTime: 0, countdownStartTime: 0, prestartTimer: 0, recentWinners: [] };
}
const room = createRoom('main');

function getAlive() { return room.players.filter(p => p.alive); }
function getPlayer(id) { return room.players.find(p => p.id === id); }

const ICE_SIZE = ARENA_SIZE;
const ICE_CORNER_RADIUS = ARENA_SIZE * 0.045;
const ICE_PERIMETER = generatePerimeter(ICE_SIZE, ICE_CORNER_RADIUS, 400);
const ICE_FIELD_SCALE = 0.92;

function createIceRoom(id) {
  return { id, gameState: 'idle', players: [], pot: 0, countdownStartTime: 0,
    spinStartTime: 0, spinDuration: 0, spinFinalAngle: 0,
    spinStartX: ICE_SIZE / 2, spinStartY: ICE_SIZE / 2,
    puck: { x: ICE_SIZE / 2, y: ICE_SIZE / 2, vx: 0, vy: 0 },
    recentWinners: [], slideStartTime: 0, lastBounceTime: 0 };
}
const iceRoom = createIceRoom('ice');

function getIcePlayer(id) { return iceRoom.players.find(p => p.id === id); }

let botCounter = 0;
const botIds = new Set();
let autoBotEnabled = false;
let autoBotInterval = null;
let rareRollEnabled = false;

function generateBotId() { return `bot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function isBot(id) { return id && typeof id === 'string' && id.startsWith('bot_'); }

function spawnBot(betAmount) {
  const id = generateBotId();
  botCounter++;
  const name = `Bot_${String(botCounter).padStart(3, '0')}`;
  const pfp = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
  const player = makeIcePlayer(id, betAmount, name, pfp);
  if (player) { botIds.add(id); return player; }
  return null;
}

function removeAllBots() {
  const toRemove = [];
  iceRoom.players.forEach(p => { if (isBot(p.id)) toRemove.push(p.id); });
  toRemove.forEach(id => {
    const idx = iceRoom.players.findIndex(p => p.id === id);
    if (idx !== -1) iceRoom.players.splice(idx, 1);
    botIds.delete(id);
  });
  if (toRemove.length > 0 && iceRoom.players.length > 0) repartitionIceArena();
  return toRemove.length;
}

function startAutoBot() {
  if (autoBotInterval) clearInterval(autoBotInterval);
  autoBotInterval = setInterval(() => {
    if (!autoBotEnabled) return;
    if (iceRoom.gameState !== 'idle') return;
    if (iceRoom.players.length >= MAX_PLAYERS) return;
    const bet = Math.floor(Math.random() * 140) + 10;
    spawnBot(bet);
  }, 4000);
}
startAutoBot();
function stopAutoBot() { if (autoBotInterval) { clearInterval(autoBotInterval); autoBotInterval = null; } }

/* ============================================================
   UPGRADE GAME (NEW)
   ============================================================ */
const UPGRADE_MAX_BET = 1500;
const UPGRADE_MIN_BET = 10;
const UPGRADE_DAILY_LIMIT = 3;
const UPGRADE_HOUSE = 0.03;

let upgradeStats = {
  lastWinner: null, // { name, pfp, amount, timestamp }
  bestWin:    null,
};

function dayKey() {
  const d = new Date();
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

app.get('/api/upgrade-stats', (req, res) => {
  res.json({ ok: true, stats: upgradeStats, maxBet: UPGRADE_MAX_BET, minBet: UPGRADE_MIN_BET, dailyLimit: UPGRADE_DAILY_LIMIT });
});

app.post('/api/upgrade', async (req, res) => {
  try {
    const { userId, bet, chance } = req.body || {};
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });

    const betAmt = Math.floor(Number(bet));
    if (!Number.isFinite(betAmt) || betAmt < UPGRADE_MIN_BET)
      return res.status(400).json({ ok: false, error: 'Minimum bet is ' + UPGRADE_MIN_BET });
    if (betAmt > UPGRADE_MAX_BET)
      return res.status(400).json({ ok: false, error: 'Maximum bet is ' + UPGRADE_MAX_BET });

    const ch = Number(chance);
    if (!Number.isFinite(ch) || ch < 0.0005 || ch > 0.95)
      return res.status(400).json({ ok: false, error: 'Invalid chance' });

    const user = await getUser(userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if (user.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    if (user.balance < betAmt) return res.status(400).json({ ok: false, error: 'Insufficient balance' });

    const tk = dayKey();
    if (user.upgradeDay !== tk) { user.upgradeDay = tk; user.upgradeCount = 0; }
    const used = user.upgradeCount | 0;
    if (used >= UPGRADE_DAILY_LIMIT)
      return res.status(400).json({ ok: false, error: 'Daily limit reached (' + UPGRADE_DAILY_LIMIT + ' plays/day)' });

    user.balance -= betAmt;
    user.upgradeCount = used + 1;
    user.xp = (user.xp | 0) + betAmt;

    const win = Math.random() < ch;
    const mult = (1 - UPGRADE_HOUSE) / ch;
    let payout = 0;
    if (win) {
      payout = Math.max(betAmt, Math.floor(betAmt * mult));
      user.balance += payout;
      user.wins = (user.wins | 0) + 1;
    } else {
      user.losses = (user.losses | 0) + 1;
    }
    await saveUser(user);

    if (win) {
      const isAnon = !!user.anonymousEnabled;
      const entry = {
        name: isAnon ? (user.anonymousName || 'Anonymous') : (user.username || 'player'),
        pfp:  (isAnon || user.hidePfp) ? '' : (user.pfp || ''),
        amount: payout,
        timestamp: Date.now(),
      };
      upgradeStats.lastWinner = entry;
      if (!upgradeStats.bestWin || payout > upgradeStats.bestWin.amount) {
        upgradeStats.bestWin = entry;
      }
      io.emit('upgradeStats', upgradeStats);
    }

    res.json({
      ok: true,
      win,
      multiplier: mult,
      payout,
      newBalance: user.balance,
      remaining: UPGRADE_DAILY_LIMIT - user.upgradeCount,
      stats: upgradeStats,
    });
  } catch (err) {
    console.error('upgrade error:', err);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

/* ============================================================
   POLYGON PARTITION
   ============================================================ */
function bboxOf(poly) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const v of poly) {
    if (v.x < minX) minX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.x > maxX) maxX = v.x;
    if (v.y > maxY) maxY = v.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
function polyArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i]; const p2 = poly[(i + 1) % poly.length];
    a += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(a) * 0.5;
}
function splitPolygon(poly, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const side = p => dx * (p.y - ay) - dy * (p.x - ax);
  const eps = 1e-7; const A = []; const B = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i]; const b = poly[(i + 1) % n];
    const sa = side(a); const sb = side(b);
    if (sa >= -eps) A.push(a);
    if (sa <= eps) B.push(a);
    if ((sa > eps && sb < -eps) || (sa < -eps && sb > eps)) {
      const t = sa / (sa - sb);
      const ix = a.x + (b.x - a.x) * t;
      const iy = a.y + (b.y - a.y) * t;
      const ip = { x: ix, y: iy };
      A.push(ip); B.push(ip);
    }
  }
  return [A, B];
}
function pickCut(poly, box, targetRatio) {
  const totalArea = polyArea(poly);
  if (totalArea <= 0) return null;
  const minArea = totalArea * 0.004;
  let best = null; let bestErr = Infinity;
  function tryAngle(baseAngle) {
    const angle = baseAngle + (Math.random() - 0.5) * 0.20;
    const dirX = Math.cos(angle), dirY = Math.sin(angle);
    const perpX = -dirY, perpY = dirX;
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    const range = Math.hypot(box.w, box.h) * 1.5;
    let lo = -range, hi = range;
    let localBest = null; let localErr = Infinity;
    for (let iter = 0; iter < 16; iter++) {
      const mid = (lo + hi) / 2;
      const px = cx + perpX * mid, py = cy + perpY * mid;
      const ax = px - dirX * 1000, ay = py - dirY * 1000;
      const bx = px + dirX * 1000, by = py + dirY * 1000;
      const pieces = splitPolygon(poly, ax, ay, bx, by);
      const A = pieces[0], B = pieces[1];
      if (A.length < 3 || B.length < 3) { if (mid > 0) hi = mid; else lo = mid; continue; }
      const aA = polyArea(A), aB = polyArea(B);
      const tot = aA + aB;
      if (tot < 0.0001) { if (mid > 0) hi = mid; else lo = mid; continue; }
      const ratio = aA / tot;
      const err = Math.abs(ratio - targetRatio);
      if (err < localErr && aA >= minArea && aB >= minArea) { localErr = err; localBest = pieces; }
      if (ratio > targetRatio) lo = mid; else hi = mid;
      if (localErr < 0.008) break;
    }
    if (localErr < bestErr) { bestErr = localErr; best = localBest; }
  }
  tryAngle(0); tryAngle(Math.PI / 2); tryAngle(Math.PI / 4); tryAngle(-Math.PI / 4);
  tryAngle(Math.PI / 6); tryAngle(-Math.PI / 6); tryAngle(Math.PI / 3); tryAngle(-Math.PI / 3);
  if (!best) {
    const y = box.y + box.h * (1 - targetRatio);
    const pieces = splitPolygon(poly, box.x - 10, y, box.x + box.w + 10, y);
    if (pieces[0].length >= 3 && pieces[1].length >= 3) return pieces;
    return null;
  }
  return best;
}
function partitionPoly(players, startIdx, endIdx, poly) {
  const count = endIdx - startIdx;
  if (count <= 0) return;
  if (count === 1) { players[startIdx].poly = poly; return; }
  const topBet = Math.max(players[startIdx].bet, 1);
  let restBet = 0;
  for (let i = startIdx + 1; i < endIdx; i++) restBet += Math.max(players[i].bet, 1);
  const ratio = topBet / (topBet + restBet);
  const clampedRatio = Math.max(0.015, Math.min(0.985, ratio));
  const box = bboxOf(poly);
  if (box.w < 2 || box.h < 2) { for (let i = startIdx; i < endIdx; i++) players[i].poly = poly; return; }
  const pieces = pickCut(poly, box, clampedRatio);
  if (!pieces) { for (let i = startIdx; i < endIdx; i++) players[i].poly = poly; return; }
  partitionPoly(players, startIdx, startIdx + 1, pieces[0]);
  partitionPoly(players, startIdx + 1, endIdx, pieces[1]);
}
function repartitionIceArena() {
  const players = iceRoom.players;
  if (players.length === 0) return;
  const sorted = [...players].sort((a, b) => b.bet - a.bet);
  const root = [ { x: 0, y: 0 }, { x: ICE_SIZE, y: 0 }, { x: ICE_SIZE, y: ICE_SIZE }, { x: 0, y: ICE_SIZE } ];
  partitionPoly(sorted, 0, sorted.length, root);
  const half = ICE_SIZE / 2; const scale = ICE_FIELD_SCALE;
  players.forEach(p => {
    if (!p.poly) { p.poly = root; return; }
    p.poly = p.poly.map(v => ({ x: half + (v.x - half) * scale, y: half + (v.y - half) * scale }));
  });
}
function makeIcePlayer(id, bet, name, pfp) {
  const colorIdx = iceRoom.players.length % COLORS.length;
  const p = { id, bet, name: name || 'player', pfp: pfp || '', color: COLORS[colorIdx], poly: null };
  iceRoom.players.push(p);
  repartitionIceArena();
  return p;
}
function removeIcePlayer(id) {
  const idx = iceRoom.players.findIndex(p => p.id === id);
  if (idx === -1) return;
  iceRoom.players.splice(idx, 1);
  if (iceRoom.players.length > 0) repartitionIceArena();
}

function startIceCountdown() {
  if (iceRoom.gameState !== 'idle') return;
  if (iceRoom.players.length < 2) return;
  iceRoom.gameState = 'countdown';
  iceRoom.countdownStartTime = Date.now();
}
function startIceSpin() {
  iceRoom.gameState = 'spinning';
  iceRoom.spinStartTime = Date.now();
  iceRoom.spinDuration = 2.6 + Math.random() * 1.6;
  iceRoom.spinFinalAngle = Math.random() * Math.PI * 2;
  const margin = 30;
  iceRoom.spinStartX = margin + Math.random() * (ICE_SIZE - 2 * margin);
  iceRoom.spinStartY = margin + Math.random() * (ICE_SIZE - 2 * margin);
}
function launchIcePuck() {
  iceRoom.gameState = 'sliding';
  const baseSpeed = 32;
  const speed = baseSpeed + Math.random() * 4;
  const angle = iceRoom.spinFinalAngle;
  iceRoom.puck.x = iceRoom.spinStartX;
  iceRoom.puck.y = iceRoom.spinStartY;
  iceRoom.puck.vx = Math.cos(angle) * speed;
  iceRoom.puck.vy = Math.sin(angle) * speed;
  iceRoom.slideStartTime = Date.now();
  iceRoom.lastBounceTime = 0;
}
function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function polyCentroid(poly) {
  let cx = 0, cy = 0;
  for (const v of poly) { cx += v.x; cy += v.y; }
  return { x: cx / poly.length, y: cy / poly.length };
}
function getIceWinner() {
  const px = Math.min(Math.max(iceRoom.puck.x, 0), ICE_SIZE);
  const py = Math.min(Math.max(iceRoom.puck.y, 0), ICE_SIZE);
  for (const p of iceRoom.players) { if (p.poly && pointInPoly(px, py, p.poly)) return p; }
  let closest = null, minDist = Infinity;
  for (const p of iceRoom.players) {
    if (!p.poly) continue;
    const c = polyCentroid(p.poly);
    const d = Math.hypot(px - c.x, py - c.y);
    if (d < minDist) { minDist = d; closest = p; }
  }
  return closest;
}
async function endIceGame() {
  if (iceRoom.gameState === 'finished') return;
  iceRoom.gameState = 'finished';
  const winner = getIceWinner();
  let payload = null;
  if (winner) {
    const totalPot = iceRoom.pot;
    const winnerBet = winner.bet;
    const losersBets = totalPot - winnerBet;
    const commission = Math.floor(losersBets * 0.02);
    const winnings = totalPot - commission;
    payload = { winnerId: winner.id, winnerName: winner.name, winnerPfp: winner.pfp, winnings,
      multiplier: +(winnings / winnerBet).toFixed(2), puckX: iceRoom.puck.x, puckY: iceRoom.puck.y };
    iceRoom.recentWinners.unshift({ name: winner.name, pfp: winner.pfp, amount: winnings });
    if (iceRoom.recentWinners.length > 8) iceRoom.recentWinners.length = 8;
    if (!isBot(winner.id)) {
      try {
        const winnerUser = await getUser(winner.id);
        if (winnerUser) {
          winnerUser.balance += winnings;
          winnerUser.wins += 1;
          winnerUser['q_ice_win_1_p'] = (winnerUser['q_ice_win_1_p'] | 0) + 1;
          await saveUser(winnerUser);
        }
      } catch (err) { console.error('endIceGame: credit winner:', err); }
    }
    for (const p of iceRoom.players) {
      if (p.id === winner.id) continue;
      if (!isBot(p.id)) {
        try { const u = await getUser(p.id); if (u) { u.losses += 1; await saveUser(u); } }
        catch (err) { console.error('endIceGame: loser stats:', p.id, err); }
      }
    }
    try { await addWinToHistory(winner.id, winner.name, winner.pfp, winnings); }
    catch (err) { console.error('endIceGame: history:', err); }
  }
  io.emit('iceRoundEnd', payload);
  setTimeout(() => {
    iceRoom.players = [];
    iceRoom.pot = 0;
    iceRoom.puck = { x: ICE_SIZE / 2, y: ICE_SIZE / 2, vx: 0, vy: 0 };
    iceRoom.gameState = 'idle';
    iceRoom.lastBounceTime = 0;
    botIds.clear();
    botCounter = 0;
  }, 3000);
}
function updateIcePhysics(dt) {
  if (iceRoom.gameState !== 'sliding') return;
  const totalPts = ICE_PERIMETER.length;
  const subSteps = 8;
  const subDt = dt / subSteps;
  const puck = iceRoom.puck;
  const puckRadius = 14;
  const FRICTION_BASE    = 0.990;
  const ROLLING_FRICTION = 0.985;
  const RESTITUTION      = 0.78;
  const HOLD_MS          = 3200;
  const PR = puckRadius * puckRadius;
  for (let step = 0; step < subSteps; step++) {
    puck.x += puck.vx * subDt * 60;
    puck.y += puck.vy * subDt * 60;
    let iter = 0; const maxIter = 8;
    while (iter < maxIter) {
      let deepestOverlap = 0; let bestNx = 0, bestNy = 0; let bestNearX = 0, bestNearY = 0;
      for (let i = 0; i < totalPts; i++) {
        const j = (i + 1) % totalPts;
        const ax = ICE_PERIMETER[i].x, ay = ICE_PERIMETER[i].y;
        const bx = ICE_PERIMETER[j].x, by = ICE_PERIMETER[j].y;
        const dx = bx - ax, dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) continue;
        let t = ((puck.x - ax) * dx + (puck.y - ay) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const nearX = ax + t * dx, nearY = ay + t * dy;
        const distX = puck.x - nearX, distY = puck.y - nearY;
        const distSq = distX * distX + distY * distY;
        if (distSq < PR && distSq > 0.000001) {
          const dist = Math.sqrt(distSq);
          const overlap = puckRadius - dist;
          if (overlap > deepestOverlap) {
            deepestOverlap = overlap;
            bestNx = distX / dist; bestNy = distY / dist;
            bestNearX = nearX; bestNearY = nearY;
          }
        }
      }
      if (deepestOverlap <= 0.0001) break;
      puck.x += bestNx * deepestOverlap;
      puck.y += bestNy * deepestOverlap;
      const vn = puck.vx * bestNx + puck.vy * bestNy;
      if (vn < 0) {
        puck.vx -= (1 + RESTITUTION) * vn * bestNx;
        puck.vy -= (1 + RESTITUTION) * vn * bestNy;
        const nowMs = Date.now();
        if (nowMs - iceRoom.lastBounceTime > 80) {
          iceRoom.lastBounceTime = nowMs;
          const speedAtHit = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
          if (speedAtHit > 1.5) {
            io.emit('icePuckBounce', { x: bestNearX, y: bestNearY, intensity: Math.min(1, speedAtHit / 20) });
          }
        }
      }
      iter++;
    }
    const elapsed = Date.now() - iceRoom.slideStartTime;
    if (elapsed < HOLD_MS) {
      const decay = Math.pow(0.9999, subDt * 60);
      puck.vx *= decay; puck.vy *= decay;
    } else {
      const friction = FRICTION_BASE + (Math.random() - 0.5) * 0.0006;
      const decay = Math.pow(friction, subDt * 60);
      puck.vx *= decay; puck.vy *= decay;
      const speed2 = puck.vx * puck.vx + puck.vy * puck.vy;
      if (speed2 < 0.8) {
        const rollDecay = Math.pow(ROLLING_FRICTION, subDt * 60);
        puck.vx *= rollDecay; puck.vy *= rollDecay;
      }
    }
  }
  const finalSpeed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
  if (finalSpeed < 0.05) { puck.vx = 0; puck.vy = 0; endIceGame(); }
}
function broadcastIceState() {
  io.emit('iceState', {
    gameState: iceRoom.gameState,
    pot: iceRoom.pot,
    countdownStartTime: iceRoom.countdownStartTime,
    spinStartTime: iceRoom.spinStartTime,
    spinDuration: iceRoom.spinDuration,
    spinFinalAngle: iceRoom.spinFinalAngle,
    spinStartX: iceRoom.spinStartX, spinStartY: iceRoom.spinStartY,
    puck: { x: iceRoom.puck.x, y: iceRoom.puck.y, vx: iceRoom.puck.vx, vy: iceRoom.puck.vy },
    players: iceRoom.players.map(p => ({
      id: p.id, name: p.name, pfp: p.pfp, bet: p.bet, color: p.color,
      poly: p.poly ? p.poly.map(v => ({ x: v.x, y: v.y })) : null,
    })),
  });
}
function computeRadii() {
  const totalBet = room.players.reduce((s, p) => s + p.bet, 0);
  if (totalBet === 0) return;
  const minR = 18, maxR = 52;
  room.players.forEach(p => {
    const ratio = p.bet / totalBet;
    const adjustedRatio = Math.pow(ratio, 1.8);
    const r = minR + adjustedRatio * (maxR - minR);
    p.targetRadius = Math.min(Math.max(r, minR), maxR);
    p.mass = p.targetRadius * p.targetRadius * 1.2;
    p.displayRadius = p.targetRadius;
  });
}
function makePlayer(id, bet, name, pfp) {
  const half = ARENA_SIZE / 2;
  const radius = 18;
  let x, y, attempts = 0, overlap = true;
  while (overlap && attempts < 100) {
    x = half + (Math.random() - 0.5) * (ARENA_SIZE * 0.6);
    y = half + (Math.random() - 0.5) * (ARENA_SIZE * 0.6);
    overlap = room.players.some(p => Math.hypot(p.x - x, p.y - y) < p.radius + radius + 5);
    attempts++;
  }
  const colorIdx = room.players.length % COLORS.length;
  const p = { id, bet, name: name || 'player', pfp: pfp || '',
    color: COLORS[colorIdx], radius, displayRadius: radius, targetRadius: radius,
    mass: radius * radius * 1.2, x: x ?? half, y: y ?? half, vx: 0, vy: 0, alive: true };
  room.players.push(p);
  computeRadii();
  return p;
}
function startCountdown() {
  if (room.gameState !== 'idle') return;
  if (getAlive().length < 2) return;
  room.gameState = 'countdown';
  room.countdownStartTime = Date.now();
}
function startPrestart() { room.gameState = 'prestart'; room.prestartTimer = 2.0; }
function startGame() {
  room.gameState = 'playing';
  room.gameTime = 0;
  room.openingTimer = 0;
  room.opening = null;
  const alive = getAlive();
  const half = ARENA_SIZE / 2;
  alive.forEach((p, i) => {
    const angle = (i / alive.length) * Math.PI * 2 + Math.random() * 0.3;
    const baseSpeed = speedForRadius(p.displayRadius || p.radius);
    const speed = baseSpeed * (0.8 + Math.random() * 0.4);
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.x = half + Math.cos(angle) * (ARENA_SIZE * 0.15 + Math.random() * 15);
    p.y = half + Math.sin(angle) * (ARENA_SIZE * 0.15 + Math.random() * 15);
    p.alive = true;
  });
  room.openingTimer = 3.0 + Math.random() * 3.5;
}
async function endGame(winnerId) {
  if (room.gameState === 'finished') return;
  room.gameState = 'finished';
  const winner = getPlayer(winnerId);
  let payload = null;
  if (winner) {
    const totalPot = room.pot;
    const winnerBet = winner.bet;
    const losersBets = totalPot - winnerBet;
    const commission = Math.floor(losersBets * 0.02);
    const winnings = totalPot - commission;
    payload = { winnerId: winner.id, winnerName: winner.name, winnerPfp: winner.pfp, winnings,
      multiplier: +(winnings / winnerBet).toFixed(2) };
    room.recentWinners.unshift({ name: winner.name, pfp: winner.pfp, amount: winnings });
    if (room.recentWinners.length > 8) room.recentWinners.length = 8;
    try {
      const winnerUser = await getUser(winner.id);
      if (winnerUser) { winnerUser.balance += winnings; winnerUser.wins += 1; await saveUser(winnerUser); }
    } catch (err) { console.error('endGame: credit winner:', err); }
    for (const p of room.players) {
      if (p.id === winner.id) continue;
      try { const u = await getUser(p.id); if (u) { u.losses += 1; await saveUser(u); } }
      catch (err) { console.error('endGame: loser stats:', p.id, err); }
    }
    try { await addWinToHistory(winner.id, winner.name, winner.pfp, winnings); }
    catch (err) { console.error('endGame: history:', err); }
  }
  io.to(room.id).emit('roundEnd', payload);
  setTimeout(() => { room.players = []; room.pot = 0; room.opening = null; room.gameState = 'idle'; }, 3000);
}
function isInGap(idx) {
  const opening = room.opening;
  if (!opening || opening.state !== 'open') return false;
  const { startIdx, endIdx } = opening;
  return startIdx < endIdx ? (idx >= startIdx && idx <= endIdx) : (idx >= startIdx || idx <= endIdx);
}
function updatePhysics(dt) {
  if (room.gameState !== 'playing') return;
  room.gameTime += dt;
  const alive = getAlive();
  if (alive.length <= 1) {
    if (alive.length === 1) endGame(alive[0].id);
    else { room.gameState = 'idle'; room.players = []; room.opening = null; }
    return;
  }
  const half = ARENA_SIZE / 2;
  const totalPts = PERIMETER.length;
  room.openingTimer -= dt;
  if (room.openingTimer <= 0) {
    if (!room.opening) {
      const gameTime = room.gameTime;
      let minGap, maxGap;
      if (gameTime < 5) { [minGap, maxGap] = [0.05, 0.16]; }
      else if (gameTime < 12) { [minGap, maxGap] = [0.12, 0.26]; }
      else { [minGap, maxGap] = [0.20, 0.42]; }
      const gapSize = Math.floor((minGap + Math.random() * (maxGap - minGap)) * totalPts);
      const startIdx = Math.floor(Math.random() * totalPts);
      const endIdx = (startIdx + gapSize) % totalPts;
      const flashInterval = 0.18 + Math.random() * 0.14;
      room.opening = { startIdx, endIdx, flashCount: 0, flashTimer: 0, flashInterval, state: 'flashing' };
      room.openingTimer = 3.0 + Math.random() * 3.5;
    } else { room.opening = null; room.openingTimer = 1.2 + Math.random() * 2.6; }
  }
  const opening = room.opening;
  if (opening && opening.state === 'flashing') {
    opening.flashTimer += dt;
    if (opening.flashTimer > (opening.flashInterval || 0.25)) {
      opening.flashTimer = 0;
      opening.flashCount++;
      if (opening.flashCount >= 4) opening.state = 'open';
    }
  }
  const SUBSTEPS = 10;
  const DRAG_PER_SEC = 0.6;
  const RESTITUTION_WALL = 1.0;
  const RESTITUTION_PLAYER = 0.9;
  const FRICTION_PLAYER = 0.05;
  const subDt = dt / SUBSTEPS;
  for (let step = 0; step < SUBSTEPS; step++) {
    const decay = 1 - DRAG_PER_SEC * subDt;
    alive.forEach(p => { p.x += p.vx * subDt * 60; p.y += p.vy * subDt * 60; p.vx *= decay; p.vy *= decay; });
    alive.forEach(p => {
      const radius = p.displayRadius || p.radius;
      for (let i = 0; i < totalPts; i++) {
        const j = (i + 1) % totalPts;
        if (opening && opening.state === 'open' && isInGap(i) && isInGap(j)) continue;
        const ax = PERIMETER[i].x, ay = PERIMETER[i].y;
        const bx = PERIMETER[j].x, by = PERIMETER[j].y;
        const dx = bx - ax, dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) continue;
        let t = ((p.x - ax) * dx + (p.y - ay) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const nearX = ax + t * dx, nearY = ay + t * dy;
        const distX = p.x - nearX, distY = p.y - nearY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < radius) {
          const nx = distX / dist, ny = distY / dist;
          const overlap = radius - dist;
          p.x += nx * overlap; p.y += ny * overlap;
          const vn = p.vx * nx + p.vy * ny;
          if (vn < 0) { p.vx -= (1 + RESTITUTION_WALL) * vn * nx; p.vy -= (1 + RESTITUTION_WALL) * vn * ny; }
          break;
        }
      }
      if (opening && opening.state === 'open') {
        const cx = half, cy = half;
        const dx = p.x - cx, dy = p.y - cy;
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        const escapeThreshold = half * 1.12 + radius;
        if (distFromCenter > escapeThreshold) {
          let nearestGapIdx = -1, minDist = Infinity;
          for (let i = 0; i < totalPts; i++) {
            if (isInGap(i)) {
              const d = (p.x - PERIMETER[i].x) ** 2 + (p.y - PERIMETER[i].y) ** 2;
              if (d < minDist) { minDist = d; nearestGapIdx = i; }
            }
          }
          if (nearestGapIdx >= 0) {
            const angle = Math.atan2(dy, dx);
            const gapAngle = Math.atan2(PERIMETER[nearestGapIdx].y - cy, PERIMETER[nearestGapIdx].x - cx);
            let diff = Math.abs(angle - gapAngle);
            diff = Math.min(diff, 2 * Math.PI - diff);
            const vOut = p.vx * dx + p.vy * dy;
            if (diff < 0.8 && vOut > 0) { p.alive = false; return; }
          }
        }
      }
    });
    const stillAlive = alive.filter(p => p.alive);
    for (let i = 0; i < stillAlive.length; i++) {
      for (let j = i + 1; j < stillAlive.length; j++) {
        const a = stillAlive[i], b = stillAlive[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rA = a.displayRadius || a.radius, rB = b.displayRadius || b.radius;
        const minDist = rA + rB;
        if (dist < minDist && dist > 0.001) {
          const nx = dx / dist, ny = dy / dist;
          const overlap = (minDist - dist) * 0.5;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
          const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
          const dvn = dvx * nx + dvy * ny;
          if (dvn > 0) {
            const impulse = (1 + RESTITUTION_PLAYER) * dvn / (1 / a.mass + 1 / b.mass);
            a.vx -= (impulse / a.mass) * nx; a.vy -= (impulse / a.mass) * ny;
            b.vx += (impulse / b.mass) * nx; b.vy += (impulse / b.mass) * ny;
            const vt = dvx * (-ny) + dvy * nx;
            const frictionImpulse = FRICTION_PLAYER * vt / (1 / a.mass + 1 / b.mass);
            a.vx -= (frictionImpulse / a.mass) * (-ny); a.vy -= (frictionImpulse / a.mass) * nx;
            b.vx += (frictionImpulse / b.mass) * (-ny); b.vy += (frictionImpulse / b.mass) * nx;
          }
        }
      }
    }
    stillAlive.forEach(p => {
      const maxSp = speedForRadius(p.displayRadius || p.radius);
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > maxSp) { p.vx = (p.vx / sp) * maxSp; p.vy = (p.vy / sp) * maxSp; }
    });
  }
  room.players.forEach(p => {
    const diff = p.targetRadius - p.displayRadius;
    if (Math.abs(diff) > 0.01) p.displayRadius += diff * Math.min(1, 8.0 * dt);
  });
}

const TICK_HZ = 60;
const STATE_EVERY = 3;
let tickCount = 0;
let lastTick = Date.now();

setInterval(() => {
  const now = Date.now();
  const dt = Math.min((now - lastTick) / 1000, 0.1);
  lastTick = now;
  try {
    if (room.gameState === 'playing') updatePhysics(dt);
    else if (room.gameState === 'countdown') {
      if ((now - room.countdownStartTime) / 1000 >= 10.0) startPrestart();
    } else if (room.gameState === 'prestart') {
      room.prestartTimer -= dt;
      if (room.prestartTimer <= 0) startGame();
    } else if (room.gameState === 'idle') {
      if (getAlive().length >= 2) startCountdown();
    }
    const icePrev = iceRoom.gameState;
    if (iceRoom.gameState === 'sliding') updateIcePhysics(dt);
    else if (iceRoom.gameState === 'countdown') {
      if ((now - iceRoom.countdownStartTime) / 1000 >= 10.0) startIceSpin();
    } else if (iceRoom.gameState === 'spinning') {
      if ((now - iceRoom.spinStartTime) / 1000 >= iceRoom.spinDuration) launchIcePuck();
    } else if (iceRoom.gameState === 'idle') {
      if (iceRoom.players.length >= 2) startIceCountdown();
    }
    tickCount++;
    if (iceRoom.gameState === 'sliding') {
      io.emit('icePuck', { x: iceRoom.puck.x, y: iceRoom.puck.y, vx: iceRoom.puck.vx, vy: iceRoom.puck.vy, g: 'sliding' });
    }
    if (iceRoom.gameState !== icePrev || tickCount % STATE_EVERY === 0) {
      broadcastState();
      broadcastIceState();
    }
  } catch (err) { console.error('Game loop error:', err); }
}, 1000 / TICK_HZ);

function broadcastState() {
  io.to(room.id).emit('state', {
    gameState: room.gameState,
    pot: room.pot,
    countdownStartTime: room.countdownStartTime,
    players: room.players.map(p => ({
      id: p.id, name: p.name, pfp: p.pfp, bet: p.bet, color: p.color,
      x: p.x, y: p.y, displayRadius: p.displayRadius, alive: p.alive,
    })),
    opening: room.opening,
  });
}

io.on('connection', (socket) => {
  let userId = null;
  socket.on('join', async ({ initData }, ack) => {
    try {
      let tgUser = verifyInitData(initData);
      if (!tgUser && ALLOW_DEV_LOGIN) tgUser = { id: 'dev_' + socket.id.slice(0, 6), username: 'dev_player', photo_url: '' };
      if (!tgUser) { ack?.({ ok: false, error: 'Could not verify Telegram login.' }); return; }
      userId = String(tgUser.id);
      socket.data.userId = userId;
      socket.join(room.id);
      const user = await getUser(userId, {
        username: tgUser.username || tgUser.first_name || 'player',
        pfp: tgUser.photo_url || '',
      });
      if (user.banned) { ack?.({ ok: false, error: 'You have been banned.' }); return; }
      const icePlayers = iceRoom.players.map(p => ({
        id: p.id, name: p.name, pfp: p.pfp, bet: p.bet, color: p.color,
        poly: p.poly ? p.poly.map(v => ({ x: v.x, y: v.y })) : null,
      }));
      ack?.({
        ok: true,
        user: { ...user, winHistory: user.winHistory || [],
          anonymousEnabled: user.anonymousEnabled || false,
          anonymousName: user.anonymousName || '',
          anonymousUsername: user.anonymousUsername || '',
          anonymousPhone: user.anonymousPhone || '',
          hidePfp: user.hidePfp || false,
          xp: user.xp || 0,
          upgradeDay: user.upgradeDay || '',
          upgradeCount: user.upgradeCount || 0 },
        level: getLevelInfo(user),
        quests: buildQuestList(user),
        arena: { size: ARENA_SIZE, cornerRadius: CORNER_RADIUS, perimeter: PERIMETER },
        iceArena: { size: ICE_SIZE, cornerRadius: ICE_CORNER_RADIUS, perimeter: ICE_PERIMETER },
        recentWinners: room.recentWinners,
        iceRecentWinners: iceRoom.recentWinners,
        icePlayers, icePot: iceRoom.pot,
        upgradeStats,
        upgradeLimits: { maxBet: UPGRADE_MAX_BET, minBet: UPGRADE_MIN_BET, dailyLimit: UPGRADE_DAILY_LIMIT },
      });
      broadcastState();
    } catch (err) { console.error('Join error:', err); ack?.({ ok: false, error: 'Internal error' }); }
  });

  socket.on('placeBet', async ({ amount }, ack) => {
    try {
      if (!userId) return ack?.({ ok: false, error: 'Not joined.' });
      if (!['idle', 'countdown', 'prestart'].includes(room.gameState)) return ack?.({ ok: false, error: 'Round already in progress.' });
      const amt = Math.max(10, Math.floor(Number(amount) || 0));
      const user = await getUser(userId);
      if (!user || amt > user.balance) return ack?.({ ok: false, error: 'Insufficient balance.' });
      if (user.banned) return ack?.({ ok: false, error: 'You are banned.' });
      if (room.players.length >= MAX_PLAYERS && !getPlayer(userId)) return ack?.({ ok: false, error: 'Arena is full.' });
      user.balance -= amt;
      user.xp = (user.xp | 0) + amt;
      await saveUser(user);
      const existing = getPlayer(userId);
      if (existing) { existing.bet += amt; computeRadii(); }
      else { makePlayer(userId, amt, user.username, user.pfp); }
      room.pot += amt;
      ack?.({ ok: true, balance: user.balance });
      broadcastState();
    } catch (err) { console.error('Bet error:', err); ack?.({ ok: false, error: 'Internal error' }); }
  });

  socket.on('leaderboard', async (_, ack) => {
    try {
      const top = await topPlayers(20);
      const all = await getAllUsers();
      const map = new Map(all.map(u => [String(u.id), u]));
      const enriched = top.map(t => {
        const full = map.get(String(t.id));
        const base = full || t;
        const lvl = getLevelInfo(base);
        if (!full) return { ...t, level: lvl.level, rank: lvl.rank };
        return { ...t,
          anonymousName: full.anonymousName || '',
          anonymousUsername: full.anonymousUsername || '',
          anonymousPhone: full.anonymousPhone || '',
          anonymousEnabled: !!full.anonymousEnabled,
          level: lvl.level, rank: lvl.rank };
      });
      ack?.({ ok: true, top: enriched });
    } catch (err) { console.error('Leaderboard error:', err); ack?.({ ok: false, error: 'Internal error' }); }
  });

  socket.on('icePlaceBet', async ({ amount }, ack) => {
    try {
      if (!userId) return ack?.({ ok: false, error: 'Not joined.' });
      if (!['idle', 'countdown'].includes(iceRoom.gameState)) return ack?.({ ok: false, error: 'Round already in progress.' });
      const amt = Math.max(10, Math.floor(Number(amount) || 0));
      const user = await getUser(userId);
      if (!user || amt > user.balance) return ack?.({ ok: false, error: 'Insufficient balance.' });
      if (user.banned) return ack?.({ ok: false, error: 'You are banned.' });
      if (iceRoom.players.length >= MAX_PLAYERS && !getIcePlayer(userId)) return ack?.({ ok: false, error: 'Rink is full.' });
      user.balance -= amt;
      user.xp = (user.xp | 0) + amt;
      user['q_ice_bets_5_p'] = (user['q_ice_bets_5_p'] | 0) + 1;
      await saveUser(user);
      const existing = getIcePlayer(userId);
      if (existing) { existing.bet += amt; repartitionIceArena(); }
      else { makeIcePlayer(userId, amt, user.username, user.pfp); }
      iceRoom.pot += amt;
      ack?.({ ok: true, balance: user.balance });
      broadcastIceState();
    } catch (err) { console.error('Ice bet error:', err); ack?.({ ok: false, error: 'Internal error' }); }
  });

  socket.on('disconnect', () => { if (userId) console.log(`User ${userId} disconnected.`); });
});

/* ============================================================
   ADMIN
   ============================================================ */
const ADMIN_HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Admin Panel</title>
<style>body{background:#0a0a12;color:#eee;font-family:sans-serif;padding:20px;max-width:1000px;margin:auto}
table{width:100%;border-collapse:collapse;margin:10px 0}th,td{padding:8px;border:1px solid #333;text-align:left}
button{padding:6px 12px;margin:2px;border:none;border-radius:6px;cursor:pointer;background:#4CAF50;color:#fff}
button.danger{background:#e06060}button.warning{background:#f0a030}
input{padding:6px;border-radius:4px;border:1px solid #444;background:#222;color:#fff}
.auth{display:flex;gap:10px;margin-bottom:20px}.section{border:1px solid #333;padding:15px;margin-top:15px;border-radius:8px}
.bot-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0}.bot-row input{width:120px}.bot-row button{background:#5b8def}
.switch-wrap{display:flex;align-items:center;gap:12px;margin:6px 0}
.switch-wrap .switch{position:relative;width:50px;height:26px;flex-shrink:0;cursor:pointer}
.switch-wrap .switch input{opacity:0;width:0;height:0}
.switch-wrap .switch .slider{position:absolute;inset:0;background:#444;border-radius:999px;transition:0.3s}
.switch-wrap .switch .slider::before{content:"";position:absolute;width:20px;height:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:0.3s}
.switch-wrap .switch input:checked+.slider{background:#5b8def}
.switch-wrap .switch input:checked+.slider::before{transform:translateX(24px)}
.notification-row{display:flex;gap:10px;margin:8px 0;align-items:center}
.notification-row input{flex:1;padding:8px 12px;border-radius:6px;border:1px solid #444;background:#222;color:#fff}
.notification-row button{padding:6px 16px}</style></head><body>
<h2>dllump Admin</h2>
<div class="auth"><input id="secret" placeholder="Admin Secret" type="password"/><button onclick="auth()">Authenticate</button></div>
<div id="content" style="display:none">
<div class="section"><h3>Send Notification</h3><div class="notification-row"><input id="notifInput" placeholder="Type message..."/><button onclick="sendNotification()">Send</button></div></div>
<div class="section"><h3>Auto Bot</h3><div class="switch-wrap"><span style="color:#888;">Auto-spawn bots</span>
<label class="switch"><input type="checkbox" id="autoBotToggle" onchange="toggleAutoBot(this.checked)"/><span class="slider"></span></label>
<span id="autoBotStatus" style="font-size:12px;color:#888;">disabled</span></div></div>
<div class="section"><h3>Rare Roll Mode</h3><div class="switch-wrap"><span style="color:#888;">90% rare anon numbers</span>
<label class="switch"><input type="checkbox" id="rareRollToggle" onchange="toggleRareRoll(this.checked)"/><span class="slider"></span></label>
<span id="rareRollStatus" style="font-size:12px;color:#888;">disabled</span></div></div>
<div class="section"><h3>Bot Spawn</h3><div class="bot-row">
<input id="botBet" placeholder="Bet amount" value="100" type="number" min="10"/>
<input id="botCount" placeholder="Count" value="1" type="number" min="1" max="8" style="width:80px"/>
<button onclick="spawnBots()">Spawn Bots</button><button class="danger" onclick="removeBots()">Remove All Bots</button></div></div>
<div class="section"><h3>Players</h3><button onclick="refreshPlayers()">Refresh Players</button><div id="players"></div></div>
<div class="section"><h3>Actions</h3><button class="warning" onclick="resetTop()">Reset Top</button>
<button class="warning" onclick="resetEconomy()">Reset Economy</button><button class="danger" onclick="wipeAll()">Wipe All Data</button></div>
<div class="section"><h3>Promo Codes</h3><p>Generate new code:</p>
<input id="promoAmount" placeholder="Amount" value="100"/><input id="promoCode" placeholder="Custom code"/>
<input id="promoMaxUses" placeholder="Max uses" value="1"/><button onclick="generatePromo()">Generate Promo</button><div id="promoCodes"></div></div>
<div class="section"><h3>Individual Player</h3>
<input id="addUserId" placeholder="User ID"/><input id="addAmount" placeholder="Amount"/><button onclick="addMoney()">Add Money</button><br/>
<input id="setUserId" placeholder="User ID"/><input id="setAmount" placeholder="New Balance"/><button onclick="setMoney()">Set Balance</button><br/>
<input id="banUserId" placeholder="User ID"/><button class="danger" onclick="banPlayer()">Ban/Unban</button><br/>
<input id="resetUserId" placeholder="User ID"/><button class="warning" onclick="resetPlayer()">Reset Player</button></div></div>
<script>
const ADMIN_SECRET='${ADMIN_SECRET}';
async function fetchAdmin(path,method='GET',body=null){const h={'admin-secret':document.getElementById('secret').value};
if(body)h['Content-Type']='application/json';
const r=await fetch('/admin/api'+path,{method,headers:h,body:body?JSON.stringify(body):null});return r.json();}
function auth(){if(document.getElementById('secret').value===ADMIN_SECRET){document.getElementById('content').style.display='block';
refreshPlayers();refreshPromoCodes();fetchAutoBotStatus();fetchRareRollStatus();}else alert('Wrong secret');}
async function fetchAutoBotStatus(){const d=await fetchAdmin('/auto-bot-status');document.getElementById('autoBotToggle').checked=d.enabled;
document.getElementById('autoBotStatus').textContent=d.enabled?'enabled':'disabled';}
async function fetchRareRollStatus(){const d=await fetchAdmin('/rare-roll-status');document.getElementById('rareRollToggle').checked=d.enabled;
document.getElementById('rareRollStatus').textContent=d.enabled?'enabled':'disabled';}
async function toggleAutoBot(e){const d=await fetchAdmin('/toggle-auto-bot','POST',{enabled:e});
if(d.ok)document.getElementById('autoBotStatus').textContent=d.enabled?'enabled':'disabled';else alert('Error: '+d.error);}
async function toggleRareRoll(e){const d=await fetchAdmin('/toggle-rare-roll','POST',{enabled:e});
if(d.ok)document.getElementById('rareRollStatus').textContent=d.enabled?'enabled':'disabled';else alert('Error: '+d.error);}
async function sendNotification(){const m=document.getElementById('notifInput').value.trim();if(!m){alert('Enter a message');return;}
const d=await fetchAdmin('/send-notification','POST',{message:m});if(d.ok){alert('Sent!');document.getElementById('notifInput').value='';}else alert('Error: '+d.error);}
async function refreshPlayers(){const d=await fetchAdmin('/players');const p=d.players||[];
let h='<table><tr><th>ID</th><th>Username</th><th>Balance</th><th>Wins</th><th>Losses</th><th>Banned</th><th>Actions</th></tr>';
p.forEach(x=>{h+=\`<tr><td>\${x.id}</td><td>\${x.username}</td><td>\${x.balance}</td><td>\${x.wins}</td><td>\${x.losses}</td><td>\${x.banned?'YES':''}</td><td><button onclick="banPlayer('\${x.id}')">Toggle Ban</button></td></tr>\`;});
h+='</table>';document.getElementById('players').innerHTML=h;}
async function refreshPromoCodes(){const d=await fetchAdmin('/promo-codes');const c=d.codes||[];
let h='<table><tr><th>Code</th><th>Amount</th><th>Uses</th><th>Max</th><th>Actions</th></tr>';
c.forEach(x=>{h+=\`<tr><td>\${x.code}</td><td>\${x.amount}</td><td>\${x.usedCount}</td><td>\${x.maxUses}</td><td><button onclick="deletePromo('\${x.code}')">Delete</button></td></tr>\`;});
h+='</table>';document.getElementById('promoCodes').innerHTML=h;}
async function spawnBots(){const b=parseInt(document.getElementById('botBet').value)||100;const c=parseInt(document.getElementById('botCount').value)||1;
if(b<10||c<1||c>8){alert('Bet min 10, count 1-8');return;}
const d=await fetchAdmin('/spawn-bot','POST',{bet:b,count:c});if(d.ok)alert('Spawned '+d.spawned+' bots!');else alert('Error: '+d.error);refreshPlayers();}
async function removeBots(){if(!confirm('Remove all bots?'))return;const d=await fetchAdmin('/remove-bots','POST');
if(d.ok)alert('Removed '+d.removed+' bots');refreshPlayers();}
async function resetTop(){if(confirm('Reset wins/losses?')){await fetchAdmin('/reset-top','POST');refreshPlayers();}}
async function resetEconomy(){if(confirm('Reset balances to 50?')){await fetchAdmin('/reset-money','POST');refreshPlayers();}}
async function wipeAll(){if(confirm('Wipe ALL data?')){await fetchAdmin('/wipe','POST');refreshPlayers();}}
async function addMoney(){const id=document.getElementById('addUserId').value;const a=parseInt(document.getElementById('addAmount').value);
if(!id||!a)return;await fetchAdmin('/add-money','POST',{id,amount:a});refreshPlayers();}
async function setMoney(){const id=document.getElementById('setUserId').value;const a=parseInt(document.getElementById('setAmount').value);
if(!id||isNaN(a))return;await fetchAdmin('/set-money','POST',{id,amount:a});refreshPlayers();}
async function banPlayer(id){const u=id||document.getElementById('banUserId').value;if(!u)return;
await fetchAdmin('/ban','POST',{id:u});refreshPlayers();}
async function resetPlayer(){const id=document.getElementById('resetUserId').value;if(!id)return;
if(!confirm('Reset stats for '+id+'?'))return;await fetchAdmin('/reset-player','POST',{id});refreshPlayers();}
async function generatePromo(){const a=parseInt(document.getElementById('promoAmount').value)||100;
const c=document.getElementById('promoCode').value||null;const m=parseInt(document.getElementById('promoMaxUses').value)||1;
const d=await fetchAdmin('/create-promo','POST',{amount:a,code:c,maxUses:m});
if(d.ok){alert('Promo: '+d.code);refreshPromoCodes();}else alert('Error: '+d.error);}
async function deletePromo(code){if(!confirm('Delete '+code+'?'))return;await fetchAdmin('/delete-promo','POST',{code});refreshPromoCodes();}
</script></body></html>`;

function adminAuth(req, res, next) {
  const secret = req.headers['admin-secret'] || req.query.secret;
  if (secret !== ADMIN_SECRET) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  next();
}
app.get('/admin', (req, res) => res.send(ADMIN_HTML));

app.post('/admin/api/toggle-auto-bot', adminAuth, (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') return res.status(400).json({ ok: false, error: 'Invalid' });
  autoBotEnabled = enabled;
  res.json({ ok: true, enabled: autoBotEnabled });
});
app.get('/admin/api/auto-bot-status', adminAuth, (req, res) => res.json({ enabled: autoBotEnabled }));
app.post('/admin/api/toggle-rare-roll', adminAuth, (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') return res.status(400).json({ ok: false, error: 'Invalid' });
  rareRollEnabled = enabled;
  res.json({ ok: true, enabled: rareRollEnabled });
});
app.get('/admin/api/rare-roll-status', adminAuth, (req, res) => res.json({ enabled: rareRollEnabled }));
app.post('/admin/api/send-notification', adminAuth, (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0)
    return res.status(400).json({ ok: false, error: 'Missing message' });
  io.emit('notification', { message: message.trim(), timestamp: Date.now() });
  res.json({ ok: true });
});
app.get('/admin/api/players', adminAuth, async (req, res) => {
  try { res.json({ players: await getAllUsers() }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/reset-money', adminAuth, async (req, res) => {
  try { const users = await getAllUsers(); for (const u of users) { u.balance = 50; await saveUser(u); } res.json({ ok: true }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/reset-top', adminAuth, async (req, res) => {
  try { const users = await getAllUsers(); for (const u of users) { u.wins = 0; u.losses = 0; await saveUser(u); } res.json({ ok: true }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/wipe', adminAuth, async (req, res) => {
  try { const all = await getAllUsers(); for (const u of all) { u.balance = 50; u.wins = 0; u.losses = 0; u.banned = false; u.winHistory = []; u.upgradeCount = 0; u.upgradeDay = ''; await saveUser(u); } res.json({ ok: true }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/add-money', adminAuth, async (req, res) => {
  try { const { id, amount } = req.body;
    if (!id || !amount || isNaN(amount)) return res.status(400).json({ ok: false, error: 'Invalid' });
    const user = await getUser(id); if (!user) return res.status(404).json({ ok: false, error: 'Not found' });
    user.balance += amount; await saveUser(user); res.json({ ok: true, balance: user.balance });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/set-money', adminAuth, async (req, res) => {
  try { const { id, amount } = req.body;
    if (!id || isNaN(amount) || amount < 0) return res.status(400).json({ ok: false, error: 'Invalid' });
    const user = await getUser(id); if (!user) return res.status(404).json({ ok: false, error: 'Not found' });
    user.balance = amount; await saveUser(user); res.json({ ok: true, balance: user.balance });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/ban', adminAuth, async (req, res) => {
  try { const { id } = req.body;
    if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });
    const user = await getUser(id); if (!user) return res.status(404).json({ ok: false, error: 'Not found' });
    user.banned = !user.banned; await saveUser(user); res.json({ ok: true, banned: user.banned });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/reset-player', adminAuth, async (req, res) => {
  try { const { id } = req.body;
    if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });
    const ok = await resetPlayer(id);
    if (!ok) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, message: 'Player stats reset' });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/create-promo', adminAuth, async (req, res) => {
  try { const { amount, code, maxUses } = req.body;
    if (!amount || isNaN(amount) || amount < 1) return res.status(400).json({ ok: false, error: 'Invalid' });
    const promo = await createPromoCode(amount, code || null, maxUses || 1);
    res.json({ ok: true, code: promo.code });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/delete-promo', adminAuth, async (req, res) => {
  try { const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'Missing code' });
    await deletePromoCode(code); res.json({ ok: true });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.get('/admin/api/promo-codes', adminAuth, async (req, res) => {
  try { res.json({ codes: await getPromoCodes() }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/spawn-bot', adminAuth, async (req, res) => {
  try { const { bet, count } = req.body;
    const betAmount = Math.max(10, parseInt(bet) || 100);
    const numBots = Math.min(8, Math.max(1, parseInt(count) || 1));
    let spawned = 0;
    for (let i = 0; i < numBots; i++) { const p = spawnBot(betAmount); if (p) spawned++; }
    if (spawned > 0) repartitionIceArena();
    broadcastIceState(); res.json({ ok: true, spawned });
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/admin/api/remove-bots', adminAuth, async (req, res) => {
  try { const removed = removeAllBots(); broadcastIceState(); res.json({ ok: true, removed }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});

app.post('/redeem', async (req, res) => {
  try { const { code, userId } = req.body;
    if (!code || !userId) return res.status(400).json({ ok: false, error: 'Missing' });
    res.json(await redeemPromoCode(code, userId));
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.get('/redeem', async (req, res) => {
  try { const { code, userId } = req.query;
    if (!code || !userId) return res.status(400).json({ ok: false, error: 'Missing' });
    res.json(await redeemPromoCode(code, userId));
  } catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});

const ANON_FEES = { name: 50, username: 150, phone: 1500 };
const RARE_TIERS = ['rare', 'epic', 'legendary', 'mythic'];
const ANON_ADJ = ['Silent','Frozen','Shadow','Hidden','Mysterious','Swift','Cold','Pale','Iron','Golden','Silver','Crimson','Wandering','Ancient','Frost','Night','Wild','Lost','Broken','Ghost','Rogue','Quiet','Lone','Veiled','Distant'];
const ANON_NOUN = ['Wolf','Fox','Raven','Falcon','Bison','Hawk','Bear','Lynx','Panther','Owl','Phoenix','Cobra','Viper','Titan','Phantom','Wraith','Specter','Drifter','Stranger','Nomad','Cipher','Ember','Shade','Monarch','Seeker'];
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function generateAnonName(){ return pick(ANON_ADJ) + ' ' + pick(ANON_NOUN); }
function generateAnonUsername(){ const base = (pick(ANON_ADJ) + pick(ANON_NOUN)).toLowerCase(); return base + Math.floor(Math.random() * 9000 + 1000); }
function formatPhone(digits){ return '+' + digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'); }
function generatePhone(){
  const r = Math.random() * 100000;
  if(r < 2){ const pool = ['+888 000 000','+777 777 777','+000 000 000','+999 999 999','+888 888 888','+111 111 111','+123 456 789','+987 654 321','+222 222 222','+555 555 555','+666 000 666','+123 000 000'];
    return { phone: pick(pool), tier: 'mythic' }; }
  if(r < 22){ const d = 1 + Math.floor(Math.random() * 9); return { phone: formatPhone(String(d).repeat(9)), tier: 'legendary' }; }
  if(r < 122){ const a = Math.floor(Math.random() * 10); const b = Math.floor(Math.random() * 10); const c = Math.floor(Math.random() * 10); const d = Math.floor(Math.random() * 10); const digits = `${a}${b}${c}${d}${c}${b}${a}`; const full = digits + `${a}${b}`; return { phone: formatPhone(full), tier: 'epic' }; }
  if(r < 522){ const d = Math.floor(Math.random() * 10); const triple = String(d).repeat(3); let rest = ''; for(let i = 0; i < 6; i++) rest += Math.floor(Math.random() * 10); const digits = Math.random() < 0.5 ? triple + rest : rest + triple; return { phone: formatPhone(digits), tier: 'rare' }; }
  if(r < 2022){ const digits = []; for(let i = 0; i < 9; i++) digits.push(Math.floor(Math.random() * 10)); const pos = Math.floor(Math.random() * 7); const d = Math.floor(Math.random() * 10); digits[pos] = d; digits[pos+1] = d; digits[pos+2] = d; return { phone: formatPhone(digits.join('')), tier: 'uncommon' }; }
  let s = ''; for(let i = 0; i < 9; i++) s += Math.floor(Math.random() * 10);
  return { phone: formatPhone(s), tier: 'common' };
}
async function isAnonValueTaken(field, value, excludeUserId){
  const all = await getAllUsers();
  const lc = String(value).toLowerCase();
  for(const u of all){
    if(String(u.id) === String(excludeUserId)) continue;
    if(field === 'name'){ if(u.anonymousEnabled && (u.anonymousName || '').toLowerCase() === lc) return true; }
    else if(field === 'username'){ if((u.username || '').toLowerCase() === lc) return true; if(u.anonymousEnabled && (u.anonymousUsername || '').toLowerCase() === lc) return true; }
    else if(field === 'phone'){ if((u.anonymousPhone || '') === value) return true; }
  }
  return false;
}
async function refreshLiveIdentity(userId){
  const user = await getUser(userId);
  if(!user) return;
  const isAnon = !!user.anonymousEnabled;
  const pvpPlayer = getPlayer(userId);
  if(pvpPlayer){ pvpPlayer.name = isAnon ? (user.anonymousName || 'Anonymous') : (user.username || 'player'); pvpPlayer.pfp = isAnon ? null : (user.pfp || ''); broadcastState(); }
  const iceP = getIcePlayer(userId);
  if(iceP){ iceP.name = isAnon ? (user.anonymousName || 'Anonymous') : (user.username || 'player'); iceP.pfp = isAnon ? null : (user.pfp || ''); broadcastIceState(); }
}
app.post('/api/toggle-anonymous', async (req, res) => {
  try {
    const { userId, enabled } = req.body;
    if(!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const user = await getUser(userId);
    if(!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if(user.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    user.anonymousEnabled = !!enabled;
    if(user.anonymousEnabled && !user.anonymousName){
      let name, username, phone;
      for(let i = 0; i < 20; i++){ const n = generateAnonName(); if(!(await isAnonValueTaken('name', n, userId))){ name = n; break; } }
      for(let i = 0; i < 20; i++){ const u = generateAnonUsername(); if(!(await isAnonValueTaken('username', u, userId))){ username = u; break; } }
      for(let i = 0; i < 40; i++){ const p = generatePhone().phone; if(!(await isAnonValueTaken('phone', p, userId))){ phone = p; break; } }
      user.anonymousName = name || generateAnonName();
      user.anonymousUsername = username || generateAnonUsername();
      user.anonymousPhone = phone || generatePhone().phone;
    }
    await saveUser(user);
    await refreshLiveIdentity(userId);
    res.json({ ok: true, enabled: user.anonymousEnabled, name: user.anonymousName || '', username: user.anonymousUsername || '', phone: user.anonymousPhone || '' });
  } catch(err){ console.error('toggle-anonymous error:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/api/roll-phone', async (req, res) => {
  try {
    const { userId } = req.body;
    if(!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const user = await getUser(userId);
    if(!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if(user.balance < ANON_FEES.phone) return res.status(400).json({ ok: false, error: 'Not enough diamonds' });
    const wantRare = rareRollEnabled && Math.random() < 0.90;
    let result = null;
    for(let i = 0; i < 80; i++){ const c = generatePhone(); if(wantRare && !RARE_TIERS.includes(c.tier)) continue; if(!(await isAnonValueTaken('phone', c.phone, userId))){ result = c; break; } }
    if(!result){ for(let i = 0; i < 100; i++){ let s = ''; for(let j = 0; j < 9; j++) s += Math.floor(Math.random() * 10); const p = formatPhone(s); if(!(await isAnonValueTaken('phone', p, userId))){ result = { phone: p, tier: 'common' }; break; } } }
    if(!result) return res.status(500).json({ ok: false, error: 'Roll failed, try again' });
    const isRare = RARE_TIERS.includes(result.tier);
    res.json({ ok: true, phone: result.phone, tier: result.tier, fee: ANON_FEES.phone, rareAnimation: isRare });
  } catch(err){ console.error('roll-phone error:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/api/change-anonymous', async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    if(!userId || !field || value === undefined) return res.status(400).json({ ok: false, error: 'Missing parameters' });
    if(!ANON_FEES.hasOwnProperty(field)) return res.status(400).json({ ok: false, error: 'Invalid field' });
    const clean = String(value).trim();
    if(field === 'name'){ if(!/^[A-Za-z][A-Za-z\s]{1,29}$/.test(clean) || clean.length < 2) return res.status(400).json({ ok: false, error: 'Invalid name' }); }
    else if(field === 'username'){ if(!/^[A-Za-z0-9_]{3,16}$/.test(clean)) return res.status(400).json({ ok: false, error: 'Invalid username' }); }
    else if(field === 'phone'){ if(!/^\+\d{3} \d{3} \d{3}$/.test(clean)) return res.status(400).json({ ok: false, error: 'Invalid phone' }); }
    const user = await getUser(userId);
    if(!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if(user.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    if(await isAnonValueTaken(field, clean, userId)) return res.status(409).json({ ok: false, error: 'That value is already taken' });
    const fee = ANON_FEES[field];
    if(user.balance < fee) return res.status(400).json({ ok: false, error: 'Not enough diamonds' });
    if(field === 'name') user.anonymousName = clean;
    else if(field === 'username') user.anonymousUsername = clean;
    else if(field === 'phone') user.anonymousPhone = clean;
    user.balance -= fee;
    await saveUser(user);
    await refreshLiveIdentity(userId);
    res.json({ ok: true, newBalance: user.balance, fee, field, value: clean });
  } catch(err){ console.error('change-anonymous error:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/api/toggle-hide-pfp', async (req, res) => {
  try {
    const { userId, hide } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const newHide = await toggleHidePfp(userId, hide);
    const pvpPlayer = getPlayer(userId);
    if (pvpPlayer) { pvpPlayer.pfp = newHide ? null : (await getUser(userId)).pfp; broadcastState(); }
    const iceP = getIcePlayer(userId);
    if (iceP) { iceP.pfp = newHide ? null : (await getUser(userId)).pfp; broadcastIceState(); }
    res.json({ ok: true, hidePfp: newHide });
  } catch (err) { res.status(500).json({ ok: false, error: err.message || 'Internal error' }); }
});

app.get('/api/level', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const user = await getUser(userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({ ok: true, level: getLevelInfo(user), quests: buildQuestList(user) });
  } catch (err) { console.error('level endpoint:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.post('/api/claim-quest', async (req, res) => {
  try {
    const { userId, questId } = req.body || {};
    if (!userId || !questId) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest) return res.status(400).json({ ok: false, error: 'Invalid quest' });
    const user = await getUser(userId);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });
    if (user.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    const pField = 'q_' + questId + '_p';
    const cField = 'q_' + questId + '_c';
    const progress = Math.max(0, user[pField] | 0);
    if (progress < quest.target) return res.status(400).json({ ok: false, error: 'Quest not complete' });
    if (user[cField]) return res.status(400).json({ ok: false, error: 'Already claimed' });
    user[cField] = true;
    user.xp = (user.xp | 0) + quest.reward;
    await saveUser(user);
    res.json({ ok: true, reward: quest.reward, xp: user.xp, level: getLevelInfo(user), quests: buildQuestList(user) });
  } catch (err) { console.error('claim-quest:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});

app.post('/api/transfer', async (req, res) => {
  try {
    const { fromUserId, toUsername, amount } = req.body;
    if (!fromUserId || !toUsername || amount === undefined) return res.status(400).json({ ok: false, error: 'Missing fields' });
    const amt = Math.floor(Number(amount));
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ ok: false, error: 'Invalid amount' });
    const sender = await getUser(fromUserId);
    if (!sender) return res.status(404).json({ ok: false, error: 'Sender not found' });
    if (sender.banned) return res.status(403).json({ ok: false, error: 'You are banned' });
    if (sender.balance < amt) return res.status(400).json({ ok: false, error: 'Insufficient balance' });
    const clean = String(toUsername).replace(/^@/, '').trim().toLowerCase();
    if (!clean || clean.length < 3) return res.status(400).json({ ok: false, error: 'Invalid username' });
    const all = await getAllUsers();
    const receiver = all.find(u => (u.username || '').toLowerCase() === clean);
    if (!receiver) return res.status(404).json({ ok: false, error: 'User not found' });
    if (String(receiver.id) === String(sender.id)) return res.status(400).json({ ok: false, error: 'Cannot transfer to yourself' });
    if (receiver.banned) return res.status(400).json({ ok: false, error: 'Receiver is banned' });
    sender.balance -= amt;
    receiver.balance += amt;
    await saveUser(sender);
    await saveUser(receiver);
    res.json({ ok: true, newBalance: sender.balance, amount: amt, receiver: { username: receiver.username } });
  } catch (err) { console.error('Transfer error:', err); res.status(500).json({ ok: false, error: 'Internal error' }); }
});

app.get('/leaderboard', async (req, res) => {
  try { res.json({ top: await topPlayers(20) }); }
  catch (err) { res.status(500).json({ ok: false, error: 'Internal error' }); }
});
app.get('/health', (req, res) => res.json({ ok: true, players: room.players.length, gameState: room.gameState }));

server.listen(PORT, () => {
  console.log(`bump arena server listening on :${PORT}`);
  if (!BOT_TOKEN) console.warn('TELEGRAM_BOT_TOKEN not set.');
  if (ADMIN_SECRET === 'change-me-in-production') console.warn('Change ADMIN_SECRET!');
});
