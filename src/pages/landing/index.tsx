import { useNavigate } from 'react-router-dom';
import { Heart, Camera, BookOpen, QrCode, Lock, Wand2, ArrowRight, Check, Timer, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Pixel } from '../../utils/pixel';

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        Pixel.track('PageView');
    }, []);

    return (
        <div className="min-h-screen bg-rose-50 font-sans text-gray-900 selection:bg-rose-200 selection:text-rose-900">
            {/* Top Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
                <Timer className="h-4 w-4" />
                <span>O Lote Promocional de Dia dos Namorados encerra HOJE às 23:59.</span>
            </div>

            {/* Navbar */}
            <nav className="w-full bg-white/70 backdrop-blur-md z-50 border-b border-rose-100 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <Heart className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-gray-900 font-serif italic">Nosso Amor</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                        <a href="#features" className="hover:text-rose-600 transition-colors">Como Funciona</a>
                        <a href="#emotion" className="hover:text-rose-600 transition-colors">O Impacto</a>
                        <a href="#pricing" className="hover:text-rose-600 transition-colors">Garantir Agora</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/login')} className="flex items-center justify-center text-sm font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-full transition-all border border-gray-200">
                            Entrar
                        </button>
                        <button onClick={() => navigate('/checkout')} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 md:px-6 py-2.5 rounded-full text-sm font-bold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 border border-rose-400/20">
                            <span className="hidden md:inline">Criar Presente</span>
                            <span className="md:hidden">Criar</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-20 md:pt-32 md:pb-32 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-rose-100/80 border border-rose-200 px-4 py-1.5 rounded-full text-rose-700 text-sm font-bold mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                        <Heart className="h-4 w-4 fill-rose-600 text-rose-600 animate-pulse" />
                        O Presente Que Vai Fazer Seu Amor Chorar (de alegria)
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Chocolates acabam. Roupas rasgam. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Memórias são eternas.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-medium">
                        Imagine entregar um cartão impresso com um QR Code. Quando seu amor escanear, o celular pede uma <strong className="text-rose-600">senha especial (a data de vocês)</strong>. Ao destrancar, um filme passa na cabeça com a história, fotos e declarações do casal.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <button onClick={() => navigate('/checkout')} className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-pink-600 text-white px-10 py-5 rounded-full font-black text-xl hover:from-rose-500 hover:to-pink-500 transition-all shadow-2xl shadow-rose-300 hover:shadow-rose-400 hover:-translate-y-2 flex items-center justify-center gap-3">
                            <Heart className="h-6 w-6 fill-white" />
                            Quero Emocionar Meu Amor
                            <ArrowRight className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mt-8 text-sm font-bold text-gray-500 flex flex-wrap items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" /> 
                        Mais de <span className="text-gray-900">1.432 pessoas</span> já garantiram esse presente hoje.
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Emotional Problem/Solution Section */}
            <section id="emotion" className="py-20 bg-white relative z-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
                        Todo ano é a mesma coisa...
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        Você passa horas procurando um presente. Acaba comprando um perfume, uma roupa ou chamando para jantar. Você entrega o presente, a pessoa sorri, agradece e... <strong className="text-gray-900">em 5 minutos a surpresa acaba.</strong>
                    </p>
                    <div className="h-px w-24 bg-rose-200 mx-auto mb-8"></div>
                    <p className="text-2xl text-rose-600 font-bold leading-relaxed italic">
                        "E se você pudesse arrancar um sorriso sincero, lágrimas de emoção e criar um momento que será lembrado para o resto da vida?"
                    </p>
                </div>
            </section>

            {/* Features Grid (Triggers) */}
            <section id="features" className="py-24 max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Uma Surpresa Digna de Cinema</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Não é apenas um site. É uma máquina do tempo particular do casal.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Lock className="h-8 w-8 text-rose-600" />}
                        title="O Cadeado Secreto"
                        description="O coração acelera logo no início: a página só é destrancada quando a pessoa digita a data que vocês começaram a namorar."
                    />
                    <FeatureCard
                        icon={<Camera className="h-8 w-8 text-pink-600" />}
                        title="O Túnel do Tempo"
                        description="Uma galeria imersiva com as fotos de vocês. Reviva as viagens, os sorrisos e os momentos que construíram a relação."
                    />
                    <FeatureCard
                        icon={<BookOpen className="h-8 w-8 text-purple-600" />}
                        title="A Manchete da Vida"
                        description="O 'Jornalzinho do Amor'. A história de como vocês se conheceram estampada como a notícia mais importante do mundo."
                    />
                    <FeatureCard
                        icon={<Wand2 className="h-8 w-8 text-indigo-500" />}
                        title="Poesias com IA"
                        description="Não sabe o que escrever? Nossa Inteligência Artificial cria textos profundamente românticos baseados em poucos detalhes que você fornecer."
                    />
                    <FeatureCard
                        icon={<QrCode className="h-8 w-8 text-slate-800" />}
                        title="O QR Code Mágico"
                        description="Você gera um QR Code exclusivo (com um coração no meio) e baixa em PDF. Imprima e coloque em um envelope surpresa!"
                    />
                    <FeatureCard
                        icon={<Heart className="h-8 w-8 text-red-500" />}
                        title="Acesso Para Sempre"
                        description="Sem mensalidades. Você paga uma única vez e o link do casal ficará guardado para sempre na internet."
                    />
                </div>
            </section>

            {/* Pricing Section (Contrast Trigger) */}
            <section id="pricing" className="py-24 bg-gray-900 text-white border-t border-rose-900 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="mb-12 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            Quanto custa emocionar quem você ama?
                        </h2>
                        <p className="text-rose-200 text-xl md:text-2xl font-medium max-w-3xl mx-auto">
                            Um jantar bom: <span className="text-red-400 line-through">R$ 250</span>. Um perfume: <span className="text-red-400 line-through">R$ 350</span>. <br/>
                            O presente que vai fazer ela(e) chorar e se apaixonar novamente:
                        </p>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden max-w-lg mx-auto transform transition-all hover:scale-[1.03] duration-300">
                        <div className="absolute top-0 right-0 bg-red-600 text-white font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest text-sm shadow-md">
                            Oferta Exclusiva
                        </div>

                        <div className="flex flex-col items-center justify-center mb-8 pt-4">
                            <span className="text-gray-400 text-xl font-bold line-through mb-2">De R$ 49,90 por</span>
                            <div className="flex items-start justify-center gap-1 text-gray-900 leading-none">
                                <span className="text-2xl font-black mt-2">R$</span>
                                <span className="text-[6rem] font-black tracking-tighter text-rose-600">13</span>
                                <div className="flex flex-col text-left mt-2">
                                    <span className="text-3xl font-black text-rose-600">,90</span>
                                </div>
                            </div>
                            <span className="text-gray-500 font-bold mt-4 bg-gray-100 px-4 py-2 rounded-full">Taxa Única. Sem Mensalidade.</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xl font-black py-6 rounded-2xl shadow-xl shadow-rose-200/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 mb-4"
                        >
                            <Heart className="h-6 w-6 fill-white" />
                            EU QUERO ESTE PRESENTE
                        </button>
                        
                        <p className="text-sm font-bold text-red-500 mb-8 animate-pulse">
                            Restam apenas 17 vagas no servidor por este preço.
                        </p>

                        <div className="pt-8 border-t border-gray-100 text-left space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 font-bold"><Check className="h-6 w-6 text-green-500" /> Acesso imediato à plataforma</div>
                            <div className="flex items-center gap-3 text-gray-700 font-bold"><Check className="h-6 w-6 text-green-500" /> Ferramenta completa com IA</div>
                            <div className="flex items-center gap-3 text-gray-700 font-bold"><Check className="h-6 w-6 text-green-500" /> QR Code em Alta Resolução (PDF)</div>
                            <div className="flex items-center gap-3 text-gray-700 font-bold"><Check className="h-6 w-6 text-green-500" /> Suporte VIP via WhatsApp</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] border border-rose-100 shadow-sm hover:shadow-2xl hover:shadow-rose-200/50 transition-all duration-300 group">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-rose-100">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-lg">{description}</p>
        </div>
    );
}



