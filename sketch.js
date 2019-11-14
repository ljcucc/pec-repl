// (function(){
//   var codesProps = {
//     resizing: false,
//     appear:false,
//     x: 0,
//     y: 0,
//     width: 0
//   }
//   var codeMirror = CodeMirror.fromTextArea(document.querySelector("#code_edit"),{
//     lineNumbers: true,
//     width: 300,
//     textSize: 16,
//     theme: "monokai",
//     smartIndent:false,
//     tabSize: 2
//   });
  
//   codeMirror.setSize(0, window.innerHeight - 60 - 100);
//   var fullScreenToggle = false;

//   var sketch = new p5(function(sketch){
//     sketch.setup = function(){
//       console.log("setup  v1.0");
//       sketch.resizeCanvas(window.innerWidth,window.innerHeight);
//       sketch.background(255);

//       rerenderingCanvas();
//     }

//     sketch.draw = function(){
//     }
//   },document.querySelector("#canvasContainer"));

//   $("#runScript").click(function(){
//     console.log(codeMirror.getValue())
//     console.time("parser process");
//     let lisp = new LispRuntime({
//       debug:(e)=>{
//         console.log("DEBUG: "+e);
//       },
//       msgbox:(e)=>{
//         alert(e);
//       },
//       input:(e)=>{
//         return prompt("input:");
//       },
//       join:(e)=>{
//         return e.join("");
//       }
//     });
//     let parsedCode = lisp.parse(codeMirror.getValue());
//     lisp.forceRun(parsedCode);
//     console.timeEnd("parser process");

//   });
  
//   var resizeHandle = $(".resize-handler");
//   resizeHandle.mousedown(e=>{
//     codesProps = {
//       resizing: true,
//       x: e.screenX,
//       y: e.offsetY,
//       width: $(".CodeMirror").width()
//     };
//   })  

//   $(window).mousemove(e=>{
//     if(codesProps.resizing){
//       $(".CodeMirror").width(codesProps.width + (e.screenX - codesProps.x));
//       resizeCanvas(codesProps.width + (e.screenX - codesProps.x));
//       rerenderingCanvas();
//     }
//   });

//   $(window).mouseup(e=>{
//     if(codesProps.resizing){
//       codesProps.resizing = false;
//       $(".CodeMirror").width(codesProps.width + (e.screenX - codesProps.x))
//       resizeCanvas(codesProps.width + (e.screenX - codesProps.x));
//     }
//   });

//   onkeydown = function(e){
//     if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
//       e.preventDefault();

//       var appear = $(".CodeMirror").width() < 10;
      
//       if(!appear){
//         codesProps.width = $(".CodeMirror").width();
//         $(".CodeMirror").width(0);
//       }else{
//         codesProps.width = codesProps.width <= 10? 
//           window.innerWidth/2 : codesProps.width;
        
//         $(".CodeMirror").width(codesProps.width);
//       }
//       if(!appear)
//         resizeCanvas(0)
//       else
//         resizeCanvas(codesProps.width)
      
//     }

//     if(e.altKey && e.code == 'Space'){
//       e.preventDefault();
//       console.log({fullScreenToggle})
//       fullScreenToggle = !fullScreenToggle;
//       if(fullScreenToggle){
//         $(".nav-bar").slideDown()
//       }else{
//         $(".nav-bar").slideUp();
//       }
//     }
//   }

//   window.addEventListener("resize",e=>{
//     resizeCanvas($(".CodeMirror").width());
//   });

//   function resizeCanvas(width){
//     if(width > 10){
//       $("#runScript").removeClass("hide");
//     }else{
//       $("#runScript").addClass("hide");
//     }

//     sketch.resizeCanvas(window.innerWidth - width,window.innerHeight)
//     $("#canvasContainer").css("marginLeft",width)
//     rerenderingCanvas();
//   }

//   function rerenderingCanvas(){
//     sketch.background(38, 50, 56);
//     sketch.stroke(180); 
//     const padding = 14;
//     for(let w = padding; w < sketch.width; w+= padding){
//       for(let h = padding; h < sketch.height; h+= padding){
//         sketch.point(w,h);
//       }
//     }
//   }

//   console.log(codeMirror);
// });

(()=>{
  var canvas = new Canvas(document.querySelector("#canvasContainer"),{});
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

      var appear = split_left.width() < 50;
      
      var height = window.innerHeight;

      if(!appear){
        codesProps.width = split_left.width();
        split_left.resize(0,height); //hide
        split_right.resize(window.innerWidth,height); //to origin size
      }else{
        codesProps.width = codesProps.width <= 50? 
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

    if(width > 50){
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