import "./App.css";
import User from "./pages/User";
import Nurse from "./pages/Nurse";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegistrationForm from "./pages/Registration_Form";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-registration" element={<RegistrationForm />} />
          <Route path="/user-dashboard" element={<User />} />
          <Route path="/nurse-dashboard" element={<Nurse />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
