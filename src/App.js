import { Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Stimulation from './pages/Stimulation';
import ProblemIdentification from './pages/ProblemIdentification';
import Classification from './pages/Classification';
import Observation from './pages/Observation';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/stimulation/:shapeCodename" element={<Stimulation />} />
    <Route path="/problem-identification/:shapeCodename" element={<ProblemIdentification />} />
    <Route path="/classification/:shapeCodename" element={<Classification />} />
    <Route path="/observation/:shapeCodename" element={<Observation />} />
  </Routes>
);

export default App;
