import './App.scss';
import DrawArea from 'components/DrawArea';
import Toolbar from 'components/Toolbar';

function App() {
  const { innerWidth: width, innerHeight: height } = window;

  return (
    <div className="app-container">
      <Toolbar/>
      <DrawArea width={width} height={height}/>
    </div>
  );
}

export default App;
