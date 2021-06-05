import './App.css';
import {TokensPage} from './components/tokens-page/TokensPage.js'
import {Header} from './components/header/Header.js'

function App() {
  return (
    <div className="ledn-app">
      <div className="header-wrapper">
        <Header/>
      </div>
      <div className="content-wrapper">
        <TokensPage/>
      </div>
    </div>
  );
}

export default App;
