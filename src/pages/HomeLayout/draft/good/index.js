import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import OilWellData from '@/assets/json/oilData.json';
import './index.scss';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('comprehensive');
  const [chartOption, setChartOption] = useState({});
  const [userInfo] = useState({ name: '地质分析师', role: '高级权限' });

  // 高级菜单配置
  const advancedMenu = [
    { key: 'comprehensive', name: '综合三维分析', icon: '🌐' },
    { key: 'parallel', name: '多参数平行坐标', icon: '📊' },
    { key: 'heatmap', name: '热力关联分析', icon: '🔥' },
    { key: 'stratigraphy', name: '地层剖面分析', icon: '🏞️' },
    { key: 'lithology', name: '岩性特征分布', icon: '🪨' }
  ];

  // 数据预处理
  const processFullData = () => {
    return OilWellData.oilData.filter(item =>
      !isNaN(item.TOC) &&
      !isNaN(item.S1_S2) &&
      !isNaN(item.TMax) &&
      item.Lithology &&
      item.Height
    ).map(item => ({
      ...item,
      Chloroform: item.S_2 / item.TOC * 100,  // 计算氢指数
      ProductionPotential: (item.S1_S2 * item.TOC) / 100  // 自定义生产潜力指标
    }));
  };

  // 生成高级图表配置
  const generateAdvancedChart = (type) => {
    const fullData = processFullData();

    switch (type) {
      // ...（原有图表配置保持不变）
      case 'heatmap':
        return {
          // ...（原有配置保持不变）
          series: [{
            // ...（原有配置保持不变）
            data: calculateCorrelations(fullData),
          }]
        };
      // ...（其他case保持不变）
      default:
        return {};
    }
  };

  // 辅助函数：计算Pearson相关系数
  const pearsonCorrelation = (x, y) => {
    if (x.length !== y.length) throw new Error('数据长度不一致');
    if (x.length < 2) return 0;

    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / x.length;

    const covariance = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0) / (x.length - 1);
    const stdX = Math.sqrt(x.reduce((acc, xi) => acc + (xi - meanX) ** 2, 0) / (x.length - 1));
    const stdY = Math.sqrt(y.reduce((acc, yi) => acc + (yi - meanY) ** 2, 0) / (x.length - 1));

    return stdX * stdY === 0 ? 0 : covariance / (stdX * stdY);
  };

  // 辅助函数：计算平均值
  const average = (arr, prop) => {
    const validValues = arr.map(item => item[prop]).filter(v => !isNaN(v));
    return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
  };

  // 辅助函数：计算相关系数矩阵
  const calculateCorrelations = (data) => {
    const params = ['TOC', 'S1_S2', 'TMax', 'Height', 'Chloroform'];
    const matrix = [];

    params.forEach((xParam, xi) => {
      params.forEach((yParam, yi) => {
        if (xi < yi) {
          const xValues = data.map(d => d[xParam]);
          const yValues = data.map(d => d[yParam]);
          matrix.push({
            value: [xi, yi, pearsonCorrelation(xValues, yValues).toFixed(2)]
          });
        }
      });
    });
    return matrix;
  };

  // 辅助函数：生成雷达图数据
  const generateRadarData = (data) => {
    const lithologyGroups = data.reduce((acc, cur) => {
      if (!acc[cur.Lithology]) acc[cur.Lithology] = [];
      acc[cur.Lithology].push(cur);
      return acc;
    }, {});

    return Object.entries(lithologyGroups).map(([type, group]) => ({
      name: type,
      value: [
        average(group, 'TOC'),
        average(group, 'S1_S2'),
        average(group, 'Chloroform'),
        average(group, 'Height'),
        average(group, 'TMax')
      ]
    }));
  };

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  useEffect(() => {
    const option = generateAdvancedChart(activeMenu);
    setChartOption(option);
  }, [activeMenu]);

  return (
    <div className="advanced-analysis-system">
      <div className="glassmorpChloroformc-header">
        <div className="header-content">
          <h1 className="system-title">🛢️ 智能油藏分析系统 v2.0</h1>
          <div className="user-panel" onClick={handleLogout}>
            <div className="user-avatar">{userInfo.name[0]}</div>
            <div className="user-meta">
              <div className="user-name">{userInfo.name}</div>
              <div className="user-role">{userInfo.role}</div>
            </div>
          </div>
        </div>

        <div className="navigation-panel">
          {advancedMenu.map(item => (
            <div
              key={item.key}
              className={`nav-card ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="visualization-container">
        <ReactECharts
          option={chartOption}
          style={{ height: 'calc(100vh - 220px)', width: '100%' }}
          opts={{ renderer: 'svg', locale: 'ZH' }}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default HomePage;
