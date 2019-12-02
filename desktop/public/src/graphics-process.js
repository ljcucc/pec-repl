function GraphicsProcess(canvas){
    console.log(this.canvas);

    this.canvas = canvas
         
    this.render = ()=>{
        canvas.clear();
        canvas.rect(10,10,100,200);
        return canvas;
    }
}