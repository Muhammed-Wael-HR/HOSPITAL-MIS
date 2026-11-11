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
  FileExcelOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { DatabaseExportModal } from '../../components/DatabaseExport/DatabaseExportModal';
import { InteractiveSystemSchema } from '../../components/Dashboard/InteractiveSystemSchema';
import { MedevacLogo } from '../../components/Logo/MedevacLogo';

const { Title, Text } = Typography;

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
  const archives = useHospitalStore((state) => state.archives);
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
      {/* Tactical Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091322 0%, #0d213f 50%, #0c2b54 100%)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 20,
          border: '1px solid #1e3a66',
          boxShadow: '0 8px 30px rgba(0, 242, 254, 0.08)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MedevacLogo size={56} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                MEDEVAC OPERATIONS & HOSPITAL MIS
              </Title>
              <Tag color="#00f2fe" style={{ color: '#000', fontWeight: 'bold' }}>
                LIVE READY v4.0
              </Tag>
              <Tag color="#10b981" style={{ color: '#fff' }}>
                <ThunderboltOutlined /> مزامنة سحابية نشطة
              </Tag>
            </div>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4, display: 'block' }}>
              منظومة إدارة معلومات الإخلاء الطبي والمستشفيات الذكية • قاعدة بيانات حية ({patients.length} مريض، {appointments.length} موعد، {users.length} مسؤول)
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
            تصدير قاعدة البيانات (PDF)
          </Button>

          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            size="large"
            style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600, borderRadius: 8 }}
            href="/MEDEVAC_TEAM_Database.xlsx"
            download="MEDEVAC_TEAM_Database.xlsx"
          >
            تنزيل الإكسيل (.xlsx)
          </Button>

          <Button
            icon={<PlusOutlined />}
            size="large"
            style={{ fontWeight: 600, borderRadius: 8 }}
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
            className="dashboard-stat-card"
            style={{
              background: '#fff',
              borderRadius: 12,
              borderTop: '3px solid #0284c7',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>إجمالي المرضى المسجلين (MRN)</Text>}
              value={patients.length}
              prefix={<UserOutlined style={{ color: '#0284c7', marginLeft: 8 }} />}
              suffix={
                <Tag color="cyan" style={{ fontSize: 12, marginRight: 6 }}>
                  15 ملف مكتمل
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
            className="dashboard-stat-card"
            style={{
              background: '#fff',
              borderRadius: 12,
              borderTop: '3px solid #f59e0b',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
            }}
          >
            <Statistic
              title={<Text strong style={{ color: '#475569' }}>نسبة إشغال الأسرّة والطوارئ</Text>}
              value={occupancyRate}
              suffix="%"
              prefix={<MedicineBoxOutlined style={{ color: '#f59e0b', marginLeft: 8 }} />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={occupancyRate} strokeColor="#f59e0b" size="small" showInfo={false} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <Text type="secondary">{occupiedBeds} سرير مشغول</Text>
                <Text type="secondary">{totalBeds - occupiedBeds} شاغر وجاهز للإخلاء</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            className="dashboard-stat-card"
            style={{
              background: '#fff',
              borderRadius: 12,
              borderTop: '3px solid #10b981',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
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
            className="dashboard-stat-card"
            style={{
              background: '#fff',
              borderRadius: 12,
              borderTop: '3px solid #8b5cf6',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
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

      {/* Interactive Schema Component (الطلب الأساسي للمستخدم) */}
      <InteractiveSystemSchema onOpenPdfExport={() => setExportModalVisible(true)} />

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            title="حركة تدفق المرضى وحالات الإخلاء والطوارئ الأسبوعية"
            extra={<Text type="secondary">محدث لحظياً</Text>}
            style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
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
            style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
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
            style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
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
            title="تنبيهات المنظومة الطبية الفورية"
            extra={<Tag color="red">عاجل</Tag>}
            style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {lowStockCount > 0 && (
                <Alert
                  message={`تنبيه صيدلية: يوجد ${lowStockCount} دواء دون حد الطلب الأدنى`}
                  description="صنف أوجمانتين وبيتاميثازون قارب على النفاد من مخزن الطوارئ."
                  type="warning"
                  showIcon
                  icon={<AlertOutlined />}
                  action={
                    <Button size="small" type="primary" onClick={() => navigate('/pharmacy')}>
                      المخزن
                    </Button>
                  }
                />
              )}

              <Alert
                message="مطالبة تأمين بحاجة للمراجعة"
                description="مطالبة شركة بوبا رقم CLM-20261027-001 قيد الفحص المالي بمبلغ 200 ج.م."
                type="info"
                showIcon
                action={
                  <Button size="small" onClick={() => navigate('/insurance')}>
                    مراجعة
                  </Button>
                }
              />

              <Alert
                message="اعتماد نتائج المختبر المركزي (LIS)"
                description="تم اعتماد نتائج تحاليل صورة الدم الكاملة (CBC) للمريض أحمد محمود إبراهيم."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                action={
                  <Button size="small" onClick={() => navigate('/laboratory')}>
                    المعمل
                  </Button>
                }
              />
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
