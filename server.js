<script>
(function(){
  'use strict';
  const GIFS=['https://i.postimg.cc/WpwHn3V4/ezgif-42ac0fa94feba79e.gif','https://i.postimg.cc/fbc4dJhH/ezgif-4c0407329eb1bee2.gif','https://i.postimg.cc/7Z5LvW39/ezgif-4113ebc5948a7fca.gif','https://i.postimg.cc/tJRXBSCb/ezgif-4de2b661e14101c5.gif','https://i.postimg.cc/J7dVw4Pf/ezgif-26d00414e9a7afa6.gif'];
  const screen_el=document.getElementById('loading-screen');
  const grid=document.getElementById('loading-grid');
  const merged=document.getElementById('merged-square');
  const pulse=document.getElementById('pulse-ring');
  const ltext=document.getElementById('loading-text');
  if(!screen_el||!grid)return;
  const gif=GIFS[Math.floor(Math.random()*GIFS.length)];
  let squares=[],sqSize=0,gap=0;
  function measure(){const r=grid.getBoundingClientRect();const cs=getComputedStyle(grid);gap=parseFloat(cs.gap)||8;sqSize=(r.width-gap*2)/3}
  function build(){grid.innerHTML='';squares=[];for(let i=0;i<9;i++){const s=document.createElement('div');s.className='load-square';const im=document.createElement('img');im.className='gif-bg';im.src=gif;im.alt='';s.appendChild(im);grid.appendChild(s);squares.push(s)}}
  function pop(){return new Promise(res=>{let d=0;squares.forEach((s,i)=>setTimeout(()=>{s.classList.add('pop');d++;if(d===squares.length)setTimeout(res,350)},60+i*50));setTimeout(res,1400)})}
  function slide(){return new Promise(res=>{measure();const gr=grid.getBoundingClientRect();const cx=gr.left+gr.width/2,cy=gr.top+gr.height/2;squares.forEach(s=>{const r=s.getBoundingClientRect();s.dataset.tx=cx-(r.left+r.width/2);s.dataset.ty=cy-(r.top+r.height/2)});squares.forEach((s,i)=>{const dx=parseFloat(s.dataset.tx),dy=parseFloat(s.dataset.ty);setTimeout(()=>{s.style.transform='translate('+dx+'px,'+dy+'px) scale(1.02)';s.style.borderRadius='20px';s.classList.add('slide')},i*30)});setTimeout(res,squares.length*30+950)})}
  function merge(){return new Promise(res=>{measure();const gr=grid.getBoundingClientRect();const cx=gr.left+gr.width/2,cy=gr.top+gr.height/2;const ms=sqSize*1.8;merged.style.width=ms+'px';merged.style.height=ms+'px';merged.style.left=(cx-ms/2-gr.left)+'px';merged.style.top=(cy-ms/2-gr.top)+'px';const im=document.createElement('img');im.className='gif-bg';im.src=gif;merged.innerHTML='';merged.appendChild(im);squares.forEach((s,i)=>setTimeout(()=>{s.style.transition='transform .5s ease,opacity .4s ease';s.style.transform='scale(.3)';s.style.opacity='0'},i*20));setTimeout(()=>{merged.classList.add('show');setTimeout(()=>pulse.classList.add('pulse'),300);if(ltext)ltext.style.opacity='.4';res()},500)})}
  function fade(){return new Promise(res=>setTimeout(()=>{screen_el.classList.add('hidden');setTimeout(res,950)},2200))}
  async function start(){build();measure();await pop();await slide();await merge();await fade();if(screen_el.parentNode)screen_el.parentNode.removeChild(screen_el)}
  if(document.readyState==='complete'||document.readyState==='interactive')setTimeout(start,200);
  else document.addEventListener('DOMContentLoaded',()=>setTimeout(start,200));
})();
</script>

