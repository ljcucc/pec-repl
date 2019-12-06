function GraphicsProcess(canvas){
    console.log(this.canvas);

    this.canvas = canvas;
         
    this.render = ()=>{
        canvas.clear();

        for(var i in writeContents){
            var item = writeContents[i];
            canvas.textSize(14);
            canvas.text(item, 0, i * 16);
        }

        return canvas;
    }

    var writeContents = [];

    this.write = (text)=>{
        writeContents.push(text);
        this.render();
    }
}