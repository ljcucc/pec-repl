(function(){
  var codesProps = {
    resizing: false,
    appear:false,
    x: 0,
    y: 0,
    width: 0
  }
  var codeMirror = CodeMirror.fromTextArea(document.querySelector("#code_edit"),{
    lineNumbers: true,
    width: 300,
    textSize: 16,
    theme: "monokai",
    smartIndent:false,
    tabSize: 2
  });
  
  codeMirror.setSize(0, window.innerHeight - 60 - 100);
  var fullScreenToggle = false;

  var sketch = new p5(function(sketch){
    sketch.setup = function(){
      console.log("setup  v1.0");
      sketch.resizeCanvas(window.innerWidth,window.innerHeight);
      sketch.background(255);

      rerenderingCanvas();
    }

    sketch.draw = function(){
    }
  },document.querySelector("#canvasContainer"));

  $("#runScript").click(function(){
    console.log(codeMirror.getValue())
    console.time("parser process");
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
        return e.join("");
      }
    });
    let parsedCode = lisp.parse(codeMirror.getValue());
    lisp.forceRun(parsedCode);
    console.timeEnd("parser process");

  });
  
  var resizeHandle = $(".resize-handler");
  resizeHandle.mousedown(e=>{
    codesProps = {
      resizing: true,
      x: e.screenX,
      y: e.offsetY,
      width: $(".CodeMirror").width()
    };
  })  

  $(window).mousemove(e=>{
    if(codesProps.resizing){
      $(".CodeMirror").width(codesProps.width + (e.screenX - codesProps.x));
      resizeCanvas(codesProps.width + (e.screenX - codesProps.x));
      rerenderingCanvas();
    }
  });

  $(window).mouseup(e=>{
    if(codesProps.resizing){
      codesProps.resizing = false;
      $(".CodeMirror").width(codesProps.width + (e.screenX - codesProps.x))
      resizeCanvas(codesProps.width + (e.screenX - codesProps.x));
    }
  });

  onkeydown = function(e){
    if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
      e.preventDefault();

      var appear = $(".CodeMirror").width() < 10;
      
      if(!appear){
        codesProps.width = $(".CodeMirror").width();
        $(".CodeMirror").width(0);
      }else{
        codesProps.width = codesProps.width <= 10? 
          window.innerWidth/2 : codesProps.width;
        
        $(".CodeMirror").width(codesProps.width);
      }
      if(!appear)
        resizeCanvas(0)
      else
        resizeCanvas(codesProps.width)
      
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
  });

  function resizeCanvas(width){
    if(width > 10){
      $("#runScript").removeClass("hide");
    }else{
      $("#runScript").addClass("hide");
    }

    sketch.resizeCanvas(window.innerWidth - width,window.innerHeight)
    $("#canvasContainer").css("marginLeft",width)
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
})();