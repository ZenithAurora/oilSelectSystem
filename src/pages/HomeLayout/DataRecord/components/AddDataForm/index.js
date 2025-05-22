import { Form, Input, Button, message } from 'antd';
import style from './addData.module.scss';

const AddDataForm = ({ onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm(); // 初始化表单数据
  console.log(initialValues);



  // 表单提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);// 子传父
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('请检查输入内容');
    }
  };

  return (
    <div className={style.modal}>
      <div className={style.header}>
        <h3 className={style.title}>新增油田数据</h3>
      </div>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '160px' }}
        className={style.form}
        initialValues={initialValues}
      >
        <Form.Item
          label="ID"
          name="ID"
        >
          <Input disabled />
        </Form.Item>
        {/* 井名 */}
        <Form.Item
          label="井名"
          name="WellName"
          rules={[{ required: true, message: '请输入井名' }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* 深度 */}
        <Form.Item
          label="深度(m)"
          name="Height"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：1500.5）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>
        {/* 层段 */}
        <Form.Item
          label="层段"
          name="Segment"
          rules={[{ required: true, message: '请输入层段' }]}

        >
          <Input placeholder="" />
        </Form.Item>

        {/* 岩性 */}
        <Form.Item
          label="岩性"
          name="Lithology"
          rules={[{ required: true, message: '请输入岩性' }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* 实测TOC */}
        <Form.Item
          label="实测TOC(%)"
          name="TOC"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：2.5）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* S_1 */}
        <Form.Item
          label="S1(mg/g)"
          name="S1"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：1.25）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* S_2 */}
        <Form.Item
          label="S2(mg/g)"
          name="S2"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：3.8）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* 最高温度 */}
        <Form.Item
          label="最高温度(℃)"
          name="TMax"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：450.0）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* PG */}
        <Form.Item
          label="PG(mg/g)"
          name="PG"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：5.05）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* 氯含量 */}
        <Form.Item
          label="氢指数"
          name="HI"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：0.08）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>
        {/* 综合指数 */}
        <Form.Item
          label="GH指数"
          name="GH"
          rules={[{
            required: true,
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效数字（如：0.08）'
          }]}
        >
          <Input placeholder="" />
        </Form.Item>
        {/* 等级 */}
        <Form.Item
          label="等级"
          name="Grade"
          rules={[{ required: true, message: '请输入等级' }]}
        >
          <Input placeholder="" />
        </Form.Item>

        {/* 备注 */}
        <div className={style.footer}>
          <Button
            type="primary"
            onClick={handleSubmit}
            className={style.submitBtn}
          >
            提交
          </Button>
          <Button
            onClick={onClose}
            className={style.cancelBtn}
          >
            取消
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddDataForm;