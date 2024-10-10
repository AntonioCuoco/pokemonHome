import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './page/login/loginPage';
import RegisterPage from './page/register/registerPage';
import Dashboard from './page/dashboard/dashboard'
import ProtectedRoutes from './components/protectedRoutes'
import Chat from './page/chat/Chat'
import Profile from './page/profile/profile';
import Pokedex from './page/pokedex/pokedex';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
          <Route path='/chat' element={<Chat />}/>
          <Route path='/profile' element={<Profile />} />
          <Route path='/pokedex' element={<Pokedex />} />
        </Route>
        <Route path="*" element={<p>no page</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
