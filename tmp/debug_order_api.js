
async function testRealOrderApi() {
    console.log("Calling real API for order context...");
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "tell me about my order",
                user_id: "debug_user_123",
            }),
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Full Response:", text);
        
        try {
            const data = JSON.parse(text);
            console.log("JSON structure keys:", Object.keys(data));
        } catch (e) {
            console.log("Not JSON");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testRealOrderApi();
