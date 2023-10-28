import { Route, Routes } from 'react-router-dom';
import Admin from './Admin/Admin';

export default function Routing() {
  return (
    <Routes>
      <Route path='/admin' element={<Admin />} />
    </Routes>
  )
}
