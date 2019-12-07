//reference from 
//  https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js 
//  and https://github.com/hundredrabbits/Ronin/blob/master/desktop/sources/scripts/lib/lisp.js

function LispRuntime(lib={}){
  var error_strings = {
    func_paramets_type: "The data type of function paramets cannot be a const value, must be variable name like $var_name or $value."
  }

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
    let code = "["+tokenized.map((x,i)=>{
      if(x == "(") return '[""';
      else if(x == ")") return '""]'
      else return x[0] == '"'? x: !isNaN(x)? x: '"$'+x+'"';
    }).join(",").replace(/!str_pstart!/g,"(").replace(/!str_pend!/g,")")+"]";
    console.log(code);
    return JSON.parse(code);
  }

  const asyncFuncs = {
    let: (code, context)=>{
      context.scope[code[0][0] == "$"? code[0].slice(1): code[0]] =  interpret(code[1], context);
    },
    set: (code, context)=>{
      context.scope[code[0][0] == "$"? code[0].slice(1): code[0]] =  interpret(code[1], context);
    },
    if: (code, context)=>{
      return interpret(code[0],context) === true? 
        interpret(code[1], context):
        (code[2]? interpret(code[2],context): null);
    },
    map: (code, context)=>{
      let result = interpret(code[0],context);
      console.log(result);
      return result.map((e, i)=>{
        let c = new Context({},context);
        c.scope[code[1].slice(1)] = i;
        return interpret(code[2],c);
      });
    },
    def: (code, context)=>{
      console.log("define a function")
      console.log(code);


      switch(code.length){
        case 1: 
          return new FunctionObj(code);
        case 2:
          if(code[1] instanceof Array){
            //Process heading and tail of codes
            var paramets = code[0];
            if(paramets instanceof Array && paramets.length >= 3 && paramets[0] == ""){
              paramets.shift();
              paramets.pop();
            }

            return new FunctionObj(code[1],paramets);
          }else {
            context.scope[code[0][0] == "$"? code[0].slice(1): code[0]] =  new FunctionObj(code[1]);
          }
          break;
        case 3:
          //Process heading and tail of codes
          var paramets = code[1];
          if(paramets instanceof Array && paramets.length >= 3 && paramets[0] == ""){
            paramets.shift();
            paramets.pop();
          }
          context.scope[code[0][0] == "$"? code[0].slice(1): code[0]] =  new FunctionObj(code[2],paramets);
          break;
      }
    }
  }

  function Context(scope_vars, parent){
    this.scope = scope_vars;
    this.parent = parent;

    this.get = function(key){
      console.log(this);
      return key in this.scope ? this.scope[key] : (this.parent ? this.parent.get(key): undefined);
    }
  }

  function FunctionObj(code,paramets){
    this.code = code;
    this.paramets = paramets;
  }

  function interpretList(code, context){
    if(code.length > 0 && typeof code[0] == "string" && code[0].slice(1) in asyncFuncs){
      var func_name = code.shift();
      console.log("async function!!")
      var result = asyncFuncs[func_name.slice(1)](code,context);
      if(result) return result;
    }else if(code.length > 0 && typeof code[0] == "string" && context.get(code[0].slice(1)) instanceof FunctionObj){
      
      var func = context.get(code.shift().slice(1)); //get function object
      console.log(code);

      var scope_var = {};
      
      for(var i in func.paramets){ //setup paramets
        // if(! func.paramets[i].trim()) continue;
        if(typeof func.paramets[i] != "string" || func.paramets[i][0] != "$") {
          console.log(i)
          console.log(func.paramets);
          console.log(func.paramets[i]);
          throw error_strings.func_paramets_type;
        }
        var cParamets = func.paramets[i].slice(1);
        scope_var[cParamets] = interpret(code[i] || "" );
      }
      console.log("variable setuped")
      return interpret(func.code, new Context(scope_var, context));
    }else{
      var result = code.map((e, i)=>interpret(e, context));
      if(result[0] instanceof Function){
        let func = result.shift();
        return func.apply(undefined, [result]);
      }
      return result;
    }
  }

  function interpret(code, context){
    if(code instanceof Array && code.length >= 3 && code[0] == ""){
      code.shift();
      code.pop();
    }

    console.log(code);

    if(code instanceof Array && code.length > 0)
      return interpretList(code, context);
    else if(code[0] == "$"){
      console.log("Fetching variable...")
      let result = context.get(code.slice(1));
      return result; //remove first char
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