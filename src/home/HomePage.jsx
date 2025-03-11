import HeroSection from "./HeroSection"
import AvailableCarsCarousel from "./AvailableCarsCarousel"
import CarsDisplay from "./CarsDisplay"
import AboutUs from "./AboutUs"
import ContactUs from "./ContactUs"
import AnimatedModalDemo from "./modalTest"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <HeroSection />
      <AvailableCarsCarousel />
      <CarsDisplay info={{title: "New", sort: "year"}} />
      <CarsDisplay info={{title: "Best", sort: "price"}} className="bg-base-300" />
      <AboutUs />
      {/* <ContactUs /> */}
    </div>
  )
}

