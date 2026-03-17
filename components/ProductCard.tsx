"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
            <div className="w-full max-w-[240px] animate-pulse">
                <Card className="rounded-[1.5rem] border-2 border-primary/5 bg-muted/20 h-[100px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary/40">Loading...</span>
                    </div>
                </Card>
            </div>
        )
    }

    if (error && !name) {
        return (
            <div className="w-full max-w-[240px]">
                <Card className="rounded-[1.5rem] border-2 border-destructive/20 bg-destructive/5 p-3 shadow-sm">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-destructive/70">Not Found</p>
                        <p className="text-[9px] text-muted-foreground/80 leading-tight line-clamp-1">{query}</p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <div className="w-full max-w-[240px] animate-in fade-in zoom-in-95 duration-500">
                    <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.15)] hover:scale-[1.02] border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 group cursor-help rounded-[1.5rem] border-2">
                        {/* 🌟 Premium Accents */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />

                        <CardContent className="p-3.5 flex flex-col gap-2.5 relative z-10">
                            {/* Header: Name */}
                            <div className="flex flex-col gap-0.5">
                                <h3 className="font-extrabold text-[14px] tracking-tight group-hover:text-primary transition-colors leading-tight truncate">
                                    {name || "Loading..."}
                                </h3>
                                <span className="text-[8px] uppercase font-bold tracking-tighter text-muted-foreground/40">Artisan Collection</span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-0.5 p-2 rounded-[1rem] bg-background/60 backdrop-blur-md border border-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                    <span className="text-[7px] text-muted-foreground uppercase tracking-[0.1em] font-black opacity-50">Size</span>
                                    <div className="text-[10px] font-bold truncate">
                                        {size || "Custom"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 p-2 rounded-[1rem] bg-primary/5 backdrop-blur-md border border-primary/10 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                                    <span className="text-[7px] text-primary/70 uppercase tracking-[0.1em] font-black">Price</span>
                                    <div className="text-[10px] font-black text-primary">
                                        {price ? (price.toString().startsWith('$') ? price : `$${price}`) : "TBD"}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Indicator */}
                            <div className="flex items-center justify-center py-0.5 rounded-full bg-muted/20 group-hover:bg-primary/5 transition-colors">
                                <span className="text-[7px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Details</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                sideOffset={8}
                className="max-w-[200px] p-3.5 bg-background/98 backdrop-blur-xl border-2 border-primary/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] rounded-[1.25rem] animate-in slide-in-from-bottom-2"
            >
                <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest italic border-b border-primary/10 pb-1.5">Note</span>
                    <p className="text-[10px] leading-relaxed text-muted-foreground/90 font-medium line-clamp-4">
                        {description || "A masterfully crafted piece designed to elevate your space."}
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}

