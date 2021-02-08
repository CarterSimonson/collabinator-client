import React, { useRef, useState } from "react";
import "./DrawArea.scss";
import RenderArea from "components/RenderArea";
import useStore from "store";

const BRUSH_SIZE = 20;

const DrawArea = (props) => {
    const { width, height } = props;
    const canvasRef = useRef(null);
    
    const [lastCoords, setLastCoords] = useState(null);
    
    const lines = useStore(state => state.lines);
    const addLine = useStore(state => state.addLine);
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

    //Events
    const pointerDown = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        const { clientX: x, clientY: y } = event;

        setLastCoords({ x, y });
    }

    const pointerMove = (event) => {
        const { clientX: x, clientY: y, pressure } = event;

        if(lastCoords && pressure > 0) {
            const brushSize = calculateBrushSize(pressure);

            const stroke = {
                startX: lastCoords.x,
                startY: lastCoords.y,
                endX: x,
                endY: y,
                size: brushSize,
                color: currentColor
            }

            addToCurrentLine(stroke);
            setLastCoords({ x, y });
        }
    }

    const pointerUp = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        setLastCoords(null);
        addLine(currentLine);
        clearCurrentLine();
    }

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
        <RenderArea lines={lines} currentLine={currentLine}/>
    </>
}

export default DrawArea;