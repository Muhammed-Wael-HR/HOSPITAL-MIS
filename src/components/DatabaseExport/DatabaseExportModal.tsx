import React, { useRef } from 'react';
import { Modal, Button, Typography, Space, Table, Tag, Row, Col, Card, Statistic, Divider, message } from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  FolderOpenOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useHospitalStore } from '../../mockData/mockStore';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

const { Title, Text, Paragraph } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const DatabaseExportModal: React.FC<Props> = ({ visible, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const { hospitalSettings } = useAppStore();
  const currentUser = useAuthStore((state) => state.user);

  const patients = useHospitalStore((state) => state.patients);
  const departments = useHospitalStore((state) => state.departments);
  const beds = useHospitalStore((state) => state.beds);
  const rooms = useHospitalStore((state) => state.rooms);
  const admissions = useHospitalStore((state) => state.admissions);
  const appointments = useHospitalStore((state) => state.appointments);
  const invoices = useHospitalStore((state) => state.invoices);
  const medications = useHospitalStore((state) => state.medications);
  const employees = useHospitalStore((state) => state.employees);
  const archives = useHospitalStore((state) => state.archives);
  const users = useHospitalStore((state) => state.users);

  // Stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0);
  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const fullDatabaseDump = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser ? `${currentUser.fullName} (${currentUser.username})` : 'System Admin',
        systemName: hospitalSettings.nameAr,
        systemVersion: 'Hospital MIS v2.0-Enterprise',
      },
      hospitalSettings,
      users,
      departments,
      rooms,
      beds,
      patients,
      admissions,
      appointments,
      invoices,
      medications,
      employees,
      archives,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullDatabaseDump, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `Hospital_Database_Backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    message.success('تم تحميل وتصدير ملف النسخة الاحتياطية لقاعدة البيانات (JSON) بنجاح!');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 22 }} />
          <span>استخراج وتصدير قاعدة بيانات المستشفى الشاملة (PDF Database Export)</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1050}
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={onClose}>
          إغلاق النافذة
        </Button>,
        <Button key="json" icon={<DownloadOutlined />} onClick={handleDownloadJson}>
          تحميل كود البيانات (JSON Backup)
        </Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
          طباعة واستخراج كملف PDF رسمي الآن
        </Button>,
      ]}
    >
      <div
        id="pdf-printable-area"
        ref={printAreaRef}
        style={{
          background: '#ffffff',
          padding: '24px 20px',
          color: '#000',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {/* Official Header */}
        <div
          style={{
            borderBottom: '3px double #1890ff',
            paddingBottom: 16,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#1890ff',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                +
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, color: '#002140', fontWeight: 800 }}>
                  {hospitalSettings.nameAr}
                </h1>
                <div style={{ fontSize: 13, color: '#595959' }}>{hospitalSettings.nameEn}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#595959' }}>
              <span>العنوان: {hospitalSettings.address}</span> | <span>الخط الساخن: {hospitalSettings.hotline}</span> | <span>الهاتف: {hospitalSettings.phone}</span>
            </div>
          </div>

          <div style={{ textAlign: 'left', fontSize: 11, color: '#333' }}>
            <div style={{ fontWeight: 'bold', fontSize: 13, color: '#1890ff', marginBottom: 2 }}>
              تقرير استخراج قاعدة البيانات المركزية
            </div>
            <div><strong>كود الاعتماد (GAHAR):</strong> {hospitalSettings.gaharCode}</div>
            <div><strong>الرقم الضريبي:</strong> {hospitalSettings.taxNumber}</div>
            <div><strong>تاريخ الاستخراج:</strong> {new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}</div>
            <div><strong>ساعة الإصدار:</strong> {new Date().toLocaleTimeString('ar-EG')}</div>
            <div><strong>المسؤول:</strong> {currentUser?.fullName || 'المدير العام'}</div>
          </div>
        </div>

        {/* Executive Database Summary */}
        <div style={{ background: '#f8fafd', padding: 12, borderRadius: 8, border: '1px solid #d6e4ff', marginBottom: 20 }}>
          <div style={{ fontWeight: 'bold', fontSize: 14, color: '#096dd9', marginBottom: 10 }}>
            📊 المؤشرات العامة وحجم سجلات قاعدة البيانات (Database Metrics):
          </div>
          <Row gutter={[12, 12]} style={{ textAlign: 'center' }}>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>سجلات المرضى</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>{patients.length}</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>الأسرّة الكلية</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#722ed1' }}>{beds.length} ({occupiedBeds} مشغول)</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>المواعيد والعيادات</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#13c2c2' }}>{appointments.length}</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>إجمالي الفواتير</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>{totalPaid.toLocaleString()} ج.م</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>الأدوية والمخزون</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fa8c16' }}>{medications.length} صنف</div>
              </div>
            </Col>
            <Col span={4}>
              <div style={{ background: '#fff', padding: '8px 4px', borderRadius: 6, border: '1px solid #e8e8e8' }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>مسؤولي النظام</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#eb2f96' }}>{users.length} حسابات</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Section 1: Patients Directory */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #1890ff', paddingBottom: 4, color: '#1890ff', margin: '0 0 8px 0' }}>
            1. سجل المرضى والملفات الطبية (Patients Directory - {patients.length} مريض)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f0f5ff', borderBottom: '1px solid #adc6ff' }}>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>#</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>رقم الملف (MRN)</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>اسم المريض</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الرقم القومي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>النوع/السن</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>فصيلة الدم</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>رقم الهاتف</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الحساسية الدوائية</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '5px 4px' }}>{idx + 1}</td>
                  <td style={{ padding: '5px 4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#096dd9' }}>{p.mrn}</td>
                  <td style={{ padding: '5px 4px', fontWeight: 600 }}>{p.fullNameAr}</td>
                  <td style={{ padding: '5px 4px', fontFamily: 'monospace' }}>{p.nationalId || '-'}</td>
                  <td style={{ padding: '5px 4px' }}>{p.gender === 'MALE' ? 'ذكر' : 'أنثى'} ({p.dateOfBirth ? 2026 - parseInt(p.dateOfBirth.slice(0, 4)) : '-'} سنة)</td>
                  <td style={{ padding: '5px 4px' }}>{p.bloodType ? p.bloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-') : '-'}</td>
                  <td style={{ padding: '5px 4px', direction: 'ltr' }}>{p.phone || '-'}</td>
                  <td style={{ padding: '5px 4px', color: p.allergies && p.allergies !== 'لا توجد' ? '#cf1322' : '#595959' }}>{p.allergies || 'لا توجد'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Inpatients & Bed Map */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #722ed1', paddingBottom: 4, color: '#722ed1', margin: '0 0 8px 0' }}>
            2. خريطة الأسرّة والتنويم الداخلي (Beds & Inpatient Admissions - {beds.length} سرير)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f9f0ff', borderBottom: '1px solid #d3adf7' }}>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>رقم السرير</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>رقم الغرفة</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>القسم الطبي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>حالة السرير</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>المريض النزيل</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>تاريخ الدخول</th>
              </tr>
            </thead>
            <tbody>
              {beds.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                const dept = departments.find((d) => d.id === room?.departmentId);
                const activeAdm = admissions.find((a) => a.bedId === b.id && a.status === 'ADMITTED');
                const patient = activeAdm ? patients.find((p) => p.id === activeAdm.patientId) : null;

                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '5px 4px', fontWeight: 'bold' }}>{b.bedNumber}</td>
                    <td style={{ padding: '5px 4px' }}>غرفة {room?.roomNumber || '-'} (طابق {room?.floor || '1'})</td>
                    <td style={{ padding: '5px 4px' }}>{dept?.nameAr || '-'}</td>
                    <td style={{ padding: '5px 4px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: b.status === 'AVAILABLE' ? '#389e0d' : b.status === 'OCCUPIED' ? '#cf1322' : '#d48806',
                          background: b.status === 'AVAILABLE' ? '#f6ffed' : b.status === 'OCCUPIED' ? '#fff2f0' : '#fffbe6',
                        }}
                      >
                        {b.status === 'AVAILABLE' ? 'شاغر ومتاح' : b.status === 'OCCUPIED' ? 'مشغول بنزيل' : 'محجوز مؤقتاً'}
                      </span>
                    </td>
                    <td style={{ padding: '5px 4px', fontWeight: patient ? 600 : 400 }}>{patient ? patient.fullNameAr : 'لا يوجد'}</td>
                    <td style={{ padding: '5px 4px' }}>{activeAdm ? new Date(activeAdm.admittedAt).toLocaleDateString('ar-EG') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 3: Billing & Financial Invoices */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #52c41a', paddingBottom: 4, color: '#389e0d', margin: '0 0 8px 0' }}>
            3. الفوترة والمطالبات المالية (Invoices & Medical Billing - إجمالي: {totalRevenue.toLocaleString()} ج.م)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f6ffed', borderBottom: '1px solid #b7eb8f' }}>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>رقم الفاتورة</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>اسم المريض</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>قيمة الخدمات</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>المدفوع</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>المتبقي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>طريقة السداد</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>حالة الفاتورة</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const patient = patients.find((p) => p.id === inv.patientId);
                const remaining = Number(inv.total) - Number(inv.paid);
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '5px 4px', fontFamily: 'monospace', fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '5px 4px' }}>{patient?.fullNameAr || 'مريض عام'}</td>
                    <td style={{ padding: '5px 4px', fontWeight: 'bold' }}>{Number(inv.total).toLocaleString()} ج.م</td>
                    <td style={{ padding: '5px 4px', color: '#389e0d' }}>{Number(inv.paid).toLocaleString()} ج.م</td>
                    <td style={{ padding: '5px 4px', color: remaining > 0 ? '#cf1322' : '#8c8c8c' }}>{remaining.toLocaleString()} ج.م</td>
                    <td style={{ padding: '5px 4px' }}>{inv.paymentMethod}</td>
                    <td style={{ padding: '5px 4px' }}>{inv.status === 'PAID' ? 'خالصة ومسددة' : inv.status === 'PARTIALLY_PAID' ? 'مسددة جزئياً' : 'مفتوحة'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 4: Pharmacy Inventory */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #fa8c16', paddingBottom: 4, color: '#d48806', margin: '0 0 8px 0' }}>
            4. الصيدلية والمخزون الدوائي (Pharmacy Medications Inventory)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#fffbe6', borderBottom: '1px solid #ffe58f' }}>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الكود الدوائي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الاسم التجاري والعلمي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الشكل والتركيز</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الرصيد المتاح</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>حد الطلب الأدنى</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>سعر الوحدة</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>حالة المخزون</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => {
                const isLow = m.currentStock <= m.minimumStock;
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '5px 4px', fontFamily: 'monospace' }}>{m.code}</td>
                    <td style={{ padding: '5px 4px', fontWeight: 600 }}>{m.tradeName} <span style={{ color: '#8c8c8c', fontSize: 10 }}>({m.genericName})</span></td>
                    <td style={{ padding: '5px 4px' }}>{m.form} - {m.strength}</td>
                    <td style={{ padding: '5px 4px', fontWeight: 'bold', color: isLow ? '#cf1322' : '#389e0d' }}>{m.currentStock} عبوة</td>
                    <td style={{ padding: '5px 4px' }}>{m.minimumStock} عبوة</td>
                    <td style={{ padding: '5px 4px' }}>{m.price} ج.م</td>
                    <td style={{ padding: '5px 4px', color: isLow ? '#cf1322' : '#389e0d' }}>{isLow ? '⚠️ منخفض دون حد الطلب' : 'متوفر ومستقر'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 5: System Administrators & RBAC Users */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #eb2f96', paddingBottom: 4, color: '#c41d7f', margin: '0 0 8px 0' }}>
            5. مسؤولي النظام والصلاحيات المعتمدة (System Administrators & RBAC Accounts)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#fff0f6', borderBottom: '1px solid #ffadd2' }}>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>#</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>اسم المستخدم (Username)</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الاسم الكامل</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الدور الوظيفي</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الصلاحيات الممنوحة</th>
                <th style={{ padding: '6px 4px', textAlign: 'right' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '5px 4px' }}>{idx + 1}</td>
                  <td style={{ padding: '5px 4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#c41d7f' }}>{u.username}</td>
                  <td style={{ padding: '5px 4px', fontWeight: 600 }}>{u.fullName}</td>
                  <td style={{ padding: '5px 4px' }}>{u.isSuperAdmin ? 'المدير العام والمسؤول الأساسي' : u.role}</td>
                  <td style={{ padding: '5px 4px' }}>
                    {u.isSuperAdmin ? (
                      <span style={{ color: '#cf1322', fontWeight: 'bold' }}>كامل صلاحيات النظام (Super Admin)</span>
                    ) : (
                      <span>{u.permissions?.join('، ') || 'لوحة التحكم'}</span>
                    )}
                  </td>
                  <td style={{ padding: '5px 4px', color: u.isActive ? '#389e0d' : '#cf1322' }}>{u.isActive ? 'مفعل ونشط' : 'معطل'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 6: Hospital Departments & Staff Overview */}
        <div style={{ marginBottom: 24, pageBreakInside: 'avoid' }}>
          <h3 style={{ fontSize: 14, borderBottom: '1px solid #13c2c2', paddingBottom: 4, color: '#08979c', margin: '0 0 8px 0' }}>
            6. الأقسام الطبية والتشغيلية المعتمدة ({departments.length} قسماً)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {departments.map((d) => (
              <div key={d.id} style={{ padding: '4px 8px', borderRadius: 4, background: '#e6fffb', border: '1px solid #87e8de', fontSize: 11 }}>
                <strong>{d.nameAr}</strong> <span style={{ color: '#8c8c8c' }}>({d.type})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Document Footer & Signatures */}
        <div
          style={{
            marginTop: 40,
            borderTop: '2px solid #333',
            paddingTop: 16,
            pageBreakInside: 'avoid',
          }}
        >
          <div style={{ textAlign: 'center', fontSize: 12, color: '#595959', marginBottom: 20 }}>
            إقرار رسمي: تم استخراج هذا الملف الشامل لقاعدة البيانات آلياً من الخادم المركزي لمنظومة مستشفى النيل التخصصي وهو مستند إداري معتمد للأرشفة والتدقيق.
          </div>

          <Row gutter={24} style={{ textAlign: 'center', marginTop: 10 }}>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', marginBottom: 40 }}>مسؤول النظام المستخرج</div>
              <div style={{ borderTop: '1px dotted #888', paddingTop: 6, fontSize: 11 }}>
                {currentUser?.fullName || 'المدير العام'}
              </div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', marginBottom: 40 }}>المدير المالي والحسابات</div>
              <div style={{ borderTop: '1px dotted #888', paddingTop: 6, fontSize: 11 }}>
                أ/ سيف الدين خالد
              </div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', marginBottom: 40 }}>المدير الطبي للمستشفى</div>
              <div style={{ borderTop: '1px dotted #888', paddingTop: 6, fontSize: 11 }}>
                أ.د/ طارق المنشاوي
              </div>
            </Col>
            <Col span={6}>
              <div style={{ fontWeight: 'bold', marginBottom: 40 }}>خاتم المنشأة والاعتماد</div>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  border: '2px dashed #1890ff',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: '#1890ff',
                  fontWeight: 'bold',
                }}
              >
                ختم المستشفى
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};