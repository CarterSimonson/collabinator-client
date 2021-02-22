import React, { useEffect, useMemo, useState } from "react";
import "./DrawArea.scss";
import { drawLineSection, clearCanvas, getEncodedCanvasData, pasteBase64 } from "util/drawUtil";
import useStore from "store";
import useCanvas from "hooks/useCanvas";
import { ADD } from "constants/interactionActions";

const DrawArea = (props) => {
    const { width, height, session, addInteraction } = props;

    const history = useStore(state => state.history);
    const baseInteraction = useStore(state => state.baseInteraction);

    const [drawCanvasRef, drawCanvas, drawContext] = useCanvas();
    const [renderCanvasRef, renderCanvas, renderContext] = useCanvas("white");

    const [lastCoords, setLastCoords] = useState(null);
    
    const currentLine = useStore(state => state.currentLine);
    const startCurrentLine = useStore(state => state.startCurrentLine);
    const addToCurrentLine = useStore(state => state.addToCurrentLine);
    const clearCurrentLine = useStore(state => state.clearCurrentLine);

    //Events
    const pointerDown = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        drawContext.beginPath();

        const { clientX: x, clientY: y } = event;
        startCurrentLine();
        setLastCoords({ x, y });
    }

    const pointerMove = (event) => {
        const { clientX: x, clientY: y, pressure } = event;

        if(lastCoords && pressure > 0) {
            const node = { x, y };

            addToCurrentLine(node);
            drawLineSection(drawContext, lastCoords, node, currentLine.size, currentLine.color);
            setLastCoords(node);
        }
    }

    const pointerUp = (event) => {
        const { pointerType, button } = event;

        if (pointerType === "mouse" && button !== 0) {
            return;
        }

        //Apply the drawing layer to the rendering layer
        renderContext.drawImage(drawCanvas, 0, 0);
        clearCanvas(drawCanvas, drawContext);
        const encodedCanvasData = getEncodedCanvasData(renderCanvas);

        addInteraction(ADD, encodedCanvasData);
        clearCurrentLine();
        setLastCoords(null);
    }

    //Render the connected session's content once loaded
    useEffect(() => {
        if(!renderContext || !session || session.interactions.length === 0) { 
            return;
        }

        const latestInteraction = session.interactions[session.interactions.length - 1];
        const { data: base64Image } = latestInteraction;
        pasteBase64(renderCanvas, renderContext, base64Image);
    }, [session, renderCanvas, renderContext]);

    //Render all new interactions added to history
    useEffect(() => {
        if(!renderContext || !history) { 
            return;
        }

        let latestInteraction;
        if(history.length === 0 && !baseInteraction) {
            clearCanvas(renderCanvas, renderContext);
            return;
        }
        else if(history.length === 0 && !!baseInteraction) {
            latestInteraction = baseInteraction;
        }
        else {
            latestInteraction = history[history.length - 1];
        }

        const { data: base64Image } = latestInteraction;
        pasteBase64(renderCanvas, renderContext, base64Image);
    }, [history, baseInteraction, renderCanvas, renderContext]);

    const canvasSizing = useMemo(() => {
        return {
            width,
            height
        }
    }, [width, height]);

    return <>
        {/* draw-canvas canvas acts as the interaction layer and is clientside only. Drawing, dragging, etc happens here */}
        <canvas
            className="draw-canvas"
            ref={drawCanvasRef}
            width={width}
            height={height}
            onPointerDown={pointerDown}
            onPointerUp={pointerUp}
            onPointerMove={pointerMove}
            style={canvasSizing}
        />

        {/* render-canvas canvas acts as the display layer and renders the latest snapshot from the server */}
        <canvas
            className="render-canvas"
            ref={renderCanvasRef}
            width={width}
            height={height}
            style={canvasSizing}
        />
    </>
}

export default DrawArea;