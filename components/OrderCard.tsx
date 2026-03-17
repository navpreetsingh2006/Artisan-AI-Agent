"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchOrderFromAPI, type Order } from "@/lib/orders"

interface OrderCardProps {
    orderNumber?: string
    orderDate?: string
    paymentStatus?: string
    query?: string
}

export function OrderCard({ orderNumber: initialNumber, orderDate: initialDate, paymentStatus: initialStatus, query }: OrderCardProps) {
    const [data, setData] = useState<Order>({
        orderNumber: initialNumber || "",
        orderDate: initialDate || "",
        paymentStatus: initialStatus || ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (query && !initialNumber) {
            const fetchData = async () => {
                setLoading(true)
                setError(false)
                try {
                    const order = await fetchOrderFromAPI(query)
                    if (order) {
                        setData(order)
                    } else {
                        setError(true)
                    }
                } catch (err) {
                    console.error("OrderCard Fetch Error:", err)
                    setError(true)
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [query, initialNumber])

    const { orderNumber, orderDate, paymentStatus } = data

    if (loading) {
        return (
            <div className="w-[175px] animate-pulse">
                <Card className="rounded-2xl border-2 border-primary/5 bg-muted/20 h-[110px] flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/30">Syncing</span>
                </Card>
            </div>
        )
    }

    if (error && !orderNumber) {
        return (
            <div className="w-[175px]">
                <Card className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 p-3 flex items-center justify-center h-[110px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-destructive/70 text-center">Order Not Found</span>
                </Card>
            </div>
        )
    }

    const isPaid = paymentStatus?.toLowerCase().includes('paid') || paymentStatus?.toLowerCase().includes('success')

    return (
        <div className="w-[175px] animate-in fade-in zoom-in-95 duration-500">
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md border-primary/10 bg-gradient-to-br from-background via-background to-primary/[0.03] group rounded-2xl border-2">
                {/* Subtle Premium Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />

                <CardContent className="p-3.5 flex flex-col gap-2.5">
                    {/* Header Section */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] uppercase font-black tracking-[0.15em] text-muted-foreground/50">Tracking ID</span>
                        <h3 className="font-extrabold text-[12px] tracking-tight group-hover:text-primary transition-colors truncate">
                            {orderNumber || "Processing"}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Date Info */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] text-muted-foreground uppercase font-bold opacity-40">Order Date</span>
                            <div className="text-[10px] font-semibold text-foreground/70">
                                {orderDate || "Recently"}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="pt-1">
                            <div className={`inline-flex px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider border ${isPaid
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                }`}>
                                {paymentStatus || "Unknown"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
