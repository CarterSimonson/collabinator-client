import React from 'react';
import './App.scss';
import DrawArea from 'components/DrawArea';
import Toolbar from 'components/Toolbar';
import useSession from "hooks/useSession";

function App() {
  const { innerWidth: width, innerHeight: height } = window;
  const [session, addInteraction] = useSession();

  return (
    <div className="app-container">
      <Toolbar/>
      <DrawArea width={width} height={height} session={session} addInteraction={addInteraction}/>
    </div>
  );
}

export default App;
