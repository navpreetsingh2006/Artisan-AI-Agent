"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tag, Package, CreditCard, Info, Sparkles } from "lucide-react"

interface ProductProps {
    name: string
    size: string
    price: string | number
    description: string
}

export function ProductCard({ name, size, price, description }: ProductProps) {
    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
                <div className="w-full max-w-[300px] animate-in fade-in zoom-in-95 duration-500">
                    <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(var(--primary-rgb),0.2)] hover:scale-[1.04] border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 group cursor-help rounded-[2.5rem] border-2">
                        {/* 🌟 Premium Accents */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                        
                        <CardContent className="p-6 flex flex-col gap-5 relative z-10">
                            {/* Header: Name and Icon */}
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-extrabold text-lg tracking-tight group-hover:text-primary transition-colors leading-tight">
                                        {name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                        <Sparkles size={12} className="text-primary/40" />
                                        <span className="text-[10px] uppercase font-bold tracking-tighter">Artisan Collection</span>
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:rotate-6 transition-transform duration-300">
                                    <Package size={20} />
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5 p-3 rounded-[1.5rem] bg-background/60 backdrop-blur-md border border-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                    <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-black opacity-50">Dimensions</span>
                                    <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                                        <Tag size={12} className="text-primary/70" />
                                        {size || "Custom Size"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-3 rounded-[1.5rem] bg-primary/5 backdrop-blur-md border border-primary/10 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                                    <span className="text-[9px] text-primary/70 uppercase tracking-[0.15em] font-black">Payable amount</span>
                                    <div className="flex items-center gap-2 text-sm font-black text-primary">
                                        <CreditCard size={12} />
                                        ${price}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-1 py-1 rounded-full bg-muted/30 group-hover:bg-primary/5 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Hover for details</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TooltipTrigger>
            <TooltipContent 
                side="top" 
                align="center" 
                sideOffset={15}
                className="max-w-[280px] p-5 bg-background/98 backdrop-blur-xl border-2 border-primary/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[2rem] animate-in slide-in-from-bottom-2"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 border-b border-primary/10 pb-3 mb-1">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Info size={16} className="text-primary" />
                        </div>
                        <span className="text-[11px] font-black text-primary uppercase tracking-widest italic">The Artisan's Note</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
                        {description || "A masterfully crafted piece designed to elevate your space with timeless elegance and artisanal detail."}
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}
