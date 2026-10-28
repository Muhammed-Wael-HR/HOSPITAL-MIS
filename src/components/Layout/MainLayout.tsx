import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, message, Modal, Form, Input, Tag } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  ScanOutlined,
  ShopOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  LogoutOutlined,
  TranslationOutlined,
  SunOutlined,
  MoonOutlined,
  HeartFilled,
  CloudServerOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { firebaseSync } from '../../services/firebaseSync';
import { GlobalSearch } from './GlobalSearch';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    sidebarCollapsed,
    toggleSidebar,
    hospitalSettings,
    adminProfile,
    setAdminProfile,
  } = useAppStore();
  const { user, logout } = useAuthStore();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');

  useEffect(() => {
    return firebaseSync.onStatusChange((status) => {
      setCloudStatus(status);
    });
  }, []);

  const handleSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields();
      setAdminProfile(values);
      message.success(language === 'ar' ? 'تم تحديث بيانات المسؤول بنجاح' : 'Admin profile updated successfully');
      setProfileModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: language === 'ar' ? 'لوحة التحكم الرئيسية' : 'Dashboard' },
    { key: '/patients', icon: <UserOutlined />, label: language === 'ar' ? 'سجل المرضى والملفات' : 'Patients Directory' },
    { key: '/appointments', icon: <CalendarOutlined />, label: language === 'ar' ? 'إدارة المواعيد والعيادات' : 'Appointments' },
    { key: '/admissions', icon: <MedicineBoxOutlined />, label: language === 'ar' ? 'التنويم وخريطة الأسرّة' : 'Inpatients & Beds' },
    { key: '/medical-records', icon: <FileTextOutlined />, label: language === 'ar' ? 'السجلات الطبية (EMR)' : 'Medical Records' },
    { key: '/laboratory', icon: <ExperimentOutlined />, label: language === 'ar' ? 'المختبر والتحاليل' : 'Laboratory (LIS)' },
    { key: '/radiology', icon: <ScanOutlined />, label: language === 'ar' ? 'قسم الأشعة والتصوير' : 'Radiology (RIS)' },
    { key: '/pharmacy', icon: <ShopOutlined />, label: language === 'ar' ? 'الصيدلية والمخزون الدوائي' : 'Pharmacy & Stock' },
    { key: '/billing', icon: <DollarOutlined />, label: language === 'ar' ? 'الفوترة والحسابات' : 'Billing & Invoices' },
    { key: '/insurance', icon: <SafetyCertificateOutlined />, label: language === 'ar' ? 'التأمين الطبي والمطالبات' : 'Insurance & Claims' },
    { key: '/archive', icon: <FolderOpenOutlined />, label: language === 'ar' ? 'الأرشيف وإدارة الوثائق' : 'Archive & DMS' },
    { key: '/hr', icon: <TeamOutlined />, label: language === 'ar' ? 'الأطقم الطبية والموظفين' : 'Staff & HR' },
    { key: '/reports', icon: <BarChartOutlined />, label: language === 'ar' ? 'التقارير والمؤشرات (MIS)' : 'MIS Reports' },
    { key: '/settings', icon: <SettingOutlined />, label: language === 'ar' ? 'إعدادات النظام والأقسام' : 'System Settings' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const userMenuItems = [
    {
      key: 'profile-info',
      label: (
        <div>
          <Text strong>{adminProfile.displayName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {adminProfile.position} ({user?.role || 'SUPER_ADMIN'})
          </Text>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'edit-profile',
      icon: <UserOutlined />,
      label: language === 'ar' ? 'تعديل بيانات الحساب والمدير' : 'Edit Admin Profile',
      onClick: () => {
        profileForm.setFieldsValue(adminProfile);
        setProfileModalVisible(true);
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: language === 'ar' ? 'إعدادات المنشأة والنظام' : 'Hospital Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
      onClick: () => {
        logout();
        message.info(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
        navigate('/login');
      },
    },
  ];

  // Current selected menu key
  const getSelectedKey = () => {
    const pathname = location.pathname;
    if (pathname === '/') return ['/'];
    const matched = menuItems.find((item) => item.key !== '/' && pathname.startsWith(item.key));
    return matched ? [matched.key] : ['/'];
  };

  return (
    <Layout style={{ minHeight: '100vh', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <Sider
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={toggleSidebar}
        trigger={null}
        width={260}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          boxShadow: '2px 0 8px rgba(0,21,41,0.25)',
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? 0 : '0 16px',
            background: '#002140',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              boxShadow: '0 2px 6px rgba(24,144,255,0.4)',
              marginRight: language === 'ar' ? 0 : 12,
              marginLeft: language === 'ar' ? 12 : 0,
            }}
          >
            <HeartFilled />
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Text strong style={{ color: '#fff', fontSize: 15, display: 'block' }}>
                {hospitalSettings.nameAr}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                نظام المعلومات الصحي المتكامل (HIS)
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: theme === 'dark' ? '#141414' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Space direction="horizontal" size="middle">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
            <GlobalSearch />
          </Space>

          <Space direction="horizontal" size="middle">
            {/* Cloud Realtime Status Badge */}
            {cloudStatus === 'connected' && (
              <Tag color="success" icon={<CloudServerOutlined />} style={{ cursor: 'pointer' }} onClick={() => navigate('/settings')}>
                {language === 'ar' ? 'سحابي متصل' : 'Cloud Live'}
              </Tag>
            )}
            {cloudStatus === 'syncing' && (
              <Tag color="processing" icon={<SyncOutlined spin />}>
                {language === 'ar' ? 'جاري المزامنة...' : 'Syncing...'}
              </Tag>
            )}
            {cloudStatus === 'offline' && (
              <Tag color="default" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings')}>
                {language === 'ar' ? 'محلي (Offline)' : 'Local Mode'}
              </Tag>
            )}

            {/* Language toggle */}
            <Button
              type="text"
              icon={<TranslationOutlined />}
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>

            {/* Theme toggle */}
            <Button
              type="text"
              icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            />

            {/* Notifications */}
            <Dropdown
              menu={{
                items: [
                  { key: '1', label: 'تنبيه: اقتراب نفاد دواء كليكسان 4000 (المتبقي 22 حقنة)' },
                  { key: '2', label: 'نتائج تحاليل معملية جديدة معتمدة للمريض أحمد الشناوي' },
                  { key: '3', label: 'طلب رنين مغناطيسي طارئ بالعناية المركزة لمريض جديد' },
                ],
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge count={3} offset={[-2, 6]}>
                <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} />
              </Badge>
            </Dropdown>

            {/* User Profile */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
                <Avatar
                  style={{
                    backgroundColor: '#1890ff',
                    verticalAlign: 'middle',
                    boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
                  }}
                  icon={<UserOutlined />}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <Text strong style={{ fontSize: 13 }}>
                    {adminProfile.displayName}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {adminProfile.position}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '20px 24px',
            minHeight: 280,
            overflow: 'initial',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Edit Admin Profile Modal */}
      <Modal
        title="تعديل بيانات المسؤول والمدير العام (Edit Admin Profile)"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        onOk={handleSaveProfile}
        okText="حفظ التعديلات"
        cancelText="إلغاء"
      >
        <Form form={profileForm} layout="vertical" initialValues={adminProfile}>
          <Form.Item
            name="displayName"
            label="الاسم الظاهر للمسؤول / المدير"
            rules={[{ required: true, message: 'يرجى إدخال اسم المسؤول' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="مثال: د. محمد حسني" />
          </Form.Item>

          <Form.Item
            name="position"
            label="المسمى الوظيفي / الدور"
            rules={[{ required: true, message: 'يرجى إدخال المسمى الوظيفي' }]}
          >
            <Input placeholder="مثال: مدير المستشفى، مدير تقنية المعلومات، المشرف العام" />
          </Form.Item>

          <Form.Item name="phone" label="رقم الهاتف">
            <Input placeholder="01012345678" />
          </Form.Item>

          <Form.Item name="email" label="البريد الإلكتروني">
            <Input placeholder="admin@hospital.eg" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
