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
  });

  function toggleCodeEditor() {
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
  }

  if (desktopProcess) {
    ipcRenderer.on("code-editor-toggle", e => {
      toggleCodeEditor();
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

  this.toggleCodeEditor = toggleCodeEditor;

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

function Canvas(container, onload) {
  var update = false;
  var dragPosition = [0, 0], zooming = 1, dragable = false;
  var lastPosition = null;
  var graphicsProcess;

  var sketch = new p5(function (sketch) {
    sketch.setup = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 60;
      sketch.resizeCanvas(window.innerWidth, h);
      sketch.background(255);

      graphicsProcess = new GraphicsProcess(sketch.createGraphics(window.innerWidth, h));

      rerenderingCanvas();

      onload(sketch);
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

    // console.log(sketch.width)

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
    } else {
      // posDisplay = "[View mode]"
    }


    sketch.textSize(16);
    sketch.fill(100);
    sketch.textFont("monospace");
    sketch.text(posDisplay, sketch.width - sketch.textWidth(posDisplay) - 16, sketch.height - 16);

    // console.log("rerendering...")
    // console.log({
    //   width: sketch.width
    // });

    // sketch.canvas.getContext("2d").drawImage(graphicsProcess.render(),0,0);
  }

  this.resize = function (width, height, dontRedraw) {
    // console.log(width);
    sketch.resizeCanvas(width - 24, height - 60);
    // graphicsProcess.canvas.resizeCanvas(width,height)
    // $("#canvasContainer").css("marginLeft", window.innerWidth - width)
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
  codeMirror.setSize(0, window.innerHeight - 60);

  $("#runScript").click(function () {
    console.log(codeMirror.getValue());

    window.canvas.rerenderingCanvas();

    console.time("parser process");
    var lisp = new LispRuntime(Object.assign({}, commonLib));
    lisp.forceRun(lisp.parse(codeMirror.getValue()));
    console.timeEnd("parser process");
  });

  this.resize = function (width, height) {
    $(".CodeMirror").width(width);

    if (width > 80) {
      $("#runScript").removeClass("hide");
      //Commander opened
      for (var index in commanderOpenCallbacks) {
        commanderOpenCallbacks[index]();
      }
    } else {
      $("#runScript").addClass("hide");
      for (var index in commanderCloseCallbacks) {
        commanderCloseCallbacks[index]();
      }
    }
  }

  this.width = function () {
    return $(".CodeMirror").width();
  }

  this.get = function () {
    return codeMirror.getValue();
  }

  this.set = function (code) {
    return codeMirror.setValue(code);
  }

  var commanderOpenCallbacks = [],
    commanderCloseCallbacks = [];

  this.onCommanderOpen = (callback) => {
    commanderOpenCallbacks.push(callback);
  }

  this.onCommanderClose = (callback) => {
    commanderCloseCallbacks.push(callback);
  }
}

function OptionBar(dom, targetButton, optionAdapter) {
  var openingAnimation = false;
  targetButton.click(toggle).mouseover(e => {
    if (!desktopProcess) return;
    if (openingAnimation) return;
    openingAnimation = true;
    setTimeout(() => {
      openingAnimation = false;
    }, 300);
    console.log("over!!")
    setState(true);
  })
  $(".options_bar").mouseleave(e => {
    if (!desktopProcess) return;
    if (openingAnimation) return;
    openingAnimation = true;
    setTimeout(() => {
      openingAnimation = false;
    }, 500);
    console.log("options_bar mouseout")
    setState(false)
  })
  $("#closeOptionBar").click(toggle)

  function toggle() {
    // console.log("toggling option bar")
    if (dom.hasClass("hide")) {
      dom.removeClass("hide");
    } else {
      dom.addClass("hide");
    }
  }

  function setState(state) {
    if (state) {
      dom.removeClass("hide");
    } else {
      dom.addClass("hide");
    }
  }

  var topOptions = new TopOptions("#top_optoins"),
    commandList = new CommandList("#command_list")

  function TopOptions(el, options) {
    var vueContainer = new Vue({
      el,
      data: {
        options: optionAdapter()
      },
      mounted: () => {
        // vueContainer.options = options
      }
    })
  }

  function CommandList(el) {
    var vueContainer = new Vue({
      el,
      data: {},
      mounted: () => {
        keyboardInit()
      }
    });

    function keyboardInit() {
      var laststate = false;
      window.addEventListener("keydown", e => {
        if (laststate || !e.altKey) return;
        laststate = true
        console.log(e)
        setState(true)
      })

      window.addEventListener("keyup", e => {
        if (!laststate || e.key != "Alt") return;
        laststate = false
        console.log(e)
        setState(false)
      })
    }
  }
}

function MenuContainer(dom, listDomQuery, targetButton, menuItems, callback) {
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
      list: menuItems
    },
    methods: {
      open: (index) => {
        callback(menuLists.list[index].id);
        $(".menu-div").addClass("hide");
        dom.fadeOut(200);
      }
    }
  })
}

function OpenFileDialog(el, load, callback) {
  var app = new Vue({
    el,
    data: {
      title: "Select a file to",
      scripts: [
        "filename.lisp"
      ],
      show: false
    },
    mounted: reload,
    methods: {
      open: (index) => {
        callback(app.scripts[index]);
        app.show = false
      }
    }
  });

  this.open = (action_name) => {
    app.title = "Select a file to " + action_name + "..."
    app.show = true;
  }

  this.reload = () => {
    reload();
  }

  async function reload() {
    var result = await load();
    console.log(result);
    var filelist = [];
    for (var key in result) {
      filelist.push({
        val: result[key],
        id: key
      });
    }
    console.log(filelist)
    app.scripts = filelist;
  }
}

function FilenameBox(el, callback) {
  var app = new Vue({
    el,
    data: {
      edit: false,
      filename: "untitled"
    },
    updated: () => {
      callback(app.filename)
    }
  });

  this.getName = () => {
    return app.filename;
  }

  this.setName = (name) => {
    app.filename = name;
  }
}

function DialogForm(el, title, options) {
  var vueCom = new Vue({
    el,
    data: {
      show: false,
      title,
      options
    }
  });

  this.set = function (title, options) {
    vueCom.title = title
    vueCom.options = options
  }

  this.show = () => {
    vueCom.show = true
  }
}

function ShellUI() {
  this.setAppearState = (state) => {
    // vueCom.shell_appear = state;
    if (state) {
      if ($(".shell").css("margin-bottom") == "-100px") $(".shell").css({ "margin-bottom": 0 })
      // vueCom.shell_appear = true
    } else {
      hide(true)
      // recycle()
    }
  }

  const commands = [
    {
      title: "select rect",
      icon: "crop_free",
      command: "(rect $x $y $width $height)",
      parameter: ["$x", "$y", "$width", "$height"]
    },
    {
      title: "select circle",
      icon: "crop_free",
      command: "(rect $x $y $width $height)",
      parameter: ["$x", "$y", "$width", "$height"]
    },
    {
      title: "select with draw",
      icon: "crop_free",
      command: "(rect $x $y $width $height)",
      parameter: ["$x", "$y", "$width", "$height"]
    }
  ];

  var open_commands = () => {
    console.log("button clicked")
    setCommandListAppearState($(".commands").hasClass("show"))
    update_list()
  }
  var update_list = (appear) => {
    if ($(".shell-input").val().trim() == "") {
      if (appear) setCommandListAppearState(true);
      displayCommands(commands)
    } else {
      if (appear) setCommandListAppearState(false);
      var c = commands.filter(command => command.title.indexOf($(".shell-input").val().trim()) > -1).sort((a, b) =>
        a.title.indexOf($(".shell-input").val().trim()) - b.title.indexOf($(".shell-input").val().trim()))
      displayCommands(c)
    }
  }
  function hide(full_hide) {
    if (full_hide) {
      $(".shell").css({ "margin-bottom": -100 })

      console.log("full hide");
    }

    if ($(".shell_launcher_icon").html().trim() == "trip_origin") return;
    $(".commands").removeClass("show");
    // $(".shell-background").fadeOut(300);
    backgroundAppear(false);
    if ($(".shell_launcher_icon").html().trim() == "arrow_back") $(".shell_launcher_icon").html("trip_origin");
  }
  function setCommandListAppearState(state) {
    console.log("setCommandListAppearState(" + String(state) + ")")
    if (state) { //$(".commands").hasClass("show")
      if (!$(".commands").hasClass("show")) return;
      console.log("closing commands")
      setTimeout(() => {
        hide()
      }, 1);

    } else {
      if ($(".commands").hasClass("show")) return;
      console.log("opening commands")
      setTimeout(() => {
        $(".commands").addClass("show");
        // $(".shell-background").fadeIn(300);
        backgroundAppear(true);
        $(".shell_launcher_icon").html("arrow_back")
      }, 1);
    }
  }

  const template = `
    <button class="menu-div-row__item">
      <i class="material-icons" style="font-size: 30px;">{{icon}}</i><br>
      {{title}}
    </button>
  `;

  function displayCommands(commands) {
    var resultHtml = ""
    for (var index in commands) {
      var command = commands[index];
      resultHtml += template.replace("{{title}}",command.title).replace("{{icon}}",command.icon)
    }
    $("#command_list").html(resultHtml)
  }

  function backgroundAppear(state){
    const shellBackground = $(".shell-background")
    if(state){
      shellBackground.css({
        display: "",
        opacity: 0
      });
      setTimeout(()=>{
        shellBackground.css({
          opacity: 1
        })
      },10);
      
    }else{
      shellBackground.css({
        display: "",
        opacity: 0
      });
      setTimeout(()=>{
        shellBackground.css({
          display:"none"
        })
      },300);
    }
  }

  (() => {
    $(".shell-background").mousedown(() => {
      // hide()
      console.log("hiding...")
      setCommandListAppearState(true)
    });
    $("#open_commands_btn").click(() => {
      open_commands()
    });
    $(".shell-input").on("input", e => {
      console.log($(".shell-input").val())
      update_list(true)
    })
  })();
}