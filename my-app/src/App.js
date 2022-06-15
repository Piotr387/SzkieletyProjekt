import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainPage from './Containers/MainPage';
import UserPage from "./Containers/UserPage";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" exact element={<MainPage/>} />
        <Route path="/user" exact element={<UserPage/>} />
      </Routes>
    </Router>
    </>

  );
}

export default App;
