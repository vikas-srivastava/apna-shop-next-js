import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        const { email } = req.body;

        const response = await axios.post(
            `${process.env.NEXT_PRIVATE_API_BASE_URL}/user/login`,
            {
                email,
                password: "passwordless-dummy"
            }
        );

        if (response.data?.success) {
            const customerId = response.data.data.customer_id;
            return res.status(200).json({ success: true, customerId });
        }

        return res.status(400).json({ success: false, error: response.data?.message || "Login failed" });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}