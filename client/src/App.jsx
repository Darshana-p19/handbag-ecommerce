import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${
        darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-300`}>
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: darkMode ? '#1f2937' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#1f2937',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            },
          }}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;