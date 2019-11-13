(function(){
  var codeEditorConfig = {
    resizing: false,
    appear:false,
    x: 0,
    y: 0,
    editorWidth: 0
  }
  var codeMrirrorEditor = CodeMirror.fromTextArea(document.querySelector("#code_edit"),{
    lineNumbers: true,
    width: 300,
    textSize: 16,
    theme: "monokai",
    smartIndent:false,
    tabSize: 2
  });
  
  codeMrirrorEditor.setSize(0, window.innerHeight);
  var fullScreenToggle = false;

  var sketch = new p5(function(sketch){
    sketch.setup = function(){
      console.log("setup  v1.0");
      sketch.resizeCanvas(window.innerWidth,window.innerHeight);
      sketch.background(255);

      rerenderingCanvas();
    }

    sketch.draw = function(){
      // sketch.background(200)
    }
  },document.querySelector("#canvasContainer"));

  $("#runScript").click(function(){
    console.log(codeMrirrorEditor.getValue())
    // let lasttime = performance.now();
    console.time("parser process");
    // let result = lispEnv.parser(lispEnv.lexer(codeMrirrorEditor.getValue()));
    // let env = functions;
    // console.log(result);
    // // lispEnv.exec(result, env);
    let lisp = new LispRuntime({
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
    });
    let parsedCode = lisp.parse(codeMrirrorEditor.getValue());
    lisp.forceRun(parsedCode);
    console.timeEnd("parser process");

  });
  
  var resizeHandle = $(".resize-handler");
  resizeHandle.mousedown(e=>{
    // console.log(e);
    $(".CodeMirror").removeClass("auto-resize");
    codeEditorConfig = {
      resizing: true,
      x: e.screenX,
      y: e.offsetY,
      editorWidth: $(".CodeMirror").width()
    };
    // $("canvas").width($("#canvasContainer").width()-10);
    // $("#canvasContainer").hide();
  })  

  $(window).mousemove(e=>{
    if(codeEditorConfig.resizing){
      $(".CodeMirror").width(codeEditorConfig.editorWidth + (e.screenX - codeEditorConfig.x));
      resizeCanvas(codeEditorConfig.editorWidth + (e.screenX - codeEditorConfig.x));
      rerenderingCanvas();
    }
  })

  $(window).mouseup(e=>{
    if(codeEditorConfig.resizing){
      codeEditorConfig.resizing = false;
      $(".CodeMirror").width(codeEditorConfig.editorWidth + (e.screenX - codeEditorConfig.x))
      resizeCanvas(codeEditorConfig.editorWidth + (e.screenX - codeEditorConfig.x));
    }
  });

  onkeydown = function(e){
    if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
      e.preventDefault();

      var codeEditorAppear = $(".CodeMirror").width() < 10;
      console.log("toggleEditorAppear");
      $(".CodeMirror").addClass("auto-resize");
      if(!codeEditorAppear){
        codeEditorConfig.editorWidth = $(".CodeMirror").width();
        $(".CodeMirror").width(0);
      }else{
        if(codeEditorConfig.editorWidth <= 10) 
          codeEditorConfig.editorWidth = window.innerWidth/2;
        $(".CodeMirror").width(codeEditorConfig.editorWidth);
      }
      if(!codeEditorAppear)
        resizeCanvas(0)
      else
        resizeCanvas(codeEditorConfig.editorWidth)
      
    }

    if(e.altKey && e.code == 'Space'){
      e.preventDefault();
      console.log({fullScreenToggle})
      fullScreenToggle = !fullScreenToggle;
      if(fullScreenToggle){
        $(".nav-bar").slideDown()
      }else{
        $(".nav-bar").slideUp();
      }
    }
  }

  window.addEventListener("resize",e=>{
    resizeCanvas($(".CodeMirror").width());
  })

  function resizeCanvas(editorWidth){
    if(editorWidth > 10){
      $("#runScript").removeClass("hide");
    }else{
      $("#runScript").addClass("hide");
    }

    sketch.resizeCanvas(window.innerWidth - editorWidth,window.innerHeight)
    $("#canvasContainer").css("marginLeft",editorWidth)
    rerenderingCanvas();
  }

  function rerenderingCanvas(){
    sketch.background(38, 50, 56);
    sketch.stroke(180); 
    const padding = 14;
    for(let w = padding; w < sketch.width; w+= padding){
      for(let h = padding; h < sketch.height; h+= padding){
        sketch.point(w,h);
      }
    }
  }

  $(".click_remove_welcome_dialog").click(e=>{
    $("#welcome_dialog").fadeOut(200);
    $("#welcome_dialog_background").fadeOut(200);
  })
})();