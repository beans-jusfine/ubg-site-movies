const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY_WATCH='nero.movies.watchlist.v1',KEY_HISTORY='nero.movies.history.v1';
const read=(k)=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
let watchlist=read(KEY_WATCH),history=read(KEY_HISTORY);
const cinevo='https://cinevo.us/';
function save(){try{localStorage.setItem(KEY_WATCH,JSON.stringify(watchlist));localStorage.setItem(KEY_HISTORY,JSON.stringify(history))}catch{toast('This browser could not save your changes')}}
function toast(s){const t=$('#toast');t.textContent=s;t.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.style.display='none',2600)}
function go(page){$$('.page').forEach(p=>p.classList.toggle('active',p.id===page+'-page'));$$('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page===page));window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$$('[data-open-cinevo]').forEach(b=>b.addEventListener('click',()=>window.open(cinevo,'_blank','noopener,noreferrer')));
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function card(item,kind){return '<article class="saved-card"><div class="saved-art"><span>N</span></div><div class="saved-info"><b>'+escapeHtml(item.title)+'</b><small>'+escapeHtml(item.url)+'</small><div class="saved-actions"><button data-resume="'+escapeHtml(item.id)+'">Open on Cinevo ↗</button>'+(kind==='watch'?'<button data-remove="'+escapeHtml(item.id)+'">Remove</button>':'')+'</div></div></article>'}
function empty(el,icon,title,desc){el.className='empty-panel';el.innerHTML='<div class="empty-icon">'+icon+'</div><h3>'+title+'</h3><p>'+desc+'</p>'}
function render(){ $('#watch-count').textContent=watchlist.length;
 const w=$('#watchlist-grid'),h=$('#history-grid'),c=$('#continue-grid'),hw=$('#home-watchlist');
 if(watchlist.length){w.className='saved-grid';w.innerHTML=watchlist.map(x=>card(x,'watch')).join('')}else empty(w,'♡','Your list is empty','Add a title using the button below or wait for catalog integration.');
 if(history.length){h.className='saved-grid';h.innerHTML=history.map(x=>card(x,'history')).join('');c.className='saved-grid compact-grid';c.innerHTML=history.slice(0,3).map(x=>card(x,'history')).join('')}else{empty(h,'◷','No recent titles','Titles you open through NERO Movies can appear here.');empty(c,'◷','Nothing here yet','Open a title on Cinevo to start building your history.')}
 if(watchlist.length){hw.className='saved-grid compact-grid';hw.innerHTML=watchlist.slice(0,3).map(x=>card(x,'watch')).join('')}else empty(hw,'♡','No saved titles yet','Your saved movies and shows will appear here.');
 $$('[data-resume]').forEach(b=>b.onclick=()=>{const item=history.concat(watchlist).find(x=>x.id===b.dataset.resume);if(item){history=[item,...history.filter(x=>x.id!==item.id)].slice(0,30);save();window.open(item.url,'_blank','noopener,noreferrer');render()}});
 $$('[data-remove]').forEach(b=>b.onclick=()=>{watchlist=watchlist.filter(x=>x.id!==b.dataset.remove);save();render()});
}
function addHistory(title,url){const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,url,openedAt:Date.now()};history=[item,...history.filter(x=>x.url!==url)].slice(0,30);save();render()}
$('#profile').onclick=()=>{$('#add-dialog').showModal()};
$('#add-form').addEventListener('submit',e=>{e.preventDefault();const title=$('#title-input').value.trim(),url=$('#url-input').value.trim();try{const u=new URL(url);if(!['http:','https:'].includes(u.protocol)||u.hostname!=='cinevo.us'&&!u.hostname.endsWith('.cinevo.us'))throw Error();const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title,url:u.href,addedAt:Date.now()};watchlist=[item,...watchlist.filter(x=>x.url!==item.url)];addHistory(title,u.href);$('#add-dialog').close();$('#add-form').reset();toast('Saved to your NERO Watchlist')}catch{toast('Use a valid Cinevo.us title link')}});
$('#search').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim()){const q=e.target.value.trim();window.open(cinevo,'_blank','noopener,noreferrer');toast('Search Cinevo for: '+q)}});
$('#search').addEventListener('input',e=>{if(e.target.value.trim())go('movies')});
render();