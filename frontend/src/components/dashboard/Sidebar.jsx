import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BuildingOfficeIcon,
  HeartIcon,
  UserIcon,
  PlusIcon,
  Bars3Icon,
  UserGroupIcon,
  CalendarIcon,
  CogIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const Sidebar = () => {
  const { userData, userLogout, isAdminMode } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUI();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Properties', href: '/dashboard/properties', icon: BuildingOfficeIcon },
    { name: 'Favorites', href: '/dashboard/favorites', icon: HeartIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ];

  // Add "Add Property" for sellers and admins
  if (userData?.role === 'seller' || userData?.role === 'admin') {
    navigation.splice(2, 0, { 
      name: 'Add Property', 
      href: '/dashboard/properties/add', 
      icon: PlusIcon 
    });
  }

  // Add admin routes for admin users
  if (userData?.role === 'admin') {
    navigation.push(
      { name: 'Divider', href: '#', icon: null },
      { name: 'Admin Dashboard', href: '/admin', icon: CogIcon },
      { name: 'Manage Users', href: '/admin/users', icon: UserGroupIcon },
      { name: 'Manage Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
      { name: 'Sales Management', href: '/admin/sales', icon: CurrencyDollarIcon },
      { name: 'Manage Schedules', href: '/admin/schedules', icon: CalendarIcon },
      { name: 'Settings', href: '/admin/settings', icon: CogIcon }
    );
  }

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : '-100%',
          width: sidebarOpen ? 256 : 80
        }}
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg border-r border-gray-200 lg:translate-x-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">RealEstate</span>
            </Link>
          )}
          
          <button
            onClick={toggleSidebar}
            className="hidden p-2 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 lg:block"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-8 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                {item.name === 'Divider' ? (
                  <div className="my-4 border-t border-gray-200"></div>
                ) : (
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="flex-shrink-0 w-5 h-5" />
                  {sidebarOpen && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div className="flex-shrink-0 p-4 mt-auto border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500">
                  <span className="text-sm font-medium text-white">
                    {userData?.displayName?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userData?.role || 'buyer'}
                  </p>
                </div>
              </div>
              {isAdminMode && (
                <button
                  onClick={userLogout}
                  className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:text-red-800 hover:bg-red-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;