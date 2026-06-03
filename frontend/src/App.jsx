import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route
                path="/posts/create"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categorias"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
