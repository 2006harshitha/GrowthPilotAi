// src/components/layout/Layout.jsx
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import Toast from '../ui/Toast.jsx';

export default function Layout({ currentPage, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header currentPage={currentPage} />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }}>
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}
