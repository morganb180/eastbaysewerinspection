/* East Bay Sewer Inspection: privacy-first Google Analytics 4 with funnel events. Hand-written, no dependencies.
   Nothing loads unless GA_ID is set, the page is on this site's own domain, and the browser sends
   neither Global Privacy Control nor Do Not Track. Ads features are off. Form values, contact
   details and free text are never sent: only event names, field names, IDs, counts and page paths. */
(function(w,d){"use strict";
var GA_ID="G-DKQBLK8EH2";                 /* GA4 measurement ID for eastbaysewerinspection.com (GA4 property for this site). Empty = analytics off. */
var SITE="eastbaysewerinspection";
var HOSTS=["eastbaysewerinspection.com","www.eastbaysewerinspection.com"];
var n=w.navigator||{};
if(!/^G-[A-Z0-9]{4,}$/.test(GA_ID)||HOSTS.indexOf(location.hostname)<0)return;
if(n.globalPrivacyControl===true||n.doNotTrack=="1"||n.doNotTrack=="yes"||w.doNotTrack=="1"||n.msDoNotTrack=="1")return;

var KEEP=/^(firm|id|county|city|type|q|sent|utm_(source|medium|campaign|term|content))$/;
var EMAIL=/[^\s@]+@[^\s@]+\.[^\s@]+/,PHONE=/\d[\d\s().+-]{6,}\d/;
function clean(u){try{var x=new URL(u,location.href),o=new URLSearchParams();x.searchParams.forEach(function(v,k){if(KEEP.test(k)){if(k=="q")v=term(v);if(!EMAIL.test(v)&&!PHONE.test(v))o.append(k,v.slice(0,60))}});var s=o.toString();return x.origin+x.pathname+(s?"?"+s:"")}catch(e){return location.origin+location.pathname}}
function term(t){t=String(t||"").replace(/\s+/g," ").trim().toLowerCase().slice(0,60);if(EMAIL.test(t)||/\d{6,}/.test(t)||PHONE.test(t)||/^\d+[a-z]?\s+[a-z]/.test(t))return"(redacted)";return t}
function safe(p){var o={},k,v;for(k in p){v=p[k];if(v==null||v==="")continue;if(typeof v=="string"){v=v.slice(0,100);if(EMAIL.test(v)||PHONE.test(v))continue}o[k]=v}return o}

w.dataLayer=w.dataLayer||[];function gtag(){w.dataLayer.push(arguments)}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"granted"});
gtag("set","ads_data_redaction",true);
gtag("set","allow_google_signals",false);
gtag("set","allow_ad_personalization_signals",false);
gtag("js",new Date());
var CARD=".firm[id],.card[id]",LEADF="form[data-lead]",page=ptype();
function q(s,r){return(r||d).querySelector(s)}function qa(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))}
function ptype(){var p=location.pathname;if(p=="/")return"home";if(/^\/get-quotes\//.test(p))return q(LEADF)?"quote_form":"search";if(q(".fp-cta,.fp-contact"))return"firm";if(/\/guide\/$/.test(p))return"city_guide";var a=area();if(a&&q(CARD))return"listing";if(q(CARD))return"listing";return"content"}
function area(){var p=location.pathname.split("/").filter(Boolean),i;for(i=0;i<p.length-1;i++)if(/^(county|city|town)$/.test(p[i]))return{area:p[i+1],area_type:p[i],state:i>0&&/^[a-z]{2}$/.test(p[i-1])?p[i-1]:void 0};return null}
var A=area()||{};
gtag("config",GA_ID,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:clean(location.href),page_referrer:d.referrer?clean(d.referrer):void 0,page_type:page,site:SITE});
var s=d.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;(d.head||d.documentElement).appendChild(s);
function track(e,p){p=p||{};p.site=SITE;p.page_type=page;gtag("event",e,safe(p))}

/* ---------- helpers ---------- */
function cardOf(el){return el&&el.closest?el.closest(CARD):null}
function pos(c){var i=qa(CARD).indexOf(c);return i<0?void 0:i+1}
function firmPageId(){var a=q(".fp-cta [data-fid],.fp-contact [data-fid],[data-fid]");if(a&&q(".fp-cta,.fp-contact"))return a.getAttribute("data-fid");var g=q('.fp-cta a[href*="firm="]');if(g){var m=/[?&]firm=([A-Za-z0-9]+)/.exec(g.getAttribute("href"));if(m)return m[1]}var s=/-([a-z]{1,3}\d{2,6})\/?$/i.exec(location.pathname);return s?s[1].toUpperCase():void 0}
var FP=page=="firm"?firmPageId():void 0;
function fidOf(a){return a.getAttribute("data-fid")||(cardOf(a)||{}).id||FP}
function where(a){if(a.closest(".lf-done"))return"lead_success";if(a.closest("details.menu"))return"mobile_nav";if(a.closest("header"))return"header";if(cardOf(a))return"firm_card";if(a.closest(".fp-cta"))return"firm_page_cta";if(a.closest(".fp-contact"))return"firm_page_contact";if(a.closest("footer"))return"footer";if(a.closest("#results"))return"search_results";return"content"}
function txt(a){return String(a.textContent||"").replace(/\s+/g," ").trim().slice(0,40)}
function isDomain(t){return/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(t)}

/* ---------- search: typeahead on #q, results in #results ---------- */
var SQ="#q",lastTerm="",timer=0;
function sq(){return q(SQ)}
function fireSearch(trigger){clearTimeout(timer);var i=sq();if(!i)return;var t=term(i.value);if(t.length<2||t==lastTerm)return;lastTerm=t;var r=q("#results"),c=r?qa('a[role="option"]',r).length:0,it=q('input[name="intent"]:checked');
 track("search",{search_term:t,result_count:c,match_type:r&&q(".fz-none",r)?"none":r&&q(".fz-dym",r)?"did_you_mean":c?"match":"none",search_kind:/^\d{3,5}$/.test(t)?"zip":"place",search_intent:it?it.value:void 0,trigger:trigger})}
d.addEventListener("input",function(e){if(e.target&&e.target.matches&&e.target.matches(SQ)){clearTimeout(timer);timer=setTimeout(function(){fireSearch(e.isTrusted?"typing":"url")},1500)}},true);
d.addEventListener("keydown",function(e){if(e.key=="Enter"&&e.target&&e.target.matches&&e.target.matches(SQ))fireSearch("enter")},true);

/* ---------- clicks: search results, firm cards, outbound contact, CTAs ---------- */
d.addEventListener("click",function(e){var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;var h=a.getAttribute("href")||"",c=cardOf(a),u;
 if(a.closest("#results")){fireSearch("select");var rs=qa("#results a");track("select_item",{item_list_name:"search_results",item_id:a.pathname,index:rs.indexOf(a)+1,search_term:lastTerm,items:[{item_id:a.pathname,index:rs.indexOf(a)+1,item_list_name:"search_results"}]});return}
 if(/^tel:/i.test(h)){track("click_phone",{firm_id:fidOf(a),index:c?pos(c):void 0,link_location:where(a),area:A.area});return}
 if(/^mailto:/i.test(h)){var own=h.toLowerCase().indexOf("@"+HOSTS[0])>0;track("click_email",{firm_id:own?void 0:fidOf(a),index:c?pos(c):void 0,link_location:own?"site_contact":where(a),area:A.area});return}
 try{u=new URL(a.href)}catch(x){return}
 if(u.host!=location.host){if(a.getAttribute("data-ct")=="web"||((c||a.closest(".fp-contact,.gx"))&&isDomain(txt(a)))){track("click_website",{firm_id:fidOf(a),index:c?pos(c):void 0,link_location:where(a),link_domain:u.hostname.replace(/^www\./,""),area:A.area})}return}
 var p=u.pathname,cta=/^\/get-quotes\//.test(p)?"get_quotes":/^\/(claim-listing|list-your-business)\//.test(p)?"claim_listing":/^\/(for-pros|for-contractors)\//.test(p)?"for_pros":a.matches(".btn,.qbtn,.lf-cta,.more")?"button":"";
 if(c&&cta!="claim_listing"&&(cta=="get_quotes"||/\/firms\//.test(p)))track("select_item",{item_list_name:A.area_type||page,item_id:c.id,index:pos(c),select_type:cta=="get_quotes"?"quote":"profile",area:A.area,items:[{item_id:c.id,index:pos(c),item_list_name:A.area_type||page}]});
 if(cta)track("cta_click",{cta:cta,cta_location:where(a),firm_id:(/[?&](?:firm|id)=([A-Za-z0-9]+)/.exec(u.search)||[])[1],link_text:txt(a),link_url:p,area:A.area})},true);
/* a visitor expanding a firm card's details counts as selecting it (once per card; ignores details that start open) */
var opened={},sumd=null;d.addEventListener("click",function(e){var sm=e.target&&e.target.closest?e.target.closest("summary"):null;sumd=sm?sm.parentElement:null},true);
d.addEventListener("toggle",function(e){var t=e.target;if(!t||!t.open||t.tagName!="DETAILS"||t!==sumd)return;var c=cardOf(t);if(!c||opened[c.id])return;opened[c.id]=1;track("select_item",{item_list_name:A.area_type||page,item_id:c.id,index:pos(c),select_type:"expand",area:A.area,items:[{item_id:c.id,index:pos(c),item_list_name:A.area_type||page}]})},true);

/* ---------- scroll depth 50 / 90 ---------- */
var sd={};function onScroll(){var el=d.documentElement,hgt=Math.max(el.scrollHeight,d.body?d.body.scrollHeight:0),v=w.innerHeight||el.clientHeight;if(hgt<v*1.5)return;var pc=(w.pageYOffset+v)/hgt*100;[50,90].forEach(function(x){if(pc>=x&&!sd[x]){sd[x]=1;track("scroll",{percent_scrolled:x,area:A.area})}});if(sd[90])w.removeEventListener("scroll",onScroll)}
w.addEventListener("scroll",onScroll,{passive:true});

/* ---------- forms: quote (lead) forms and listing-request forms ---------- */
function fkind(f){return f.matches(LEADF)?"lead":f.matches(".reqform")?"listing_request":""}
function fid(f){return f.matches(LEADF)?(f.classList.contains("compact")?"lead_compact":"lead_full"):"listing_request"}
function fval(f,nm){var el=f.querySelector('[name="'+nm+'"]:checked')||f.querySelector('select[name="'+nm+'"],input[type=hidden][name="'+nm+'"]');return el?el.value:void 0}
function fctx(f){return{form_id:fid(f),form_type:fkind(f),service:fval(f,"need"),area:fval(f,"county")||A.area,firm_id:fval(f,"firm")||void 0,firm_selected:!!fval(f,"firm")}}
var ENUM=/^(need|county|type|intent)$/,fstate=[];
function st(f){for(var i=0;i<fstate.length;i++)if(fstate[i].f===f)return fstate[i];var o={f:f,started:0,done:{},inv:{}};fstate.push(o);return o}
function formOf(el){var f=el&&el.closest?el.closest("form"):null;return f&&fkind(f)?f:null}
d.addEventListener("focusin",function(e){var f=formOf(e.target);if(!f)return;var s=st(f);if(s.started)return;s.started=1;track("form_start",fctx(f))},true);
d.addEventListener("change",function(e){var el=e.target,f=formOf(el);if(!f||!el.name||el.type=="hidden"||el.name=="website"||el.name=="idem")return;var filled=el.type=="checkbox"||el.type=="radio"?el.checked:String(el.value||"").trim()!=="";if(!filled)return;var s=st(f);if(s.done[el.name])return;s.done[el.name]=1;var p=fctx(f);p.field_name=el.name;if(ENUM.test(el.name))p.field_value=String(el.value).slice(0,40);track("form_field_complete",p)},true);
d.addEventListener("invalid",function(e){var f=formOf(e.target);if(!f)return;var s=st(f),k=e.target.name||"field",t=Date.now();if(s.inv[k]&&t-s.inv[k]<3000)return;s.inv[k]=t;var p=fctx(f);p.error_type="client_validation";p.field_name=k;track("form_error",p)},true);
d.addEventListener("submit",function(e){var f=e.target;if(!f||!f.matches||!fkind(f))return;var p=fctx(f),em=f.querySelector("[name=email]"),ph=f.querySelector("[name=phone]");p.has_email=!!(em&&em.value.trim());p.has_phone=!!(ph&&ph.value.trim());p.fields_completed=Object.keys(st(f).done).length;var tk=f.querySelector('[name="cf-turnstile-response"]');if(f.matches(LEADF))p.turnstile_ready=!!(tk&&tk.value);track("form_submit_attempt",p)},true);
var ERR={403:"turnstile",409:"duplicate",422:"validation",429:"rate_limited",404:"no_match",502:"email_service",400:"bad_request"};
d.addEventListener("lead:result",function(e){var f=e.target,x=e.detail||{},p=fctx(f);if(x.need)p.service=x.need;if(x.county)p.area=x.county;
 if(x.ok&&!x.duplicate&&x.firms>0){p.firm_count=x.firms;track("generate_lead",p);return}
 if(x.ok&&!x.firms)return; /* honeypot response: not a real lead */
 p.error_type=x.type||(x.duplicate?"duplicate":ERR[x.status]||"server_"+(x.status||"unknown"));if(x.status)p.http_status=x.status;if(x.fields&&x.fields.length)p.field_name=x.fields.join(",").slice(0,100);track("form_error",p)},true);
/* Turnstile outcome: name callbacks on each widget before lead.js loads Turnstile */
function tsHooks(){qa(LEADF).forEach(function(f,i){var t=q(".cf-turnstile",f);if(!t||t.getAttribute("data-callback"))return;var k="__gaTs"+i;
 w[k+"ok"]=function(){track("turnstile_pass",fctx(f))};w[k+"err"]=function(c){var p=fctx(f);p.reason="error";p.error_code=String(c||"").slice(0,12);track("turnstile_fail",p)};w[k+"exp"]=function(){var p=fctx(f);p.reason="expired";track("turnstile_fail",p)};w[k+"to"]=function(){var p=fctx(f);p.reason="timeout";track("turnstile_fail",p)};
 t.setAttribute("data-callback",k+"ok");t.setAttribute("data-error-callback",k+"err");t.setAttribute("data-expired-callback",k+"exp");t.setAttribute("data-timeout-callback",k+"to")})}

/* ---------- page-level funnel events ---------- */
function init(){tsHooks();
 if(page=="firm"&&FP){var cr=q('.crumbs a[href*="/county/"]'),ca=cr?(/\/county\/([^/]+)/.exec(cr.getAttribute("href"))||[])[1]:void 0;track("view_item",{item_id:FP,area:ca,area_type:ca?"county":void 0,has_quote_cta:!!q('.fp-cta a[href*="get-quotes"]'),items:[{item_id:FP}]})}
 else if(page=="listing"||page=="city_guide"){var cs=qa(CARD);if(cs.length)track("view_search_results",{area:A.area,area_type:A.area_type,state:A.state,result_count:cs.length,item_list_name:A.area_type||page})}
}
if(d.readyState=="loading")d.addEventListener("DOMContentLoaded",init);else init();
})(window,document);
