function GraphicsProcess(canvas) {
    // console.log(this.canvas);

    this.canvas = canvas;

    this.render = () => {
        return canvas;
    }

    var positionCount = 0;
    this.write = (text) => {
        positionCount += 14;
        canvas.textSize(14);
        canvas.textFont("monospace")
        canvas.text(String(text), 0, positionCount);
    }

    this.image = (source, x, y, scale) => {
        var img = new Image();
        img.onload = ()=>{
            canvas.canvas.getContext("2d").drawImage(img, x, y, img.width * scale, img.height * scale);
            window.canvas.rerenderingCanvas();
        };
        img.src = String(source);
        console.log("Image loader setuped");
    }

    this.reset = () => {
        canvas.clear();
        positionCount = 0;
    }
}