
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"


function App() {
 

  return (
    <>
    <Router>
      <div className="w-full min-h-screen bg-neutral-100/50 text-neutral-500 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Routing */}
        <Routes>
            <Route path = "/" element={<Home />} />
            <Route path = "/menu" element={<Home />} />
            <Route exact path = "/login" element={<Login />} />
        </Routes>
        {/* Footer */}
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
