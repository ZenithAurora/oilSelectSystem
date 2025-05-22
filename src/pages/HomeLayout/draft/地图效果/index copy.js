import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import chinaMap from '@/assets/json/china.json';
import oilData from '@/assets/json/oilData.json';
import AutoGenerateWellCoords from '@/utils/autoGenerateWellCoords';
import styles from './SystemMonitor.module.scss';
import locationIcon from '@/assets/img/location.png'


const SystemMonitor = () => {
  const mapRef = useRef(null);
  const [selectedWell, setSelectedWell] = useState(null);

  // 为'数据库'中的所有井生成坐标
  const WELL_COORD_MAP = AutoGenerateWellCoords(oilData.oilData);

  // 图表初始化逻辑
  useEffect(() => {
    if (!mapRef.current) return;

    // 初始化图表并注册地图
    const chart = echarts.init(mapRef.current);
    echarts.registerMap('CN', chinaMap);

    // 生成带坐标的井数据（直接使用生成的坐标）
    const wellData = oilData.oilData.map(well => ({
      ...well,
      coord: WELL_COORD_MAP[well.WellName]
    }));

    // 图表配置
    const chartOption = {
      // 这个是，图表的标题信息
      title: {
        text: '中国油田分布示意图',
        subtext: '同名井共享固定坐标',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          textShadowBlur: 8, // 文字阴影
          textShadowColor: 'rgba(0, 247, 255, 0.6)', // 文字阴影颜色
        },
        left: 'center',
        top: '5%'
      },
      // 这个是，鼠标悬浮的时候，显示的信息
      tooltip: {
        trigger: 'item',
        formatter: ({ data }) => `
          <strong>井号：${data.WellName}</strong><br/>
          深度: ${data.Height}m<br/>
          岩性: ${data.Lithology}<br/>
          TOC: ${data.TOC}
        `
      },

      // 这个是地图的配置, 主要是，地图的样式，以及地图的缩放，以及地图的中心点
      geo: {
        map: 'CN',
        roam: true,
        label: { show: true, color: "#fff", fontSize: 12 },
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#0a2c5a' // 渐变起始色
            }, {
              offset: 1, color: '#1a1f4c' // 渐变结束色
            }]
          },
          borderColor: '#ddd'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#6be8808d',  // 悬停时的蓝色背景
            borderColor: '#00f7ff',
            borderWidth: 2
          },
        }
      },

      //这个是，标记点的配置
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: wellData.map(well => ({
          // 坐标
          value: [...well.coord, 8],
          //名字
          name: well.WellName,
          // 数据
          ...well
        })),


        // 标记点的样式
        symbol: `image://${locationIcon}`, // 井的图标
        symbolSize: [20, 20],
        // 标记点的标签名
        label: {
          show: true,
          formatter: '{b}', // 显示井名
          position: 'bottom', // 标签位置
          fontSize: 12, // 字体大小
          distance: 10, // 标签与点的距离
          color: '#00f7ff',
          backgroundColor: 'rgba(12, 25, 55, 0.9)',
          borderColor: 'rgba(0, 247, 255, 0.6)',
          borderWidth: 1,
          borderRadius: 5,
          padding: [2, 4],
          textShadowBlur: 8, // 文字阴影
          textShadowColor: 'rgba(0, 247, 255, 0.6)', // 文字阴影颜色
        },
      }],
    };

    chart.setOption(chartOption);
    chart.on('click', (params) => setSelectedWell(params.data));

    return () => chart.dispose();  // 清理图表
  }, []);  // 依赖项简化（仅初始化时执行）



  return (
    <div className={styles.container}>
      {/* 地图容器 */}
      <div
        ref={mapRef}
        className={styles.mapContainer}
      />

      {/* 选中井详情 */}
      {selectedWell && (
        <div className={styles.detailPanel}>
          <h3 className={styles.title}>{selectedWell.WellName} 详细信息</h3>
          <p className={styles.detailItem}>
            <strong>井深：</strong>{selectedWell.Height}m
          </p>
          <p className={styles.detailItem}>
            <strong>岩性：</strong>{selectedWell.Lithology}
          </p>
          <p className={styles.detailItem}>
            <strong>有机碳含量(TOC)：</strong>{selectedWell.TOC}
          </p>
          <p className={styles.detailItem}>
            <strong>氯仿沥青：</strong>{selectedWell.Chloroform}
          </p>
          <p className={styles.detailItem}>
            <strong>热解参数(S1+S2)：</strong>{selectedWell.S1_S2}
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemMonitor;