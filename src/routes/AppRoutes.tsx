import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

// A placeholder until the catalog page is built.
function Home() {
  return <h1 className="text-4xl font-bold">Catalog</h1>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
