export const drawLineSection = (context, startNode, endNode, size, color) => {
    const [startX, startY] = startNode;
    const [endX, endY]= endNode;

    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = "round";

    const xC = (startX + endX) / 2;
    const yC = (startY + endY) / 2;
    context.quadraticCurveTo(startX, startY, xC, yC);

    context.stroke();
};

export const drawLine = (context, color, size, nodes) => {
    if(nodes.length === 0) {
        return;
    }
    
    const path = new Path2D();
    
    const firstNode = nodes[0];
    const [startX, startY] = firstNode;
    path.moveTo(startX, startY);

    for(let i = 1; i < nodes.length; i++) {
        const startNode = nodes[i - 1];
        const endNode = nodes[i];

        const [startX, startY] = startNode;
        const [endX, endY] = endNode;

        const xC = (startX + endX) / 2;
        const yC = (startY + endY) / 2;
        path.quadraticCurveTo(startX, startY, xC, yC);
    }

    //Setup line styling and stroke
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = "round";
    context.stroke(path);
}

export const clearCanvas = (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// export const getCanvasData = (canvas, context) => {
//     return context.getImageData(0, 0, canvas.width, canvas.height);
// }

// export const getEncodedCanvasData = (canvas) => {
//     return canvas.toDataURL("image/png");
// }

// export const pasteBase64 = (canvas, context, base64Image) => {
//     const image = new Image();
//     image.onload = () => {
//         clearCanvas(canvas, context);
//         context.drawImage(image, 0, 0);
//     }
//     image.src = base64Image;
// }