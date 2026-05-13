import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Loader2, Lock, Heart } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(email);
            if (result.success) {
                navigate('/app');
            } else {
                setError(result.message || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="h-12 w-12 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 mb-4">
                        <Heart className="h-6 w-6 text-white fill-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900 font-serif italic">Nosso Amor</h1>
                    <p className="text-gray-500 text-sm font-medium">O presente mais romântico do mundo</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-100/50 border border-rose-100 p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Acesse seu Mural</h2>
                        <p className="text-gray-500 text-sm mt-2">Digite o e-mail da compra para configurar o seu presente.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-700">E-mail</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 transition-all placeholder:text-gray-400 text-sm font-medium shadow-sm"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-rose-200"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    Entrar no Painel
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-rose-50 text-center">
                        <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" /> Acesso protegido e seguro
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
