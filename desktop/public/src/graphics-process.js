function GraphicsProcess(canvas){
    console.log(this.canvas);

    this.canvas = canvas;

    var writer;

    init();
         
    this.render = ()=>{
        canvas.clear();

        writer.render();

        return canvas;
    }

    this.write = (text)=>{
        writer.write(text);
        togglerRendering();
    }

    this.reset = ()=>{
        init();
    }

    function Writer(canvas){
        this.writeContents = [];
        this.write = (text)=>{
            this.writeContents.push(text);
            togglerRendering();
        }

        this.render = ()=>{
            for(var i in this.writeContents){
                var item = this.writeContents[i];
                canvas.textSize(14);
                canvas.textFont("monospace")
                canvas.text(String(item), 0 , (Number(i)+1) * 14);
            }
        }
    }

    function togglerRendering(){
        window.canvas.rerenderingCanvas();
    }

    function init(){
        writer = new Writer(canvas);
    }
}