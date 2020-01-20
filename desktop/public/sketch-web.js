(() => {
  var file_id = uuidv4();
  var openDialogState = "open";

  window.canvas = new Canvas(document.querySelector("#canvasContainer"), () => {

  });
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
  window.resizeHandle = resizeHandle;

  var optionBar = new OptionBar($(".options_bar"), $("#expand_option_bar"), () => {
    return [
      {
        type: "button",
        icon: "code",
        title: "Toogle Commander",
        onclick: () => {
          window.resizeHandle.toggleCodeEditor();
        }
      },
      {
        type: "button",
        icon: "visibility",
        title: "View mode",
        desktop_only: true,
        onclick: () => {
          window.canvas.setDragable(false);
        }
      },
      {
        type: "button",
        icon: "open_with",
        title: "Move plant",
        desktop_only: true,
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
        onclick: () => {
          window.open("https://sites.google.com/view/power-editing")
        }
      }
    ]
  });
  var menuContainer = new MenuContainer($("#menuContainer"), ".menu-div", $("#nav-bar-menu"),
    [
      {
        icon: "folder_open",
        title: "Open",
        id: "open"
      },
      {
        icon: "description",
        title: "New",
        id: "new_script"
      },
      {
        icon: "save",
        title: "Save",
        id: "save"
      },
      {
        icon: "save",
        title: "Save as",
        id: "save_as"
      },
      {
        icon: "delete",
        title: "Delete",
        id: "delete"
      },
      {
        icon: "extension",
        title: "Plug-ins",
        id: "plugins"
      },
      {
        icon: "settings",
        title: "Settings",
        id: "settings"
      }
    ], e => {
      switch (e) {
        case "open":
          openDialogState = "open";
          openfileDialog.open("open");
          break;
        case "save":
          saveFile(file_id, codes.get());
          break;
        case "delete":
          openDialogState = "delete";
          openfileDialog.open("delete");
          break;
        case "new_script":
          setTimeout(() => {
            codes.set("");
          }, 300);
          break;
      }
    });
  var variableForm = new DialogForm("#variable-form");
  var openfileDialog = new OpenFileDialog("#open_file", async e => {
    var scripts = this.canvas.sketch.getItem("script_list") || {};
    console.log(scripts);
    return scripts;
  }, async e => {
    console.log(e);
    console.log(openDialogState);

    if (openDialogState == "open") {
      filenameBox.setName(e.val.title);
      file_id = e.id;
      codes.set(await this.canvas.sketch.getItem('script:' + file_id))
    } else {
      console.log("deleting...");
      deleteFile(file_id);
    }
  });

  var filenameBox = new FilenameBox("#filenameBox", async e => {
    var list = await this.canvas.sketch.getItem("script_list") || {};
    if (file_id in list) {
      list[file_id].title = e;
      this.canvas.sketch.storeItem('script_list', list);
      updateFileSelector();
    }
  });

  async function saveFile(id, code) {
    var list = await this.canvas.sketch.getItem("script_list") || {};
    if (id in list) {
      this.canvas.sketch.storeItem('script:' + id, code);
    } else {
      list[id] = {
        title: filenameBox.getName(),
        date: new Date()
      };
      this.canvas.sketch.storeItem('script:' + id, code);
      this.canvas.sketch.storeItem('script_list', list);
    }
    updateFileSelector();
  }

  async function deleteFile(id) {
    var list = await this.canvas.sketch.getItem("script_list") || {};
    if (id in list) {
      this.canvas.sketch.removeItem('script:' + id);
      list[id] = undefined;
      this.canvas.sketch.storeItem('script_list', list);
    }
    updateFileSelector();
  }

  function updateFileSelector() {
    openfileDialog.reload();
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
})();