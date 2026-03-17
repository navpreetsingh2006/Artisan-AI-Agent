"use client" // 👉 Client component for hooks

import * as React from "react"
import { Send, Bot, User, Sparkles, MessageCircle, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { sendChatMessage } from "@/lib/call"
import { ProductCard } from "@/components/ProductCard"
import { AgentCard } from "@/components/agentCard"
import { searchLocalProducts, type Product } from "@/lib/products"
import { OrderCard } from "@/components/OrderCard"
import { type Order } from "@/lib/orders"


// Message structure
interface Message {
    id: string
    role: "user" | "bot"
    content: string
    timestamp: Date
    products?: {
        name?: string
        size?: string
        price?: string | number
        description?: string
        query?: string
    }[]
    agent?: {
        identity: {
            agent_id: string | null
            agent_name: string | null
        }
        classification: {
            category: string | null
            subcategory: string | null
            detected_intent: string
        }
        priority: {
            priority_score: number
            priority_label: string
            recommended_priority: string
        }
        analysis: {
            confidence_score: number
            customer_status: string
            angry_alert: boolean
            urgency_keywords_found: string[]
        }
    }
    order?: Order
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = React.useState("")
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Auto scroll to latest message
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
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
        const currentInput = input
        setInput("")
        setIsLoading(true)

        try {
            // 👉 Using utility function
            const response = await sendChatMessage(currentInput)

            if (!response.ok) throw new Error("Failed to get response")

            const text = await response.text()
            let data: any = null
            let botText = "I'm sorry, I couldn't find any information on that. Can I help with something else?"

            if (text && text.trim() !== "") {
                try {
                    data = JSON.parse(text)

                    // 👉 Response parsing logic now in component
                    if (typeof data === 'string') {
                        botText = data
                    } else if (Array.isArray(data) && data[0]?.output) {
                        botText = data[0].output
                    } else if (data.draft_reply) {
                        botText = data.draft_reply
                    } else if (data.output) {
                        botText = data.output
                    } else if (data.response) {
                        botText = data.response
                    } else if (data.message) {
                        botText = data.message
                    }
                } catch (e) {
                    console.error("Error parsing API response:", e)
                    // Keep fallback botText
                }
            }

            // 👉 Pass the identified product name or query to ProductCard
            let productData: any = undefined
            const rawApiProduct = data ? (data.product || data.details?.product || (Array.isArray(data) && data[0]?.product) || data.metadata?.product) : null

            if (rawProductSource) {
                const rawProducts = Array.isArray(rawProductSource) ? rawProductSource : [rawProductSource]
                productsData = rawProducts.map((item: any) => ({
                    name: item.name || item.title,
                    size: item.PaintingSize || item.size || item.dimensions,
                    price: item.payableAmount || item.payableamount || item.price,
                    description: item.description || item.info || item.details
                }))
            } else {
                // Try to extract from keywords if no explicit product object
                const localMatch = searchLocalProducts(currentInput)
                if (localMatch) {
                    productData = localMatch
                }
            }

            // 👉 Parsing Order Data
            let orderData: any = undefined
            const rawApiOrder = data.order || data.details?.order || (Array.isArray(data) && data[0]?.order)

            if (rawApiOrder) {
                orderData = {
                    orderNumber: rawApiOrder.order_number || rawApiOrder.id,
                    orderDate: rawApiOrder.date || rawApiOrder.created_at,
                    paymentStatus: rawApiOrder.payment_status || rawApiOrder.status
                }
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: botText,
                timestamp: new Date(),
                products: productsData.length > 0 ? productsData : undefined,
                agent: data.agent || undefined
            }
            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Chatbot Error:", error)
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: "bot",
                content: "Sorry, I'm having trouble connecting to my brain. Please try again later!",
                timestamp: new Date(),
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* 💬 Chatbot Window */}
            <div
                className={cn(
                    "transition-all duration-500 ease-in-out origin-bottom-right",
                    isOpen
                        ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
                        : "translate-y-12 opacity-0 scale-90 pointer-events-none"
                )}
            >
                <Card className="w-[calc(100vw-3rem)] pt-0 sm:w-[500px] h-[700px] max-h-[calc(100vh-4rem)] flex flex-col shadow-2xl border-primary/10 overflow-hidden bg-background/95 backdrop-blur-xl rounded-3xl">
                    <CardHeader className="border-b bg-primary/5 px-6 py-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot size={20} />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    Artisan AI
                                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                </CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1.5 font-medium">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    AI-Powered Support
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-muted"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-dot-pattern">
                        <ScrollArea className="h-full px-6 py-4" ref={scrollRef}>
                            <div className="flex flex-col gap-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex items-start gap-3 w-full",
                                            message.agent ? "max-w-full" : "max-w-[85%]",
                                            message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto text-left"
                                        )}
                                    >
                                        <Avatar className={cn(
                                            "h-8 w-8 shrink-0 mt-0.5 border shadow-sm",
                                            message.role === "user" ? "border-primary/20" : "border-muted"
                                        )}>
                                            <AvatarFallback className={cn(
                                                "text-[10px]",
                                                message.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                            )}>
                                                {message.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className={cn(
                                            "flex flex-col gap-1",
                                            message.agent ? "w-full" : "",
                                            message.role === "user" ? "items-end" : "items-start"
                                        )}>
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300",
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-muted/80 text-foreground rounded-tl-none"
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                            {message.products && message.products.length > 0 && (
                                                <div className="mt-2 flex flex-row gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 -mx-4 w-[calc(100%+2rem)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    {message.products.map((p, idx) => (
                                                        <div key={idx} className="shrink-0 snap-center first:pl-2 last:pr-2">
                                                            <ProductCard {...p} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {message.agent && (
                                                <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    <ProductCard {...message.product} />
                                                </div>
                                            )}
                                            {message.order && (
                                                <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-wrap gap-2">
                                                    <OrderCard {...message.order} />
                                                </div>
                                            )}
                                            <span className="text-[10px] text-muted-foreground opacity-50 px-1">
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-start gap-3 max-w-[85%] mr-auto text-left">
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-muted shadow-sm">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                <Bot size={14} />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted/40 rounded-2xl px-4 py-2.5 text-sm rounded-tl-none flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-muted-foreground animate-pulse">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 p-4 border-t bg-background/80 backdrop-blur-md">
                        {/* 💡 Suggestions */}
                        {!isLoading && messages.length <= 2 && (
                            <div className="flex flex-wrap gap-2 mb-2 w-full">
                                {[
                                    "Tell me about Artisan",
                                    "How can you help?",
                                    "What are your services?",
                                    "Contact support"
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInput(suggestion)
                                            // Trigger next tick to ensure state is updated
                                            setTimeout(() => {
                                                const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                                                document.querySelector('form')?.dispatchEvent(submitEvent);
                                            }, 0)
                                        }}
                                        className="text-[11px] px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSend()
                            }}
                            className="flex w-full items-center gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Write something..."
                                disabled={isLoading}
                                className="flex-1 bg-muted/30 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all rounded-2xl h-11"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center h-11 w-11 shrink-0 bg-primary hover:bg-primary/90"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            {/* 🔘 Floating Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
                    isOpen ? "bg-background text-foreground border border-border" : "bg-primary text-primary-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </Button>
        </div>
    )

}