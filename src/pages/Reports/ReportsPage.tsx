import React, { useState } from 'react';
import { Card, Row, Col, Typography, Select, DatePicker, Button, Table, Tag, Statistic, Space, message } from 'antd';
import { BarChartOutlined, DownloadOutlined, PrinterOutlined, RiseOutlined, FilePdfOutlined } from '@ant-design/icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useHospitalStore } from '../../mockData/mockStore';
import { DatabaseExportModal } from '../../components/DatabaseExport/DatabaseExportModal';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const monthlyRevenueTrend = [
  { month: 'مايو', revenue: 420000, expenses: 260000 },
  { month: 'يونيو', revenue: 490000, expenses: 280000 },
  { month: 'يوليو', revenue: 530000, expenses: 310000 },
  { month: 'أغسطس', revenue: 610000, expenses: 340000 },
  { month: 'سبتمبر', revenue: 580000, expenses: 320000 },
  { month: 'أكتوبر', revenue: 670000, expenses: 360000 },
];

const paymentMethodData = [
  { name: 'شركات تأمين خاص', value: 45, color: '#1890ff' },
  { name: 'نقدي (Cash)', value: 30, color: '#52c41a' },
  { name: 'بطاقات بنكية (Visa/POS)', value: 25, color: '#fa8c16' },
];

const topDiagnoses = [
  { code: 'E11.9', desc: 'داء السكري من النوع الثاني', count: 48, percentage: '28%' },
  { code: 'I10', desc: 'ارتفاع ضغط الدم الأساسي الشرياني', count: 42, percentage: '24%' },
  { code: 'S72.30', desc: 'كسور عظام الفخذ والأطراف', count: 26, percentage: '15%' },
  { code: 'I20.0', desc: 'الذبحة الصدرية غير المستقرة', count: 18, percentage: '10%' },
  { code: 'J45.9', desc: 'الربو الشعبي ونوبات ضيق التنفس', count: 14, percentage: '8%' },
];

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('REVENUE');
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const doctors = useHospitalStore((state) => state.doctors);

  const doctorPerformance = doctors.map((doc, idx) => ({
    key: doc.id,
    name: doc.employee?.fullNameAr,
    specialty: doc.specialty,
    visits: 35 + idx * 8,
    surgeries: idx === 0 ? 12 : idx === 2 ? 8 : 0,
    revenue: (35 + idx * 8) * (doc.consultationFee || 400) + (idx === 0 ? 120000 : 0),
  }));

  const handleExport = (type: string) => {
    if (type === 'PDF') {
      setExportModalVisible(true);
    } else {
      message.success(`تم استخراج وتصدير تقرير الـ MIS بصيغة ${type} بنجاح`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            التقارير الإدارية ومؤشرات الأداء (Hospital MIS Reports)
          </Title>
          <Text type="secondary">ذكاء الأعمال والتحليلات الإحصائية لدعم قرارات إدارة المستشفى والتشغيل</Text>
        </div>

        <Space wrap>
          <Button type="primary" danger icon={<FilePdfOutlined />} onClick={() => setExportModalVisible(true)}>
            تصدير واستخراج قاعدة البيانات كاملة (PDF)
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('Excel')}>
            تصدير جداول البيانات (Excel)
          </Button>
        </Space>
      </div>

      {/* Filter Header */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
              نوع التقرير التحليلي:
            </Text>
            <Select value={reportType} onChange={setReportType} style={{ width: '100%' }}>
              <Option value="REVENUE">تقرير الإيرادات والمصروفات المالية</Option>
              <Option value="DOCTORS">مؤشرات أداء الأطباء والعيادات</Option>
              <Option value="EPIDEMIOLOGY">إحصائيات الأمراض والتشخيص الدولي (ICD-10)</Option>
            </Select>
          </Col>

          <Col xs={24} sm={10}>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
              النطاق الزمني للتحليل:
            </Text>
            <RangePicker style={{ width: '100%' }} />
          </Col>

          <Col xs={24} sm={6}>
            <Statistic title="هامش الربح التشغيلي" value={46.2} suffix="%" valueStyle={{ color: '#3f8600' }} prefix={<RiseOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* Report 1: Revenue & Financial */}
      {reportType === 'REVENUE' && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="تطور الإيرادات والمصروفات الشهرية (ج.م)" bordered={false}>
              <div style={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString()} ج.م`} />
                    <Line type="monotone" dataKey="revenue" name="الإيرادات" stroke="#1890ff" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" name="المصروفات التشغيلية" stroke="#ff4d4f" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="توزيع طرق تحصيل الإيرادات" bordered={false}>
              <div style={{ height: 240, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: 12 }}>
                {paymentMethodData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span>
                      <span style={{ display: 'inline-block', width: 10, height: 10, background: item.color, borderRadius: '50%', marginRight: 6 }} />
                      {item.name}
                    </span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Report 2: Doctor Performance */}
      {reportType === 'DOCTORS' && (
        <Card title="مؤشرات أداء الاستشاريين والعيادات التخصصية" bordered={false}>
          <Table
            dataSource={doctorPerformance}
            pagination={false}
            columns={[
              { title: 'اسم الطبيب', dataIndex: 'name', key: 'name', render: (n: string) => <Text strong>{n}</Text> },
              { title: 'التخصص', dataIndex: 'specialty', key: 'spec' },
              { title: 'عدد حالات الكشف بالعيادة', dataIndex: 'visits', key: 'v' },
              { title: 'العمليات الجراحية المنجزة', dataIndex: 'surgeries', key: 's' },
              {
                title: 'إجمالي الإيراد المحقق',
                dataIndex: 'revenue',
                key: 'rev',
                render: (rev: number) => <Tag color="green" style={{ fontSize: 13, fontWeight: 600 }}>{rev.toLocaleString()} ج.م</Tag>,
              },
            ]}
          />
        </Card>
      )}

      {/* Report 3: Epidemiology & Diagnoses */}
      {reportType === 'EPIDEMIOLOGY' && (
        <Card title="إحصائيات الأمراض الأكثر شيوعاً وفق التصنيف الدولي (ICD-10)" bordered={false}>
          <Table
            dataSource={topDiagnoses}
            pagination={false}
            rowKey="code"
            columns={[
              { title: 'كود ICD-10 الدولي', dataIndex: 'code', key: 'code', render: (c: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{c}</Tag> },
              { title: 'التشخيص الطبي المعتمد', dataIndex: 'desc', key: 'desc', render: (d: string) => <Text strong>{d}</Text> },
              { title: 'عدد الحالات المسجلة', dataIndex: 'count', key: 'cnt' },
              { title: 'النسبة المئوية من إجمالي الحالات', dataIndex: 'percentage', key: 'pct', render: (p: string) => <Tag color="volcano">{p}</Tag> },
            ]}
          />
        </Card>
      )}

      {/* Database PDF Export Modal */}
      <DatabaseExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </div>
  );
};
