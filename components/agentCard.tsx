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
        <Tooltip>
            <TooltipTrigger >
                <div className="min-w-full animate-in fade-in duration-300">
                    <Card className={`min-w-full relative overflow-hidden transition-all duration-300 hover:shadow-lg border ${analysis?.angry_alert ? 'border-destructive/30' : 'border-border'} bg-background group cursor-help rounded-lg`}>
                        <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">
                            {/* Header: Name and Status */}
                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-base text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                                    {identity?.agent_name || identity?.agent_id || "Agent"}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={12} className={analysis?.angry_alert ? "text-destructive" : "text-primary/70"} />
                                    <p className="text-xs text-muted-foreground/70 uppercase tracking-tighter font-bold">
                                        {classification?.detected_intent || "Determining..."}
                                    </p>
                                </div>
                            </div>

                            {/* Information Grid */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground/60 mb-1 text-left">Priority</p>
                                        <p className={`text-sm font-semibold ${analysis?.angry_alert ? 'text-destructive' : 'text-foreground'}`}>
                                            {priority?.priority_label || "Normal"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-muted-foreground/60 mb-1">Confidence</p>
                                        <p className="text-sm font-semibold text-primary">
                                            {((analysis?.confidence_score ?? 0) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-border/50" />

                                {/* Interactive Indicator */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${analysis?.angry_alert ? 'bg-destructive animate-bounce' : 'bg-primary/40 animate-pulse'}`} />
                                    <p className="text-xs text-muted-foreground/50 text-center group-hover:text-muted-foreground transition-colors">
                                        {analysis?.angry_alert ? 'Action Required' : 'Hover for note'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        {/* Subtle background accent */}
                        <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 transition-colors duration-500 ${analysis?.angry_alert ? 'bg-destructive' : 'bg-primary'}`} />
                    </Card>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                sideOffset={8}
                className="max-w-sm p-4 bg-background border border-border shadow-lg rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-semibold text-foreground">Recommendation</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {priority?.recommended_priority || "Continue standard monitoring."}
                        </p>
                    </div>
                    {Array.isArray(analysis?.urgency_keywords_found) && analysis.urgency_keywords_found.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                            {analysis.urgency_keywords_found.map((word, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground">
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
