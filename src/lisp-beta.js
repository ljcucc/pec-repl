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
    return JSON.parse("["+tokenized.map((x,i)=>{
      if(x == "(") return '[""';
      else if(x == ")") return '""]'
      else return x[0] == '"'? x: !isNaN(x)? x: '"$'+x+'"';
    }).join(",").replace(/!str_pstart!/g,"(").replace(/!str_pend!/g,")")+"]");
  }

  const asyncFuncs = {
    let: (code, context)=>{
      context.set(code[0].slice(1), code[1]);
    },
    if: (code, context)=>{
      return interpret(code[0],context) ? 
        interpret(code[1], context):
        (code[2]? interpret(code[2]): null);
    }
  }

  function Context(scope_vars, parent){
    this.scope = scope_vars;
    this.parent = parent;

    this.get = function(key){
      return key in this.scope ? this.scope[key] : (this.parent ? this.parent.get(key): undefined);
    }

    this.set = function(key,value){
      this.scope[key] = value;
    }
  }

  function interpretList(code, context){
    if(code.length > 0 && code[0].slice(1) in asyncFuncs){
      var func_name = code.shift();
      asyncFuncs[func_name.slice(1)](code,context);
    }else{
      var result = code.map((e, i)=>{return interpret(e, context)});
      console.log(result)
      if(result[0] instanceof Function)
        result.shift().apply(undefined, result);
    }
  }

  function interpret(code, context){
    if(code[0] == "" && code.length >= 3){
      code.shift();
      code.pop();
    }

    console.log(code);

    if(code.length > 1 && code instanceof Array)
      return interpretList(code, context);
    else if(code instanceof Function)
      context.get(code.slice(1)).apply(undefined, undefined);
    else if(code[0] == "$"){
      return context.get(code.slice(1)); //remove first char
    }
    return isNaN(code)? code: Number(code);    
  }

  this.parse = (code)=>{
    return parenthesize(tokenize(code));
  }

  this.forceRun = (code)=>{
    console.log(lib);
    return interpret(code, new Context(lib));
  }
}