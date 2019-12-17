(() => {
  window.canvas = new Canvas(document.querySelector("#canvasContainer"), {});
  var codes = new Codes(document.querySelector("#code_edit"), "", {
    lineNumbers: true,
    width: 300,
    textSize: 16,
    // theme: "material-darker",
    theme: "neo",
    smartIndent: false,
    tabSize: 2
  });

  var resizeHandle = new ResizeHandle($(".resize-handler"), codes, canvas, true);
  var optionBar = new OptionBar($(".options_bar"), $("#expand_option_bar"));
  var menuContainer = new MenuContainer($("#menuContainer"), ".menu-div", $("#nav-bar-menu"));
  var variableForm = new VariableForm("#variable-form");
})();

function ResizeHandle(dom, split_left, split_right, mobile_enable) {
  var codesProps = {
    resizing: false,
    appear: false,
    x: 0,
    y: 0,
    width: 0,
    mobile: false
  };

  window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)) {
      e.preventDefault();

      var appear = split_left.width() < 80;

      var height = window.innerHeight;

      if (!appear) {
        codesProps.width = split_left.width();
        split_left.resize(0, height); //hide
        split_right.resize(window.innerWidth, height); //to origin size
      } else {
        codesProps.width = codesProps.width <= 100 ?
          window.innerWidth / 2 : codesProps.width;

        split_left.resize(codesProps.width, height); //expand
        split_right.resize(window.innerWidth - codesProps.width, height); //resize
      }

      console.log(appear);
    }
  })

  if (desktopProcess) {
    ipcRenderer.on("code-editor-toggle", e => {
      console.log("code-editor-toggle");
      var appear = split_left.width() < 80;

      var height = window.innerHeight;

      if (!appear) {
        codesProps.width = split_left.width();
        split_left.resize(0, height); //hide
        split_right.resize(window.innerWidth, height); //to origin size
      } else {
        codesProps.width = codesProps.width <= 100 ?
          window.innerWidth / 2 : codesProps.width;

        split_left.resize(codesProps.width, height); //expand
        split_right.resize(window.innerWidth - codesProps.width, height); //resize
      }
    });
    ipcRenderer.send("ok", true);
  }

  if (mobile_enable) {
    // dom.addClass("mobile");

    const winHieght = window.innerHeight, leftWidth = codesProps.width + (0 - codesProps.x);
    console.log(leftWidth)
    split_left.resize(leftWidth, winHieght);
    split_right.resize(window.innerWidth - leftWidth, winHieght);

    document.querySelector(".resize-handler").addEventListener('touchstart', function (e) {
      // Cache the client X/Y coordinates
      clientX = e.touches[0].clientX;

      clientX = clientX > window.innerWidth - 4 ? window.innerWidth - 4 : clientX;
      clientX = clientX < 4 ? 4 : clientX

      dom.addClass("mobile");

      codesProps = {
        resizing: true,
        x: clientX,
        y: e.offsetY,
        width: split_left.width() //code editor,
      };
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      console.log(leftWidth)
      split_left.resize(leftWidth, winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);

      dom.addClass("onhover");
    }, false);

    document.querySelector(".resize-handler").addEventListener('touchmove', function (e) {
      // Cache the client X/Y coordinates

      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      clientX = clientX > window.innerWidth - 4 ? window.innerWidth - 4 : clientX;
      clientX = clientX < 4 ? 4 : clientX

      if (codesProps.resizing) {
        const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
        console.log(leftWidth)
        split_left.resize(leftWidth, winHieght);
        split_right.resize(window.innerWidth - leftWidth, winHieght);
      }
    }, false);

    document.querySelector(".resize-handler").addEventListener('touchend', function (e) {
      // Cache the client X/Y coordinates      
      if (codesProps.resizing) {
        codesProps.resizing = false;
      }
      dom.removeClass("onhover");
    }, false);


  }

  dom.mousedown(e => {
    codesProps = {
      resizing: true,
      x: e.clientX,
      y: e.offsetY,
      width: split_left.width() //code editor
    };

    clientX = e.clientX > window.innerWidth - 4 ? window.innerWidth - 4 : e.clientX;
    clientX = clientX < 4 ? 4 : clientX

    console.log(e.clientX > window.innerWidth - 4);
    console.log({
      screenX: e.clientX,
      width: window.innerWidth,
      e
    })

    const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
    split_left.resize(leftWidth, winHieght);
    split_right.resize(window.innerWidth - leftWidth, winHieght);
  });



  $(window).mousemove(e => {
    dom.removeClass("mobile");
    if (codesProps.resizing) {
      clientX = e.clientX > window.innerWidth - 4 ? window.innerWidth - 4 : e.clientX;
      clientX = clientX < 4 ? 4 : clientX
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      split_left.resize(leftWidth, winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  $(window).mouseup(e => {
    if (codesProps.resizing) {
      codesProps.resizing = false;
      clientX = e.clientX > window.innerWidth - 4 ? window.innerWidth - 4 : e.clientX;
      clientX = clientX < 4 ? 4 : clientX
      const winHieght = window.innerHeight, leftWidth = codesProps.width + (clientX - codesProps.x);
      split_left.resize(leftWidth, winHieght);
      split_right.resize(window.innerWidth - leftWidth, winHieght);
    }
  });

  $(window).on("resize", e => {
    var height = window.innerHeight;
    split_left.resize(split_left.width(), height); //expand
    split_right.resize(window.innerWidth - split_left.width(), height); //resize
  });
}

function Canvas(container, events) {
  var update = false;
  var dragPosition = [0, 0], zooming = 1, dragable = false;
  var lastPosition = null;
  var graphicsProcess;
  var events = {};

  var sketch = new p5(function (sketch) {
    sketch.setup = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 60;
      sketch.resizeCanvas(window.innerWidth, h);
      sketch.background(255);

      graphicsProcess = new GraphicsProcess(sketch.createGraphics(window.innerWidth, h));

      rerenderingCanvas();
    }

    sketch.draw = () => {
      if (update) {
        update = false;
        rerenderingCanvas()
      }

      if (dragable && lastPosition && sketch.mouseIsPressed && sketch.mouseX > 5 && sketch.mouseButton == sketch.LEFT) {
        dragPosition[0] += (sketch.mouseX - lastPosition[0]);
        dragPosition[1] += (sketch.mouseY - lastPosition[1]);
        lastPosition = [sketch.mouseX, sketch.mouseY];
        update = true;
      } else if (lastPosition) {
        lastPosition = null;
        update = true;
      }
    }

    sketch.mousePressed = () => {
      if (sketch.mouseX > 0 && sketch.mouseY > 0)
        lastPosition = [sketch.mouseX, sketch.mouseY];
    }
  }, container);

  this.getGraphicsProcess = function () {
    return graphicsProcess;
  }

  document.addEventListener("wheel", e => {
    if (!dragable) return;
    zooming += (e.deltaY) * -0.01;
    zooming = zooming < 0.1 ? 0.1 : zooming
    rerenderingCanvas();
  });

  function rerenderingCanvas() {
    try {
      sketch.background(getComputedStyle(document.body).getPropertyValue('--background-color'));
      sketch.stroke(getComputedStyle(document.body).getPropertyValue('--highlight-lines-color'));
    } catch (e) {

    }

    const padding = 15;
    for (let w = 1; w < sketch.width + (dragPosition[0] > 0 ? dragPosition[0] : 0) * 1; w += padding) {
      for (let h = 1; h < sketch.height + (dragPosition[1] < 0 ? dragPosition[1] : 0) * 1; h += padding) {
        sketch.point((w + dragPosition[0]), (h + dragPosition[1]));
      }
    }

    // console.log(this.graphicsProcess);
    var img = graphicsProcess.render(!!dragPosition)
    sketch.image(img, dragPosition[0], dragPosition[1], img.width * zooming, img.height * zooming);

    sketch.line(dragPosition[0] - 1, 0, dragPosition[0] - 1, sketch.height);
    sketch.line(0, dragPosition[1] - 1, sketch.width, dragPosition[1] - 1);

    var posDisplay = "";

    if (dragable) {
      posDisplay = String(Math.round(zooming * 100)) + "% (" + dragPosition[0] + ", " + dragPosition[1] + ")";
    }else{
      // posDisplay = "[View mode]"
    }

    
    sketch.textSize(16);
    sketch.fill(100);
    sketch.textFont("monospace");
    sketch.text(posDisplay, sketch.width - sketch.textWidth(posDisplay) - 16, sketch.height - 16);

    console.log("rerendering...")
    console.log({
      width: sketch.width
    });

    // sketch.canvas.getContext("2d").drawImage(graphicsProcess.render(),0,0);
  }

  this.resize = function (width, height, dontRedraw) {
    sketch.resizeCanvas(width, height - 60);
    // graphicsProcess.canvas.resizeCanvas(width,height)
    $("#canvasContainer").css("marginLeft", window.innerWidth - width)
    if (!dontRedraw) update = true;
  }

  this.exec = (feedback) => {
    feedback.bind(sketch)();
  }

  this.sketch = sketch;
  this.rerenderingCanvas = () => {
    update = true;
  }

  this.setDragable = (bool) => {
    dragable = Boolean(bool);

    if (!dragable) {
      dragPosition = [0, 0], zooming = 1;
    }

    this.rerenderingCanvas();
  }
}

function Codes(dom, id, config) {
  var codeMirror = CodeMirror.fromTextArea(document.querySelector("#code_edit"), config);
  codeMirror.setSize(0, window.innerHeight - 60 - 100);

  $("#runScript").click(function () {
    console.log(codeMirror.getValue());

    window.canvas.rerenderingCanvas();

    console.time("parser process");
    var lisp = new LispRuntime(commonLib);
    lisp.forceRun(lisp.parse(codeMirror.getValue()));
    console.timeEnd("parser process");
  });

  this.resize = function (width, height) {
    $(".CodeMirror").width(width);

    if (width > 80) {
      $("#runScript").removeClass("hide");
    } else {
      $("#runScript").addClass("hide");
    }
  }

  this.width = function () {
    return $(".CodeMirror").width();
  }
}

function OptionBar(dom, targetButton) {
  targetButton.click(toggle);
  $("#closeOptionBar").click(toggle)

  function toggle() {
    if (dom.hasClass("hide")) {
      dom.removeClass("hide");
    } else {
      dom.addClass("hide");
    }
  }

  var topOptions = new TopOptions("#top_optoins")

  function TopOptions(el, options) {
    var vueContainer = new Vue({
      el,
      data: {
        options: [
          {
            type: "button",
            icon: "code",
            title: "Toogle Commander",
          },
          {
            type: "button",
            icon: "visibility",
            title: "View mode",
            onclick: () => {
              window.canvas.setDragable(false);
            }
          },
          {
            type: "button",
            icon: "open_with",
            title: "Move plant",
            onclick: () => {
              window.canvas.setDragable(true);
            }
          },
          {
            type: "slide"
          },
          {
            type: "button",
            icon: "help_outline",
            title: "Help",
            onclick:() =>{
              window.open("https://sites.google.com/view/power-editing")
            }
          }
        ]
      },
      mounted: () => {
        // vueContainer.options = options
      }
    })
  }
}

function MenuContainer(dom, listDomQuery, targetButton) {
  dom.hide();
  targetButton.click(e => {
    dom.fadeIn(200);
    $(".menu-div").removeClass("hide");
  });
  $(".menu-background").click(e => {
    $(".menu-div").addClass("hide");
    dom.fadeOut(200);
  });

  var menuLists = new Vue({
    el: listDomQuery,
    data: {
      list: [1, 2, 3]
    }
  })
}

function VariableForm(el){
  var vueCom = new Vue({
    el,
    data:{
      show: false
    }
  })
}