<script>
(function(){
  'use strict';
  const CORES = navigator.hardwareConcurrency || 4;
  const MEM = navigator.deviceMemory || 4;
  const IS_TOUCH = matchMedia('(pointer:coarse)').matches;
  const RAW_DPR = window.devicePixelRatio || 1;
  const IS_LOW_END = CORES <= 4 || MEM <= 3;
  const PERF = { dpr: Math.min(RAW_DPR, IS_LOW_END ? 2 : 3), shadows: !IS_LOW_END, confetti: !IS_LOW_END, storyRings: !IS_LOW_END, heavyEffects: !IS_LOW_END, targetFrameMs: 0 };
  if(IS_LOW_END) document.body.classList.add('perf-lite');

  const SERVER_URL='https://dllump-production-0a3d.up.railway.app';
  const WIN_GIFS=['https://i.postimg.cc/JzmQ6w3m/ezgif-67d79dd792fbd612.gif','https://i.postimg.cc/t45N8rkf/ezgif-66594092a04c05e4.gif','https://i.postimg.cc/Qdsq4Lgj/ezgif-63afd51ce390fe0a.gif','https://i.postimg.cc/YCkxncNB/ezgif-64eb91e49672e43a.gif','https://i.postimg.cc/X798kNCC/ezgif-660ff3be5bccd489.gif','https://i.postimg.cc/XJFG6q3Z/ezgif-5492df507ab574af.gif'];

  const tg=window.Telegram?.WebApp;
  if(tg){
    try{ tg.expand(); }catch(_){}
    try{ tg.enableClosingConfirmation(); }catch(_){}
    try{ if(typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes(); }catch(_){}
    try{ tg.setHeaderColor?.('#0a0a0a'); }catch(_){}
    try{ tg.setBackgroundColor?.('#0a0a0a'); }catch(_){}
    function applyTgFullscreen(){
      const isFs = !!tg.isFullscreen || (tg.viewportHeight && tg.viewportHeight >= window.innerHeight - 2);
      document.body.classList.toggle('tg-fullscreen', isFs);
      try{ if(typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes(); }catch(_){}
    }
    applyTgFullscreen();
    try{ tg.onEvent('fullscreenChanged', applyTgFullscreen); }catch(_){}
    try{ tg.onEvent('viewportChanged', applyTgFullscreen); }catch(_){}
    try{ tg.onEvent('safeAreaChanged', applyTgFullscreen); }catch(_){}
    window.addEventListener('resize', applyTgFullscreen);
  }

  function haptic(style){try{if(tg?.HapticFeedback)tg.HapticFeedback.impactOccurred(style||'light');else if(navigator.vibrate)navigator.vibrate(style==='heavy'?30:12)}catch(_){}}
  const $=s=>document.querySelector(s);
  const $$=s=>Array.prototype.slice.call(document.querySelectorAll(s));

  const toastContainer = document.getElementById('toast-container');
  const MAX_TOASTS = 3;
  const TOAST_DURATION = 4200;

  function dismissToast(t){
    if(!t || t.classList.contains('dismissing')) return;
    if(t._autoTimer){ clearTimeout(t._autoTimer); t._autoTimer = null; }
    t.classList.add('dismissing'); t.classList.remove('show');
    setTimeout(() => { if(t.parentNode) t.parentNode.removeChild(t); }, 340);
  }
  function attachSwipe(t){
    let dragging=false,pid=null,startX=0,startY=0,curDx=0,curDy=0;
    t.addEventListener('pointerdown', e => {
      if(e.target.closest('.toast-close')) return;
      dragging=true;pid=e.pointerId;startX=e.clientX;startY=e.clientY;curDx=0;curDy=0;
      t.classList.add('swiping'); try{ t.setPointerCapture(e.pointerId);}catch(_){}
    });
    t.addEventListener('pointermove', e => {
      if(!dragging||e.pointerId!==pid)return;
      curDx=e.clientX-startX;curDy=e.clientY-startY;
      const absX=Math.abs(curDx),absY=Math.abs(curDy);
      let tx=0,ty=0;
      if(absX>absY){tx=curDx;ty=curDy*0.22}else if(curDy<0){tx=curDx*0.25;ty=curDy}else{tx=curDx*0.32;ty=curDy*0.32}
      const rot=Math.max(-14,Math.min(14,tx*0.08));
      const op=Math.max(0.25,1-Math.max(absX,Math.abs(ty))/240);
      t.style.transform=`translate(${tx}px, ${ty}px) rotate(${rot}deg)`; t.style.opacity=op;
    },{passive:true});
    const endDrag = e => {
      if(!dragging)return;
      dragging=false; t.classList.remove('swiping');
      const absX=Math.abs(curDx),absY=Math.abs(curDy);
      const shouldDismiss=absX>90||curDy<-70;
      if(shouldDismiss){
        if(t._autoTimer){clearTimeout(t._autoTimer);t._autoTimer=null;}
        const isHorizontal=absX>absY;
        t.style.transition='transform .32s cubic-bezier(.4,0,.6,1), opacity .26s ease, max-height .28s ease, padding .28s ease, margin .28s ease';
        if(isHorizontal){const dir=Math.sign(curDx)||1;t.style.transform=`translate(${dir*(window.innerWidth+60)}px, ${curDy}px) rotate(${dir*18}deg)`;}
        else{const dir=curDy<0?-1:1;t.style.transform=`translate(0px, ${dir*200}px) scale(.85)`;}
        t.style.opacity=0;t.classList.add('dismissing');
        setTimeout(()=>{if(t.parentNode)t.parentNode.removeChild(t)},340);
      } else {
        t.style.transition='';t.style.transform='';t.style.opacity='';
        if(t._autoTimer)clearTimeout(t._autoTimer);
        t._autoTimer=setTimeout(()=>dismissToast(t),TOAST_DURATION);
      }
      curDx=0;curDy=0;
    };
    t.addEventListener('pointerup',endDrag);t.addEventListener('pointercancel',endDrag);
  }
  function showNotif(text, opts){
    opts=opts||{};
    if(!toastContainer)return;
    const existing=toastContainer.querySelectorAll('.toast:not(.dismissing)');
    if(existing.length>=MAX_TOASTS)dismissToast(existing[0]);
    const t=document.createElement('div');
    t.className='toast';
    t.textContent=text==null?'':String(text);
    const closeBtn=document.createElement('button');
    closeBtn.className='toast-close';closeBtn.type='button';closeBtn.setAttribute('aria-label','Dismiss');closeBtn.textContent='✕';
    t.appendChild(closeBtn);
    toastContainer.appendChild(t);
    requestAnimationFrame(()=>{requestAnimationFrame(()=>t.classList.add('show'))});
    const dur=opts.duration||TOAST_DURATION;
    t._autoTimer=setTimeout(()=>dismissToast(t),dur);
    closeBtn.addEventListener('pointerdown',e=>{e.stopPropagation();dismissToast(t)});
    attachSwipe(t);
  }
  function typeIn(el,text,speed){
    if(!el)return; speed=speed||34;
    const s=String(text==null?'':text);
    if(el._typeTimer){clearTimeout(el._typeTimer);el._typeTimer=null;}
    el.innerHTML=''; let i=0;
    function step(){
      if(i>=s.length){el._typeTimer=null;return}
      const ch=s.charAt(i++);
      const span=document.createElement('span');
      span.className='type-char';span.textContent=ch;
      el.appendChild(span); el._typeTimer=setTimeout(step,speed);
    }
    step();
  }

  const RIPPLE_SEL='button, .quick-btn, .layout-tile, .round-tile, .swatch, .setting, .top-entry, .stat-card, .panel-user, .rank-stat, .champion-card';
  document.addEventListener('pointerdown',e=>{
    if(!PERF.heavyEffects) return;
    const target=e.target.closest(RIPPLE_SEL);
    if(!target)return;
    if(target.closest('.tab-inner'))return;
    if(target.closest('.pc-card'))return;
    const cs=getComputedStyle(target);
    if(cs.position==='static')target.style.position='relative';
    if(cs.overflow!=='hidden')target.style.overflow='hidden';
    const rect=target.getBoundingClientRect();
    const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
    const size=Math.max(rect.width,rect.height)*1.4;
    const rip=document.createElement('span');
    rip.className='ripple-effect';
    rip.style.width=size+'px';rip.style.height=size+'px';
    rip.style.left=(cx-size/2)+'px';rip.style.top=(cy-size/2)+'px';
    target.appendChild(rip);
    setTimeout(()=>{if(rip.parentNode)rip.parentNode.removeChild(rip)},680);
  },{passive:true});

  const state={balance:0,username:'player',userId:null,pfp:'',wins:0,losses:0,anonymous:false,hidePfp:false,anonymousName:'Anonymous',defaultAvatar:'https://i.pravatar.cc/150?img=0',topPlayers:[],topPlayerIds:new Map(),winStreak:0,transactions:[],maxTx:20,memberSince:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),soundEnabled:false,bounceLightsEnabled:false,currentTab:'ice',storyRingsEnabled:false,fieldHighlightEnabled:false};
  let SERVER_ARENA_SIZE=400;

  const iceCanvas=document.getElementById('ice-canvas');
  const iceCtx=iceCanvas.getContext('2d',{alpha:true});
  const balanceEl=document.getElementById('bal');
  const unNameEl=document.getElementById('un-name');
  const usernameDisplay=document.getElementById('un');
  const statusDot=document.getElementById('sd');
  const pcCountEl=document.getElementById('pc-count');
  const iceWaitingText=document.getElementById('ice-waiting-text');
  const iceTopPanel=document.getElementById('ice-top-panel');
  const iceCountdownTimer=document.getElementById('ice-countdown-timer');
  const iceTimerProgress=document.getElementById('ice-timer-progress');
  const iceTimerSection=document.getElementById('ice-timer-section');
  const iceTimerProgressWrap=document.getElementById('ice-timer-progress-wrap');
  const iceStatsPlayers=document.getElementById('ice-stats-players');
  const iceStatsPot=document.getElementById('ice-stats-pot');
  const iceWinPanel=document.getElementById('ice-win-panel');
  const iceWinGif=document.getElementById('ice-win-gif');
  const iceWinAvatar=document.getElementById('ice-win-avatar');
  const iceWinName=document.getElementById('ice-win-name');
  const iceWinMultiplier=document.getElementById('ice-win-multiplier');
  const iceWinContinueBtn=document.getElementById('ice-win-continue-btn');
  const iceBetOverlayWrap=document.getElementById('ice-bet-overlay-wrap');
  const iceBetOverlay=document.getElementById('ice-bet-overlay');
  const iceBetToggleBtn=document.getElementById('ice-bet-toggle-btn');
  const iceBetInput=document.getElementById('ice-bet-input');
  const iceBetBtn=document.getElementById('ice-bet-btn');
  const iceAllInBtn=document.getElementById('ice-all-in-btn');
  const iceCurrentBetDisplay=document.getElementById('ice-current-bet-value');
  const iceAutoToggle=document.getElementById('ice-auto-bet-toggle');
  const iceAutoPanel=document.getElementById('ice-auto-bet-panel');
  const iceAutoSwitch=document.getElementById('ice-auto-bet-switch');
  const iceAutoAmount=document.getElementById('ice-auto-bet-amount');
  const iceAutoSwitchWrap=document.getElementById('ice-auto-switch-wrap');
  const profilePfp=document.getElementById('profile-pfp');
  const profileName=document.getElementById('profile-name');
  const profileUsername=document.getElementById('profile-username');
  const profileStatus=document.getElementById('profile-status');
  const profileDot=document.getElementById('profile-dot');
  const pWins=document.getElementById('p-wins');
  const pLosses=document.getElementById('p-losses');
  const pRate=document.getElementById('p-rate');
  const hidePfpToggle=document.getElementById('hide-pfp-toggle');
  const soundToggle=document.getElementById('sound-toggle');
  const bounceLightsToggle=document.getElementById('bounce-lights-toggle');
  const rankList=document.getElementById('rank-list');
  const panelName=document.getElementById('panel-name');
  const panelSub=document.getElementById('panel-sub');
  const cardBalanceValue=document.getElementById('card-balance-value');
  const cardHolder=document.getElementById('card-holder');

  const socket=(typeof io!=='undefined')?io(SERVER_URL,{transports:['websocket','polling']}):null;
  window.__socket = socket;

  function setOnline(on){
    if(statusDot)statusDot.classList.toggle('offline',!on);
    if(profileDot)profileDot.classList.toggle('offline',!on);
    if(profileStatus)profileStatus.textContent=(on?'● online':'● offline')+' · member since '+state.memberSince;
  }
  if(!socket){console.error('Socket.IO failed');setOnline(false)}
  else{
    socket.on('connect',()=>{
      setOnline(true);
      socket.emit('join',{initData:tg?.initData||''},res=>{
        if(!res?.ok){showNotif('Could not connect');return}
        state.userId=res.user.id;state.username=res.user.username;state.pfp=res.user.pfp||'';
        state.balance=res.user.balance;state.wins=res.user.wins;state.losses=res.user.losses;
        state.anonymous=!!res.user.anonymousEnabled;state.hidePfp=!!res.user.hidePfp;
        state.anonymousName=res.user.anonymousName||'Anonymous';
        if(window.__syncAnonFromJoin) window.__syncAnonFromJoin(res.user);
        if(window.__applyLevelFromJoin) window.__applyLevelFromJoin(res.level, res.quests);
        window.__levelState = res.level;
        SERVER_ARENA_SIZE=res.arena.size;
        iceState.perimeterPoints=res.iceArena?.perimeter||res.arena.perimeter;
        iceState.cornerRadius=res.iceArena?.cornerRadius||res.arena.cornerRadius;
        if(Array.isArray(res.iceRecentWinners)&&res.iceRecentWinners.length){
          iceState.winHistory=res.iceRecentWinners.slice(0,8);
          const best=iceState.winHistory.reduce((m,e)=>(e.amount||0)>(m.amount||0)?e:m,{amount:0});
          if(best.amount>0) iceState.bestWin=best;
        }
        if(res.icePlayers&&Array.isArray(res.icePlayers)){
          iceState.players=res.icePlayers.map(p=>{
            const local={id:p.id,name:p.name,pfp:p.pfp,pfpImg:null,poly:p.poly||null,_displayPoly:null,_targetPoly:null,color:p.color,bet:p.bet,_pfpSrc:null,_avSprite:null,_avKey:null,_realPfpLoaded:false};
            if(p.poly){const copy=p.poly.map(v=>({x:v.x,y:v.y}));local._targetPoly=copy;local._displayPoly=copy.map(v=>({x:v.x,y:v.y}));}
            return local;
          });
          iceState.pot=res.icePot||0;
          iceState.players.forEach(p=>loadIcePlayerPFP(p));
        }
        applyIdentity();updateBalance();updateProfile();updateWinrate();refreshLeaderboard();refreshCardUI();
        if(window._topRefresh)clearInterval(window._topRefresh);
        window._topRefresh=setInterval(refreshLeaderboard,30000);
        animateWaitingText();setTimeout(resizeIceCanvas,60);
      });
    });
    socket.on('disconnect',()=>setOnline(false));
    socket.on('connect_error',()=>setOnline(false));
    socket.on('iceState',s=>applyIceServerState(s));
    socket.on('icePuck',d=>{if(!d||d.g!=='sliding')return;pushPuckSnapshot(d.x,d.y,d.vx,d.vy)});
    socket.on('iceRoundEnd',p=>handleIceRoundEnd(p));
    socket.on('icePuckBounce',d=>{if(!d||!state.bounceLightsEnabled)return;iceState.wallPulses.push({x:d.x,y:d.y,intensity:d.intensity||.6,startTime:performance.now(),duration:700});if(iceState.wallPulses.length>6)iceState.wallPulses.shift()});
    socket.on('notification',d=>{if(d?.message)showNotif(d.message)});
  }

  function getDisplayName(){ if(state.anonymous && window.__anonState && window.__anonState.name) return window.__anonState.name; return state.username; }
  function getDisplayHandle(){ if(state.anonymous && window.__anonState && window.__anonState.username) return '@' + window.__anonState.username; return '@' + state.username; }
  function applyIdentity(){
    const dn=getDisplayName(); const dh=getDisplayHandle();
    if(unNameEl)unNameEl.textContent=dn;
    if(usernameDisplay)usernameDisplay.textContent=dh;
    profileName.textContent=dn; profileUsername.textContent=dh;
    panelName.textContent=dn; panelSub.textContent=dh+' · '+state.balance.toLocaleString()+' ◆';
    cardHolder.textContent=state.username.toUpperCase().slice(0,16);
    const pfpUrl=state.hidePfp?state.defaultAvatar:(state.pfp||state.defaultAvatar);
    profilePfp.src=pfpUrl;
    const pp=$('#panel-pfp');if(pp)pp.src=pfpUrl;
    profileStatus.textContent=(state.anonymous?'● anonymous':'● online')+' · member since '+state.memberSince;
    hidePfpToggle.checked=state.hidePfp; soundToggle.checked=state.soundEnabled; bounceLightsToggle.checked=state.bounceLightsEnabled;
    refreshAnonProfile();
  }
  function refreshAnonProfile(){
    const info=document.getElementById('anon-profile-info'); if(!info)return;
    if(state.anonymous){
      const a=window.__anonState||{};
      document.getElementById('anon-p-name').textContent=a.name||'—';
      document.getElementById('anon-p-username').textContent=a.username?'@'+a.username:'—';
      document.getElementById('anon-p-phone').textContent=a.phone||'—';
      if(info.style.display!=='flex'){info.style.display='flex';info.style.animation='none';void info.offsetWidth;info.style.animation='';}
    } else { info.style.display='none'; }
  }
  let balanceAnimInterval=null;
  function animateBalanceTo(target){
    const current=parseInt(balanceEl.textContent)||0;
    if(current===target){balanceEl.textContent=target;return}
    if(balanceAnimInterval)clearInterval(balanceAnimInterval);
    const diff=target-current,steps=Math.min(Math.abs(diff),30),ss=diff/steps;
    let step=0;
    balanceAnimInterval=setInterval(()=>{
      step++;const v=Math.round(current+ss*step);
      if(step>=steps||Math.abs(v-target)<1){balanceEl.textContent=target;clearInterval(balanceAnimInterval);balanceAnimInterval=null}
      else balanceEl.textContent=v;
    },25);
  }
  function updateBalance(){
    const target=Math.floor(state.balance);
    animateBalanceTo(target);
    const cv=cardBalanceValue.querySelector('span');if(cv)cv.textContent=target.toLocaleString();
    panelSub.textContent=getDisplayHandle()+' · '+target.toLocaleString()+' ◆';
  }
  function updateProfile(){
    pWins.textContent=state.wins;pLosses.textContent=state.losses;
    const total=state.wins+state.losses;
    pRate.textContent=total>0?Math.round(state.wins/total*100)+'%':'0%';
    updateWinrate();
  }
  function updateWinrate(){
    const total=state.wins+state.losses;
    const wr=total>0?(state.wins/total)*100:0;
    const wrLabel=document.getElementById('wr-label'); const wrWin=document.getElementById('wr-line-win');
    if(!wrLabel||!wrWin)return;
    wrLabel.textContent=Math.round(wr)+'%';
    wrWin.style.width=Math.max(0,Math.min(100,wr)).toFixed(1)+'%';
  }
  function addTransaction(type,amount,label){
    state.transactions.unshift({type,amount,label:label||'Bet',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});
    if(state.transactions.length>state.maxTx)state.transactions.pop();
    refreshTransactions();refreshCardStats();
  }
  function refreshTransactions(){
    const list=$('#tx-list');if(!list)return;
    if(state.transactions.length===0){list.innerHTML='<div class="tx-empty">No transactions yet</div>';return}
    let html='';state.transactions.forEach(tx=>{const s=tx.amount>0?'+':'';html+='<div class="tx-entry"><span>'+tx.label+'</span><span class="tx-amount '+tx.type+'">'+s+tx.amount+'</span></div>'});
    list.innerHTML=html;
  }
  function refreshCardStats(){
    let w=0,b=0,n=0;
    state.transactions.forEach(tx=>{if(tx.type==='bet')w+=Math.abs(tx.amount);else if(tx.type==='win'){n+=tx.amount;if(tx.amount>b)b=tx.amount}else if(tx.type==='loss')n+=tx.amount});
    const we=$('#cs-wagered'),bi=$('#cs-biggest'),ne=$('#cs-net');
    if(we)we.textContent=w;if(bi)bi.textContent=b;
    if(ne){ne.textContent=(n>=0?'+':'')+n;ne.className='cs-value'+(n>0?' positive':n<0?' negative':' neutral')}
  }
  function refreshCardUI(){refreshTransactions();refreshCardStats()}

  function refreshLeaderboard(){
    if(!socket)return;
    socket.emit('leaderboard',{},res=>{
      if(!res?.ok)return;
      state.topPlayers=res.top.map((u,i)=>{
        const a=!!u.anonymousEnabled;
        return {id:u.id,name:a?(u.anonymousName||u.anonymousUsername||'Anonymous'):u.username,username:u.username,pfp:a?'':u.pfp,wins:u.wins,losses:u.losses||0,score:u.balance,rank:i+1,anonymous:a,phone:a?(u.anonymousPhone||''):'',anonUsername:a?(u.anonymousUsername||''):'',level:u.level||1};
      });
      state.topPlayerIds.clear();
      state.topPlayers.forEach(p=>state.topPlayerIds.set(p.id,{rank:p.rank}));
      renderRanks();
    });
  }
  const rsTotalEl=document.getElementById('rs-total');
  const rsLevelEl=document.getElementById('rs-level');
  const championCard=document.getElementById('champion-card');
  const championPfp=document.getElementById('champion-pfp');
  const championName=document.getElementById('champion-name');
  const championStats=document.getElementById('champion-stats');
  const championLvlBadge=document.getElementById('champion-lvl-badge');

  function renderRanks(){
    if(!rankList)return;
    if(state.topPlayers.length===0){
      if(rsTotalEl)rsTotalEl.textContent='0';
      if(rsLevelEl)rsLevelEl.textContent='—';
      if(championCard)championCard.style.display='none';
      rankList.innerHTML='<div class="rank-empty"><svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M17 4H7v6a5 5 0 0 0 10 0zM7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"/></svg>No players yet — be the first!</div>';
      return;
    }
    const sorted=state.topPlayers.slice().sort((a,b)=>b.score-a.score);
    const topLevel=sorted.reduce((m,p)=>Math.max(m,p.level||1),1);
    if(rsTotalEl)rsTotalEl.textContent=sorted.length;
    if(rsLevelEl)rsLevelEl.textContent=topLevel;
    const badgeFn=window.__badgeSvgMarkup||function(){return ''};
    const champ=sorted[0];
    if(champ && championCard){
      championCard.style.display='flex';
      const cpfp=champ.anonymous?state.defaultAvatar:(champ.pfp||state.defaultAvatar);
      championPfp.src=cpfp;
      championPfp.onerror=function(){this.src=state.defaultAvatar};
      championName.textContent=champ.name||'Player';
      let statsHtml='<span>'+champ.wins+' wins</span><span class="dot"></span><span>Level '+(champ.level||1)+'</span><span class="dot"></span><span class="cs-amount"><img src="https://i.postimg.cc/vHKQ9y9q/diamond-elegant.gif" alt="">'+(champ.score||0).toLocaleString()+'</span>';
      championStats.innerHTML=statsHtml;
      championLvlBadge.innerHTML=badgeFn(champ.level||1,22);
      championCard.onclick=function(){haptic('light');openPlayerCard(champ)};
    } else if(championCard)championCard.style.display='none';
    const rest=sorted.slice(1);
    let html='';
    rest.forEach((p,i)=>{
      const r=i+2; let rc='rank';
      if(r===2)rc+=' silver'; else if(r===3)rc+=' bronze';
      const pfp=p.anonymous?state.defaultAvatar:(p.pfp||state.defaultAvatar);
      const phoneLine=(p.anonymous && p.phone)?'<div class="t-phone">'+escapeHtml(p.phone)+'</div>':'';
      const lvlBadge='<span class="t-lvl">'+badgeFn(p.level||1,14)+'</span>';
      const isYou=String(p.id)===String(state.userId);
      html+='<div class="top-entry'+(isYou?' is-you':'')+'" data-id="'+escapeHtml(String(p.id))+'" style="animation-delay:'+(i*22)+'ms"><div class="'+rc+'">#'+r+'</div><img class="t-pfp" src="'+escapeHtml(pfp)+'" onerror="this.src=\''+state.defaultAvatar+'\'" alt=""><div class="t-main"><div class="t-name-row"><span class="t-name">'+escapeHtml(p.name)+'</span>'+lvlBadge+'</div>'+phoneLine+'</div><div class="t-wins">'+p.wins+' <span style="opacity:.6">W</span></div><div class="t-bal"><img src="https://i.postimg.cc/vHKQ9y9q/diamond-elegant.gif" alt="">'+p.score.toLocaleString()+'</div></div>';
    });
    rankList.innerHTML=html||'<div class="rank-empty" style="padding:24px 16px">Only the champion so far</div>';
    rankList.querySelectorAll('.top-entry').forEach(el=>{
      el.addEventListener('click',()=>{
        const id=el.dataset.id;
        const player=state.topPlayers.find(p=>String(p.id)===String(id));
        if(player){haptic('light');openPlayerCard(player)}
      });
    });
  }

  const pcOverlay=document.getElementById('pc-overlay');
  const pcBackdrop=document.getElementById('pc-backdrop');
  const pcClose=document.getElementById('pc-close');
  const pcCard=document.getElementById('pc-card');
  const pcInner=document.getElementById('pc-inner');
  const pcGlare=document.getElementById('pc-glare');
  const pcPfp=document.getElementById('pc-pfp');
  const pcPfpLvl=document.getElementById('pc-pfp-lvl');
  const pcName=document.getElementById('pc-name');
  const pcUsername=document.getElementById('pc-username');
  const pcPhone=document.getElementById('pc-phone');
  const pcLevelPill=document.getElementById('pc-level-pill');
  const pcRankTag=document.getElementById('pc-rank-tag');
  const pcWinsEl=document.getElementById('pc-wins');
  const pcLossesEl=document.getElementById('pc-losses');
  const pcBalanceEl=document.getElementById('pc-balance');

  let pcActive=false,pcDrag=false,pcPid=null,pcLastX=0,pcLastY=0,pcRotX=0,pcRotY=0,pcOffX=0,pcOffY=0,pcVelX=0,pcVelY=0,pcRaf=null;

  function openPlayerCard(player){
    if(!pcOverlay||!player)return;
    pcActive=true;
    pcPfp.src=player.anonymous?state.defaultAvatar:(player.pfp||state.defaultAvatar);
    pcPfp.onerror=function(){this.src=state.defaultAvatar};
    pcName.textContent=player.name||'Player';
    if(player.anonymous && player.anonUsername) pcUsername.textContent='@'+player.anonUsername;
    else pcUsername.textContent='@'+(player.username||'player');
    if(player.anonymous && player.phone){pcPhone.textContent=player.phone;pcPhone.style.display='block'}
    else{pcPhone.textContent='';pcPhone.style.display='none'}
    pcLevelPill.textContent='Level '+(player.level||1);
    const rankNames=window.__levelRankNames||[];
    pcRankTag.textContent=rankNames[player.level-1]||'Player';
    const bFn=window.__badgeSvgMarkup||function(){return ''};
    pcPfpLvl.innerHTML=bFn(player.level||1,26);
    pcWinsEl.textContent=player.wins||0;
    pcLossesEl.textContent=player.losses||0;
    const balSpan=pcBalanceEl.querySelector('span');
    if(balSpan)balSpan.textContent=(player.score||0).toLocaleString();
    pcRotX=0;pcRotY=0;pcOffX=0;pcOffY=0;pcVelX=0;pcVelY=0;
    pcInner.style.transform='rotateX(0deg) rotateY(0deg)';
    pcOverlay.style.display='flex';
    requestAnimationFrame(()=>requestAnimationFrame(()=>pcOverlay.classList.add('visible')));
    if(!pcRaf)pcRaf=requestAnimationFrame(pcTick);
  }
  function closePlayerCard(){
    if(!pcActive||!pcOverlay)return;
    pcActive=false;pcDrag=false;pcPid=null;
    if(pcRaf){cancelAnimationFrame(pcRaf);pcRaf=null}
    pcOverlay.classList.remove('visible');
    setTimeout(()=>{pcOverlay.style.display='none'},380);
  }
  function pcTick(){
    if(!pcActive){pcRaf=null;return}
    if(!pcDrag){pcVelX*=0.92;pcVelY*=0.92;pcOffX+=pcVelX;pcOffY+=pcVelY;pcOffX*=0.96;pcOffY*=0.96;if(Math.abs(pcVelX)<0.02)pcVelX=0;if(Math.abs(pcVelY)<0.02)pcVelY=0}
    const tx=Math.max(-28,Math.min(28,pcOffY));
    const ty=Math.max(-34,Math.min(34,pcOffX));
    pcRotX+=(tx-pcRotX)*0.18;pcRotY+=(ty-pcRotY)*0.18;
    pcInner.style.transform='rotateX('+pcRotX.toFixed(2)+'deg) rotateY('+pcRotY.toFixed(2)+'deg)';
    if(pcGlare){const gx=50+(pcRotY/34)*42;const gy=50-(pcRotX/28)*42;const bright=0.28+Math.min(0.25,Math.abs(pcRotX+pcRotY)/90*0.35);pcGlare.style.background='radial-gradient(circle at '+Math.max(-15,Math.min(115,gx)).toFixed(1)+'% '+Math.max(-15,Math.min(115,gy)).toFixed(1)+'%,rgba(255,255,255,'+(bright*1.4).toFixed(3)+') 0%,rgba(255,255,255,'+(bright*0.35).toFixed(3)+') 25%,transparent 55%)'}
    pcRaf=requestAnimationFrame(pcTick);
  }
  if(pcCard){
    pcCard.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;pcDrag=true;pcPid=e.pointerId;pcLastX=e.clientX;pcLastY=e.clientY;pcVelX=0;pcVelY=0;try{pcCard.setPointerCapture(e.pointerId)}catch(_){}});
    pcCard.addEventListener('pointermove',e=>{if(!pcDrag||e.pointerId!==pcPid)return;const dx=e.clientX-pcLastX;const dy=e.clientY-pcLastY;pcLastX=e.clientX;pcLastY=e.clientY;pcOffX+=dx*0.6;pcOffY-=dy*0.6;pcVelX=dx*0.4;pcVelY=-dy*0.4;pcOffX=Math.max(-70,Math.min(70,pcOffX));pcOffY=Math.max(-60,Math.min(60,pcOffY))});
    function pcEndDrag(e){if(!pcDrag)return;pcDrag=false;try{pcCard.releasePointerCapture(e.pointerId)}catch(_){}pcPid=null}
    pcCard.addEventListener('pointerup',pcEndDrag);pcCard.addEventListener('pointercancel',pcEndDrag);
  }
  if(pcClose)pcClose.addEventListener('click',closePlayerCard);
  if(pcBackdrop)pcBackdrop.addEventListener('click',closePlayerCard);
  if(pcOverlay){pcOverlay.addEventListener('click',e=>{if(e.target===pcOverlay)closePlayerCard()})}

  const tabPages={ice:$('#ice-page'),wallet:$('#wallet-page'),profile:$('#profile-page'),top:$('#top-page')};
  const tabOrder=['ice','wallet','profile','top'];
  const tabBtns=$$('.tab');
  const tabInner=$('#tab-inner');
  const indicator=$('#tab-indicator');
  let current='ice';
  let dragTab=false,tabMoved=false,tabStartX=0,tabStartPx=0,tabHoverIdx=0,tabDownTab=null;

  function tabWidth(){return tabInner?(tabInner.clientWidth-12)/tabBtns.length:0}
  function updateIndicator(animate){
    if(!indicator)return;
    const idx=tabOrder.indexOf(current);
    const w=tabWidth();
    if(!animate)indicator.classList.add('dragging');
    indicator.style.width=w+'px';
    indicator.style.transform='translate3d('+(idx*w)+'px,0,0)';
    if(!animate){void indicator.offsetWidth;requestAnimationFrame(()=>indicator.classList.remove('dragging'))}
  }
  tabInner.addEventListener('pointerdown',e=>{
    if(e.button!==undefined&&e.button!==0)return;
    dragTab=true;tabMoved=false;tabStartX=e.clientX;tabStartPx=tabOrder.indexOf(current)*tabWidth();tabHoverIdx=tabOrder.indexOf(current);
    const el=e.target.closest?e.target.closest('.tab'):null;
    tabDownTab=el?el.dataset.tab:null;
    indicator.classList.add('dragging');indicator.classList.add('grow');
    e.preventDefault();
  });
  document.addEventListener('pointermove',e=>{
    if(!dragTab)return;
    const dx=e.clientX-tabStartX;
    if(Math.abs(dx)>4)tabMoved=true;
    const tw=tabWidth();const mx=(tabBtns.length-1)*tw;
    const x=Math.max(0,Math.min(mx,tabStartPx+dx));
    indicator.style.transform='translate3d('+x+'px,0,0)';
    const over=Math.round(x/tw);
    if(over!==tabHoverIdx){tabHoverIdx=over;haptic('light');for(let i=0;i<tabBtns.length;i++)tabBtns[i].classList.toggle('active',i===over)}
  },{passive:true});
  document.addEventListener('pointerup',e=>{
    if(!dragTab)return;
    dragTab=false;
    indicator.classList.remove('dragging');indicator.classList.remove('grow');
    const tw=tabWidth();const mx=(tabBtns.length-1)*tw;
    if(!tabMoved){
      for(let i=0;i<tabBtns.length;i++)tabBtns[i].classList.toggle('active',tabOrder[i]===current);
      updateIndicator(true);
      if(tabDownTab&&tabDownTab!==current)switchTab(tabDownTab);
      tabDownTab=null;return;
    }
    const dx=e.clientX-tabStartX;
    const bias=Math.max(-1,Math.min(1,dx/200))*(tw*.15);
    const ex=Math.max(0,Math.min(mx,tabStartPx+dx+bias));
    const ti=Math.round(ex/tw);const tt=tabOrder[ti];
    if(tt!==current)switchTab(tt);
    else{for(let j=0;j<tabBtns.length;j++)tabBtns[j].classList.toggle('active',tabOrder[j]===current);updateIndicator(true)}
    tabDownTab=null;
  });
  document.addEventListener('pointercancel',()=>{
    if(!dragTab)return;
    dragTab=false;indicator.classList.remove('dragging');indicator.classList.remove('grow');
    updateIndicator(true);tabDownTab=null;
  });
  function switchTab(tab){
    if(tab===current||!tabPages[tab])return;
    haptic('light');
    const oldEl=tabPages[current];oldEl.classList.remove('active');oldEl.classList.add('exit');
    setTimeout(()=>oldEl.classList.remove('exit'),350);
    tabBtns.forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
    current=tab;state.currentTab=tab;
    updateIndicator(true);
    requestAnimationFrame(()=>{
      const np=tabPages[tab];np.classList.add('active');
      if(tab==='ice')setTimeout(resizeIceCanvas,60);
      if(tab==='top')refreshLeaderboard();
      if(tab==='profile'){refreshAnonProfile();updateWinrate();}
    });
  }
  setTimeout(()=>updateIndicator(false),100);
  window.addEventListener('resize',()=>updateIndicator(false));
  window.addEventListener('orientationchange',()=>setTimeout(()=>{updateIndicator(false);resizeIceCanvas()},250));

  function easeOutCubic(t){return 1-Math.pow(1-t,3)}
  function easeInOutCubic(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
  function easeOutBack(t){const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}
  function lightenColor(hex,amt){let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);r=Math.min(255,r+amt);g=Math.min(255,g+amt);b=Math.min(255,b+amt);return'#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0')}

  const PUCK_RENDER_RADIUS=19;
  function drawLiquidGlassPuck(c,x,y,r,opts){
    opts=opts||{};
    const scale=r/36;
    const rim=(opts.rimRatio!==undefined?opts.rimRatio:.44)*r;
    const outer=(opts.outerRatio!==undefined?opts.outerRatio:.32)*r;
    const rimAlpha=opts.rimAlpha!==undefined?opts.rimAlpha:.95;
    const outerAlpha=opts.outerAlpha!==undefined?opts.outerAlpha:.20;
    const innerGlow=opts.innerGlow!==undefined?opts.innerGlow:.10;
    const drawCross=opts.cross!==undefined?opts.cross:true;
    const crossAlpha=opts.crossAlpha!==undefined?opts.crossAlpha:.28;
    const crossWidth=opts.crossWidth!==undefined?opts.crossWidth:1.6;
    if(outer>0){c.save();c.beginPath();c.lineWidth=outer;c.strokeStyle='rgba(255,255,255,'+outerAlpha+')';c.lineCap='round';c.arc(x,y,r+outer*.12,0,Math.PI*2);c.stroke();c.restore();}
    c.save();c.beginPath();c.lineWidth=rim;c.strokeStyle='rgba(255,255,255,'+rimAlpha+')';c.lineCap='round';c.arc(x,y,r-rim/2,0,Math.PI*2);c.stroke();c.restore();
    c.save();c.beginPath();c.lineWidth=Math.max(1,rim*.36);c.strokeStyle='rgba(0,0,0,0.18)';c.lineCap='round';c.arc(x,y,r-rim*.9,0,Math.PI*2);c.stroke();c.restore();
    c.save();c.beginPath();c.lineWidth=Math.max(1,rim*.12);c.strokeStyle='rgba(255,255,255,0.12)';c.lineCap='round';c.arc(x,y,r-rim*.6,0,Math.PI*2);c.stroke();c.restore();
    if(drawCross){const L=r*1.9;c.save();c.lineWidth=crossWidth*(r/20);c.strokeStyle='rgba(255,255,255,'+crossAlpha+')';c.beginPath();c.moveTo(x-L/2,y);c.lineTo(x+L/2,y);c.moveTo(x,y-L/2);c.lineTo(x,y+L/2);c.stroke();c.restore();}
    c.save();const g=c.createRadialGradient(x-r*.18,y-r*.18,1,x,y,r*1.2);g.addColorStop(0,'rgba(255,255,255,'+innerGlow+')');g.addColorStop(.35,'rgba(255,255,255,'+(innerGlow*.45)+')');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r-rim*.6,0,Math.PI*2);c.fill();c.restore();
    const ca=[-2.35,-.8,2.35,.8];c.save();
    for(let i=0;i<ca.length;i++){const a=ca[i];const px=x+Math.cos(a)*(r-rim/2);const py=y+Math.sin(a)*(r-rim/2);c.save();c.translate(px,py);c.rotate(a+Math.PI/2);const gw=Math.max(8*scale,rim*1.1);const gh=Math.max(2*scale,rim*.26);const grad=c.createLinearGradient(-gw/2,0,gw/2,0);grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.35,'rgba(255,255,255,0.45)');grad.addColorStop(.65,'rgba(255,255,255,0.45)');grad.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=grad;c.beginPath();c.ellipse(0,0,gw/2,gh/2,0,0,Math.PI*2);c.fill();c.restore();}
    c.restore();
    c.save();c.beginPath();c.lineWidth=Math.max(1,rim*.08);c.strokeStyle='rgba(255,255,255,0.04)';c.arc(x,y,r-rim*.2,-0.6,0.6);c.stroke();c.restore();
  }
  const PUCK_OPTS={rimRatio:.44,outerRatio:.32,rimAlpha:.95,outerAlpha:.20,innerGlow:.10,cross:true,crossAlpha:.28,crossWidth:1.6};
  const PUCK_BASE_R=96;
  const PUCK_PAD=Math.ceil(PUCK_BASE_R*0.35)+4;
  const PUCK_HALF_RATIO=(PUCK_BASE_R+PUCK_PAD)/PUCK_BASE_R;
  const puckSprite=(function(){const dpr=Math.max(2,Math.min(3,PERF.dpr||2));const cssSize=(PUCK_BASE_R+PUCK_PAD)*2;const cv=document.createElement('canvas');cv.width=Math.ceil(cssSize*dpr);cv.height=Math.ceil(cssSize*dpr);const g=cv.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.setTransform(dpr,0,0,dpr,0,0);drawLiquidGlassPuck(g,cssSize/2,cssSize/2,PUCK_BASE_R,PUCK_OPTS);return cv;})();
  function drawPuckSprite(ctx,px,py,rc){if(rc<=0.5)return;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';const h=rc*PUCK_HALF_RATIO;ctx.drawImage(puckSprite,px-h,py-h,h*2,h*2)}

  const pfpCache=new Map();
  function loadIcePlayerPFP(p){
    const src=p.pfp||state.defaultAvatar; p._pfpSrc=src;
    if(pfpCache.has(src)){const c=pfpCache.get(src);if(c.loaded&&c.img){p.pfpImg=c.img;p._realPfpLoaded=true;return}}
    const img=new Image(); let a=0;
    img.onload=()=>{pfpCache.set(src,{img,loaded:true});p.pfpImg=img;p._realPfpLoaded=true};
    img.onerror=()=>{a++;if(a<3){const sep=src.includes('?')?'&':'?';img.src=src+sep+'r='+a}else{pfpCache.set(src,{img:null,loaded:false})}};
    pfpCache.set(src,{img:null,loaded:false});
    img.src=src;
  }
  function polyMeta(poly){
    const n=poly.length;
    if(n<3){let cx=0,cy=0;for(const v of poly){cx+=v.x;cy+=v.y}cx/=n||1;cy/=n||1;return{cx,cy,inR:0}}
    let area2=0,cx=0,cy=0;
    for(let i=0;i<n;i++){const a=poly[i],b=poly[(i+1)%n];const cross=a.x*b.y-b.x*a.y;area2+=cross;cx+=(a.x+b.x)*cross;cy+=(a.y+b.y)*cross}
    if(Math.abs(area2)>0.0001){cx/=(3*area2);cy/=(3*area2)}else{cx=0;cy=0;for(const v of poly){cx+=v.x;cy+=v.y}cx/=n;cy/=n}
    let minD=Infinity;
    for(let i=0;i<n;i++){const a=poly[i],b=poly[(i+1)%n];const dx=b.x-a.x,dy=b.y-a.y;const lenSq=dx*dx+dy*dy;if(lenSq<0.0001)continue;let t=((cx-a.x)*dx+(cy-a.y)*dy)/lenSq;t=Math.max(0,Math.min(1,t));const nx=a.x+t*dx;const ny=a.y+t*dy;const d=Math.hypot(cx-nx,cy-ny);if(d<minD)minD=d}
    return{cx,cy,inR:minD};
  }
  function pointInPoly(px,py,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i].x,yi=poly[i].y,xj=poly[j].x,yj=poly[j].y;if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside}return inside}
  function findBboxCorners(poly){let tl=null,tr=null,bl=null,br=null;let tlS=Infinity,trS=-Infinity,blS=Infinity,brS=-Infinity;for(const v of poly){const a=v.x+v.y,b=v.x-v.y;if(a<tlS){tlS=a;tl=v}if(a>brS){brS=a;br=v}if(b>trS){trS=b;tr=v}if(b<blS){blS=b;bl=v}}return[tl,tr,bl,br]}

  let rinkCache=null,rinkCacheSize=0;
  let cachedPerimeterPath=null,cachedPerimeterSize=0;

  function buildRinkCache(){
    const w=iceState.arenaSize; if(!w)return;
    if(rinkCacheSize===w && rinkCache && cachedPerimeterPath)return;
    rinkCacheSize=w;
    const dpr=PERF.dpr;
    const cv=document.createElement('canvas'); cv.width=Math.round(w*dpr); cv.height=Math.round(w*dpr);
    const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
    const half=w/2; const s=iceScaleFactor();
    const grad=c.createRadialGradient(half,half,0,half,half,half);
    grad.addColorStop(0,'rgba(48,60,88,.38)');grad.addColorStop(.4,'rgba(28,38,58,.48)');
    grad.addColorStop(.8,'rgba(14,20,34,.58)');grad.addColorStop(1,'rgba(6,10,18,.65)');
    c.fillStyle=grad; c.fillRect(0,0,w,w);
    const pts=iceState.perimeterPoints.map(p=>({x:p.x*s,y:p.y*s}));
    if(pts.length===0){rinkCache=cv;cachedPerimeterPath=null;cachedPerimeterSize=0;return}
    const path=new Path2D(); path.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<pts.length;i++)path.lineTo(pts[i].x,pts[i].y);
    path.closePath();
    const innerPts=pts.map(p=>({x:half+(p.x-half)*.965,y:half+(p.y-half)*.965}));
    const innerPath=new Path2D(); innerPath.moveTo(innerPts[0].x,innerPts[0].y);
    for(let i=1;i<innerPts.length;i++)innerPath.lineTo(innerPts[i].x,innerPts[i].y);
    innerPath.closePath();
    if(PERF.shadows){
      c.save();c.shadowColor='rgba(140,180,255,.55)';c.shadowBlur=IS_LOW_END?18:38;c.strokeStyle='rgba(180,210,255,.15)';c.lineWidth=22;c.lineJoin='round';c.stroke(path);c.restore();
      c.save();c.shadowColor='rgba(120,170,255,.55)';c.shadowBlur=IS_LOW_END?10:20;c.strokeStyle='rgba(150,190,255,.42)';c.lineWidth=10;c.lineJoin='round';c.stroke(path);c.restore();
      c.save();c.shadowColor='rgba(255,255,255,.95)';c.shadowBlur=IS_LOW_END?8:14;c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=3.2;c.lineJoin='round';c.stroke(path);c.restore();
    } else {
      c.save();c.strokeStyle='rgba(180,210,255,.18)';c.lineWidth=22;c.lineJoin='round';c.stroke(path);c.restore();
      c.save();c.strokeStyle='rgba(150,190,255,.42)';c.lineWidth=10;c.lineJoin='round';c.stroke(path);c.restore();
      c.save();c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=3.2;c.lineJoin='round';c.stroke(path);c.restore();
    }
    c.save();c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1.2;c.lineJoin='round';c.stroke(innerPath);c.restore();
    c.save();c.strokeStyle='rgba(140,180,255,.10)';c.lineWidth=6;c.lineJoin='round';c.stroke(innerPath);c.restore();
    rinkCache=cv;cachedPerimeterPath=path;cachedPerimeterSize=w;
  }
  function resizeIceCanvas(){
    const rect=iceCanvas.parentElement.getBoundingClientRect();
    const availW=rect.width-16; const availH=rect.height-8;
    const size=Math.max(120,Math.min(availW,availH,440));
    const dpr=PERF.dpr;
    iceCanvas.width=Math.round(size*dpr);iceCanvas.height=Math.round(size*dpr);
    iceCanvas.style.width=size+'px';iceCanvas.style.height=size+'px';
    iceState.arenaSize=size;iceCtx.setTransform(dpr,0,0,dpr,0,0);
    iceCtx.imageSmoothingEnabled=true;iceCtx.imageSmoothingQuality='high';
    rinkCacheSize=0;cachedPerimeterPath=null;cachedPerimeterSize=0;
    buildRinkCache();
  }
  function iceScaleFactor(){return iceState.arenaSize/SERVER_ARENA_SIZE}
  let _resizeDebounceTimer=null;
  window.addEventListener('resize',()=>{clearTimeout(_resizeDebounceTimer);_resizeDebounceTimer=setTimeout(()=>{resizeIceCanvas();updateIndicator(false)},120)});

  const iceState={gameState:'idle',players:[],pot:0,arenaSize:0,perimeterPoints:[],cornerRadius:0,countdownStartTime:0,spinStartTime:0,spinDuration:0,spinFinalAngle:0,spinStartX:200,spinStartY:200,puck:{x:200,y:200},winnerId:null,winHistory:[],puckScale:1,puckPopStart:0,puckVisible:false,pfpPop:new Map(),slideStartTime:0,zoom:1,zoomTarget:1,zoomStartTime:0,zoomDuration:2.2,isZoomingIn:false,isZoomingOut:false,zoomLocked:false,zoomOutTriggered:false,idlePuck:{x:0,y:0,vx:2.5,vy:1.8,radius:PUCK_RENDER_RADIUS},idlePuckInitialized:false,puckPrevX:200,puckPrevY:200,puckUpdateTime:0,currentOwnerName:'',nameFadeIn:0,showOwnerName:false,bestWin:{amount:0,pfp:'',name:''},winnerPuckPop:false,winnerPuckPopStart:0,winnerPuckPopDuration:600,glowPhase:0,puckVx:0,puckVy:0,zoomCenterX:0,zoomCenterY:0,zoomCenterFixed:false,wallPulses:[],prevRenderX:0,prevRenderY:0,lastFrameTime:0,peakSpeed:0,zoomFired:false,countdownLastSecond:-1,countdownPulseStart:0,confetti:[],nearStopFrames:0};

  const puckBuffer=[];
  const PUCK_BUFFER_MAX=30;
  const PUCK_INTERP_DELAY=35;
  let puckLastSnapshotT=0;
  function pushPuckSnapshot(x,y,vx,vy){
    const t=performance.now();
    if(puckLastSnapshotT && t-puckLastSnapshotT>200)puckBuffer.length=0;
    puckBuffer.push({x,y,vx:vx||0,vy:vy||0,t});
    if(puckBuffer.length>PUCK_BUFFER_MAX)puckBuffer.shift();
    puckLastSnapshotT=t;
  }
  function getInterpolatedPuck(){
    const n=puckBuffer.length;
    if(n===0)return{x:iceState.puck.x,y:iceState.puck.y};
    const renderTime=performance.now()-PUCK_INTERP_DELAY;
    if(renderTime<=puckBuffer[0].t)return{x:puckBuffer[0].x,y:puckBuffer[0].y};
    for(let i=0;i<n-1;i++){
      const s0=puckBuffer[i];const s1=puckBuffer[i+1];
      if(renderTime>=s0.t&&renderTime<=s1.t){const dt=s1.t-s0.t;if(dt<=0.001)return{x:s1.x,y:s1.y};let a=(renderTime-s0.t)/dt;if(a<0)a=0;else if(a>1)a=1;return{x:s0.x+(s1.x-s0.x)*a,y:s0.y+(s1.y-s0.y)*a}}
    }
    const last=puckBuffer[n-1];const prev=n>=2?puckBuffer[n-2]:last;
    const dt=(last.t-prev.t)||16;
    const ahead=Math.min(renderTime-last.t,PUCK_INTERP_DELAY);
    return{x:last.x+last.vx*(ahead/1000),y:last.y+last.vy*(ahead/1000)};
  }
  function getAnonymousColor(id){let h=0;const s=String(id);for(let i=0;i<s.length;i++){h=s.charCodeAt(i)+((h<<5)-h);h&=h}return'hsl('+Math.abs(h%360)+',70%,50%)'}

  function applyIceServerState(snapshot){
    const prev=iceState.gameState;
    if(snapshot.puck)pushPuckSnapshot(snapshot.puck.x,snapshot.puck.y,snapshot.puck.vx||0,snapshot.puck.vy||0);
    if(snapshot.gameState==='sliding'&&prev!=='sliding'){puckBuffer.length=0;puckLastSnapshotT=0;pushPuckSnapshot(snapshot.puck.x,snapshot.puck.y,snapshot.puck.vx||0,snapshot.puck.vy||0);iceState.puckPrevX=snapshot.puck.x;iceState.puckPrevY=snapshot.puck.y;iceState.puck.x=snapshot.puck.x;iceState.puck.y=snapshot.puck.y;iceState.puckUpdateTime=Date.now();if(snapshot.puck.vx!==undefined){iceState.puckVx=snapshot.puck.vx;iceState.puckVy=snapshot.puck.vy}}
    iceState.gameState=snapshot.gameState;
    iceState.pot=snapshot.pot;
    iceState.countdownStartTime=snapshot.countdownStartTime;
    iceState.spinStartTime=snapshot.spinStartTime;
    iceState.spinDuration=snapshot.spinDuration;
    iceState.spinFinalAngle=snapshot.spinFinalAngle;
    iceState.spinStartX=snapshot.spinStartX||iceState.arenaSize/2;
    iceState.spinStartY=snapshot.spinStartY||iceState.arenaSize/2;
    if(snapshot.gameState!=='sliding'||prev==='sliding'){iceState.puckPrevX=iceState.puck.x;iceState.puckPrevY=iceState.puck.y;iceState.puck.x=snapshot.puck.x;iceState.puck.y=snapshot.puck.y;iceState.puckUpdateTime=Date.now();if(snapshot.puck.vx!==undefined){iceState.puckVx=snapshot.puck.vx;iceState.puckVy=snapshot.puck.vy}}
    if(snapshot.gameState!=='idle'||snapshot.players.length>0)iceState.idlePuckInitialized=false;
    if(snapshot.gameState==='countdown'&&prev!=='countdown'){iceState.countdownLastSecond=-1;iceState.countdownPulseStart=0;iceCountdownTimer.classList.remove('cinematic','urgent','tick')}
    if(snapshot.gameState==='spinning'&&prev!=='spinning'){iceState.puckVisible=true;iceState.puckPopStart=performance.now();iceState.puckScale=0;iceState.zoom=1;iceState.isZoomingIn=false;iceState.isZoomingOut=false;iceState.zoomLocked=false;iceState.zoomOutTriggered=false;iceState.winnerPuckPop=false;iceState.zoomCenterFixed=false}
    if(snapshot.gameState==='sliding'&&prev!=='sliding'){iceState.slideStartTime=performance.now();iceState.zoom=1;iceState.isZoomingIn=false;iceState.isZoomingOut=false;iceState.zoomLocked=false;iceState.zoomOutTriggered=false;iceState.winnerPuckPop=false;iceState.zoomCenterFixed=false;iceState.prevRenderX=0;iceState.prevRenderY=0;iceState.lastFrameTime=0;iceState.peakSpeed=0;iceState.zoomFired=false;iceState.nearStopFrames=0;iceState.zoomCenterX=0;iceState.zoomCenterY=0}
    if(snapshot.gameState==='finished'&&prev!=='finished'){iceState.zoomOutTriggered=true;iceState.isZoomingOut=true;iceState.isZoomingIn=false;iceState.zoomStartTime=performance.now();iceState.zoomTarget=1;iceState.zoomDuration=1.1}
    if(snapshot.gameState==='idle'&&prev!=='idle'){iceState.puckVisible=false;iceState.puckScale=1;iceState.zoom=1;iceState.isZoomingIn=false;iceState.isZoomingOut=false;iceState.zoomLocked=false;iceState.zoomOutTriggered=false;iceState.pfpPop.clear();iceState.showOwnerName=false;iceState.currentOwnerName='';iceState.idlePuckInitialized=false;iceState.winnerPuckPop=false;iceState.zoomCenterFixed=false;iceState.zoomCenterX=0;iceState.zoomCenterY=0;iceState.wallPulses=[];iceState.prevRenderX=0;iceState.prevRenderY=0;iceState.lastFrameTime=0;iceState.peakSpeed=0;iceState.zoomFired=false;iceState.confetti=[];iceState.nearStopFrames=0}
    const seen=new Set();
    snapshot.players.forEach(sp=>{
      seen.add(sp.id);
      let local=iceState.players.find(p=>p.id===sp.id);
      if(!local){local={id:sp.id,name:sp.name,pfp:sp.pfp,pfpImg:null,poly:sp.poly||null,_displayPoly:null,_targetPoly:null,color:sp.color,bet:sp.bet,_pfpSrc:null,_avSprite:null,_avKey:null,_realPfpLoaded:false};iceState.players.push(local);loadIcePlayerPFP(local);iceState.pfpPop.set(sp.id,{startTime:performance.now(),duration:400})}
      else{if(Math.abs(local.bet-sp.bet)>5)iceState.pfpPop.set(sp.id,{startTime:performance.now(),duration:400});local.color=sp.color;local.bet=sp.bet}
      local.name=sp.name; local.poly=sp.poly||local.poly;
      if(sp.poly){const incoming=sp.poly.map(v=>({x:v.x,y:v.y}));if(!local._displayPoly||local._displayPoly.length!==incoming.length){local._targetPoly=incoming;local._displayPoly=incoming.map(v=>({x:v.x,y:v.y}))}else{local._targetPoly=incoming}}
    });
    iceState.players=iceState.players.filter(p=>seen.has(p.id));
    if(prev!=='idle'&&iceState.gameState==='idle'){iceState.winnerId=null;iceWaitingText.style.display='block'}
    updateIceStatsBar();updateIceBetUI();updateIceWaitingText();updateIceBetOverlayVisibility();updateIceTopPanelVisibility();
  }
  let _topPanelShown=null,_timerMode=null;
  function updateIceTopPanelVisibility(){
    const gs=iceState.gameState;
    const show=(gs==='countdown'||gs==='spinning'||gs==='sliding'||gs==='finished');
    if(show!==_topPanelShown){_topPanelShown=show;iceTopPanel.classList.toggle('show',show)}
    const cd=(gs==='countdown');
    if(cd!==_timerMode){_timerMode=cd;iceTimerSection.style.display=cd?'flex':'none';iceCountdownTimer.style.display=cd?'block':'none';iceTimerProgressWrap.style.display=cd?'block':'none'}
  }
  let _statPlayers=-1,_statPot=-1,_pcCount=-1;
  function updateIceStatsBar(){
    const n=iceState.players.length;
    if(n!==_statPlayers){_statPlayers=n;iceStatsPlayers.textContent=n}
    if(n!==_pcCount){_pcCount=n;if(pcCountEl)pcCountEl.textContent=n}
    const p=iceState.pot;
    if(p!==_statPot){_statPot=p;iceStatsPot.textContent=p}
  }
  let _waitingShown=null;
  function updateIceWaitingText(){
    const gs=iceState.gameState;
    const busy=(gs==='spinning'||gs==='sliding'||gs==='finished');
    const show=!busy&&iceState.players.length<1;
    if(show!==_waitingShown){_waitingShown=show;iceWaitingText.style.display=show?'block':'none'}
  }
  let _betOverlayHidden=null;
  function updateIceBetOverlayVisibility(){
    const gs=iceState.gameState;
    const hide=(gs==='spinning'||gs==='sliding'||gs==='finished');
    if(hide!==_betOverlayHidden){_betOverlayHidden=hide;iceBetOverlayWrap.classList.toggle('hidden',hide)}
  }
  let _betBtnLabel='',_betDisabled=null,_betShown=null;
  function updateIceBetUI(){
    const existing=iceState.players.find(p=>p.id===state.userId);
    const inGame=!!existing;
    const canBet=(iceState.gameState==='idle'||iceState.gameState==='countdown');
    const label=canBet?(inGame?'increase':'join'):(inGame?'in game':'waiting');
    if(label!==_betBtnLabel){_betBtnLabel=label;iceBetBtn.textContent=label}
    const dis=!canBet;
    if(dis!==_betDisabled){_betDisabled=dis;iceBetBtn.disabled=dis;iceBetInput.disabled=dis;iceAllInBtn.disabled=dis}
    const bet=existing?existing.bet:0;
    if(bet!==_betShown){_betShown=bet;iceCurrentBetDisplay.textContent=bet}
    if(iceBetInput.dataset.empty==='true'){iceBetInput.value=10;delete iceBetInput.dataset.empty}
  }
  function spawnSliceConfetti(p){
    if(!PERF.confetti)return;
    const poly=p._displayPoly; if(!poly||poly.length<3)return;
    let cx=0,cy=0; for(const v of poly){cx+=v.x;cy+=v.y} cx/=poly.length;cy/=poly.length;
    const now=performance.now();
    for(let i=0;i<16;i++){const ang=(Math.PI*2*i/16)+(Math.random()-0.5)*0.5;const spd=60+Math.random()*90;iceState.confetti.push({x:cx,y:cy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-40,rot:Math.random()*Math.PI*2,vrot:(Math.random()-0.5)*12,w:3+Math.random()*4,h:1.5+Math.random()*2,color:Math.random()<0.4?'#ffffff':lightenColor(p.color,55),born:now,life:1100+Math.random()*400})}
  }
  function handleIceRoundEnd(payload){
    if(!payload){hideIceWinPanelAndReset();return}
    iceState.winnerId=payload.winnerId;
    const winnerPlayer=iceState.players.find(p=>p.id===payload.winnerId);
    if(winnerPlayer)spawnSliceConfetti(winnerPlayer);
    refreshLeaderboard();
    if(payload.winnerId===state.userId){state.balance+=payload.winnings;state.wins++;state.winStreak++}
    else{state.losses++;state.winStreak=0;addTransaction('loss',-payload.winnings,'Ice Loss vs '+payload.winnerName)}
    updateBalance();updateProfile();
    if(window.__refreshLevel)window.__refreshLevel(true);
    iceWinGif.src=WIN_GIFS[Math.floor(Math.random()*WIN_GIFS.length)];
    iceWinAvatar.src=payload.winnerPfp||state.defaultAvatar;
    iceWinName.textContent=payload.winnerName+' wins the rink!';
    iceWinMultiplier.textContent='x'+payload.multiplier.toFixed(1);
    haptic('heavy');
    iceState.winnerPuckPop=true;iceState.winnerPuckPopStart=performance.now();
    if(window.iceWinPanelTimeout)clearTimeout(window.iceWinPanelTimeout);
    window.iceWinPanelTimeout=setTimeout(()=>iceWinPanel.classList.add('show'),400);
    if(window.iceWinTimeout)clearTimeout(window.iceWinTimeout);
    window.iceWinTimeout=setTimeout(hideIceWinPanelAndReset,5200);
  }
  function hideIceWinPanelAndReset(){
    iceWinPanel.classList.remove('show');
    if(window.iceWinTimeout){clearTimeout(window.iceWinTimeout);window.iceWinTimeout=null}
    if(window.iceWinPanelTimeout){clearTimeout(window.iceWinPanelTimeout);window.iceWinPanelTimeout=null}
    iceState.winnerId=null;iceState.winnerPuckPop=false;
    updateIceWaitingText();updateIceBetUI();updateIceStatsBar();updateIceBetOverlayVisibility();updateIceTopPanelVisibility();
  }
  iceWinContinueBtn.addEventListener('click',()=>{haptic('light');hideIceWinPanelAndReset()});
  function placeIceBet(amount){
    if(!socket||!socket.connected)return;
    let v=parseInt(amount)||10;
    if(v<10)v=10; if(v>state.balance)v=state.balance;
    if(v<=0){haptic('light');return}
    socket.emit('icePlaceBet',{amount:v},res=>{
      if(!res?.ok){haptic('light');return}
      state.balance=res.balance;updateBalance();updateProfile();haptic('medium');
      addTransaction('bet',-v,'Ice Bet');
      if(res.level&&window.__applyLevelFromJoin){window.__applyLevelFromJoin(res.level,null);window.__levelState=res.level}
      if(window.__refreshLevel)window.__refreshLevel(true);
    });
    iceBetInput.value='';iceBetInput.blur();updateIceBetUI();
  }
  iceBetBtn.addEventListener('click',()=>placeIceBet(iceBetInput.value));
  iceAllInBtn.addEventListener('click',()=>{iceBetInput.value=state.balance;placeIceBet(state.balance)});
  iceBetInput.addEventListener('input',()=>{if(iceBetInput.value==='')iceBetInput.dataset.empty='true';else delete iceBetInput.dataset.empty});
  iceBetInput.addEventListener('blur',()=>{if(iceBetInput.dataset.empty==='true'||iceBetInput.value===''){iceBetInput.value=10;delete iceBetInput.dataset.empty}let v=parseInt(iceBetInput.value);if(isNaN(v)||v<10)v=10;if(v>state.balance)v=state.balance;iceBetInput.value=v});
  let iceBetCollapsed=false;
  iceBetToggleBtn.addEventListener('click',e=>{if(!iceBetCollapsed){e.stopPropagation();haptic('light');iceBetCollapsed=true;iceBetOverlay.classList.add('collapsed')}});
  iceBetOverlay.addEventListener('click',e=>{if(!iceBetCollapsed)return;haptic('light');iceBetCollapsed=false;iceBetOverlay.classList.remove('collapsed')});
  let iceAutoBetInterval=null,iceAutoBetEnabled=false;
  function toggleIceAutoBet(enable){
    if(enable&&!iceAutoBetEnabled){iceAutoBetEnabled=true;iceAutoToggle.classList.add('active');iceAutoToggle.textContent='▶';if(iceAutoBetInterval)clearInterval(iceAutoBetInterval);iceAutoBetInterval=setInterval(()=>{const canBet=(iceState.gameState==='idle'||iceState.gameState==='countdown');if(!canBet)return;const existing=iceState.players.find(p=>p.id===state.userId);if(existing)return;const amount=parseInt(iceAutoAmount.value)||10;if(amount<10||amount>state.balance)return;placeIceBet(amount)},2000)}
    else if(!enable&&iceAutoBetEnabled){iceAutoBetEnabled=false;iceAutoToggle.classList.remove('active');iceAutoToggle.textContent='⏱';if(iceAutoBetInterval){clearInterval(iceAutoBetInterval);iceAutoBetInterval=null}}
  }
  iceAutoToggle.addEventListener('click',()=>iceAutoPanel.classList.toggle('open'));
  iceAutoSwitchWrap.addEventListener('click',e=>{e.stopPropagation();const checked=!iceAutoSwitch.checked;iceAutoSwitch.checked=checked;toggleIceAutoBet(checked);haptic('light')});
  iceAutoSwitch.addEventListener('change',()=>toggleIceAutoBet(iceAutoSwitch.checked));

  function animateWaitingText(){
    const el=iceWaitingText;if(!el)return;
    let mainSpan=el.querySelector('span'),subSpan=el.querySelector('.sub');
    if(!mainSpan){mainSpan=document.createElement('span');mainSpan.textContent=el.textContent.trim();el.innerHTML='';el.appendChild(mainSpan)}
    const text=mainSpan.textContent;mainSpan.innerHTML='';
    text.split('').forEach((char,idx)=>{
      const span=document.createElement('span');span.className='waiting-letter';
      span.textContent=char===' '?'\u00A0':char;
      span.style.animationDelay=(idx*.08)+'s';
      setTimeout(()=>{span.classList.add('light');setTimeout(()=>span.classList.remove('light'),800)},idx*80+200);
      mainSpan.appendChild(span);
    });
    if(!subSpan){subSpan=document.createElement('div');subSpan.className='sub';subSpan.textContent='place a bet to claim the rink';el.appendChild(subSpan)}
    setInterval(()=>{
      const spans=mainSpan.querySelectorAll('.waiting-letter');
      spans.forEach((s,i)=>{
        s.style.animation='none';s.offsetHeight;
        s.style.animation='letterBounce 1.2s cubic-bezier(0.34,1.56,0.64,1) forwards';
        s.style.animationDelay=(i*.08)+'s';
        s.classList.remove('light');
        setTimeout(()=>{s.classList.add('light');setTimeout(()=>s.classList.remove('light'),800)},i*80+200);
      });
    },5000);
  }

  const tileSpriteCache=new Map();
  function getTileSprite(color,rw,rh){
    const w=Math.max(32,Math.ceil(rw/32)*32);
    const h=Math.max(32,Math.ceil(rh/32)*32);
    const key=color+'|'+w+'x'+h;
    let cv=tileSpriteCache.get(key); if(cv)return cv;
    const dpr=PERF.dpr;
    cv=document.createElement('canvas'); cv.width=Math.ceil(w*dpr); cv.height=Math.ceil(h*dpr);
    const g=cv.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
    const fg=g.createLinearGradient(0,0,w,h);
    fg.addColorStop(0,lightenColor(color,35)); fg.addColorStop(0.5,color); fg.addColorStop(1,lightenColor(color,20));
    g.fillStyle=fg; g.fillRect(0,0,w,h);
    if(tileSpriteCache.size>24)tileSpriteCache.delete(tileSpriteCache.keys().next().value);
    tileSpriteCache.set(key,cv); return cv;
  }
  const AVATAR_SPRITE_SIZE=192;
  const avatarSpriteCache=new Map();
  function getAvatarSprite(p){
    const isMe=(p.id===state.userId);
    const anon=isMe&&state.anonymous;
    const hide=isMe&&state.hidePfp;
    const ready=!!(p.pfpImg&&p._realPfpLoaded&&p.pfpImg.complete&&p.pfpImg.naturalWidth>0);
    let baseKey;
    if(anon||hide)baseKey='anon|'+state.userId+'|'+(state.anonymousName||'A');
    else if(ready)baseKey='img|'+(p._pfpSrc||p.pfp||'default');
    else baseKey='solid|'+(p.color||'#555');
    const key=baseKey+'|'+AVATAR_SPRITE_SIZE;
    let cv=avatarSpriteCache.get(key); if(cv)return cv;
    const size=AVATAR_SPRITE_SIZE;
    cv=document.createElement('canvas'); cv.width=size; cv.height=size;
    const g=cv.getContext('2d'); const R=size/2;
    g.beginPath(); g.arc(R,R,R,0,Math.PI*2); g.clip();
    if(anon||hide){g.fillStyle=getAnonymousColor(state.userId);g.fillRect(0,0,size,size);g.fillStyle='#fff';g.font='bold '+(size*0.4)+'px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText((state.anonymousName||'A').charAt(0).toUpperCase(),R,R+1)}
    else if(ready){try{g.drawImage(p.pfpImg,0,0,size,size)}catch(_){}}
    else{g.fillStyle=p.color||'#555';g.fillRect(0,0,size,size)}
    if(avatarSpriteCache.size>48)avatarSpriteCache.delete(avatarSpriteCache.keys().next().value);
    avatarSpriteCache.set(key,cv); return cv;
  }

  function renderIce(){
    const w=iceState.arenaSize; if(!w)return;
    const half=w/2; const s=iceScaleFactor();
    iceCtx.clearRect(0,0,w,w);
    if(!rinkCache||rinkCacheSize!==w||!cachedPerimeterPath)buildRinkCache();
    const path=cachedPerimeterPath; if(!path)return;
    let zoomActive=iceState.zoomCenterFixed && iceState.zoom>1.001;
    if(zoomActive){const csx=iceState.zoomCenterX*s,csy=iceState.zoomCenterY*s;const tx=(half-csx)*iceState.zoom+half-half*iceState.zoom;const ty=(half-csy)*iceState.zoom+half-half*iceState.zoom;iceCtx.fillStyle='#060a12';iceCtx.fillRect(0,0,w,w);iceCtx.save();iceCtx.translate(tx,ty);iceCtx.scale(iceState.zoom,iceState.zoom);if(rinkCache)iceCtx.drawImage(rinkCache,0,0,w,w)}
    else{if(rinkCache)iceCtx.drawImage(rinkCache,0,0,w,w)}
    if(iceState.gameState==='countdown'&&iceState.countdownPulseStart){const age=(performance.now()-iceState.countdownPulseStart)/1000;if(age<0.9){const t=age/0.9;const e=1-Math.pow(1-t,3);const alpha=(1-e)*0.75;const blur=8+e*55;iceCtx.save();iceCtx.shadowColor='rgba(255,255,255,'+alpha+')';iceCtx.shadowBlur=blur;iceCtx.strokeStyle='rgba(255,255,255,'+(alpha*0.6)+')';iceCtx.lineWidth=2+(1-e)*3;iceCtx.lineJoin='round';iceCtx.stroke(path);iceCtx.restore()}}
    if(iceState.gameState==='idle'&&PERF.shadows){iceState.glowPhase+=.03;const pulse=.3+.7*(.5+.5*Math.sin(iceState.glowPhase));const alpha=.10+.22*pulse,blur=22+34*pulse;iceCtx.save();iceCtx.shadowColor='rgba(180,210,255,'+alpha+')';iceCtx.shadowBlur=blur;iceCtx.strokeStyle='rgba(180,210,255,'+(alpha*.45)+')';iceCtx.lineWidth=5;iceCtx.lineJoin='round';iceCtx.stroke(path);iceCtx.restore()}
    if(iceState.gameState==='idle'){
      if(!iceState.idlePuckInitialized){iceState.idlePuck.x=w/2;iceState.idlePuck.y=w/2;const angle=Math.random()*Math.PI*2,speed=2+Math.random()*1.5;iceState.idlePuck.vx=Math.cos(angle)*speed;iceState.idlePuck.vy=Math.sin(angle)*speed;iceState.idlePuck.radius=PUCK_RENDER_RADIUS;iceState.idlePuckInitialized=true}
      let x=iceState.idlePuck.x,y=iceState.idlePuck.y,vx=iceState.idlePuck.vx,vy=iceState.idlePuck.vy;
      x+=vx;y+=vy;const r=iceState.idlePuck.radius,margin=18;
      if(x-r<margin){x=margin+r;vx=-vx}if(x+r>w-margin){x=w-margin-r;vx=-vx}
      if(y-r<margin){y=margin+r;vy=-vy}if(y+r>w-margin){y=w-margin-r;vy=-vy}
      iceState.idlePuck.x=x;iceState.idlePuck.y=y;iceState.idlePuck.vx=vx;iceState.idlePuck.vy=vy;
      drawPuckSprite(iceCtx,x,y,PUCK_RENDER_RADIUS*s);
      if(iceState.players.length===0){if(zoomActive)iceCtx.restore();return}
    }
    const now=performance.now();
    const puck=iceState.puck;
    let rpx,rpy;
    if(iceState.gameState==='sliding'){const ip=getInterpolatedPuck();rpx=ip.x;rpy=ip.y}
    else{rpx=puck.x;rpy=puck.y}
    if(iceState.gameState==='sliding'){
      const elapsedMs=now-iceState.slideStartTime;
      if(!iceState.zoomFired){const ZOOM_LEAD_MS=200;const EXPECTED_STOP_MS=5440;let trigger=elapsedMs>=(EXPECTED_STOP_MS-ZOOM_LEAD_MS);if(!trigger&&puckBuffer.length){const lastSnap=puckBuffer[puckBuffer.length-1];const sv=Math.hypot(lastSnap.vx||0,lastSnap.vy||0);if(sv<0.15)trigger=true}if(trigger){iceState.zoomCenterX=rpx;iceState.zoomCenterY=rpy;iceState.zoomCenterFixed=true;iceState.isZoomingIn=true;iceState.zoomStartTime=now;iceState.zoomTarget=1.45;iceState.zoomFired=true;iceState.zoomDuration=0.5}}
      if(iceState.isZoomingIn){iceState.zoomCenterX+=(rpx-iceState.zoomCenterX)*0.25;iceState.zoomCenterY+=(rpy-iceState.zoomCenterY)*0.25}
      iceState.prevRenderX=rpx;iceState.prevRenderY=rpy;iceState.lastFrameTime=now;
    }
    if(iceState.isZoomingOut){const elapsed=(now-iceState.zoomStartTime)/1000,p=Math.min(elapsed/iceState.zoomDuration,1),e=easeInOutCubic(p);iceState.zoom=iceState.zoomTarget+(1-iceState.zoomTarget)*(1-e);const cX=SERVER_ARENA_SIZE/2,cY=SERVER_ARENA_SIZE/2;iceState.zoomCenterX+=(cX-iceState.zoomCenterX)*0.11;iceState.zoomCenterY+=(cY-iceState.zoomCenterY)*0.11;if(p>=1){iceState.isZoomingOut=false;iceState.zoom=1;iceState.zoomLocked=false;iceState.zoomOutTriggered=false;iceState.zoomCenterFixed=false}}
    if(iceState.isZoomingIn){const elapsed=(now-iceState.zoomStartTime)/1000,p=Math.min(elapsed/iceState.zoomDuration,1),e=easeInOutCubic(p);iceState.zoom=1+(iceState.zoomTarget-1)*e;if(p>=1){iceState.isZoomingIn=false;iceState.zoomLocked=true;iceState.zoom=iceState.zoomTarget}}
    const speed=Math.sqrt(Math.pow(rpx-iceState.puckPrevX,2)+Math.pow(rpy-iceState.puckPrevY,2));
    iceCtx.save();
    if(iceCtx.roundRect){iceCtx.beginPath();iceCtx.roundRect(0,0,w,w,iceState.cornerRadius*s);iceCtx.clip()}
    else{iceCtx.clip(path)}
    const highlight=state.fieldHighlightEnabled;
    for(let pi=0;pi<iceState.players.length;pi++){
      const p=iceState.players[pi];
      if(p._displayPoly&&p._targetPoly&&p._displayPoly.length===p._targetPoly.length){const dp=p._displayPoly,tp=p._targetPoly;for(let i=0;i<dp.length;i++){const ddx=tp[i].x-dp[i].x;const ddy=tp[i].y-dp[i].y;if(ddx*ddx+ddy*ddy<0.0001){dp[i].x=tp[i].x;dp[i].y=tp[i].y}else{dp[i].x+=ddx*0.22;dp[i].y+=ddy*0.22}}}
      const poly=p._displayPoly; if(!poly||poly.length<3)continue;
      let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
      for(let i=0;i<poly.length;i++){const sx=poly[i].x*s,sy=poly[i].y*s;if(sx<minX)minX=sx;if(sy<minY)minY=sy;if(sx>maxX)maxX=sx;if(sy>maxY)maxY=sy}
      const segW=maxX-minX,segH=maxY-minY; if(segW<=0||segH<=0)continue;
      const isWinner=(iceState.gameState==='finished'&&iceState.winnerId===p.id);
      iceCtx.save(); iceCtx.beginPath(); iceCtx.moveTo(poly[0].x*s,poly[0].y*s);
      for(let i=1;i<poly.length;i++)iceCtx.lineTo(poly[i].x*s,poly[i].y*s);
      iceCtx.closePath(); iceCtx.clip();
      iceCtx.globalAlpha=isWinner?1:0.92;
      iceCtx.drawImage(getTileSprite(p.color,segW,segH),minX,minY,segW,segH);
      if(isWinner){iceCtx.globalAlpha=0.35;iceCtx.fillStyle='#ffffff';iceCtx.fillRect(minX,minY,segW,segH)}
      iceCtx.globalAlpha=1;
      if(highlight){const corners=findBboxCorners(poly);const blickR=Math.min(32*s,Math.min(segW,segH)*0.30);for(const c of corners){if(!c)continue;const gx=c.x*s,gy=c.y*s;const g=iceCtx.createRadialGradient(gx,gy,0,gx,gy,blickR);g.addColorStop(0,'rgba(255,255,255,0.55)');g.addColorStop(0.45,'rgba(255,255,255,0.14)');g.addColorStop(1,'rgba(255,255,255,0)');iceCtx.fillStyle=g;iceCtx.beginPath();iceCtx.arc(gx,gy,blickR,0,Math.PI*2);iceCtx.fill()}}
      iceCtx.restore();
      const meta=polyMeta(poly); const cx=meta.cx*s; const cy=meta.cy*s; const inR=meta.inR*s;
      let pfpScale=1;
      const pd=iceState.pfpPop.get(p.id);
      if(pd){const e=(now-pd.startTime)/1000;const pr=Math.min(e/(pd.duration/1000),1);if(pr<1)pfpScale=Math.max(0,Math.min(1.2,easeOutBack(pr)));else iceState.pfpPop.delete(p.id)}
      const avatarR=Math.min(inR*0.65,Math.min(segW,segH)*0.32);
      const drawR=avatarR*pfpScale;
      if(drawR<=0.5)continue;
      iceCtx.drawImage(getAvatarSprite(p),cx-drawR,cy-drawR,drawR*2,drawR*2);
    }
    if(highlight){
      for(let pi=0;pi<iceState.players.length;pi++){
        const p=iceState.players[pi]; const poly=p._displayPoly;
        if(!poly||poly.length<3)continue;
        iceCtx.strokeStyle='rgba(255,255,255,0.80)'; iceCtx.lineWidth=1.6; iceCtx.lineJoin='round';
        iceCtx.beginPath(); iceCtx.moveTo(poly[0].x*s,poly[0].y*s);
        for(let i=1;i<poly.length;i++)iceCtx.lineTo(poly[i].x*s,poly[i].y*s);
        iceCtx.closePath(); iceCtx.stroke();
      }
    }
    if(iceState.confetti.length){
      const nowC=performance.now();
      iceState.confetti=iceState.confetti.filter(c=>{
        const age=(nowC-c.born)/1000;
        if(age*1000>=c.life)return false;
        c.vy+=320*(1/60);c.x+=c.vx*(1/60);c.y+=c.vy*(1/60);c.rot+=c.vrot*(1/60);c.vx*=0.985;
        const lifeT=age*1000/c.life; const alpha=1-Math.pow(lifeT,2);
        iceCtx.save(); iceCtx.globalAlpha=alpha; iceCtx.translate(c.x*s,c.y*s); iceCtx.rotate(c.rot); iceCtx.fillStyle=c.color; iceCtx.fillRect(-c.w*s/2,-c.h*s/2,c.w*s,c.h*s); iceCtx.restore();
        return true;
      });
    }
    iceCtx.restore();
    const pn=performance.now();
    if(iceState.wallPulses.length){
      iceState.wallPulses=iceState.wallPulses.filter(pulse=>{
        const elapsed=pn-pulse.startTime;
        if(elapsed>=pulse.duration)return false;
        const t=elapsed/pulse.duration;
        let alpha=(t<.15)?t/.15:1-(t-.15)/.85;
        alpha=Math.max(0,Math.min(1,alpha));
        const pxp=pulse.x*s,pyp=pulse.y*s,r=(20+t*60)*s;
        const gd=iceCtx.createRadialGradient(pxp,pyp,0,pxp,pyp,r);
        gd.addColorStop(0,'rgba(180,210,255,'+(alpha*.95*pulse.intensity)+')');
        gd.addColorStop(.35,'rgba(180,210,255,'+(alpha*.35*pulse.intensity)+')');
        gd.addColorStop(1,'rgba(180,210,255,0)');
        iceCtx.save(); iceCtx.fillStyle=gd; iceCtx.beginPath(); iceCtx.arc(pxp,pyp,r,0,Math.PI*2); iceCtx.fill(); iceCtx.restore();
        return true;
      });
    }
    if(iceState.gameState==='spinning'&&iceState.spinStartTime){
      const elapsed=(Date.now()-iceState.spinStartTime)/1000;
      const t=Math.min(1,elapsed/(iceState.spinDuration||1));
      const angle=iceState.spinFinalAngle-(1-easeOutCubic(t))*(4*Math.PI*2);
      const centerX=iceState.spinStartX*s,centerY=iceState.spinStartY*s;
      const puckR=PUCK_RENDER_RADIUS*s,orbit=puckR+4;
      const triSize=Math.min(w*.035,10),tipOffset=triSize*.4;
      iceCtx.save(); iceCtx.translate(centerX,centerY); iceCtx.rotate(angle); iceCtx.translate(orbit,0);
      iceCtx.beginPath(); iceCtx.moveTo(tipOffset,0); iceCtx.lineTo(-tipOffset*.3,-triSize*.5); iceCtx.lineTo(-tipOffset*.3,triSize*.5); iceCtx.closePath();
      iceCtx.fillStyle='#e8f4ff'; iceCtx.shadowColor='rgba(180,210,255,.9)'; iceCtx.shadowBlur=14; iceCtx.fill(); iceCtx.shadowBlur=0;
      iceCtx.strokeStyle='rgba(180,210,255,.45)'; iceCtx.lineWidth=1; iceCtx.stroke();
      iceCtx.restore();
    }
    if(iceState.puckVisible){
      const nowMs=performance.now();
      let scale=1;
      if(iceState.puckPopStart){const p=Math.min((nowMs-iceState.puckPopStart)/400,1);scale=Math.max(0,Math.min(1.2,easeOutBack(p)));if(p>=1)iceState.puckPopStart=0}
      let ws=1;
      if(iceState.winnerPuckPop){const t=Math.min(1,(nowMs-iceState.winnerPuckPopStart)/iceState.winnerPuckPopDuration);const e=1-Math.pow(1-t,3);ws=1+(1.06-1)*Math.sin(e*Math.PI*2)*(1-t);if(t>=1){ws=1;iceState.winnerPuckPop=false}}
      const total=scale*ws;
      let px,py;
      if(iceState.gameState==='spinning'){px=iceState.spinStartX*s;py=iceState.spinStartY*s}
      else{px=rpx*s;py=rpy*s}
      const r=PUCK_RENDER_RADIUS*s*total;
      drawPuckSprite(iceCtx,px,py,r);
      const isSlow=speed<2&&iceState.gameState==='sliding';
      let ownerName='';
      if(iceState.players.length>0&&iceState.gameState==='sliding'){for(const p of iceState.players){if(p.poly&&pointInPoly(rpx,rpy,p.poly)){ownerName=p.name||'Player';break}}}
      if(isSlow&&ownerName){iceState.currentOwnerName=ownerName;iceState.showOwnerName=true;iceState.nameFadeIn=Math.min(1,iceState.nameFadeIn+.03)}
      else if(!isSlow||!ownerName){iceState.nameFadeIn=Math.max(0,iceState.nameFadeIn-.02);if(iceState.nameFadeIn<=0)iceState.showOwnerName=false}
      if(iceState.showOwnerName&&iceState.currentOwnerName&&iceState.nameFadeIn>.1){
        const alpha=iceState.nameFadeIn*.6,fs=Math.max(9,Math.min(14,r*.9));
        iceCtx.save(); iceCtx.globalAlpha=alpha; iceCtx.textAlign='center'; iceCtx.textBaseline='top';
        iceCtx.font='bold '+fs+'px system-ui, sans-serif';
        iceCtx.fillStyle='rgba(255,255,255,.9)'; iceCtx.shadowColor='rgba(0,0,0,.9)'; iceCtx.shadowBlur=6;
        let dn=iceState.currentOwnerName; if(dn.length>10)dn=dn.slice(0,9)+'…';
        iceCtx.fillText(dn,px,py+r+4); iceCtx.restore();
      }
    }
    if(zoomActive)iceCtx.restore();
  }

  let _cdCine=false,_cdUrg=false;
  let _lastTimerText='';
  let lastFrameTs=0;
  function renderLoop(ts){
    requestAnimationFrame(renderLoop);
    if(state.currentTab!=='ice')return;
    if(document.hidden)return;
    if(PERF.targetFrameMs && ts && lastFrameTs && (ts-lastFrameTs)<PERF.targetFrameMs)return;
    lastFrameTs=ts||performance.now();
    const now=Date.now();
    if(iceState.gameState==='countdown'&&iceState.countdownStartTime){
      const elapsed=(now-iceState.countdownStartTime)/1000;
      const remaining=Math.max(0,10-elapsed);
      const secs=Math.floor(remaining),ms=Math.floor((remaining-secs)*100);
      const txt=secs+'.'+String(ms).padStart(2,'0');
      if(txt!==_lastTimerText){_lastTimerText=txt;iceCountdownTimer.textContent=txt}
      iceTimerProgress.style.transform='scaleX('+Math.min(1,elapsed/10)+')';
      const inCinematic=remaining<=3.05&&remaining>0;
      const urgent=remaining<=1.05&&remaining>0;
      if(inCinematic!==_cdCine){_cdCine=inCinematic;iceCountdownTimer.classList.toggle('cinematic',inCinematic)}
      if(urgent!==_cdUrg){_cdUrg=urgent;iceCountdownTimer.classList.toggle('urgent',urgent)}
      if(inCinematic&&secs!==iceState.countdownLastSecond){iceState.countdownLastSecond=secs;iceState.countdownPulseStart=now;iceCountdownTimer.classList.remove('tick');void iceCountdownTimer.offsetWidth;iceCountdownTimer.classList.add('tick');haptic(secs<=1?'heavy':'medium')}
      if(!inCinematic&&iceState.countdownLastSecond!==-1)iceState.countdownLastSecond=-1;
    }
    updateIceTopPanelVisibility();
    renderIce();
  }
  hidePfpToggle.addEventListener('change',async function(){const hide=this.checked;try{const r=await fetch(SERVER_URL+'/api/toggle-hide-pfp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,hide})});const d=await r.json();if(d.ok){state.hidePfp=d.hidePfp;applyIdentity()}else{this.checked=!hide;showNotif(d.error||'Failed')}}catch(e){this.checked=!hide;showNotif('Network error')}});
  soundToggle.addEventListener('change',()=>{state.soundEnabled=soundToggle.checked});
  bounceLightsToggle.addEventListener('change',()=>{state.bounceLightsEnabled=bounceLightsToggle.checked});

  const fieldHighlightToggle=document.getElementById('field-highlight-toggle');
  if(fieldHighlightToggle){try{state.fieldHighlightEnabled=localStorage.getItem('dllump_field_highlight')==='1'}catch(_){}
    fieldHighlightToggle.checked=state.fieldHighlightEnabled;
    fieldHighlightToggle.addEventListener('change',()=>{state.fieldHighlightEnabled=fieldHighlightToggle.checked;try{localStorage.setItem('dllump_field_highlight',state.fieldHighlightEnabled?'1':'0')}catch(_){};haptic('light')});
  }
  const storyRingsToggle=document.getElementById('story-rings-toggle');
  function spawnStoryRing(x,y,size){if(!PERF.storyRings)return;const ring=document.createElement('span');ring.className='story-ring';ring.style.width=size+'px';ring.style.height=size+'px';ring.style.left=x+'px';ring.style.top=y+'px';document.body.appendChild(ring);setTimeout(()=>{if(ring.parentNode)ring.parentNode.removeChild(ring)},600)}
  if(storyRingsToggle){try{if(localStorage.getItem('dllump_story_rings')==='1'){state.storyRingsEnabled=true;storyRingsToggle.checked=true}}catch(e){}
    storyRingsToggle.addEventListener('change',()=>{state.storyRingsEnabled=storyRingsToggle.checked;try{localStorage.setItem('dllump_story_rings',state.storyRingsEnabled?'1':'0')}catch(e){};haptic('light');if(state.storyRingsEnabled){const row=storyRingsToggle.closest('.setting');if(row){const rect=row.getBoundingClientRect();spawnStoryRing(rect.left+rect.width-42,rect.top+rect.height/2,56)}}});
  }
  const STORY_RING_SEL='button, .tab, .quick-btn, .setting, .round-tile, .layout-tile, .swatch, .panel-tab, .top-entry, .ice-bet-toggle, .rank-stat, .champion-card';
  document.addEventListener('pointerdown',e=>{if(!state.storyRingsEnabled)return;const target=e.target.closest(STORY_RING_SEL);if(!target)return;const rect=target.getBoundingClientRect();const base=Math.min(rect.width,rect.height);const size=Math.max(34,Math.min(70,base*0.95));spawnStoryRing(e.clientX,e.clientY,size)},{passive:true});

  function applyBgBlur(on){document.body.setAttribute('data-bg-blur',on?'on':'off');const b1=$('#bg-blur-toggle'),b2=$('#bg-blur-toggle-2');if(b1)b1.checked=on;if(b2)b2.checked=on;try{localStorage.setItem('dllump_bg_blur',on?'on':'off')}catch(e){}}
  function applyBgImage(on){document.body.setAttribute('data-bg-image',on?'on':'off');const i1=$('#bg-image-toggle'),i2=$('#bg-image-toggle-2');if(i1)i1.checked=on;if(i2)i2.checked=on;try{localStorage.setItem('dllump_bg_image',on?'on':'off')}catch(e){}}
  [$('#bg-blur-toggle'),$('#bg-blur-toggle-2')].filter(Boolean).forEach(el=>el.addEventListener('change',()=>{haptic('light');applyBgBlur(el.checked)}));
  [$('#bg-image-toggle'),$('#bg-image-toggle-2')].filter(Boolean).forEach(el=>el.addEventListener('change',()=>{haptic('light');applyBgImage(el.checked)}));
  try{applyBgBlur((localStorage.getItem('dllump_bg_blur')||'on')==='on')}catch(e){applyBgBlur(true)}
  try{applyBgImage((localStorage.getItem('dllump_bg_image')||'on')==='on')}catch(e){applyBgImage(true)}

  const promoBtn=$('#promo-btn'),promoMsg=$('#promo-message');
  promoBtn.addEventListener('click',async()=>{
    haptic('light');
    const inp=$('#promo-input');const code=inp.value.trim().toUpperCase();
    if(!code){promoMsg.textContent='Enter a code.';promoMsg.style.color='var(--red)';return}
    if(!state.userId){promoMsg.textContent='Not logged in.';promoMsg.style.color='var(--red)';return}
    const key='dllump_promo_'+state.userId;
    if(localStorage.getItem(key)==='1'){promoMsg.textContent='Already used a promo.';promoMsg.style.color='var(--red)';return}
    promoBtn.disabled=true;promoBtn.textContent='...';promoMsg.textContent='';
    try{const r=await fetch(SERVER_URL+'/redeem',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,userId:state.userId})});const d=await r.json();if(d.ok){localStorage.setItem(key,'1');state.balance=d.newBalance;updateBalance();promoMsg.textContent='+'+d.amount+' added';promoMsg.style.color='var(--green)';inp.value='';addTransaction('win',d.amount,'Promo Bonus');haptic('medium');showNotif('Promo applied · +'+d.amount)}else{promoMsg.textContent=d.error||'Invalid code';promoMsg.style.color='var(--red)'}}catch(e){promoMsg.textContent='Network error';promoMsg.style.color='var(--red)'}
    finally{promoBtn.disabled=false;promoBtn.textContent='Redeem'}
  });

  function initWalletCard(){
    const container=$('#wallet-card-container'); const card=$('#wallet-card'); const glare=$('#card-glare'); const sheen=document.querySelector('.card-sheen'); const starsContainer=$('#card-stars');
    if(!container||!card)return;
    if(starsContainer){starsContainer.innerHTML='';const starCount=PERF.heavyEffects?40:15;for(let i=0;i<starCount;i++){const s=document.createElement('div');s.className='star';s.style.left=(Math.random()*100)+'%';s.style.top=(Math.random()*100)+'%';s.style.animationDelay=(Math.random()*3)+'s';s.style.animationDuration=(2+Math.random()*3)+'s';const sz=Math.random()*1.6+.5;s.style.width=sz+'px';s.style.height=sz+'px';starsContainer.appendChild(s)}}
    let dragging=false,lastX=0,lastY=0,dragOffX=0,dragOffY=0,velX=0,velY=0,rotX=0,rotY=0,flipped=false,flipProgress=0;
    const start=performance.now(); let downTime=0,moved=false,pid=null; const MAX=32;
    let cardActive=false;
    function tick(now){if(!cardActive){requestAnimationFrame(tick);return}const t=(now-start)/1000;const baseRotX=Math.sin(t*.45)*9+Math.sin(t*.78)*3;const baseRotY=Math.cos(t*.55)*13+Math.cos(t*.92)*4;if(!dragging){dragOffX+=velX;dragOffY+=velY;velX*=.93;velY*=.93;dragOffX*=.985;dragOffY*=.985;if(Math.abs(dragOffX)<.04)dragOffX=0;if(Math.abs(dragOffY)<.04)dragOffY=0}dragOffX=Math.max(-MAX,Math.min(MAX,dragOffX));dragOffY=Math.max(-MAX,Math.min(MAX,dragOffY));const tf=flipped?180:0;flipProgress+=(tf-flipProgress)*.085;const tX=baseRotX+dragOffX,tY=baseRotY+dragOffY+flipProgress;rotX+=(tX-rotX)*.18;rotY+=(tY-rotY)*.18;card.style.transform='rotateX('+rotX.toFixed(2)+'deg) rotateY('+rotY.toFixed(2)+'deg)';if(glare){const gx=50+(rotY/MAX)*42,gy=50-(rotX/MAX)*42;const bright=.28+Math.min(.25,Math.abs(rotX+rotY)/90*.35);glare.style.background='radial-gradient(circle at '+Math.max(-15,Math.min(115,gx)).toFixed(1)+'% '+Math.max(-15,Math.min(115,gy)).toFixed(1)+'%,rgba(255,255,255,'+(bright*1.4).toFixed(3)+') 0%,rgba(255,255,255,'+(bright*.35).toFixed(3)+') 25%,transparent 55%)'}if(sheen){const hx=50+rotY*1.4,hy=50-rotX*1.4;sheen.style.backgroundPosition=hx.toFixed(1)+'% '+hy.toFixed(1)+'%'}requestAnimationFrame(tick)}
    const observer=new MutationObserver(()=>{cardActive=document.getElementById('wallet-page').classList.contains('active')});
    observer.observe(document.getElementById('wallet-page'),{attributes:true,attributeFilter:['class']});
    requestAnimationFrame(tick);
    container.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;moved=false;downTime=performance.now();pid=e.pointerId;lastX=e.clientX;lastY=e.clientY;velX=0;velY=0;try{container.setPointerCapture(e.pointerId)}catch(_){}});
    document.addEventListener('pointermove',e=>{if(!dragging||(pid!==null&&e.pointerId!==pid))return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)>1.5||Math.abs(dy)>1.5)moved=true;dragOffY+=dx*.55;dragOffX-=dy*.55;velX=-dy*.40;velY=dx*.40;lastX=e.clientX;lastY=e.clientY},{passive:true});
    document.addEventListener('pointerup',e=>{if(!dragging)return;if(pid!==null&&e.pointerId!==pid)return;dragging=false;pid=null;if(!moved&&performance.now()-downTime<400){flipped=!flipped;haptic('light')}});
  }

  let layoutMode='panel';
  try{layoutMode=localStorage.getItem('dllump_layout')||'panel'}catch(e){}
  function applyLayout(mode){layoutMode=mode;document.body.setAttribute('data-layout',mode);try{localStorage.setItem('dllump_layout',mode)}catch(e){}const sw=$('#layout-switch');if(sw)sw.checked=(mode==='panel');$$('.layout-tile').forEach(t=>t.classList.toggle('active',t.dataset.layoutTile===mode));const hint=$('#panel-hint');if(mode==='simple'){if(hint)hint.classList.add('hidden');if(panelOpen)closePanel()}else{if(hint)hint.classList.remove('hidden')}}
  const panel=$('#panel'),panelBackdrop=$('#panel-backdrop'),panelHint=$('#panel-hint');
  let panelOpen=false;
  function openPanel(){if(layoutMode!=='panel'||panelOpen)return;panelOpen=true;haptic('medium');panel.classList.add('open');panelBackdrop.classList.add('show');panelHint.classList.add('hidden')}
  function closePanel(){if(!panelOpen)return;panelOpen=false;haptic('light');panel.classList.remove('open');panelBackdrop.classList.remove('show');if(layoutMode==='panel')panelHint.classList.remove('hidden')}
  panelHint.addEventListener('click',openPanel);
  $('#menu-btn').addEventListener('click',openPanel);
  $('#settings-btn').addEventListener('click',()=>{
    haptic('light');
    openPanel();
    // Switch to the Style tab inside the panel
    $$('.panel-tab').forEach(x=>x.classList.toggle('active', x.dataset.ptab==='style'));
    $$('.panel-view').forEach(v=>v.classList.toggle('active', v.id==='pview-style'));
  });
  $('#panel-close').addEventListener('click',closePanel);
  $('#grabber').addEventListener('click',closePanel);
  panelBackdrop.addEventListener('click',closePanel);

  let edgeDrag=false,edgeStartX=0,edgeStartY=0;
  document.addEventListener('pointerdown',e=>{if(panelOpen||layoutMode!=='panel')return;if(e.clientX<=24){edgeDrag=true;edgeStartX=e.clientX;edgeStartY=e.clientY}},{passive:true});
  document.addEventListener('pointermove',e=>{if(!edgeDrag)return;if(e.clientX-edgeStartX>40&&Math.abs(e.clientY-edgeStartY)<30){edgeDrag=false;openPanel()}},{passive:true});
  document.addEventListener('pointerup',()=>edgeDrag=false,{passive:true});

  $$('.panel-tab').forEach(t=>t.addEventListener('click',()=>{haptic('light');$$('.panel-tab').forEach(x=>x.classList.toggle('active',x===t));$$('.panel-view').forEach(v=>v.classList.toggle('active',v.id==='pview-'+t.dataset.ptab))}));
  $$('[data-action]').forEach(el=>el.addEventListener('click',()=>{const a=el.dataset.action;haptic('light');if(['ice','wallet','profile','top'].includes(a)){closePanel();setTimeout(()=>switchTab(a),220)}}));

  function applyTheme(name){document.documentElement.setAttribute('data-theme',name);try{localStorage.setItem('dllump_theme',name)}catch(e){}$$('#theme-swatches .swatch').forEach(x=>x.classList.toggle('active',x.dataset.theme===name))}
  $$('#theme-swatches .swatch').forEach(s=>s.addEventListener('click',()=>{haptic('light');applyTheme(s.dataset.theme)}));
  try{applyTheme(localStorage.getItem('dllump_theme')||'onyx')}catch(e){applyTheme('onyx')}

  function applyRound(name){document.body.setAttribute('data-round',name);let st=$('#round-style');if(!st){st=document.createElement('style');st.id='round-style';document.head.appendChild(st)}const sc=name==='sharp'?.4:name==='round'?1.5:1;st.textContent='.card,.settings-list,.stat-card,.tab-inner,.promo input,.promo button,.top-entry,.pc-face{border-radius:'+(16*sc)+'px !important}.card-face,.card-sheen,.card-shine,.card-glare{border-radius:'+(22*sc)+'px !important}';$$('#round-tiles .round-tile').forEach(x=>x.classList.toggle('active',x.dataset.round===name));try{localStorage.setItem('dllump_round',name)}catch(e){}}
  $$('#round-tiles .round-tile').forEach(t=>t.addEventListener('click',()=>{haptic('light');applyRound(t.dataset.round)}));
  try{applyRound(localStorage.getItem('dllump_round')||'normal')}catch(e){applyRound('normal')}

  $$('.layout-tile').forEach(t=>t.addEventListener('click',()=>{haptic('light');applyLayout(t.dataset.layoutTile)}));
  const ls=$('#layout-switch');if(ls)ls.addEventListener('change',()=>{haptic('light');applyLayout(ls.checked?'panel':'simple')});

  function applyEffect(key,on){document.body.classList.toggle(key,!!on);try{localStorage.setItem('dllump_fx_'+key,on?'1':'0')}catch(_){}}
  (function initEffects(){const defs=[['ambient-glow','ambient-glow-toggle',false],['no-vignette','vignette-toggle',false],['neon-accents','neon-accents-toggle',false],['compact','compact-toggle',false]];defs.forEach(([cls,id,defOn])=>{const toggle=document.getElementById(id);let stored;try{stored=localStorage.getItem('dllump_fx_'+cls)}catch(_){}if(cls==='no-vignette'){const vignetteOn=(stored===null)?!defOn:(stored!=='1');if(toggle)toggle.checked=vignetteOn;document.body.classList.toggle('no-vignette',!vignetteOn);if(toggle)toggle.addEventListener('change',()=>{haptic('light');const vOn=toggle.checked;document.body.classList.toggle('no-vignette',!vOn);try{localStorage.setItem('dllump_fx_no-vignette',vOn?'0':'1')}catch(_){}})}else{const on=(stored===null)?defOn:(stored==='1');if(toggle)toggle.checked=on;document.body.classList.toggle(cls,on);if(toggle)toggle.addEventListener('change',()=>{haptic('light');applyEffect(cls,toggle.checked)})}})})();

  (function(){
    const bp=document.getElementById('bp'),chip=document.getElementById('bet-drag-chip'),iceCanvasEl=document.getElementById('ice-canvas');
    if(!bp||!chip||!iceCanvasEl)return;
    const HOLD_MS=400,BET_AMOUNT=10;
    let holding=false,dragging=false,bouncedOut=false,holdTimer=null,holdPointerId=null,startX=0,startY=0,bpRect=null;
    function canBetNow(){if(state.currentTab!=='ice')return false;const g=iceState.gameState;return (g==='idle'||g==='countdown')}
    function cleanup(){holding=false;dragging=false;bouncedOut=false;clearTimeout(holdTimer);holdTimer=null;try{if(holdPointerId!=null)bp.releasePointerCapture(holdPointerId)}catch(_){}bp.classList.remove('charging','charged','bounce-out');chip.classList.remove('show','over-arena','dropping','drop-into','bounce-back');chip.style.left='-9999px';chip.style.top='-9999px';holdPointerId=null}
    bp.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;if(!canBetNow())return;if(holding||dragging)return;holding=true;holdPointerId=e.pointerId;startX=e.clientX;startY=e.clientY;bpRect=bp.getBoundingClientRect();bp.classList.add('charging');try{bp.setPointerCapture(e.pointerId)}catch(_){}clearTimeout(holdTimer);holdTimer=setTimeout(()=>{if(!holding)return;holding=false;dragging=true;bouncedOut=false;haptic('medium');bp.classList.remove('charging');bp.classList.add('charged');chip.style.left=startX+'px';chip.style.top=startY+'px';chip.classList.add('show')},HOLD_MS)});
    document.addEventListener('pointermove',e=>{if(holding){const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.sqrt(dx*dx+dy*dy)>10){holding=false;clearTimeout(holdTimer);bp.classList.remove('charging')}return}if(!dragging)return;chip.style.left=e.clientX+'px';chip.style.top=e.clientY+'px';const r=iceCanvasEl.getBoundingClientRect();const over=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;chip.classList.toggle('over-arena',over);if(!bouncedOut&&bpRect){const inside=e.clientX>=bpRect.left&&e.clientX<=bpRect.right&&e.clientY>=bpRect.top&&e.clientY<=bpRect.bottom;if(!inside){bouncedOut=true;bp.classList.remove('charged');bp.classList.add('bounce-out');setTimeout(()=>bp.classList.remove('bounce-out'),620)}}},{passive:true});
    document.addEventListener('pointerup',e=>{clearTimeout(holdTimer);if(holding){holding=false;bp.classList.remove('charging');return}if(!dragging)return;dragging=false;chip.classList.remove('over-arena');const r=iceCanvasEl.getBoundingClientRect();const over=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;if(over){placeIceBet(BET_AMOUNT);haptic('heavy');const cx=r.left+r.width/2,cy=r.top+r.height/2;chip.classList.add('dropping','drop-into');chip.style.left=cx+'px';chip.style.top=cy+'px';setTimeout(cleanup,460)}else{chip.classList.add('dropping','bounce-back');if(bpRect){chip.style.left=(bpRect.left+bpRect.width/2)+'px';chip.style.top=(bpRect.top+bpRect.height/2)+'px'}setTimeout(cleanup,520)}});
    document.addEventListener('pointercancel',cleanup);
  })();

  const trOverlay=document.getElementById('transfer-overlay');
  const trComposePage=document.getElementById('tr-compose-page');
  const trSignPage=document.getElementById('tr-sign-page');
  const trClose=document.getElementById('tr-close');
  const trSignBack=document.getElementById('tr-sign-back');
  const trBalanceNum=document.getElementById('tr-balance-num');
  const trUsernameInput=document.getElementById('tr-username');
  const trUsernameDisp=document.getElementById('tr-username-display');
  const trAmountInput=document.getElementById('tr-amount');
  const trAmountDisp=document.getElementById('tr-amount-display');
  const trSubmit=document.getElementById('tr-submit');
  const trError=document.getElementById('tr-error');
  const trChips=document.getElementById('tr-chips');
  const paperTo=document.getElementById('paper-to');
  const paperAmountNum=document.getElementById('paper-amount-num');
  const paperDate=document.getElementById('paper-date');
  const paperSender=document.getElementById('paper-sender');
  const paperArrow=document.getElementById('paper-arrow');
  const trSigCanvas=document.getElementById('tr-sig-canvas');
  const trContinue=document.getElementById('tr-continue');
  let trTransferData=null,trSigned=false,trDrawing=false,trDrawnPoints=0,trPending=false;
  const trSigCtx=trSigCanvas.getContext('2d');

  function attachTypeMirror(inputEl,displayEl){
    let chars=[]; let lastVal='';
    function buildStatic(val){displayEl.innerHTML='';chars=[];for(let i=0;i<val.length;i++){const s=document.createElement('span');s.className='tr-char';s.textContent=val[i];displayEl.appendChild(s);chars.push(s)}const caret=document.createElement('span');caret.className='tr-caret';displayEl.appendChild(caret);lastVal=val}
    function onInput(){const val=inputEl.value;const old=lastVal;if(val.length<=old.length||Math.abs(val.length-old.length)>1){buildStatic(val);return}if(val.length===old.length+1&&val.slice(0,old.length)===old){const newChar=val.charAt(val.length-1);const caret=displayEl.querySelector('.tr-caret');if(caret)caret.remove();const s=document.createElement('span');s.className='tr-char in';s.textContent=newChar;displayEl.appendChild(s);chars.push(s);const newCaret=document.createElement('span');newCaret.className='tr-caret';displayEl.appendChild(newCaret);lastVal=val;setTimeout(()=>s.classList.remove('in'),500)}else{buildStatic(val)}}
    inputEl.addEventListener('input',onInput);
    inputEl.addEventListener('paste',()=>setTimeout(()=>buildStatic(inputEl.value),0));
    inputEl.addEventListener('change',()=>buildStatic(inputEl.value));
    buildStatic(inputEl.value);
    return {sync:()=>buildStatic(inputEl.value)};
  }
  const trAmountMirror=attachTypeMirror(trAmountInput,trAmountDisp);
  const trUsernameMirror=attachTypeMirror(trUsernameInput,trUsernameDisp);
  let trBalanceAnim=null;
  function animateTrBalance(target){if(trBalanceAnim)cancelAnimationFrame(trBalanceAnim);const start=performance.now();const dur=900;const from=0;const to=Math.max(0,Math.floor(target));function frame(t){const p=Math.min(1,(t-start)/dur);const e=p===1?1:1-Math.pow(2,-10*p);const v=Math.round(from+(to-from)*e);trBalanceNum.textContent=v.toLocaleString();if(p<1)trBalanceAnim=requestAnimationFrame(frame);else{trBalanceNum.textContent=to.toLocaleString();trBalanceAnim=null}}trBalanceAnim=requestAnimationFrame(frame)}
  trChips.addEventListener('click',e=>{const chip=e.target.closest('.tr-chip');if(!chip)return;const pct=parseFloat(chip.dataset.pct);if(!Number.isFinite(pct))return;const raw=Math.floor(state.balance*pct);let val;if(pct===1)val=Math.floor(state.balance);else val=Math.max(1,Math.floor(raw));trAmountInput.value=String(val);trAmountMirror.sync();haptic('light');chip.animate([{transform:'scale(.9)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.34,1.56,.64,1)'})});
  function flashError(msg){trError.textContent=msg||'';if(msg){trError.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:280,easing:'ease-out'})}}
  function trShowPage(which){if(which==='compose'){trComposePage.classList.add('active');trSignPage.classList.remove('active')}else{trComposePage.classList.remove('active');trSignPage.classList.add('active')}}
  function resizeSigCanvas(){const rect=trSigCanvas.getBoundingClientRect();if(rect.width<2||rect.height<2)return;const dpr=Math.min(window.devicePixelRatio||1,3);trSigCanvas.width=Math.round(rect.width*dpr);trSigCanvas.height=Math.round(rect.height*dpr);trSigCtx.setTransform(dpr,0,0,dpr,0,0);trSigCtx.lineWidth=2.2;trSigCtx.lineCap='round';trSigCtx.lineJoin='round';trSigCtx.strokeStyle='#0a1a2a'}
  function trClearSig(){const r=trSigCanvas.getBoundingClientRect();trSigCtx.clearRect(0,0,r.width,r.height);trSigned=false;trDrawnPoints=0;trContinue.disabled=true;trContinue.classList.remove('enabled','success');paperArrow.classList.remove('hidden')}
  function trReset(){trTransferData=null;trPending=false;trDrawing=false;trUsernameInput.value='';trAmountInput.value='';trAmountMirror.sync();trUsernameMirror.sync();trError.textContent='';trContinue.textContent='Continue';trClearSig();trShowPage('compose')}
  function openTransfer(){if(!state.userId){showNotif('Please sign in first');return}trReset();trOverlay.style.display='flex';requestAnimationFrame(()=>{requestAnimationFrame(()=>{trOverlay.classList.add('show');animateTrBalance(state.balance)})});haptic('medium');setTimeout(()=>{try{trAmountInput.focus()}catch(_){}},480)}
  function closeTransfer(){trOverlay.classList.remove('show');haptic('light');setTimeout(()=>{trOverlay.style.display='none';trReset()},420)}
  function trSigPos(e){const rect=trSigCanvas.getBoundingClientRect();return{x:e.clientX-rect.left,y:e.clientY-rect.top}}
  trSigCanvas.addEventListener('pointerdown',e=>{if(trPending)return;e.preventDefault();trDrawing=true;try{trSigCanvas.setPointerCapture(e.pointerId)}catch(_){}const p=trSigPos(e);trSigCtx.beginPath();trSigCtx.moveTo(p.x,p.y)});
  trSigCanvas.addEventListener('pointermove',e=>{if(!trDrawing)return;e.preventDefault();const p=trSigPos(e);trSigCtx.lineTo(p.x,p.y);trSigCtx.stroke();trDrawnPoints++;if(!trSigned&&trDrawnPoints>12){trSigned=true;trContinue.disabled=false;trContinue.classList.add('enabled');paperArrow.classList.add('hidden');haptic('light')}});
  function trEndSig(e){if(!trDrawing)return;trDrawing=false;try{trSigCanvas.releasePointerCapture(e.pointerId)}catch(_){}}
  trSigCanvas.addEventListener('pointerup',trEndSig);trSigCanvas.addEventListener('pointercancel',trEndSig);trSigCanvas.addEventListener('pointerleave',trEndSig);
  trSubmit.addEventListener('click',()=>{
    if(trPending)return;
    const rawUser=trUsernameInput.value.trim();const rawAmt=trAmountInput.value.trim();
    const clean=rawUser.replace(/^@/,'').toLowerCase();const amount=Math.floor(Number(rawAmt)||0);
    flashError('');
    if(!clean||clean.length<3){flashError('Enter a valid username');haptic('light');return}
    if(clean===(state.username||'').toLowerCase()){flashError('Cannot transfer to yourself');haptic('light');return}
    if(!Number.isFinite(amount)||amount<=0){flashError('Enter a valid amount');haptic('light');return}
    if(amount>state.balance){flashError('Insufficient balance');haptic('light');return}
    trTransferData={username:clean,amount};
    paperTo.textContent='@'+clean; paperAmountNum.textContent=amount.toLocaleString();
    const now=new Date(); const dateStr=now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    const timeStr=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    paperDate.textContent=dateStr+' · '+timeStr; paperSender.textContent='@'+(state.username||'player');
    trShowPage('sign'); haptic('medium');
    requestAnimationFrame(()=>{resizeSigCanvas();setTimeout(resizeSigCanvas,60)});
  });
  trSignBack.addEventListener('click',()=>{if(trPending)return;trShowPage('compose');haptic('light')});
  trContinue.addEventListener('click',async()=>{
    if(!trSigned||trPending||!trTransferData)return;
    trPending=true;trContinue.disabled=true;
    const originalText=trContinue.textContent; trContinue.textContent='OK'; trContinue.classList.add('success');
    try{
      const r=await fetch(SERVER_URL+'/api/transfer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fromUserId:state.userId,toUsername:trTransferData.username,amount:trTransferData.amount})});
      const d=await r.json();
      if(d.ok){const amt=trTransferData.amount;const to=trTransferData.username;state.balance=d.newBalance;updateBalance();addTransaction('bet',-amt,'Transfer to @'+to);trOverlay.style.transition='transform .18s ease, opacity .18s ease';trOverlay.classList.remove('show');showTransferSuccess(amt,to);haptic('heavy');setTimeout(()=>{trOverlay.style.display='none';trOverlay.style.transition='';trReset()},200)}
      else{trContinue.textContent=originalText;trContinue.classList.remove('success');trContinue.disabled=false;flashError(d.error||'Transfer failed');trShowPage('compose');trPending=false;haptic('light')}
    }catch(err){trContinue.textContent=originalText;trContinue.classList.remove('success');trContinue.disabled=false;flashError('Network error');trShowPage('compose');trPending=false;haptic('light')}
  });
  trClose.addEventListener('click',closeTransfer);
  function showTransferSuccess(amount,username){
    if(!toastContainer)return;
    const existing=toastContainer.querySelectorAll('.toast:not(.dismissing)');
    if(existing.length>=MAX_TOASTS)dismissToast(existing[0]);
    const t=document.createElement('div'); t.className='toast toast-success';
    t.innerHTML='<div class="toast-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><div class="toast-text"><div class="toast-main">Transferred '+amount.toLocaleString()+' <img src="https://i.postimg.cc/vHKQ9y9q/diamond-elegant.gif" alt=""></div><div class="toast-sub">to @'+username+'</div></div><button class="toast-close" type="button" aria-label="Dismiss">✕</button>';
    toastContainer.appendChild(t);
    requestAnimationFrame(()=>{requestAnimationFrame(()=>t.classList.add('show'))});
    const closeBtn=t.querySelector('.toast-close');
    closeBtn.addEventListener('pointerdown',e=>{e.stopPropagation();dismissToast(t)});
    t._autoTimer=setTimeout(()=>dismissToast(t),5000);
    attachSwipe(t);
  }
  const walletTransferBtn=document.getElementById('wallet-transfer-btn');
  if(walletTransferBtn)walletTransferBtn.addEventListener('click',openTransfer);
  window.addEventListener('resize',()=>{if(trOverlay.classList.contains('show')&&trSignPage.classList.contains('active')){resizeSigCanvas()}});
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  const ANON_FEES={name:50,username:150,phone:1500};
  const anonOpenBtn=document.getElementById('anon-open-btn');
  const anonFull=document.getElementById('anon-full');
  const anonBack=document.getElementById('anon-back');
  const anonStatusDot=document.getElementById('anon-status-dot');
  const anonCard=document.getElementById('anon-card');
  const anonPfp=document.getElementById('anon-pfp');
  const anonFieldName=document.getElementById('anon-field-name');
  const anonFieldUsername=document.getElementById('anon-field-username');
  const anonFieldPhone=document.getElementById('anon-field-phone');
  const anonInputName=document.getElementById('anon-input-name');
  const anonInputUsername=document.getElementById('anon-input-username');
  const anonRollBtn=document.getElementById('anon-roll-btn');
  const anonToggleBtn=document.getElementById('anon-toggle-btn');
  const anonConfirm=document.getElementById('anon-confirm');
  const anonConfirmTitle=document.getElementById('anon-confirm-title');
  const anonConfirmText=document.getElementById('anon-confirm-text');
  const anonConfirmCancel=document.getElementById('anon-confirm-cancel');
  const anonConfirmOk=document.getElementById('anon-confirm-ok');
  let anonState={enabled:false,name:'',username:'',phone:''};
  let anonEditingField=null;
  let anonPendingAction=null;
  let rollInFlight=false;
  let phoneCurrent=document.getElementById('phone-current');
  window.__anonState=anonState;
  function setDisplayText(el,text,animate){if(!el)return;const span=el.querySelector('span');if(!span)return;if(animate){typeIn(span,text)}else{if(span._typeTimer){clearTimeout(span._typeTimer);span._typeTimer=null}span.textContent=text}}
  function updateAnonUI(animate){
    const letter=(anonState.name||'A').charAt(0).toUpperCase();
    anonPfp.querySelector('span').textContent=letter;
    const color=getAnonymousColor(state.userId||'anon');
    anonPfp.style.background=color;
    anonPfp.style.borderColor='rgba(255,255,255,.22)';
    if(anonState.name){anonFieldName.classList.remove('empty');setDisplayText(anonFieldName,anonState.name,animate)}
    else{anonFieldName.classList.add('empty');setDisplayText(anonFieldName,'—',false)}
    if(anonState.username){anonFieldUsername.classList.remove('empty');setDisplayText(anonFieldUsername,'@'+anonState.username,animate)}
    else{anonFieldUsername.classList.add('empty');setDisplayText(anonFieldUsername,'—',false)}
    if(!phoneCurrent.parentElement)return;
    if(!rollInFlight){phoneCurrent.textContent=anonState.phone||'—'}
    anonFieldPhone.classList.toggle('empty',!anonState.phone);
    if(anonState.enabled){anonToggleBtn.textContent='DISABLE';anonToggleBtn.classList.add('on');anonStatusDot.classList.add('on')}
    else{anonToggleBtn.textContent='ENABLE';anonToggleBtn.classList.remove('on');anonStatusDot.classList.remove('on')}
    anonRollBtn.disabled=rollInFlight;
    refreshAnonProfile();
  }
  function openAnonFull(){anonFull.classList.remove('closing');anonFull.style.display='flex';requestAnimationFrame(()=>requestAnimationFrame(()=>anonFull.classList.add('show')));haptic('medium');updateAnonUI(true);anonCard.style.transition='none';anonCard.style.opacity='0';anonCard.style.transform='perspective(900px) translateY(80px) rotateX(9deg) rotateY(-5deg) scale(.92)';void anonCard.offsetWidth;anonCard.style.transition='transform .7s cubic-bezier(.34,1.56,.64,1), opacity .45s ease';anonCard.style.transform='perspective(900px) translateY(0) rotateX(3deg) rotateY(-2deg) scale(1)';anonCard.style.opacity='1'}
  function closeAnonFull(){cancelFieldEdit();anonFull.classList.add('closing');anonFull.classList.remove('show');haptic('light');anonCard.style.transition='transform .3s ease, opacity .25s ease';anonCard.style.transform='perspective(900px) translateY(50px) rotateX(6deg) rotateY(-4deg) scale(.96)';anonCard.style.opacity='0';setTimeout(()=>{anonFull.style.display='none';anonFull.classList.remove('closing')},400)}
  anonOpenBtn.addEventListener('click',openAnonFull); anonBack.addEventListener('click',closeAnonFull);
  function showAnonConfirm(title,htmlBody,okLabel,onConfirm){anonConfirmTitle.textContent=title;anonConfirmText.innerHTML=htmlBody;anonConfirmOk.textContent=okLabel;anonPendingAction=onConfirm;anonConfirm.classList.add('show')}
  function hideAnonConfirm(){anonConfirm.classList.remove('show');anonPendingAction=null}
  anonConfirmCancel.addEventListener('click',hideAnonConfirm);
  anonConfirm.addEventListener('click',e=>{if(e.target===anonConfirm)hideAnonConfirm()});
  anonConfirmOk.addEventListener('click',async()=>{if(!anonPendingAction)return;const fn=anonPendingAction;anonConfirmOk.disabled=true;try{await fn()}finally{anonConfirmOk.disabled=false;hideAnonConfirm()}});
  function beginFieldEdit(field){if(anonEditingField===field)return;cancelFieldEdit();const fieldEl=document.querySelector('.anon-field[data-field="'+field+'"]');if(!fieldEl)return;const inputEl=fieldEl.querySelector('.anon-field-input');const currentVal=field==='username'?anonState.username:anonState.name;inputEl.value=currentVal||'';inputEl.placeholder=field==='name'?'New name':'new_username';fieldEl.classList.add('editing');anonEditingField=field;setTimeout(()=>{try{inputEl.focus();inputEl.select()}catch(_){}},60)}
  function cancelFieldEdit(){if(!anonEditingField)return;const fieldEl=document.querySelector('.anon-field[data-field="'+anonEditingField+'"]');if(fieldEl){fieldEl.classList.remove('editing');const inputEl=fieldEl.querySelector('.anon-field-input');if(inputEl)inputEl.value=''}anonEditingField=null}
  function commitFieldEdit(){
    if(!anonEditingField)return;
    const field=anonEditingField;
    const fieldEl=document.querySelector('.anon-field[data-field="'+field+'"]');
    const inputEl=fieldEl.querySelector('.anon-field-input');
    const value=inputEl.value.trim();
    const current=field==='username'?anonState.username:anonState.name;
    cancelFieldEdit();
    if(!value||value===current)return;
    if(field==='name'){if(!/^[A-Za-z][A-Za-z\s]{1,29}$/.test(value)){showNotif('Letters only, 2–30 chars');return}}
    else if(field==='username'){if(!/^[A-Za-z0-9_]{3,16}$/.test(value)){showNotif('Letters, numbers, underscore · 3–16 chars');return}}
    const fee=ANON_FEES[field];
    if(state.balance<fee){showNotif('Not enough diamonds');return}
    const label=field==='name'?'name':'username';
    const display=field==='username'?'@'+value:value;
    showAnonConfirm('Confirm purchase','Change '+label+' to <strong>'+escapeHtml(display)+'</strong> for <strong>'+fee+'</strong> diamonds?','Buy · '+fee,async()=>{
      try{const r=await fetch(SERVER_URL+'/api/change-anonymous',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,field,value})});const d=await r.json();if(!d.ok){showNotif(d.error||'Failed');return}anonState[field]=d.value;state.balance=d.newBalance;updateBalance();addTransaction('bet',-d.fee,'Anonymous '+field);applyIdentity();updateAnonUI(true);haptic('heavy');showNotif(label.charAt(0).toUpperCase()+label.slice(1)+' updated')}catch(err){showNotif('Network error')}
    });
  }
  document.querySelectorAll('.anon-field').forEach(fieldEl=>{
    const field=fieldEl.dataset.field;
    if(field==='phone')return;
    fieldEl.addEventListener('click',e=>{if(e.target.closest('.anon-field-input'))return;if(anonEditingField===field)return;beginFieldEdit(field)});
    const inputEl=fieldEl.querySelector('.anon-field-input');
    inputEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commitFieldEdit()}if(e.key==='Escape'){e.preventDefault();cancelFieldEdit()}});
    inputEl.addEventListener('blur',()=>{setTimeout(()=>{if(anonEditingField===field)commitFieldEdit()},120)});
  });
  document.addEventListener('pointerdown',e=>{if(!anonEditingField)return;if(e.target.closest('.anon-field'))return;if(e.target.closest('.anon-confirm'))return;commitFieldEdit()},{passive:true});
  anonToggleBtn.addEventListener('click',async()=>{
    if(anonToggleBtn.disabled)return;
    const want=!anonState.enabled;
    if(want){
      anonToggleBtn.disabled=true;
      try{const r=await fetch(SERVER_URL+'/api/toggle-anonymous',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,enabled:true})});const d=await r.json();if(!d.ok){showNotif(d.error||'Failed');return}anonState.enabled=true;anonState.name=d.name||'';anonState.username=d.username||'';anonState.phone=d.phone||'';state.anonymous=true;applyIdentity();updateAnonUI(true);haptic('heavy');showNotif('Anonymous mode enabled')}catch(err){showNotif('Network error')}
      finally{anonToggleBtn.disabled=false}
    }else{
      showAnonConfirm('Disable anonymous mode','Your real name and picture will be visible again.','Disable',async()=>{
        try{const r=await fetch(SERVER_URL+'/api/toggle-anonymous',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,enabled:false})});const d=await r.json();if(!d.ok){showNotif(d.error||'Failed');return}anonState.enabled=false;state.anonymous=false;applyIdentity();updateAnonUI(false);haptic('medium');showNotif('Anonymous mode disabled')}catch(err){showNotif('Network error')}
      });
    }
  });
  function randPhone(){let s='';for(let i=0;i<9;i++)s+=Math.floor(Math.random()*10);return '+' + s.replace(/(\d{3})(\d{3})(\d{3})/,'$1 $2 $3')}
  function teaserPhone(){const r=Math.random();if(r<0.02)return '+888 000 000';if(r<0.06)return '+777 777 777';if(r<0.10)return '+123 456 789';return randPhone()}
  function setPhoneValue(value){
    const parent=phoneCurrent.parentElement;
    const outEl=phoneCurrent;
    outEl.style.transition='transform .28s ease, opacity .28s ease'; outEl.style.transform='translateY(-100%)'; outEl.style.opacity='0';
    const incoming=document.createElement('span'); incoming.className='phone-current'; incoming.textContent=value;
    incoming.style.transition='none'; incoming.style.transform='translateY(100%)'; incoming.style.opacity='0';
    parent.appendChild(incoming);
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{incoming.style.transition='transform .28s cubic-bezier(.34,1.56,.64,1), opacity .22s ease';incoming.style.transform='translateY(0)';incoming.style.opacity='1'})});
    setTimeout(()=>{try{outEl.remove()}catch(_){}},320);
    phoneCurrent=incoming;
  }
  async function doPhoneRoll(){
    if(rollInFlight)return;
    if(state.balance<ANON_FEES.phone){showNotif('Need '+ANON_FEES.phone+' diamonds to roll');return}
    rollInFlight=true; anonRollBtn.disabled=true;
    let serverResult=null;
    try{const r=await fetch(SERVER_URL+'/api/roll-phone',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId})});const d=await r.json();if(!d.ok){showNotif(d.error||'Roll failed');rollInFlight=false;anonRollBtn.disabled=false;return}serverResult=d}catch(err){showNotif('Network error');rollInFlight=false;anonRollBtn.disabled=false;return}
    const isRare=!!serverResult.rareAnimation;
    const startTime=performance.now(); const DURATION_MS=isRare?4200:2200;
    let delay=42; const growth=isRare?1.115:1.085;
    while(performance.now()-startTime<DURATION_MS){setPhoneValue(teaserPhone());try{haptic('light')}catch(_){}await new Promise(res=>setTimeout(res,delay));delay=delay*growth}
    setPhoneValue(serverResult.phone);
    if(isRare){await new Promise(res=>setTimeout(res,360));phoneCurrent.classList.add('rare-pop');try{haptic('heavy')}catch(_){};await new Promise(res=>setTimeout(res,2300));phoneCurrent.classList.remove('rare-pop')}
    else{haptic('medium');await new Promise(res=>setTimeout(res,420))}
    try{const r=await fetch(SERVER_URL+'/api/change-anonymous',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,field:'phone',value:serverResult.phone})});const d=await r.json();if(!d.ok){showNotif(d.error||'Failed to save')}else{anonState.phone=d.value;state.balance=d.newBalance;updateBalance();addTransaction('bet',-d.fee,'Anonymous phone');haptic('heavy');if(isRare)showNotif('✦ '+String(serverResult.tier||'').toUpperCase()+' roll ✦');else if(serverResult.tier&&serverResult.tier!=='common')showNotif(String(serverResult.tier).toUpperCase()+' roll');else showNotif('Phone rolled');refreshAnonProfile()}}catch(err){showNotif('Network error')}
    rollInFlight=false; anonRollBtn.disabled=false; anonFieldPhone.classList.toggle('empty',!anonState.phone);
  }
  anonRollBtn.addEventListener('click',doPhoneRoll);
  window.__syncAnonFromJoin=function(user){if(!user)return;anonState.enabled=!!user.anonymousEnabled;anonState.name=user.anonymousName||'';anonState.username=user.anonymousUsername||'';anonState.phone=user.anonymousPhone||'';updateAnonUI(false);applyIdentity()};

  (function(){const brand=document.getElementById('tc');const gif=document.getElementById('brand-gif');if(!brand||!gif)return;const baseSrc=gif.getAttribute('src');function playOnce(){gif.classList.remove('playing');void gif.offsetWidth;gif.classList.add('playing');gif.src=baseSrc+'?p='+Date.now();try{haptic('light')}catch(_){}}brand.addEventListener('click',e=>{e.stopPropagation();playOnce()});gif.addEventListener('click',e=>{e.stopPropagation();playOnce()});setTimeout(()=>gif.classList.remove('playing'),1000)})();
  updateAnonUI(false);

  const LEVEL_RANK_NAMES=['Starter','Rookie','Pepe Lover','Meme Fan','NFT Lover','Degen','Crypto Bro','Airdrop Hunter','Diamond Hands','Whale','Ice Skater','Puck Master','Arena Regular','High Roller','Ice Veteran','Rink Legend','Arena Champion','Ice King','Arena Master','Ice Lord','Rink Royalty','Arena Friend'];
  window.__levelRankNames=LEVEL_RANK_NAMES;
  let levelState={level:1,rank:'Starter',xp:0,edges:3,maxLevel:22,currentLevelXp:0,nextLevelXp:1000,xpIntoLevel:0,xpForLevel:1000,xpToNext:1000,progress:0,isMax:false};
  let levelQuests=[];
  let levelMenuOpen=false;
  let levelTiltTimer=null;
  let levelUpInProgress=false;
  function badgePolygonPoints(edges,cx,cy,r){const offset=Math.PI/edges;const pts=[];for(let i=0;i<edges;i++){const a=-Math.PI/2+offset+(i/edges)*Math.PI*2;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return pts}
  function badgeSvgMarkup(level,size){
    level=Math.max(1,Math.min(22,level|0));
    const edges=3+Math.floor((level-1)/2);
    const strokeW=7; const outerR=46; const r=outerR-strokeW/2;
    const pts=badgePolygonPoints(edges,50,50,r);
    const ptsStr=pts.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join(' ');
    const fs=edges>10?26:edges>7?30:edges>5?34:38;
    return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true"><polygon points="'+ptsStr+'" fill="currentColor" stroke="currentColor" stroke-width="'+strokeW+'" stroke-linejoin="round"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="-apple-system,BlinkMacSystemFont,\'SF Pro Display\',Inter,sans-serif" font-size="'+fs+'" font-weight="900" letter-spacing="-1">'+level+'</text></svg>';
  }
  window.__badgeSvgMarkup=badgeSvgMarkup;
  const lvlBadgeBtn=document.getElementById('lvl-badge-btn');
  const lvlOverlay=document.getElementById('lvl-overlay');
  const lvlBackdrop=document.getElementById('lvl-backdrop');
  const lvlFlyer=document.getElementById('lvl-flyer');
  const lvlContent=document.getElementById('lvl-content');
  const lvlRankEl=document.getElementById('lvl-rank');
  const lvlLevelLine=document.getElementById('lvl-level-line');
  const lvlXpLabel=document.getElementById('lvl-xp-label');
  const lvlXpNext=document.getElementById('lvl-xp-next');
  const lvlProgressFill=document.getElementById('lvl-progress-fill');
  const lvlProgressNext=document.getElementById('lvl-progress-next');
  const lvlPointer=document.getElementById('lvl-pointer');
  const lvlPointerSvg=document.getElementById('lvl-pointer-svg');
  const lvlPointerNum=document.getElementById('lvl-pointer-num');
  const lvlQuestList=document.getElementById('lvl-quest-list');
  const lvlProgressTrack=document.querySelector('.lvl-progress-track');
  const FLYER_BASE=200;
  const FLYER_END_SCALE=0.72;
  function renderBadgeButton(){if(!lvlBadgeBtn)return;lvlBadgeBtn.innerHTML=badgeSvgMarkup(levelState.level,22)}
  function readCurrentPoints(svg){const poly=svg.querySelector('polygon');if(!poly)return null;const raw=poly.getAttribute('points');if(!raw)return null;return raw.trim().split(/\s+/).map(pair=>{const[x,y]=pair.split(',').map(Number);return[x,y]})}
  function alignPoints(pts,n){if(!pts||!pts.length){const out=[];for(let i=0;i<n;i++)out.push([50,50]);return out}const out=pts.slice(0,n);while(out.length<n)out.push(out[out.length-1].slice());return out}
  function setFlyerBadge(animate){
    if(!lvlFlyer)return;
    const level=Math.max(1,Math.min(22,levelState.level|0));
    const edges=3+Math.floor((level-1)/2);
    const strokeW=7; const outerR=46; const r=outerR-strokeW/2;
    const toPts=badgePolygonPoints(edges,50,50,r);
    const toPtsStr=toPts.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join(' ');
    const fs=edges>10?26:edges>7?30:edges>5?34:38;
    let svg=lvlFlyer.querySelector('svg');
    if(!svg){lvlFlyer.innerHTML=badgeSvgMarkup(level,FLYER_BASE);return}
    const poly=svg.querySelector('polygon'); const text=svg.querySelector('text');
    if(!poly)return;
    if(!animate){poly.setAttribute('points',toPtsStr);if(text){text.setAttribute('font-size',fs);text.textContent=String(level)}return}
    const fromPts=readCurrentPoints(svg);
    const from=alignPoints(fromPts,toPts.length);
    if(text){text.setAttribute('font-size',fs);if(text.textContent!==String(level)){text.textContent=String(level);try{text.animate([{transform:'scale(.55)',opacity:0},{transform:'scale(1.18)',opacity:1,offset:.55},{transform:'scale(.96)',opacity:1,offset:.78},{transform:'scale(1)',opacity:1}],{duration:560,easing:'cubic-bezier(.34,1.56,.64,1)',transformOrigin:'50% 50%'})}catch(_){}}}
    const start=performance.now(); const dur=900;
    function frame(t){const k=Math.min(1,(t-start)/dur);const e=easeInOutCubic(k);const cur=from.map((p,i)=>[p[0]+(toPts[i][0]-p[0])*e,p[1]+(toPts[i][1]-p[1])*e]);poly.setAttribute('points',cur.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join(' '));if(k<1)requestAnimationFrame(frame);else poly.setAttribute('points',toPtsStr)}
    requestAnimationFrame(frame);
    try{lvlFlyer.animate([{transform:'scale('+FLYER_END_SCALE+')'},{transform:'scale('+(FLYER_END_SCALE*1.08)+')',offset:.5},{transform:'scale('+FLYER_END_SCALE+')'}],{duration:700,easing:'cubic-bezier(.34,1.56,.64,1)'})}catch(_){}
  }
  function renderLevelContent(){
    if(lvlRankEl)lvlRankEl.textContent=levelState.rank;
    if(lvlLevelLine)lvlLevelLine.textContent='Level '+levelState.level;
    if(lvlXpLabel)lvlXpLabel.textContent=levelState.xpIntoLevel+' XP';
    if(lvlXpNext)lvlXpNext.textContent=levelState.isMax?'MAX LEVEL':(levelState.xpToNext+' XP TO GO');
    if(lvlProgressNext)lvlProgressNext.textContent=levelState.isMax?'—':(levelState.level+1);
    if(lvlPointerNum)lvlPointerNum.textContent=levelState.xpIntoLevel;
    renderQuestList();
  }
  function renderQuestList(){
    if(!lvlQuestList)return;
    if(!levelQuests.length){lvlQuestList.innerHTML='';return}
    lvlQuestList.innerHTML=levelQuests.map(q=>{
      const pct=Math.min(100,Math.round((q.progress/Math.max(1,q.target))*100));
      const btnClass=q.claimed?'lvl-quest-btn done':q.complete?'lvl-quest-btn ready':'lvl-quest-btn';
      const btnText=q.claimed?'Claimed':q.complete?'Claim':'Locked';
      const disabled=q.claimed||!q.complete?'disabled':'';
      return '<div class="lvl-quest"><div class="lvl-quest-top"><div class="lvl-quest-title">'+q.title+'</div><div class="lvl-quest-reward">+'+q.reward+' XP</div></div><div class="lvl-quest-desc">'+q.description+'</div><div class="lvl-quest-bar"><div class="lvl-quest-fill" style="width:'+pct+'%"></div></div><div class="lvl-quest-foot"><div class="lvl-quest-count">'+q.progress+' / '+q.target+'</div><button class="'+btnClass+'" data-quest-id="'+q.id+'" '+disabled+' type="button">'+btnText+'</button></div></div>';
    }).join('');
    lvlQuestList.querySelectorAll('button[data-quest-id]').forEach(btn=>{if(btn.disabled)return;btn.addEventListener('click',()=>claimQuest(btn.dataset.questId))});
  }
  function positionPointerAt(pct){if(!lvlPointer)return;const clamped=Math.max(0,Math.min(100,pct));lvlPointer.style.left=clamped+'%'}
  function triggerPointerTilt(duration){if(!lvlPointer)return;clearTimeout(levelTiltTimer);lvlPointer.classList.remove('tilt');void lvlPointer.offsetWidth;lvlPointer.classList.add('tilt');levelTiltTimer=setTimeout(()=>lvlPointer.classList.remove('tilt'),Math.max(200,duration-60))}
  function triggerPointerSpin(){if(lvlPointerSvg){lvlPointerSvg.classList.remove('spin');void lvlPointerSvg.offsetWidth;lvlPointerSvg.classList.add('spin');setTimeout(()=>{try{lvlPointerSvg.classList.remove('spin')}catch(_){}},1200)}}
  function animateNumber(el,from,to,duration){
    if(!el)return;
    if(el._numRaf){cancelAnimationFrame(el._numRaf);el._numRaf=null}
    from=Number(from)||0; to=Number(to)||0;
    if(from===to){el.textContent=to;return}
    const t0=performance.now(); const dur=Math.max(1,duration||400);
    function frame(t){const p=Math.min(1,(t-t0)/dur);const e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)el._numRaf=requestAnimationFrame(frame);else{el.textContent=to;el._numRaf=null}}
    el._numRaf=requestAnimationFrame(frame);
  }
  function flashProgressTrack(){if(!lvlProgressTrack)return;lvlProgressTrack.classList.remove('flash');void lvlProgressTrack.offsetWidth;lvlProgressTrack.classList.add('flash')}
  function updateBarLive(){
    const pct=levelState.isMax?100:(levelState.progress*100);
    lvlProgressFill.style.transition=''; lvlProgressFill.style.width=pct+'%';
    lvlPointer.style.transition=''; positionPointerAt(pct);
    if(lvlPointerNum)lvlPointerNum.textContent=levelState.xpIntoLevel;
    if(lvlXpLabel)lvlXpLabel.textContent=levelState.xpIntoLevel+' XP';
    if(lvlXpNext)lvlXpNext.textContent=levelState.isMax?'MAX LEVEL':(levelState.xpToNext+' XP TO GO');
    flashProgressTrack(); triggerPointerTilt(950);
  }
  function playLevelUpSequence(){
    if(levelUpInProgress)return;
    levelUpInProgress=true;
    const newLevel=levelState.level;
    lvlProgressFill.style.transition='width .5s cubic-bezier(.34,1.56,.64,1)';
    lvlProgressFill.style.width='100%';
    lvlPointer.style.transition='left .5s cubic-bezier(.34,1.56,.64,1), transform .7s cubic-bezier(.34,1.9,.4,1)';
    lvlPointer.style.left='100%';
    triggerPointerTilt(500); flashProgressTrack();
    if(lvlRankEl)lvlRankEl.textContent=levelState.rank;
    if(lvlLevelLine)lvlLevelLine.textContent='Level '+newLevel;
    if(lvlProgressNext)lvlProgressNext.textContent=levelState.isMax?'—':String(newLevel+1);
    if(lvlXpLabel)lvlXpLabel.textContent=levelState.xpForLevel+' XP';
    animateNumber(lvlPointerNum,0,levelState.xpForLevel,520);
    setTimeout(()=>setFlyerBadge(true),520);
    setTimeout(()=>{
      lvlProgressFill.style.transition='width .38s cubic-bezier(.4,0,.5,1)';
      lvlProgressFill.style.width='0%';
      lvlPointer.style.transition='left .38s cubic-bezier(.4,0,.5,1)';
      lvlPointer.style.left='0%';
      animateNumber(lvlPointerNum,levelState.xpForLevel,0,380);
      setTimeout(()=>{
        const pct=levelState.isMax?100:(levelState.progress*100);
        lvlProgressFill.style.transition='width .9s cubic-bezier(.34,1.56,.64,1)';
        lvlProgressFill.style.width=pct+'%';
        lvlPointer.style.transition='left .9s cubic-bezier(.34,1.56,.64,1), transform .7s cubic-bezier(.34,1.9,.4,1)';
        positionPointerAt(pct);
        if(lvlXpLabel)lvlXpLabel.textContent=levelState.xpIntoLevel+' XP';
        if(lvlXpNext)lvlXpNext.textContent=levelState.isMax?'MAX LEVEL':(levelState.xpToNext+' XP TO GO');
        animateNumber(lvlPointerNum,0,levelState.xpIntoLevel,900);
        triggerPointerTilt(900);
        setTimeout(()=>{levelUpInProgress=false},950);
      },140);
    },620);
  }
  async function refreshLevel(silent){
    if(!state.userId||!socket)return;
    try{
      const r=await fetch(SERVER_URL+'/api/level?userId='+encodeURIComponent(state.userId));
      const d=await r.json();
      if(!d.ok)return;
      const prevXp=levelState.xp; const prevLevel=levelState.level;
      levelState=d.level; levelQuests=d.quests||[];
      window.__levelState=levelState; renderBadgeButton();
      if(levelMenuOpen){
        if(levelState.level>prevLevel)playLevelUpSequence();
        else if(levelState.xp>prevXp){updateBarLive();renderQuestList()}
        else if(!silent){renderLevelContent()}
      }
    }catch(_){}
  }
  function openLevelMenu(){
    if(levelMenuOpen||!lvlOverlay)return;
    levelMenuOpen=true;
    const rect=lvlBadgeBtn.getBoundingClientRect();
    const cx=window.innerWidth/2; const cy=window.innerHeight*0.32;
    setFlyerBadge(false);
    lvlFlyer.style.transition='none';
    lvlFlyer.style.left=(rect.left+rect.width/2-FLYER_BASE/2)+'px';
    lvlFlyer.style.top=(rect.top+rect.height/2-FLYER_BASE/2)+'px';
    lvlFlyer.style.transform='scale('+(rect.width/FLYER_BASE)+')';
    lvlBadgeBtn.style.opacity='0';
    lvlBackdrop.classList.remove('visible'); lvlContent.classList.remove('visible');
    lvlProgressFill.style.transition='none'; lvlProgressFill.style.width='0%';
    lvlPointer.style.transition='none'; lvlPointer.style.left='0%';
    renderLevelContent();
    lvlOverlay.style.display='block';
    void lvlFlyer.offsetWidth;
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{
      lvlFlyer.style.transition='left .62s cubic-bezier(.34,1.56,.64,1), top .62s cubic-bezier(.34,1.56,.64,1), transform .62s cubic-bezier(.34,1.56,.64,1)';
      lvlFlyer.style.left=(cx-FLYER_BASE/2)+'px';
      lvlFlyer.style.top=(cy-FLYER_BASE/2)+'px';
      lvlFlyer.style.transform='scale('+FLYER_END_SCALE+')';
      lvlBackdrop.classList.add('visible');
      setTimeout(()=>lvlContent.classList.add('visible'),220);
      setTimeout(()=>{const pct=levelState.isMax?100:(levelState.progress*100);lvlProgressFill.style.transition='';lvlProgressFill.style.width=pct+'%';lvlPointer.style.transition='';positionPointerAt(pct);triggerPointerSpin()},460);
    })});
    refreshLevel(true);
  }
  function closeLevelMenu(){
    if(!levelMenuOpen||!lvlOverlay)return;
    levelMenuOpen=false;
    const rect=lvlBadgeBtn.getBoundingClientRect();
    lvlBackdrop.classList.remove('visible'); lvlContent.classList.remove('visible');
    lvlFlyer.style.transition='left .5s cubic-bezier(.4,0,.6,1), top .5s cubic-bezier(.4,0,.6,1), transform .5s cubic-bezier(.4,0,.6,1)';
    lvlFlyer.style.left=(rect.left+rect.width/2-FLYER_BASE/2)+'px';
    lvlFlyer.style.top=(rect.top+rect.height/2-FLYER_BASE/2)+'px';
    lvlFlyer.style.transform='scale('+(rect.width/FLYER_BASE)+')';
    setTimeout(()=>{lvlBadgeBtn.style.opacity='1';lvlOverlay.style.display='none'},480);
  }
  async function claimQuest(questId){
    if(!state.userId)return;
    try{
      const r=await fetch(SERVER_URL+'/api/claim-quest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:state.userId,questId})});
      const d=await r.json();
      if(!d.ok){showNotif(d.error||'Failed');return}
      const prevLevel=levelState.level;
      levelState=d.level; levelQuests=d.quests||[];
      window.__levelState=levelState; renderBadgeButton();
      haptic('heavy'); showNotif('+'+d.reward+' XP · '+levelState.rank);
      if(levelMenuOpen){if(levelState.level>prevLevel)playLevelUpSequence();else updateBarLive();renderQuestList()}
    }catch(_){showNotif('Network error')}
  }
  if(lvlBadgeBtn)lvlBadgeBtn.addEventListener('click',openLevelMenu);
  if(lvlOverlay){lvlOverlay.addEventListener('click',e=>{if(e.target===lvlOverlay||e.target===lvlBackdrop)closeLevelMenu()})}
  window.__refreshLevel=refreshLevel;
  window.__applyLevelFromJoin=function(level,quests){if(level){levelState=level;renderBadgeButton()}if(Array.isArray(quests))levelQuests=quests};

  window.__state=state;
  window.__showNotif=showNotif;
  window.__addTransaction=addTransaction;
  window.__updateBalance=updateBalance;
  window.__updateProfile=updateProfile;

  function init(){
    if(tg?.initDataUnsafe?.user){const u=tg.initDataUnsafe.user;state.username=u.username||u.first_name||'player';state.pfp=u.photo_url||''}
    applyIdentity();applyLayout(layoutMode);resizeIceCanvas();initWalletCard();
    setOnline(false);updateIndicator(false);requestAnimationFrame(renderLoop);refreshCardUI();
    renderBadgeButton();
    setTimeout(()=>{if(window.__refreshLevel)window.__refreshLevel(true)},1500);
  }
  init();
  setTimeout(()=>{resizeIceCanvas();updateIndicator(false)},4200);
  window.addEventListener('orientationchange',()=>setTimeout(resizeIceCanvas,250));
})();
</script>

