import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import chinaMap from '@/assets/json/china.json'; // 中国地图数据
import oilData from '@/assets/json/oilData.json'; // 油田数据

/**
 * 
 * 使用echarts的步骤：
 * 【1】准备工作：
 *      引入echarts库
 *      准备一个容器
 * 【2】初始化echarts实例
 *      let instance = echarts.init(容器)
 *      注册地图
 * 【3】配置选项
 *      const option = {}
 *      应用配置instance.setOption(option)
 * 【4】监听事件
 *      instance.on('click', (params) => {})
 */



const SystemMonitor = () => {
  const mapRef = useRef(null);
  const [selectedWell, setSelectedWell] = useState(null);
  let chartInstance = null;


  // 初始化地图
  useEffect(() => {
    // 1. 注册地图
    echarts.registerMap('CN', chinaMap);

    // 2. 初始化图表
    chartInstance = echarts.init(mapRef.current);

    // 3. 配置地图选项
    const option = {
      // 这个是配置图表标题信息
      title: {
        text: '中国油田分布热力图',
        subtext: '数据来源：油田勘探数据',
        left: 'center'
      },

      // 这个是用来配置，当鼠标悬浮到地图上的时候，显示的信息的
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const well = oilData.oilData.find(w => w.WellName === params.name);
          return well ? `
            <b>${params.name}</b><br/>
            基底深度：${well.Height}m<br/>
            TOC含量：${well.TOC}%<br/>
            生烃潜量：${well.S1_S2} mg/g
          ` : params.name;
        }
      },

      //根据数据显示不同的颜色
      visualMap: {
        min: 0,
        max: 5,
        text: ['高 TOC', '低 TOC'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#f7f7f7', '#00441b']
        }
      },

      //这个是图表系列的配置
      series: [{
        type: 'map',  // 图表的类型
        map: 'CN',
        roam: true, // 是否允许缩放和拖动
        label: { // 标签配置
          show: true,
          color: '#000',
          fontSize: 8,
        },
        data: oilData.oilData.map(well => ({
          name: well.WellName,
          value: well.TOC
        })),
        nameProperty: 'name',
        emphasis: { // 鼠标悬浮在地图上的时候的高亮效果
          itemStyle: {
            areaColor: '#238443'
          }
        },
        select: {
          itemStyle: {
            borderColor: '#000',
            borderWidth: 2
          }
        }
      }]
    };

    chartInstance.setOption(option);

    // 4. 绑定点击事件
    chartInstance.on('click', (params) => {
      console.log(params);

      const selected = oilData.oilData.find(w => w.WellName === params.name);
      setSelectedWell(selected);
    });

    // 组件卸载时清理
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, []);


  return (
    <div style={{ padding: 20 }}>
      {/* 地图容器 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '600px',
          margin: '20px 0',
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          background: '#9999'
        }}
      />

      {/* 详细信息面板 */}
      {selectedWell && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2>{selectedWell.WellName} - 详细数据分析</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '20px'
          }}>
            {/* 数据表格 */}
            <div>
              <h3>基础参数</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <TableRow label="井号" value={selectedWell.WellName} />
                  <TableRow label="深度(m)" value={selectedWell.Height} />
                  <TableRow label="岩性" value={selectedWell.Lithology} />
                  <TableRow label="TOC(%)" value={selectedWell.TOC} />
                  <TableRow label="S1(mg/g)" value={selectedWell.S_1} />
                  <TableRow label="S2(mg/g)" value={selectedWell.S_2} />
                </tbody>
              </table>
            </div>

            {/* 图表容器 */}
            <div>
              <h3>生烃潜量分析</h3>
              <div
                id="s1-s2-chart"
                style={{
                  height: '300px',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <HydrocarbonChart wellData={selectedWell} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 辅助组件：表格行
const TableRow = ({ label, value }) => (
  <tr style={{ borderBottom: '1px solid #eee' }}>
    <td
      style={{
        padding: '8px 12px',
        fontWeight: '500',
        color: '#666'
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: '8px 12px',
        textAlign: 'right',
        color: '#333'
      }}
    >
      {value}
    </td>
  </tr>
);

// 生烃潜量图表组件
const HydrocarbonChart = ({ wellData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['S1', 'S2', '生烃总量']
      },
      yAxis: {
        type: 'value',
        name: 'mg/g'
      },
      series: [{
        data: [wellData.S_1, wellData.S_2, wellData.S1_S2],
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#238443' },
            { offset: 1, color: '#68aa63' }
          ]),
          borderRadius: 5
        }
      }]
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [wellData]);

  return <div ref={chartRef} style={{ height: '100%' }} />;
};


export default SystemMonitor;