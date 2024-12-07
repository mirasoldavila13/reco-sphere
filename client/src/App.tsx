import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
