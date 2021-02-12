import React, { useEffect, useRef, useState } from "react";
import "./DrawArea.scss";
import useStore from "store";

const BRUSH_SIZE = 20;

const DrawArea = (props) => {
    const { width, height } = props;
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [context, setContext] = useState(null);
    
    const [lastCoords, setLastCoords] = useState(null);
    
    const history = useStore(state => state.history);
    const addToHistory = useStore(state => state.addToHistory);
    const currentLine = useStore(state => state.currentLine);
    const addToCurrentLine = useStore(state => state.addToCurrentLine);
    const clearCurrentLine = useStore(state => state.clearCurrentLine);
    const currentColor = useStore(state => state.color);

    //Helper functions
    const calculateBrushSize = (pressure) => {
        const calculatedSize = pressure * BRUSH_SIZE;
        
        if(currentLine.length > 0) {
            const lastSize = currentLine[currentLine.length - 1].size;
            const weightedSize = (lastSize * 4 + calculatedSize) / 5;
            return weightedSize;
        }
        else {
            return calculatedSize;
        }
    }

    const drawLine = (stroke) => {
        const { x: endX, y: endY, size, color } = stroke;
        const startX = lastCoords.x;
        const startY = lastCoords.y;

        context.strokeStyle = color;
        context.lineWidth = size;
        context.lineCap = "round";

        const xC = (startX + endX) / 2;
        const yC = (startY + endY) / 2;
        context.quadraticCurveTo(startX, startY, xC, yC);

        context.stroke();
    };

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
        setLastCoords({ x, y });
    }

    const pointerMove = (event) => {
        const { clientX: x, clientY: y, pressure } = event;

        if(lastCoords && pressure > 0) {
            const brushSize = calculateBrushSize(pressure);

            const stroke = {
                x,
                y,
                size: brushSize,
                color: currentColor
            }

            addToCurrentLine(stroke);
            drawLine(stroke);
            setLastCoords({ x, y });
        }
    }

    const pointerUp = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        const canvasData = getCanvasData();

        clearCurrentLine();
        setLastCoords(null);
        addToHistory(canvasData);
    }

    useEffect(() => {
        if(!canvasRef) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvasRef.current.getContext("2d");
        setCanvas(canvas);
        setContext(context);
    }, [canvasRef]);

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