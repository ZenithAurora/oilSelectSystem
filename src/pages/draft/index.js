import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import OilData from '@/assets/json/oilData.json';
import styles from './OilWellRankingSystem.module.scss';



const OilWellRankingSystem = () => {
  const navigate = useNavigate();
  const [selectedWell, setSelectedWell] = useState(null);
  const [currentIndex, setCurrentIndex] = useState('GH');
  const [wellGroups, setWellGroups] = useState({}); // 同名井分组数据
  const [topWellGroup, setTopWellGroup] = useState(null); // 最优井组数据
  const [compareData, setCompareData] = useState(null); // 当前井与最优井对比数据

  // 图表引用
  const rankingChartRef = useRef();
  const detailChartRef = useRef();
  const myRankingChart = useRef();
  const myDetailChart = useRef();

  // 1. 初始化同名井分组,将数据按井名分组
  useEffect(() => {
    const groups = OilData.oilData.reduce((acc, item) => {
      const key = item.WellName;
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
    setWellGroups(groups);
  }, [OilData]);

  // 2. 计算同名井组平均值
  const getWellGroupAvg = useMemo(() => {
    if (Object.keys(wellGroups).length === 0) return {};

    return Object.keys(wellGroups).reduce((acc, wellName) => {
      const groupData = wellGroups[wellName];
      const avg = {
        WellName: wellName,
        dataCount: groupData.length,
        GH: (groupData.reduce((sum, item) => sum + item.GH, 0) / groupData.length).toFixed(2),
        HI: (groupData.reduce((sum, item) => sum + item.HI, 0) / groupData.length).toFixed(2),
        TOC: (groupData.reduce((sum, item) => sum + item.TOC, 0) / groupData.length).toFixed(2),
        TMax: (groupData.reduce((sum, item) => sum + item.TMax, 0) / groupData.length).toFixed(2),
        data: groupData // 保留原始数据用于详情
      };
      acc[wellName] = avg;
      return acc;
    }, {});
  }, [wellGroups]);

  // 3. 自动获取最优井组
  useEffect(() => {
    if (Object.values(getWellGroupAvg).length > 0) {
      const sortedGroups = Object.values(getWellGroupAvg).sort((a, b) => Number(b.GH) - Number(a.GH));
      const topGroup = sortedGroups[0];
      setTopWellGroup(topGroup);
      setSelectedWell(topGroup.WellName); // 初始选中最优井
      setCompareData(calculateComparison(topGroup))
    }
  }, [getWellGroupAvg]);


  // 4. 计算当前井与最优井的对比数据返回的是一个对象，包含了每个指标的当前值、最优值和差值。
  const calculateComparison = (currentWell) => {
    if (!topWellGroup || !currentWell) return null;

    return {
      GH: {
        current: Number(currentWell.GH),
        top: Number(topWellGroup.GH),
        diff: (Number(currentWell.GH) - Number(topWellGroup.GH)).toFixed(2)
      },
      TOC: {
        current: Number(currentWell.TOC),
        top: Number(topWellGroup.TOC),
        diff: (Number(currentWell.TOC) - Number(topWellGroup.TOC)).toFixed(2)
      },
      HI: {
        current: Number(currentWell.HI),
        top: Number(topWellGroup.HI),
        diff: (Number(currentWell.HI) - Number(topWellGroup.HI)).toFixed(2)
      },
      Height: {
        current: currentWell.data[0].Height, // 取当前井组第一个井的高度
        top: topWellGroup.data[0].Height, // 取最优井组第一个井的高度
        diff: (currentWell.data[0].Height - topWellGroup.data[0].Height).toFixed(1)
      }
    };
  };

  // 5. 初始化排名图表
  useEffect(() => {
    myRankingChart.current = echarts.init(rankingChartRef.current, 'dark');

    const updateChart = () => {
      const displayData = Object.values(getWellGroupAvg);

      const sortedData = [...displayData].sort(
        (a, b) => Number(b[currentIndex]) - Number(a[currentIndex])
      );

      myRankingChart.current.setOption({
        title: {
          text: `平均${getIndexLabel(currentIndex)}排名`,
          left: 'center',
          textStyle: { color: '#a8d8ff', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const data = sortedData[params[0].dataIndex];
            return `
              <div class="${styles.tooltip}">
                <p>井号：${data.WellName}</p>
                <p>平均${getIndexLabel(currentIndex)}：${params[0].value}</p>
                <p>排名：${params[0].dataIndex + 1}</p>
                <p>样本量：${data.dataCount}</p>
              </div>
            `;
          }
        },
        xAxis: {
          type: 'category',
          data: sortedData.map(item => item.WellName),
          axisLabel: {
            rotate: 45,
            color: '#a8d8ff',
            fontSize: 12,
            overflow: 'truncate',
            width: 100
          }
        },
        yAxis: {
          type: 'value',
          name: getIndexLabel(currentIndex),
          nameTextStyle: { color: '#a8d8ff' },
          axisLine: { lineStyle: { color: '#2a5a82' } },
          splitLine: { lineStyle: { color: 'rgba(42,90,130,0.3)' } }
        },
        series: [{
          type: 'bar',
          data: sortedData.map(item => item[currentIndex]),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [{ offset: 0, color: '#3a86ff' }, { offset: 1, color: '#0077b6' }]
            )
          },
          barWidth: '60%',
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [{ offset: 0, color: '#ffbe0b' }, { offset: 1, color: '#fb5607' }]
              )
            }
          }
        }]
      });
    };

    // 图表点击事件：直接获取井组数据
    myRankingChart.current.on('click', (params) => {
      const clickedWell = getWellGroupAvg[params.name]; // 直接取井组平均值数据
      setSelectedWell(params.name);
      setCompareData(calculateComparison(clickedWell));
    });

    // 窗口 resize 处理（不变）
    const resizeHandler = () => {
      myRankingChart.current.resize();
      myDetailChart.current?.resize();
    };
    window.addEventListener('resize', resizeHandler);

    updateChart();
    return () => {
      window.removeEventListener('resize', resizeHandler);
      myRankingChart.current.dispose();
    };
  }, [currentIndex, getWellGroupAvg]); // 移除isWellWarMode依赖

  // 6. 初始化详情图表
  useEffect(() => {
    if (!selectedWell || !wellGroups[selectedWell]) return;

    myDetailChart.current = echarts.init(detailChartRef.current, 'dark');
    const currentGroup = wellGroups[selectedWell]; // 当前井组的原始数据

    // 固定显示井组内部对比（柱状图）
    myDetailChart.current.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['GH', 'HI', 'TOC', 'TMax'] },
      xAxis: {
        type: 'category',
        data: currentGroup.map((item, idx) => `${item.Height}m`),
        axisLabel: { color: '#a8d8ff' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#2a5a82' } },
        splitLine: { lineStyle: { color: 'rgba(42,90,130,0.3)' } }
      },
      series: [
        { name: 'GH', type: 'bar', data: currentGroup.map(item => item.GH) },
        { name: 'HI', type: 'line', data: currentGroup.map(item => item.HI) },
        { name: 'TOC', type: 'bar', data: currentGroup.map(item => item.TOC) },
        { name: 'TMax', type: 'bar', data: currentGroup.map(item => item.TMax) }
      ]
    });

    return () => myDetailChart.current?.dispose();
  }, [selectedWell, wellGroups]);

  // 指标标签映射（不变）
  const indexOptions = [
    { label: '综合指数(GH)', value: 'GH' },
    { label: '氢指数(HI)', value: 'HI' },
    { label: '总有机碳(TOC)', value: 'TOC' },
    { label: '热解生烃潜量(PG)', value: 'PG' }
  ];

  const getIndexLabel = (value) => {
    return indexOptions.find(opt => opt.value === value)?.label || value;
  };

  return (
    <div className={styles.container}>
      {/* 头部导航*/}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left mr-2"></i>返回
        </button>
        <h1 className={styles.title}>最佳油井数据评测系统</h1>
        <select
          value={currentIndex}
          onChange={(e) => setCurrentIndex(e.target.value)}
          className={styles.select}
        >
          {indexOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 最优井组信息卡片（不变） */}
      {topWellGroup && (
        <div className={styles.topWellCard}>
          <h3 className={styles.cardTitle}>最优井名：{topWellGroup.WellName}</h3>
          <div className={styles.topStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>样本数量</span>
              <span className={styles.statValue}>{topWellGroup.dataCount}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>平均GH</span>
              <span className={styles.statValue}>{topWellGroup.GH}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>平均TOC</span>
              <span className={styles.statValue}>{topWellGroup.TOC}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>平均HI</span>
              <span className={styles.statValue}>{topWellGroup.HI}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.centerContainer}>
        {/* 对比信息卡片（不变） */}
        {compareData && (
          <div className={styles.compareCard}>
            <h3 className={styles.cardTitle}>与最优井对比</h3>
            <div className={styles.compareGrid}>
              <div className={styles.compareItem}>
                <div className={styles.compareLabel}>综合指数(GH)</div>
                <div className={styles.compareRow}>
                  <span>当前井：{compareData.GH.current}</span>
                  <span>最优井：{compareData.GH.top}</span>
                  <span className={compareData.GH.diff >= 0 ? styles.positive : styles.negative}>
                    差值：{compareData.GH.diff}
                  </span>
                </div>
              </div>
              <div className={styles.compareItem}>
                <div className={styles.compareLabel}>总有机碳(TOC)</div>
                <div className={styles.compareRow}>
                  <span>当前井：{compareData.TOC.current}</span>
                  <span>最优井：{compareData.TOC.top}</span>
                  <span className={compareData.TOC.diff >= 0 ? styles.positive : styles.negative}>
                    差值：{compareData.TOC.diff}
                  </span>
                </div>
              </div>
              <div className={styles.compareItem}>
                <div className={styles.compareLabel}>氢指数(HI)</div>
                <div className={styles.compareRow}>
                  <span>当前井：{compareData.HI.current}</span>
                  <span>最优井：{compareData.HI.top}</span>
                  <span className={compareData.HI.diff >= 0 ? styles.positive : styles.negative}>
                    差值：{compareData.HI.diff}
                  </span>
                </div>
              </div>
              <div className={styles.compareItem}>
                <div className={styles.compareLabel}>储层高度(m)</div>
                <div className={styles.compareRow}>
                  <span>当前井：{compareData.Height.current}</span>
                  <span>最优井：{compareData.Height.top}</span>
                  <span className={compareData.Height.diff >= 0 ? styles.positive : styles.negative}>
                    差值：{compareData.Height.diff}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 排名图表容器（不变） */}
        <div className={styles.chartCard}>
          <div ref={rankingChartRef} style={{ height: '400px' }} />
        </div>
      </div>

      {/* 详情图表容器 */}
      {selectedWell && (
        <div className={styles.chartCard}>
          <div className={styles.detailHeader}>
            <h2 className={styles.chartTitle}>
              {selectedWell}号井—不同高度对比
            </h2>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedWell(null)}
            >×</button>
          </div>
          <div ref={detailChartRef} style={{ height: '400px', marginTop: '1rem' }} />
        </div>
      )}
    </div>
  );
};

export default OilWellRankingSystem;
