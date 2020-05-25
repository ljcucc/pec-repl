var onload = (()=>{

  const ShellInput = document.querySelector(".shell-input");
  const shellContent = document.querySelector(".shell");

  loadLibraries();

  ShellInput.addEventListener("keydown",(e)=>{
    if(e.key != "Enter") return; // If enter then run
    var commandString = ShellInput.value;

    if(commandString.trim() == "") return;
    ShellInput.value = "";

    runCommand(commandString);
  });

  function runCommand(command){
    shellContent.innerHTML += `<div class="result"> > ${command} <br> </div>`
    window.scrollTo(0, shellContent.offsetHeight); //ajuest psotion of scrolling

    var parsed = parenthesize(tokenize(command));
    var compiled_code = run_lisp(parsed);
    try{
      eval(compiled_code);
    }catch(e){
      shellContent.innerHTML += `<div class="result error"> ${e.name} </div>`
    }
  }

  function loadLibraries(){
    _get("./os.json", (result)=>{
      result = JSON.parse(result);
      console.log(result);
      add_gfunc(result);
    });
  }

  function _get(url, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", ()=>{
      callback(xmlHttp.responseText);
    });
    xmlHttp.open("GET", "./basic.json",  true);
    xmlHttp.send(null);

    console.log(xmlHttp);
  }

  function clear(){
    shellContent.innerHTML = "";
  }

  function print(msg){
        shellContent.innerHTML += `<div class="result"> ${msg} <br> </div>`
  }

  window.loadLibraries = loadLibraries;
  window.shell = {
    clear: ()=> clear(),
    print: (msg)=> print(msg)
  };

  onload = "you can;t access it."; //clean function object
})

window.addEventListener("load",onload);
