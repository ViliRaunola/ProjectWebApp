import './App.css';
import ResponsiveAppBar from './components/NavBar'
import Posts from './components/Posts'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'
import Post from './components/Post'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (

    <Router>

    <div className="App">

      <Routes>

        <Route path='/' element={<> <ResponsiveAppBar/> </>}></Route>
        <Route path='/posts' element={<> <ResponsiveAppBar/> <Posts/> </>}></Route>
        <Route path='/post/:postId'  element={<> <ResponsiveAppBar/> <Post/> </>}></Route>
        <Route path='/profile' element={<> <ResponsiveAppBar/> <Profile/> </>}></Route>
        <Route path='/login' element={<> <ResponsiveAppBar/> <Login/> </>}></Route>
        <Route path='/register' element={<> <ResponsiveAppBar/> <Register/> </>}></Route>
      </Routes>



      
    </div>

    </Router>


    
  );
}

export default App;
