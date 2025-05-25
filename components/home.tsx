import GetStartedButton from "./animata/button/get-started-button";
import { GradientHeading } from "./ui/gradient-heading";
import { TextGif } from "./ui/text-gif";


export default function Hero() {
    const gifUrl = "https://media.giphy.com/media/9Pmfazv34l7aNIKK05/giphy.gif"
    const words = [
        ["F", "r", "o", "m"],
        ["C", "l", "a", "s", "s", "r", "o", "o", "m", "s"],
        ["t", "o"],
        ["C", "u", "t", "t", "i", "n", "g", "-", "E", "d", "g", "e"],
        ["P", "r", "o", "j", "e", "c", "t", "s"]
    ];

    return (
        <div className="h-[500px] text-center flex flex-col items-center gap-6 justify-center z-10">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {words.map((word, wordIndex) => (
                        <div key={wordIndex} className="flex items-center">
                            {word.map((character, charIndex) => (
                                <TextGif
                                    key={`${wordIndex}-${charIndex}`}
                                    gifUrl={gifUrl}
                                    text={character}
                                    size="xxl"
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <p className="text-blue-900 pt-6">Find and apply for professor-led projects across top colleges in India. Gain real-world experience, collaborate with peers, and supercharge your portfolio.</p>
            </div>
            <GetStartedButton text="Ignite Your Journey" />
        </div>
    )
}