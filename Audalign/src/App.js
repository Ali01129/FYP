import './App.css';
import AuthPage from './pages/AuthPage';
import Editor from './pages/Editor';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import ResultPage from './pages/ResultPage';
import UploadPage from './pages/UploadPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Auth" element={<AuthPage />} />
          <Route path="/Upload" element={<UploadPage />} />
          <Route path="/Result" element={<ResultPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Editor" element={<Editor />} />
          <Route path="*" element={<LandingPage />} /> 
         

          {/* <Route path="/" element={<Editor />} />
          <Route path="*" element={<Editor />} /> */}
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;