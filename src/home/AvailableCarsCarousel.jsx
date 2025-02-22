import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Navigation Buttons Component
const SwiperNavButtons = () => {
  const swiper = useSwiper(); // Use the hook inside the child component

  return (
    <>
      <button
        className="prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-outline text-xl w-12 h-12 border-2 bg-white hover:bg-gray-100"
        onClick={() => swiper.slidePrev()}
      >
        ❮
      </button>
      <button
        className="next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-outline text-xl w-12 h-12 border-2 bg-white hover:bg-gray-100"
        onClick={() => swiper.slideNext()}
      >
        ❯
      </button>
    </>
  );
};

export default function AvailableCarsCarousel() {
  const cars = useSelector((state) => state.cars.filter((car) => car.available));

  return (
    <div className="py-12 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> {/* Add relative positioning here */}
        <h2 className="text-3xl font-bold mb-8">Available Cars</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
        >
          {cars.map((car) => (
            <SwiperSlide key={car.id}>
              <div className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={car.image || "/placeholder.svg?height=200&width=300"}
                    alt={car.getName()}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{car.getName()}</h2>
                  <p>Year: {car.year}</p>
                  <p>Type: {car.type}</p>
                  <p className="text-lg font-bold">${car.price} per day</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Rent Now</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* Add the navigation buttons component inside Swiper */}
          <SwiperNavButtons />
        </Swiper>
      </div>
    </div>
  );
}