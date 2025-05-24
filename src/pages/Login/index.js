import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.scss';
import logo from '@/assets/img/logo.png';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 加载记住的用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      form.setFieldsValue(user);
    }
  }, [form]);

  const onFinish = (values) => {
    if (values.username === 'admin' && values.password === '123456') {
      // 处理记住我功能
      const storage = values.remember ? localStorage : sessionStorage;
      storage.setItem('rememberedUser', JSON.stringify(values));

      message.success('登录成功，正在进入系统...', 0.5, () => {
        message.success('欢迎回来', 0.5, () => {
          navigate('/home');
        })
      });
    } else {
      let errorMsg = '账号或密码错误';
      if (values.username !== 'admin') errorMsg = '账号不存在';
      else if (values.password !== '123456') errorMsg = '密码错误';
      message.error(errorMsg);
    }
  };

  return (
    <div className="login-container">
      <Card className="glass-card">
        <div className="card-content">
          {/* 左侧品牌区 */}
          <div className="brand-panel">
            <img src={logo} alt="logo" className="logo-icon" />
            <Title level={2} className="system-title">页岩油甜点预测系统</Title>
            <Text className="system-tagline">数据赋能精准勘探</Text>
          </div>

          {/* 右侧表单区 */}
          <div className="form-panel">
            <div className="form-header">
              <Title level={3} className="welcome-text">Welcome Back</Title>
              <Text className="login-tip">请输入您的认证信息</Text>
            </div>

            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名/工号' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="工号/用户名"
                  className="glass-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入登录密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="登录密码"
                  className="glass-input"
                />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                className="form-remember"
              >
                <div className="form-actions">
                  <Checkbox>记住我</Checkbox>
                  <Text link className="forgot-password">忘记密码？</Text>
                </div>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="oil-btn"
                block
              >
                进入系统
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;