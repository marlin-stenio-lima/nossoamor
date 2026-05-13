

const API_KEYS = [
    import.meta.env.VITE_ABACATE_KEY_1,
    import.meta.env.VITE_ABACATE_KEY_2,
    import.meta.env.VITE_ABACATE_KEY_3,
].filter(Boolean) as string[];

const BASE_URL = "https://api.abacatepay.com/v1";

export class AbacatePayService {
    private static async request(endpoint: string, options: any = {}) {
        try {
            console.log(`AbacatePay: Calling proxy for ${endpoint}`);

            const response = await fetch('/api/abacate-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint,
                    method: options.method || 'GET',
                    body: options.body ? JSON.parse(options.body) : undefined
                }),
            });

            const text = await response.text();

            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(text);
                } catch {
                    errorData = { error: text || 'Unknown error' };
                }
                console.error("AbacatePay Proxy Error:", errorData);
                
                // --- MOCK FALLBACK FOR LOCAL DEV ---
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.warn("Using MOCK AbacatePay response for local development due to proxy failure.");
                    return this.getMockResponse(endpoint);
                }
                
                throw new Error(errorData.error || `Proxy Error (${response.status})`);
            }

            try {
                const result = JSON.parse(text);
                console.log("AbacatePay Proxy Success:", result);
                return result;
            } catch (e) {
                // If it's a 200 OK but empty or invalid JSON, use mock locally
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.warn("Using MOCK AbacatePay response for local development (Invalid JSON).");
                    return this.getMockResponse(endpoint);
                }
                throw new Error("Invalid JSON response from proxy.");
            }
        } catch (error: any) {
            console.error("AbacatePay Service Error:", error.message);
            // Fallback to mock on network error if local
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn("Using MOCK AbacatePay response for local development (Network Error).");
                return this.getMockResponse(endpoint);
            }
            throw error;
        }
    }

    private static getMockResponse(endpoint: string) {
        if (endpoint.includes('/pixQrCode/create') || endpoint.includes('/billing/create')) {
            return {
                data: {
                    id: 'mock_billing_id_123',
                    brCode: '00020101021126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913MOCK RECEIVER6009SAO PAULO62070503***6304ABCD', // Fake valid payload
                    status: 'PENDING'
                }
            };
        }
        if (endpoint.includes('/pixQrCode/check')) {
            // Simulate payment success after a few seconds
            return {
                data: {
                    status: 'PAID'
                }
            };
        }
        return {};
    }

    static async createBilling(data: {
        customer: { name: string; email: string; cellphone: string; taxId: string };
        amount: number; // in cents
        description: string;
    }) {
        // Sanitize
        let cleanPhone = data.customer.cellphone.replace(/\D/g, '');
        if (cleanPhone.length === 11 || cleanPhone.length === 10) {
            cleanPhone = '55' + cleanPhone;
        }
        const cleanTaxId = data.customer.taxId.replace(/\D/g, '');

        const payload = {
            frequency: "ONE_TIME",
            methods: ["PIX"],
            products: [
                {
                    externalId: "enem-pro-sub",
                    name: "Assinatura ENEM Pro",
                    description: data.description,
                    quantity: 1,
                    price: data.amount
                }
            ],
            returnUrl: window.location.origin + "/thank-you",
            completionUrl: window.location.origin + "/thank-you",
            customerId: cleanTaxId, // Using CPF as ID or unique
            customer: {
                name: data.customer.name,
                email: data.customer.email,
                cellphone: cleanPhone,
                taxId: cleanTaxId
            },
            metadata: {
                source: "enem-pro-checkout"
            }
        };

        console.log("AbacatePay: Creating Billing with payload:", payload);

        return this.request('/billing/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    static async createPixCharge(data: {
        customer: { name: string; email: string; cellphone: string; taxId: string };
        amount: number; // in cents
        description: string;
    }) {
        let cleanPhone = data.customer.cellphone.replace(/\D/g, '');
        if (cleanPhone.length === 11 || cleanPhone.length === 10) {
            cleanPhone = '55' + cleanPhone;
        }
        const cleanTaxId = data.customer.taxId.replace(/\D/g, '');

        const payload = {
            amount: data.amount,
            expiresIn: 3600, // 1 hour
            description: data.description.substring(0, 37), // Max 37 chars
            customer: {
                name: data.customer.name,
                email: data.customer.email,
                cellphone: cleanPhone,
                taxId: cleanTaxId
            },
            metadata: {
                source: "enem-pro-checkout"
            }
        };

        // Debug log
        console.log("AbacatePay: Creating PIX charge with payload:", payload);

        return this.request('/pixQrCode/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    static async createExtraEssayCharge(user: { name: string; email: string; cellphone: string; taxId: string }) {
        return this.createPixCharge({
            customer: user,
            amount: 499, // R$ 4,99
            description: "Correção Extra ENEM Pro"
        });
    }

    static async createUpgradeCharge(user: { name: string; email: string; cellphone: string; taxId: string }, amountDiff: number, newPlanName: string) {
        return this.createPixCharge({
            customer: user,
            amount: amountDiff,
            description: `Upgrade para ${newPlanName}`
        });
    }

    static async checkPaymentStatus(pixId: string) {
        const response = await this.request(`/pixQrCode/check?id=${pixId}`);
        console.log("AbacatePay Raw Check Response:", response);
        return response;
    }
}
