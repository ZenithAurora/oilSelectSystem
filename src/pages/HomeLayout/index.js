import { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import { Layout, Menu, Button } from 'antd';
import { useEffect } from 'react';
import {
  HomeOutlined,
  DatabaseOutlined,
  DashboardOutlined,
  SettingOutlined,
  MonitorOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import "./index.scss";
import logo from "@/assets/img/logo.png";

const { Sider, Content } = Layout;



const HomeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState();
  const contentMarginLeft = collapsed ? '80px' : '280px'; // 折叠时默认宽度80px，展开时280px
  useEffect(() => {
    setSelectedKeys(window.location.pathname)
  }, [selectedKeys])


  // 菜单配置项
  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: <Link to="/home">首页</Link>,
    },
    {
      key: '/home/datarecord',
      icon: <DatabaseOutlined />,
      label: <Link to="datarecord">数据操作</Link>,
    },
    {
      key: '/home/datascreen',
      icon: <DashboardOutlined />,
      label: <Link to="datascreen">数据综合图表</Link>,
    },
    {
      key: '/home/systemmonitor',
      icon: <MonitorOutlined />,
      label: <Link to="systemmonitor">可视化大屏</Link>,
    },
    {
      key: '/home/systemmanage',
      icon: <SettingOutlined />,
      label: <Link to="systemmanage">系统管理</Link>,
    }

  ];

  return (
    <Layout className="industrial-layout">
      {/* 【1】菜单栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={280}
        className="cyber-sider"
        style={{ position: 'fixed', height: '100vh', zIndex: 100 }}
      >
        <div className="industrial-logo">
          <img src={logo} alt="页岩油甜点预测系统" className='logoImg' />
          <span className="gradient-text">{!collapsed && '智能油田筛选系统'}</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedKeys(key)}
          className="hud-menu"
          selectedKeys={selectedKeys}
        />

        <Button
          type="text"
          className="collapse-trigger"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      </Sider>


      {/* ----------------右侧界面---------------------------- */}
      <Layout
        style={{ marginLeft: contentMarginLeft }}
      >
        <Content className="industrial-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;