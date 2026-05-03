import { useState } from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Unlimited issues", "Basic teams", "Community support"],
      buttonText: "Current Plan",
      highlight: false,
      isCurrent: true,
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "$8" : "$6",
      features: ["Advanced projects", "Custom workflows", "Priority support"],
      buttonText: "Upgrade",
      highlight: true,
      isCurrent: false,
    },
    {
      name: "Team",
      price: billingCycle === "monthly" ? "$15" : "$12",
      features: ["Admin controls", "SSO & SAML", "Unlimited history"],
      buttonText: "Upgrade",
      highlight: false,
      isCurrent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#EAEAEA] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Header section */}
        <div className="max-w-3xl text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Simple pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#111113] border border-[#232326] rounded-2xl mb-20 shadow-xl">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-8 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-8 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            YEARLY
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-10 rounded-2xl border bg-[#111113] ${
                plan.highlight
                  ? "border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  : "border-[#232326]"
              } flex flex-col space-y-10 hover:-translate-y-2 hover:border-white/10 transition-all duration-500 group`}
            >
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.25em]">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 font-medium text-sm">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 flex-1 pt-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-gray-400">
                    <Check className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                    <span className="text-[15px] leading-snug font-medium tracking-tight text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.isCurrent}
                className={`w-full py-4 rounded-xl text-xs font-bold transition-all duration-500 tracking-widest ${
                  plan.isCurrent
                    ? "bg-[#232326] text-gray-500 cursor-default"
                    : "bg-[#EAEAEA] text-black hover:bg-white active:scale-95"
                }`}
              >
                {plan.buttonText.toUpperCase()}
              </button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <p className="mt-20 text-xs text-gray-600 font-medium tracking-wide">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
