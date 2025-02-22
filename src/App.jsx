import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import CarsList from "./cars/CarsList";
import ClientsList from "./clients/ClientsList";
import ContractsList from "./contracts/ContractsList";
import ShowCar from "./cars/ShowCar";
import ShowClient from "./clients/ShowClient";
import ShowContract from "./contracts/ShowContract"; 
import HomePage from "./home/HomePage";
import { Button, ConfigProvider, Input, Space, theme } from 'antd';
import { useFetchData } from "./service/FetchData";


function App() {
  const loading = useFetchData();
  
  if (loading) { return <h2 className="text-center mt-4">Loading...</h2>}

  return (
    <>
      <BrowserRouter>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#ff865b',
          colorInfo: "#ff865b",
          colorBgBase: "#1b262c",
          colorTextBase: "#9fb9d0",
          colorTextQuaternary: "#9fb9d0a6",
        },
      }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/cars">
            <Route index element={<CarsList/>}/>
            <Route path=":id" element={<ShowCar/>}/>
            {/* <Route path="add" element={<AddCar/>}/> */}
          </Route>
          <Route path="/clients">
            <Route index element={<ClientsList/>}/>
            <Route path=":id" element={<ShowClient/>}/>
          </Route>
          <Route path="/contracts">
            <Route index element={<ContractsList/>}/>
            <Route path=":id" element={<ShowContract/>}/>
          </Route>
          <Route path="*" element={<h1>Page Not Found Error 404</h1>}></Route>
        </Routes>
        {/* <Footer /> */}
      </ConfigProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
