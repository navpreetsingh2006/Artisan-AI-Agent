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
import { products, type Product } from "@/lib/products"


// Message structure
interface Message {
    id: string
    role: "user" | "bot"
    content: string
    timestamp: Date
    product?: {
        name: string
        size: string
        price: string | number
        description: string
    }
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

            const data = await response.json()

            // 👉 Response parsing logic now in component
            let botText = "I received your message but couldn't process a response."

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

            // 👉 Robust product extraction from API data with field mapping
            let apiProduct: Message['product'] = undefined
            const rawApiProduct = data.product || data.details?.product || (Array.isArray(data) && data[0]?.product) || data.metadata?.product

            if (rawApiProduct) {
                apiProduct = {
                    name: rawApiProduct.name || rawApiProduct.title || "Product",
                    size: rawApiProduct.size || rawApiProduct.dimensions || "N/A",
                    price: rawApiProduct.payableamount || rawApiProduct.price || "N/A",
                    description: rawApiProduct.description || rawApiProduct.details || ""
                }
            }

            // 👉 Search for products in the local catalog (fallback)
            const searchTerms = currentInput.toLowerCase().split(/\W+/)
            const matchedProduct = products.find(p =>
                searchTerms.some(term =>
                    term.length > 2 && (
                        p.name.toLowerCase().includes(term) ||
                        p.description.toLowerCase().includes(term)
                    )
                )
            )

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: botText,
                timestamp: new Date(),
                product: apiProduct || (matchedProduct ? { ...matchedProduct } : undefined)
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
                <Card className="w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl border-primary/10 overflow-hidden bg-background/95 backdrop-blur-xl rounded-3xl">
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
                                            "flex items-start gap-3 max-w-[85%]",
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
                                            {message.product && (
                                                <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    <ProductCard {...message.product} />
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