import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Button, Typography, Space, Alert } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FolderOpenOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  BranchesOutlined,
  ExperimentOutlined,
  ShopOutlined,
  FileTextOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { DatabaseExportModal } from '../../components/DatabaseExport/DatabaseExportModal';
import { MedevacLogo } from '../../components/Logo/MedevacLogo';

const { Title, Text, Paragraph } = Typography;

const visitorChartData = [
  { day: 'السبت', patients: 45, emergency: 12 },
  { day: 'الأحد', patients: 62, emergency: 18 },
  { day: 'الإثنين', patients: 58, emergency: 15 },
  { day: 'الثلاثاء', patients: 74, emergency: 22 },
  { day: 'الأربعاء', patients: 68, emergency: 16 },
  { day: 'الخميس', patients: 85, emergency: 26 },
  { day: 'اليوم', patients: 52, emergency: 14 },
];

const departmentRevenueData = [
  { name: 'جراحة العظام', amount: 85000 },
  { name: 'الباطنة والسكري', amount: 42000 },
  { name: 'القلب والقسطرة', amount: 110000 },
  { name: 'العناية المركزة', amount: 95000 },
  { name: 'الأشعة التشخيصية', amount: 34000 },
  { name: 'المختبر المركزي', amount: 28000 },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const patients = useHospitalStore((state) => state.patients);
  const appointments = useHospitalStore((state) => state.appointments);
  const beds = useHospitalStore((state) => state.beds);
  const admissions = useHospitalStore((state) => state.admissions);
  const invoices = useHospitalStore((state) => state.invoices);
  const medications = useHospitalStore((state) => state.medications);
  const users = useHospitalStore((state) => state.users);

  // Calculations
  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const occupancyRate = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  const totalPaidRevenue = invoices.reduce((acc, inv) => acc + Number(inv.paid || 0), 0);
  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.total || 0), 0);
  const lowStockCount = medications.filter((m) => m.currentStock <= m.minimumStock).length;

  const recentAdmissions = admissions.slice(0, 5);

  const admissionColumns = [
    {
      title: 'رقم الملف (MRN)',
      dataIndex: ['patient', 'mrn'],
      key: 'mrn',
      render: (mrn: string, record: any) => (
        <Tag color="cyan" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {mrn || `PAT-00${record.patientId || 1}`}
        </Tag>
      ),
    },
    {
      title: 'اسم المريض',
      dataIndex: ['patient', 'fullNameAr'],
      key: 'fullNameAr',
      render: (name: string, record: any) => (
        <a onClick={() => navigate(`/patients/${record.patientId}`)} style={{ fontWeight: 600 }}>
          {name || (record.patient ? record.patient.fullNameAr : 'مريض مسجل')}
        </a>
      ),
    },
    {
      title: 'السرير المحدد',
      dataIndex: ['bed', 'bedNumber'],
      key: 'bedNumber',
      render: (bedNum: string) => <Tag color="purple">{bedNum || 'قيد التسكين'}</Tag>,
    },
    {
      title: 'الطبيب المعالج',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
      render: (docName: string) => docName || 'د. محمد الألفي',
    },
    {
      title: 'حالة التنويم',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Refined Medical Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #075985 100%)',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.18)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 8, display: 'flex' }}>
            <MedevacLogo size={52} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                MEDEVAC TEAM — Hospital MIS Platform
              </Title>
              <Tag color="#38bdf8" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                LIVE READY v4.0
              </Tag>
              <Tag color="#10b981" style={{ color: '#fff' }}>
                <ThunderboltOutlined /> مزامنة سحابية نشطة
              </Tag>
            </div>
            <Text style={{ color: '#e0f2fe', fontSize: 13, marginTop: 6, display: 'block' }}>
              نظام إدارة المعلومات الصحية والمستشفيات الذكية • قاعدة بيانات متكاملة ({patients.length} مريض، {appointments.length} موعد مجدول، {users.length} مستخدم نشط)
            </Text>
          </div>
        </div>

        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<FilePdfOutlined />}
            size="large"
            style={{ fontWeight: 600, borderRadius: 8 }}
            onClick={() => setExportModalVisible(true)}
          >
            تصدير واستخراج قاعدة البيانات (PDF)
          </Button>

          <Button
            type="primary"
            icon={<BranchesOutlined />}
            size="large"
            style={{ background: '#fff', color: '#0369a1', fontWeight: 600, borderRadius: 8, border: 'none' }}
            onClick={() => navigate('/schema')}
          >
            سكيما وهيكلية النظام
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600, borderRadius: 8 }}
            onClick={() => navigate('/patients')}
          >
            تسجيل مريض جديد
          </Button>
        </Space>
      </div>

      {/* Top 4 Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: '#fff',
              borderRadius: 14,
              borderTop: '4px solid #0284c7',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>إجمالي المرضى المسجلين (MRN)</Text>}
              value={patients.length}
              prefix={<UserOutlined style={{ color: '#0284c7', marginLeft: 8 }} />}
              suffix={
                <Tag color="cyan" style={{ fontSize: 12, marginRight: 6 }}>
                  15 ملف معتمد
                </Tag>
              }
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">فصائل دم نادرة: 4</Text>
              <Text type="secondary">حساسية موثقة: 10</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: '#fff',
              borderRadius: 14,
              borderTop: '4px solid #f59e0b',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>نسبة إشغال الأسرّة والطوارئ</Text>}
              value={occupancyRate}
              suffix="%"
              prefix={<MedicineBoxOutlined style={{ color: '#f59e0b', marginLeft: 8 }} />}
            />
            <Progress
              percent={occupancyRate}
              strokeColor="#f59e0b"
              showInfo={false}
              size="small"
              style={{ marginTop: 8 }}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">المشغول: {occupiedBeds} سرير</Text>
              <Text type="secondary">المتاح: {totalBeds - occupiedBeds} سرير</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: '#fff',
              borderRadius: 14,
              borderTop: '4px solid #10b981',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>مواعيد العيادات التخصصية</Text>}
              value={appointments.length}
              prefix={<CalendarOutlined style={{ color: '#10b981', marginLeft: 8 }} />}
              suffix={
                <Tag color="green" style={{ fontSize: 12, marginRight: 6 }}>
                  22 موعد مجدول
                </Tag>
              }
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Tag color="processing">10 مكتمل</Tag>
              <Tag color="warning">12 قادم</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: '#fff',
              borderRadius: 14,
              borderTop: '4px solid #8b5cf6',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>الإيرادات والتحصيلات المسددة</Text>}
              value={totalPaidRevenue}
              suffix="ج.م"
              prefix={<DollarOutlined style={{ color: '#8b5cf6', marginLeft: 8 }} />}
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">الفواتير المسددة: 8</Text>
              <Text type="secondary">إجمالي الفواتير: {totalInvoiced} ج.م</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Clinical Shortcuts Strip */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          marginTop: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Space align="center">
            <ApartmentOutlined style={{ color: '#0284c7', fontSize: 18 }} />
            <Text strong style={{ color: '#0f172a' }}>الوصول السريع للأقسام الطبية والتشغيلية:</Text>
          </Space>
          <Space wrap>
            <Button icon={<UserOutlined />} onClick={() => navigate('/patients')}>دليل المرضى</Button>
            <Button icon={<CalendarOutlined />} onClick={() => navigate('/appointments')}>حجز العيادات</Button>
            <Button icon={<MedicineBoxOutlined />} onClick={() => navigate('/admissions')}>خريطة الأسرّة</Button>
            <Button icon={<FileTextOutlined />} onClick={() => navigate('/medical-records')}>الملفات الطبية</Button>
            <Button icon={<ExperimentOutlined />} onClick={() => navigate('/laboratory')}>المختبر (LIS)</Button>
            <Button icon={<ShopOutlined />} onClick={() => navigate('/pharmacy')}>الصيدلية والمخزون</Button>
            <Button icon={<DollarOutlined />} onClick={() => navigate('/billing')}>الفوترة والمالية</Button>
            <Button icon={<BranchesOutlined />} type="dashed" onClick={() => navigate('/schema')} style={{ borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 }}>
              سكيما النظام بالكامل
            </Button>
          </Space>
        </div>
      </Card>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            title="حركة تدفق المرضى وحالات الإخلاء والطوارئ الأسبوعية"
            extra={<Text type="secondary">محدث لحظياً</Text>}
            style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorChartData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" name="مرضى العيادات" stroke="#0284c7" fillOpacity={1} fill="url(#colorPatients)" />
                  <Area type="monotone" dataKey="emergency" name="حالات الطوارئ والإخلاء" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmergency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            title="توزيع إيرادات الأقسام الطبية (ج.م)"
            style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentRevenueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} ج.م`} />
                  <Bar dataKey="amount" name="الإيراد" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Inpatients & Hospital Alerts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            title="أحدث حالات التنويم بالأقسام وجاهزية الأسرة"
            extra={<Button type="link" onClick={() => navigate('/admissions')}>عرض خريطة الأسرّة بالكامل</Button>}
            style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <Table
              dataSource={recentAdmissions}
              columns={admissionColumns}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title="حالة الجاهزية والتنبيهات السريعة"
            style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {lowStockCount > 0 ? (
                <Alert
                  type="warning"
                  showIcon
                  icon={<AlertOutlined />}
                  message={<Text strong>تنبيه نقص المخزون الدوائي</Text>}
                  description={`يوجد ${lowStockCount} أصناف دوائية وصلت إلى حد إعادة الطلب الأدنى.`}
                  action={
                    <Button size="small" type="primary" ghost onClick={() => navigate('/pharmacy')}>
                      فحص الصيدلية
                    </Button>
                  }
                />
              ) : (
                <Alert
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                  message="المخزون الدوائي آمن ومكتمل"
                />
              )}

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '12px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>طاقة استيعاب العناية المركزة (ICU)</Text>
                  <Tag color="error">حرجة (75%)</Tag>
                </div>
                <Progress percent={75} status="exception" size="small" />
                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                  الأسرّة الشاغرة في قسم العناية المركزة: سرير واحد فقط.
                </Text>
              </div>

              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 8,
                  padding: '12px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong style={{ color: '#166534' }}>حالة الربط السحابي والأمان</Text>
                  <Tag color="success">متصل بنجاح</Tag>
                </div>
                <Text style={{ fontSize: 12, color: '#15803d' }}>
                  قاعدة البيانات متصلة بسحابة Firebase بتشفير كامل، وكافة الأقسام الـ 14 تعمل بتوافق تام.
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Database PDF Export Modal */}
      <DatabaseExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </div>
  );
};
