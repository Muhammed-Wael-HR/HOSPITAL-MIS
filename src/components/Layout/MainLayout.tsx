import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, message, Modal, Form, Input, Tag, Drawer } from 'antd';
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
  FilePdfOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { firebaseSync } from '../../services/firebaseSync';
import { GlobalSearch } from './GlobalSearch';
import { DatabaseExportModal } from '../DatabaseExport/DatabaseExportModal';
import { MedevacLogo } from '../Logo/MedevacLogo';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    language,
    setLanguage,
    direction,
    theme,
    toggleTheme,
    sidebarCollapsed,
    toggleSidebar,
    hospitalSettings,
    adminProfile,
    setAdminProfile,
  } = useAppStore();
  const { user, logout, hasPermission } = useAuthStore();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'offline' | 'syncing' | 'error'>('offline');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileDrawerVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const ALL_MENU_DEFINITIONS = [
    { key: '/', moduleKey: 'dashboard', icon: <DashboardOutlined />, label: language === 'ar' ? 'لوحة التحكم الرئيسية' : 'Dashboard' },
    { key: '/patients', moduleKey: 'patients', icon: <UserOutlined />, label: language === 'ar' ? 'سجل المرضى والملفات' : 'Patients Directory' },
    { key: '/appointments', moduleKey: 'appointments', icon: <CalendarOutlined />, label: language === 'ar' ? 'إدارة المواعيد والعيادات' : 'Appointments' },
    { key: '/admissions', moduleKey: 'admissions', icon: <MedicineBoxOutlined />, label: language === 'ar' ? 'التنويم وخريطة الأسرّة' : 'Inpatients & Beds' },
    { key: '/medical-records', moduleKey: 'medical_records', icon: <FileTextOutlined />, label: language === 'ar' ? 'السجلات الطبية (EMR)' : 'Medical Records' },
    { key: '/laboratory', moduleKey: 'laboratory', icon: <ExperimentOutlined />, label: language === 'ar' ? 'المختبر والتحاليل' : 'Laboratory (LIS)' },
    { key: '/radiology', moduleKey: 'radiology', icon: <ScanOutlined />, label: language === 'ar' ? 'قسم الأشعة والتصوير' : 'Radiology (RIS)' },
    { key: '/pharmacy', moduleKey: 'pharmacy', icon: <ShopOutlined />, label: language === 'ar' ? 'الصيدلية والمخزون الدوائي' : 'Pharmacy & Stock' },
    { key: '/billing', moduleKey: 'billing', icon: <DollarOutlined />, label: language === 'ar' ? 'الفوترة والحسابات' : 'Billing & Invoices' },
    { key: '/insurance', moduleKey: 'insurance', icon: <SafetyCertificateOutlined />, label: language === 'ar' ? 'التأمين الطبي والمطالبات' : 'Insurance & Claims' },
    { key: '/archive', moduleKey: 'archive', icon: <FolderOpenOutlined />, label: language === 'ar' ? 'الأرشيف وإدارة الوثائق' : 'Archive & DMS' },
    { key: '/hr', moduleKey: 'hr', icon: <TeamOutlined />, label: language === 'ar' ? 'الأطقم الطبية والموظفين' : 'Staff & HR' },
    { key: '/reports', moduleKey: 'reports', icon: <BarChartOutlined />, label: language === 'ar' ? 'التقارير والمؤشرات (MIS)' : 'MIS Reports' },
    { key: '/settings', moduleKey: 'settings', icon: <SettingOutlined />, label: language === 'ar' ? 'إعدادات النظام والأقسام' : 'System Settings' },
  ];

  // RBAC Permission Filter: only display authorized modules
  const menuItems = ALL_MENU_DEFINITIONS.filter((item) => hasPermission(item.moduleKey));

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const userMenuItems = [
    {
      key: 'profile-info',
      label: (
        <div style={{ padding: '2px 0' }}>
          <Text strong>{adminProfile.displayName || user?.fullName || 'قائد الفريق'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            @{user?.username || 'admin'} ({user?.isSuperAdmin ? 'المسؤول الأساسي' : user?.role})
          </Text>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'database-pdf',
      icon: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
      label: 'تصدير واستخراج قاعدة البيانات (PDF)',
      onClick: () => setExportModalVisible(true),
    },
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
      label: language === 'ar' ? 'إعدادات المنشأة والمستخدمين' : 'Hospital Settings & Users',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
      onClick: () => {
        Modal.confirm({
          title: 'تأكيد تسجيل الخروج',
          content: 'هل تريد تسجيل الخروج من النظام والعودة لشاشة الدخول؟',
          okText: 'نعم، تسجيل الخروج',
          cancelText: 'إلغاء',
          onOk: () => {
            logout();
            message.info(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
            navigate('/login');
          },
        });
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
      {!isMobile && (
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
                marginRight: language === 'ar' ? 0 : 10,
                marginLeft: language === 'ar' ? 10 : 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <MedevacLogo size={38} />
            </div>
            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Text strong style={{ color: '#fff', fontSize: 14, display: 'block', letterSpacing: '0.3px' }}>
                  {hospitalSettings.nameAr}
                </Text>
                <Text style={{ color: '#00d2ff', fontSize: 10, fontWeight: 600 }}>
                  MEDEVAC OPERATIONS MIS
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
      )}

      <Layout>
        <Header
          style={{
            padding: isMobile ? '0 10px' : '0 24px',
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
          <Space direction="horizontal" size={isMobile ? 'small' : 'middle'} style={{ flex: 1, marginRight: 8 }}>
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(true);
                } else {
                  toggleSidebar();
                }
              }}
              style={{ fontSize: 18, width: 38, height: 38 }}
            />
            <GlobalSearch />
          </Space>

          <Space direction="horizontal" size={isMobile ? 6 : 'middle'}>
            {/* Cloud Realtime Status Badge */}
            {cloudStatus === 'connected' && (
              <Tag
                color="success"
                icon={<CloudServerOutlined />}
                style={{ cursor: 'pointer', margin: 0 }}
                onClick={() => navigate('/settings')}
              >
                {!isMobile && (language === 'ar' ? 'سحابي متصل' : 'Cloud Live')}
              </Tag>
            )}
            {cloudStatus === 'syncing' && (
              <Tag color="processing" icon={<SyncOutlined spin />} style={{ margin: 0 }}>
                {!isMobile && (language === 'ar' ? 'مزامنة...' : 'Syncing')}
              </Tag>
            )}
            {cloudStatus === 'offline' && (
              <Tag color="default" style={{ cursor: 'pointer', margin: 0 }} onClick={() => navigate('/settings')}>
                {!isMobile && (language === 'ar' ? 'محلي' : 'Local')}
              </Tag>
            )}

            {/* Database PDF Export Quick Button */}
            <Button
              type="primary"
              danger
              icon={<FilePdfOutlined />}
              size={isMobile ? 'small' : 'middle'}
              onClick={() => setExportModalVisible(true)}
              style={{ fontWeight: 600 }}
            >
              {!isMobile && 'تصدير قاعدة البيانات (PDF)'}
            </Button>

            {/* Language toggle */}
            {!isMobile && (
              <Button
                type="text"
                icon={<TranslationOutlined />}
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              >
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            )}

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
              <Space style={{ cursor: 'pointer', padding: isMobile ? '2px' : '4px 8px', borderRadius: 6 }}>
                <Avatar
                  style={{
                    backgroundColor: '#1890ff',
                    verticalAlign: 'middle',
                    boxShadow: '0 2px 4px rgba(24,144,255,0.3)',
                  }}
                  icon={<UserOutlined />}
                />
                {!isMobile && (
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <Text strong style={{ fontSize: 13 }}>
                      {adminProfile.displayName || user?.fullName || 'قائد الفريق'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {user?.isSuperAdmin ? 'المسؤول الأساسي' : user?.role || adminProfile.position}
                    </Text>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: isMobile ? '12px 8px' : '20px 24px',
            minHeight: 280,
            overflow: 'initial',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MedevacLogo size={32} />
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Text strong style={{ color: '#fff', fontSize: 14, display: 'block' }}>
                {hospitalSettings.nameAr}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                MEDEVAC OPERATIONS MIS
              </Text>
            </div>
          </div>
        }
        placement={direction === 'rtl' ? 'right' : 'left'}
        open={mobileDrawerVisible}
        onClose={() => setMobileDrawerVisible(false)}
        width={270}
        styles={{
          body: { padding: 0, background: '#001529' },
          header: { background: '#002140', borderBottom: '1px solid rgba(255,255,255,0.08)' },
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ background: 'transparent' }}
        />
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 12 }}>
          <Button
            block
            ghost
            icon={<TranslationOutlined />}
            onClick={() => {
              setLanguage(language === 'ar' ? 'en' : 'ar');
              setMobileDrawerVisible(false);
            }}
          >
            {language === 'ar' ? 'English Language' : 'اللغة العربية'}
          </Button>
        </div>
      </Drawer>

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

      {/* Database PDF Export Modal */}
      <DatabaseExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </Layout>
  );
};
