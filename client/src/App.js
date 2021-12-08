import './App.css';
import ResponsiveAppBar from './components/NavBar'
import Posts from './components/Posts'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (

    <Router>

    <div className="App">

      <Routes>

        <Route path='/' element={<> <ResponsiveAppBar/> </>}></Route>
        <Route path='/posts' element={<> <ResponsiveAppBar/> <Posts/> </>}></Route>

      </Routes>



      
    </div>

    </Router>


    
  );
}

export default App;
