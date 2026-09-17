import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import Teams from './pages/Teams'
import MySquad from './pages/MySquad'
import JoinSquad from './pages/JoinSquad'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Staff from './pages/Staff'
import Community from './pages/Community'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:slug" element={<TournamentDetail />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/squad" element={<MySquad />} />
        <Route path="/join" element={<JoinSquad />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
