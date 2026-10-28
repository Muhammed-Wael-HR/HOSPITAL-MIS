import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Tag, message } from 'antd';
import { UserOutlined, LockOutlined, HeartFilled, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

const { Title, Text, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const hospitalSettings = useAppStore((state) => state.hospitalSettings);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      login(
        {
          id: 1,
          username: values.username,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
        'mock-jwt-token-active'
      );
      message.success(`تم تسجيل الدخول بنجاح، مرحباً بك في ${hospitalSettings.nameAr}`);
      setLoading(false);
      navigate('/');
    }, 600);
  };

  const handleQuickLogin = (role: string, name: string) => {
    login(
      {
        id: 1,
        username: name,
        role: role as any,
        isActive: true,
      },
      'mock-jwt-token-active'
    );
    message.success(`تم الدخول بحساب تجريبي: ${name} (${role})`);
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #096dd9 0%, #002140 100%)',
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 440,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '12px 8px',
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 30,
              boxShadow: '0 4px 12px rgba(24,144,255,0.4)',
              marginBottom: 12,
            }}
          >
            <HeartFilled />
          </div>
          <Title level={3} style={{ margin: '0 0 4px 0' }}>
            {hospitalSettings.nameAr}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            نظام المعلومات الصحي والإداري المتكامل (HIS/MIS)
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} initialValues={{ username: 'admin', password: 'password123' }}>
          <Form.Item
            name="username"
            label="اسم المستخدم أو الكود الوظيفي"
            rules={[{ required: true, message: 'يرجى إدخال اسم المستخدم' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[{ required: true, message: 'يرجى إدخال كلمة المرور' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 46, fontSize: 16 }}>
            تسجيل الدخول للنظام
          </Button>
        </Form>

        <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8, color: '#8c8c8c' }}>
            دخول سريع بحسابات تجريبية للأدوار المختلفة:
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Button size="small" onClick={() => handleQuickLogin('SUPER_ADMIN', 'مدير النظام العام')}>
              مدير النظام (Admin)
            </Button>
            <Button size="small" onClick={() => handleQuickLogin('DOCTOR', 'د. طارق المنشاوي')}>
              طبيب استشاري
            </Button>
            <Button size="small" onClick={() => handleQuickLogin('PHARMACIST', 'صيدلية المستشفى')}>
              صيدلي
            </Button>
            <Button size="small" onClick={() => handleQuickLogin('LAB_TECH', 'المختبر المركزي')}>
              فني معمل
            </Button>
            <Button size="small" onClick={() => handleQuickLogin('ARCHIVIST', 'مسؤول الأرشيف')}>
              أمين الأرشيف
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
