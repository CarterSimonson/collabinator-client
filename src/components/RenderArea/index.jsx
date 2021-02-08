import React, { useCallback } from "react";
import "./RenderArea.scss";

const RenderArea = (props) => {
    const { lines, currentLine } = props;

    const getLinePath = useCallback((line) => {
        return `M ${line.startX} ${line.startY} L ${line.endX} ${line.endY}`;
    }, []);

    return <div className="render-area">
        <svg>
            {
                lines.map((line) => {
                    return line.map((lineSection) => {
                        return <path key={getLinePath(lineSection)} stroke={lineSection.color} d={getLinePath(lineSection)} strokeWidth={lineSection.size} strokeLinecap="round"/>
                    });
                })
            }

            {
                currentLine.map((lineSection) => {
                    return <path key={getLinePath(lineSection)} stroke={lineSection.color} d={getLinePath(lineSection)} strokeWidth={lineSection.size} strokeLinecap="round"/>
                })
            }
        </svg>
    </div>
}

export default RenderArea;