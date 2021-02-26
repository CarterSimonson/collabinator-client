import React from "react";

import useSession from "shared/hooks/useSession";
import Toolbar from "shared/components/Toolbar";
import DrawArea from "./components/DrawArea";
import QueueArea from "./components/QueueArea";
import RenderArea from "./components/RenderArea";

const Editor = () => {
    const { innerWidth: width, innerHeight: height } = window;
    const [pushInteraction] = useSession();
    
    return (
        <div className="editor">
            <Toolbar/>
            <DrawArea width={width} height={height} pushInteraction={pushInteraction}/>
            <QueueArea width={width} height={height}/>
            <RenderArea width={width} height={height}/>
        </div>
    )
}

export default Editor;