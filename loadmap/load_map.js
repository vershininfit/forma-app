// Forma load map: load -> levels -> layer files. Same rules as runtime_map.py (manifest.json "rules").
(function(root){
  function levelsFromLoad(load, R){
    var tot=0,g; for(g in load) tot+=load[g];
    if(!(tot>0)) return {};
    var share={}; for(g in load) share[g]=load[g]/tot;
    var rank=Object.keys(share).sort(function(a,b){return share[b]-share[a];});
    var fb=R.full_body, top3=0, many=0, i;
    for(i=0;i<Math.min(3,rank.length);i++) top3+=share[rank[i]];
    for(i=0;i<rank.length;i++) if(share[rank[i]]>=fb.group_share) many++;
    var out={};
    if(top3<=fb.top3_share_max && many>=fb.min_groups_with_share){
      rank.forEach(function(g){ if(share[g]>0) out[g]=fb.level; });
      return out;
    }
    rank.slice(0,R.max_groups).forEach(function(g,p){ if(share[g]>=R.min_share) out[g]=R.rank_to_level[p]; });
    return out;
  }
  // exercises: [{sets, shares:{GL:40,QD:30,CR:30}}] -> load per group
  function loadFromWorkout(ex){
    var load={}; ex.forEach(function(e){ for(var g in e.shares) load[g]=(load[g]||0)+e.sets*e.shares[g]; }); return load;
  }
  // list of layer URLs to stack over base.png, bottom to top (rank order)
  function layerFiles(levels, man, prefix){
    prefix=prefix||'';
    return [prefix+man.base].concat(Object.keys(levels).map(function(g){return prefix+man.groups[g].files[levels[g]];}));
  }
  var api={levelsFromLoad:levelsFromLoad,loadFromWorkout:loadFromWorkout,layerFiles:layerFiles};
  if(typeof module!=='undefined') module.exports=api; else root.FormaLoadMap=api;
})(this);
