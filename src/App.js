import './App.css';
import {Tokens} from './components/tokens/Tokens.js'
import {Header} from './components/header/Header.js'

function App() {
  return (
    <div className="ledn-app">
      <div className="header-wrapper">
        <Header/>
      </div>
      <div className="content-wrapper">
        <Tokens/>
      </div>
    </div>
  );
}

export default App;
