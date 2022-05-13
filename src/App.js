import { Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home';
import Stimulation from './pages/Stimulation';
import ProblemIdentification from './pages/ProblemIdentification';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/stimulation" element={<Stimulation />} />
    <Route path="/problem-identification" element={<ProblemIdentification />} />
  </Routes>
);

export default App;
