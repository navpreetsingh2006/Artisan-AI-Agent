export interface Product {
    name: string
    size: string
    price: string | number
    description: string
}

export const products: Product[] = [
    {
        name: "Artisan Leather Bag",
        size: "Medium",
        price: "120.00",
        description: "Handcrafted top-grain leather bag with vintage finish and durable brass hardware. Perfect for daily use."
    },
    {
        name: "Hand-Thrown Ceramic Bowl",
        size: "8-inch",
        price: "45.00",
        description: "Elegant stoneware bowl with a unique reactive glaze. Oven and dishwasher safe."
    },
    {
        name: "Woven Bamboo Basket",
        size: "Large",
        price: "35.00",
        description: "Traditionally woven bamboo basket from sustainable sources. Ideal for storage or decoration."
    },
    {
        name: "Hand-Carved Wooden Spoon",
        size: "Standard",
        price: "25.00",
        description: "Carved from salvaged cherry wood and finished with food-safe oils. Each piece is unique."
    },
    {
        name: "Pure Linen Scarf",
        size: "70x180cm",
        price: "55.00",
        description: "Soft, breathable premium linen scarf available in a variety of natural-dyed colors."
    }
]

/**
 * Searches the local catalog for a product matching the query
 */
export function searchLocalProducts(query: string): Product | null {
    const searchTerms = query.toLowerCase().split(/\W+/)
    return products.find(p => 
        searchTerms.some(term => 
            term.length > 2 && (
                p.name.toLowerCase().includes(term) || 
                p.description.toLowerCase().includes(term)
            )
        )
    ) || null
}

/**
 * Fetches product details from the API based on a query
 */
export async function fetchProductFromAPI(query: string): Promise<Product | null> {
    try {
        const response = await fetch("https://n8n.srv962022.hstgr.cloud/webhook/auto-reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Give me details about ${query}`,
                user_id: "product_fetcher_internal",
            }),
        })

        if (!response.ok) return null

        const data = await response.json()
        
        // Extract product from various known formats and map fields correctly
        const rawProduct = data.product || data.details?.product || (Array.isArray(data) && data[0]?.product)
        
        if (rawProduct) {
            return {
                name: rawProduct.name || rawProduct.title || "Artisan Product",
                size: rawProduct.size || rawProduct.dimensions || "Standard",
                price: rawProduct.payableamount || rawProduct.price || "Contact for Price",
                description: rawProduct.description || rawProduct.info || "No description available."
            }
        }
        
        return null
    } catch (error) {
        console.error("Error fetching product from API:", error)
        return null
    }
}

/**
 * Centralized function to get product details (API first, then local fallback)
 */
export async function getProduct(query: string): Promise<Product | null> {
    // 1. Try local search first for speed
    const localMatch = searchLocalProducts(query)
    if (localMatch) return localMatch

    // 2. Fallback to API for more details or unknown products
    return await fetchProductFromAPI(query)
}
