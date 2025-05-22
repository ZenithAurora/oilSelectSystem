import { createBrowserRouter } from "react-router-dom";


import HomeLayout from "@/pages/HomeLayout";
import Login from "@/pages/Login";
import HomePage from "@/pages/HomeLayout/HomePage";
import DataRecord from "@/pages/HomeLayout/DataRecord";
import DataScreen from "@/pages/HomeLayout/DataScreen";
import SystemManage from "@/pages/HomeLayout/SystemManage";
import SystemMonitor from "@/pages/HomeLayout/SystemMonitor";
import OilWellRankingSystem from "@/pages/OilWellRankingSystem";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dataRecord",
        element: <DataRecord />,
      },
      {
        path: "dataScreen",
        element: <DataScreen />,
      },
      {
        path: "systemManage",
        element: <SystemManage />,
      },
      {
        path: "systemMonitor",
        element: <SystemMonitor />,
      }
    ]
  },
  {
    path: "/oilWellRankingPage",
    element: <OilWellRankingSystem />
  }
])


export default router;