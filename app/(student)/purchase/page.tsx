"use client"
import { motion } from 'framer-motion';
import { Check, FolderOpen, Briefcase, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { toast } from "sonner";
import { useState } from 'react';

interface PricingFeature {
    name: string;
    included: boolean;
    highlight?: boolean;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PricingTier {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    price: string;
    icon: React.ReactNode;
    bgColor: string;
    planId: string;
    popular: boolean;
    features: PricingFeature[];
    cta: string;
}

interface PricingCardProps {
    tier: PricingTier;
    index: number;
    onPurchase: (portal: string, planId: string) => void;
    isProcessing: boolean;
    planType: "monthly" | "annual";
}

const PricingPage = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');

    const handlePurchase = async (portal: string, planId: string) => {
        if (isProcessing) return;

        setIsProcessing(true);

        const purchasePromise = async () => {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    planId,
                    portal
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const errorData = await response.json();
                    if (errorData.code === 'AUTHENTICATION_ERROR') {
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                        throw new Error('Authentication required');
                    }
                }

                if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.code === 'INVALID_PORTAL_SELECTION') {
                        throw new Error('Invalid portal selection');
                    } else if (errorData.code === 'INVALID_PLAN') {
                        throw new Error('Invalid plan selected.')
                    }
                }

                throw new Error('Order creation failed');
            }

            const data = await response.json();

            return new Promise((resolve, reject) => {
                const paymentData = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
                    order_id: data.order.id,
                    handler: async function (response: any) {
                        try {
                            const verifyResponse = await fetch('/api/payments/verify', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    planId
                                })
                            });

                            if (verifyResponse.ok) {
                                const data = await verifyResponse.json();
                                router.push("/");
                                resolve(data);
                            } else {
                                reject(new Error('Payment verification failed'));
                            }
                        } catch (error) {
                            reject(new Error('Payment verification error'));
                        } finally {
                            setIsProcessing(false); // Reset here after payment completion
                        }
                    },
                    prefill: {
                        name: data.userName,
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false); // Reset here when modal is dismissed
                            reject(new Error('Payment cancelled'));
                        }
                    }
                };

                const payment = new window.Razorpay(paymentData);
                payment.open();
            });
        };

        try {
            await toast.promise(purchasePromise(), {
                loading: 'Processing your order...',
                success: 'Payment successful! Redirecting...',
                error: (err) => err.message || 'Payment failed. Please try again.',
            });
        } catch (error) {
            setIsProcessing(false); // Reset on any error that doesn't go through Razorpay handlers
        }
    };

    const getPricingTiers = (planType: 'monthly' | 'annual'): PricingTier[] => [
        {
            id: 'project',
            title: 'Project Portal',
            subtitle: 'Access Real Projects',
            description: 'Get hands-on experience with projects from all colleges',
            price: planType === 'annual' ? '₹3,588' : '₹399',
            icon: <FolderOpen className="w-8 h-8" />,
            bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
            popular: false,
            planId: planType === 'annual' ? "7840b57e-faf3-4d14-95f4-c27d29aeb4d2" : "9bc7ecd8-650d-495e-b0da-793874bd9042",
            features: [
                { name: 'All-colleges project access', included: true, highlight: true },
                { name: 'Download project files', included: false },
                { name: 'Project documentation', included: false },
                { name: 'Source code access', included: false },
                { name: 'Implementation guides', included: true },
                { name: 'Technical support', included: true }
            ],
            cta: 'Get Projects'
        },
        {
            id: 'internship',
            title: 'Internship Portal',
            subtitle: 'Land Your Dream Role',
            description: 'Access exclusive internship opportunities and career guidance',
            price: '₹499',
            icon: <Briefcase className="w-8 h-8" />,
            bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
            popular: true,
            planId: "",
            features: [
                { name: 'Exclusive internship listings', included: true, highlight: true },
                { name: 'Company direct applications', included: true },
                { name: 'Interview preparation', included: false },
                { name: 'Skill assessments', included: true },
                { name: 'Mentor guidance', included: false },
                { name: 'Career roadmap', included: false },
                { name: 'Application tracking', included: true }
            ],
            cta: 'Find Internships'
        },
        {
            id: 'resume',
            title: 'Resume Builder',
            subtitle: 'Professional Resumes',
            description: 'Create ATS-friendly resumes that get you noticed',
            price: '₹149',
            icon: <FileText className="w-8 h-8" />,
            bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            popular: false,
            planId: "",
            features: [
                { name: 'ATS-friendly templates', included: true, highlight: true },
                { name: 'Multiple resume formats', included: true },
                { name: 'Real-time preview', included: true },
                { name: 'PDF export', included: true },
                { name: 'Custom sections', included: false },
                { name: 'Expert tips & suggestions', included: false }
            ],
            cta: 'Build Resume'
        }
    ];

    const pricingTiers = getPricingTiers(planType);

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto pt-8 px-4">
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setPlanType('monthly')}
                                className={`px-6 py-2 rounded-md font-medium transition-colors ${planType === 'monthly'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setPlanType('annual')}
                                className={`px-6 py-2 rounded-md font-medium transition-colors ${planType === 'annual'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Annual
                            </button>
                        </div>
                    </div>
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block mb-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full">
                                Student Portal
                            </span>
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Choose Your Learning Path
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Unlock your potential with our specialized student tools and resources
                            </p>
                        </motion.div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid lg:grid-cols-3 gap-8 justify-items-center mb-16">
                        {pricingTiers.map((tier, index) => (
                            <PricingCard key={tier.id} tier={tier} index={index} onPurchase={handlePurchase} isProcessing={isProcessing} planType={planType} />
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 mb-16 text-white text-center"
                    >
                        <h2 className="text-3xl font-bold mb-4">All-in-One Bundle</h2>
                        <p className="text-xl mb-6">Get all three portals at a special price!</p>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="text-2xl line-through opacity-70">₹1047</span>
                            <span className="text-4xl font-bold">₹899</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Save ₹148</span>
                        </div>
                        <button
                            onClick={() => handlePurchase('ALL', "")}
                            disabled={isProcessing}
                            className={`mt-auto z-20 rounded border-2 border-white bg-white py-3 text-center font-semibold uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white text-sm w-64`}
                        >
                            Get Complete Bundle
                        </button>
                    </motion.div>
                </div>
            </div>
        </>

    );
};

const PricingCard: React.FC<PricingCardProps> = ({ tier, index, onPurchase, isProcessing }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.68, -0.55, 0.265, 1.55] as any,
            },
        },
    }

    // Get the appropriate background component for each tier
    const getBackgroundComponent = () => {
        switch (index) {
            case 0:
                return <CircleBackground />
            case 1:
                return <RectangleBackground />
            case 2:
                return <DiamondBackground />
            default:
                return <CircleBackground />
        }
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{
                duration: 1,
                ease: [0.68, -0.55, 0.265, 1.55] as any,
            }}
            className={`relative h-[500px] w-[350px] max-w-sm overflow-hidden rounded-2xl p-6 ${tier.bgColor} shadow-2xl`}
        >

            <div className="relative z-10 text-white h-full flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                    <span className="block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light text-white backdrop-blur">
                        {tier.title}
                    </span>
                    <div className="text-white/80">{tier.icon}</div>
                </div>

                <motion.div
                    initial={{ scale: 0.85 }}
                    variants={{
                        hover: {
                            scale: 1,
                        },
                    }}
                    transition={{
                        duration: 1,
                        ease: [0.68, -0.55, 0.265, 1.55] as any,
                    }}
                    className="my-4 block origin-top-left"
                >
                    <h3 className="font-bold text-xl leading-tight mb-2">{tier.subtitle}</h3>
                    <p className="text-sm text-white/90 mb-4">{tier.description}</p>
                    <div className="text-3xl font-bold mb-4">{tier.price}</div>
                </motion.div>

                <div className="space-y-2 mb-4 flex-1">
                    {tier.features.map((feature, featureIndex) =>
                        feature.included && (
                            <div key={featureIndex} className="flex items-start space-x-2">
                                <div className="text-white/80 mt-0.5 flex-shrink-0">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`text-sm ${feature.highlight ? "font-semibold" : ""}`}>
                                        {feature.name}
                                    </span>
                                </div>
                            </div>
                        )
                    )}

                </div>

                <button disabled={isProcessing} onClick={() => onPurchase(tier.id.toUpperCase(), tier.planId)} className="mt-auto z-20 rounded border-2 border-white bg-white py-3 text-center font-semibold uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white text-sm">
                    {tier.cta}
                </button>
            </div>

            {getBackgroundComponent()}
        </motion.div>
    )
}

