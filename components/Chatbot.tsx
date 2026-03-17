"use client"

import * as React from "react"
import { Send, X, Loader2, Tag, Package, Bot, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { sendChatMessage } from "@/lib/call"
import { type Product } from "@/components/ProductCard"
import { type Order } from "@/components/OrderCard"
import { ChatMessage } from "@/components/ChatMessage"

export interface Message {
    id: string
    role: "user" | "bot"
    content: string
    timestamp: Date
    products?: Product[]
    agent?: any
    order?: Order
    orders?: Order[]
}

const parseResponseData = (text: string) => {
    let botText = "I couldn't find information on that. How else can I help?"
    let data: any = null

    if (text?.trim()) {
        try {
            data = JSON.parse(text)
            if (typeof data === 'string') {
                botText = data
            } else if (Array.isArray(data) && data[0]?.output) {
                botText = data[0].output
            } else if (data && typeof data === 'object') {
                botText = data.draft_reply || data.output || data.response || data.message || botText
            }
        } catch (e) {
            console.error("Error parsing API response:", e)
        }
    }
    return { botText, data }
}

const parseProducts = (data: any): Product[] => {
    if (!data) return []
    const rawApiProduct = data.product || data.details?.product || (Array.isArray(data) && data[0]?.product) || data.metadata?.product
    if (!rawApiProduct) return []
    
    const rawProducts = Array.isArray(rawApiProduct) ? rawApiProduct : [rawApiProduct]
    return rawProducts.map((item: any, index: number) => ({
        _id: item._id || `temp-id-${Date.now()}-${index}`,
        name: item.name || item.title || "Artisan Product",
        size: item.PaintingSize || item.size || item.dimensions || "Standard",
        price: item.payableAmount || item.payableamount || item.price || "Contact for Price",
        description: item.description || item.info || item.details || "No description available."
    }))
}

const parseOrders = (data: any): { orders: Order[], order?: Order } => {
    if (!data) return { orders: [] }
    const rawApiOrder = data.order || data.details?.order || (Array.isArray(data) && data[0]?.order)
    if (!rawApiOrder) return { orders: [] }
    
    const rawOrders = Array.isArray(rawApiOrder) ? rawApiOrder : [rawApiOrder]
    const ordersData = rawOrders.map((o: any) => ({
        _id: o._id || Math.random().toString(),
        orderNumber: o.orderNumber || o.order_number || o.id || "",
        orderStatus: o.orderStatus || o.order_status || o.status || "Processing",
        paymentStatus: o.paymentStatus || o.payment_status || "Pending",
        paymentMethod: o.paymentMethod || o.payment_method || "Unknown",
        totalAmount: o.totalAmount || o.total_amount || 0,
        estimatedDelivery: o.estimatedDelivery || o.estimated_delivery || null,
        deliveredAt: o.deliveredAt || o.delivered_at || null
    }))
    
    return { orders: ordersData, order: ordersData.length === 1 ? ordersData[0] : undefined }
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
    const [messages, setMessages] = React.useState<Message[]>([{
        id: "1",
        role: "bot",
        content: "Hello! How can I assist you today?",
        timestamp: new Date(),
    }])
    const [input, setInput] = React.useState("")
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    }, [messages, isOpen, isLoading])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        const contextPrefix = selectedProduct ? `[Regarding Product: ${selectedProduct.name}] ` 
            : selectedOrder ? `[Regarding Order: ${selectedOrder.orderNumber}] ` : ""
        const currentInput = contextPrefix + input
        setInput("")
        setIsLoading(true)

        try {
            const response = await sendChatMessage(currentInput, selectedProduct?._id ?? null, selectedOrder?._id ?? null)
            if (!response.ok) throw new Error("Failed to get response")

            const text = await response.text()
            const { botText, data } = parseResponseData(text)
            const productsData = parseProducts(data)
            const { orders: ordersData, order: orderData } = parseOrders(data)

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: botText,
                timestamp: new Date(),
                products: productsData.length > 0 ? productsData : undefined,
                agent: data?.agent,
                order: orderData,
                orders: ordersData.length > 0 ? ordersData : undefined
            }])
        } catch (error) {
            console.error("Chatbot Error:", error)
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: "bot",
                content: "I'm having trouble connecting. Please try again.",
                timestamp: new Date(),
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <div className={cn(
                "transition-all duration-300 ease-in-out origin-bottom-right",
                isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90 pointer-events-none"
            )}>
                <Card className="w-[calc(100vw-3rem)] pt-0 sm:w-[480px] h-[650px] max-h-[calc(100vh-4rem)] flex flex-col shadow-lg">
                    <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between space-y-0 bg-primary text-white">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-primary"><Bot size={18} /></AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="font-semibold">Artisan AI</CardTitle>
                                <CardDescription className="text-xs text-white">Ready to help</CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full px-6 py-4" ref={scrollRef}>
                            <div className="flex flex-col gap-4">
                                {messages.map((message) => (
                                    <ChatMessage 
                                        key={message.id} 
                                        message={message} 
                                        onSelectProduct={setSelectedProduct} 
                                        onSelectOrder={setSelectedOrder} 
                                    />
                                ))}
                                {isLoading && (
                                    <div className="flex items-start gap-3 max-w-[90%]">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary"><Bot size={14} /></AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 p-4 border-t">
                        {(selectedProduct || selectedOrder) && (
                            <div className="flex w-full items-center justify-between bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2 truncate">
                                    {selectedProduct ? <Tag className="h-4 w-4 text-primary" /> : <Package className="h-4 w-4 text-primary" />}
                                    <span className="text-sm font-medium truncate">
                                        {selectedProduct ? selectedProduct.name : `Order #${selectedOrder?.orderNumber}`}
                                    </span>
                                </div>
                                <button onClick={() => { setSelectedProduct(null); setSelectedOrder(null) }} className="hover:text-foreground p-1">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {!isLoading && messages.length <= 2 && (
                            <div className="flex flex-wrap gap-2 w-full">
                                {["Tell me more", "How can you help?", "Need support?"].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 border transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex w-full items-center gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 bg-muted/50"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-10 w-10">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full h-14 w-14 shadow-lg">
                {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </Button>
        </div>
    )
}