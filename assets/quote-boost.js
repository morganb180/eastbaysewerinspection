/* Sticky mobile quote bar: hidden while a quote form, the footer or the on-screen keyboard is in use. No tracking here;
   analytics.js counts clicks on the bar (data-ga-loc="sticky_bar"). */
(function(){
  var bar=document.querySelector(".qsbar");if(!bar)return;
  document.body.classList.add("has-qsbar");
  var seen={},kb=false;
  function upd(){var off=kb;for(var k in seen)if(seen[k])off=true;bar.classList.toggle("is-off",off);if(off)bar.setAttribute("aria-hidden","true");else bar.removeAttribute("aria-hidden")}
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){seen[e.target.getAttribute("data-qb")]=e.isIntersecting});upd()},{threshold:0.15});
    Array.prototype.forEach.call(document.querySelectorAll("form[data-lead],.qprompt,footer"),function(el,i){el.setAttribute("data-qb",String(i));io.observe(el)});
  }
  document.addEventListener("focusin",function(e){var t=e.target;if(t&&t.matches&&t.matches("input,select,textarea")&&!bar.contains(t)){kb=true;upd()}});
  document.addEventListener("focusout",function(){kb=false;setTimeout(upd,50)});
  var a=bar.querySelector('a[href^="#"]');
  if(a)a.addEventListener("click",function(e){var t=document.getElementById(a.getAttribute("href").slice(1));if(!t)return;e.preventDefault();
    var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;t.scrollIntoView({behavior:rm?"auto":"smooth",block:"start"});
    var h=t.querySelector(".lf-h,h2,h3")||t;h.setAttribute("tabindex","-1");try{h.focus({preventScroll:true})}catch(x){h.focus()}
    try{history.replaceState(null,"","#"+t.id)}catch(x){}});
})();