<script>
/* ==========================================================================
   ICE UPGRADE GAME  (opens from Wallet → Upgrade)
   Optimised: fewer path-gen attempts, throttled field recompute, cheap label
   centre, and skipped redraws when nothing's moving.
   ========================================================================== */
(function(){
'use strict';

const S=400, R=24, PUCK_R=24;
const HOUSE=0.03;
const MIN_CHANCE=0.05, MAX_CHANCE=95;
const MAX_BET=1500, MIN_BET=10;
const SERVER_URL='https://dllump-production-0a3d.up.railway.app';
const SPEED_MULT={slow:1.5, normal:1.0, fast:0.5};

const U={
  chance:0.45, shown:0.45, shownVel:0, lastShown:-1, cutAngle:0,
  winPoly:null, losePoly:null, winCenter:null, loseCenter:null,
  winBB:null, loseBB:null,
  state:'idle',
  puck:{x:S/2,y:S/2}, puckScale:1, puckAlpha:1,
  path:null,
  spinStart:0, spinDuration:1.9, spinFinalAngle:0, spinArrowAngle:0, spinExtraTurns:4,
  rollStart:0, duration:10,
  outcome:false, rollMult:2, rollBet:10,
  bannerTimer:null, doneTimer:null,
  bet:10, balance:0,
  remaining:3, dailyLimit:3,
  speedMode:'normal',
  cv:null, ctx:null, cssSize:320, scale:0.8, dpr:1,
  lastFieldCompute:0,
  dirty:true
};

function buildPerimeter(size,r,N){
  const segs=[];
  segs.push({t:'l',a:{x:r,y:0},b:{x:size-r,y:0}});
  segs.push({t:'a',c:{x:size-r,y:r},a0:-Math.PI/2,a1:0});
  segs.push({t:'l',a:{x:size,y:r},b:{x:size,y:size-r}});
  segs.push({t:'a',c:{x:size-r,y:size-r},a0:0,a1:Math.PI/2});
  segs.push({t:'l',a:{x:size-r,y:size},b:{x:r,y:size}});
  segs.push({t:'a',c:{x:r,y:size-r},a0:Math.PI/2,a1:Math.PI});
  segs.push({t:'l',a:{x:0,y:size-r},b:{x:0,y:r}});
  segs.push({t:'a',c:{x:r,y:r},a0:Math.PI,a1:3*Math.PI/2});
  const lens=segs.map(s=>s.t==='l'?Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y):Math.abs(s.a1-s.a0)*r);
  const total=lens.reduce((a,b)=>a+b,0);
  const pts=[]; const step=total/N;
  let si=0,acc=0;
  for(let i=0;i<N;i++){
    const target=i*step;
    while(si<segs.length-1&&acc+lens[si]<target){acc+=lens[si];si++}
    const lt=Math.min(1,Math.max(0,(target-acc)/lens[si]));
    const s=segs[si]; let px,py;
    if(s.t==='l'){px=s.a.x+(s.b.x-s.a.x)*lt;py=s.a.y+(s.b.y-s.a.y)*lt}
    else{const a=s.a0+(s.a1-s.a0)*lt;px=s.c.x+r*Math.cos(a);py=s.c.y+r*Math.sin(a)}
    pts.push({x:px,y:py});
  }
  return pts;
}
const PERIM=buildPerimeter(S,R,240);
const RINK_PATH=(function(){const p=new Path2D();p.moveTo(PERIM[0].x,PERIM[0].y);for(let i=1;i<PERIM.length;i++)p.lineTo(PERIM[i].x,PERIM[i].y);p.closePath();return p})();

function polyArea(p){if(!p||p.length<3)return 0;let a=0;for(let i=0;i<p.length;i++){const q=p[i],r=p[(i+1)%p.length];a+=q.x*r.y-r.x*q.y}return Math.abs(a)*0.5}
function bboxOf(p){let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(const v of p){if(v.x<x0)x0=v.x;if(v.y<y0)y0=v.y;if(v.x>x1)x1=v.x;if(v.y>y1)y1=v.y}return{x0,y0,x1,y1}}
function centroidOf(p){let cx=0,cy=0;for(const v of p){cx+=v.x;cy+=v.y}return{x:cx/p.length,y:cy/p.length}}
function pointInPoly(px,py,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i].x,yi=poly[i].y,xj=poly[j].x,yj=poly[j].y;if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside}return inside}
function distToEdges(px,py,poly){let min=Infinity;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const ax=poly[j].x,ay=poly[j].y,bx=poly[i].x,by=poly[i].y;const dx=bx-ax,dy=by-ay;const l2=dx*dx+dy*dy;let t=l2>0?((px-ax)*dx+(py-ay)*dy)/l2:0;t=Math.max(0,Math.min(1,t));const d=Math.hypot(px-(ax+t*dx),py-(ay+t*dy));if(d<min)min=d}return min}

