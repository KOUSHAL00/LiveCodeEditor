import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/molecule/Home";
import RoomView from "./Components/molecule/RoomView";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;