/**
 * Utility to handle API calls for the Chatbot
 */

export async function sendChatMessage(message: string, product_id: string | null, order_id: string | null) {
    // 👉 Simplified fetch call as requested
    const userId: string = "68e0f4b5361cce7752ec443a"
    const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            user_id: userId,
            product_id: product_id,
            order_id: order_id,
        }),
    });

    return response;
}