// CHEAP version: 8x8 grid, 1 refinement pass
function computeLabelCenter(poly){
  if(!poly||poly.length<3)return{x:S/2,y:S/2};
  const bb=bboxOf(poly);
  const w=bb.x1-bb.x0, h=bb.y1-bb.y0;
  if(w<1||h<1)return{x:(bb.x0+bb.x1)/2,y:(bb.y0+bb.y1)/2};
  const shortSide=Math.min(w,h);
  const bcx=(bb.x0+bb.x1)/2, bcy=(bb.y0+bb.y1)/2;
  if(pointInPoly(bcx,bcy,poly)){
    const d=distToEdges(bcx,bcy,poly);
    if(d>=shortSide*0.18)return{x:bcx,y:bcy};
  }
  const N=8; let bx=bcx,by=bcy,bd=-1;
  for(let iy=0;iy<=N;iy++)for(let ix=0;ix<=N;ix++){
    const x=bb.x0+(ix/N)*w, y=bb.y0+(iy/N)*h;
    if(!pointInPoly(x,y,poly))continue;
    const d=distToEdges(x,y,poly);
    if(d>bd){bd=d;bx=x;by=y}
  }
  let step=Math.max(w,h)/N;
  for(let it=0;it<1;it++){
    step*=0.4; let improved=false;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      if(dx===0&&dy===0)continue;
      const x=bx+dx*step, y=by+dy*step;
      if(x<bb.x0||x>bb.x1||y<bb.y0||y>bb.y1)continue;
      if(!pointInPoly(x,y,poly))continue;
      const d=distToEdges(x,y,poly);
      if(d>bd){bd=d;bx=x;by=y;improved=true}
    }
    if(!improved)break;
  }
  return{x:bx,y:by};
}

