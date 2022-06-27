import React from "react";
import "./Toolbar.scss";
import ColorButton from "shared/components/ColorButton";
import SizeSlider from "shared/components/SizeSlider";

const COLORS = [
    "#000000", // black
    "#1f73b7", // blue
    "#038153", // green
    "#cc3340", // red
    "#ed8f1c", // yellow
];

const Toolbar = () => {
    return <div className="toolbar">
        <div className="section">
            <SizeSlider/>
        </div>

        <div className="section">
            { COLORS.map(color => <ColorButton color={color}/>) }
        </div>
    </div>
}

export default Toolbar;