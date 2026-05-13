import { useState, useEffect, useRef } from 'react';
import { Heart, Camera, BookOpen, QrCode, Lock, ArrowRight, CheckCircle2, Sparkles, Download, Wand2, X, Copy, Check, Eye, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';

export default function DashboardHome() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Initialize state from localStorage to prevent wipe on first render
    const getSavedData = () => {
        const savedData = localStorage.getItem('nossoAmorData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                return {};
            }
        }
        return {};
    };

    const saved = getSavedData();

    const [currentStep, setCurrentStep] = useState(1);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>(saved.photoPreviews || []);
    const [loveLetter, setLoveLetter] = useState(saved.loveLetter || '');
    const [aiAnswers, setAiAnswers] = useState({ q1: '', q2: '', q3: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [youtubeLink, setYoutubeLink] = useState(saved.youtubeLink || '');
    const [password, setPassword] = useState(saved.password || '');
    const [names, setNames] = useState(saved.names || '');
    const [newspaperTitle, setNewspaperTitle] = useState(saved.newspaperTitle || '');
    const [anniversary, setAnniversary] = useState(saved.anniversary || '');
    const [linkCopied, setLinkCopied] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Removed load useEffect since we initialize state synchronously

    // Save to localStorage whenever data changes
    useEffect(() => {
        const dataToSave = {
            photoPreviews,
            loveLetter,
            youtubeLink,
            password,
            names,
            newspaperTitle,
            anniversary
        };
        try {
            localStorage.setItem('nossoAmorData', JSON.stringify(dataToSave));
        } catch (e) {
            console.error("Local storage quota exceeded. Could not save all data.");
        }
    }, [photoPreviews, loveLetter, youtubeLink, password, names, newspaperTitle, anniversary]);

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX = 800;
                    if (width > height) {
                        if (width > MAX) {
                            height *= MAX / width;
                            width = MAX;
                        }
                    } else {
                        if (height > MAX) {
                            width *= MAX / height;
                            height = MAX;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const base64Promises = newFiles.map(file => compressImage(file));
            const newBase64s = await Promise.all(base64Promises);
            const combinedPreviews = [...photoPreviews, ...newBase64s].slice(0, 30);
            setPhotoPreviews(combinedPreviews);
        }
    };

    const removePhoto = (index: number) => {
        const newPreviews = [...photoPreviews];
        newPreviews.splice(index, 1);
        setPhotoPreviews(newPreviews);
    };

    const generateWithAI = async () => {
        const fullPrompt = `História: ${aiAnswers.q1}. O que eu admiro: ${aiAnswers.q2}. Momento inesquecível: ${aiAnswers.q3}.`;
        if (!aiAnswers.q1 && !aiAnswers.q2 && !aiAnswers.q3) return;
        setIsGenerating(true);
        try {
            let letter = '';
            try {
                const response = await fetch('/api/openai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'Você é um assistente especialista em escrever cartas de amor emocionantes e românticas. O usuário vai te dar um contexto sobre o casal, respondendo perguntas chaves. Você deve escrever uma carta em primeira pessoa (de um parceiro para o outro), usando as informações fornecidas. A carta deve ser apaixonada, poética, com parágrafos bem definidos. Mantenha em torno de 3 a 4 parágrafos e use um tom natural e sincero.' },
                            { role: 'user', content: fullPrompt }
                        ],
                        model: 'gpt-4o-mini'
                    })
                });

                if (!response.ok) throw new Error('API proxy failed');
                const data = await response.json();
                letter = data.choices[0].message.content;
            } catch (proxyError) {
                console.warn("Proxy failed, trying direct OpenAI call (Local Dev Fallback)", proxyError);
                const directResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'Você é um assistente especialista em escrever cartas de amor emocionantes e românticas. O usuário vai te dar um contexto sobre o casal, respondendo perguntas chaves. Você deve escrever uma carta em primeira pessoa (de um parceiro para o outro), usando as informações fornecidas. A carta deve ser apaixonada, poética, com parágrafos bem definidos. Mantenha em torno de 3 a 4 parágrafos e use um tom natural e sincero.' },
                            { role: 'user', content: fullPrompt }
                        ],
                        model: 'gpt-4o-mini'
                    })
                });
                
                if (!directResponse.ok) throw new Error('Direct OpenAI call failed');
                const directData = await directResponse.json();
                letter = directData.choices[0].message.content;
            }
            
            setLoveLetter(letter);
            setAiAnswers({ q1: '', q2: '', q3: '' });
        } catch (error) {
            console.error("AI Generation failed entirely, using fallback text:", error);
            const mockResponse = `Meu amor,\n\nDesde o momento em que nossas vidas se cruzaram, tudo mudou para melhor. Lembro de cada detalhe nosso e, ao ver a forma como nos amamos, meu coração se enche de alegria por saber que fomos feitos um para o outro.\n\nCada sorriso seu é a razão do meu, e cada abraço é onde encontro a minha paz. Você é o meu presente mais precioso e eu prometo te amar cada dia mais, por toda a nossa vida.\n\nCom todo o amor do mundo,\nSeu amor.`;
            setLoveLetter(mockResponse);
            setAiAnswers({ q1: '', q2: '', q3: '' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFinalize = async () => {
        setIsSaving(true);
        try {
            if (!password) {
                alert('Por favor, volte ao Passo 1 e defina uma senha para proteger sua surpresa.');
                setStep(1);
                setIsSaving(false);
                return;
            }

            const data = {
                password: password,
                names: names,
                newspaper_title: newspaperTitle,
                anniversary: anniversary,
                photos: photoPreviews,
                ai_story: loveLetter,
                youtube_link: youtubeLink
            };

            const { error } = await supabase
                .from('couple_gifts')
                .upsert(data, { onConflict: 'password' });

            if (error) {
                console.error("Erro ao salvar no Supabase:", error);
                alert("Erro ao salvar no banco de dados. Tente novamente.");
            } else {
                setStep(4);
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
            alert("Erro inesperado ao salvar. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyLink = () => {
        const url = window.location.origin + '/p/' + (password || 'demo');
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "Presente-Nosso-Amor-QR.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    useEffect(() => {
        if (location.pathname.includes('/exportar')) setCurrentStep(4);
        else if (location.pathname.includes('/configurar')) setCurrentStep(2);
        else setCurrentStep(1);
    }, [location.pathname]);

    const setStep = (step: number) => {
        setCurrentStep(step);
        if (step === 4) navigate('/app/exportar');
        else if (step === 2 || step === 3) navigate('/app/configurar');
        else navigate('/app');
    };

    const STEPS = [
        { id: 1, title: 'A Senha (A Data)', desc: 'Configure a data do namoro', icon: Lock },
        { id: 2, title: 'As Fotos', desc: 'Faça upload das melhores memórias', icon: Camera },
        { id: 3, title: 'Declaração', desc: 'Escreva ou gere com IA', icon: BookOpen },
        { id: 4, title: 'O Presente', desc: 'Gere o QR Code', icon: QrCode },
    ];

    const progress = currentStep * 25;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 pt-6 lg:pt-10 font-sans">
            {/* Header com Correção Responsiva (Paddings ajustados para Mobile) */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-rose-200 relative overflow-hidden mt-12 md:mt-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm mb-4">
                            <Sparkles className="h-4 w-4" /> Vamos criar a surpresa perfeita
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 font-serif italic">Painel do Presente</h1>
                        <p className="text-rose-100 text-sm md:text-lg max-w-xl">Complete os passos abaixo para gerar a página exclusiva do casal e o QR Code Mágico.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-center w-full md:w-auto min-w-[200px]">
                        <p className="text-xs md:text-sm font-medium text-rose-100 uppercase tracking-widest mb-2">Progresso</p>
                        <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl md:text-5xl font-black">{progress}</span>
                            <span className="text-lg md:text-xl font-bold pb-1">%</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {STEPS.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    
                    return (
                        <div 
                            key={step.id} 
                            onClick={() => setStep(step.id)}
                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${isCurrent ? 'border-rose-500 bg-rose-50 shadow-md transform md:scale-105 z-10' : isCompleted ? 'border-green-100 bg-white opacity-90' : 'border-gray-100 bg-white opacity-60 hover:opacity-100 hover:border-rose-200'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isCurrent ? 'bg-rose-500 text-white' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Passo {step.id}</p>
                            <h3 className={`text-xl font-bold mb-2 ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>{step.title}</h3>
                            <p className="text-gray-500 text-sm">{step.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Current Action Area */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10"></div>
                
                {/* STEP 1 */}
                {currentStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                            <Lock className="h-6 md:h-8 w-6 md:w-8 text-rose-500" />
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Configurar: Senha de Acesso</h2>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm md:text-base">Configure as informações principais do seu presente.</p>
                        
                        <div className="max-w-md space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Data do Início (Será a Senha de Acesso)</label>
                                <input 
                                    type="date" 
                                    value={anniversary}
                                    onChange={(e) => {
                                        setAnniversary(e.target.value);
                                        const date = e.target.value.split('-');
                                        if (date.length === 3) {
                                            setPassword(`${date[2]}${date[1]}${date[0].substring(2)}`);
                                        }
                                    }}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                                />
                                {password && <p className="text-xs text-green-600 mt-1 font-medium">A senha gerada automaticamente será: {password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nome de Vocês</label>
                                <input 
                                    type="text" 
                                    value={names}
                                    onChange={(e) => setNames(e.target.value)}
                                    placeholder="Ex: João e Maria" 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Título do Jornalzinho</label>
                                <input 
                                    type="text" 
                                    value={newspaperTitle}
                                    onChange={(e) => setNewspaperTitle(e.target.value)}
                                    placeholder="Ex: CASAL DO ANO" 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setStep(2)} className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg w-full md:w-auto justify-center">
                                Salvar e Continuar <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                            <Camera className="h-6 md:h-8 w-6 md:w-8 text-rose-500" />
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Configurar: As Fotos</h2>
                        </div>
                        
                        <div 
                            className="bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl p-8 md:p-12 text-center hover:bg-rose-100 hover:border-rose-300 transition-colors cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handlePhotoSelect}
                            />
                            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform border border-rose-100">
                                <Camera className="h-8 w-8 text-rose-500" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Arraste as fotos de vocês aqui</h3>
                            <p className="text-sm md:text-base text-gray-500">Ou clique para selecionar (Recomendado 2 a 30 fotos)</p>
                            <button className="mt-6 bg-white text-rose-600 border border-rose-200 px-6 py-2.5 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-rose-50 transition-all">
                                Selecionar Fotos
                            </button>
                        </div>

                        {photoPreviews.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                                    <span>Fotos Selecionadas ({photoPreviews.length}/30)</span>
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {photoPreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm group">
                                            <img src={preview} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                                                    className="bg-white/20 hover:bg-red-500 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setStep(3)} className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg w-full md:w-auto justify-center">
                                Salvar Fotos <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                            <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-rose-500" />
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">A Carta de Amor</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-8 items-stretch">
                            <div className="flex flex-col space-y-4">
                                <p className="text-gray-600 font-medium mb-2 text-sm md:text-base">Escreva uma declaração especial ou peça para a nossa IA escrever uma para você baseada em algumas palavras.</p>
                                
                                <textarea 
                                    className="w-full flex-grow border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none font-medium text-gray-800 leading-relaxed min-h-[300px]" 
                                    placeholder="Meu amor, desde o dia que te conheci..."
                                    value={loveLetter}
                                    onChange={(e) => setLoveLetter(e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Wand2 className="h-6 w-6 text-indigo-600" />
                                    <h3 className="font-bold text-indigo-900 text-lg">Criar Carta com IA</h3>
                                </div>
                                <p className="text-sm text-indigo-700/80 mb-4">Responda a essas 3 perguntinhas rápidas para a nossa IA escrever uma carta perfeita:</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-indigo-900 mb-1">1. Como vocês se conheceram?</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Numa festa da faculdade..." 
                                            value={aiAnswers.q1}
                                            onChange={(e) => setAiAnswers({...aiAnswers, q1: e.target.value})}
                                            className="w-full border border-indigo-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-indigo-900 mb-1">2. O que você mais admira nela(e)?</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: O sorriso maravilhoso..." 
                                            value={aiAnswers.q2}
                                            onChange={(e) => setAiAnswers({...aiAnswers, q2: e.target.value})}
                                            className="w-full border border-indigo-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500 bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-indigo-900 mb-1">3. Algum momento inesquecível ou apelido?</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: Nossa viagem pra praia..." 
                                            value={aiAnswers.q3}
                                            onChange={(e) => setAiAnswers({...aiAnswers, q3: e.target.value})}
                                            className="w-full border border-indigo-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500 bg-white" 
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={generateWithAI}
                                    disabled={isGenerating || (!aiAnswers.q1 && !aiAnswers.q2 && !aiAnswers.q3)}
                                    className={`w-full ${isGenerating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gerando mágica...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" /> Gerar Declaração
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* YouTube Music Link */}
                        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                                <h3 className="font-bold text-rose-900 text-lg">A Música de Vocês</h3>
                            </div>
                            <p className="text-sm text-rose-700/80 mb-4">Adicione o link de uma música do YouTube que vai tocar no final da carta.</p>
                            <input 
                                type="text" 
                                placeholder="Ex: https://www.youtube.com/watch?v=..." 
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                className="w-full border border-rose-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none text-sm" 
                            />
                        </div>

                        <div className="mt-16 w-full max-w-4xl mx-auto flex flex-col items-center">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 w-full px-2">
                                <div className="flex items-center gap-3">
                                    <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Simulação Real do Presente</h2>
                                </div>
                                <button 
                                    onClick={() => window.open('/p/' + (password || 'demo'), '_blank')}
                                    className="bg-white text-rose-600 border border-rose-200 px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-rose-50 transition-all flex items-center gap-2 text-sm"
                                >
                                    <ExternalLink className="h-4 w-4" /> Visualizar Presente
                                </button>
                            </div>
                            
                            <div className="w-full flex justify-center bg-gray-50/50 p-4 md:p-8 rounded-[2rem] border border-gray-100 shadow-inner mb-8">
                                <div className="w-full max-w-[500px] bg-white border border-gray-200 shadow-lg p-6">
                                    <div className="border-b-[4px] border-double border-gray-900 pb-2 mb-3 text-center">
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter uppercase" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                            {newspaperTitle || 'CASAL DO ANO'}
                                        </h2>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-gray-800 border-b-2 border-gray-900 pb-2 mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                        <span>{anniversary ? anniversary.split('-').reverse().join('/') : '15 DE ABRIL'}</span>
                                        <span className="w-1 h-1 bg-gray-900 rounded-full"></span>
                                        <span>{names || 'EDIÇÃO ESPECIAL'}</span>
                                    </div>
                                    
                                    <div className="relative z-10 clear-both font-serif mt-6">
                                        <div className="mb-4">
                                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-[0.9] mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Nossa<br/><span className="ml-10">História</span></h3>
                                        </div>
                                        
                                        {(() => {
                                            const story = loveLetter || 'Sua carta de amor vai aparecer aqui...';
                                            
                                            // Divide os parágrafos para espalhar as fotos naturalmente
                                            const paragraphs = story.split(/\n+/).filter(p => p.trim().length > 0);
                                            const midPoint = Math.max(1, Math.floor(paragraphs.length / 2));

                                            return (
                                                <div className="text-xs md:text-sm leading-relaxed text-gray-800 text-justify flow-root" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                                    
                                                    {paragraphs.map((para, idx) => (
                                                        <div key={idx} className="mb-3">
                                                            {/* Foto 1 no primeiro parágrafo */}
                                                            {idx === 0 && photoPreviews.length > 0 && (
                                                                <img 
                                                                    src={photoPreviews[0]} 
                                                                    className="float-right w-1/2 md:w-5/12 ml-4 mb-2 object-cover shadow-sm border border-gray-400 p-1 bg-white" 
                                                                    alt="Casal foto 1" 
                                                                />
                                                            )}
                                                            
                                                            {/* Foto 2 no parágrafo do meio */}
                                                            {idx === midPoint && photoPreviews.length > 1 && (
                                                                <img 
                                                                    src={photoPreviews[1]} 
                                                                    className="float-left w-1/2 md:w-5/12 mr-4 mb-2 mt-2 object-cover shadow-sm border border-gray-400 p-1 bg-white clear-left" 
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

                                    {youtubeLink && (() => {
                                        const match = youtubeLink.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                                        const videoId = (match && match[2].length === 11) ? match[2] : null;
                                        
                                        if (videoId) {
                                            return (
                                                <div className="mt-6 border-t-[2px] border-double border-gray-900 pt-4">
                                                    <p className="text-center text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>- NOSSA TRILHA SONORA -</p>
                                                    <div className="rounded-none overflow-hidden border border-gray-900">
                                                        <iframe 
                                                            width="100%" 
                                                            height="250" 
                                                            src={`https://www.youtube.com/embed/${videoId}?controls=1&showinfo=0&rel=0`} 
                                                            title="YouTube video player" 
                                                            frameBorder="0" 
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleFinalize} 
                                disabled={isSaving}
                                className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg w-full md:w-auto justify-center disabled:opacity-50"
                            >
                                {isSaving ? 'Salvando...' : 'Finalizar Presente'} <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                            <QrCode className="h-6 md:h-8 w-6 md:w-8 text-rose-500" />
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Seu QR Code Mágico</h2>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-8">
                            {/* The Printable Frame */}
                            <div id="print-frame" className="bg-white p-8 rounded-3xl shadow-2xl shadow-rose-100 border-2 border-rose-100 flex flex-col items-center max-w-sm w-full relative">
                                <div className="absolute top-4 left-4 text-rose-300"><Heart className="h-6 w-6 fill-rose-300" /></div>
                                <div className="absolute top-4 right-4 text-rose-300"><Heart className="h-6 w-6 fill-rose-300" /></div>
                                <div className="absolute bottom-4 left-4 text-rose-300"><Heart className="h-6 w-6 fill-rose-300" /></div>
                                <div className="absolute bottom-4 right-4 text-rose-300"><Heart className="h-6 w-6 fill-rose-300" /></div>
                                
                                <h3 className="font-serif text-2xl text-rose-900 font-bold mb-6 mt-4 text-center">Um Presente<br/>Para Você</h3>
                                
                                <div className="w-48 h-48 bg-white rounded-xl mb-6 flex items-center justify-center border-4 border-rose-50 shadow-sm relative overflow-hidden">
                                    <QRCodeSVG 
                                        id="qr-code-svg"
                                        value={window.location.origin + '/p/' + (password || 'demo')}
                                        size={160}
                                        level={"H"}
                                        includeMargin={false}
                                        fgColor={"#0f172a"}
                                    />
                                    <div className="absolute inset-0 border-[8px] border-white pointer-events-none rounded-xl"></div>
                                </div>
                                
                                <p className="font-bold text-gray-900 text-lg">Aponte a Câmera</p>
                                <p className="text-sm text-gray-500 mb-6 text-center">Para desbloquear sua surpresa</p>
                                
                                <div className="border-t-2 border-dashed border-rose-200 w-full pt-6 flex flex-col items-center">
                                    <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2">Chave de Acesso</p>
                                    <div className="bg-rose-50 px-6 py-2 rounded-full border border-rose-100">
                                        <span className="font-mono text-xl font-bold text-rose-600 tracking-wider">{password || '12345'}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-3 text-center">Guarde com carinho</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <button 
                                    onClick={handleCopyLink}
                                    className="bg-gray-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md"
                                >
                                    {linkCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                                    {linkCopied ? 'Link Copiado!' : 'Copiar Link do Presente'}
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        const printContent = document.getElementById('print-frame');
                                        if (printContent) {
                                            const originalBody = document.body.innerHTML;
                                            document.body.innerHTML = `
                                                <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:white;">
                                                    ${printContent.outerHTML}
                                                </div>
                                            `;
                                            window.print();
                                            document.body.innerHTML = originalBody;
                                            window.location.reload();
                                        }
                                    }}
                                    className="bg-rose-50 text-rose-600 border border-rose-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all shadow-sm"
                                >
                                    <Download className="h-5 w-5" /> Salvar Cartão (PDF)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
