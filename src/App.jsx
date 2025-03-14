import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import CarsList from "./cars/CarsList"
import ClientsList from "./clients/ClientsList"
import ContractsList from "./contracts/ContractsList"
import ShowCar from "./cars/ShowCar"
import ShowClient from "./clients/ShowClient"
import ShowContract from "./contracts/ShowContract"
import MyContracts from "./components/MyContracts"
import Dashboard from "./dashboard/Dashboard"
import HomePage from "./home/HomePage"
import FormTabs from "./components/Signup"
import SearchResults from "./home/SearchResults"
import { ConfigProvider } from "antd"
import { useFetchData } from "./service/FetchData"
import { ProtectedRoute, ProtectedRouteUser} from "./components/ProtectedRoute"

function App() {
  const loading = useFetchData()

  if (loading) {
    return <h2 className="text-center mt-4">Loading...</h2>
  }

  return (
    <>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff865b",
              colorInfo: "#ff865b",
              colorBgBase: "#1b262c",
              colorTextBase: "#9fb9d0",
              colorTextQuaternary: "#9fb9d0a6",
            },
          }}
        >
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign" element={<FormTabs />} />
            <Route path="/search" element={<SearchResults />} />
            <Route element={<ProtectedRouteUser />}>
              <Route path="/my-contracts">
                <Route index element={<MyContracts />} />
                <Route path=":id" element={<ShowContract />} />
              </Route>
              
              {/* <Route path="/my-contracts" element={<MyContracts />} /> */}
            </Route>

            {/* Protected routes for admin */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cars">
                <Route index element={<CarsList />} />
                <Route path=":id" element={<ShowCar />} />
              </Route>
              <Route path="/clients">
                <Route index element={<ClientsList />} />
                <Route path=":id" element={<ShowClient />} />
              </Route>
              <Route path="/contracts">
                <Route index element={<ContractsList />} />
                <Route path=":id" element={<ShowContract />} />
              </Route>
            </Route>

            <Route path="*" element={<h1>Page Not Found Error 404</h1>} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </>
  )
}

export default App

