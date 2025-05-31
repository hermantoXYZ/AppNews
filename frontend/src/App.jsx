import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register" 
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Articles from './pages/Articles'
import ArticleForm from './pages/ArticleForm'
import ArticleDetail from './pages/ArticleDetail'
import Categories from './pages/Categories'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="articles" element={<Articles />} />
          <Route path="articles/create" element={<ArticleForm />} />
          <Route path="articles/:slug" element={<ArticleDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<div>Users Page</div>} />
          <Route path="roles" element={<div>Roles Page</div>} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="reports" element={<div>Reports Page</div>} />
          <Route path="settings/general" element={<div>General Settings</div>} />
          <Route path="settings/appearance" element={<div>Appearance Settings</div>} />
          <Route path="help" element={<div>Help & Documentation</div>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route 
          path="/articles" 
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/articles/:slug" 
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/articles/edit/:slug" 
          element={
            <ProtectedRoute>
              <ArticleForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App