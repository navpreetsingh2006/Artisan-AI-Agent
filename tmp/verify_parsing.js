
// Mocking the behavior we fixed
async function simulateParsing(text) {
    console.log(`Testing with input: "${text}"`);
    let data = null;
    let botText = "I'm sorry, I couldn't find any information on that. Can I help with something else?";

    if (text && text.trim() !== "") {
        try {
            data = JSON.parse(text);
            if (typeof data === 'string') {
                botText = data;
            } else if (data.output) {
                botText = data.output;
            }
            console.log("Successfully parsed JSON");
        } catch (e) {
            console.log("Caught expected parse error:", e.message);
        }
    } else {
        console.log("Skipped parsing due to empty/null input");
    }
    
    console.log(`Resulting Bot Text: "${botText}"`);
    console.log("---");
}

async function runTests() {
    await simulateParsing(""); // Empty string (what API currently returns)
    await simulateParsing("   "); // Whitespace
    await simulateParsing(null); // Null
    await simulateParsing('{"output": "Real response"}'); // Valid JSON
    await simulateParsing('Invalid JSON'); // Invalid JSON
}

runTests();
