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
  window.resizeHandle = resizeHandle;

  var optionBar = new OptionBar($(".options_bar"), $("#expand_option_bar"));
  var menuContainer = new MenuContainer($("#menuContainer"), ".menu-div", $("#nav-bar-menu"));
  var variableForm = new VariableForm("#variable-form");
})();