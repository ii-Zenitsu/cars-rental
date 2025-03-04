import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "./ui/animated-modal"
import { useOutsideClick } from "./hooks/outsideClick"
import { DatePicker } from "antd"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

const CarCard = ({ car }) => {
  const user = useSelector((state) => state.user)
  const [isOpen, setIsOpen] = useState(false)
  const [rentalDuration, setRentalDuration] = useState([])
  const modalRef = useRef(null)

  useOutsideClick(modalRef, () => setIsOpen(false))

  const handleRentClick = () => {
    setIsOpen(true)
  }

  const handleDateChange = (dates) => {
    setRentalDuration(dates)
  }

  const calculateTotalPrice = () => {
    if (rentalDuration.length === 2) {
      const days = rentalDuration[1].diff(rentalDuration[0], "day")
      return (days * car.price).toFixed(2)
    }
    return "0.00"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would handle the rental submission
    console.log("Rental submitted:", { car, user, rentalDuration })
    setIsOpen(false)
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <figure>
        <img
          src={car.image || "/placeholder.svg"}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {car.brand} {car.model}
        </h2>
        <p>Year: {car.year}</p>
        <p>Type: {car.type}</p>
        <p className="text-lg font-bold">${car.price} per day</p>
        <div className="card-actions justify-end">
          <Modal>
            <ModalTrigger>
              <button className="btn btn-primary" onClick={handleRentClick}>
                Rent Now
              </button>
            </ModalTrigger>
            <ModalBody>
              <ModalContent>
                <h3 className="text-lg font-bold mb-4">
                  Rent {car.brand} {car.model}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Rental Period</label>
                    <RangePicker
                      className="w-full"
                      onChange={handleDateChange}
                      disabledDate={(current) => current && current < dayjs().endOf("day")}
                    />
                  </div>
                  {user && (
                    <div className="mb-4">
                      <h4 className="text-md font-semibold mb-2">User Information</h4>
                      <p>
                        Name: {user.firstName} {user.lastName}
                      </p>
                      <p>Email: {user.email}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold mb-2">Total Price</h4>
                    <p className="text-lg font-bold">${calculateTotalPrice()}</p>
                  </div>
                  <ModalFooter>
                    <button type="submit" className="btn btn-primary">
                      Confirm Rental
                    </button>
                  </ModalFooter>
                </form>
              </ModalContent>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default CarCard

