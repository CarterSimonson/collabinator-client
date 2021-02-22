export const drawLineSection = (context, startNode, endNode, size, color) => {
    const { x: startX, y: startY } = startNode;
    const { x: endX, y: endY } = endNode;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = "round";

    const xC = (startX + endX) / 2;
    const yC = (startY + endY) / 2;
    context.quadraticCurveTo(startX, startY, xC, yC);

    context.stroke();
};

export const drawLine = (context, nodes, size, color) => {    
    context.beginPath();
    for(let i = 1; i < nodes.length; i++) {
        const startNode = nodes[i - 1];
        const endNode = nodes[i];
        drawLineSection(context, startNode, endNode, size, color);
    }
}

export const getCanvasData = (canvas, context) => {
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

export const clearCanvas = (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

export const getEncodedCanvasData = (canvas) => {
    return canvas.toDataURL("image/png");
}

export const pasteBase64 = (canvas, context, base64Image) => {
    const image = new Image();
    image.onload = () => {
        clearCanvas(canvas, context);
        context.drawImage(image, 0, 0);
    }
    image.src = base64Image;
}