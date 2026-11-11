import React, { useState } from 'react';
import { Card, Tag, Button, Typography, Row, Col, Space, Badge } from 'antd';
import {
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
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FilePdfOutlined,
  BranchesOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';

const { Title, Text, Paragraph } = Typography;

interface SchemaModule {
  id: string;
  key: string;
  titleAr: string;
  titleEn: string;
  layer: 'intake' | 'clinical' | 'diagnostics' | 'financial' | 'governance';
  icon: React.ReactNode;
  path: string;
  badgeText: string;
  color: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export const InteractiveSystemSchema: React.FC<{ onOpenPdfExport: () => void }> = ({ onOpenPdfExport }) => {
  const navigate = useNavigate();

  const patients = useHospitalStore((s) => s.patients);
  const appointments = useHospitalStore((s) => s.appointments);
  const admissions = useHospitalStore((s) => s.admissions);
  const invoices = useHospitalStore((s) => s.invoices);
  const users = useHospitalStore((s) => s.users);
  const medications = useHospitalStore((s) => s.medications);
  const archives = useHospitalStore((s) => s.archives);

  const modules: SchemaModule[] = [
    // Layer 1: Intake & Triage
    {
      id: 'patients',
      key: 'patients',
      titleAr: 'سجل المرضى والفرز التكتيكي',
      titleEn: 'Patients & Emergency Triage',
      layer: 'intake',
      icon: <UserOutlined />,
      path: '/patients',
      badgeText: `${patients.length} ملف نشط`,
      color: '#0284c7',
      description: 'تسجيل المرضى بالرقم القومي (14 رقم)، توليد الـ MRN، وتوثيق الحساسية وفصائل الدم للطوارئ.',
      inputs: ['البيانات الديموغرافية', 'الرقم القومي', 'جهات الاتصال للطوارئ'],
      outputs: ['رقم ملف MRN', 'تحذيرات الحساسية', 'السجل الطبي الأولي']
    },
    {
      id: 'appointments',
      key: 'appointments',
      titleAr: 'إدارة المواعيد والعيادات',
      titleEn: 'Outpatient Appointments',
      layer: 'intake',
      icon: <CalendarOutlined />,
      path: '/appointments',
      badgeText: `${appointments.length} موعد مجدول`,
      color: '#0ea5e9',
      description: 'حجز وتنظيم مواعيد العيادات التخصصية الـ 10 ومتابعة قوائم الانتظار اللحظية.',
      inputs: ['طلب حجز موعد', 'تحديد التخصص الطبي', 'بيانات المريض'],
      outputs: ['تذكرة الكشف', 'حجز وقت الطبيب', 'إشعار الكشف']
    },
    {
      id: 'admissions',
      key: 'admissions',
      titleAr: 'خريطة الأسرّة والتنويم',
      titleEn: 'Bed Logistics & Inpatients',
      layer: 'intake',
      icon: <MedicineBoxOutlined />,
      path: '/admissions',
      badgeText: `${admissions.length} إقامة نشطة`,
      color: '#38bdf8',
      description: 'إدارة الطاقة الاستيعابية للأسرّة الحية، غرف العناية المركزة ICU وجاهزية الإخلاء الطبي.',
      inputs: ['قرار تنويم من الطبيب', 'تصنيف الحالة', 'حجز سرير'],
      outputs: ['تسكين السرير', 'سجل الملاحظة السريرية', 'أمر الإخلاء/الخروج']
    },

    // Layer 2: Clinical Decision Core
    {
      id: 'medical_records',
      key: 'medical_records',
      titleAr: 'السجلات الطبية السريرية (EMR)',
      titleEn: 'Clinical Records (SOAP / ICD)',
      layer: 'clinical',
      icon: <FileTextOutlined />,
      path: '/medical-records',
      badgeText: '15 كشف سريري',
      color: '#10b981',
      description: 'تدوين الفحص الطبي بنظام SOAP والتشخيصات المعتمدة ICD-10 وربط طلبات العلاج.',
      inputs: ['شكوى المريض', 'الفحص السريري', 'العلامات الحيوية'],
      outputs: ['التشخيص الطبي', 'طلبات الفحوصات', 'الروشتة العلاجية']
    },
    {
      id: 'hr',
      key: 'hr',
      titleAr: 'الأطقم الطبية والمناوبات',
      titleEn: 'Medical Staff & Scheduling',
      layer: 'clinical',
      icon: <TeamOutlined />,
      path: '/hr',
      badgeText: '14 طبيب وموظف',
      color: '#059669',
      description: 'إدارة أطباء العيادات، التخصصات الدقيقة، رخص مزاولة المهنة وجداول النوبتجيات.',
      inputs: ['بيانات الأطباء', 'التخصص الطبي', 'جدول المناوبة'],
      outputs: ['توزيع العيادات', 'توثيق الإشراف', 'إسناد الحالات']
    },

    // Layer 3: Diagnostics
    {
      id: 'laboratory',
      key: 'laboratory',
      titleAr: 'المختبر المركزي والتحاليل (LIS)',
      titleEn: 'Clinical Laboratory (LIS)',
      layer: 'diagnostics',
      icon: <ExperimentOutlined />,
      path: '/laboratory',
      badgeText: '7 فحوصات معتمدة',
      color: '#8b5cf6',
      description: 'استقبال طلبات CBC، السكر التراكمي، وظائف الكلى وإرسال النتائج لحظياً للملف الطبي.',
      inputs: ['أمر تحليل طبي', 'أولوية العينة (STAT/عادي)', 'العينة البيولوجية'],
      outputs: ['نتائج التحاليل', 'تنبيه النسب الحرجة', 'تقرير المختبر المعتمد']
    },
    {
      id: 'radiology',
      key: 'radiology',
      titleAr: 'الأشعة والتصوير الطبي (RIS)',
      titleEn: 'Radiology Imaging (RIS)',
      layer: 'diagnostics',
      icon: <ScanOutlined />,
      path: '/radiology',
      badgeText: '7 بروتوكولات أشعة',
      color: '#a855f7',
      description: 'جدولة فحوصات الرنين، الإيكو، السونار، الأشعة السينية مع تقارير استشاري الأشعة.',
      inputs: ['طلب فحص تصويري', 'بيانات السرير/العيادة', 'الأعراض الموجهة'],
      outputs: ['الصور الإشعاعية', 'التقرير التشخيصي', 'تحديث خطة العلاج']
    },
    {
      id: 'pharmacy',
      key: 'pharmacy',
      titleAr: 'الصيدلية الذكية والمخزون',
      titleEn: 'Smart Pharmacy & Stock',
      layer: 'diagnostics',
      icon: <ShopOutlined />,
      path: '/pharmacy',
      badgeText: `${medications.length} صنف دوائي`,
      color: '#6366f1',
      description: 'صرف الروشتات الإلكترونية مع فحص تلقائي لتعارض الحساسية ومراقبة حد الطلب الأدنى.',
      inputs: ['الروشتة الإلكترونية', 'تحقق حساسية المريض', 'رصيد المخزن'],
      outputs: ['صرف الدواء', 'حركة المخزون', 'إدراج التكلفة بالفاتورة']
    },

    // Layer 4: Financial & Logistics
    {
      id: 'billing',
      key: 'billing',
      titleAr: 'الفوترة والمحاسبة الطبية',
      titleEn: 'Billing & Revenue Cycle',
      layer: 'financial',
      icon: <DollarOutlined />,
      path: '/billing',
      badgeText: `${invoices.length} فاتورة مسجلة`,
      color: '#f59e0b',
      description: 'تجميع رسوم الكشف والتحاليل والأشعة والإقامة تلقائياً وسدادها نقداً أو بالتأمين أو بالفيزا.',
      inputs: ['خدمات الأقسام المقدمة', 'أسعار الأدوية', 'نسبة التحمل'],
      outputs: ['فاتورة موحدة', 'إيصال سداد رسمي', 'سجل الإيرادات']
    },
    {
      id: 'insurance',
      key: 'insurance',
      titleAr: 'التأمين الطبي والمطالبات',
      titleEn: 'Health Insurance & Claims',
      layer: 'financial',
      icon: <SafetyCertificateOutlined />,
      path: '/insurance',
      badgeText: '3 شركات كبرى',
      color: '#d97706',
      description: 'إدارة عقود بوبا، أكسا، ميدنت ونسب التغطية ورفع ومتابعة مطالبات الاسترداد.',
      inputs: ['بيانات البوليصة', 'موافقة التأمين', 'الفاتورة الطبية'],
      outputs: ['مطالبة رسمية', 'خصم التحمل', 'تسوية المستحقات']
    },

    // Layer 5: Governance & Security
    {
      id: 'settings',
      key: 'settings',
      titleAr: 'إدارة المشرفين والصلاحيات (RBAC)',
      titleEn: 'Multi-Admin RBAC & Settings',
      layer: 'governance',
      icon: <SettingOutlined />,
      path: '/settings',
      badgeText: `${users.length} مسؤول نشط`,
      color: '#ef4444',
      description: 'صلاحيات مخصصة لكل مسؤول، تحديث لحظي لبيانات المدير في الشريط العلوي، وحفظ دائم.',
      inputs: ['بيانات الاعتماد', 'تحديد الصلاحيات', 'إعدادات المنشأة'],
      outputs: ['تسجيل دخول آمن', 'حظر التعديل غير المصرح', 'مزامنة فورية']
    },
    {
      id: 'archive',
      key: 'archive',
      titleAr: 'الأرشيف الطبي والوثائق (DMS)',
      titleEn: 'Document Archive (DMS)',
      layer: 'governance',
      icon: <FolderOpenOutlined />,
      path: '/archive',
      badgeText: `${archives.length} وثيقة مؤمنة`,
      color: '#14b8a6',
      description: 'أرشفة وتشفير التقارير الطبية والإقرارات وبروتوكولات الإخلاء الطبي الميداني.',
      inputs: ['الملفات الرقمية', 'التصنيف السري', 'وسوم البحث'],
      outputs: ['استرجاع فوري', 'سجل التدقيق الرقمي', 'حفظ دائم']
    },
    {
      id: 'reports',
      key: 'reports',
      titleAr: 'التقارير الشاملة واستخراج البيانات (MIS)',
      titleEn: 'Enterprise MIS Analytics',
      layer: 'governance',
      icon: <BarChartOutlined />,
      path: '/reports',
      badgeText: 'مؤشرات لحظية',
      color: '#06b6d4',
      description: 'لوحات قياس الأداء الطبي والمالي، وتصدير قواعد البيانات الشاملة PDF وExcel.',
      inputs: ['بيانات جميع الأقسام', 'إحصائيات الإشغال', 'التدفقات النقدية'],
      outputs: ['تقارير القرارات', 'ملفات Excel وPDF', 'مؤشرات الجودة']
    }
  ];

  const [activeModule, setActiveModule] = useState<SchemaModule>(modules[0]);

  return (
    <Card
      bordered={false}
      style={{
        marginTop: 20,
        marginBottom: 24,
        background: 'linear-gradient(135deg, #0b1528 0%, #112240 100%)',
        borderRadius: 16,
        boxShadow: '0 12px 36px rgba(2, 132, 199, 0.12)',
        border: '1px solid #1e3a66',
        color: '#fff',
      }}
    >
      {/* Header of Schema */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <Space align="center" style={{ marginBottom: 4 }}>
            <BranchesOutlined style={{ fontSize: 24, color: '#00f2fe' }} />
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              سكيما وهيكلية تدفق البيانات التفاعلية لمنظومة MEDEVAC MIS
            </Title>
            <Tag color="#00f2fe" style={{ color: '#000', fontWeight: 'bold' }}>
              INTERACTIVE SYSTEM SCHEMA
            </Tag>
          </Space>
          <Paragraph style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>
            خريطة تفاعلية توضح الربط والتكامل الشامل بين كافة أقسام المنظومة والـ Sidebars وتدفق السجلات الطبية والمالية لحظياً.
          </Paragraph>
        </div>

        {/* Action Buttons for Assets & Downloads */}
        <Space wrap>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
            href="/MEDEVAC_TEAM_Database.xlsx"
            download="MEDEVAC_TEAM_Database.xlsx"
          >
            تنزيل قاعدة بيانات الإكسيل (.xlsx)
          </Button>

          <Button
            icon={<FilePptOutlined />}
            style={{ background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontWeight: 600 }}
            href="/MEDEVAC_MIS_Presentation_Bilingual.pptx"
            download="MEDEVAC_MIS_Presentation_Bilingual.pptx"
          >
            برزنتيشن عربي / إنجليزي (.pptx)
          </Button>

          <Button
            icon={<FilePptOutlined />}
            style={{ background: '#0284c7', borderColor: '#0284c7', color: '#fff', fontWeight: 600 }}
            href="/MEDEVAC_MIS_Presentation_English.pptx"
            download="MEDEVAC_MIS_Presentation_English.pptx"
          >
            برزنتيشن إنجليزي فقط (.pptx)
          </Button>

          <Button
            danger
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={onOpenPdfExport}
          >
            استخراج PDF رسمي
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Side: Interactive Interactive Modules Grid */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Layer 1: Intake & Triage */}
            <div>
              <Text strong style={{ color: '#38bdf8', fontSize: 12, display: 'block', marginBottom: 6 }}>
                1. بوابة الاستقبال والفرز التكتيكي (INTAKE & EMERGENCY TRIAGE)
              </Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {modules.filter((m) => m.layer === 'intake').map((m) => {
                  const isSelected = activeModule.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveModule(m)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(2, 132, 199, 0.3)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? '1.5px solid #00f2fe' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 16px rgba(0, 242, 254, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <span style={{ fontSize: 18, color: m.color }}>{m.icon}</span>
                          <Text strong style={{ color: '#fff', fontSize: 13 }}>{m.titleAr}</Text>
                        </Space>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>{m.titleEn}</Text>
                        <Tag color="cyan" style={{ margin: 0, fontSize: 10 }}>{m.badgeText}</Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 2: Clinical Decision Core */}
            <div>
              <Text strong style={{ color: '#34d399', fontSize: 12, display: 'block', marginBottom: 6 }}>
                2. القلب السريري وقرارات الأطباء (CLINICAL DECISION CORE)
              </Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {modules.filter((m) => m.layer === 'clinical').map((m) => {
                  const isSelected = activeModule.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveModule(m)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? '1.5px solid #10b981' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 16px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <span style={{ fontSize: 18, color: m.color }}>{m.icon}</span>
                          <Text strong style={{ color: '#fff', fontSize: 13 }}>{m.titleAr}</Text>
                        </Space>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>{m.titleEn}</Text>
                        <Tag color="green" style={{ margin: 0, fontSize: 10 }}>{m.badgeText}</Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 3: Diagnostic & Therapeutic Services */}
            <div>
              <Text strong style={{ color: '#c084fc', fontSize: 12, display: 'block', marginBottom: 6 }}>
                3. الخدمات التشخيصية والعلاجية (DIAGNOSTIC & PHARMACY ENGINES)
              </Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {modules.filter((m) => m.layer === 'diagnostics').map((m) => {
                  const isSelected = activeModule.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveModule(m)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(168, 85, 247, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? '1.5px solid #a855f7' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <span style={{ fontSize: 18, color: m.color }}>{m.icon}</span>
                          <Text strong style={{ color: '#fff', fontSize: 13 }}>{m.titleAr}</Text>
                        </Space>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>{m.titleEn}</Text>
                        <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>{m.badgeText}</Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 4 & 5: Finance, Security & Governance */}
            <div>
              <Text strong style={{ color: '#fbbf24', fontSize: 12, display: 'block', marginBottom: 6 }}>
                4. الإدارة المالية، الأمان والحوكمة (FINANCE & GOVERNANCE)
              </Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {modules.filter((m) => m.layer === 'financial' || m.layer === 'governance').map((m) => {
                  const isSelected = activeModule.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setActiveModule(m)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? '1.5px solid #f59e0b' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size="small">
                          <span style={{ fontSize: 16, color: m.color }}>{m.icon}</span>
                          <Text strong style={{ color: '#fff', fontSize: 12 }}>{m.titleAr}</Text>
                        </Space>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <Text style={{ color: '#94a3b8', fontSize: 10 }}>{m.titleEn}</Text>
                        <Tag color="orange" style={{ margin: 0, fontSize: 9 }}>{m.badgeText}</Tag>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>

        {/* Right Side: Active Node Details & Live Connections */}
        <Col xs={24} lg={8}>
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1.5px solid ${activeModule.color}`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: `0 8px 24px ${activeModule.color}22`
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${activeModule.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: activeModule.color,
                    border: `1px solid ${activeModule.color}`
                  }}
                >
                  {activeModule.icon}
                </div>
                <div>
                  <Title level={5} style={{ color: '#fff', margin: 0 }}>
                    {activeModule.titleAr}
                  </Title>
                  <Text style={{ color: activeModule.color, fontSize: 12 }}>
                    {activeModule.titleEn}
                  </Text>
                </div>
              </div>

              <Tag color={activeModule.color} style={{ marginBottom: 14, fontWeight: 'bold' }}>
                المؤشر الحالي: {activeModule.badgeText}
              </Tag>

              <Paragraph style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                {activeModule.description}
              </Paragraph>

              {/* Data Inflow */}
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: '#38bdf8', fontSize: 12, display: 'block', marginBottom: 4 }}>
                  📥 المدخلات والبيانات الواردة (Inflow):
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {activeModule.inputs.map((inp, idx) => (
                    <Tag key={idx} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>
                      • {inp}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Data Outflow */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ color: '#34d399', fontSize: 12, display: 'block', marginBottom: 4 }}>
                  📤 المخرجات والقرارات الصادرة (Outflow):
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {activeModule.outputs.map((out, idx) => (
                    <Tag key={idx} style={{ background: '#1e293b', border: '1px solid #065f46', color: '#a7f3d0' }}>
                      ✓ {out}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate(activeModule.path)}
              style={{
                background: activeModule.color,
                borderColor: activeModule.color,
                fontWeight: 'bold',
                width: '100%',
                marginTop: 10
              }}
            >
              فتح قسم {activeModule.titleAr} الآن
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};
