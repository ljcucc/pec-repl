(()=>{
  window.canvas = new Canvas(document.querySelector("#canvasContainer"),{});
  var codes = new Codes(document.querySelector("#code_edit"), "", {
    lineNumbers: true,
    width: 300,
    textSize: 16,
    // theme: "material-darker",
    theme: "neo",
    smartIndent:false,
    tabSize: 2
  });

  var resizeHandle = new ResizeHandle($(".resize-handler"),codes,canvas,true);
  var optionBar = new OptionBar($(".options_bar"), $("#expand_option_bar"));
  var menuContainer = new MenuContainer($("#menuContainer"),".menu-div", $("#nav-bar-menu"));
})();

function ResizeHandle(dom,split_left,split_right,mobile_enable){
  var codesProps = {
    resizing: false,
    appear:false,
    x: 0,
    y: 0,
    width: 0
  };

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
  
  if(mobile_enable){
    dom.addClass("mobile");

    const winHieght = window.innerHeight, leftWidth = codesProps.width + (0 - codesProps.x);
    console.log(leftWidth)
    split_left.resize(leftWidth,winHieght);
    split_right.resize(window.innerWidth - leftWidth, winHieght);

    document.querySelector(".resize-handler").addEventListener('touchstart', function(e) {
      // Cache the client X/Y coordinates
      clientX = e.touches[0].clientX;

      dom.addClass("mobile");

      codesProps = {
        resizing: true,
        x: clientX,
        y: e.offsetY,
        width: split_left.width() //code editor
      };
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      console.log(leftWidth)
      split_left.resize(leftWidth,winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);

      dom.addClass("onhover");
    }, false);

    document.querySelector(".resize-handler").addEventListener('touchmove', function(e) {
      // Cache the client X/Y coordinates

      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      clientX = clientX > window.innerWidth? window.innerWidth: clientX;
      clientX = clientX <  4? 4: clientX
      
      if(codesProps.resizing){
        const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
        console.log(leftWidth)
        split_left.resize(leftWidth,winHieght);
        split_right.resize(window.innerWidth - leftWidth, winHieght);
      }
    }, false);

    document.querySelector(".resize-handler").addEventListener('touchend', function(e) {
      // Cache the client X/Y coordinates      
      if(codesProps.resizing){
        codesProps.resizing = false;
      }
      dom.removeClass("onhover");
    }, false);

    
  }

  dom.mousedown(e=>{
    codesProps = {
      resizing: true,
      x: e.screenX,
      y: e.offsetY,
      width: split_left.width() //code editor
    };

    clientX = e.screenX > window.innerWidth-4? window.innerWidth-4: e.screenX;
    clientX = clientX <  4? 4: clientX

    const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
    split_left.resize(leftWidth,winHieght);
    split_right.resize(window.innerWidth - leftWidth, winHieght);
  });

  

  $(window).mousemove(e=>{
    dom.removeClass("mobile");
    if(codesProps.resizing){
      clientX = e.screenX > window.innerWidth-4? window.innerWidth-4: e.screenX;
      clientX = clientX <  4? 4: clientX
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      split_left.resize(leftWidth,winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  $(window).mouseup(e=>{
    if(codesProps.resizing){
      codesProps.resizing = false;
      clientX = e.screenX > window.innerWidth-4? window.innerWidth-4: e.screenX;
      clientX = clientX <  4? 4: clientX
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      split_left.resize(leftWidth,winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  $(window).on("resize",e=>{
    var height = window.innerHeight;
    split_left.resize(split_left.width(), height); //expand
    split_right.resize(window.innerWidth - split_left.width(), height); //resize
  });
}

function Canvas(container, events){
  var update = false;
  var dragPosition = [0,0];
  var lastPosition = null;
  var sketch = new p5(function(sketch){
    sketch.setup = ()=>{
      sketch.resizeCanvas(window.innerWidth,window.innerHeight);
      sketch.background(255);

      rerenderingCanvas();
    }

    sketch.draw = ()=>{
      if(update){
        update = false;
        rerenderingCanvas()
      }

      if(lastPosition && sketch.mouseIsPressed && sketch.mouseX > 5 && sketch.mouseButton == sketch.LEFT){
        dragPosition[0] += (sketch.mouseX - lastPosition[0]);
        dragPosition[1] += (sketch.mouseY - lastPosition[1]);
        lastPosition = [sketch.mouseX,sketch.mouseY];
        update = true;
      }else if(lastPosition){
        lastPosition = null;
        update = true;
      }
    }

    sketch.mousePressed = ()=>{
      if(sketch.mouseX > 0 && sketch.mouseY > 0)
        lastPosition = [sketch.mouseX,sketch.mouseY];
    }
  }, container);

  var graphicsProcess = new GraphicsProcess(sketch.createGraphics(window.innerWidth,window.innerHeight));

  function rerenderingCanvas(){
    try{
      sketch.background(getComputedStyle(document.body).getPropertyValue('--background-color'));
      sketch.stroke(getComputedStyle(document.body).getPropertyValue('--highlight-lines-color')); 
    }catch(e){

    }
    
    const padding = 15;
    for(let w = 0; w < sketch.width; w+= padding){
      for(let h = 0; h < sketch.height; h+= padding){
        sketch.point(w,h);
      }
    }

    sketch.image(graphicsProcess.render(!!dragPosition), dragPosition[0],dragPosition[1]);

    // sketch.canvas.getContext("2d").drawImage(graphicsProcess.render(),0,0);
  }

  this.resize = function(width, height, dontRedraw){
    sketch.resizeCanvas(width,height);
    // graphicsProcess.canvas.resizeCanvas(width,height)
    $("#canvasContainer").css("marginLeft",window.innerWidth - width)
    if(!dontRedraw) update = true;
  }

  this.exec = (feedback)=>{
    feedback(sketch);
  }

  this.sketch = sketch;
  this.rerenderingCanvas = ()=>{
    update = true;
  }
}

function Codes(dom,id,config){
  var codeMirror = CodeMirror.fromTextArea(document.querySelector("#code_edit"),config);
  codeMirror.setSize(0, window.innerHeight - 60 - 100);

    $("#runScript").click(function(){
      console.log(codeMirror.getValue());

      window.canvas.rerenderingCanvas();

      console.time("parser process");
      var lisp = new LispRuntime(commonLib);
      lisp.forceRun(lisp.parse(codeMirror.getValue()));
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

function MenuContainer(dom,listDomQuery, targetButton){
  dom.hide();
  targetButton.click(e=>{
    dom.fadeIn(200);
    $(".menu-div").removeClass("hide");
  });
  $(".menu-background").click(e=>{
    $(".menu-div").addClass("hide");
    dom.fadeOut(200);
  });

  var menuLists = new Vue({
    el:listDomQuery,
    data:{
      list:[1 ,2, 3]
    }
  })
}