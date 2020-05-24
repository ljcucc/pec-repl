var onload = (()=>{

  const ShellInput = document.querySelector(".shell-input");
  const shellContent = document.querySelector(".shell");

  ShellInput.addEventListener("keydown",(e)=>{
    if(e.key != "Enter") return; // If enter then run
    var commandString = ShellInput.value;

    if(commandString.trim() == "") return;
    ShellInput.value = "";

    runCommand(commandString);
  });

  function runCommand(command){
    shellContent.innerHTML += `<div class="result"> ${command} <br> </div>`
    window.scrollTo(0, shellContent.offsetHeight); //ajuest psotion of scrolling

    var parsed = parenthesize(tokenize(command));
  }

  function loadLibraries(){
    _get("./os.json", (result)=>{
      console.log(result);
    });
  }

  function _get(url, callback){
    var xmlHTTP = new XMLHTTPRequest();
    xmlHTTP.onreadystatechage = ()=>{
      if(xmlHttp.readyState == 4 && xmlHttp.state == 200)
        callback(xmlHttp.resonseText);
    }
    xmlHttp.open("GET", "./os.json",  true);
    xmlHttp.send(null);
  }

  window.loadLibraries = loadLibraries;

  onload = "you can;t access it."; //clean function object
})

window.addEventListener("load",onload);
