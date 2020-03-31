// configures all the canvases

function resetCanvas(canvas) {
    var config = {
        fill:"white",
        stroke:"white"
    };
    canvas.width = canvas.offSetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.ctx = canvas.getContext("2d");
    canvas.ctx.fill = config.fill;
    canvas.ctx.stroke = config.stroke;
    canvas.ctx.clearRect(0,0,canvas.width,canvas.height);
    return canvas.ctx;
}
