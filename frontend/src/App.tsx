import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashbaord from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import HomeRoute from './HomeRoute';
import Profile from './pages/Profile';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/' element={<HomeRoute />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashbaord />
            </ProtectedRoute>
          } />
          <Route path='/profile' element = {
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
