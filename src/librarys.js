var commonLib = {
  debug:(e)=>{
    console.log("DEBUG: "+e);
  },
  msgbox:(e)=>{
    alert(e);
  },
  inputbox:(e)=>{
    if(e[0])
      return prompt(e[0]);
    else
      return prompt("input:");
  },
  join:(e)=>{
    e = e[0] instanceof Array && e[0].length == 1? e[0] : e;
    return e.join("");
  },
  true:(e)=> true,
  false:(e)=> false,
  "=": (e)=>{
    e = e[0] instanceof Array && e[0].length == 1? e[0] : e;

    if(e instanceof Array){
      for(var i in e){
        if(e[i] != e[0]) return false;
      }
      return true;
    }
  },
  "+":(e)=>{
    e = e[0] instanceof Array && e[0].length == 1? e[0] : e;
    return e.reduce((acc,x)=>acc+x)
  },
  "-":(e)=>{
    e = e[0] instanceof Array && e[0].length == 1? e[0] : e;
    return e.reduce((acc,x)=>acc-x)
  },
  rect:(e)=>{
    window.canvas.sketch.rect(e[0], e[1], e[2], e[3]);
  },
  circle:(e)=>{
    window.canvas.sketch.circle(e[0], e[1], e[2]);
  },
  array:(e)=>{
    return new Array(e[0]).fill(e[1] || 0);
  }
};