
async function test(query) {
    console.log(`\n--- Testing query: "${query}" ---`);
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: query,
                user_id: "debugger_" + Math.random().toString(36).substring(7),
            }),
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`Error for "${query}":`, e.message);
    }
}

async function runTests() {
    await test("Show me the leather bag");
    await test("Artisan Leather Bag");
    await test("Ceramic Bowl");
    await test("Woven Bamboo Basket");
    await test("Pure Linen Scarf");
}

runTests();
