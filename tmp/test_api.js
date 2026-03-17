async function testApi() {
    const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "Hello",
            user_id: "user",
        }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testApi();
