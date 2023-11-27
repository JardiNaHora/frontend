import React, {useState} from "react";

import { AppRoutes } from "./routes/routes";
import { Header } from "./components/Header";
import { Drawer } from "./components/Drawer";

import "./App.css"

function App() {
  const [openDrawerToggle, setOpenDrawerToggle] = useState(false)

  const OpenDrawer = () => {
    setOpenDrawerToggle(!openDrawerToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenDrawer={OpenDrawer}/>
      <Drawer openDrawerToggle={openDrawerToggle} OpenDrawer={OpenDrawer}/>
      <AppRoutes />
    </div>
  )
}

export default App;