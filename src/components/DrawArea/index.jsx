import React, { useState } from "react";
import "./DrawArea.scss";
import { drawLineSection, clearCanvas } from "util/drawUtil";
import useStore from "store";
import useCanvas from "hooks/useCanvas";
import useDrawCursor from "hooks/useDrawCursor";

const DrawArea = (props) => {
    const { width, height, pushInteraction } = props;

    const [canvasRef, canvas, context] = useCanvas();
    const [cursor] = useDrawCursor();

    const [lastCoords, setLastCoords] = useState(null);
    
    const currentInteraction = useStore(state => state.currentInteraction);
    const startNewLine = useStore(state => state.startNewLine);
    const addToCurrentLine = useStore(state => state.addToCurrentLine);
    const completeNewLine = useStore(state => state.completeNewLine);

    //Events
    const pointerDown = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        context.beginPath();

        const x = Math.floor(event.clientX);
        const y = Math.floor(event.clientY);

        startNewLine([x, y]);
        setLastCoords([x, y]);
    }

    const pointerMove = (event) => {
        const { clientX: x, clientY: y, pressure } = event;

        if(lastCoords && pressure > 0) {
            const node = [x, y];

            addToCurrentLine(node);
            drawLineSection(context, lastCoords, node, currentInteraction.size, currentInteraction.color);
            setLastCoords(node);
        }
    }

    const pointerUp = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        //Push latest interaction to server
        pushInteraction(currentInteraction);
        setLastCoords(null);
        clearCanvas(canvas, context);
        completeNewLine();
    }

    return <>
        {/* draw-canvas canvas acts as the interaction layer and is clientside only. Drawing, dragging, etc happens here */}
        <canvas
            className="draw-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerMove={pointerMove}
            style={{ width, height, cursor }}
        />
    </>
}

export default DrawArea;