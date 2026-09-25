import './style.css';import './lab.css';import './gallery.css';
import {mountNavigation,demos} from './navigation.js';
mountNavigation('home');
const base=import.meta.env.BASE_URL;
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.getElementById('demo-list').innerHTML=demos.map((d,i)=>`<a class="demo-card" href="${base}${esc(d.page)}">
 <span class="no">${String(i+1).padStart(2,'0')}</span><span class="cat">${esc(d.category)}</span>
 <h2>${esc(d.title)}</h2><p>${esc(d.summary)}</p>
 ${d.authors?.length?`<span class="by">つくった人：${d.authors.map(esc).join('、')}</span>`:''}</a>`).join('');
document.getElementById('count').textContent=`${demos.length} のデモ`;
// フォークして別アカウントで公開しても、GitHub へのリンクがそのリポジトリを指すようにする
const seg=location.pathname.split('/').filter(Boolean);
if(/\.github\.io$/.test(location.hostname)&&seg.length){
 const repo='https://github.com/'+location.hostname.split('.')[0]+'/'+seg[0];
 document.getElementById('gh-contrib').href=repo+'/blob/main/CONTRIBUTING.md';
 document.getElementById('gh-issue').href=repo+'/issues/new/choose';
 document.getElementById('gh-repo').href=repo;
}
