import HeroSection from "./HeroSection"
import AvailableCarsCarousel from "./AvailableCarsCarousel"
import FeaturedCars from "./FeaturedCars"
import AboutUs from "./AboutUs"
import ContactUs from "./ContactUs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <HeroSection />
      <AvailableCarsCarousel />
      <FeaturedCars />
      <AboutUs />
      <ContactUs />
    </div>
  )
}

