import { Lock, Download, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EBOOKS = [
    { 
        id: 1, 
        name: 'Vencendo a Ansiedade', 
        fileName: 'ansiedade.pdf',
        description: 'Técnicas simples para superar a ansiedade e o estresse.'
    },
    { 
        id: 2, 
        name: 'Vencendo a Depressão', 
        fileName: 'depressao.pdf',
        description: 'Você é o arquiteto da sua própria felicidade.'
    },
    { 
        id: 3, 
        name: 'Você no Controle', 
        fileName: 'controle.pdf',
        description: 'Adeus ejaculação precoce. E-book completo.'
    },
    { 
        id: 4, 
        name: 'Superando la Ansiedad', 
        fileName: 'ansiedad_es.pdf',
        description: 'Versão em espanhol do nosso best-seller.'
    },
    { 
        id: 5, 
        name: 'Desafio 24 Dias', 
        fileName: 'desafio24.pdf',
        description: 'Emagreça em 24 dias com nosso método comprovado.'
    }
];

export default function EbooksPage() {
    const { user } = useAuth();
    
    // Verifica se o usuário tem acesso baseado no plano (que contém os nomes dos upsells) ou se é admin
    const hasEbook = (name: string) => {
        if (user?.role === 'admin') return true;
        if (!user?.plan) return false;
        return user.plan.includes(name);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus E-books</h1>
                <p className="text-gray-500">Baixe os bônus exclusivos que você adquiriu na sua compra.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EBOOKS.map((ebook) => {
                    const unlocked = hasEbook(ebook.name);
                    
                    return (
                        <div 
                            key={ebook.id} 
                            className={`relative rounded-2xl border p-6 flex flex-col h-full transition-all duration-300 ${unlocked ? 'bg-white border-rose-200 shadow-sm hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-80'}`}
                        >
                            {!unlocked && (
                                <div className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                </div>
                            )}
                            
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${unlocked ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-500'}`}>
                                <BookOpen className="w-6 h-6" />
                            </div>
                            
                            <h3 className={`font-bold text-lg mb-2 ${unlocked ? 'text-gray-900' : 'text-gray-700'}`}>
                                {ebook.name}
                            </h3>
                            
                            <p className="text-gray-500 text-sm mb-6 flex-1">
                                {ebook.description}
                            </p>
                            
                            {unlocked ? (
                                <a 
                                    href={`/ebooks/${ebook.fileName}`} 
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar PDF
                                </a>
                            ) : (
                                <button 
                                    disabled
                                    className="w-full py-2.5 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm cursor-not-allowed"
                                >
                                    <Lock className="w-4 h-4" />
                                    Bloqueado
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-12 p-6 bg-rose-50 rounded-xl border border-rose-100 text-center text-sm">
                <p className="text-rose-800 font-medium mb-1">
                    Como colocar os arquivos?
                </p>
                <p className="text-rose-700">
                    Crie uma pasta chamada <strong className="font-mono bg-white px-1 rounded border border-rose-200">ebooks</strong> dentro da pasta <strong className="font-mono bg-white px-1 rounded border border-rose-200">public</strong> do seu projeto e coloque os arquivos lá com os nomes exatos:<br/>
                    <span className="font-mono bg-white px-1 rounded mt-2 inline-block border border-rose-200">ansiedade.pdf</span>, <span className="font-mono bg-white px-1 rounded mt-2 inline-block border border-rose-200">depressao.pdf</span>, <span className="font-mono bg-white px-1 rounded mt-2 inline-block border border-rose-200">controle.pdf</span>, <span className="font-mono bg-white px-1 rounded mt-2 inline-block border border-rose-200">ansiedad_es.pdf</span>, <span className="font-mono bg-white px-1 rounded mt-2 inline-block border border-rose-200">desafio24.pdf</span>
                </p>
            </div>
        </div>
    );
}
