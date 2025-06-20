// import { Bot } from "lucide-react";

// import BarChart from "@/components/animata/graphs/bar-chart";
// import AvatarList from "@/components/animata/list/avatar-list";
// import Report from "@/animata/skeleton/report";
// import WideCard from "@/animata/skeleton/wide-card";
import Counter from "@/components/animata/text/counter";
import Ticker from "@/components/animata/text/ticker";
// import TypingText from "@/components/animata/text/typing-text";
import { LogoCarousel } from "@/components/ui/logo-carousel"
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// #region placeholder
function BoldCopy({
    text = "animata",
    className,
    textClassName,
    backgroundTextClassName,
}: {
    text: string;
    className?: string;
    textClassName?: string;
    backgroundTextClassName?: string;
}) {
    if (!text?.length) {
        return null;
    }

    return (
        <div
            className={cn(
                "group relative flex items-center justify-center bg-background px-2 py-2 md:px-6 md:py-4",
                className,
            )}
        >
            <div
                className={cn(
                    "text-4xl font-black uppercase text-foreground/15 transition-all group-hover:opacity-50 md:text-8xl",
                    backgroundTextClassName,
                )}
            >
                {text}
            </div>
            <div
                className={cn(
                    "text-md absolute font-black uppercase text-foreground transition-all group-hover:text-4xl md:text-3xl group-hover:md:text-8xl",
                    textClassName,
                )}
            >
                {text}
            </div>
        </div>
    );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("relative h-full w-full overflow-hidden rounded-2xl p-4", className)}>
            {children}
        </div>
    );
}

function FeatureOne() {

    const [rating, setRating] = useState(2.0);

    useEffect(() => {
        const start = 2.0;
        const end = 4.7;
        const duration = 5000; // in ms
        const step = 0.1;
        const steps = Math.floor((end - start) / step);
        const intervalTime = duration / steps;

        let current = start;

        const interval = setInterval(() => {
        current = parseFloat((current + step).toFixed(1));
        if (current >= end) {
            setRating(end);
            clearInterval(interval);
        } else {
            setRating(current);
        }
        }, intervalTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <BentoCard className="flex flex-col bg-yellow-300 shadow-lg shadow-yellow-200">
            <div className="font-bold text-yellow-700">Highly rated</div>
            <div className="mt-auto flex justify-end">
                <div className="text-4xl w-full font-black text-black/60 md:text-6xl">
                    <Ticker value={rating.toFixed(1)} className="text-end" />
                </div>{" "}
                <sup className="text-xl text-yellow-700">★</sup>
            </div>
        </BentoCard>
    );
}

function FeatureThree() {
    return (
        <BentoCard className="relative flex flex-col overflow-visible bg-purple-300 shadow-lg shadow-purple-200 sm:col-span-2">
            <BoldCopy text="CARREER" className="bg-transparent" textClassName="text-zinc-800" />
        </BentoCard>
    );
}

function FeatureTwo() {
    return (
        <BentoCard className="flex flex-col gap-2 bg-rose-300 shadow-lg shadow-rose-200">
            <div className="w-full -rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:-rotate-3">
                Small Steps
            </div>
           <div className="w-full rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:rotate-3">
               can make
           </div>
           <div className="w-full rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white">
                Great Changes
            </div>
        </BentoCard>
    );
}

function FeatureFour() {
    return (
        <BentoCard className="flex items-center justify-between bg-lime-300 shadow-lg shadow-lime-200 sm:col-span-2 md:flex-row-reverse">
            <p>
                <Counter targetValue={50} format={(v) => +Math.ceil(v) + "k+ students"} className="text-lime-600" />
            </p>
            <div className="relative max-h-32 flex-shrink-0 overflow-hidden">
                <LogoCarousel />
            </div>
        </BentoCard>
    );
}

function FeatureFive() {
    return (
        <BentoCard className="flex flex-col items-center justify-center bg-zinc-300 shadow-lg shadow-zinc-200 sm:col-span-2">
            <BoldCopy text="CATALYSTX" className="bg-transparent" textClassName="text-zinc-800" />
        </BentoCard>
    );
}

// function FeatureSix() {
//     return (
//         <BentoCard className="bg-green-200">
//             <BarChart
//                 items={[
//                     {
//                         progress: 30,
//                         label: "Jan",
//                         className: "rounded-xl bg-green-400",
//                     },
//                     { progress: 70, label: "S", className: "rounded-xl bg-green-400" },
//                     { progress: 60, label: "M", className: "rounded-xl bg-green-400" },
//                     { progress: 90, label: "T", className: "rounded-xl bg-green-400" },
//                     { progress: 10, label: "W", className: "rounded-xl bg-green-400" },
//                     { progress: 20, label: "Th", className: "rounded-xl bg-green-400" },
//                     { progress: 30, label: "F", className: "rounded-xl bg-green-400" },
//                     { progress: 90, label: "Sa", className: "rounded-xl bg-green-400" },
//                 ]}
//                 height={100}
//             />
//             <div className="mt-2 text-center font-bold">Weekly review</div>
//         </BentoCard>
//     );
// }

// function FeatureSeven() {
//     return (
//         <BentoCard className="flex flex-col gap-2 bg-rose-300">
//             <div className="w-full -rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:-rotate-3">
//                 Javascript
//             </div>
//             <div className="w-full rotate-1 rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white md:rotate-3">
//                 ReactJS
//             </div>
//             <div className="w-full rounded-full border-rose-400 bg-rose-400 py-2 text-center font-semibold text-white">
//                 NextJS
//             </div>
//         </BentoCard>
//     );
// }

// function FeatureEight() {
//     return (
//         <BentoCard className="relative flex flex-col bg-blue-200 sm:col-span-2">
//             <WideCard />
//             <div className="mt-4">
//                 <div className="text-lg font-black text-blue-800">Daily reminders</div>
//                 <p className="text-sm">Our daily reminder helps you keep focused on your goals.</p>
//             </div>
//         </BentoCard>
//     );
// }

// #endregion

export default function Eight() {
    return (
        <div className="storybook-fix w-full mx-auto">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:grid-rows-2">
                <FeatureOne />
                <FeatureTwo />
                <FeatureThree />
                <FeatureFour />
                <FeatureFive />
                {/* <FeatureSix />
                <FeatureSeven /> */}
                {/* <FeatureEight /> */}
            </div>
        </div>
    );
}
