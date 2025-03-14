import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { all } from "axios";


const useFetchData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("https://ii-zenitsu.github.io/cars-rental/data.json")
    .then(res => {
        dispatch({ type: "UPDATE_CARS", payload: res.data.cars.map(c => createCar(c)) });
        dispatch({ type: "UPDATE_CLIENTS", payload: res.data.clients.map(c => createClient(c)) });
        dispatch({ type: "UPDATE_CONTRACTS", payload: res.data.contracts.map(c => createContract(c)) });

        const email = localStorage.getItem("user_email");
        if (email) {
          const user = createUser(res.data.clients.find((c) => c.email === email));
          if (user) {
            dispatch({ type: "UPDATE_USER", payload: user });
          }
        }

      }).catch((error) => {
        console.error("Error fetching data:", error);
      }).finally(() => {
        setLoading(false);
      });
  },[dispatch]);

  return loading;
};

const useUpdateCarAvailability = () => {
  const dispatch = useDispatch();
  const cars = useSelector(state => state.cars);
  const allcontracts = useSelector(state => state.contracts);


  
  useEffect(() => {
    if (!cars.length || !allcontracts.length) return;

    const updateAvailability = async () => {
      try {
        // Process all contracts in parallel using Promise.all()
        await Promise.all(
          cars.map(async (car) => {
            const contracts = car.getContracts(allcontracts)
            if (!contracts.length) return;

            const isAvailable =  !contracts.some(c => c.getStatus());
            
            // Only update if availability has changed
            if (isAvailable !== car.available) {
              const updatedCar = { ...car, available: isAvailable };
              await axios.put(`http://localhost:3001/cars/${car.id}`, updatedCar);

              // Dispatch Redux update after successful API call
              dispatch({
                type: "UPDATE_CARS",
                payload: cars.map(c => (c.id === car.id ? updatedCar : c)),
              });
            }
          })
        );
      } catch (error) {
        console.error("Failed to update car availability:", error);
      }
    };

    updateAvailability();
  }, []);

};


function createUser(user) {
  return ({...user,
      getFullName : function() { return this.firstName + " " + this.lastName; },
      getInfo : function() { return this.id + " : " + this.getFullName(); },
      getContracts : function(contracts) { return contracts.filter(c => c.clientId === this.id)},
      getActiveContracts : function(contracts) { return contracts.filter(c => c.clientId === this.id && c.getStatus())},
      getAge : function() {
        const birthDate = new Date(this.date_birthday);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) { age--;}
        
        return age;
      }
    })
}

function createCar(car) {
  return ({...car,
    getName : function() { return this.brand + " " + this.model; },
    getInfo : function() { return this.id + " : " + this.getName(); },
    getContracts : function(contracts) { return contracts.filter(c => c.carId === this.id)},
    getDaysLeft: function(contracts) {
      const activeContract = contracts.find(
        contract => contract.carId === this.id && new Date(contract.endDate) > new Date()
      );
      if (!activeContract) {return 0;}
      const diffMs = new Date(activeContract.endDate) - new Date();
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    },
    getAvailabilityDate: function(contracts) {
      const activeContract = contracts.find(
        contract => contract.carId === this.id && new Date(contract.endDate) > new Date()
      );
      if (!activeContract) {return new Date();}
      return new Date(activeContract.endDate)
    },
    })
}

function createClient(client) {
  return ({...client,
      getFullName : function() { return this.firstName + " " + this.lastName; },
      getInfo : function() { return this.id + " : " + this.getFullName(); },
      getContracts : function(contracts) { return contracts.filter(c => c.clientId === this.id)},
      getActiveContracts : function(contracts) { return contracts.filter(c => c.clientId === this.id && c.getStatus())},
      getAge : function() {
        const birthDate = new Date(this.date_birthday);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) { age--;}
        
        return age;
      }
    })
}

function createContract(contract) {
  return ({...contract,
    getClient : function(clients) { return clients.find(c => c.id === this.clientId)},
    getCar : function(cars) { return cars.find(c => c.id === this.carId)},
    getStatus : function() { return new Date(this.endDate) > new Date() ? true : false;},
    getDuration : function() {
      const diffMs = new Date(this.endDate) - new Date(this.startDate);
      return Math.floor(diffMs / (1000 * 60 * 60 * 24))
    },
    getTotalPrice : function(cars) {
      const car = this.getCar(cars);
      if (!car) return 0;

      const timeDiff = new Date(this.endDate) - new Date(this.startDate);
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      return car.price * daysDiff;
    },
    })
}



export {useUpdateCarAvailability, useFetchData, createCar, createClient, createUser, createContract};
