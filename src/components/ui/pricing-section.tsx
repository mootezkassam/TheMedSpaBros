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
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  }

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden"
      ref={pricingRef}
      id="pricing"
    >
      {/* Sparkles grid background */}
      <TimelineContent
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]" />
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      {/* Glow ellipse */}
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #2563EB",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid #2563EB",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
        </div>
      </TimelineContent>

      {/* Header */}
      <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50">
        <h2 className="text-4xl font-medium text-white">
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
          className="text-gray-300 px-4"
        >
          Transparent pricing because we're not afraid of it. No setup fees. No
          long-term contracts. Month-to-month, cancel anytime.
        </TimelineContent>
      </article>

      {/* Radial glow behind cards */}
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #2563EB 0%, transparent 70%)",
          opacity: 0.5,
          mixBlendMode: "multiply",
        }}
      />

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 max-w-5xl gap-4 py-6 mx-auto px-4">
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
                "relative text-white border-neutral-800",
                plan.popular
                  ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_300px_0px_#2563EB] z-20"
                  : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10"
              )}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-400 italic">
                      {plan.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline pt-2">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span className="text-gray-300 ml-1">{plan.period}</span>
                </div>
                <div className="text-xs text-gray-400 bg-white/5 rounded-md px-3 py-2 mt-2">
                  Recommended ad spend:{" "}
                  <strong className="text-gray-200">{plan.adSpend}</strong>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <a
                  href="#contact"
                  className={cn(
                    "block w-full mb-6 p-4 text-xl rounded-xl text-center transition-all duration-200",
                    plan.popular
                      ? "bg-gradient-to-t from-[#1d4ed8] to-[#2563EB] shadow-lg shadow-[#1e3a8a] border border-[#2563EB] text-white hover:brightness-110"
                      : "bg-gradient-to-t from-neutral-950 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-800 text-white hover:brightness-110"
                  )}
                >
                  {plan.buttonText}
                </a>

                <div className="space-y-3 pt-4 border-t border-neutral-700">
                  {plan.includes && (
                    <h4 className="font-medium text-base mb-3">
                      {plan.includes}
                    </h4>
                  )}
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <span className="h-2.5 w-2.5 bg-[#2563EB] rounded-full grid place-content-center flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
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
        className="max-w-5xl mx-auto px-4 pb-16 pt-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex gap-6 items-start bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 backdrop-blur-sm">
          <span className="text-3xl flex-shrink-0">🤝</span>
          <div>
            <strong className="text-lg font-bold text-white block mb-2">
              No contracts. No setup fees. No BS.
            </strong>
            <p className="text-sm text-gray-400 leading-relaxed">
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
