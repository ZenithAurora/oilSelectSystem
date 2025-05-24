// src/components/DataScreen.jsx
import { useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import styles from './DataScreen.module.scss'
import OilData from '@/assets/json/oilData.json'

// 注册主题
echarts.registerTheme('dark', {
  backgroundColor: 'transparent',
  color: ['#4facfe', '#00f2fe', '#f46b45', '#fdd262', '#d87c7c'],
  textStyle: { color: '#fff' }
})

const Charts = {
  //岩性分布
  LithologyPie: ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
      const chart = echarts.init(chartRef.current, 'dark')
      const lithologyData = data.reduce((acc, { Lithology }) => {
        acc[Lithology] = (acc[Lithology] || 0) + 1
        return acc
      }, {})

      const option = {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: Object.entries(lithologyData).map(([name, value]) => ({
            name,
            value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ])
            }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }

      chart.setOption(option)
      return () => chart.dispose()
    }, [data])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
  },

  //TOC趋势分析
  TOCLine: ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
      const chart = echarts.init(chartRef.current, 'dark')
      const sortedData = [...data].sort((a, b) => a.Height - b.Height)

      const option = {
        title: { text: 'TOC趋势分析', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: sortedData.map(d => d.Height),
          axisLine: { lineStyle: { color: '#4facfe' } }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#4facfe' } },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{
          data: sortedData.map(d => d.TOC),
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79, 172, 254, 0.6)' },
              { offset: 1, color: 'rgba(0, 242, 254, 0.1)' }
            ])
          },
          lineStyle: { width: 3 }
        }]
      }

      chart.setOption(option)
      return () => chart.dispose()
    }, [data])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
  },

  //井参数对比
  WellComparisonBar: ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
      const chart = echarts.init(chartRef.current, 'dark')
      const wells = [...new Set(data.map(d => d.WellName))]
      const processedData = wells.map(well => ({
        well,
        avgTOC: data.filter(d => d.WellName === well)
          .reduce((sum, d) => sum + d.TOC, 0) / data.filter(d => d.WellName === well).length,
        maxS1: Math.max(...data.filter(d => d.WellName === well).map(d => d.S_1))
      }))

      const option = {
        title: { text: '井参数对比', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { top: '20%', bottom: '15%' },
        xAxis: {
          type: 'category',
          data: wells,
          axisLabel: { rotate: 45 }
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '平均TOC',
            type: 'bar',
            data: processedData.map(d => d.avgTOC),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ])
            }
          },
          {
            name: '最大S1',
            type: 'bar',
            data: processedData.map(d => d.maxS1),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f46b45' },
                { offset: 1, color: '#fdd262' }
              ])
            }
          }
        ]
      }

      chart.setOption(option)
      return () => chart.dispose()
    }, [data])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
  },

  //S1-S2-TMax关系分析
  ParameterScatter: ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
      const chart = echarts.init(chartRef.current, 'dark')

      const option = {
        title: { text: 'S1-S2-TMax关系分析', left: 'center' },
        grid: { top: '18%' },
        tooltip: {
          formatter: params => `
            TMax: ${params.value[2]}℃<br/>
            S1: ${params.value[0]} mg/g<br/>
            S2: ${params.value[1]} mg/g
          `
        },
        xAxis: {
          name: 'S1 (mg/g)',
          min: Math.min(...data.map(d => d.S1)),
          max: 20
        },
        yAxis: { name: 'S2 (mg/g)' },
        visualMap: {
          top: 'bottom',
          min: Math.min(...data.map(d => d.TMax)),
          max: Math.max(...data.map(d => d.TMax)),
          dimension: 2,
          inRange: { color: ['#4facfe', '#00f2fe', '#fdd262'] }
        },
        series: [{
          type: 'scatter',
          data: data.map(d => [d.S1, d.S2, d.TMax]),
          symbolSize: val => Math.sqrt(val[0] + val[1]) * 1.5,
          itemStyle: {
            opacity: 0.8,
            borderColor: '#fff',
            borderWidth: 1
          }
        }]
      }

      chart.setOption(option)
      return () => chart.dispose()
    }, [data])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
  },

  //HI组成分析
  HIComposition: ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
      const chart = echarts.init(chartRef.current, 'dark')
      const hiRanges = [
        { min: 0, max: 1, name: '低成熟度' },
        { min: 1, max: 2, name: '中等成熟度' },
        { min: 2, max: Infinity, name: '高成熟度' }
      ]

      const counts = hiRanges.map(range =>
        data.filter(d => d.HI >= range.min && d.HI < range.max).length
      )

      const option = {
        tooltip: { trigger: 'item' },
        radar: {
          indicator: hiRanges.map(r => ({ name: r.name, max: Math.max(...counts) })),
          shape: 'circle',
          splitArea: { show: false },
          axisLine: { lineStyle: { color: 'rgba(79, 172, 254, 0.5)' } }
        },
        series: [{
          type: 'radar',
          data: [{ value: counts, name: 'HI分布' }],
          areaStyle: { color: 'rgba(79, 172, 254, 0.3)' },
          lineStyle: { color: '#4facfe' }
        }]
      }

      chart.setOption(option)
      return () => chart.dispose()
    }, [data])

    return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
  }
}

const DataScreen = () => {
  const oilData = OilData.oilData

  // 计算关键指标
  const kpis = useMemo(() => ({
    total: oilData.length,
    maxTOC: Math.max(...oilData.map(d => d.TOC)),
    goodSourceRock: oilData.filter(d => d.TOC > 2).length,
    avgHI: oilData.reduce((sum, d) => sum + d.HI, 0) / oilData.length
  }), [oilData])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>系统样本数据概览</h1>
      </div>

      {/* 第一行的数据卡片 */}
      <div className={styles.kpiContainer}>
        <div className={styles.kpiItem}>
          <div className={styles.kpiValue}>{kpis.total}</div>
          <div className={styles.kpiLabel}>总样本数</div>
        </div>
        <div className={styles.kpiItem}>
          <div className={styles.kpiValue}>{kpis.maxTOC.toFixed(2)}</div>
          <div className={styles.kpiLabel}>最大TOC值</div>
        </div>
        <div className={styles.kpiItem}>
          <div className={styles.kpiValue}>{kpis.goodSourceRock}</div>
          <div className={styles.kpiLabel}>优质烃源岩</div>
        </div>
        <div className={styles.kpiItem}>
          <div className={styles.kpiValue}>{kpis.avgHI.toFixed(1)}</div>
          <div className={styles.kpiLabel}>平均HI值</div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={`${styles.chartCard} ${styles.quarter}`}>
          <div className={styles.chartTitle}>岩性分布</div>
          <Charts.LithologyPie data={oilData} />
        </div>

        <div className={`${styles.chartCard} ${styles.quarter}`}>
          <div className={styles.chartTitle}>HI组成分析</div>
          <Charts.HIComposition data={oilData} />
        </div>

        <div className={`${styles.chartCard} ${styles.half}`}>
          <div className={styles.chartTitle}>井参数对比</div>
          <Charts.WellComparisonBar data={oilData} />
        </div>

        <div className={`${styles.chartCard} ${styles.half}`}>
          <div className={styles.chartTitle}>S1-S2-TMax关系分析</div>
          <Charts.ParameterScatter data={oilData} />
        </div>

        <div className={`${styles.chartCard} ${styles.half}`}>
          <div className={styles.chartTitle}>TOC趋势分析</div>
          <Charts.TOCLine data={oilData} />
        </div>
      </div>
    </div>
  )
}

export default DataScreen