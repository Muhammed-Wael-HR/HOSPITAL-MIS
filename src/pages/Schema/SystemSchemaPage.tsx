import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag, Space, Tabs, Button, Badge, Divider, Tooltip } from 'antd';
import {
  BranchesOutlined,
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
  LockOutlined,
  CloudServerOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MedevacLogo } from '../../components/Logo/MedevacLogo';
import { useAppStore } from '../../store/appStore';

const { Title, Text, Paragraph } = Typography;

export const SystemSchemaPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [selectedLayer, setSelectedLayer] = useState<string>('all');

  const architectureTiers = [
    {
      tier: 'المستوى الأول: واجهات المستخدم وقنوات الدخول (Access & Presentation Tier)',
      tierEn: 'Tier 1: Access & Presentation Gateway',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      nodes: [
        { name: 'بوابة الاستقبال والقبول', sub: 'Patient Admission Portal', icon: <UserOutlined />, path: '/patients' },
        { name: 'محطة الطبيب السريرية', sub: 'Physician Workstation (EMR)', icon: <FileTextOutlined />, path: '/medical-records' },
        { name: 'بوابة العيادات والمواعيد', sub: 'Outpatient Scheduling', icon: <CalendarOutlined />, path: '/appointments' },
        { name: 'محطة التمريض والتنويم', sub: 'Inpatient & Ward Terminal', icon: <MedicineBoxOutlined />, path: '/admissions' },
        { name: 'منافذ الفوترة والصندوق', sub: 'Cashier & Billing POS', icon: <DollarOutlined />, path: '/billing' },
      ],
    },
    {
      tier: 'المستوى الثاني: محركات المعالجة والمنطق الطبي والإداري (Application & Clinical Logic Tier)',
      tierEn: 'Tier 2: Core Processing & Workflow Engines',
      color: '#0d9488',
      bg: '#f0fdfa',
      border: '#99f6e4',
      nodes: [
        { name: 'محرك تسجيل المرضى (MRN)', sub: 'Demographics & National ID', icon: <UserOutlined />, path: '/patients' },
        { name: 'محرك السجلات الطبية (SOAP)', sub: 'Clinical Notes & ICD-10', icon: <FileTextOutlined />, path: '/medical-records' },
        { name: 'نظام إدارة المختبر (LIS)', sub: 'Lab Orders & Auto Verification', icon: <ExperimentOutlined />, path: '/laboratory' },
        { name: 'نظام أرشفة الأشعة (RIS)', sub: 'Imaging & Diagnostic Reports', icon: <ScanOutlined />, path: '/radiology' },
        { name: 'محرك الصيدلية والمخزون', sub: 'E-Prescription & Stock Alerts', icon: <ShopOutlined />, path: '/pharmacy' },
        { name: 'محرك الأسرّة والتسكين (ADT)', sub: 'Admission, Transfer & Discharge', icon: <MedicineBoxOutlined />, path: '/admissions' },
      ],
    },
    {
      tier: 'المستوى الثالث: العمليات المالية والتأمينية (Financial & Revenue Cycle Tier)',
      tierEn: 'Tier 3: Revenue Cycle & Claims Processing',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      nodes: [
        { name: 'تجميع رسوم الخدمات آلياً', sub: 'Unified Service Charge Aggregator', icon: <DollarOutlined />, path: '/billing' },
        { name: 'إدارة مطالبات التأمين', sub: 'Insurance Claims & Pre-Auth', icon: <SafetyCertificateOutlined />, path: '/insurance' },
        { name: 'إصدار الفواتير وسندات القبض', sub: 'Patient Invoicing & Multi-Pay', icon: <DollarOutlined />, path: '/billing' },
        { name: 'تقارير الإيرادات والمؤشرات', sub: 'Financial BI & KPI Analytics', icon: <BarChartOutlined />, path: '/reports' },
      ],
    },
    {
      tier: 'المستوى الرابع: الأمان وقواعد البيانات المركزية (Data & Security Infrastructure Tier)',
      tierEn: 'Tier 4: Enterprise Database & Security Layer',
      color: '#4f46e5',
      bg: '#eef2ff',
      border: '#c7d2fe',
      nodes: [
        { name: 'قاعدة البيانات المركزية الموحدة', sub: 'Relational & Structured Store', icon: <DatabaseOutlined />, path: '/settings' },
        { name: 'محرك المزامنة السحابية اللحظية', sub: 'Firebase Cloud Real-Time Sync', icon: <CloudServerOutlined />, path: '/settings' },
        { name: 'نظام التحكم بالصلاحيات (RBAC)', sub: 'Granular Role-Based Security', icon: <LockOutlined />, path: '/settings' },
        { name: 'الأرشيف الإلكتروني للوثائق (DMS)', sub: 'Encrypted Digital Archive', icon: <FolderOpenOutlined />, path: '/archive' },
      ],
    },
  ];

  const workflowProgression = [
    { step: 1, title: 'استقبال المريض والتحقق', desc: 'تسجيل الرقم القومي واستخراج رقم الملف الطبي الموحد (MRN) وربط التأمين.', icon: <UserOutlined />, path: '/patients' },
    { step: 2, title: 'حجز موعد العيادة أو الطوارئ', desc: 'جدولة الكشف في العيادات التخصصية أو استقبال الإخلاء الفوري.', icon: <CalendarOutlined />, path: '/appointments' },
    { step: 3, title: 'الفحص السريري والملف الطبي', desc: 'توثيق الأعراض، العلامات الحيوية، وتدوين التشخيص المعتمد بنظام ICD-10.', icon: <FileTextOutlined />, path: '/medical-records' },
    { step: 4, title: 'إصدار أوامر التحاليل والأشعة', desc: 'إرسال إلكتروني مباشر لمعامل التحاليل (LIS) ومراكز الأشعة (RIS).', icon: <ExperimentOutlined />, path: '/laboratory' },
    { step: 5, title: 'صرف الروشتة والأدوية', desc: 'فحص التفاعلات الدوائية والجرعات وخصم الأدوية من المخزون اللحظي.', icon: <ShopOutlined />, path: '/pharmacy' },
    { step: 6, title: 'التنويم وتسكين الأسرّة (إن لزم)', desc: 'تسكين المريض بأقسام العناية أو الجراحة وتحديث خريطة الأسرّة التفاعلية.', icon: <MedicineBoxOutlined />, path: '/admissions' },
    { step: 7, title: 'الفوترة والمطالبة التأمينية', desc: 'حساب نسبة التحمل وإرسال المطالبة لشركة التأمين وإصدار الفاتورة النهائية.', icon: <DollarOutlined />, path: '/billing' },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header Banner */}
      <Card
        bordered={false}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: 16,
          marginBottom: 24,
          color: '#fff',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 8, display: 'flex' }}>
              <MedevacLogo size={48} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                  سكيما ومعمارية تدفق بيانات النظام (Hospital MIS Schema)
                </Title>
                <Tag color="#38bdf8" style={{ color: '#0369a1', fontWeight: 'bold' }}>
                  TRADITIONAL ENTERPRISE BLUEPRINT
                </Tag>
              </div>
              <Paragraph style={{ color: '#e0f2fe', margin: '4px 0 0 0', fontSize: 14 }}>
                المخطط الهندسي التقليدي المتدرج لمنظومة المستشفيات: ترابط طبقات واجهات المستخدم ومحركات المعالجة الطبية والبيانات المركزية.
              </Paragraph>
            </div>
          </div>

          <Space>
            <Button
              type="primary"
              style={{ background: '#fff', color: '#0369a1', fontWeight: 600, border: 'none' }}
              icon={<ApartmentOutlined />}
              onClick={() => navigate('/')}
            >
              العودة للوحة الرئيسية
            </Button>
          </Space>
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs
        defaultActiveKey="architecture"
        size="large"
        items={[
          {
            key: 'architecture',
            label: (
              <span>
                <ApartmentOutlined /> معمارية النظام التقليدية (System Architecture Layers)
              </span>
            ),
            children: (
              <div>
                {/* Traditional 4-Tier Blueprint */}
                <Card
                  title={
                    <Space>
                      <BranchesOutlined style={{ color: '#0284c7', fontSize: 20 }} />
                      <Text strong style={{ fontSize: 16 }}>
                        مخطط المعمارية الهندسية الرباعية للأنظمة الطبية (4-Tier Medical Architecture)
                      </Text>
                    </Space>
                  }
                  style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: 24 }}
                >
                  <Paragraph type="secondary" style={{ marginBottom: 24, fontSize: 13 }}>
                    يوضح المخطط التقليدي أدناه كيفية تدفق الأوامر والبيانات رأسياً من واجهات المستخدم عبر محركات المعالجة وصولاً لقواعد البيانات السحابية والأمان:
                  </Paragraph>

                  {architectureTiers.map((tier, idx) => (
                    <div key={idx} style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          background: tier.bg,
                          border: `1.5px solid ${tier.border}`,
                          borderRight: `5px solid ${tier.color}`,
                          borderRadius: 12,
                          padding: '16px 20px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                          <Text strong style={{ color: tier.color, fontSize: 15 }}>
                            {tier.tier}
                          </Text>
                          <Tag style={{ background: '#fff', borderColor: tier.border, color: tier.color, fontWeight: 600 }}>
                            {tier.tierEn}
                          </Tag>
                        </div>

                        <Row gutter={[12, 12]}>
                          {tier.nodes.map((node, nIdx) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={nIdx}>
                              <div
                                onClick={() => navigate(node.path)}
                                style={{
                                  background: '#fff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 8,
                                  padding: '12px 14px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = tier.color;
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <span style={{ fontSize: 20, color: tier.color }}>{node.icon}</span>
                                <div style={{ overflow: 'hidden' }}>
                                  <Text strong style={{ fontSize: 13, display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {node.name}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 11, display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {node.sub}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>

                      {/* Directional Connector Arrow */}
                      {idx < architectureTiers.length - 1 && (
                        <div style={{ textAlign: 'center', margin: '8px 0' }}>
                          <Tag color="cyan" style={{ fontSize: 12, padding: '2px 12px', borderRadius: 20 }}>
                            <ArrowDownOutlined /> تبادل بيانات مشفر عبر واجهات برمجة التطبيقات (Encrypted Internal API Bus) <ArrowDownOutlined />
                          </Tag>
                        </div>
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            ),
          },
          {
            key: 'workflow',
            label: (
              <span>
                <BranchesOutlined /> تدرج مسار المريض والبيانات (Patient Journey Workflow)
              </span>
            ),
            children: (
              <Card
                title={
                  <Space>
                    <BranchesOutlined style={{ color: '#0284c7', fontSize: 20 }} />
                    <Text strong style={{ fontSize: 16 }}>
                      دورة حياة زيارة المريض بتدرج أقسام الموقع (End-to-End Hospital MIS Workflow)
                    </Text>
                  </Space>
                }
                style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
              >
                <Paragraph type="secondary" style={{ marginBottom: 20, fontSize: 13 }}>
                  مخطط تسلسلي يوضح كيفية انتقال سجل المريض بين أقسام النظام من لحظة الدخول وحتى السداد والمغادرة:
                </Paragraph>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {workflowProgression.map((step) => (
                    <div
                      key={step.step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 20px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRight: '4px solid #0284c7',
                        borderRadius: 10,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => navigate(step.path)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f9ff';
                        e.currentTarget.style.borderColor = '#0284c7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: '#0284c7',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                          flexShrink: 0,
                        }}
                      >
                        {step.step}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#0284c7', fontSize: 16 }}>{step.icon}</span>
                          <Text strong style={{ fontSize: 15 }}>
                            {step.title}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
                          {step.desc}
                        </Text>
                      </div>

                      <Button type="link" icon={<ArrowRightOutlined />}>
                        فتح القسم
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            key: 'modules',
            label: (
              <span>
                <ApartmentOutlined /> جدول وحدات السايد بار الـ 14 (All 14 Sidebar Modules)
              </span>
            ),
            children: (
              <Card
                title={
                  <Space>
                    <ApartmentOutlined style={{ color: '#0284c7', fontSize: 20 }} />
                    <Text strong style={{ fontSize: 16 }}>
                      فهرس وحدات النظام ومهامها الأساسية
                    </Text>
                  </Space>
                }
                style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
              >
                <Row gutter={[16, 16]}>
                  {[
                    { name: '1. لوحة التحكم والقيادة', en: 'Dashboard', desc: 'مؤشرات الأداء اللحظية، حركة المرضى، إشغال الأسرة والإيرادات.', path: '/', icon: <ApartmentOutlined /> },
                    { name: '2. سكيما وهيكلية النظام', en: 'System Schema', desc: 'المخطط الهندسي التقليدي وتدفق البيانات بين جميع الوحدات.', path: '/schema', icon: <BranchesOutlined /> },
                    { name: '3. سجل المرضى والملفات', en: 'Patients Directory', desc: 'إصدار الأرقام الطبية (MRN) وتوثيق البيانات الديموغرافية والتأمينية.', path: '/patients', icon: <UserOutlined /> },
                    { name: '4. إدارة المواعيد والعيادات', en: 'Appointments', desc: 'جدولة كشوفات العيادات الخارجية ومواعيد المتابعة الطبية.', path: '/appointments', icon: <CalendarOutlined /> },
                    { name: '5. التنويم وخريطة الأسرّة', en: 'Inpatients & Beds', desc: 'إشغال الأجنحة، العناية المركزة، تسكين وتصريف المرضى (ADT).', path: '/admissions', icon: <MedicineBoxOutlined /> },
                    { name: '6. السجلات الطبية (EMR)', en: 'Medical Records', desc: 'ملاحظات الطبيب السريرية، العلامات الحيوية، وأكواد ICD-10.', path: '/medical-records', icon: <FileTextOutlined /> },
                    { name: '7. المختبر والتحاليل (LIS)', en: 'Laboratory', desc: 'طلبات فحوصات الدم، المزارع، النتائج الحرجة والتقارير المعتمدة.', path: '/laboratory', icon: <ExperimentOutlined /> },
                    { name: '8. الأشعة والتصوير (RIS)', en: 'Radiology', desc: 'فحوصات الأشعة المقطعية، الرنين، السونار، وتوثيق تقارير الاستشاريين.', path: '/radiology', icon: <ScanOutlined /> },
                    { name: '9. الصيدلية والمخزون الدوائي', en: 'Pharmacy', desc: 'صرف الوصفات، التنبيه بنقص المخزون وتتبع الأدوية الحساسة.', path: '/pharmacy', icon: <ShopOutlined /> },
                    { name: '10. الفوترة والحسابات', en: 'Billing & Finance', desc: 'إصدار الفواتير الموحدة، التحصيل النقدي والبطاقات ومتابعة السداد.', path: '/billing', icon: <DollarOutlined /> },
                    { name: '11. التأمين والمطالبات', en: 'Insurance & Claims', desc: 'نسب التغطية، الموافقات المسبقة، ومعالجة مطالبات شركات التأمين.', path: '/insurance', icon: <SafetyCertificateOutlined /> },
                    { name: '12. الأرشيف وإدارة الوثائق', en: 'Archive (DMS)', desc: 'الأرشفة الرقمية للتقارير والملفات الطبية والوثائق الممسوحة.', path: '/archive', icon: <FolderOpenOutlined /> },
                    { name: '13. الأطقم الطبية والموظفين', en: 'Staff & HR', desc: 'سجلات الأطباء، التمريض، المواعيد وتوزيع المناوبات الطبية.', path: '/hr', icon: <TeamOutlined /> },
                    { name: '14. التقارير وإعدادات النظام', en: 'MIS Reports & Settings', desc: 'التحليلات الشاملة، إدارة المستخدمين، وتأمين الصلاحيات (RBAC).', path: '/reports', icon: <BarChartOutlined /> },
                  ].map((mod, i) => (
                    <Col xs={24} sm={12} lg={8} key={i}>
                      <Card
                        size="small"
                        hoverable
                        onClick={() => navigate(mod.path)}
                        style={{ borderRadius: 10, border: '1px solid #e2e8f0', height: '100%' }}
                      >
                        <Space align="center" style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 18, color: '#0284c7' }}>{mod.icon}</span>
                          <Text strong style={{ fontSize: 14 }}>{mod.name}</Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                          {mod.en}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#475569' }}>
                          {mod.desc}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};