// Background components (same as original)
const CircleBackground = () => {
    return (
        <motion.svg
            width="350"
            height="480"
            viewBox="0 0 320 384"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 z-0"
            variants={{
                hover: {
                    scale: 1.5,
                },
            }}
            transition={{
                duration: 1,
                ease: "backInOut",
            }}
        >
            <motion.circle
                variants={{
                    hover: {
                        scaleY: 0.5,
                        y: -25,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: "backInOut",
                    delay: 0.2,
                }}
                cx="160.5"
                cy="114.5"
                r="101.5"
                fill="#262626"
            />
            <motion.ellipse
                variants={{
                    hover: {
                        scaleY: 2.25,
                        y: -25,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: "backInOut",
                    delay: 0.2,
                }}
                cx="160.5"
                cy="265.5"
                rx="101.5"
                ry="43.5"
                fill="#262626"
            />
        </motion.svg>
    );
};

const RectangleBackground = () => {
    return (
        <motion.svg
            width="425"
            height="450"
            viewBox="0 0 384 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 z-0"
            variants={{
                hover: {
                    scale: 1.5,
                },
            }}
            transition={{
                duration: 1,
                ease: "backInOut",
            }}
        >
            <motion.rect
                x="14"
                y="110"
                width="153"
                height="153"
                rx="15"
                fill="#262626"
                initial={{ y: 100 }}
                variants={{
                    hover: {
                        scale: 1.5,
                        y: 150
                    }
                }}
                transition={{
                    duration: 1,
                    ease: [0.68, -0.55, 0.265, 1.55],
                    delay: 0.1,
                }}
            />

            <motion.rect
                x="155"
                y="30"
                width="153"
                height="153"
                rx="15"
                fill="#262626"
                initial={{ y: 50 }}
                variants={{
                    hover: {
                        scale: 1.5,
                        y: -10
                    }
                }}
                transition={{
                    duration: 1,
                    ease: [0.68, -0.55, 0.265, 1.55],
                    delay: 0.2,
                }}
            />
        </motion.svg>
    );
};

const DiamondBackground = () => {
    return (
        <motion.svg
            width="425"
            height="450"
            viewBox="0 0 384 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 z-0"
            variants={{
                hover: {
                    scale: 1.1,
                },
            }}
            transition={{
                duration: 1,
                ease: "backInOut",
            }}
        >
            <motion.path
                d="M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z"
                fill="#262626"
                variants={{
                    hover: {
                        rotate: -180,
                        scale: 1.1,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: [0.68, -0.55, 0.265, 1.55] as any,
                    delay: 0.1,
                }}
            />
            <motion.path
                d="M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z"
                fill="#262626"
                variants={{
                    hover: {
                        rotate: 180,
                        scale: 1.1,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: "backInOut",
                    delay: 0.2,
                }}
            />
            <motion.path
                d="M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z"
                fill="#262626"
                variants={{
                    hover: {
                        rotate: -180,
                        scale: 1.1,
                    },
                }}
                transition={{
                    duration: 1,
                    ease: [0.68, -0.55, 0.265, 1.55] as any,
                    delay: 0.3,
                }}
            />
        </motion.svg>
    );
};

export default PricingPage;