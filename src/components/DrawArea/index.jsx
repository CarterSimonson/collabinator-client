import React, { useEffect, useState } from "react";
import "./DrawArea.scss";
import useStore from "store";
import useCanvas from "hooks/useCanvas";
import useSession from "hooks/useSession";

const drawLineSection = (context, startNode, endNode, size, color) => {
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

const drawLine = (context, nodes, size, color) => {    
    context.beginPath();
    for(let i = 1; i < nodes.length; i++) {
        const startNode = nodes[i - 1];
        const endNode = nodes[i];
        drawLineSection(context, startNode, endNode, size, color);
    }
}

const DrawArea = (props) => {
    const { width, height } = props;
    const [newInteraction, addInteraction] = useSession();

    const [canvasRef, canvas, context] = useCanvas();
    const [lastCoords, setLastCoords] = useState(null);
    
    const history = useStore(state => state.history);
    const addToHistory = useStore(state => state.addToHistory);
    const currentLine = useStore(state => state.currentLine);
    const startCurrentLine = useStore(state => state.startCurrentLine);
    const addToCurrentLine = useStore(state => state.addToCurrentLine);
    const clearCurrentLine = useStore(state => state.clearCurrentLine);

    //Helper functions

    const getCanvasData = () => {
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }

    //Events
    const pointerDown = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        context.beginPath();

        const { clientX: x, clientY: y } = event;
        startCurrentLine();
        setLastCoords({ x, y });
    }

    const pointerMove = (event) => {
        const { clientX: x, clientY: y, pressure } = event;

        if(lastCoords && pressure > 0) {
            const node = { x, y };

            addToCurrentLine(node);
            drawLineSection(context, lastCoords, node, currentLine.size, currentLine.color);
            setLastCoords(node);
        }
    }

    const pointerUp = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        const canvasData = getCanvasData();

        addInteraction(currentLine);
        clearCurrentLine();
        setLastCoords(null);
        addToHistory(canvasData);
    }

    useEffect(() => {
        if(!context || !canvas) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        if(history.length === 0) {
            return;
        }

        const currentInstance = history[history.length - 1];
        context.putImageData(currentInstance, 0, 0);
    }, [context, canvas, history]);

    useEffect(() => {
        if(!context || !newInteraction) { 
            return;
        }

        const { color, nodes, size } = newInteraction.data;
        drawLine(context, nodes, size, color);
    }, [newInteraction, context]);

    return <>
        <canvas
            className="draw-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerMove={pointerMove}
        />
    </>
}

export default DrawArea;