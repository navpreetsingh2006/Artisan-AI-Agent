"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tag, Package, CreditCard, Info, Sparkles } from "lucide-react"

interface AgentProps {
    agent: {
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
}

export function AgentCard({ agent }: AgentProps) {
    const { identity = { agent_id: null, agent_name: null },
        classification = { category: null, subcategory: null, detected_intent: "" },
        priority = { priority_score: 0, priority_label: "Normal", recommended_priority: "" },
        analysis = { confidence_score: 0, customer_status: "normal", angry_alert: false, urgency_keywords_found: [] }
    } = agent || {}

    return (
        <Tooltip >
            <TooltipTrigger >
                <div className="w-full max-w-[300px] animate-in fade-in zoom-in-95 duration-500">
                    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(var(--primary-rgb),0.2)] hover:scale-[1.04] border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 group cursor-help rounded-[2.5rem] border-2 ${analysis?.angry_alert ? 'border-destructive/30' : ''}`}>
                        {/* 🌟 Premium Accents */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 ${analysis?.angry_alert ? 'bg-destructive/10' : 'bg-primary/10'} rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700`} />
                        <div className={`absolute -bottom-10 -left-10 w-24 h-24 ${analysis?.angry_alert ? 'bg-destructive/5' : 'bg-primary/5'} rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700`} />

                        <CardContent className="p-6 flex flex-col gap-5 relative z-10">
                            {/* Header: Name and Icon */}
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-extrabold text-lg tracking-tight group-hover:text-primary transition-colors leading-tight">
                                        {identity?.agent_name || identity?.agent_id || "Unknown Agent"}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                        <Sparkles size={12} className={analysis?.angry_alert ? "text-destructive/60" : "text-primary/40"} />
                                        <span className="text-[10px] uppercase font-bold tracking-tighter">
                                            {classification?.detected_intent || "Detected Intent"}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-2.5 rounded-2xl ${analysis?.angry_alert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                                    <Package size={20} />
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5 p-3 rounded-[1.5rem] bg-background/60 backdrop-blur-md border border-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                    <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-black opacity-50">Priority</span>
                                    <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                                        <Tag size={12} className="text-primary/70" />
                                        {priority?.priority_label || "Normal"} ({priority?.priority_score ?? 0})
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-3 rounded-[1.5rem] bg-primary/5 backdrop-blur-md border border-primary/10 group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                                    <span className="text-[9px] text-primary/70 uppercase tracking-[0.15em] font-black">Confidence</span>
                                    <div className="flex items-center gap-2 text-sm font-black text-primary">
                                        <CreditCard size={12} />
                                        {((analysis?.confidence_score ?? 0) * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>

                            {/* Hover Indicator */}
                            <div className="flex items-center justify-center gap-2 mt-1 py-1 rounded-full bg-muted/30 group-hover:bg-primary/5 transition-colors">
                                <div className={`w-1.5 h-1.5 rounded-full ${analysis?.angry_alert ? 'bg-destructive/60 animate-bounce' : 'bg-primary/40 animate-pulse'}`} />
                                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                    {analysis?.angry_alert ? 'Alert: Hostile interaction' : 'Hover for details'}
                                </span>
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
                        <span className="text-[11px] font-black text-primary uppercase tracking-widest italic">Recommendation</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
                        {priority?.recommended_priority || "No specific recommendation."}
                    </p>
                    {Array.isArray(analysis?.urgency_keywords_found) && analysis.urgency_keywords_found.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {analysis.urgency_keywords_found.map((word, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary/70">
                                    #{word}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}
