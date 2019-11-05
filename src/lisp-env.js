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

      // console.log(valueStack)

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

      // console.log(lexerResult);

      let errorPosition = getPosition(index), errorMessage = "Syntax error at line "+errorPosition[0]+", "+errorPosition[1];
      throw (errorMessage);
    }

    pushVariableName();

    function pushVariableName(){
      // console.log("checking and pushing unpush stack..."+ valueStack);
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
    console.log(executeWithEnv(JSON.parse(resultJSON)));
  }

  function executeWithEnv(parsedSourceCode, env){
    var DeepScopeCount = 0;
    var unscanScope = 0;
    var scopes = [{
      value:parsedSourceCode,
      extends: ["root"]
    }];

    do{
      DeepScopeCount = 0;
      for(var scopeIndex = unscanScope; scopeIndex < scopes.length; scopeIndex ++){ //Rendering each scope
        var scope = scopes[scopeIndex].value;
        console.log(scope)
        // if(!scope) continue;
        for(var codeIndex = 0; codeIndex < scope.length; codeIndex++){
          var codeItem = scope[codeIndex];
          if(Array.isArray(codeItem)){
            DeepScopeCount ++;
            scopes.push({
              value: codeItem,
              extends: scopes[scopeIndex].extends.concat(scopeIndex)
            });
            scopes[scopeIndex].value[codeIndex] = scopes.length -1;
            unscanScope++;
          }
        }
      }
    }while(DeepScopeCount > 0);
    console.log(scopes)
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  
  // public
  window.lispEnv = {
    lexer,
    parser,
    executeWithEnv
  };
})();