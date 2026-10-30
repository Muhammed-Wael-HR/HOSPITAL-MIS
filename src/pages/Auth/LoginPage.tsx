import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Tag, message, Alert, Tooltip, Collapse } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  HeartFilled,
  SafetyCertificateOutlined,
  KeyOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { useHospitalStore } from '../../mockData/mockStore';
import { MedevacLogo } from '../../components/Logo/MedevacLogo';

const { Title, Text, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const login = useAuthStore((state) => state.login);
  const hospitalSettings = useAppStore((state) => state.hospitalSettings);
  const users = useHospitalStore((state) => state.users);
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    setTimeout(() => {
      const inputUsername = (values.username || '').trim().toLowerCase();
      const inputPassword = (values.password || '').trim();

      // Find user from the reactive store
      const matchedUser = users.find(
        (u) => u.username.toLowerCase() === inputUsername
      );

      if (!matchedUser) {
        message.error('اسم المستخدم غير مسجل بالنظام! يرجى التأكد أو مراجعة المدير العام.');
        setLoading(false);
        return;
      }

      if (!matchedUser.isActive) {
        message.error('عذراً، هذا الحساب معطل حالياً بقرار من المدير العام للنظام.');
        setLoading(false);
        return;
      }

      // Check password
      const userPass = matchedUser.password || 'password123';
      if (userPass !== inputPassword) {
        message.error('كلمة المرور غير صحيحة! يرجى إعادة المحاولة.');
        setLoading(false);
        return;
      }

      // Login success
      login(matchedUser, `token-${matchedUser.id}-${Date.now()}`);
      message.success(`تم تسجيل الدخول بنجاح! مرحباً بك ${matchedUser.fullName}`);
      setLoading(false);
      navigate('/');
    }, 400);
  };

  const handleSelectQuickAccount = (accountUsername: string, accountPass: string) => {
    form.setFieldsValue({
      username: accountUsername,
      password: accountPass,
    });
    message.info(`تم تعبئة بيانات الحساب: ${accountUsername}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #096dd9 0%, #002140 100%)',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '12px 10px',
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-block', marginBottom: 10 }}>
            <MedevacLogo size={62} />
          </div>
          <Title level={3} style={{ margin: '0 0 4px 0' }}>
            {hospitalSettings.nameAr}
          </Title>
          <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
            MEDEVAC OPERATIONS & HOSPITAL MIS - بوابة تسجيل الدخول
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: 'admin', password: 'password123' }}
        >
          <Form.Item
            name="username"
            label={<Text strong>اسم المستخدم (Username)</Text>}
            rules={[{ required: true, message: 'يرجى إدخال اسم المستخدم' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="مثال: admin, reception, doctor..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>كلمة المرور (Password)</Text>}
            rules={[{ required: true, message: 'يرجى إدخال كلمة المرور' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="أدخل كلمة المرور الخاصة بحسابك"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            icon={<SafetyCertificateOutlined />}
            style={{ height: 46, fontSize: 16, marginTop: 4 }}
          >
            تسجيل الدخول للنظام
          </Button>
        </Form>

        {/* Pre-configured Demo & Authorized Accounts Guide */}
        <div style={{ marginTop: 20, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, color: '#595959' }}>
              الحسابات المصرح لها بالدخول (اضغط للتعبئة الفورية):
            </Text>
            <Tag color="blue">{users.length} مسؤولين</Tag>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto', paddingRight: 2 }}>
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => handleSelectQuickAccount(u.username, u.password || '123456')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 6,
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                }}
                className="card-hover"
              >
                <Space size="small">
                  <Tag color={u.isSuperAdmin ? 'red' : u.role === 'DOCTOR' ? 'cyan' : u.role === 'ACCOUNTANT' ? 'green' : 'blue'}>
                    {u.username}
                  </Tag>
                  <Text style={{ fontSize: 12 }}>{u.fullName}</Text>
                </Space>
                <Space size="small">
                  <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                    {u.password || 'password123'}
                  </Text>
                  <KeyOutlined style={{ color: '#8c8c8c', fontSize: 11 }} />
                </Space>
              </div>
            ))}
          </div>

          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 10, textAlign: 'center' }}>
            💡 المسؤول الأساسي يمكنه إضافة أو حذف أي مسؤول وتحديد صلاحياته بدقة من داخل الإعدادات.
          </Text>
        </div>
      </Card>
    </div>
  );
};
