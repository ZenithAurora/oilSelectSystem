import React, { useEffect, useRef } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import OilData from '@/assets/json/oilData.json';

const DataScreen = () => {
  const chartRef1 = useRef();
  const chartRef2 = useRef();
  const chartRef3 = useRef();

  // 数据预处理
  const processData = () => {
    // 总井数
    const totalWells = OilData.oilData.length;

    // 岩性分布统计
    const lithologyMap = OilData.oilData.reduce((acc, item) => {
      const lithology = item.Lithology || '未知';
      acc[lithology] = (acc[lithology] || 0) + 1;
      return acc;
    }, {});
    const lithologyData = Object.entries(lithologyMap).map(([name, value]) => ({ name, value }));

    // 有效TOC数据（过滤NaN）
    const validTOC = OilData.oilData.filter(item => !isNaN(item.TOC)).map(item => item.TOC);
    const avgTOC = validTOC.length > 0 ? (validTOC.reduce((a, b) => a + b, 0) / validTOC.length).toFixed(2) : 'N/A';

    // S1_S2分布数据
    const s1s2Data = OilData.oilData.map(item => ({
      name: item.WellName,
      value: item.S1_S2
    })).sort((a, b) => b.value - a.value).slice(0, 10); // 取前10

    // 深度与TMax关系数据
    const depthTMaxData = OilData.oilData
      .filter(item => !isNaN(item.Height) && !isNaN(item.TMax))
      .map(item => [item.Height, item.TMax]);

    return {
      totalWells,
      lithologyData,
      avgTOC,
      s1s2Data,
      depthTMaxData
    };
  };

  const { totalWells, lithologyData, avgTOC, s1s2Data, depthTMaxData } = processData();

  // 岩性分布图表配置
  const getLithologyOption = () => ({
    title: { text: '岩性分布占比', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: lithologyData
    }]
  });

  // 关键指标TOP10图表配置
  const getS1S2Option = () => ({
    title: { text: 'S1+S2 关键指标TOP10', left: 'center' },
    xAxis: { type: 'category', data: s1s2Data.map(item => item.name) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: s1s2Data.map(item => item.value),
      itemStyle: { color: '#5470C6' }
    }]
  });

  // 深度与TMax关系配置
  const getDepthTMaxOption = () => ({
    title: { text: '深度与TMax关系', left: 'center' },
    xAxis: { name: '深度(m)', type: 'value' },
    yAxis: { name: 'TMax(℃)', type: 'value' },
    series: [{
      type: 'scatter',
      data: depthTMaxData,
      symbolSize: 10,
      itemStyle: { color: '#EE6666' }
    }]
  });

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 头部统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总井数"
              value={totalWells}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              prefix={<i className="anticon anticon-database" />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均TOC"
              value={avgTOC}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              suffix="%"
              prefix={<i className="anticon anticon-line-chart" />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="岩性种类"
              value={lithologyData.length}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
              prefix={<i className="anticon anticon-pie-chart" />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="岩性分布占比" style={{ height: '400px' }}>
            <ReactECharts
              ref={chartRef1}
              option={getLithologyOption()}
              style={{ width: '100%', height: '320px' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="S1+S2关键指标TOP10" style={{ height: '400px' }}>
            <ReactECharts
              ref={chartRef2}
              option={getS1S2Option()}
              style={{ width: '100%', height: '320px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="深度与TMax关系散点图" style={{ height: '500px' }}>
            <ReactECharts
              ref={chartRef3}
              option={getDepthTMaxOption()}
              style={{ width: '100%', height: '420px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataScreen;