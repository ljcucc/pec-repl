(()=>{
  window.canvas = new Canvas(document.querySelector("#canvasContainer"),{});
  var codes = new Codes(document.querySelector("#code_edit"), "", {
    lineNumbers: true,
    width: 300,
    textSize: 16,
    theme: "monokai",
    smartIndent:false,
    tabSize: 2
  });
  var resizeHandle = new ResizeHandle($(".resize-handler"),codes,canvas);
  var optionBar = new OptionBar($(".options_bar"), $("#expand_option_bar"));
})();

function ResizeHandle(dom,split_left,split_right){
  var codesProps = {
    resizing: false,
    appear:false,
    x: 0,
    y: 0,
    width: 0
  };

  dom.mousedown(e=>{
    codesProps = {
      resizing: true,
      x: e.screenX,
      y: e.offsetY,
      width: split_left.width() //code editor
    };
    const winHieght = window.innerHeight, leftWidth = codesProps.width + (e.screenX - codesProps.x);
    split_left.resize(leftWidth,winHieght);
    split_right.resize(window.innerWidth - leftWidth, winHieght);
  });

  $(window).mousemove(e=>{
    if(codesProps.resizing){
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (e.screenX - codesProps.x);
      split_left.resize(leftWidth,winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  $(window).mouseup(e=>{
    if(codesProps.resizing){
      codesProps.resizing = false;
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (e.screenX - codesProps.x);
      split_left.resize(leftWidth,winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  window.addEventListener("keydown", e=>{
    if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
      e.preventDefault();

      var appear = split_left.width() < 80;
      
      var height = window.innerHeight;

      if(!appear){
        codesProps.width = split_left.width();
        split_left.resize(0,height); //hide
        split_right.resize(window.innerWidth,height); //to origin size
      }else{
        codesProps.width = codesProps.width <= 100? 
          window.innerWidth/2 : codesProps.width;
        
        split_left.resize(codesProps.width, height); //expand
        split_right.resize(window.innerWidth - codesProps.width, height); //resize
      }

      console.log(appear);
    }
  })
}

function Canvas(container, events){
  var sketch = new p5(function(sketch){
    sketch.setup = ()=>{
      sketch.resizeCanvas(window.innerWidth,window.innerHeight);
      sketch.background(255);

      rerenderingCanvas();
    }
  }, container);

  function rerenderingCanvas(){
    sketch.background(38, 50, 56);
    sketch.stroke(180); 
    const padding = 14;
    for(let w = padding; w < sketch.width; w+= padding){
      for(let h = padding; h < sketch.height; h+= padding){
        sketch.point(w,h);
      }
    }
    console.log("rerendering")
  }

  this.resize = function(width, height, dontRedraw){
    sketch.resizeCanvas(width,height);
    $("#canvasContainer").css("marginLeft",window.innerWidth - width)
    if(!dontRedraw) rerenderingCanvas()
  }

  this.exec = (feedback)=>{
    feedback(sketch);
  }
}

function Codes(dom,id,config){
  var codeMirror = CodeMirror.fromTextArea(document.querySelector("#code_edit"),config);
  codeMirror.setSize(0, window.innerHeight - 60 - 100);

    $("#runScript").click(function(){
    console.log(codeMirror.getValue())
    console.time("parser process");
    let lisp = new LispRuntime(commonLib);
    let parsedCode = lisp.parse(codeMirror.getValue());
    lisp.forceRun(parsedCode);
    console.timeEnd("parser process");

  });

  this.resize = function(width, height){
    $(".CodeMirror").width(width);

    if(width > 80){
      $("#runScript").removeClass("hide");
    }else{
      $("#runScript").addClass("hide");
    }
  }

  this.width = function(){
    return $(".CodeMirror").width();
  }
}

function OptionBar(dom,targetButton){
  targetButton.click(toggle);
  $("#closeOptionBar").click(toggle)

  function toggle(){
    if(dom.hasClass("hide")){
      dom.removeClass("hide");
    }else{
      dom.addClass("hide");
    }
    
  }
}