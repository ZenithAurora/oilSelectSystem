import React, { useRef, useEffect, useState, use } from 'react';
import * as echarts from 'echarts';
import chinaMap from '@/assets/json/china.json';
import oilData from '@/assets/json/oilData.json';
import AutoGenerateWellCoords from '@/utils/autoGenerateWellCoords';
import styles from './SystemMonitor.module.scss';
import locationIcon from '@/assets/img/location.png'
import dayjs from 'dayjs';




const SystemMonitor = () => {
  const mapRef = useRef(null);
  const [selectedWell, setSelectedWell] = useState(oilData.oilData[0]);
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD | HH:mm:ss')); // 模拟时间
  const [currentPageDataList, setCurrentPageDataList] = useState()

  // 为'数据库'中的所有井生成坐标
  const WELL_COORD_MAP = AutoGenerateWellCoords(oilData.oilData);


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
  }, []);  // 依赖项简化（仅初始化时执行）

  //【2】数据图表
  useEffect(() => {
    // 新增绘制图表的useEffect

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

          <div className={styles.Temple}>
          </div>

          <div className={styles.Temple}>
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
          <div className={styles.Temple}>
          </div>
          <div className={styles.Temple}>
          </div>
          <div className={styles.Temple}>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SystemMonitor;