import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Pixel } from '../../utils/pixel';

export default function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();
    const sentRef = useRef(false);

    useEffect(() => {
        if (sentRef.current) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = location.state as { purchase_price?: number, plan_name?: string, transaction_id?: string, user_email?: string, user_name?: string } | null;
        const value = state?.purchase_price || 9.90; // Fallback to 9.90
        const transaction_id = state?.transaction_id || `txn_${Date.now()}`;

        // 1. Send Pixel Event
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: transaction_id,
                value: value,
                currency: 'BRL',
                items: [{
                    item_name: state?.plan_name || 'Plano Semanal',
                    price: value
                }]
            });
            console.log('Pixel Purchase Sent:', { value, transaction_id });
        }

        // 1.1 Meta Pixel Purchase Event
        Pixel.track('Purchase', {
            value: value,
            currency: 'BRL',
            content_name: state?.plan_name || 'Plano Semanal',
            transaction_id: transaction_id
        });

        // 2. Send Welcome Email (via Serverless Function)
        const userStr = localStorage.getItem('enem_pro_user');
        const user = userStr ? JSON.parse(userStr) : null;
        const email = state?.user_email || user?.email;
        const name = state?.user_name || user?.name;

        if (email) {
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    plan: state?.plan_name || 'Semanal'
                })
            }).then(res => {
                if (res.ok) console.log("Email sent successfully");
                else console.error("Failed to send email");
            }).catch(err => console.error("Email API Error:", err));
        }

        sentRef.current = true;
    }, [location]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            
            {/* Decorative background hearts */}
            <div className="absolute top-20 left-10 text-rose-200/50 animate-pulse"><Heart size={40} fill="currentColor" /></div>
            <div className="absolute bottom-20 right-10 text-pink-300/40 animate-bounce" style={{ animationDuration: '3s' }}><Heart size={60} fill="currentColor" /></div>
            <div className="absolute top-1/3 right-1/4 text-rose-300/30 animate-pulse" style={{ animationDuration: '4s' }}><Heart size={30} fill="currentColor" /></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-rose-200/50 border border-white p-8 md:p-10 text-center animate-in fade-in zoom-in duration-500 relative z-10">

                <div className="flex justify-center mb-8 relative">
                    <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse"><Sparkles size={24} /></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-inner border border-green-200">
                        <CheckCircle className="h-12 w-12 text-emerald-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif italic">
                    Pagamento Confirmado! 💖
                </h1>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Tudo certo com o seu pedido. <br />
                    Agora você já pode criar a surpresa inesquecível para o seu amor.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg py-4 rounded-xl hover:from-rose-600 hover:to-pink-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                    >
                        Começar a Configurar
                        <ArrowRight className="h-5 w-5" />
                    </button>

                    <p className="text-sm text-gray-400 mt-4">
                        O seu acesso já está liberado.
                    </p>
                </div>
            </div>
        </div>
    );
}
