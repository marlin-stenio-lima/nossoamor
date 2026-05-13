import { useState, useEffect } from 'react';
import { Heart, Camera, Calendar, Mail, Lock, Music } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ErrorBoundary } from '../../../ErrorBoundary';

export default function PresenteView() {
    const { id } = useParams();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordAttempt, setPasswordAttempt] = useState('');
    const [error, setError] = useState(false);

    // Calculate Time Elapsed
    const [timeElapsed, setTimeElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Default mock data (fallback)
    const [coupleData, setCoupleData] = useState({
        password: '120622', // Ex: DDMMYY
        name1: 'João',
        name2: 'Maria',
        anniversary: '12/06/2022',
        newspaperTitle: 'A Edição Especial do Nosso Amor',
        aiStory: 'Tudo começou em uma tarde chuvosa. Maria estava na padaria e eu, João, derrubei café nela. Desde aquele dia desastrado, minha vida se encheu de luz e de um amor que eu nem sabia que era possível existir. Você é a página mais linda que o destino já escreveu na minha história.',
        meetDate: '12 de Junho de 2022',
        meetLocation: 'Padaria da Esquina',
        meetStory: 'Foi um desastre que virou amor à primeira vista.',
        photos: [
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80',
            'https://images.unsplash.com/photo-1606240724602-5b21f896eae8?w=500&q=80',
        ],
        youtubeLink: 'https://www.youtube.com/watch?v=kYpt3L-w1o4'
    });

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchGift = async () => {
            let dbData = null;

            // Fetch from database if we have a real ID
            if (id && id !== 'demo') {
                try {
                    const { data, error } = await supabase
                        .from('couple_gifts')
                        .select('*')
                        .eq('password', id)
                        .single();
                        
                    if (data && !error) {
                        dbData = data;
                    }
                } catch (err) {
                    console.error("Error fetching gift from database", err);
                }
            }

            // If found in DB, use it. Otherwise, try localStorage as a fallback for the buyer.
            if (dbData) {
                setCoupleData(prev => ({
                    ...prev,
                    password: dbData.password,
                    name1: dbData.names ? dbData.names.split(' e ')[0] : prev.name1,
                    name2: dbData.names ? dbData.names.split(' e ')[1] || '' : prev.name2,
                    newspaperTitle: dbData.newspaper_title || prev.newspaperTitle,
                    anniversary: dbData.anniversary ? dbData.anniversary.split('-').reverse().join('/') : prev.anniversary,
                    meetDate: dbData.anniversary ? dbData.anniversary.split('-').reverse().join('/') : prev.meetDate,
                    photos: dbData.photos?.length > 0 ? dbData.photos : prev.photos,
                    aiStory: dbData.ai_story || prev.aiStory,
                    youtubeLink: dbData.youtube_link || prev.youtubeLink,
                }));
            } else {
                // Fallback to localStorage (crucial for when the user hasn't saved to DB yet but is previewing)
                const savedData = localStorage.getItem('nossoAmorData');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        setCoupleData(prev => ({
                            ...prev,
                            photos: parsed.photoPreviews?.length > 0 ? parsed.photoPreviews : prev.photos,
                            aiStory: parsed.loveLetter || prev.aiStory,
                            youtubeLink: parsed.youtubeLink !== undefined ? parsed.youtubeLink : prev.youtubeLink,
                            password: id && id !== 'demo' ? id : (parsed.password || prev.password),
                            name1: parsed.names ? parsed.names.split(' e ')[0] : prev.name1,
                            name2: parsed.names ? parsed.names.split(' e ')[1] || '' : prev.name2,
                            newspaperTitle: parsed.newspaperTitle || prev.newspaperTitle,
                            anniversary: parsed.anniversary ? parsed.anniversary.split('-').reverse().join('/') : prev.anniversary,
                            meetDate: parsed.anniversary ? parsed.anniversary.split('-').reverse().join('/') : prev.meetDate,
                        }));
                    } catch (e) {
                        console.error("Failed to parse saved data", e);
                    }
                } else if (id && id !== 'demo') {
                    // At least enforce the password from URL
                    setCoupleData(prev => ({ ...prev, password: id }));
                }
            }
            
            setIsLoading(false);
        };

        fetchGift();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (/^[0-9]$/.test(e.key)) {
                handleKeyPress(e.key);
            } else if (e.key === 'Backspace') {
                handleKeyPress('delete');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [passwordAttempt, coupleData.password, error, isUnlocked]);

    const handleKeyPress = (key: string) => {
        if (error || isUnlocked) return;
        if (error) setError(false);
        
        if (key === 'delete') {
            setPasswordAttempt(prev => prev.slice(0, -1));
            return;
        }

        const expectedPassword = coupleData.password || '120622';

        if (passwordAttempt.length < expectedPassword.length) {
            const newPassword = passwordAttempt + key;
            setPasswordAttempt(newPassword);

            if (newPassword.length === expectedPassword.length) {
                if (newPassword === expectedPassword) {
                    setIsUnlocked(true);
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPasswordAttempt('');
                        setError(false);
                    }, 1000);
                }
            }
        }
    };

    useEffect(() => {
        if (!isUnlocked || !coupleData.anniversary) return;

        // Parse DD/MM/YYYY
        const parts = coupleData.anniversary.split('/');
        if (parts.length !== 3) return;
        
        const [day, month, year] = parts;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        const updateTimer = () => {
            const now = new Date();
            let years = now.getFullYear() - startDate.getFullYear();
            let months = now.getMonth() - startDate.getMonth();
            let days = now.getDate() - startDate.getDate();
            let hours = now.getHours() - startDate.getHours();
            let minutes = now.getMinutes() - startDate.getMinutes();
            let seconds = now.getSeconds() - startDate.getSeconds();

            if (seconds < 0) { seconds += 60; minutes--; }
            if (minutes < 0) { minutes += 60; hours--; }
            if (hours < 0) { hours += 24; days--; }
            if (days < 0) {
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
                months--;
            }
            if (months < 0) { months += 12; years--; }

            setTimeElapsed({ years, months, days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isUnlocked, coupleData.anniversary]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#fca5a5] to-[#f472b6] flex items-center justify-center p-6">
                <Heart className="h-12 w-12 text-white animate-pulse" />
            </div>
        );
    }

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#fca5a5] to-[#f472b6] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* Decorative floating hearts in background */}
                <div className="absolute top-10 left-10 text-white/20 animate-pulse"><Heart size={40} fill="currentColor" /></div>
                <div className="absolute bottom-40 right-10 text-white/20 animate-bounce"><Heart size={60} fill="currentColor" /></div>

                {/* Bow Icon */}
                <div className="mb-4 drop-shadow-md">
                    <span className="text-6xl filter drop-shadow-sm">🎀</span>
                </div>
                
                <h1 className="text-3xl font-extrabold text-white mb-1 tracking-wide font-serif drop-shadow-sm">Minha Senha</h1>
                <p className="text-white/90 mb-8 font-medium text-sm tracking-wide">uma data especial para nós</p>

                {/* Password Input Display */}
                <div className={`flex items-center bg-white/30 backdrop-blur-md rounded-2xl px-6 py-4 mb-10 w-72 shadow-lg border ${error ? 'border-red-400 animate-shake text-red-100 bg-red-400/40' : 'border-white/50 text-white'} transition-all duration-300`}>
                    <Lock className={`h-6 w-6 mr-4 ${error ? 'text-red-200' : 'text-white'}`} />
                    <div className="flex-1 text-center tracking-[0.5em] font-black text-2xl">
                        {passwordAttempt || <span className="opacity-0">0</span>}
                    </div>
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-4 md:gap-5 mb-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button 
                            key={num} 
                            onClick={() => handleKeyPress(num.toString())}
                            className="w-20 h-20 rounded-2xl bg-white/20 text-white font-black text-3xl hover:bg-white/40 active:scale-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 outline-none flex items-center justify-center backdrop-blur-md"
                        >
                            {num}
                        </button>
                    ))}
                    <button 
                        onClick={() => handleKeyPress('*')}
                        className="w-20 h-20 rounded-2xl bg-white/20 text-white font-black text-4xl hover:bg-white/40 active:scale-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 outline-none flex items-center justify-center pb-2 backdrop-blur-md"
                    >
                        *
                    </button>
                    <button 
                        onClick={() => handleKeyPress('0')}
                        className="w-20 h-20 rounded-2xl bg-white/20 text-white font-black text-3xl hover:bg-white/40 active:scale-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 outline-none flex items-center justify-center backdrop-blur-md"
                    >
                        0
                    </button>
                    <button 
                        onClick={() => handleKeyPress('delete')}
                        className="w-20 h-20 rounded-2xl bg-white/20 text-white font-black text-2xl hover:bg-white/40 active:scale-90 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20 outline-none flex items-center justify-center backdrop-blur-md"
                    >
                        ⌫
                    </button>
                </div>

                {/* Polaroid Hint */}
                <div className="bg-white p-3 pb-8 shadow-2xl rotate-[3deg] rounded-sm w-40 border border-gray-100 mt-auto hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
                    <img src={coupleData.photos[0]} alt="Nós" className="w-full aspect-square object-cover" />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
        <div className="min-h-screen bg-[#faf8f5] font-serif text-gray-800 pb-20">
            {/* New Hero Section: Nossa Jornada do Amor */}
            <header className="pt-16 pb-24 px-4 text-center bg-[#f4a1bb] text-white relative overflow-hidden font-sans">
                <div className="relative z-10 max-w-md mx-auto">
                    <h1 className="text-3xl font-extrabold text-pink-600 mb-2 font-serif tracking-tight">Nossa jornada do amor</h1>
                    <p className="text-pink-500 font-bold mb-6 text-sm tracking-wide">há quanto tempo estamos juntos?</p>
                    
                    <Heart className="mx-auto text-pink-600 fill-pink-600 mb-8 h-8 w-8 animate-pulse" />

                    <div className="w-48 h-48 rounded-full border-4 border-pink-300 shadow-xl overflow-hidden mx-auto mb-10 relative">
                        <img src={coupleData.photos[0]} alt="Casal" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-4">
                        {/* Box 1: Anos, Meses, Dias */}
                        <div className="bg-white rounded-2xl p-4 shadow-lg text-pink-600 flex justify-center items-center gap-4">
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.years}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Anos</span>
                            </div>
                            <span className="text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.months}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Meses</span>
                            </div>
                            <span className="text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.days}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Dias</span>
                            </div>
                        </div>

                        {/* Box 2: Horas, Minutos, Segundos */}
                        <div className="bg-white rounded-2xl p-4 shadow-lg text-pink-600 flex justify-center items-center gap-4">
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.hours}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Horas</span>
                            </div>
                            <span className="text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.minutes}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Minutos</span>
                            </div>
                            <span className="text-2xl font-bold pb-4">:</span>
                            <div className="flex flex-col items-center min-w-[60px]">
                                <span className="text-4xl font-black">{timeElapsed.seconds}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Segundos</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-pink-600 font-bold tracking-wide text-sm">
                        ❤️ Eu te amo todo esse tempo ❤️
                    </p>
                </div>
                
                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.2,192.39,107.74C236.72,98.89,280.4,80.7,321.39,56.44Z" className="fill-[#faf8f5]"></path>
                    </svg>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 space-y-16 mt-8">
                
                {/* Jornalzinho Section (Realistic Newspaper Style) */}
                <section className="bg-[#e5e5e5] p-2 md:p-6 rounded-sm shadow-2xl border-[12px] border-[#f0f0f0] relative max-w-3xl mx-auto transform -rotate-1 mb-20 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-[#f4f4f0] p-6 md:p-10 shadow-inner border border-gray-300 relative">
                        {/* Newspaper Texture overlay (subtle) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                        {/* Header */}
                        <div className="border-b-[6px] border-double border-gray-900 pb-2 mb-3 text-center relative z-10">
                            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tighter uppercase" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                CASAL DO ANO
                            </h2>
                        </div>
                        
                        {/* Sub-header info row */}
                        <div className="flex justify-between items-center text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-800 border-b-2 border-gray-900 pb-2 mb-6 relative z-10" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                            <span>15 de abril</span>
                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                            <span>{coupleData.name1} e {coupleData.name2}</span>
                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                            <span>Edição Especial</span>
                        </div>
                        
                        {/* Newspaper Body - Wrapping with Float */}
                        <div className="relative z-10 clear-both font-serif mt-6">
                            <div className="mb-4">
                                <h3 className="text-4xl font-bold text-gray-900 leading-[0.9] mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Nossa<br/><span className="ml-10">História</span></h3>
                            </div>
                            
                            {(() => {
                                const story = coupleData.aiStory || '';
                                
                                // Divide os parágrafos para espalhar as fotos naturalmente
                                const paragraphs = story.split(/\n+/).filter(p => p.trim().length > 0);
                                const midPoint = Math.max(1, Math.floor(paragraphs.length / 2));

                                return (
                                    <div className="text-sm leading-relaxed text-gray-800 text-justify flow-root" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                        {paragraphs.map((para, idx) => (
                                            <div key={idx} className="mb-3">
                                                {/* Foto 1 no primeiro parágrafo */}
                                                {idx === 0 && coupleData.photos && coupleData.photos.length > 0 && (
                                                    <img 
                                                        src={coupleData.photos[0]} 
                                                        className="float-right w-1/2 md:w-5/12 ml-5 mb-2 object-cover shadow-sm border border-gray-400 p-1 bg-white" 
                                                        alt="Casal foto 1" 
                                                    />
                                                )}
                                                
                                                {/* Foto 2 no parágrafo do meio */}
                                                {idx === midPoint && coupleData.photos && coupleData.photos.length > 1 && (
                                                    <img 
                                                        src={coupleData.photos[1]} 
                                                        className="float-left w-1/2 md:w-5/12 mr-5 mb-2 mt-2 object-cover shadow-sm border border-gray-400 p-1 bg-white clear-left" 
                                                        alt="Casal foto 2" 
                                                    />
                                                )}
                                                
                                                <span className="whitespace-pre-wrap">{para}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* YouTube Video Embed - Clean Newspaper style */}
                        {coupleData.youtubeLink && (() => {
                            const match = coupleData.youtubeLink.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                            const videoId = (match && match[2].length === 11) ? match[2] : null;
                            
                            if (videoId) {
                                return (
                                    <div className="mt-10 border-t-[4px] border-double border-gray-300 pt-8 relative z-10 flex flex-col items-center">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px w-12 bg-gray-400"></div>
                                            <Music className="h-5 w-5 text-gray-600" />
                                            <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-800" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Nossa Trilha Sonora</p>
                                            <div className="h-px w-12 bg-gray-400"></div>
                                        </div>
                                        
                                        <div className="w-full max-w-lg bg-white p-3 md:p-4 shadow-xl border border-gray-200 transform rotate-1 hover:rotate-0 transition-transform duration-500 rounded-sm">
                                            <div className="rounded-sm overflow-hidden bg-gray-900 shadow-inner">
                                                <iframe 
                                                    width="100%" 
                                                    height="280" 
                                                    src={`https://www.youtube.com/embed/${videoId}?controls=1&showinfo=0&rel=0`} 
                                                    title="Nossa Trilha Sonora" 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                    className="opacity-90 hover:opacity-100 transition-opacity"
                                                ></iframe>
                                            </div>
                                            <p className="text-center text-xs text-gray-500 mt-3 font-sans italic">Aumente o som para relembrar...</p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </section>

                {/* Mural de Fotos Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <Camera className="text-rose-500" />
                        <h3 className="text-3xl font-bold font-sans tracking-tight">Nossos Momentos</h3>
                        <Camera className="text-rose-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {coupleData.photos.map((src, idx) => (
                            <div key={idx} className="aspect-square bg-white p-3 rounded-sm shadow-md hover:scale-105 transition-transform rotate-1 even:-rotate-2">
                                <img src={src} className="w-full h-full object-cover" alt={`Momento ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* O Dia Que Começou Tudo */}
                <section className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-[2rem] border border-rose-100 shadow-lg text-center mb-20">
                    <Heart className="mx-auto text-rose-500 mb-4 h-10 w-10 fill-rose-100" />
                    <h3 className="text-3xl font-bold font-sans tracking-tight mb-6">O Dia Que Começou Tudo</h3>
                    
                    <div className="flex flex-col items-center gap-4 font-sans text-gray-700">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Calendar className="h-5 w-5 text-rose-500" />
                            <span className="font-bold">{coupleData.meetDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <Mail className="h-5 w-5 text-pink-500" />
                            <span className="font-bold">{coupleData.meetLocation}</span>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-lg font-medium italic text-gray-600 max-w-xl mx-auto">
                        "{coupleData.meetStory}"
                    </p>
                </section>

            </main>
        </div>
        </ErrorBoundary>
    );
}
