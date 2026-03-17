"use client"

import React from "react"
import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ProductCard, type Product } from "@/components/ProductCard"
import { AgentCard } from "@/components/agentCard"
import { OrderCard, type Order } from "@/components/OrderCard"
import { type Message } from "@/components/Chatbot"

interface ChatMessageProps {
    message: Message
    onSelectProduct?: (product: Product) => void
    onSelectOrder?: (order: Order) => void
}

export function ChatMessage({ message, onSelectProduct, onSelectOrder }: ChatMessageProps) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 w-full",
                message.agent ? "max-w-full" : "max-w-[90%]",
                message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto text-left"
            )}
        >
            <Avatar className={cn(
                "h-8 w-8 shrink-0 mt-0.5 border",
                message.role === "user" ? "border-border" : "border-border"
            )}>
                <AvatarFallback className={cn(
                    "text-xs",
                    message.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    {message.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex flex-col gap-2",
                message.agent ? "w-full" : "",
                message.role === "user" ? "items-end" : "items-start"
            )}>
                <div
                    className={cn(
                        "rounded-lg px-4 py-2.5 text-sm transition-colors",
                        message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted text-foreground rounded-tl-none"
                    )}
                >
                    {message.content}
                </div>
                
                {message.products && message.products.length > 0 && (
                    <ScrollArea className="mt-2 w-[400px] -mx-4 pb-2 animate-in fade-in duration-300">
                        <div className="flex flex-row gap-3 px-4 pb-2 snap-x snap-mandatory">
                            {message.products.map((p, idx) => (
                                <div key={idx} className="shrink-0 snap-center first:pl-2 last:pr-2">
                                    <ProductCard {...p} onSelect={onSelectProduct} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}

                {message.agent && (
                    <div className="mt-2 animate-in fade-in duration-300">
                        <AgentCard agent={message.agent} />
                    </div>
                )}

                {message.orders && message.orders.length > 1 && (
                    <ScrollArea className="mt-2 w-[400px] -mx-4 pb-2 animate-in fade-in duration-300">
                        <div className="flex flex-row gap-3 px-4 pb-2 snap-x snap-mandatory">
                            {message.orders.map((o, idx) => (
                                <div key={idx} className="shrink-0 snap-center first:pl-2 last:pr-2">
                                    <OrderCard {...o} onSelect={onSelectOrder} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}

                {message.orders && message.orders.length === 1 && (
                    <div className="mt-2 animate-in fade-in duration-300">
                        <OrderCard {...message.orders[0]} onSelect={onSelectOrder} />
                    </div>
                )}

                {message.order && !message.orders && (
                    <div className="mt-2 animate-in fade-in duration-300">
                        <OrderCard {...message.order} onSelect={onSelectOrder} />
                    </div>
                )}

                <span className="text-xs text-muted-foreground/50 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    )
}
