
async function testSpecificOrder() {
    const orderId = "68e0f4b5361cce7752ec443a";
    console.log(`Testing API for order: ${orderId}`);
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Where is my order ${orderId}`,
                user_id: "debug_user_999",
            }),
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Raw Response:", text);
        
        try {
            const data = JSON.parse(text);
            console.log("Parsed JSON:", JSON.stringify(data, null, 2));
        } catch (e) {
            console.log("Response is not JSON");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testSpecificOrder();
