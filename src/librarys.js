var commonLib = {
  debug:(e)=>{
    console.log("DEBUG: "+e);
  },
  msgbox:(e)=>{
    alert(e);
  },
  input:(e)=>{
    return prompt("input:");
  },
  join:(e)=>{
    console.log(e);
    return e.join("");
  }
};