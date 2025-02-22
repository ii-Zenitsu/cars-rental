import { useSelector } from "react-redux"

export default function FeaturedCars() {
  const cars = useSelector((state) => state.cars)
  const featuredCars = cars.slice(0, 3) // Just take the first 3 cars as featured

  return (
    <div className="py-12 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Featured Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div key={car.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img src={car.image || "/placeholder.svg?height=200&width=300"} alt={car.getName()} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{car.getName()}</h2>
                <p>Year: {car.year}</p>
                <p>Type: {car.type}</p>
                <p className="text-lg font-bold">${car.price} per day</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

