import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Administrar', href: '/admin', icon: Settings },
    { name: 'Restaurantes', href: '/restaurants', icon: Users },
    { name: 'Reservar', href: '/reserve', icon: Calendar },
    { name: 'Mis Reservas', href: '/reservations', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">RestauReserva</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;