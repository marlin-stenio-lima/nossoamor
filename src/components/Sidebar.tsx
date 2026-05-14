import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings, Heart, Gift, ExternalLink, X, Book } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    { name: 'Painel', href: '/app', icon: LayoutDashboard },
    { name: 'Configurar Surpresa', href: '/app/configurar', icon: Settings },
    { name: 'Gerar QR Code', href: '/app/exportar', icon: Gift },
    { name: 'Bônus Extras', href: '/app/ebooks', icon: Book },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-rose-100 font-sans transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Header / Brand */}
            <div className="px-6 py-8 pb-4 border-b border-rose-50">
                <div className="flex items-center gap-3 mb-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 bg-gradient-to-tr from-rose-500 to-pink-500 text-white rounded-lg flex items-center justify-center shadow-md">
                        <Heart className="h-4 w-4 fill-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 font-serif italic">Nosso Amor</span>
                    
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden ml-auto p-1 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
                <div className="px-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Seu Presente</div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/app' && location.pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => {
                                if (window.innerWidth < 1024 && onClose) onClose();
                            }}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all border border-transparent",
                                isActive
                                    ? "bg-rose-50 text-rose-600 border-rose-100 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-rose-600" : "text-gray-400")} />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="pt-6 mt-6 border-t border-rose-50">
                    <Link
                        to="/p/demo"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all border border-transparent text-pink-600 hover:bg-pink-50 shadow-sm border-pink-100"
                    >
                        <ExternalLink className="h-5 w-5" />
                        Visualizar Presente
                    </Link>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-rose-50 space-y-1 bg-gray-50/50">
                <div className="px-3 py-2 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">Logado como</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'usuario@email.com'}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sair da Conta
                </button>
            </div>
        </div>
    );
}