function polyToPath(poly){const p=new Path2D();if(!poly||poly.length<3)return p;p.moveTo(poly[0].x,poly[0].y);for(let i=1;i<poly.length;i++)p.lineTo(poly[i].x,poly[i].y);p.closePath();return p}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>{const s=Math.max(0,Math.min(255,Math.round(v))).toString(16);return s.length===1?'0'+s:s}).join('')}
function hslToRgb(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r,g,b;if(h<60){r=c;g=x;b=0}else if(h<120){r=x;g=c;b=0}else if(h<180){r=0;g=c;b=x}else if(h<240){r=0;g=x;b=c}else if(h<300){r=x;g=0;b=c}else{r=c;g=0;b=x}return[(r+m)*255,(g+m)*255,(b+m)*255]}
function lighten(hex,amt){let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);r=Math.min(255,r+amt);g=Math.min(255,g+amt);b=Math.min(255,b+amt);return rgbToHex(r,g,b)}
function chanceToHue(c){c=Math.max(0,Math.min(1,c));if(c<=0.5)return(c/0.5)*35;return 35+((c-0.5)/0.5)*95}
function chanceToHex(c){const h=chanceToHue(c);const[r,g,b]=hslToRgb(h,62,52);return rgbToHex(r,g,b)}
function findBboxCorners(poly){let tl=null,tr=null,bl=null,br=null;let tlS=Infinity,trS=-Infinity,blS=Infinity,brS=-Infinity;for(const v of poly){const a=v.x+v.y,b=v.x-v.y;if(a<tlS){tlS=a;tl=v}if(a>brS){brS=a;br=v}if(b>trS){trS=b;tr=v}if(b<blS){blS=b;bl=v}}return[tl,tr,bl,br]}
function easeOutCubic(t){return 1-Math.pow(1-t,3)}
function easeInOutCubic(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

function splitPolygon(poly,ax,ay,bx,by){
  const dx=bx-ax,dy=by-ay;
  const side=p=>dx*(p.y-ay)-dy*(p.x-ax);
  const eps=1e-7;const A=[],B=[];const n=poly.length;
  for(let i=0;i<n;i++){
    const a=poly[i],b=poly[(i+1)%n];
    const sa=side(a),sb=side(b);
    if(sa>=-eps)A.push(a);
    if(sa<=eps)B.push(a);
    if((sa>eps&&sb<-eps)||(sa<-eps&&sb>eps)){
      const t=sa/(sa-sb);
      const ip={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
      A.push(ip);B.push(ip);
    }
  }
  return[A,B];
}
function pickCut(poly,angle,targetRatio){
  const bb=bboxOf(poly);
  const cx=(bb.x0+bb.x1)/2, cy=(bb.y0+bb.y1)/2;
  const range=Math.hypot(bb.x1-bb.x0,bb.y1-bb.y0);
  const dirX=Math.cos(angle),dirY=Math.sin(angle);
  const perpX=-dirY,perpY=dirX;
  const totalArea=polyArea(poly);
  const minArea=totalArea*Math.min(0.003,targetRatio*0.4);
  let lo=-range*1.2,hi=range*1.2;
  let best=null,bestErr=Infinity;
  for(let i=0;i<20;i++){
    const mid=(lo+hi)/2;
    const px=cx+perpX*mid,py=cy+perpY*mid;
    const ax=px-dirX*range*2,ay=py-dirY*range*2;
    const bx=px+dirX*range*2,by=py+dirY*range*2;
    const pieces=splitPolygon(poly,ax,ay,bx,by);
    const A=pieces[0],B=pieces[1];
    if(A.length<3||B.length<3){if(mid>0)hi=mid;else lo=mid;continue}
    const aA=polyArea(A),aB=polyArea(B);const tot=aA+aB;
    if(tot<1e-6){if(mid>0)hi=mid;else lo=mid;continue}
    const ratio=aA/tot;const err=Math.abs(ratio-targetRatio);
    if(err<bestErr&&aA>=minArea&&aB>=minArea){bestErr=err;best={win:A,lose:B}}
    if(ratio>targetRatio)lo=mid;else hi=mid;
    if(bestErr<0.0005)break;
  }
  return best;
}
function multiplierFor(c){return (1-HOUSE)/c}
function formatChance(p){if(p<1)return p.toFixed(2)+'%';if(p<10)return p.toFixed(1)+'%';return Math.round(p)+'%'}

function randomizeAngle(){U.cutAngle=Math.random()*Math.PI*2}
function recomputeField(){
  const target=Math.max(0.0003,Math.min(0.9997,U.shown));
  const cut=pickCut(PERIM,U.cutAngle,target);
  if(cut){
    U.winPoly=cut.win; U.losePoly=cut.lose;
    U.winBB=bboxOf(U.winPoly); U.loseBB=bboxOf(U.losePoly);
    U.winCenter=computeLabelCenter(U.winPoly);
    U.loseCenter=computeLabelCenter(U.losePoly);
  }
  U.lastShown=U.shown;
}
const FIELD_OMEGA=6.0, FIELD_ZETA=0.62;
function stepFieldSpring(dt){
  const diff=U.chance-U.shown;
  const accel=FIELD_OMEGA*FIELD_OMEGA*diff-2*FIELD_ZETA*FIELD_OMEGA*U.shownVel;
  U.shownVel+=accel*dt; U.shown+=U.shownVel*dt;
  if(U.shown<0.0002){U.shown=0.0002;if(U.shownVel<0)U.shownVel=0}
  if(U.shown>0.999){U.shown=0.999;if(U.shownVel>0)U.shownVel=0}
  if(Math.abs(diff)<0.0003&&Math.abs(U.shownVel)<0.0003){U.shown=U.chance;U.shownVel=0}
}

function foldAxis(v){const m=((v%(2*S))+2*S)%(2*S);return m<=S?m:2*S-m}
const TARGET_LEN=5200,LEN_MIN=4800,LEN_MAX=5600;

function pickTargetPoint(poly){
  if(!poly||poly.length<3)return{x:S/2,y:S/2};
  const bb=bboxOf(poly);
  const w=bb.x1-bb.x0,h=bb.y1-bb.y0;
  const margins=[Math.min(22,h*0.34,w*0.34),Math.min(15,h*0.27,w*0.27),Math.min(10,h*0.21,w*0.21),Math.min(6,h*0.15,w*0.15),Math.min(3,h*0.10,w*0.10),0.4];
  for(const m of margins){
    if(m<=0)continue;
    for(let i=0;i<260;i++){
      const x=bb.x0+Math.random()*w,y=bb.y0+Math.random()*h;
      if(pointInPoly(x,y,poly)&&distToEdges(x,y,poly)>=m)return{x,y};
    }
  }
  const c=centroidOf(poly);
  if(pointInPoly(c.x,c.y,poly))return c;
  for(let i=0;i<4000;i++){
    const x=bb.x0+Math.random()*w,y=bb.y0+Math.random()*h;
    if(pointInPoly(x,y,poly))return{x,y};
  }
  return centroidOf(poly);
}
// Cheaper: 1200 attempts instead of 20000
function buildBilliardPath(start,target){
  let bestValid=null, bestValidDelta=Infinity;
  for(let attempt=0;attempt<1200;attempt++){
    const ix=Math.floor(Math.random()*60)-30;
    const iy=Math.floor(Math.random()*60)-30;
    if(ix===0&&iy===0)continue;
    const sx=Math.random()<0.5?-1:1, sy=Math.random()<0.5?-1:1;
    const U2={x:sx*target.x+2*S*ix,y:sy*target.y+2*S*iy};
    const dx=U2.x-start.x,dy=U2.y-start.y;
    const straight=Math.hypot(dx,dy);
    if(straight<LEN_MIN||straight>LEN_MAX)continue;
    const cuts=[];
    if(Math.abs(dx)>1e-6){
      const k0=Math.ceil(Math.min(start.x,U2.x)/S);
      const k1=Math.floor(Math.max(start.x,U2.x)/S);
      for(let k=k0;k<=k1;k++){const t=(k*S-start.x)/dx;if(t>1e-4&&t<1-1e-4)cuts.push({t})}
    }
    if(Math.abs(dy)>1e-6){
      const k0=Math.ceil(Math.min(start.y,U2.y)/S);
      const k1=Math.floor(Math.max(start.y,U2.y)/S);
      for(let k=k0;k<=k1;k++){const t=(k*S-start.y)/dy;if(t>1e-4&&t<1-1e-4)cuts.push({t})}
    }
    cuts.sort((a,b)=>a.t-b.t);
    let cornerHit=false;
    for(let i=1;i<cuts.length;i++){if(Math.abs(cuts[i].t-cuts[i-1].t)<1e-5){cornerHit=true;break}}
    if(cornerHit)continue;
    const pts=[{x:start.x,y:start.y}];
    for(const c of cuts){const ux=start.x+dx*c.t,uy=start.y+dy*c.t;pts.push({x:foldAxis(ux),y:foldAxis(uy)})}
    pts.push({x:target.x,y:target.y});
    let bad=false;
    for(let i=1;i<pts.length-1;i++){
      const p=pts[i];
      const nearX=(p.x<R+8||p.x>S-R-8);
      const nearY=(p.y<R+8||p.y>S-R-8);
      if(nearX&&nearY){bad=true;break}
    }
    if(bad)continue;
    let minSeg=Infinity;
    for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);if(d<minSeg)minSeg=d}
    if(minSeg<26)continue;
    const cum=[0];
    for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
    const total=cum[cum.length-1];
    if(total<LEN_MIN)continue;
    const delta=Math.abs(total-TARGET_LEN);
    if(delta<bestValidDelta){bestValidDelta=delta;bestValid={pts,cum,total}}
    if(bestValidDelta<80)break;
  }
  if(bestValid)return bestValid;
  const angle=Math.random()*Math.PI*2;
  const d=LEN_MIN+Math.random()*(LEN_MAX-LEN_MIN)*0.5;
  const uxIdeal=start.x+d*Math.cos(angle);
  const uyIdeal=start.y+d*Math.sin(angle);
  const sx=Math.random()<0.5?-1:1, sy=Math.random()<0.5?-1:1;
  const ix=Math.round((uxIdeal-sx*target.x)/(2*S));
  const iy=Math.round((uyIdeal-sy*target.y)/(2*S));
  const U2={x:sx*target.x+2*S*ix,y:sy*target.y+2*S*iy};
  const dx=U2.x-start.x,dy=U2.y-start.y;
  const pts=[{x:start.x,y:start.y}];
  const cuts=[];
  if(Math.abs(dx)>1e-6){const k0=Math.ceil(Math.min(start.x,U2.x)/S);const k1=Math.floor(Math.max(start.x,U2.x)/S);for(let k=k0;k<=k1;k++){const t=(k*S-start.x)/dx;if(t>1e-4&&t<1-1e-4)cuts.push({t})}}
  if(Math.abs(dy)>1e-6){const k0=Math.ceil(Math.min(start.y,U2.y)/S);const k1=Math.floor(Math.max(start.y,U2.y)/S);for(let k=k0;k<=k1;k++){const t=(k*S-start.y)/dy;if(t>1e-4&&t<1-1e-4)cuts.push({t})}}
  cuts.sort((a,b)=>a.t-b.t);
  for(const c of cuts){const ux=start.x+dx*c.t,uy=start.y+dy*c.t;pts.push({x:foldAxis(ux),y:foldAxis(uy)})}
  pts.push({x:target.x,y:target.y});
  const cum=[0];
  for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
  return{pts,cum,total:cum[cum.length-1]};
}
function pointAtPath(p,d){
  if(d<=0)return{x:p.pts[0].x,y:p.pts[0].y};
  if(d>=p.total){const l=p.pts[p.pts.length-1];return{x:l.x,y:l.y}}
  let i=0;
  while(i<p.cum.length-2&&p.cum[i+1]<d)i++;
  const seg=p.cum[i+1]-p.cum[i];
  const t=seg>0?(d-p.cum[i])/seg:0;
  const a=p.pts[i],b=p.pts[i+1];
  return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
}

