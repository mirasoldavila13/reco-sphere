import { BrowserRouter as Router, Routes} from 'react-router-dom';
import Navbar from  './components/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
         
        </Routes>
      </main>
    </Router>
  )
}

export default App
