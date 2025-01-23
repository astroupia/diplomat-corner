    import React from "react";
    import { Rocket, Lightbulb, ShieldCheck } from "lucide-react";

    const WhyDiplomatCorner: React.FC = () => {
    const features = [
        {
        title: "Quick and Easy",
        description:
            "Listing your property or vehicle takes just minutes and goes live almost instantly.",
        icon: <Rocket className="w-10 h-10 text-primary" />,
        },
        {
        title: "Effective",
        description:
            "With thousands of potential buyers in your area, you can sell quickly.",
        icon: <Lightbulb className="w-10 h-10 text-primary" />,
        },
        {
        title: "Privacy Assured",
        description:
            "We take your privacy seriously, ensuring a spam-free experience.",
        icon: <ShieldCheck className="w-10 h-10 text-primary" />,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-primary text-center">
            WHY <span className="block">Diplomat Corner</span>
        </h2>
        <div className="h-1 w-24 bg-primary mx-auto my-4"></div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {features.map((feature, index) => (
            <div
                key={index}
                className="flex flex-col items-center text-center bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
                {/* Top Line */}
                <div className="h-1 w-16 bg-primary mb-4"></div>
                {/* Icon */}
                <div className="mb-4">{feature.icon}</div>
                {/* Title */}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                {/* Description */}
                <p className="text-gray-700">{feature.description}</p>
                {/* Bottom Line */}
                <div className="h-1 w-16 bg-primary mt-4"></div>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default WhyDiplomatCorner;
