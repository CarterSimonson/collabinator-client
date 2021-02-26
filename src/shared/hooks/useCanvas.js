import { useEffect, useRef, useState } from "react";

const useCanvas = (fillColor) => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [context, setContext] = useState(null);

    useEffect(() => {
        if(!canvasRef) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvasRef.current.getContext("2d");
        setCanvas(canvas);
        setContext(context);
    }, [canvasRef]);

    return [canvasRef, canvas, context];
}

export default useCanvas;