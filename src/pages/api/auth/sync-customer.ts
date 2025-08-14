import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

type Data =
    | { success: true; customerId: string }
    | { success: false; error: string };

function devEnabled() {
    return process.env.DEV_AUTH === "true" || process.env.NEXT_PUBLIC_DEV_AUTH === "true";
}

function isLocalRequest(req: NextApiRequest) {
    const host = (req.headers.host || "").toLowerCase();
    if (!host) return false;
    return (
        host.startsWith("localhost") ||
        host.startsWith("127.0.0.1") ||
        host.startsWith("[::1]") ||
        host.startsWith("0.0.0.0") ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
        host.endsWith(".local")
    );
}

function devCustomerId(email: string) {
    try {
        const hex = Buffer.from(email).toString("hex").slice(0, 16);
        return `dev_${hex}`;
    } catch {
        return `dev_${Date.now()}`;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const baseUrl = process.env.THIRD_PARTY_API_URL;
    const tenantId = (process.env.NEXT_PUBLIC_TENANT_ID as string) || (req.headers["x-tenant"] as string) || "";

    // If tenant is missing and dev is enabled, mint a deterministic dev customer id
    if (!tenantId && devEnabled()) {
        try {
            const { email } = req.body as { email?: string };
            if (!email) return res.status(400).json({ success: false, error: "email is required" });
            return res.status(200).json({ success: true, customerId: devCustomerId(email) });
        } catch (e: any) {
            return res.status(500).json({ success: false, error: e?.message || "Dev auth error" });
        }
    }

    // If no upstream configured and dev is enabled, mint a deterministic dev customer id
    if (!baseUrl && devEnabled()) {
        try {
            const { email } = req.body as { email?: string };
            if (!email) return res.status(400).json({ success: false, error: "email is required" });
            return res.status(200).json({ success: true, customerId: devCustomerId(email) });
        } catch (e: any) {
            return res.status(500).json({ success: false, error: e?.message || "Dev auth error" });
        }
    }

    if (!baseUrl) {
        return res.status(500).json({ success: false, error: "THIRD_PARTY_API_URL not configured" });
    }

    try {
        const { email, name, gender } = req.body as {
            email: string;
            name?: string;
            gender?: "male" | "female";
        };

        if (!email) {
            return res.status(400).json({ success: false, error: "email is required" });
        }

        // 1) Try to login (passwordless shim)
        try {
            const loginRes = await axios.post(`${baseUrl}/user/login`, {
                email,
                password: "passwordless-dummy",
            }, {
                headers: {
                    'X-Tenant': tenantId,
                    ...(process.env.NEXT_PUBLIC_TOKEN ? { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } : {})
                }
            });

            if (loginRes.data?.success && loginRes.data?.data?.customer_id) {
                return res.status(200).json({
                    success: true,
                    customerId: loginRes.data.data.customer_id,
                });
            }
        } catch (e) {
            // If login failed with 4xx, we will attempt register flow below
            const err = e as AxiosError;
            if (err.response && err.response.status >= 400 && err.response.status < 500) {
                // continue to register
            } else {
                // For network or 5xx errors: allow dev fallback if enabled
                if (devEnabled()) {
                    return res.status(200).json({ success: true, customerId: devCustomerId(email) });
                }
                // Otherwise bubble meaningful error
                const msg =
                    (err.response?.data as any)?.message ||
                    err.message ||
                    (err.response ? "Upstream login error" : "Upstream login unavailable");
                return res.status(502).json({ success: false, error: msg });
            }
        }

        // 2) If login failed, try to register (idempotent upsert via email)
        try {
            const registerRes = await axios.post(`${baseUrl}/user/register`, {
                name: name || email.split("@")[0],
                email,
                gender: gender || "male",
                password: "passwordless-dummy",
                password_confirmation: "passwordless-dummy",
            }, {
                headers: {
                    'X-Tenant': tenantId,
                    ...(process.env.NEXT_PUBLIC_TOKEN ? { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } : {})
                }
            });

            if (registerRes.data?.success && registerRes.data?.data?.customer_id) {
                return res.status(200).json({
                    success: true,
                    customerId: registerRes.data.data.customer_id,
                });
            }

            return res.status(400).json({
                success: false,
                error: registerRes.data?.message || "Registration failed",
            });
        } catch (e) {
            const err = e as AxiosError;
            // Dev fallback when enabled
            if (devEnabled()) {
                return res.status(200).json({ success: true, customerId: devCustomerId(email) });
            }
            const msg =
                (err.response?.data as any)?.message ||
                err.message ||
                "Registration error";
            return res.status(502).json({ success: false, error: msg });
        }
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Internal server error" });
    }
}