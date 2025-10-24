import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TopNav } from './components/TopNav.jsx';
import Home from './pages/Home.jsx';
import FnO from './pages/FnO.jsx';

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-night dark:bg-grid-pattern dark:bg-[length:40px_40px] dark:text-slate-200">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fno" element={<FnO />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
