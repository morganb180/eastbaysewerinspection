/* Credential chip from the card's own CSLB line, and an optional ?service= filter.
   No new facts: the chip text is copied from the listing. Hidden cards stay in the DOM. */
(function(){
  var cards=document.querySelectorAll("div.card[id]");
  for(var i=0;i<cards.length;i++){
    var card=cards[i];
    if(card.querySelector(".cred"))continue;
    var muted=card.querySelector(".muted");
    if(!muted)continue;
    var full=muted.textContent.replace(/\s+/g," ").trim();
    var m=full.match(/CSLB licen[cs]e #([0-9]+)/i);
    if(!m)continue;
    var el=document.createElement("span");
    el.className="cred";
    el.textContent="CSLB #"+m[1];
    el.title=full.split("Source:")[0].replace(/\s+/g," ").trim();
    var h3=card.querySelector("h3");
    if(h3)h3.insertAdjacentElement("afterend",el);
  }
  var params=new URLSearchParams(location.search);
  var svc=params.get("service")||"";
  var labels={
    residential:"Residential PSL testing",
    commercial:"Commercial PSL testing",
    hoa:"PSL maps for HOAs / multi-lateral"
  };
  var label=labels[svc];
  if(!label||!cards.length){
    var q0=params.get("q");
    if(q0&&location.pathname.indexOf("/city/")!==0){
      var miss=document.createElement("p");
      miss.className="svcnote muted";
      miss.setAttribute("role","status");
      miss.textContent="No single city page matched \""+q0+"\". This directory lists by city, not by ZIP. Showing the full list, still ordered by city, then name.";
      var host=document.querySelector(".grid")||document.getElementById("main");
      if(host&&host.parentNode)host.parentNode.insertBefore(miss,host);
    }
    return;
  }
  var shown=0,j;
  for(j=0;j<cards.length;j++){
    var ok=cards[j].textContent.indexOf(label)!==-1;
    cards[j].hidden=!ok;
    if(ok)shown++;
  }
  var note=document.createElement("p");
  note.className="svcnote muted";
  note.setAttribute("role","status");
  var q=params.get("q");
  var extra=(q&&location.pathname.indexOf("/city/")!==0)?(" No single city page matched \""+q+"\". This directory lists by city, not by ZIP."):"";
  if(shown){
    note.textContent="Showing "+shown+" of "+cards.length+" on this page that offer "+label+". Order is unchanged (city, then name on the full list; name on a city page). Not a ranking."+extra;
  }else{
    note.textContent="None of the firms on this page offer "+label+". Showing the full list again."+extra;
    for(j=0;j<cards.length;j++)cards[j].hidden=false;
  }
  cards[0].parentNode.insertBefore(note,cards[0]);
})();
