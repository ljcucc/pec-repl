var commonLib = {
  debug:(e)=>{
    console.log("DEBUG: "+e);
  },
  msgbox:(e)=>{
    alert(e);
  },
  input:(e)=>{
    if(e[0])
      return prompt(e[0]);
    else
      return prompt("input:");
  },
  join:(e)=>{
    console.log(e);
    return e.join("");
  },
  true:(e)=> true,
  false:(e)=> false,
  "=": (e)=>{
    console.log(e);
    if(e instanceof Array){
      for(var i in e){
        if(e[i] != e[0]) return false;
      }
      return true;
    }
  }
};