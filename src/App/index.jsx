import React from 'react';
import './App.scss';

import useSession from "hooks/useSession";
import Toolbar from 'components/Toolbar';
import DrawArea from 'components/DrawArea';
import QueueArea from 'components/QueueArea';
import RenderArea from 'components/RenderArea';

function App() {
  const { innerWidth: width, innerHeight: height } = window;
  const [pushInteraction] = useSession();

  return (
    <div className="app-container">
      <Toolbar/>
      <DrawArea width={width} height={height} pushInteraction={pushInteraction}/>
      <QueueArea width={width} height={height}/>
      <RenderArea width={width} height={height}/>
    </div>
  );
}

export default App;
