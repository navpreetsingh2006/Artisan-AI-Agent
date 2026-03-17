/**
 * Utility to handle API calls for the Chatbot
 */

export async function sendChatMessage(message: string, userId: string = "user") {
    // 👉 Simplified fetch call as requested
    const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            user_id: userId,
        }),
    });

    return response;
}
