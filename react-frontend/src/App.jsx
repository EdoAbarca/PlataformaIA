import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home.jsx';
import Register from './views/Register.jsx';
import Login from './views/Login.jsx';
import LoggedIn from './views/LoggedIn.jsx'
import Analysis from './views/Analysis.jsx'
import FormAnalysis from './views/FormAnalysis.jsx'
import Keys from './views/Keys.jsx'
import AddKey from './views/AddKey.jsx'
import EditKey from './views/EditKey.jsx'
import NotFound from './views/NotFound.jsx'
import Navbar from './components/Navbar.jsx';
import Tags from './views/Tags.jsx'
import FAQ from './views/FAQ.jsx'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/loggedin' element={<LoggedIn />} />
          <Route path='/analysis/:id' element={<Analysis />} />
          <Route path='/analysis/form' element={<FormAnalysis />} />
          <Route path='/keys' element={<Keys />} />
          <Route path='/keys/add' element={<AddKey/>}/>
          <Route path='/keys/edit/:id' element={<EditKey/>}/>
          <Route path="/faq" element={<FAQ />} />
          <Route path="/tags" element={<Tags />}/>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