function drawPuck(c,x,y,r){
  if(r<=0.5)return;
  const rim=r*0.44,outer=r*0.32;
  c.save();c.beginPath();c.lineWidth=outer;c.strokeStyle='rgba(255,255,255,0.20)';c.lineCap='round';c.arc(x,y,r+outer*0.12,0,Math.PI*2);c.stroke();c.restore();
  c.save();c.beginPath();c.lineWidth=rim;c.strokeStyle='rgba(255,255,255,0.95)';c.lineCap='round';c.arc(x,y,r-rim/2,0,Math.PI*2);c.stroke();c.restore();
  c.save();c.beginPath();c.lineWidth=Math.max(1,rim*0.36);c.strokeStyle='rgba(0,0,0,0.18)';c.arc(x,y,r-rim*0.9,0,Math.PI*2);c.stroke();c.restore();
  const L=r*1.9;
  c.save();c.lineWidth=1.6*(r/20);c.strokeStyle='rgba(255,255,255,0.28)';
  c.beginPath();c.moveTo(x-L/2,y);c.lineTo(x+L/2,y);c.moveTo(x,y-L/2);c.lineTo(x,y+L/2);c.stroke();c.restore();
  const g=c.createRadialGradient(x-r*0.18,y-r*0.18,1,x,y,r*1.2);
  g.addColorStop(0,'rgba(255,255,255,0.10)');g.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=g;c.beginPath();c.arc(x,y,r-rim*0.6,0,Math.PI*2);c.fill();
}
function drawSpinArrow(c){
  const cx=S/2,cy=S/2;
  const puckR=PUCK_R*U.puckScale, orbit=puckR+5;
  const triSize=Math.min(S*0.035,10), tipOffset=triSize*0.4;
  c.save();
  c.translate(cx,cy);c.rotate(U.spinArrowAngle);c.translate(orbit,0);
  c.beginPath();c.moveTo(tipOffset,0);c.lineTo(-tipOffset*0.3,-triSize*0.5);c.lineTo(-tipOffset*0.3,triSize*0.5);c.closePath();
  c.fillStyle='#e8f4ff';c.shadowColor='rgba(180,210,255,.9)';c.shadowBlur=14;c.fill();c.shadowBlur=0;
  c.strokeStyle='rgba(180,210,255,.45)';c.lineWidth=1;c.stroke();
  c.restore();
}
function drawEmptyCross(c,x,y,size){
  if(size<4)return;
  c.save();
  c.strokeStyle='rgba(255,255,255,0.52)';c.lineWidth=Math.max(1.4,size*0.13);c.lineCap='round';
  c.shadowColor='rgba(200,220,255,0.5)';c.shadowBlur=size*0.45;
  c.beginPath();
  c.moveTo(x-size*0.30,y-size*0.30);c.lineTo(x+size*0.30,y+size*0.30);
  c.moveTo(x+size*0.30,y-size*0.30);c.lineTo(x-size*0.30,y+size*0.30);
  c.stroke();c.restore();
}
function draw(){
  if(!U.ctx)return;
  const c=U.ctx;
  c.setTransform(U.dpr,0,0,U.dpr,0,0);
  c.clearRect(0,0,U.cssSize,U.cssSize);
  c.save();
  c.scale(U.scale,U.scale);
  c.fillStyle='#06070c';c.fillRect(0,0,S,S);
  const m=multiplierFor(U.chance);
  const fieldHex=chanceToHex(U.shown);
  c.save();c.fillStyle='#070b14';c.fill(RINK_PATH);c.restore();
  c.save();c.clip(RINK_PATH);
  const bg=c.createRadialGradient(S/2,S*0.34,20,S/2,S/2,S*0.80);
  bg.addColorStop(0,'rgba(52,70,108,0.55)');
  bg.addColorStop(0.5,'rgba(22,32,52,0.62)');
  bg.addColorStop(1,'rgba(6,10,18,0.80)');
  c.fillStyle=bg;c.fillRect(0,0,S,S);

  if(U.losePoly&&U.losePoly.length>=3&&U.loseBB&&U.loseCenter){
    const lp=polyToPath(U.losePoly);
    const lbb=U.loseBB;
    const lw=lbb.x1-lbb.x0, lh=lbb.y1-lbb.y0;
    const lc=U.loseCenter;
    const lg=c.createLinearGradient(lbb.x0,lbb.y0,lbb.x1,lbb.y1);
    lg.addColorStop(0,'#10131c');lg.addColorStop(0.5,'#181c28');lg.addColorStop(1,'#0d1018');
    c.fillStyle=lg;c.fill(lp);
    c.strokeStyle='rgba(255,255,255,0.10)';c.lineWidth=1.2;c.lineJoin='round';c.stroke(lp);
    c.textAlign='center';c.textBaseline='middle';
    if(lw>90&&lh>90){
      const crossSize=Math.min(18,Math.min(lw,lh)*0.14);
      const gs=Math.min(46,lh*0.28,lw*0.28);
      const labelH=14; const gap1=9,gap2=6;
      const totalH=crossSize+gap1+labelH+gap2+gs;
      const topY=lc.y-totalH/2;
      drawEmptyCross(c,lc.x,topY+crossSize/2,crossSize);
      c.fillStyle='rgba(230,240,255,0.72)';
      c.font='800 10.5px -apple-system,system-ui,sans-serif';
      c.fillText('E M P T Y',lc.x,topY+crossSize+gap1+labelH/2);
    } else if(lw>50&&lh>50){
      const crossSize=Math.min(14,Math.min(lw,lh)*0.18);
      const labelH=12,gap=6;
      const totalH=crossSize+gap+labelH;
      const topY=lc.y-totalH/2;
      drawEmptyCross(c,lc.x,topY+crossSize/2,crossSize);
      c.fillStyle='rgba(230,240,255,0.65)';
      c.font='800 8.5px -apple-system,system-ui,sans-serif';
      c.fillText('EMPTY',lc.x,topY+crossSize+gap+labelH/2);
    } else {
      const crossSize=Math.min(12,Math.min(lw,lh)*0.28);
      drawEmptyCross(c,lc.x,lc.y,crossSize);
    }
  }
  if(U.winPoly&&U.winPoly.length>=3&&U.winBB&&U.winCenter){
    const wp=polyToPath(U.winPoly);
    const wbb=U.winBB;
    const wc=U.winCenter;
    const ww=wbb.x1-wbb.x0, wh=wbb.y1-wbb.y0;
    const wg=c.createLinearGradient(wbb.x0,wbb.y0,wbb.x1,wbb.y1);
    wg.addColorStop(0,lighten(fieldHex,42));
    wg.addColorStop(0.5,fieldHex);
    wg.addColorStop(1,lighten(fieldHex,18));
    c.fillStyle=wg;c.fill(wp);
    c.save();
    if(U.state!=='rolling'&&U.state!=='spinning'){c.shadowColor='rgba(180,215,255,0.55)';c.shadowBlur=12}
    c.strokeStyle='rgba(255,255,255,0.88)';c.lineWidth=2;c.lineJoin='round';c.stroke(wp);
    c.restore();
    const corners=findBboxCorners(U.winPoly);
    for(const corner of corners){
      if(!corner)continue;
      const br=Math.min(30,Math.min(ww,wh)*0.28);
      if(br<=1)continue;
      const rg=c.createRadialGradient(corner.x,corner.y,0,corner.x,corner.y,br);
      rg.addColorStop(0,'rgba(255,255,255,0.46)');
      rg.addColorStop(0.45,'rgba(255,255,255,0.13)');
      rg.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=rg;c.beginPath();c.arc(corner.x,corner.y,br,0,Math.PI*2);c.fill();
    }
    c.textAlign='center';c.textBaseline='middle';
    if(ww>80&&wh>60){
      const labelH=12,multH=26,gap=2;
      const totalH=labelH+gap+multH;
      const topY=wc.y-totalH/2;
      c.fillStyle='rgba(255,255,255,0.92)';
      c.font='800 10.5px -apple-system,system-ui,sans-serif';
      c.fillText('W I N',wc.x,topY+labelH/2);
      c.fillStyle='rgba(255,255,255,1)';
      c.font='900 24px -apple-system,system-ui,sans-serif';
      c.fillText('×'+m.toFixed(2),wc.x,topY+labelH+gap+multH/2);
    } else if(ww>46&&wh>30){
      c.fillStyle='rgba(255,255,255,1)';
      c.font='900 15px -apple-system,system-ui,sans-serif';
      c.fillText('×'+m.toFixed(2),wc.x,wc.y);
    } else if(ww>26&&wh>18){
      c.fillStyle='rgba(255,255,255,0.95)';
      c.font='900 10px -apple-system,system-ui,sans-serif';
      c.fillText('×'+m.toFixed(1),wc.x,wc.y);
    }
  }
  c.restore();
  c.save();
  c.shadowColor='rgba(140,180,255,0.55)';c.shadowBlur=38;
  c.strokeStyle='rgba(180,210,255,0.15)';c.lineWidth=22;c.lineJoin='round';c.stroke(RINK_PATH);
  c.restore();
  c.save();
  c.shadowColor='rgba(120,170,255,0.55)';c.shadowBlur=20;
  c.strokeStyle='rgba(150,190,255,0.42)';c.lineWidth=10;c.lineJoin='round';c.stroke(RINK_PATH);
  c.restore();
  c.save();
  c.shadowColor='rgba(255,255,255,0.95)';c.shadowBlur=14;
  c.strokeStyle='rgba(255,255,255,0.95)';c.lineWidth=3.2;c.lineJoin='round';c.stroke(RINK_PATH);
  c.restore();
  if(U.state==='spinning')drawSpinArrow(c);
  if(U.puckAlpha>0.01){
    c.save();
    c.globalAlpha=U.puckAlpha;
    drawPuck(c,U.puck.x,U.puck.y,PUCK_R*U.puckScale);
    c.restore();
  }
  c.restore();
}

