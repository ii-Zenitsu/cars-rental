import { useSelector } from "react-redux"

export default function CarsDisplay({info, className}) {
  const cars = useSelector((state) => state.cars)
  const contracts = useSelector((state) => state.contracts)
  const featuredCars = [...cars]
  
  return (
    <div className={`py-12 bg-base-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">{info.title}&nbsp;Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.sort((a,b) => Number(b[info.sort]) - Number(a[info.sort])).slice(0, 3).map((car) => (
            <div key={car.id}
              className="p-4 mx-auto flex flex-col w-80 md:w-fit border-sh transition duration-300 hover:bg-base-300 hover:border-primary hover:scale-110 rounded-xl">
              <div className="flex gap-4 flex-col items-center w-full">
                <div>
                  <img src={car.image} alt={car.title} className="h-80 w-full rounded-lg object-cover object-center" />
                </div>
                <div className="flex w-full justify-between items-center gap-2">
                  <div className="flex flex-col w-full px-2 gap-2 items-start">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base">{car.getName()}</span>
                    <div className="flex gap-2">
                      <span className={`badge badge-soft badge-lg badge-accent`}>{car.type}</span>
                      <span className={`badge badge-soft badge-lg badge-warning`}>{car.year}</span>
                    </div>
                    <span className={`badge badge-soft badge-lg ${car.available ? "badge-success" : "badge-secondary"}`}>
                    {car.available ? "Available Now" : `Available in ${car.getDaysLeft(contracts)} Days`}
                    </span>
                  </div>
                    <div className="flex flex-col gap-1 w-1/3 text-center scale-110 m-2">
                      <span className="text-primary font-bold text-2xl border-b">{car.price}&nbsp;€</span>
                      <span className="text-sm">Per Day</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

