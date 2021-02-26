import React, { useEffect } from "react";
import "./QueueArea.scss";
import { drawLine, clearCanvas } from "shared/util/drawUtil";
import useStore from "store";
import useCanvas from "shared/hooks/useCanvas";

const QueueArea = (props) => {
    const { width, height } = props;

    const [canvasRef, canvas, context] = useCanvas();
    const userInteractions = useStore(state => state.userInteractions);

    //Re-render for each interaction in the queue (awaiting response from server)
    useEffect(() => {
        if(!canvas || !context) {
            return;
        }

        clearCanvas(canvas, context);

        for(const interaction of userInteractions) {
            const { color, size, nodes } = interaction;
            drawLine(context, color, size, nodes);
        }
    }, [canvas, context, userInteractions]);

    return <>
        {/* queue-canvas canvas acts as a buffer layer, rendering interactions that are not confirmed to be on the server yet */}
        <canvas
            className="queue-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width, height }}
        />
    </>
}

export default QueueArea;