import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', "true");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, name, plan } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Nosso Amor <onboarding@resend.dev>', // Default testing domain. User should verify their own domain later.
            to: [email],
            subject: 'Pagamento Confirmado! Crie o seu presente 💖',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff1f2; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(225,29,72,0.1); border: 1px solid #ffe4e6; }
                        .header { background: linear-gradient(to right, #f43f5e, #db2777); padding: 40px; text-align: center; }
                        .logo { color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: -1px; font-style: italic; font-family: Georgia, serif; }
                        .content { padding: 40px; color: #333333; line-height: 1.6; }
                        h1 { margin: 0 0 20px; font-size: 28px; font-weight: 800; color: #e11d48; font-family: Georgia, serif; font-style: italic; }
                        p { margin: 0 0 20px; font-size: 16px; color: #555555; }
                        .btn { display: block; width: 100%; text-align: center; background: linear-gradient(to right, #f43f5e, #db2777); color: #ffffff; text-decoration: none; padding: 16px 0; border-radius: 12px; font-weight: 700; margin: 30px 0; font-size: 16px; box-shadow: 0 4px 10px rgba(225,29,72,0.2); }
                        .footer { background-color: #fff1f2; padding: 20px; text-align: center; font-size: 12px; color: #f43f5e; border-top: 1px solid #ffe4e6; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">Nosso Amor 💖</div>
                        </div>
                        <div class="content">
                            <h1>Tudo Certo! 🎉</h1>
                            <p>Olá, <strong>${name || 'Apaixonado(a)'}</strong>!</p>
                            <p>Seu pagamento foi confirmado com sucesso e o seu acesso está totalmente liberado.</p>
                            <p>Agora você já pode criar o presente mais inesquecível de todos para o seu amor. Configure a data especial, escreva uma carta linda com ajuda da IA e gere o seu QR Code mágico!</p>
                            
                            <a href="https://nossoamor-dia12.vercel.app/app" class="btn">COMEÇAR A CONFIGURAR AGORA</a>
                            
                            <p style="font-size: 14px; color: #888;">
                                Qualquer dúvida, estamos aqui para ajudar a deixar o seu presente perfeito.<br>
                                Viva o amor! 🥰
                            </p>
                        </div>
                        <div class="footer">
                            © 2026 Nosso Amor. Feito com muito carinho.
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
