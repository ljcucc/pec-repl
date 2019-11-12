//reference from 
//  https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js 
//  and https://github.com/hundredrabbits/Ronin/blob/master/desktop/sources/scripts/lib/lisp.js

function LispRuntime(lib={}){
  function tokenize(code){
    return code.replace(/^;.*\n?/gm, '').split('"').map((x, i)=>{
      return i % 2 === 0 ? 
        x.replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')

        :x.replace(/ /g,"!whitespace!")
        .replace(/\(/g,"!str_pstart!")
        .replace(/\)/g,"!str_pend!")
    }).join('"').trim().split(/\s+/)
    .map(function(x) {
      return x.replace(/!whitespace!/g, " ");
    });
  }

  function parenthesize(tokenized){
    return JSON.parse(tokenized.map((x,i)=>{
      if(x == "(") return '[""';
      else if(x == ")") return '""]'
      else return x[0] == '"'? x: !isNaN(x)? x: '"$'+x+'"';
    }).join(",").replace(/!str_pstart!/g,"(").replace(/!str_pend!/g,")"));
  }

  function interpret(){
    
  }

  this.parse = (code)=>{
    return parenthesize(tokenize(code));
  }

  this.forceRun = (code)=>{

  }
}