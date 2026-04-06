"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sparkles as SparklesComp } from "@/components/ui/sparkles"
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRef } from "react"

const plans = [
  {
    id: "launch",
    name: "Launch",
    tagline: "Light the fuse.",
    price: "$2,000",
    period: "/mo",
    adSpend: "$1,500–$3,000/mo",
    buttonText: "Start with Launch →",
    buttonVariant: "outline" as const,
    features: [
      "1 advertising platform (Meta OR Google)",
      "Up to 3 treatment campaigns",
      "Custom conversion-optimized landing pages",
      "Automated lead follow-up (SMS + email)",
      "Weekly campaign optimization & A/B testing",
      "Real-time results dashboard",
      "Bi-weekly strategy calls",
      "Creative ad design (static + video)",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Pour fuel on the fire.",
    price: "$4,000",
    period: "/mo",
    adSpend: "$3,000–$8,000/mo",
    buttonText: "Scale your medspa →",
    buttonVariant: "default" as const,
    popular: true,
    includes: "Everything in Launch, plus:",
    features: [
      "Both Meta AND Google Ads",
      "Up to 8 treatment campaigns",
      "Advanced retargeting campaigns",
      "Treatment-specific funnel architecture",
      "Competitor conquest campaigns",
      "Monthly creative refresh",
      "Weekly strategy calls",
      "Quarterly offer strategy session",
      "Priority response < 4 hours",
    ],
  },
  {
    id: "dominate",
    name: "Dominate",
    tagline: "Own your market.",
    price: "$8,000",
    period: "/mo",
    adSpend: "$8,000–$20,000+/mo",
    buttonText: "Dominate your market →",
    buttonVariant: "outline" as const,
    includes: "Everything in Scale, plus:",
    features: [
      "Full omni-channel — Meta, Google, YouTube, TikTok",
      "Unlimited treatment campaigns",
      "Direct Slack/text access to your dedicated Bro",
      "Multi-location & geo-targeting",
      "Custom patient acquisition cost modeling",
      "Monthly video ad production consultation",
      "Landing page A/B testing program",
      "Patient reactivation campaigns",
      "Quarterly competitive market analysis",
    ],
  },
]

export default function PricingSection() {
  const pricingRef = useRef<HTMLDivElement>(null)

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.35,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: -16,
      opacity: 0,
    },
  }

  return (
    <div
      className="mx-auto relative overflow-x-hidden"
      ref={pricingRef}
      id="pricing"
      style={{ background: "linear-gradient(180deg, #1B2A4A 0%, #0f1b32 100%)" }}
    >
      {/* Top gradient fade: white → navy (seamless blend) */}
      <div
        className="absolute top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{
          height: "180px",
          background: "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.1) 75%, transparent 100%)",
        }}
      />
      {/* Bottom gradient fade: navy → white (seamless blend) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[60] pointer-events-none"
        style={{
          height: "180px",
          background: "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.1) 75%, transparent 100%)",
        }}
      />

      {/* Sparkles — toned down */}
      <TimelineContent
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-80 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <SparklesComp
          density={800}
          direction="bottom"
          speed={0.6}
          color="#FFFFFF"
          opacity={0.4}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      {/* Subtle glow behind cards */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header */}
      <article className="text-center mb-8 pt-40 max-w-3xl mx-auto space-y-3 relative z-50 px-4">
        <h2 className="text-4xl font-bold text-white tracking-tight">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Pick your speed. Scale when you're ready.
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-[rgba(255,255,255,0.55)] text-base px-4 leading-relaxed"
        >
          Transparent pricing because we're not afraid of it. No setup fees. No
          long-term contracts. Month-to-month, cancel anytime.
        </TimelineContent>
      </article>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 max-w-5xl gap-5 py-8 mx-auto px-4 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.id}
            as="div"
            animationNum={1 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "relative text-white border transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-b from-[#1a3a6e] via-[#162d55] to-[#0f1f3d] border-[rgba(37,99,235,0.4)] shadow-[0px_0px_120px_-20px_rgba(37,99,235,0.4)] z-20 md:scale-[1.03]"
                  : "bg-gradient-to-b from-[#162d55] via-[#122244] to-[#0e1a36] border-[rgba(255,255,255,0.08)] z-10 hover:border-[rgba(37,99,235,0.25)]"
              )}
              style={{ borderRadius: "16px" }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-blue-900/30">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-left pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{plan.name}</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.45)] italic">
                      {plan.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline pt-3 relative">
                  <span className="text-4xl font-extrabold tracking-tight blur-md select-none" aria-hidden="true">{plan.price}</span>
                  <span className="text-[rgba(255,255,255,0.45)] ml-1 text-base blur-md select-none" aria-hidden="true">{plan.period}</span>
                  <a
                    href="/book"
                    className="absolute inset-0 flex items-center justify-start text-xs font-semibold text-[#60a5fa] hover:text-white tracking-wide uppercase transition-colors duration-200"
                  >
                    Book a call to reveal
                  </a>
                </div>
                <div className="text-xs text-[rgba(255,255,255,0.4)] bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2.5 mt-3">
                  Recommended ad spend:{" "}
                  <strong className="text-[rgba(255,255,255,0.8)] blur-sm select-none">{plan.adSpend}</strong>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <a
                  href="/book"
                  className={cn(
                    "block w-full mb-6 py-3.5 px-4 text-base font-bold rounded-xl text-center transition-all duration-200",
                    plan.popular
                      ? "bg-gradient-to-t from-[#1d4ed8] to-[#2563EB] shadow-lg shadow-blue-900/40 border border-[#3b82f6] text-white hover:brightness-110 hover:shadow-blue-800/50"
                      : "bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.1] hover:border-white/[0.2]"
                  )}
                >
                  {plan.buttonText}
                </a>

                <div className="space-y-3 pt-5 border-t border-white/[0.08]">
                  {plan.includes && (
                    <h4 className="font-semibold text-sm mb-3 text-[rgba(255,255,255,0.65)]">
                      {plan.includes}
                    </h4>
                  )}
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 mt-2 bg-[#2563EB] rounded-full flex-shrink-0" />
                        <span className="text-sm text-[rgba(255,255,255,0.65)] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      {/* Guarantee */}
      <motion.div
        className="max-w-5xl mx-auto px-4 pb-24 pt-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex gap-5 items-start border rounded-2xl p-8" style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}>
          <span className="text-3xl flex-shrink-0">🤝</span>
          <div>
            <strong className="text-lg font-bold text-white block mb-2 tracking-tight">
              No contracts. No setup fees. No BS.
            </strong>
            <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed">
              We operate month-to-month because we believe you should stay
              because we're making you money, not because a contract says you
              have to. If we're not delivering, fire us. We'll even help you
              transition. That's how confident we are.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
