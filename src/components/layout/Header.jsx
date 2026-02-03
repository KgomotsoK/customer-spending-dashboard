import { Bell, ChevronDown, LogOut, Moon, Sun, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import '../../styles/main.css';

const LOGO_URL = 'https://rmkcdn.successfactors.com/05298491/24cdd26a-2959-4419-8350-6.png';

const Header = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Initialize theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    toast({
      title: `Switched to ${!isDark ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Unable to sign out. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const clearNotifications = () => {
    setUnreadNotifications(0);
    setShowNotifications(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
      duration: 3000,
    });
  };

  const mockNotifications = [
    {
      id: 1,
      title: "Spending alert",
      description: "You're approaching your Entertainment budget limit",
      time: "10 min ago",
      read: false,
      type: "warning"
    },
    {
      id: 2,
      title: "New feature",
      description: "Goal tracking now available",
      time: "2 hours ago",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Weekly summary",
      description: "Your weekly spending report is ready",
      time: "1 day ago",
      read: true,
      type: "info"
    }
  ];

  return (
    <header className="header">
      <div className="header__container">
        {/* Brand Section */}
        <div className="header__brand">
          <img 
            src={LOGO_URL} 
            alt="Capitec Logo" 
            className="header__logo"
          />
          <div className="header__title">
            <h1 className="header__title-main">Spending Insights</h1>
            <p className="header__title-sub">Customer Analytics Dashboard</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="header__actions">
          {/* Notifications Dropdown */}
          <div className="header__action" ref={notificationRef}>
            <button
              className="icon-button icon-button--notification"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="icon-button__badge">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="dropdown dropdown--notifications">
                <div className="dropdown__header">
                  <h3 className="dropdown__title">Notifications</h3>
                  <button 
                    className="dropdown__clear"
                    onClick={clearNotifications}
                  >
                    Clear all
                  </button>
                </div>
                <div className="dropdown__content">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification ${!notification.read ? 'notification--unread' : ''}`}
                    >
                      <div className="notification__content">
                        <div className="notification__title">{notification.title}</div>
                        <div className="notification__description">{notification.description}</div>
                        <div className="notification__time">{notification.time}</div>
                      </div>
                      {!notification.read && (
                        <div className="notification__indicator"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="dropdown__footer">
                  <button className="button button--ghost button--sm">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="header__action">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* User Profile Dropdown */}
          {user && (
            <div className="header__action" ref={userMenuRef}>
              <button
                className="header__user-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-label="User menu"
              >
                <div className="header__user-avatar">
                  {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </div>
                <div className="header__user-info">
                  <span className="header__user-name">{user.name}</span>
                  <span className="header__user-email">{user.email}</span>
                </div>
                <ChevronDown size={16} className={`header__user-chevron ${showUserMenu ? 'header__user-chevron--open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="dropdown">
                  <div className="dropdown__content">
                    <div className="dropdown__section">
                      <div className="dropdown__header">
                        <h3 className="dropdown__title">Account</h3>
                      </div>
                      <div className="dropdown__item">
                        <User size={16} />
                        <span>Profile Settings</span>
                      </div>
                      <div className="dropdown__item">
                        <Bell size={16} />
                        <span>Notification Settings</span>
                      </div>
                    </div>
                    <div className="dropdown__divider"></div>
                    <div className="dropdown__section">
                      <div className="dropdown__item dropdown__item--danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;