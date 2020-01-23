(function () {
  var commonLib = {
    debug: (code, context) => {
      var e = context.interpret(code);
      console.log("DEBUG: " + String(typeof e[0] == "object" ? JSON.stringify(e[0]) : e[0]));
    },
    msgbox: (code, context) => {
      var e = context.interpret(code);
      alert(e);
    },
    read: (code, context) => {
      var e = context.interpret(code);
      if (e[0])
        return prompt(e[0]);
      else
        return prompt("input:");
    },
    join: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      return e.join("");
    },
    true: (e) => true,
    false: (e) => false,
    "==": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);

      if (e instanceof Array) {
        for (var i in e) {
          if (e[i] != e[0]) return false;
        }
        return true;
      }
    },
    "+": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      return e.reduce((acc, x) => acc + x);
    },
    "-": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      return e.reduce((acc, x) => acc - x)
    },
    "*": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      return e.reduce((acc, x) => acc * x);
    },
    "/": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      return e.reduce((acc, x) => acc / x)
    },
    ">": (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      var result = 0;
      for (var i in e) {
        if (i == 0) continue;
        result += (e[i - 1] > e[i] ? 1 : 0);
      }
      return result == e.length - 1;
    },
    arr: (code, context) => {
      var e = context.interpret(code);
      return new Array(e[0]).fill(e[1] || 0);
    },

    if: (code, context) => {
      const errorMsg = "[Syntax Error]: the format of if conditions is wrong. It should be looks like: (if (condition1) (code1) (condition2) (code2) ... (condition-n) (code-n) (else-code))";

      console.log("running [if]");

      if (code.length == 1) throw errorMsg;
      var elseCode;
      if (code.length >= 3 && code.length % 2 == 1) {
        console.log("there have an else code");
        elseCode = code.pop();
      }

      while (code.length > 3) {
        var ifCondition = context.interpret(code.shift());
        var ifCode = code.shift();
        if (ifCondition) {
          context.interpret(ifCode);
          console.log(">>> if code is true");
          return;
        }
      }

      if (elseCode) {
        context.interpret(elseCode);
        console.log("running else code");
      }
      console.log(">>> Else code");
    },

    write: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);

      window.canvas.getGraphicsProcess().write(e[0]);
    },

    image: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);

      if (e.length == 4)
        window.canvas.getGraphicsProcess().image(e[0], e[1], e[2], e[3])
      else {
        window.canvas.getGraphicsProcess().image(e[0], 0, 0, e[1]);
      }
    },

    date: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);

      if (e[0] && e.length == 1) {
        return "[" + String(new Date().toISOString()) + "] ⇒ " + e[0];
      } else {
        return String(new Date());
      }
    },

    clear: (code, context) => {
      this.canvas.getGraphicsProcess().reset();
      $(".custom").remove();
      // for(var key in DOMs){
      //   DOMs[key].remove();
      // }
      DOMs = {};
    },

    rect: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);
      
      return {
        type: "shape",
        shape: "rect",
        x: e[0],
        y: e[1],
        w: e[2],
        h: e[3]
      }

      // this.canvas.getGraphicsProcess().canvas.rect(e[0], e[1], e[2], e[3])
    },

    draw: (code, context) =>{
      var e = context.interpret(code);
      e = replaceArray(e);

      for(var index in e){
        var curr = e[index];
        if(curr.type != "shape") continue;
        switch(curr.shape){
          case "rect":
            this.canvas.getGraphicsProcess().canvas.rect(curr.x, curr.y, curr.w, curr.h);
            break;
        }
      }
    },

    circle: (code, context) => {
      var e = context.interpret(code);
      e = replaceArray(e);

      // this.canvas.getGraphicsProcess().canvas.rect(e[0], e[1], e[2], e[3])
    },
    
  };

  var icons = {
    circle: "panorama_fish_eye",
    rect: "crop_landscape",
    "+":"format_list_numbered",
    "-":"format_list_numbered",
    "*":"format_list_numbered",
    "/":"format_list_numbered",
    "join":"subject",
    "true":"toggle_on",
    "false":"toggle_off"
  };

  var titles ={
    "+": "Addition",
    "-": "Subtraction",
    "*": "Multiplication",
    "/": "Division",
    "==": "Equals",
    rect: "Draw a rect",
    circle: "Draw a circle",
    if: "if...",
    msgbox:"MessageBox",
    join:"Join strings",
    true: "True: Boolean",
    false: "False: Boolean"
  }

  window.commonLib = commonLib;

  function replaceArray(e) {
    return e[0] instanceof Array && e[0].length == 1 ? e[0] : e;
  }

  function MergeLibrary(spacename, e) {

  }

  window.getCommandList = ()=>{
    var commandList = [];
    for(var key in commonLib){
      commandList.push({
        title:titles[key] || "code: "+key,
        icon: icons[key] || "code",
        code: "null"
      });
    }
    return commandList
  }
})();