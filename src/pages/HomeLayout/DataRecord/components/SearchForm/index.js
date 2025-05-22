import React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setOilSearchParams, setOilWellData } from '@/store/models/oilWellData';
import OilData from '@/assets/json/oilData.json'


const SearchForm = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const StoreOilWellData = useSelector(store => store.oil.oilWellData)  // 【2】获取到仓库油井数据


  //【操作逻辑函数】
  const handleSearch = (e) => {
    console.log(e);

    //更新store   
    dispatch(setOilSearchParams(e))
    setTimeout(() => {
      // 筛选数据
      // const filteredData = StoreOilWellData.filter(item => {
      //   return Object.keys(e).every(key => {
      //     const value = e[key];
      //     if (value === '') return true; // 如果搜索条件为空，则不进行筛选
      //     return item[key].toString().toLowerCase().includes(value.toLowerCase()); // 忽略大小写进行模糊匹配
      //   });
      // });
      const filteredData = StoreOilWellData.filter(item =>
        item.WellName == e.WellName &&
        item.Height == e.Height &&
        item.Lithology == e.Lithology &&
        item.TMax == e.TMax
      )


      // 检查
      if (filteredData.length === 0) {
        message.warning('未找到匹配的数据');
        return;
      } else {
        // 更新表格数据
        dispatch(setOilWellData(filteredData))
        message.success('查询成功！');
      }
    })
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(setOilSearchParams(null))
    setTimeout(() => {
      message.success('重置成功！');
    })
    dispatch(setOilWellData(OilData.oilData))
  };



  return (
    <div className="search-form-container">
      <Form
        form={form}
        layout="horizontal"
        className="search-form"
        onFinish={handleSearch}
        labelCol={{ flex: '120px' }}
      >
        <div>
          <h2 className="form-title">
            <span className='title'>油田数据查询</span>
          </h2>
        </div>
        <Row gutter={[24, 16]}>
          {[
            { label: "井名", name: "WellName", component: <Input /> },
            { label: "深度", name: "Height", component: <Input /> },
            { label: "岩性", name: "Lithology", component: <Input /> },
            { label: "最高温度", name: "TMax", component: <Input /> },
          ].map((item, index) => (
            <Col
              key={index}
              span={12} // 每行显示2个
              lg={8}    // 大屏显示3个
              xl={6}    // 超大屏显示4个
            >
              <Form.Item
                name={item.name}
                label={item.label}
                labelAlign="right"
                rules={[{ required: true, message: `请输入${item.label}` }]}
              >
                {item.component}
              </Form.Item>
            </Col>
          ))}

          {/* 按钮行 */}
          <Col span={24}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '12px 12px 0',
              marginTop: 16,
              borderTop: '1px solid #2d3a4a'
            }}>

              {/* 右侧原有按钮 */}
              <div style={{ display: 'flex', gap: 16 }}>
                <Button type="primary" htmlType="submit" className="search-button">
                  搜索
                </Button>
                <Button
                  htmlType="button"
                  onClick={handleReset}
                  className="reset-button"
                >
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;