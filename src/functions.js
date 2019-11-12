var functions = {
  "$msgbox":{
    type:"function",
    setup:(code,e)=>{
      console.log("setup!");
      console.log(code.value);
      // console.log(e.env.getValues(code.value));
    },
    run:(code,e)=>{
      console.log("run!");
      console.log(e.env.getValues(code.value));
      alert(e.env.getValues(code.value)[1].value);
      return {
        feedback:"print is runned"
      }
    }
  },
  "$input":{
    type:"function",
    setup:(code,e)=>{

    },
    run:()=>{
      return {
        feedback: prompt("input a number")
      }
    }
  },
  "$rect":{
    type:"function",
    setup:(code, e)=>{

    },
    run:()=>{
      // var e.env.
    }
  },
  "$var":{
    type:"function",
    setup:(code, e)=>{
      console.log(code);
    },
    run:(code ,e)=>{
      return  {
        feedback: ""
      }
    }
  }
};