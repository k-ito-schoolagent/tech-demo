import './navigation-layout.css';
import demos from '../demos.json';
export {demos};
// ヘッダーのナビ。demos.json の順に並ぶ（current はデモの id、一覧ページは 'home'）
export function mountNavigation(current){
 const base=import.meta.env.BASE_URL,header=document.querySelector('header');
 const items=[['home','','一覧','すべてのデモ'],...demos.map((d,i)=>[d.id,d.page,String(i+1).padStart(2,'0'),d.label])];
 header.innerHTML='<a class="brand" href="'+base+'">FORM<span>INTERACTIVE<br>SCIENCE LAB</span></a><nav aria-label="シミュレーションを選択">'+items.map(([id,url,n,label])=>`<a href="${base}${url}" ${id===current?'aria-current="page"':''}><span>${n}</span>${label}</a>`).join('')+'</nav>';
 header.querySelector('[aria-current]')?.scrollIntoView({block:'nearest',inline:'center'});
}
export function addCameraControls(camera,controls){
 const container=document.createElement('div');container.className='camera-extra';container.innerHTML='<button aria-label="視点を左へ回転">←</button><button aria-label="視点を右へ回転">→</button><button aria-label="拡大">＋</button><button aria-label="縮小">−</button>';
 document.querySelector('.viewport').append(container);
 [...container.children].forEach((b,i)=>b.onclick=()=>{const v=camera.position.clone().sub(controls.target);if(i<2){const a=i===0?.25:-.25;const x=v.x*Math.cos(a)-v.z*Math.sin(a);v.z=v.x*Math.sin(a)+v.z*Math.cos(a);v.x=x;}else{v.multiplyScalar(i===2?.88:1.14);const length=Math.min(controls.maxDistance,Math.max(controls.minDistance,v.length()));v.setLength(length);}camera.position.copy(controls.target).add(v);controls.update();});
}
