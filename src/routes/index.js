import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";


// import HomeLayout from "@/pages/HomeLayout";
// import Login from "@/pages/Login";
// import HomePage from "@/pages/HomeLayout/HomePage";
// import DataRecord from "@/pages/HomeLayout/DataRecord";
// import DataScreen from "@/pages/HomeLayout/DataScreen";
// import SystemManage from "@/pages/HomeLayout/SystemManage";
// import SystemMonitor from "@/pages/HomeLayout/SystemMonitor";
// import OilWellRankingSystem from "@/pages/OilWellRankingSystem";




//【1】对上面的路由配置进行性能优化
// 配置路由懒加载，为动态导入 + React.lazy 提供支持
const HomeLayout = React.lazy(() => import("@/pages/HomeLayout"))
const Login = React.lazy(() => import("@/pages/Login"))
const HomePage = React.lazy(() => import("@/pages/HomeLayout/HomePage"))
const DataRecord = React.lazy(() => import("@/pages/HomeLayout/DataRecord"))
const DataScreen = React.lazy(() => import("@/pages/HomeLayout/DataScreen"))
const SystemManage = React.lazy(() => import("@/pages/HomeLayout/SystemManage"))
const SystemMonitor = React.lazy(() => import("@/pages/HomeLayout/SystemMonitor"))
const OilWellRankingSystem = React.lazy(() => import("@/pages/OilWellRankingSystem"))


// 【2】定义加载时的占位组件（可以自定义样式）
const LoadingComponent = () => <div style={{ margin: "10px auto", color: "red" }}>加载中...</div>;



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <HomeLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (<Suspense fallback={<LoadingComponent />}>
          <HomePage />
        </Suspense>)
      },
      {
        path: "dataRecord",
        element: <Suspense fallback={<LoadingComponent />}>
          <DataRecord />
        </Suspense>
      },
      {
        path: "dataScreen",
        element: <Suspense fallback={<LoadingComponent />}>
          <DataScreen />
        </Suspense>
      },
      {
        path: "systemManage",
        element: <Suspense fallback={<LoadingComponent />}>
          <SystemManage />
        </Suspense>
      },
      {
        path: "systemMonitor",
        element: <Suspense fallback={<LoadingComponent />}>
          <SystemMonitor />
        </Suspense>
      }
    ]
  },
  {
    path: "/oilWellRankingPage",
    element: <Suspense fallback={<LoadingComponent />}>
      <OilWellRankingSystem />
    </Suspense>
  }
])


export default router;