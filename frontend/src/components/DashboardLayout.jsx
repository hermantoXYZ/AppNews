import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    User,
    Bell,
    Search,
    Settings,
    ChevronDown,
    Newspaper,
    Sparkles,
    FileText,
    FolderOpen,
    PenSquare,
    Users,
    Shield,
    BarChart,
    FileBarChart,
    Palette,
    HelpCircle,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import api from '../api';

function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalArticles: 0, draftArticles: 0 });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setShowMobileMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);
        fetchUserProfile();
        fetchNotifications();
        fetchStats();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/api/users/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchNotifications = async () => {
        // Placeholder for notifications
        setNotifications([
            { id: 1, message: 'New article trending', time: '5m ago' },
            { id: 2, message: 'Your article was published', time: '1h ago' },
        ]);
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/articles/stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching article stats:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm">
                <Button variant="ghost" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                    {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </Button>
                <div className="flex items-center gap-2">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl">Facts.com</span>
                </div>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50
                ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
                ${isMobile ? 'w-72' : isCollapsed ? 'w-20' : 'w-72'} 
                ${isMobile ? '' : 'translate-x-0'}
            `}>
                <div className="flex flex-col h-full relative">
                    {/* Toggle Button */}
                    {!isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="absolute -right-4 top-6 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
                        >
                            {isCollapsed ? 
                                <PanelLeftOpen size={16} className="text-gray-600" /> : 
                                <PanelLeftClose size={16} className="text-gray-600" />
                            }
                        </button>
                    )}

                    {/* Logo */}
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-3">
                            <Newspaper className="h-8 w-8 text-blue-600" />
                            {!isCollapsed && (
                                <div>
                                    <h1 className="text-xl font-bold">Facts.com</h1>
                                    <p className="text-xs text-gray-500">Content Management</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search */}
                    {!isCollapsed && (
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    {user && !isCollapsed && (
                        <div className="p-4 border-b relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {user.profile_picture ? (
                                    <img
                                        src={user.profile_picture}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                )}
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium text-sm">{user.username}</h3>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border py-1 z-50">
                                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                        Profile Settings
                                    </button>
                                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                        Preferences
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <div className="mb-4">
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                Main
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Overview" : ""}
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    {!isCollapsed && <span>Overview</span>}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                Content Management
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard/articles"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname.includes('/dashboard/articles')
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Articles" : ""}
                                >
                                    <FileText className="h-5 w-5" />
                                    {!isCollapsed && <span>Articles</span>}
                                    {!isCollapsed && (
                                        <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                            {stats.totalArticles}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to="/dashboard/categories"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/categories'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Categories" : ""}
                                >
                                    <FolderOpen className="h-5 w-5" />
                                    {!isCollapsed && <span>Categories</span>}
                                </Link>
                                <Link
                                    to="/dashboard/articles/create"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/articles/create'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Create Article" : ""}
                                >
                                    <PenSquare className="h-5 w-5" />
                                    {!isCollapsed && <span>Create Article</span>}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                User Management
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard/users"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/users'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Users" : ""}
                                >
                                    <Users className="h-5 w-5" />
                                    {!isCollapsed && <span>Users</span>}
                                </Link>
                                <Link
                                    to="/dashboard/roles"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/roles'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Roles & Permissions" : ""}
                                >
                                    <Shield className="h-5 w-5" />
                                    {!isCollapsed && <span>Roles & Permissions</span>}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                Analytics
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard/analytics"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/analytics'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Statistics" : ""}
                                >
                                    <BarChart className="h-5 w-5" />
                                    {!isCollapsed && <span>Statistics</span>}
                                </Link>
                                <Link
                                    to="/dashboard/reports"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/reports'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Reports" : ""}
                                >
                                    <FileBarChart className="h-5 w-5" />
                                    {!isCollapsed && <span>Reports</span>}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                Settings
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard/settings/general"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/settings/general'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "General Settings" : ""}
                                >
                                    <Settings className="h-5 w-5" />
                                    {!isCollapsed && <span>General Settings</span>}
                                </Link>
                                <Link
                                    to="/dashboard/settings/appearance"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/settings/appearance'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Appearance" : ""}
                                >
                                    <Palette className="h-5 w-5" />
                                    {!isCollapsed && <span>Appearance</span>}
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h2 className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${isCollapsed ? 'sr-only' : ''}`}>
                                Help & Support
                            </h2>
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard/help"
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${location.pathname === '/dashboard/help'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                    `}
                                    title={isCollapsed ? "Documentation" : ""}
                                >
                                    <HelpCircle className="h-5 w-5" />
                                    {!isCollapsed && <span>Documentation</span>}
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t">
                        <div className="flex items-center justify-between">
                            <button
                                className="relative p-2 rounded-lg hover:bg-gray-50"
                                onClick={() => !isCollapsed && setShowNotifications(!showNotifications)}
                                title={isCollapsed ? "Notifications" : ""}
                            >
                                <Bell className="h-5 w-5 text-gray-500" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button 
                                className="p-2 rounded-lg hover:bg-gray-50"
                                title={isCollapsed ? "Settings" : ""}
                            >
                                <Settings className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Notifications Dropdown */}
                        {showNotifications && !isCollapsed && (
                            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg border mt-2">
                                <div className="p-3 border-b">
                                    <h3 className="font-medium">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`
                transition-all duration-300
                ${isMobile ? '' : isCollapsed ? 'md:ml-20' : 'md:ml-72'}
                ${showMobileMenu && isMobile ? 'opacity-50' : 'opacity-100'}
            `}>
                <div className="min-h-screen bg-gray-50 p-6">
                    {children}
                </div>
            </div>

            {/* Mobile Overlay */}
            {showMobileMenu && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}
        </div>
    );
}

export default DashboardLayout; 