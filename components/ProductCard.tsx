"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Package, Ruler, Tag, Info, Sparkles } from "lucide-react"
import { fetchProductFromAPI } from "@/lib/products"

interface ProductProps {
    name?: string
    size?: string
    price?: string | number
    description?: string
    query?: string
}

export function ProductCard({ name: initialName, size: initialSize, price: initialPrice, description: initialDescription, query }: ProductProps) {
    const [data, setData] = useState({
        name: initialName,
        size: initialSize,
        price: initialPrice,
        description: initialDescription
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        // Only fetch if a query is provided and we don't have enough initial data
        if (query && !initialName) {
            const fetchData = async () => {
                setLoading(true)
                setError(false)
                try {
                    const product = await fetchProductFromAPI(query)
                    if (product) {
                        setData({
                            name: product.name,
                            size: product.size,
                            price: product.price,
                            description: product.description
                        })
                    } else {
                        setError(true)
                    }
                } catch (err) {
                    console.error("ProductCard Fetch Error:", err)
                    setError(true)
                } finally {
                    setLoading(false)
                }
            }

            fetchData()
        }
    }, [query, initialName])

    const { name, size, price, description } = data

    if (loading) {
        return (
            <div className="w-full max-w-[260px] aspect-square animate-pulse">
                <Card className="aspect-square w-full rounded-lg border border-border bg-muted/40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full border-2 border-primary/20" />
                            <div className="absolute inset-0 h-10 w-10 rounded-full border-t-2 border-primary animate-spin" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">Fetching Details...</span>
                    </div>
                </Card>
            </div>
        )
    }

    if (error && !name) {
        return (
            <div className="w-full max-w-[260px] aspect-square">
                <Card className="aspect-square w-full rounded-lg border border-border/50 bg-background p-6 flex items-center justify-center shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="p-3 rounded-full bg-muted/50">
                            <Package size={24} className="text-muted-foreground/40" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold text-muted-foreground">Product not found</p>
                            <p className="text-xs text-muted-foreground/50 line-clamp-2 max-w-[160px]">"{query}" wasn't found in our collection.</p>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <div className="w-full min-w-[180px] max-w-[180px] aspect-square animate-in fade-in duration-300">
                    <Card className="aspect-square w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 border border-border bg-background group cursor-help rounded-lg">
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

