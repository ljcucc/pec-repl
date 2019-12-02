(function(){
  // private
  function lexer(stringInput){
    var lexerResult = [];
    var valueStack = {
      type:"unknow",
      value:""
    };
    for(var index = 0; index < stringInput.length; index++){
      var currentChar = stringInput[index];

      if(currentChar == "\""){
        if(valueStack.type == "unknow"){
          valueStack.type = "string";
          continue;
        }else if(valueStack.type == "string"){
          pushVariableName();
          continue;
        }
      }
      
      if(valueStack.type == "string"){
        valueStack.value += currentChar;
        continue;
      }

      if(currentChar.trim() == ""){
        pushVariableName();
        continue;
      }

      if(checkIsVariableName(currentChar) && (valueStack.type == "unknow" || valueStack.type == "name")){
        valueStack.type = "name"
        valueStack.value+=currentChar;
        continue;
      }

      if(!isNaN(currentChar) || (!isNaN(valueStack.value) && valueStack.type == "number" && currentChar == ".")){        
        if(valueStack.type != "name") valueStack.type = "number";
        valueStack.value+=currentChar;
        continue;
      }

      if((currentChar == "(" || currentChar == ")") && valueStack.type != "string"){
        pushVariableName();
        lexerResult.push({
          type:"paren",
          value:currentChar
        });
        continue;
      }

      let errorPosition = getPosition(index), errorMessage = "Syntax error at line "+errorPosition[0]+", "+errorPosition[1];
      throw (errorMessage);
    }

    pushVariableName();

    function pushVariableName(){
      if(!checkValueIsNull()){
        lexerResult.push(valueStack);
        resetValueStack();
      }
    }

    function checkIsVariableName(str){
      return str.match("^[a-zA-Z_$][a-zA-Z_$0-9]*$");
    }

    function resetValueStack(){
      valueStack = {
        type:"unknow",
        value:""
      }
    }

    function checkValueIsNull(){
      return valueStack.type == "unknow" && valueStack.value.trim() == "";
    }

    function getPosition(index){
      var lines = stringInput.substring(0,index+1).split("\n");
      var lineCount = lines[lines.length-1].length;
      return [lines.length, lineCount];
    }

    return lexerResult;
  }

  function parser(lexerResult){
    var resultJSON = "[";
    for(var index = 0; index < lexerResult.length; index++){
      var currentObj = lexerResult[index];

      if(currentObj.type == "paren"){
        if(currentObj.value == "("){
          resultJSON+= '[';
        }else if(currentObj.value == ")"){
          resultJSON+= ']';
        }
      }

      if(currentObj.type == "string"){
        resultJSON+='"' + currentObj.value + '"';
      }else if(currentObj.type == "number"){
        resultJSON+=String(currentObj.value);
      }else if(currentObj.type == "name"){
        resultJSON+='"$' + currentObj.value + '"';
      }

      if(index >= lexerResult.length -1) continue;

      if(!(lexerResult[index+1].type == "paren" && lexerResult[index+1].value == ")") && !(currentObj.type == "paren" && currentObj.value == "(")){
        resultJSON+=","
      }
    }

    resultJSON+="]"
    
    console.log(resultJSON);
    return parse2scopes(JSON.parse(resultJSON));
  }

  // function parse2scopes(parsedSourceCode){
  //   var DeepScopeCount = 0;
  //   var unscanScope = 0;
  //   var scopes = [{
  //     value:parsedSourceCode,
  //     extends: [-1]
  //   }];

  //   do{
  //     DeepScopeCount = 0;
  //     for(var scopeIndex = unscanScope; scopeIndex < scopes.length; scopeIndex ++){ //Rendering each scope
  //       var scope = scopes[scopeIndex].value;
  //       // console.log(scope)
  //       for(var codeIndex = 0; codeIndex < scope.length; codeIndex++){
  //         var codeItem = scope[codeIndex];
  //         if(Array.isArray(codeItem)){
  //           DeepScopeCount ++;
  //           scopes.push({
  //             value: codeItem,
  //             extends: scopes[scopeIndex].extends.concat(scopeIndex)
  //           });
  //           scopes[scopeIndex].value[codeIndex] = {
  //             type: "scope",
  //             value:String(scopes.length -1)
  //           };
  //           unscanScope++;
  //         }
  //       }
  //     }
  //   }while(DeepScopeCount > 0);
  //   console.log(scopes)
  //   return scopes;
  // }

  // function exec(code,requireEnv, config){
  //   config = config || {};
  //   var stackPointers = ("pointerList" in config? config.pointerList : []);
  //   var returnValueList = ("returnList" in config? config.returnList : []);
  //   var sysValueList = ("sysList" in config? config.returnList : []);
  //   var variablePool = ("variablePool" in config? config.variablePool : []); //varianle format: [scope][value_name]

  //   const exportFunctions = {
  //     sys: sysValueList[scopeIndex],
  //     env: {
  //       resetExecuteIndex:()=>{
  //         console.log("resetExecuteIndex("+scopeIndex+")");
  //         resetExecuteIndex(scopeIndex);
  //       },
  //       getValues
  //     }
  //   }

  //   initLists();

  //   importScopeVariables("$-1", requireEnv);

  //   var scopeIndex = 0;
  //   var loopCount = 0;

  //   while(!isDone(scopeIndex)){
  //     loopCount ++;
  //     if(loopCount > 30){
  //       throw "loop count > 1000"
  //       break;
  //     }

  //     console.log({
  //       scopeIndex,
  //       code:code[scopeIndex],
  //       stackPointers
  //     });

  //     const currentPointer = stackPointers[scopeIndex].index;

  //     if(currentPointer == 0 && isVarCode(code[scopeIndex].value[0])){ //if is vairbale head and while reading the head
  //       var functionName = getVarInfo(code[scopeIndex].value[0],scopeIndex,code[scopeIndex].extends); //get head variable name
  //       if(functionName.scope == "undefined") throw "variable not found.";
  //       var functionVariable =  variablePool[functionName[0]][functionName[1]]; //get variable datas

  //       if(functionVariable.type == "function"){ //if head is a function
  //         sysValueList[scopeIndex] = functionVariable.setup(code[scopeIndex],exportFunctions); // run init
  //         stackPointers[scopeIndex].call = headVariable;
  //         stackPointerMove(scopeIndex,1); //move forward
  //         continue;
  //       }
  //     }

  //     if(isDeeperScopeInside(scopeIndex,currentPointer)){ // if here have an deeper scope, then deep-in!
  //       stackPointerMove(scopeIndex,1); //move forward
  //       var scopeLink = code[scopeIndex].value[currentPointer] //move deeper
  //       scopeIndex = scopeLink.value;
  //       scopeIndex = Number(scopeIndex);
  //       console.log("after scopeIndex"+scopeIndex);
  //       continue;
  //     }

  //     if(currentPointer >= code[scopeIndex].value.length -1){ //if we scanned all of the value,meaning there's no deeper scope we can go ,then start to execute back.
  //       const firstItem = code[scopeIndex].value[0];

  //       if(!isVarCode(firstItem)){ //if current scope of code isn't variable start, meaning this is an normal list, then go back.
  //         returnValueList[scopeIndex] = getValues(code[scopeIndex]); //push list value into return list
  //         scopeIndex = getFatherScope(scopeIndex); //back to upper scope
  //         console.log(scopeIndex);
  //         continue;
  //       }

  //       var func_var = getVarInfo(firstItem,scopeIndex,code[scopeIndex].extends); //get head variable name
  //       // console.log([firstItem,scopeIndex,code[scopeIndex].extends])
  //       // console.log(headVariable);
        
  //       if(func_var.scope == "undefined") throw "value not found!"
  //       var func_var =  variablePool[func_info.scope][func_info.name]; //get variable datas
  //       sysValueList[scopeIndex] = targetVariable.run(code[scopeIndex], exportFunctions); //run it

  //       var returnned = sysValueList[scopeIndex].feedback;
  //       returnValueList[scopeIndex] = returnned;

  //       scopeIndex = getFatherScope(scopeIndex);
  //       console.log(scopeIndex);
  //       console.log("function runned")

  //       continue;
  //     }

  //     console.log("counting ending");
  //     stackPointers[scopeIndex].index ++;
  //   }


  //   console.log(variablePool);
  //   console.log(getValues(code[0].value));

  //   function initLists(){
  //     var initstackPointers = (stackPointers.length == 0);
  //     var initSysValueList = (sysValueList.length == 0);
  //     var initReturnValueList = (returnValueList.length == 0);

  //     for(var index in code){
  //       if(initstackPointers)
  //         stackPointers.push({call:[],index:0});
  //       if(initSysValueList)
  //         sysValueList.push({});
  //       if(initReturnValueList)
  //         returnValueList.push(null);
  //     }
  //   }

  //   function getVarInfo(var_name, scopeId, extendsScope){
  //     // retrurns [scopeID weher's variable exist, variable name]
  //     if("$"+String(scopeId) in variablePool && var_name in variablePool[scopeId]){
  //       return ["$"+String(scopeId), var_name];
  //     }
  //     for(var i =0; i < extendsScope.length; i++){
  //       var scope = "$"+String(extendsScope[(extendsScope.length - 1 ) - i]);
  //       if(scope in variablePool && varNavar_nameme in variablePool[scope]){
  //         return {
  //           scope,
  //           name:variablePool[scope][var_name]
  //         };
  //       }
  //     }
  //     return {
  //       scope: "undefined",
  //       name: null
  //     }
  //   }

  //   function isVarCode(name){
  //     if(typeof name != "string") return false;
  //     return name.indexOf("$") == 0;
  //   }

  //   function stackPointerMove(scopeId,step){
  //     console.log(scopeId);
  //     stackPointers[scopeId].index += step;
  //   }

  //   function importScopeVariables(scopeName, vars){
  //     var originVars = variablePool[String(scopeName)] || [];
  //     variablePool[scopeName] = Object.assign({},originVars, vars); //merge variables
  //   }

  //   function isDeeperScopeInside(scopeId,index){
  //     if(index != undefined){
  //       var currentItem = code[scopeId].value[index];
  //       console.log({
  //         currentItem
  //       })
  //       return typeof currentItem == "object" && "type" in currentItem && currentItem.type == "scope";
  //     }
  //     for(var index = 0; index < code[scopeId]; index++){
  //       var currentItem = code[scopeId].value[index];
  //       if(typeof currentItem == "object" && "type" in currentItem && currentItem.type == "scope"){
  //         return true;
  //       }
  //       return false;
  //     }
  //   }

  //   function getFatherScope(scopeId){
  //     return code[scopeId].extends[code[scopeId].extends.length-1];
  //   }

  //   function resetExecuteIndex(scopeId){
  //     //resetExecuteIndex(...) meaning rerun this line
  //     stackPointers[scopeId] = 0;
  //   }

  //   function getCodeTemplate(codeList){ //getValues
  //     var result = [];
  //     for(var index in codeList){
  //       var currentObj = codeList[index];
  //       if(isVarCode(currentObj)){
  //         result.push({
  //           type: "variable",
  //           value: currentObj
  //         });
  //         console.log("getCodeTemplateList");
  //       }else if(isNaN(currentObj) && typeof currentObj == "string"){
  //         result.push({
  //           type: "string",
  //           value: currentObj
  //         });
  //       }else if(typeof currentObj == "object" && "type" in currentObj && currentObj.type == "scope"){
  //         result.push({
  //           type: "any",
  //           value: returnValueList[currentObj.value]
  //         });
  //       }else{
  //         result.push({
  //           type: "number",
  //           value: currentObj
  //         })
  //       }
  //     }
  //     return result;
  //   }

  //   function getValues(codeList){ //getValues
  //     var result = [];
  //     for(var index in codeList){
  //       var currentObj = codeList[index];
  //       if(isVarCode(currentObj)){
  //         result.push({
  //           type: "variable",
  //           value: currentObj
  //         });
  //       }else if(isNaN(currentObj) && typeof currentObj == "string"){
  //         result.push({
  //           type: "string",
  //           value: currentObj
  //         });
  //       }else if(typeof currentObj == "object" && "type" in currentObj && currentObj.type == "scope"){
  //         result.push({
  //           type: "any",
  //           value: returnValueList[currentObj.value]
  //         });
  //       }else{
  //         result.push({
  //           type: "number",
  //           value: currentObj
  //         })
  //       }
  //     }
  //     return result;
  //   }

  //   function isDone(scopeId){
  //     // scopeId = Number(scopeId);
  //     return scopeId == -1 || stackPointers[scopeId] >= code[scopeId].value.length;
  //   }
  // }

  
  // public
  window.lispEnv = {
    lexer,
    parser,
    // exec
  };
})();