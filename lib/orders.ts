
export interface Order {
    orderNumber: string;
    orderDate: string;
    paymentStatus: string;
}

/**
 * Fetches order details from the API based on a query
 */
export async function fetchOrderFromAPI(query: string): Promise<Order | null> {
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: query,
                user_id: "order_fetcher_internal",
            }),
        });

        if (!response.ok) return null;
        
        const text = await response.text();
        if (!text || text.trim() === "") return null;

        let data: any;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Error parsing order JSON:", e);
            return null;
        }

        // Extract order from known formats
        // Based on typical webhook responses from this endpoint
        const rawOrder = data.order || data.details?.order || (Array.isArray(data) && data[0]?.order);

        if (rawOrder) {
            return {
                orderNumber: rawOrder.order_number || rawOrder.id || "ORD-UNKNOWN",
                orderDate: rawOrder.date || rawOrder.created_at || new Date().toLocaleDateString(),
                paymentStatus: rawOrder.payment_status || rawOrder.status || "Processing",
            };
        }

        // Fallback: If the response is a string or doesn't have a clear order object, 
        // we might need more complex parsing, but for now we follow the Product pattern.
        return null;
    } catch (error) {
        console.error("Error fetching order from API:", error);
        return null;
    }
}

/**
 * Centralized function to get order details
 */
export async function getOrder(query: string): Promise<Order | null> {
    // For now, only API fetch (can add local cache later if needed)
    return await fetchOrderFromAPI(query);
}
