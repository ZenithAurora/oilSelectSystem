import React, { useEffect } from 'react';
import './Home.module.scss';
import * as echarts from 'echarts';
import { useRef } from 'react';



const HomePage = () => {
  const chartRef = useRef(null);
  useEffect(() => {

    // 尝试获取渲染图表的节点
    const chartDom = chartRef.current
    // 生成一个echarts实例
    const myChart = echarts.init(chartDom);

    //准备好图表参数
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '1%',
        // left: 'center'
        right: 'center'
      },
      series: [
        {
          name: '石油存储量',
          type: 'pie',
          radius: ['20%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: 'right'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };

    // 使用图表的参数完成图表的渲染
    option && myChart.setOption(option);

  }, [])

  return (
    <div>
      {/* 这里是插图图表的节点 */}
      <div id='main' ref={chartRef} style={{ height: "800px", width: "800px" }}></div>
    </div>
  );
};

export default HomePage;