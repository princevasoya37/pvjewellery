import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectThemeMode } from '../store/themeSlice';
import Header from './Header';
import Footer from './Footer';
import Drawers from './Drawers';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  const location = useLocation();
  const themeMode = useSelector(selectThemeMode);
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark', 'theme-dark');
      document.body.classList.add('dark', 'theme-dark');
    } else {
      document.documentElement.classList.remove('dark', 'theme-dark');
      document.body.classList.remove('dark', 'theme-dark');
    }
  }, [themeMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      themeMode === 'dark' ? 'bg-[#0D0A07] text-[#F9F6F0]' : 'bg-[#FBF9F6] text-[#111111]'
    }`}>
      <Header />
      <Drawers />
      <WhatsAppButton />
      <main className="flex-1 flex flex-col">
        {isHome ? (
          <Outlet />
        ) : (
          <div className="section-shell py-6 sm:py-10 flex-1 w-full">
            <Outlet />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
