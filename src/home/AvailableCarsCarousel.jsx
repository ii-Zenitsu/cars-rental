import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full text-xl w-10 h-10 border-2 transition duration-300 hover:bg-primary hover:border-primary hover:text-neutral cursor-pointer"
        onClick={() => swiper.slidePrev()}
      >
        ❮
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full text-xl w-10 h-10 border-2 transition duration-300 hover:bg-primary hover:border-primary hover:text-neutral cursor-pointer"
        onClick={() => swiper.slideNext()}
      >
        ❯
      </button>
    </>
  );
};

export default function AvailableCarsCarousel() {
  const swiper = useSwiper();
  const cars = useSelector((state) => state.cars);

  return (
    <div className="py-6 bg-base-100">
      <div className="max-w-full mx-auto px-8 relative"> {/* Add relative positioning here */}
        <h2 className="text-3xl font-bold">Available Cars</h2>
        <Swiper
          className="px-11! py-12!"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={1}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            924: {
              slidesPerView: 3,
              spaceBetween: 35,
            },
            1224: {
              slidesPerView: 4,
              spaceBetween: 45,
            },
          }}
        >
          {cars.filter((c) => c.available).map((car) => (
            <SwiperSlide key={car.id}>
              <div
                className="p-4 flex flex-col border-sh transition duration-300 hover:bg-base-300 hover:border-primary hover:scale-110 rounded-xl">
                <div className="flex gap-4 flex-col items-center w-full">
                  <div>
                    <img
                      src={car.image}
                      alt={car.title}
                      className="h-60 w-full rounded-lg object-cover object-center" />
                  </div>
                  <div className="flex w-full justify-between items-center gap-2">
                    <div className="flex flex-col w-full px-2 gap-2 items-start">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base">{car.getName()}</span>
                      <span className={`badge badge-soft badge-lg badge-accent`}>{car.type}</span>
                    </div>
                      <div className="flex flex-col gap-1 w-1/3 text-center">
                        <span className="text-primary font-bold text-2xl border-b">{car.price}&nbsp;€</span>
                        <span className="text-sm">Per Day</span>
                      </div>
                  </div>
                </div>
              </div>
              {/* <div className="card bg-base-100 border-sh transition duration-300 hover:scale-110">
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
              </div> */}
            </SwiperSlide>
          ))}
          <SwiperNavButtons />
        </Swiper>
      </div>

    </div>
  );
}