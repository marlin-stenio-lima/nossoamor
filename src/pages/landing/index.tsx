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
            <nav className="w-full bg-rose-50/80 backdrop-blur-xl z-50 border-b border-rose-100 sticky top-0 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gradient-to-tr from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                            <Heart className="h-5 w-5 text-white fill-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-gray-900 font-serif italic">Nosso Amor</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                        <a href="#features" className="hover:text-gray-900 transition-colors">Como Funciona</a>
                        <a href="#emotion" className="hover:text-gray-900 transition-colors">O Impacto</a>
                        <a href="#pricing" className="hover:text-gray-900 transition-colors">Garantir Agora</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/login')} className="flex items-center justify-center text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-full transition-all border border-transparent hover:border-gray-200">
                            Entrar
                        </button>
                        <button onClick={() => navigate('/checkout')} className="bg-gray-900 text-white px-5 md:px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2">
                            <span className="hidden md:inline">Criar Presente</span>
                            <span className="md:hidden">Criar</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-20 md:pt-32 md:pb-32 px-4 overflow-hidden relative">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full text-rose-600 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Heart className="h-4 w-4 fill-rose-600 text-rose-600 animate-pulse" />
                        O Presente Que Vai Fazer Seu Amor Chorar
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Crie uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Página de Internet Exclusiva</span> para o seu Amor
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 font-medium">
                        Esqueça os presentes de sempre. Entregue uma verdadeira cápsula do tempo digital. Um <strong>site secreto, exclusivo de vocês</strong>, que reúne suas melhores fotos, memórias e declarações, <strong>protegido pela data do seu relacionamento.</strong>
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <div className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 shadow-sm">
                            Por apenas <span className="font-black text-lg">R$ 9,90</span> (Pagamento Único)
                        </div>
                        <button onClick={() => navigate('/checkout')} className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-pink-600 text-white px-10 py-5 rounded-full font-black text-xl hover:from-rose-500 hover:to-pink-500 transition-all shadow-2xl shadow-rose-300 hover:shadow-rose-400 hover:-translate-y-1 flex items-center justify-center gap-3">
                            <Heart className="h-6 w-6 fill-white" />
                            Quero Emocionar Meu Amor
                            <ArrowRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Sneak Peek Section */}
            <section id="features" className="py-24 bg-rose-50 relative overflow-hidden z-10 border-t border-rose-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none opacity-40"></div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-32">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">Uma experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">inesquecível</span></h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            O que o seu amor vai receber? Uma jornada interativa com design de aplicativo, feita exclusivamente com a história de vocês.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 max-w-6xl mx-auto relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"></div>

                        {/* Print 1: Lock Screen */}
                        <div className="flex flex-col items-center transform transition-all duration-700 hover:-translate-y-4 group w-full md:w-1/3 relative z-10">
                            <div className="w-64 aspect-[9/19] bg-black rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center ring-1 ring-black/5 group-hover:shadow-[0_40px_80px_-20px_rgba(225,29,72,0.2)] transition-shadow">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                                
                                <Heart className="h-12 w-12 text-rose-500 fill-rose-500 mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse" />
                                <div className="text-white font-black text-xl mb-2">Página Trancada</div>
                                <div className="text-gray-400 text-xs mb-8 px-2">Digite a data do namoro para acessar a surpresa</div>
                                <div className="flex gap-1.5 mb-6">
                                    <div className="w-8 h-12 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center text-xl font-bold text-white">1</div>
                                    <div className="w-8 h-12 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center text-xl font-bold text-white">2</div>
                                    <div className="w-3 h-12 flex items-center justify-center text-xl font-bold text-gray-600">/</div>
                                    <div className="w-8 h-12 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center text-xl font-bold text-white">0</div>
                                    <div className="w-8 h-12 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center text-xl font-bold text-white">6</div>
                                </div>
                                <div className="w-full py-3 bg-rose-600 rounded-full font-black text-white text-sm shadow-lg shadow-rose-600/30">Destrancar</div>
                            </div>
                            <div className="mt-8 text-center px-4 max-w-[280px]">
                                <h3 className="text-xl font-black mb-2 text-gray-900">1. O Cadeado</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">A página só abre com a data de vocês, gerando aquele frio na barriga.</p>
                            </div>
                        </div>

                        {/* Print 2: Jornalzinho (Featured) */}
                        <div className="flex flex-col items-center transform md:-translate-y-12 transition-all duration-700 hover:-translate-y-16 group w-full md:w-1/3 relative z-20">
                            <div className="w-72 aspect-[9/19] bg-[#fdfaf6] rounded-[3.5rem] border-[14px] border-[#1a1a1a] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col p-5 text-gray-900 ring-1 ring-black/5 group-hover:shadow-[0_50px_100px_-20px_rgba(225,29,72,0.3)] transition-shadow">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                                
                                <div className="pt-10 border-b-[3px] border-gray-900 pb-3 mb-4 text-center">
                                    <div className="font-serif text-[2.1rem] font-black tracking-tighter leading-none text-gray-900">O AMOR VENCEU</div>
                                    <div className="text-[0.6rem] uppercase font-bold mt-2 text-gray-600 tracking-wider">Edição Especial</div>
                                </div>
                                <div className="w-full h-44 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-200">
                                    <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" alt="Casal" className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-serif font-bold text-lg leading-tight mb-2">Como Tudo Começou</h4>
                                <p className="text-[0.65rem] text-gray-600 leading-relaxed text-justify font-medium">
                                    Foi em uma tarde ensolarada que os olhares se cruzaram. Desde aquele dia, nada foi igual. A conexão foi instantânea, como se já se conhecessem...
                                </p>
                            </div>
                            <div className="mt-10 text-center px-4 max-w-[300px]">
                                <h3 className="text-xl font-black mb-2 text-gray-900">2. A Manchete</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">A história de vocês escrita e eternizada como a notícia mais importante do mundo.</p>
                            </div>
                        </div>

                        {/* Print 3: Gallery */}
                        <div className="flex flex-col items-center transform transition-all duration-700 hover:-translate-y-4 group w-full md:w-1/3 relative z-10">
                            <div className="w-64 aspect-[9/19] bg-black rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col p-5 ring-1 ring-black/5 group-hover:shadow-[0_40px_80px_-20px_rgba(225,29,72,0.2)] transition-shadow">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                                
                                <div className="pt-8 text-center font-black text-lg text-white mb-5 flex items-center justify-center gap-2">
                                    Nossos Momentos
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 flex-1 pb-4">
                                    <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                    <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                    <img src="https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                    <img src="https://images.unsplash.com/photo-1501901609772-df0848060b33?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                    <img src="https://images.unsplash.com/photo-1621252179027-94459d278660?w=200&q=80" alt="Galeria" className="w-full h-full object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="mt-8 text-center px-4 max-w-[280px]">
                                <h3 className="text-xl font-black mb-2 text-gray-900">3. O Túnel do Tempo</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Uma galeria interativa para reviver as viagens, sorrisos e momentos marcantes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emotional Problem/Solution Section */}
            <section id="emotion" className="py-24 bg-rose-100/50 border-t border-rose-200 relative z-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
                        Todo ano é a mesma coisa...
                    </h2>
                    <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
                        Você passa horas procurando um presente. Acaba comprando um perfume, uma roupa ou chamando para jantar. Você entrega o presente, a pessoa sorri, agradece e... <strong className="text-gray-900">em 5 minutos a surpresa acaba.</strong>
                    </p>
                    <div className="h-px w-24 bg-rose-300 mx-auto mb-10"></div>
                    <p className="text-2xl text-rose-900 font-bold leading-relaxed italic max-w-3xl mx-auto">
                        "E se você pudesse arrancar um <span className="text-rose-600">sorriso sincero, lágrimas de emoção</span> e criar um momento que será lembrado para o resto da vida?"
                    </p>
                </div>
            </section>

            {/* Pricing Section (Clean SaaS Style) */}
            <section id="pricing" className="py-24 bg-rose-900 relative overflow-hidden border-t border-rose-950">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/30 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <div className="mb-16 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Quanto custa emocionar quem você ama?
                        </h2>
                        <p className="text-rose-200 text-xl font-medium max-w-2xl mx-auto">
                            Um jantar: <span className="line-through text-red-400">R$ 250</span>. Um perfume: <span className="line-through text-red-400">R$ 350</span>. <br/>
                            O presente que vai fazer ela(e) chorar de alegria:
                        </p>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden max-w-lg mx-auto border border-rose-100 hover:border-rose-300 transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-red-500"></div>
                        
                        <div className="flex flex-col items-center justify-center mb-8">
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Acesso Vitalício</span>
                            <div className="flex items-start justify-center gap-1 text-gray-900 leading-none">
                                <span className="text-2xl font-black mt-3 text-gray-400">R$</span>
                                <span className="text-[6rem] font-black tracking-tighter text-gray-900">9</span>
                                <div className="flex flex-col text-left mt-3">
                                    <span className="text-3xl font-black text-gray-900">,90</span>
                                </div>
                            </div>
                            <span className="text-gray-500 font-medium mt-4 text-sm">Taxa única. Sem mensalidades.</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all hover:from-rose-600 hover:to-red-700 hover:-translate-y-0.5 flex items-center justify-center gap-3 mb-6"
                        >
                            <Heart className="h-5 w-5 fill-white" />
                            Criar Meu Presente Agora
                        </button>
                        
                        <p className="text-xs font-bold text-gray-400 mb-8 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                            <Lock className="h-3 w-3" /> Pagamento 100% Seguro
                        </p>

                        <div className="pt-8 border-t border-gray-100 text-left space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="bg-rose-100 p-1 rounded-full"><Check className="h-4 w-4 text-rose-600" /></div> Site Protegido com Senha</div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="bg-rose-100 p-1 rounded-full"><Check className="h-4 w-4 text-rose-600" /></div> Galeria de Fotos Interativa</div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="bg-rose-100 p-1 rounded-full"><Check className="h-4 w-4 text-rose-600" /></div> História Estilo Manchete de Jornal</div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium"><div className="bg-rose-100 p-1 rounded-full"><Check className="h-4 w-4 text-rose-600" /></div> Acesso Vitalício (Sem Mensalidades)</div>
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



