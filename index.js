window.addEventListener("load",(()=>{

  const ShellInput = document.querySelector(".shell-input");
  const shellContent = document.querySelector(".shell");

  ShellInput.addEventListener("keydown",(e)=>{
    if(e.key != "Enter") return; // If enter then run
    var commandString = ShellInput.value;
    ShellInput.value = "";

    runCommand(commandString);
  });

  function runCommand(command){
    shellContent.innerHTML += `${command} <br>`

    console.log(shellContent.offsetHeight);

    window.scrollTo(0, shellContent.offsetHeight);
  }

}));
