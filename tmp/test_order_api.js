
async function testOrderApi() {
    console.log("Testing Order API...");
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "i want to see my previous orders",
                user_id: "test_user_order",
            }),
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response text:", text);
        
        try {
            const data = JSON.parse(text);
            console.log("Response JSON:", JSON.stringify(data, null, 2));
        } catch (e) {
            console.log("Response is not JSON");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testOrderApi();
