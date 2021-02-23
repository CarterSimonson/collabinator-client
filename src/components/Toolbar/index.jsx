import React from "react";
import "./Toolbar.scss";
import useStore from "store";
import IconButton from "components/IconButton";
import ColorButton from "components/ColorButton";

const COLORS = [
    "#000000", // black
    "#1f73b7", // blue
    "#038153", // green
    "#cc3340", // red
    "#ed8f1c", // yellow
];

const Toolbar = () => {
    const undo = () => {};
    const redo = () => {};

    return <div className="toolbar">
        <div className="section">
            {
                COLORS.map(color => <ColorButton color={color}/>)
            }
        </div>

        <div className="section">
            <IconButton onClick={undo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.885 3.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.073.1 4.341 4.341 1.737 12.291-5.491 12.291v4.8c3.708 0 6.614-1.244 8.885-3.515 4.686-4.686 4.686-12.284 0-16.97z"/></svg>
            </IconButton>
            <IconButton onClick={redo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.115 3.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.82-2.706-7.297-2.676-10.073.1-4.341 4.341-1.737 12.291 5.491 12.291v4.8c-3.708 0-6.614-1.244-8.885-3.515-4.686-4.686-4.686-12.284 0-16.97z"/></svg>
            </IconButton>
        </div>
    </div>
}

export default Toolbar;