import React, { useEffect } from "react";
import "./RenderArea.scss";
import { drawLine, clearCanvas } from "util/drawUtil";
import useCanvas from "hooks/useCanvas";
import useStore from "store";

const RenderArea = (props) => {
    const { width, height } = props;

    const [canvasRef, canvas, context] = useCanvas("white");
    const session = useStore(state => state.session);

    //Re-render when the session's interaction array is updated
    useEffect(() => {
        if(!canvas || !context || !session) {
            return;
        }

        clearCanvas(canvas, context);

        const interactions = session.interactions;

        for(const interaction of interactions) {
            const { color, size, nodes } = interaction.data;
            drawLine(context, color, size, nodes);
        }
    }, [canvas, context, session]);

    return <>
        {/* render-canvas canvas acts as the display layer and renders the latest snapshot from the server */}
        <canvas
            className="render-canvas"
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width, height }}
        />
    </>
}

export default RenderArea;