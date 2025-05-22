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

  const advancedMenu = [
    { key: 'comprehensive', name: '综合三维分析', icon: '🌐' },
    { key: 'parallel', name: '多参数平行坐标', icon: '📊' },
    { key: 'heatmap', name: '热力关联分析', icon: '🔥' },
    { key: 'stratigraphy', name: '地层剖面分析', icon: '🏞️' },
    { key: 'lithology', name: '岩性特征分布', icon: '🪨' }
  ];

  const processFullData = () => {
    return OilWellData.oilData.filter(item =>
      !isNaN(item.TOC) &&
      !isNaN(item.S1_S2) &&
      !isNaN(item.TMax) &&
      item.Lithology &&
      item.Height
    ).map(item => ({
      ...item,
      Chloroform: item.S_2 / item.TOC * 100,
      ProductionPotential: (item.S1_S2 * item.TOC) / 100
    }));
  };

  const generateAdvancedChart = (type) => {
    const fullData = processFullData();

    switch (type) {
      case 'comprehensive':
        return {
          grid3D: {},
          tooltip: {},
          xAxis3D: { name: 'TOC (%)' },
          yAxis3D: { name: 'S1+S2' },
          zAxis3D: { name: 'TMax (°C)' },
          visualMap: {
            dimension: 2,
            min: Math.min(...fullData.map(item => item.TMax)),
            max: Math.max(...fullData.map(item => item.TMax)),
            inRange: { color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'] }
          },
          series: [{
            type: 'scatter3D',
            data: fullData.map(item => [item.TOC, item.S1_S2, item.TMax]),
            itemStyle: { opacity: 0.8 }
          }]
        };

      case 'parallel':
        return {
          parallelAxis: [
            { dim: 0, name: 'TOC (%)' },
            { dim: 1, name: 'S1+S2' },
            { dim: 2, name: 'TMax (°C)' },
            { dim: 3, name: 'Height (m)' },
            { dim: 4, name: 'Chloroform' }
          ],
          series: {
            type: 'parallel',
            lineStyle: {
              width: 1,
              opacity: 0.3
            },
            data: fullData.map(item => [
              item.TOC,
              item.S1_S2,
              item.TMax,
              item.Height,
              item.Chloroform
            ])
          }
        };

      case 'heatmap':
        return {
          tooltip: { position: 'top' },
          xAxis: {
            type: 'category',
            data: ['TOC', 'S1_S2', 'TMax', 'Height', 'Chloroform']
          },
          yAxis: {
            type: 'category',
            data: ['TOC', 'S1_S2', 'TMax', 'Height', 'Chloroform']
          },
          visualMap: {
            min: -1,
            max: 1,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
          },
          series: [{
            type: 'heatmap',
            data: calculateCorrelations(fullData),
            label: { show: true },
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' }
            }
          }]
        };

      case 'stratigraphy':
        return {
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: [...new Set(fullData.map(item => item.Stratigraphy))],
            name: '地层名称'
          },
          yAxis: { name: '参数值' },
          legend: { data: ['TOC', 'S1_S2', 'Chloroform'] },
          series: [
            {
              name: 'TOC',
              type: 'line',
              data: fullData.reduce((acc, cur) => {
                const key = cur.Stratigraphy;
                if (!acc[key]) acc[key] = [];
                acc[key].push(cur.TOC);
                return acc;
              }, {})
            },
            {
              name: 'S1_S2',
              type: 'line',
              data: fullData.reduce((acc, cur) => {
                const key = cur.Stratigraphy;
                if (!acc[key]) acc[key] = [];
                acc[key].push(cur.S1_S2);
                return acc;
              }, {})
            },
            {
              name: 'Chloroform',
              type: 'line',
              data: fullData.reduce((acc, cur) => {
                const key = cur.Stratigraphy;
                if (!acc[key]) acc[key] = [];
                acc[key].push(cur.Chloroform);
                return acc;
              }, {})
            }
          ]
        };

      case 'lithology':
        return {
          tooltip: { trigger: 'item' },
          radar: {
            indicator: [
              { name: 'TOC', max: 10 },
              { name: 'S1+S2', max: 50 },
              { name: 'Chloroform', max: 800 },
              { name: 'Height', max: 3000 },
              { name: 'TMax', max: 500 }
            ]
          },
          series: [{
            type: 'radar',
            data: generateRadarData(fullData)
          }]
        };

      default:
        return {};
    }
  };

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

  const average = (arr, prop) => {
    const validValues = arr.map(item => item[prop]).filter(v => !isNaN(v));
    return validValues.length ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
  };

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