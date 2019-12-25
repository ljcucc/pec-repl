function GraphicsProcess(canvas) {
    // console.log(this.canvas);

    var canvasPool = [], writer = new Writer(canvas);
    // var renderCanvas = canvas.createGraphics(canvas.width, canvas.height);
    // canvasPool.push(new Writer(canvas));

    this.canvas = canvas;

    this.render = () => {
        canvas.clear();
        for(var index in canvasPool){
            canvasPool[index].render();
        }
        
        writer.render();

        return canvas;
    }

    function Writer(canvas) {
        this.texts = [];

        this.render = () => {
            console.log("text renderering");
            console.log(this.texts);
            var pos = 0;
            for (var index in this.texts) {
                var text = this.texts[index];
                pos += 14;
                canvas.textSize(14);
                canvas.textFont("monospace")
                canvas.text(String(text), 0, pos);
                console.log(text);
            }
        }

        this.write = (text) => {
            this.texts.push(text);
            console.log(this.texts);
            window.canvas.rerenderingCanvas();
        }
    }

    function Imager(source, x, y, scale) {
        var img = new Image();
        img.src = String(source);
        var loaded = false;

        this.render = () => {
            if(loaded)
                canvas.canvas.getContext("2d").drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        img.onload = () => {
            loaded = true;
            console.log("loading...")
            // canvas.canvas.getContext("2d").drawImage(img, x, y, img.width * scale, img.height * scale);
            window.canvas.rerenderingCanvas();
        }
    }

    this.write = (text) => {
        writer.write(text);
        console.log(text);
    }

    this.image = (source, x, y, scale) => {
        canvasPool.push(new Imager(source, x, y, scale));
        console.log("Image loader setuped");
    }

    this.reset = () => {
        canvasPool = [];
        writer.texts = [];
        window.canvas.rerenderingCanvas();
    }
}