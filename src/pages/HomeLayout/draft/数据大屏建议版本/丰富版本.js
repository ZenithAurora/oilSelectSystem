import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Select, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import { ThunderboltFilled, DashboardFilled, LineChartOutlined } from '@ant-design/icons';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import * as echarts from 'echarts'; // 添加echarts导入
import OilData from '@/assets/json/oilData.json'; // 导入数据


const { Option } = Select;

// 暗色主题容器
const DarkContainer = styled.div`
  background: #0a1932;
  min-height: 100vh;
  padding: 24px;
  color: rgba(255, 255, 255, 0.85);
  
  .ant-card {
    background: #162447;
    border: 1px solid #24385b;
    color: rgba(255, 255, 255, 0.85);
    
    .ant-card-head {
      border-color: #24385b;
      color: rgba(255, 255, 255, 0.85);
    }
  }
`;

// 动态指标选择器
const metricsOptions = [
  { value: 'TOC', label: '总有机碳含量(TOC)' },
  { value: 'S1_S2', label: '产烃潜力(S1+S2)' },
  { value: 'TMax', label: '最高温度(TMax)' },
  { value: 'Chloroform', label: '氯仿含量' },
];

const DataDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('S1_S2');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 模拟动态数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setData(processData());
      setLoading(false);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // 数据处理
  const processData = () => {
    return OilData.oilData.filter(item =>
      !isNaN(item[selectedMetric]) &&
      !isNaN(item.Height) &&
      item.Lithology
    ).map(item => ({
      ...item,
      Height: Number(item.Height),
      [selectedMetric]: Number(item[selectedMetric])
    }));
  };

  // 图表配置生成器
  const chartConfigs = useMemo(() => ({
    // 3D柱状图
    bar3D: {
      tooltip: {},
      visualMap: {
        show: true,
        min: 0,
        max: Math.max(...data.map(d => d[selectedMetric])),
        inRange: { color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8'] }
      },
      xAxis3D: { type: 'category', data: [...new Set(data.map(d => d.Lithology))] },
      yAxis3D: { type: 'value' },
      zAxis3D: { type: 'value' },
      grid3D: { boxWidth: 200, boxDepth: 80 },
      series: [{
        type: 'bar3D',
        data: data.map(d => ([
          d.Lithology,
          d[selectedMetric],
          d.Height
        ])),
        shading: 'lambert',
        label: { show: false }
      }]
    },

    // 动态关系图
    relation: {
      title: { text: '多维度关系分析', left: 'center', textStyle: { color: '#fff' } },
      xAxis: { name: '深度(m)', type: 'value' },
      yAxis: { name: selectedMetric, type: 'value' },
      series: [{
        data: data.map(d => [d.Height, d[selectedMetric]]),
        type: 'scatter',
        symbolSize: 12,
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(84, 112, 198)'
          }, {
            offset: 1,
            color: 'rgb(14, 45, 98)'
          }])
        }
      }]
    },

    // 指标分布图
    distribution: {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        roseType: 'radius',
        radius: [20, 100],
        center: ['50%', '50%'],
        data: Object.entries(  // 使用Object.entries转换对象
          data.reduce((acc, cur) => {
            const key = cur.Lithology;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {})
        ).map(([name, value]) => ({ name, value }))
      }]
    }
  }), [data, selectedMetric]);

  return (
    <DarkContainer>
      <Row gutter={[24, 24]}>
        {/* 头部控制栏 */}
        <Col span={24}>
          <Card bordered={false} bodyStyle={{ padding: '12px 24px' }}>
            <Row align="middle" gutter={24}>
              <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ThunderboltFilled style={{ fontSize: 28, color: '#1890ff' }} />
                  <h1 style={{ margin: '0 16px', fontSize: 24 }}>石油勘探数据智能分析平台</h1>
                </div>
              </Col>
              <Col flex="auto">
                <Select
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  style={{ width: 300 }}
                  dropdownStyle={{ background: '#162447' }}
                >
                  {metricsOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 实时指标卡片 */}
        <Col span={8}>
          <MetricCard
            icon={<DashboardFilled />}
            title="当前指标最大值"
            value={Math.max(...data.map(d => d[selectedMetric])).toFixed(2)}
            color="#13c2c2"
          />
        </Col>
        <Col span={8}>
          <MetricCard
            icon={<LineChartOutlined />}
            title="当前指标平均值"
            value={(data.reduce((a, b) => a + b[selectedMetric], 0) / data.length).toFixed(2)}
            color="#722ed1"
          />
        </Col>
        <Col span={8}>
          <MetricCard
            icon={<i className="anticon anticon-database" />}
            title="有效数据点数"
            value={data.length}
            color="#fadb14"
          />
        </Col>

        {/* 主可视化区域 */}
        <Col span={12}>
          <ChartCard title="3D多维分析图">
            {loading ? <Spin /> : (
              <ReactECharts
                option={chartConfigs.bar3D}
                style={{ height: 400 }}
                opts={{ renderer: 'svg' }}
              />
            )}
          </ChartCard>
        </Col>

        <Col span={12}>
          <ChartCard title="动态关系分析">
            {loading ? <Spin /> : (
              <ReactECharts
                option={chartConfigs.relation}
                style={{ height: 400 }}
              />
            )}
          </ChartCard>
        </Col>

        <Col span={24}>
          <ChartCard title="岩性分布动态分析">
            {loading ? <Spin /> : (
              <ReactECharts
                option={chartConfigs.distribution}
                style={{ height: 300 }}
              />
            )}
          </ChartCard>
        </Col>
      </Row>
    </DarkContainer>
  );
};

// 可复用卡片组件
const ChartCard = ({ title, children }) => (
  <Card
    title={title}
    headStyle={{ border: 'none' }}
    bodyStyle={{ padding: '24px 0' }}
  >
    {children}
  </Card>
);

const MetricCard = ({ icon, title, value, color }) => (
  <Card bodyStyle={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        background: color + '20',
        borderRadius: 8,
        padding: 12,
        marginRight: 16
      }}>
        {React.cloneElement(icon, {
          style: {
            fontSize: 24,
            color: color
          }
        })}
      </div>
      <div>
        <div style={{ color: '#8b949e' }}>{title}</div>
        <div style={{
          fontSize: 28,
          fontWeight: 600,
          color,
          marginTop: 8
        }}>
          {value}
        </div>
      </div>
    </div>
  </Card>
);

export default DataDashboard;