const FAST_DURATION=2.4,SLOW_DURATION=6.5;
const TOTAL_DURATION=FAST_DURATION+SLOW_DURATION;
const FAST_FRAC=0.55;
const U1=FAST_DURATION/TOTAL_DURATION;
const SLOW_EXP=(FAST_FRAC/U1)*(1-U1)/(1-FAST_FRAC);
function distFrac(u){
  if(u<=U1)return(u/U1)*FAST_FRAC;
  const t=(u-U1)/(1-U1);
  return FAST_FRAC+(1-FAST_FRAC)*(1-Math.pow(1-t,SLOW_EXP));
}

const overlay=document.getElementById('upgrade-overlay');
const canvas=document.getElementById('upgrade-canvas');
const backBtn=document.getElementById('upgrade-back');
const limitEl=document.getElementById('upgrade-limit');
const slider=document.getElementById('upgrade-slider');
const sliderBox=document.getElementById('upgrade-slider-box');
const betInput=document.getElementById('upgrade-bet-input');
const betField=document.getElementById('upgrade-bet-field');
const miniBtns=document.querySelectorAll('.upgrade-mini');
const playBtn=document.getElementById('upgrade-play-btn');
const chanceOut=document.getElementById('upg-chance-out');
const multOut=document.getElementById('upg-mult-out');
const payoutOut=document.getElementById('upg-payout-out');
const banner=document.getElementById('upgrade-banner');
const walletUpgBtn=document.getElementById('wallet-upgrade-btn');
const speedPills=document.querySelectorAll('.upgrade-speed-pill');

if(canvas){U.cv=canvas;U.ctx=canvas.getContext('2d')}

function syncUI(){
  const m=multiplierFor(U.chance);
  chanceOut.textContent=formatChance(U.chance*100);
  multOut.textContent=m.toFixed(2)+'×';
  payoutOut.textContent=Math.floor(U.bet*m).toLocaleString();
  const min=+slider.min,max=+slider.max,v=+slider.value;
  const pct=((v-min)/(max-min))*100;
  const hue=chanceToHue(U.shown);
  const[r,g,b]=hslToRgb(hue,70,55);
  const fill='rgb('+r+','+g+','+b+')';
  const fillLight='rgb('+Math.min(255,r+30)+','+Math.min(255,g+30)+','+Math.min(255,b+30)+')';
  slider.style.setProperty('--track','linear-gradient(90deg,'+fill+' 0%,'+fillLight+' '+pct.toFixed(1)+'%,rgba(255,255,255,.075) '+pct.toFixed(1)+'%,rgba(255,255,255,.075) 100%)');
  slider.style.setProperty('--thumb-glow','rgba('+r+','+g+','+b+',.35)');
  chanceOut.style.color='rgb('+r+','+g+','+b+')';
  const locked=(U.state!=='idle');
  sliderBox.classList.toggle('locked',locked);
  betField.classList.toggle('locked',locked);
  miniBtns.forEach(b=>b.classList.toggle('locked',locked));
  speedPills.forEach(p=>p.classList.toggle('locked',locked));
  playBtn.disabled=locked||U.remaining<=0;
  limitEl.textContent=U.remaining+' / '+U.dailyLimit+' today';
  limitEl.classList.toggle('zero',U.remaining<=0);
}
function syncFieldColorUI(){
  if(U.state!=='idle')return;
  const hue=chanceToHue(U.shown);
  const[r,g,b]=hslToRgb(hue,68,62);
  chanceOut.style.color='rgb('+r+','+g+','+b+')';
}

function resize(){
  const wrap=document.querySelector('#upgrade-overlay .upgrade-arena-wrap');
  if(!wrap||!U.cv)return;
  const r=wrap.getBoundingClientRect();
  const size=Math.max(160,Math.floor(Math.min(r.width,r.height)-6));
  U.cssSize=size;
  U.dpr=Math.min(window.devicePixelRatio||1,3);
  U.cv.width=Math.round(size*U.dpr);
  U.cv.height=Math.round(size*U.dpr);
  U.cv.style.width=size+'px';
  U.cv.style.height=size+'px';
  U.scale=size/S;
  U.ctx.setTransform(U.dpr,0,0,U.dpr,0,0);
  U.ctx.imageSmoothingEnabled=true;
  U.ctx.imageSmoothingQuality='high';
  U.dirty=true;
}

function openUpgrade(){
  overlay.classList.add('show');
  requestAnimationFrame(()=>{resize();setTimeout(resize,80)});
  try{
    const st=window.__state||{};
    if(typeof st.balance==='number')U.balance=st.balance;
  }catch(_){}
  randomizeAngle();
  recomputeField();
  U.puckScale=0.55;U.puckAlpha=1;
  U.puck.x=S/2;U.puck.y=S/2;
  U.state='idle';
  syncUI();
}
function closeUpgrade(){overlay.classList.remove('show')}

function startRoll(){
  if(U.state!=='idle')return;
  if(U.remaining<=0){showUpgradeBanner('No plays left',false);return}
  if(U.bet<MIN_BET){U.bet=MIN_BET;betInput.value=MIN_BET;syncUI();return}
  if(U.bet>MAX_BET){U.bet=MAX_BET;betInput.value=MAX_BET;syncUI();return}
  const userId=window.__state?.userId;
  if(!userId){showUpgradeBanner('Login first',false);return}
  if(U.balance<U.bet){showUpgradeBanner('Insufficient',false);return}
  U.shown=U.chance;U.shownVel=0;
  recomputeField();
  if(!U.winPoly||!U.losePoly)return;
  playBtn.disabled=true;

  fetch(SERVER_URL+'/api/upgrade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId,bet:U.bet,chance:U.chance})})
  .then(r=>r.json())
  .then(d=>{
    if(!d.ok){
      playBtn.disabled=false;
      showUpgradeBanner(d.error||'Failed',false);
      if(typeof d.error==='string'&&d.error.toLowerCase().includes('daily')){U.remaining=0;syncUI()}
      return;
    }
    U.outcome=!!d.win;
    U.rollMult=d.multiplier;
    U.rollBet=U.bet;
    U.remaining=d.remaining;
    try{
      if(window.__state)window.__state.balance=d.newBalance;
      U.balance=d.newBalance;
      const balEl=document.getElementById('bal');
      if(balEl)balEl.textContent=Math.floor(d.newBalance).toLocaleString();
      if(window.__updateBalance)window.__updateBalance();
      if(window.__updateProfile)window.__updateProfile();
      if(d.level&&window.__applyLevelFromJoin){window.__applyLevelFromJoin(d.level,null);window.__levelState=d.level}
      if(window.__refreshLevel)window.__refreshLevel(true);
    }catch(_){}
    if(d.win){if(window.__addTransaction)window.__addTransaction('win',d.payout,'Upgrade Win')}
    else{if(window.__addTransaction)window.__addTransaction('loss',-U.rollBet,'Upgrade Loss')}

    const region=U.outcome?U.winPoly:U.losePoly;
    const target=pickTargetPoint(region);
    const path=buildBilliardPath({x:S/2,y:S/2},target);
    U.path=path;
    U.duration=TOTAL_DURATION*(SPEED_MULT[U.speedMode]||1);
    const dx=path.pts[1].x-path.pts[0].x;
    const dy=path.pts[1].y-path.pts[0].y;
    U.spinFinalAngle=Math.atan2(dy,dx);
    U.spinExtraTurns=3+Math.floor(Math.random()*4);
    U.spinArrowAngle=U.spinFinalAngle-U.spinExtraTurns*2*Math.PI;
    U.spinStart=performance.now();
    U.spinDuration=1.7+Math.random()*0.5;
    U.rollStart=0;
    U.state='spinning';
    U.puck.x=S/2;U.puck.y=S/2;
    U.puckScale=0.55;U.puckAlpha=1;
    banner.classList.remove('show');
    syncUI();
  })
  .catch(()=>{
    playBtn.disabled=false;
    showUpgradeBanner('Network error',false);
  });
}

function finishRoll(){
  U.state='done';
  if(U.outcome){
    const payout=Math.floor(U.rollBet*U.rollMult);
    showUpgradeBanner('+'+payout.toLocaleString(),true);
  } else {
    showUpgradeBanner('−'+U.rollBet.toLocaleString(),false);
  }
  clearTimeout(U.doneTimer);
  U.doneTimer=setTimeout(()=>{
    if(U.state!=='done')return;
    U.state='idle';
    U.puck.x=S/2;U.puck.y=S/2;
    U.puckAlpha=0;U.puckScale=0.55;
    randomizeAngle();
    recomputeField();
    try{if(window.__state&&typeof window.__state.balance==='number')U.balance=window.__state.balance}catch(_){}
    syncUI();
  },2400);
}
function showUpgradeBanner(text,win){
  banner.textContent=text;
  banner.className='show '+(win?'win':'lose');
  clearTimeout(U.bannerTimer);
  U.bannerTimer=setTimeout(()=>banner.classList.remove('show'),1600);
}

let lastT=0;
function frame(now){
  requestAnimationFrame(frame);
  if(!overlay.classList.contains('show')){lastT=now;return}
  const dt=Math.min(0.05,(now-lastT)/1000||0.016);
  lastT=now;
  let needDraw=false;

  if(U.state==='idle'){
    const before=U.shown;
    stepFieldSpring(dt);
    if(Math.abs(U.shown-before)>0.0001)needDraw=true;
    // Throttle recompute to max ~20Hz
    if(Math.abs(U.shown-U.lastShown)>0.0025 && now-U.lastFieldCompute>50){
      U.lastFieldCompute=now;
      recomputeField();
      needDraw=true;
    }
    if(U.puckScale<1||U.puckAlpha<1)needDraw=true;
    U.puck.x+=(S/2-U.puck.x)*Math.min(1,dt*12);
    U.puck.y+=(S/2-U.puck.y)*Math.min(1,dt*12);
    if(Math.abs(S/2-U.puck.x)>0.05||Math.abs(S/2-U.puck.y)>0.05)needDraw=true;
  }
  if(U.state==='spinning'){
    needDraw=true;
    const t=(now-U.spinStart)/1000/U.spinDuration;
    if(t>=1){U.spinArrowAngle=U.spinFinalAngle;U.state='rolling';U.rollStart=now}
    else{const e=1-Math.pow(1-t,3);U.spinArrowAngle=U.spinFinalAngle-(1-e)*U.spinExtraTurns*2*Math.PI}
  }
  if(U.state==='rolling'){
    needDraw=true;
    const elapsed=(now-U.rollStart)/1000;
    const u=Math.min(1,elapsed/U.duration);
    const dist=U.path.total*distFrac(u);
    if(u>=1){const last=U.path.pts[U.path.pts.length-1];U.puck.x=last.x;U.puck.y=last.y;finishRoll()}
    else{const p=pointAtPath(U.path,dist);U.puck.x=p.x;U.puck.y=p.y}
    if(U.puckScale<1)U.puckScale=Math.min(1,U.puckScale+dt*3.4);
  }
  if(U.state==='done'){
    needDraw=true;
    if(U.puckAlpha>0)U.puckAlpha=Math.max(0,U.puckAlpha-dt*0.6);
    if(U.puckScale<1)U.puckScale=Math.min(1,U.puckScale+dt*3.4);
  }
  if(U.state==='idle'){
    if(U.puckScale<1)U.puckScale=Math.min(1,U.puckScale+dt*2.6);
    if(U.puckAlpha<1){U.puckAlpha=Math.min(1,U.puckAlpha+dt*3.4);needDraw=true}
  }
  if(needDraw)draw();
}

slider.addEventListener('input',function(){
  const v=Math.max(MIN_CHANCE,Math.min(MAX_CHANCE,+slider.value));
  U.chance=v/100;
  syncUI();
});
betInput.addEventListener('input',function(){
  const v=betInput.value.replace(/[^0-9]/g,'').slice(0,6);
  betInput.value=v;
  U.bet=v===''?0:parseInt(v,10);
  if(U.bet>MAX_BET){U.bet=MAX_BET;betInput.value=MAX_BET}
  syncUI();
});
betInput.addEventListener('blur',function(){
  if(!U.bet||U.bet<MIN_BET)U.bet=MIN_BET;
  if(U.bet>MAX_BET)U.bet=MAX_BET;
  betInput.value=U.bet;
  syncUI();
});
miniBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const act=btn.dataset.act;
    if(act==='half')U.bet=Math.max(MIN_BET,Math.floor(U.bet/2));
    if(act==='double')U.bet=Math.max(MIN_BET,Math.min(MAX_BET,U.bet*2));
    if(act==='max')U.bet=MAX_BET;
    betInput.value=U.bet;
    syncUI();
  });
});
speedPills.forEach(p=>{
  p.addEventListener('click',()=>{
    if(U.state!=='idle')return;
    U.speedMode=p.dataset.speed;
    speedPills.forEach(x=>x.classList.toggle('active',x===p));
    try{localStorage.setItem('dllump_upgrade_speed',U.speedMode)}catch(_){}
    try{window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')}catch(_){}
  });
});
try{
  const savedSpeed=localStorage.getItem('dllump_upgrade_speed');
  if(savedSpeed&&SPEED_MULT[savedSpeed]){
    U.speedMode=savedSpeed;
    speedPills.forEach(p=>p.classList.toggle('active',p.dataset.speed===savedSpeed));
  }
}catch(_){}

playBtn.addEventListener('click',startRoll);
backBtn.addEventListener('click',closeUpgrade);
if(walletUpgBtn)walletUpgBtn.addEventListener('click',openUpgrade);
window.addEventListener('resize',()=>{if(overlay.classList.contains('show'))resize()});

requestAnimationFrame(function(t){lastT=t;requestAnimationFrame(frame)});
})();
</script>

</body>
</html>
