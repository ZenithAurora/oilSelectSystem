import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import chinaMap from '@/assets/json/china.json';
import oilData from '@/assets/json/oilData.json';
import AutoGenerateWellCoords from '@/utils/autoGenerateWellCoords';
import styles from './SystemMonitor.module.scss';
import locationIcon from '@/assets/img/location.png'
import dayjs from 'dayjs';




const SystemMonitor = () => {
  // （1）图表容器
  const mapRef = useRef(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartRef4 = useRef(null);
  const chartRef5 = useRef(null);

  //（2）状态变量
  const [selectedWell, setSelectedWell] = useState(oilData.oilData[0]);
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD | HH:mm:ss')); // 模拟时间
  const [currentPageDataList, setCurrentPageDataList] = useState()

  // 为'数据库'中的所有井生成坐标
  const WELL_COORD_MAP = AutoGenerateWellCoords(oilData.oilData);


  // 初始化图表函数
  const initChart = (dom, option) => {
    if (!dom) return;
    const chart = echarts.init(dom);
    chart.setOption(option);

    // 窗口resize监听
    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  };


  // 【1】地图图表初始化逻辑
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
          TOC: ${data.TOC}<br/>
          综合指数: ${data.GH}<br/>
          生油等级: ${data.Grade}<br/>
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
        },
        layoutCenter: ['50%', '50%'], // 地图居中
        layoutSize: '100%' // 地图大小
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
          fontSize: 10, // 字体大小
          distance: 10, // 标签与点的距离
          color: '#00f7ff',
          backgroundColor: 'rgba(12, 25, 55, 0.9)',
          borderColor: 'rgba(0, 247, 255, 0.6)',
          borderWidth: 1,
          borderRadius: 15,
          padding: [2, 4],
        },
      }],
    };

    chart.setOption(chartOption);
    chart.on('click', (params) => {
      // 只有点击了标记点才触发
      if (params.data?.WellName) {
        setSelectedWell(params.data);
      }
    });

    return () => chart.dispose();  // 清理图表
  }, []);

  //【2】数据图表
  useEffect(() => {
    if (!currentPageDataList?.length) return;

    // 计算当前井的深度范围
    const heights = currentPageDataList.map(item => item.Height);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    const rangePadding = (maxHeight - minHeight) * 0.05;
    const xAxisRange = [minHeight - rangePadding, maxHeight + rangePadding];

    // 公共配置
    const commonStyle = {
      background: 'rgba(12, 25, 55, 0.9)',
      textStyle: { color: '#fff' },
      grid: {
        left: '15%',
        right: '10%',
        bottom: '15%',
        // containLabel: true
      }
    };

    // 动态生成图表配置的函数（新增）
    const createChartOption = (title, yName, dataKey) => {
      // 计算y轴范围
      const values = currentPageDataList.map(item => item[dataKey]);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const yPadding = (maxVal - minVal) * 0.1; // 10%的边距

      return {
        ...commonStyle,
        title: { text: title, left: 'center' },
        xAxis: {
          type: 'value',
          name: '深度(m)',
          min: xAxisRange[0],
          max: xAxisRange[1],
          axisLabel: { formatter: value => value.toFixed(0) + 'm' },
          axisLine: { lineStyle: { color: '#00f7ff' } }
        },
        yAxis: {
          type: 'value',
          name: yName,
          min: minVal - yPadding,
          max: maxVal + yPadding,
          axisLine: { lineStyle: { color: '#00f7ff' } },
          splitLine: { show: false },
          axisLabel: {
            formatter: value => dataKey === 'TMax' ? `${value}°C` : value
          }
        },
        series: [{
          data: currentPageDataList
            .sort((a, b) => a.Height - b.Height)
            .map(item => [item.Height, item[dataKey]]),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#00f7ff',
            width: 2,
            shadowColor: 'rgba(0, 247, 255, 0.8)',
            shadowBlur: 10
          },
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: { color: '#00f7ff', borderColor: '#fff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 247, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 247, 255, 0)' }
            ])
          }
        }]
      };
    };

    // 初始化所有图表
    initChart(chartRef1.current, createChartOption('TOC - 深度关系', 'TOC(%)', 'TOC'));
    initChart(chartRef2.current, createChartOption('PG - 深度关系', 'PG(%)', 'PG'));
    initChart(chartRef3.current, createChartOption('HI - 深度关系', 'HI', 'HI'));
    initChart(chartRef4.current, createChartOption('TMax - 深度关系', 'TMax(°C)', 'TMax'));
    initChart(chartRef5.current, createChartOption('GH - 深度关系', 'GH', 'GH'));

  }, [currentPageDataList]);

  //右上角时间
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(dayjs().format('YYYY-MM-DD | HH:mm:ss'));
    }, 1000);
  }, [currentTime])

  // 根据井得名字，找到json数据库中得所有得同名井的数据
  useEffect(() => {
    if (selectedWell) {
      const templeList = oilData.oilData.filter(well => well.WellName === selectedWell.WellName);
      console.log(templeList);
      setCurrentPageDataList(templeList);
    }
  }, [selectedWell])



  return (
    <div className={styles.pageContainer}>
      {/* 【1】头部 */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>油井数据可视化平台</span>
        <p className={styles.SystemTime}>{currentTime}</p>
      </div>


      <div className={styles.container}>

        {/* 【1】左侧组件 */}
        <div className={styles.leftContainer}>
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

          <div className={styles.Temple} ref={chartRef1}>
          </div>

          <div className={styles.Temple} ref={chartRef2}>
          </div>
        </div>

        {/* 【2】中间组件 */}
        <div className={styles.centerContainer}>
          {/* 【2】地图容器 */}
          <div
            ref={mapRef}
            className={styles.mapContainer}
          />
        </div>

        {/* 【3】右边组件 */}
        <div className={styles.rightContainer}>
          <div className={styles.Temple} ref={chartRef3}>
          </div>
          <div className={styles.Temple} ref={chartRef4}>
          </div>
          <div className={styles.Temple} ref={chartRef5}>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SystemMonitor;