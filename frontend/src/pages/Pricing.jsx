import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Unlimited issues", "Basic teams", "Community support"],
      buttonText: "Start for free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$8",
      features: ["Advanced projects", "Custom workflows", "Priority support"],
      buttonText: "Get Pro",
      highlight: true,
    },
    {
      name: "Team",
      price: "$15",
      features: ["Admin controls", "SSO & SAML", "Unlimited history"],
      buttonText: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#EAEAEA] py-32 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="max-w-2xl text-center space-y-6 mb-24">
          <h1 className="text-5xl font-semibold tracking-tight">Simple pricing</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-10 rounded-2xl border ${
                plan.highlight
                  ? "border-purple-500/50 bg-white/[0.03] shadow-[0_0_50px_rgba(168,85,247,0.1)]"
                  : "border-white/[0.05] bg-white/[0.01]"
              } flex flex-col space-y-8 hover:border-white/[0.1] transition-all duration-300 group`}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 font-medium">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-400">
                    <Check className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl text-[15px] font-semibold transition-all ${
                  plan.highlight
                    ? "bg-white text-[#0d0d0f] hover:bg-gray-100"
                    : "bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.06]"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
