import React from "react";
import "./SizeSlider.scss";
import useStore from "store";

const ColorButton = (props) => {
    const size = useStore(state => state.size);
    const setSize = useStore(state => state.setSize);

    return <input type="range" min="1" max="100" value={size} onChange={(e) => setSize(e.target.value)} class="size-slider"/>
}

export default ColorButton;