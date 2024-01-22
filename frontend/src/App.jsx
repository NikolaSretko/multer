import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import DetailPage from './pages/DetailPage'
import AdminPage from './pages/AdminPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/detailpage/:id' element={<DetailPage/>}/>
        <Route path='/admindashboard' element={<AdminPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
