import React from "react";
import "./IconButton.scss";

const IconButton = (props) => {
    const { onClick, children } = props;

    return <button className="icon-button" onClick={onClick}>{ children }</button>;
}

export default IconButton;