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
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { DatabaseExportModal } from '../../components/DatabaseExport/DatabaseExportModal';

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

  // Calculations
  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const occupancyRate = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  const todayRevenue = invoices.reduce((acc, inv) => acc + Number(inv.paid || 0), 0);
  const lowStockCount = medications.filter((m) => m.currentStock <= m.minimumStock).length;

  const recentAdmissions = admissions.slice(0, 5);

  const admissionColumns = [
    {
      title: 'رقم الملف',
      dataIndex: ['patient', 'mrn'],
      key: 'mrn',
      render: (mrn: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{mrn}</Tag>,
    },
    {
      title: 'اسم المريض',
      dataIndex: ['patient', 'fullNameAr'],
      key: 'fullNameAr',
      render: (name: string, record: any) => (
        <a onClick={() => navigate(`/patients/${record.patientId}`)} style={{ fontWeight: 600 }}>
          {name}
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
      {/* Page Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            لوحة الإدارة والمعلومات الطبية (Hospital MIS Dashboard)
          </Title>
          <Text type="secondary">مؤشرات الأداء اللحظية وسير العمل في أقسام المستشفى</Text>
        </div>

        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<FilePdfOutlined />}
            onClick={() => setExportModalVisible(true)}
          >
            تصدير قاعدة البيانات (PDF)
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/patients')}>
            تسجيل مريض جديد
          </Button>
          <Button icon={<CalendarOutlined />} onClick={() => navigate('/appointments')}>
            حجز موعد
          </Button>
          <Button icon={<MedicineBoxOutlined />} onClick={() => navigate('/admissions')}>
            خريطة الأسرّة
          </Button>
          <Button icon={<FolderOpenOutlined />} onClick={() => navigate('/archive')}>
            الأرشيف الطبي ({archives.length})
          </Button>
        </Space>
      </div>

      {/* Top 4 Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="dashboard-stat-card" style={{ background: '#fff' }}>
            <Statistic
              title={<Text strong style={{ color: '#595959' }}>إجمالي المرضى المسجلين</Text>}
              value={patients.length}
              prefix={<UserOutlined style={{ color: '#1890ff', marginLeft: 8 }} />}
              suffix={
                <Text type="success" style={{ fontSize: 13, marginRight: 8 }}>
                  <ArrowUpOutlined /> +12% هذا الشهر
                </Text>
              }
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">حالات الطوارئ اليوم: 14</Text>
              <Text type="secondary">العيادات: 38</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="dashboard-stat-card" style={{ background: '#fff' }}>
            <Statistic
              title={<Text strong style={{ color: '#595959' }}>نسبة إشغال الأسرّة الحالية</Text>}
              value={occupancyRate}
              suffix="%"
              prefix={<MedicineBoxOutlined style={{ color: '#fa8c16', marginLeft: 8 }} />}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={occupancyRate} strokeColor="#fa8c16" size="small" showInfo={false} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <Text type="secondary">{occupiedBeds} سرير مشغول</Text>
                <Text type="secondary">{totalBeds - occupiedBeds} شاغر ومتاح</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="dashboard-stat-card" style={{ background: '#fff' }}>
            <Statistic
              title={<Text strong style={{ color: '#595959' }}>مواعيد العيادات اليوم</Text>}
              value={appointments.length}
              prefix={<CalendarOutlined style={{ color: '#52c41a', marginLeft: 8 }} />}
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              <Tag color="processing">3 كشف جاري</Tag>
              <Tag color="warning">1 انتظار</Tag>
              <Tag color="success">1 مكتمل</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="dashboard-stat-card" style={{ background: '#fff' }}>
            <Statistic
              title={<Text strong style={{ color: '#595959' }}>الإيرادات والتحصيلات المحققة</Text>}
              value={todayRevenue}
              suffix="ج.م"
              prefix={<DollarOutlined style={{ color: '#722ed1', marginLeft: 8 }} />}
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">الفواتير المسددة: 2</Text>
              <Text type="secondary">مطالبات تأمين: 1</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            title="حركة تدفق المرضى وحالات الطوارئ الأسبوعية"
            extra={<Text type="secondary">محدث لحظياً</Text>}
          >
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorChartData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" name="مرضى العيادات" stroke="#1890ff" fillOpacity={1} fill="url(#colorPatients)" />
                  <Area type="monotone" dataKey="emergency" name="حالات الطوارئ" stroke="#ff4d4f" fillOpacity={1} fill="url(#colorEmergency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card bordered={false} title="توزيع إيرادات الأقسام الطبية (ج.م)">
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentRevenueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} ج.م`} />
                  <Bar dataKey="amount" name="الإيراد" fill="#13c2c2" radius={[0, 4, 4, 0]} />
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
            title="أحدث حالات التنويم والأقسام الداخلية"
            extra={<Button type="link" onClick={() => navigate('/admissions')}>عرض خريطة الأسرّة بالكامل</Button>}
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
          <Card bordered={false} title="تنبيهات المنظومة الطبية الفورية" extra={<Tag color="red">عاجل</Tag>}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {lowStockCount > 0 && (
                <Alert
                  message={`تنبيه صيدلية: يوجد ${lowStockCount} دواء دون حد الطلب الأدنى`}
                  description="دواء كليكسان حقن وبيثيدين مخدر قاربا على النفاد من مخزن الطوارئ."
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
                description="مطالبة شركة بوبا رقم CLM-20261027-002 قيد الفحص المالي بمبلغ 8,900 ج.م."
                type="info"
                showIcon
                action={
                  <Button size="small" onClick={() => navigate('/insurance')}>
                    مراجعة
                  </Button>
                }
              />

              <Alert
                message="اعتماد نتائج المختبر المركزي"
                description="تم اعتماد نتائج تحاليل السكر التراكمي ووظائف الكلى للمريض أحمد الشناوي."
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
