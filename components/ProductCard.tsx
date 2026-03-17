"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Package, Ruler, Tag, Info, Sparkles } from "lucide-react"

export interface Product {
    _id: string
    name: string
    size: string
    price: string | number
    description: string
}

interface ProductCardProps extends Product {
    onSelect?: (product: Product) => void
}

export function ProductCard({ onSelect, ...product }: ProductCardProps) {
    const { name, size, price, description } = product

    return (
        <Tooltip>
            {/* TooltipTrigger expects a button or ref-forwarded component. Using child directly without asChild */}
            <TooltipTrigger>
                <div className="w-full min-w-[180px] max-w-[180px] aspect-square animate-in fade-in duration-300">
                    <Card 
                        onClick={() => onSelect?.(product)}
                        className="aspect-square w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 border border-border bg-background group cursor-pointer rounded-lg"
                    >
                        <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">
                            {/* Product Name */}
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-base text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                                    {name || "Premium Item"}
                                </h3>
                            </div>

                            {/* Information Grid */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground/60 mb-1 text-left">Size</p>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                            <Ruler size={13} className="text-muted-foreground/40" />
                                            {size || "Custom"}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-muted-foreground/60 mb-1">Price</p>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-primary justify-end">
                                            <Tag size={13} />
                                            {price ? (price.toString().startsWith('$') ? price : `$${price}`) : "TBD"}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-border/50" />

                                {/* Interactive Indicator */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                                    <p className="text-xs text-muted-foreground/50 text-center group-hover:text-muted-foreground transition-colors">
                                        Hover for details
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        {/* Subtle background accent */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                    </Card>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                sideOffset={8}
                className="max-w-sm p-4 bg-background border border-border shadow-lg rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded bg-primary/10">
                            <Info size={14} className="text-primary" />
                        </div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Product Info</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                        {description || "A masterfully crafted piece from the Artisan collection, designed with meticulous attention to detail."}
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}

