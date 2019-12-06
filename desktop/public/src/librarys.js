var commonLib = {
  debug:(e)=>{
    console.log("DEBUG: "+e);
  },
  msgbox:(e)=>{
    alert(e);
  },
  read:(e)=>{
    if(e[0])
      return prompt(e[0]);
    else
      return prompt("input:");
  },
  join:(e)=>{
    e = replaceArray(e);
    return e.join("");
  },
  true:(e)=> true,
  false:(e)=> false,
  "=": (e)=>{
    e = replaceArray(e);

    if(e instanceof Array){
      for(var i in e){
        if(e[i] != e[0]) return false;
      }
      return true;
    }
  },
  "+":(e)=>{
    e = replaceArray(e);
    return e.reduce((acc,x)=>acc+x)
  },
  "-":(e)=>{
    e = replaceArray(e);
    return e.reduce((acc,x)=>acc-x)
  },
  "*":(e)=>{
    e = replaceArray(e);
    return e.reduce((acc,x)=>acc*x); 
  },
  "/":(e)=>{
    e =replaceArray(e);
    return e.reduce((acc,x)=>acc/x)
  },
  arr:(e)=>{
    return new Array(e[0]).fill(e[1] || 0);
  },

  draw: (e)=>{
    
  },

  newGraphicsProcess: (e)=>{
    return new GraphicsProcess(sketch.createGraphics(window.innerWidth,window.innerHeight));
  }
};

function replaceArray(e){
  return e[0] instanceof Array && e[0].length == 1? e[0] : e;
}

function MergeLibrary(e){

}