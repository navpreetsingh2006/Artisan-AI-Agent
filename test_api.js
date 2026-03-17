
async function testApi() {
    console.log("Starting API test...");
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Tell me about the leather bag",
                user_id: "test_user_456",
            }),
        });

        console.log("Status:", response.status);
        console.log("OK:", response.ok);
        
        const text = await response.text();
        console.log("Response Body:", text);
        
        try {
            const json = JSON.parse(text);
            console.log("JSON Output:", JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Not a valid JSON response.");
        }
    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
}

testApi();
