/* Stepped quote form. Does not change field names, the endpoint, Turnstile, or consent.
   The lead router chooses recipients after submit, so this never names firms except the one
   the visitor already opened (?firm=), which lead.js writes into the firm field.
   Copy: connect with up to 3. They contact you directly. */
(function(){
  var form=document.querySelector("form.qflow[data-lead]");
  if(!form)return;
  var steps=Array.prototype.slice.call(form.querySelectorAll(".qstep"));
  var n=steps.length;
  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function on(){for(var i=0;i<n;i++)if(steps[i].classList.contains("is-on"))return i;return 0}
  function show(k,doFocus){
    if(k<0||k>=n)return;
    steps.forEach(function(s,i){s.classList.toggle("is-on",i===k)});
    var prog=document.getElementById("qprog"),meter=document.getElementById("qmeter"),bar=meter&&meter.querySelector("span");
    if(prog)prog.textContent="Question "+(k+1)+" of "+n;
    if(meter)meter.setAttribute("aria-valuenow",String(k+1));
    if(bar)bar.style.width=Math.round((k+1)/n*100)+"%";
    if(doFocus){
      var legend=steps[k].querySelector("legend");
      if(legend){legend.setAttribute("tabindex","-1");legend.focus()}
    }
  }
  function stepValid(step){
    var els=step.querySelectorAll("input,select,textarea"),j;
    for(j=0;j<els.length;j++){
      if(els[j].disabled||els[j].type==="hidden")continue;
      if(!els[j].checkValidity()){els[j].reportValidity();return false}
    }
    return true;
  }
  form.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest("button");
    if(!t||!form.contains(t))return;
    var i=on();
    if(t.classList.contains("qnext")){
      e.preventDefault();
      if(!stepValid(steps[i]))return;
      show(i+1,true);render();
    }else if(t.classList.contains("qback")){e.preventDefault();show(i-1,true)}
  });
  form.addEventListener("keydown",function(e){
    if(e.key!=="Enter"||e.target.tagName==="TEXTAREA"||!form.classList.contains("is-stepped"))return;
    var step=e.target.closest&&e.target.closest(".qstep");
    if(!step||!step.classList.contains("is-on"))return;
    if(on()<n-1){e.preventDefault();var btn=step.querySelector(".qnext");if(btn)btn.click()}
  });
  form.addEventListener("invalid",function(e){
    var s=e.target.closest&&e.target.closest(".qstep");
    if(!s)return;
    var idx=steps.indexOf(s);
    if(idx>=0)show(idx,false);
  },true);

  function checked(name){return form.querySelector('[name="'+name+'"]:checked')}
  function field(name){return form.querySelector('[name="'+name+'"]')}
  function needLabel(){
    var el=checked("need");
    if(!el)return "";
    var b=el.parentNode.querySelector("b");
    return b?b.textContent:el.value;
  }
  function firmName(){
    var id=(field("firm")||{}).value||"";
    var row=id&&window.NET_FIRMS&&NET_FIRMS[id];
    return row?row[0]:"";
  }
  function whoText(){
    var fn=firmName(),need=(checked("need")||{}).value||"";
    var base;
    if(fn)base="We connect you with "+fn+" and up to 2 other nearby licensed contractors on EBMUD's PSL list (active CSLB licence). They contact you directly. The others are chosen when you send this form. You will see the names on the next screen. Contractors can't pay to be picked.";
    else base="We connect you with up to 3 nearby licensed contractors on EBMUD's PSL list (active CSLB licence), closest to your ZIP. They contact you directly. We choose them when you send this form. You will see their names on the next screen. If you opened a contractor's listing, that contractor is included, plus up to 2 others. Contractors can't pay to be picked.";
    if(need==="not_sure")base+=" Not sure connects you with contractors who do residential lateral work.";
    return base;
  }
  function buttonText(){
    var fn=firmName();
    if(fn)return "We connect you with "+fn+" and up to 2 other nearby licensed contractors. They contact you directly. You will see the names after you send this. East Bay Sewer Inspection is a directory, not a contractor. No obligation to hire.";
    return "We connect you with up to 3 nearby licensed contractors. They contact you directly. We choose them when you send this, and their names appear on the next screen. East Bay Sewer Inspection is a directory, not a contractor. No obligation to hire.";
  }
  function render(){
    var rows=[];
    var need=needLabel();if(need)rows.push(["Service",need]);
    var zip=(field("zip")||{}).value||"";if(zip)rows.push(["ZIP",zip]);
    var name=(field("name")||{}).value||"";if(name)rows.push(["Name",name]);
    var sum=document.getElementById("qsum");
    if(sum){
      sum.innerHTML=rows.length?("<dl>"+rows.map(function(r){return "<div><dt>"+esc(r[0])+"</dt><dd>"+esc(r[1])+"</dd></div>"}).join("")+"</dl>"):'<p class="muted">Nothing entered yet.</p>';
    }
    var rec=document.getElementById("qrec");if(rec)rec.textContent=whoText();
    var who=document.getElementById("qwho");if(who)who.textContent=buttonText();
  }
  var params=new URLSearchParams(location.search);
  var need=params.get("need");
  if(need){
    var radios=form.querySelectorAll("[name=need]"),r;
    for(r=0;r<radios.length;r++)if(radios[r].value===need){radios[r].checked=true;break}
  }
  var zip=params.get("zip");
  if(zip&&/^\d{5}$/.test(zip)&&field("zip"))field("zip").value=zip;
  form.addEventListener("input",render);
  form.addEventListener("change",render);
  form.addEventListener("lead:result",function(e){
    var d=e.detail||{};
    if(!d.ok)return;
    var panel=document.getElementById("qpanel");
    if(!panel)return;
    panel.innerHTML='<h2>Connected</h2><p>The firms named in the confirmation are the ones you were connected with. They contact you directly. We don\'t call or text you.</p><ul class="qpriv"><li>A copy of the request stays so we can run the service.</li><li>Delete that copy anytime: <a href="mailto:hello@eastbaysewerinspection.com">hello@eastbaysewerinspection.com</a>. Firms keep what they received under their own policies.</li></ul>';
  });
  var more=document.querySelector(".qmore");
  if(more&&window.matchMedia("(max-width:900px)").matches)more.open=false;
  show(on(),false);
  render();
})();
