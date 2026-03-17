"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"

export interface Order {
    _id: string
    orderNumber: string
    orderStatus: string
    paymentStatus: string
    paymentMethod: string
    totalAmount: number
    estimatedDelivery: string | null
    deliveredAt: string | null
}

interface OrderCardProps extends Order {
    onSelect?: (order: Order) => void
}

export function OrderCard({ onSelect, ...order }: OrderCardProps) {
    const { orderNumber, orderStatus, paymentStatus, totalAmount, paymentMethod } = order

    const isPaid = paymentStatus?.toLowerCase().includes('paid') || paymentStatus?.toLowerCase().includes('success')
    const isDelivered = orderStatus?.toLowerCase() === 'delivered'

    return (
        <div className="w-[175px] animate-in fade-in zoom-in-95 duration-500">
            <Card 
                onClick={() => onSelect?.(order)}
                className="relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md border-primary/10 bg-gradient-to-br from-background via-background to-primary/[0.03] group rounded-2xl border-2"
            >
                {/* Subtle Premium Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />

                <CardContent className="p-3.5 flex flex-col gap-2.5 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] uppercase font-black tracking-[0.15em] text-muted-foreground/50">Order #</span>
                        <h3 className="font-extrabold text-[11px] tracking-tight group-hover:text-primary transition-colors truncate" title={orderNumber}>
                            {orderNumber || "Unknown"}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Financial Info */}
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[7px] text-muted-foreground uppercase font-bold opacity-40">Total</span>
                                <div className="text-[12px] font-black text-foreground">
                                    ${totalAmount?.toFixed(2) || "0.00"}
                                </div>
                            </div>
                            <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">{paymentMethod}</span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                            <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border ${isPaid
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                }`}>
                                {paymentStatus || "Unknown"}
                            </div>
                            <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border ${isDelivered
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : "bg-primary/5 text-primary border-primary/10"
                                }`}>
                                {orderStatus || "Processing"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
