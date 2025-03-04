import { useSelector } from "react-redux";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

export default function HeroSection() {
  const cars = useSelector((state) => state.cars);
  const testimonials = cars.filter((car) => car.available).map(c => ({src: c.image}))
  const text = "Experience luxury and comfort on your next journey";
  const words = text.split(" ").map(w => ({text: w}));
  // const words = [
  //       {text: "Experience", className: "text-sm font-medium"},{text: "luxury",},{text: "and",},{text: "comfort",},{text: "on",},
  //       {text: "your",},{text: "next",},{text: "journey",}
  //     ];

  return (
      <div className="flex justify-between items-center flex-col lg:flex-row m-4 bg-base-200 rounded-3xl border-sh p-4">
        <div className="w-fit">
          <div className="hero-content text-center">
            <div className="max-w-full text-sm">
              <TypewriterEffectSmooth words={[{text: "Premium"},{text: "Car"},{text: "Rentals"}]} className="text-4xl sm:text-6xl font-bold text-primary" cursorClassName="h-15 sm:h-15 xl:h-15 bg-accent"/>
              <TypewriterEffectSmooth words={words} className="text-sm text-accent sm:text-lg ml-1 font-normal" cursorClassName="h-6.5 sm:h-6.5 xl:h-6.5 bg-primary" />
            </div>
          </div>
        </div>
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
  )
}
