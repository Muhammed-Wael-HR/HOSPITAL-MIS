import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Alert,
  Table,
  Space,
  Typography,
  Avatar,
  Modal,
  Form,
  Input,
  Select,
  message,
  Timeline,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  ScanOutlined,
  ShopOutlined,
  DollarOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  WarningOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const PatientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = parseInt(id || '1', 10);

  const patient = useHospitalStore((state) => state.patients.find((p) => p.id === patientId));
  const appointments = useHospitalStore((state) => state.appointments.filter((a) => a.patientId === patientId));
  const admissions = useHospitalStore((state) => state.admissions.filter((a) => a.patientId === patientId));
  const vitals = useHospitalStore((state) => state.vitals.filter((v) => v.patientId === patientId));
  const medicalRecords = useHospitalStore((state) => state.medicalRecords.filter((m) => m.patientId === patientId));
  const labOrders = useHospitalStore((state) => state.labOrders.filter((l) => l.patientId === patientId));
  const radiologyOrders = useHospitalStore((state) => state.radiologyOrders.filter((r) => r.patientId === patientId));
  const prescriptions = useHospitalStore((state) => state.prescriptions.filter((p) => p.patientId === patientId));
  const invoices = useHospitalStore((state) => state.invoices.filter((i) => i.patientId === patientId));
  const archives = useHospitalStore((state) => state.archives.filter((a) => a.patientId === patientId));
  const doctors = useHospitalStore((state) => state.doctors);

  const addMedicalRecord = useHospitalStore((state) => state.addMedicalRecord);
  const addVitalSign = useHospitalStore((state) => state.addVitalSign);

  // SOAP Note Modal State
  const [soapModalVisible, setSoapModalVisible] = useState(false);
  const [soapForm] = Form.useForm();

  // Vital Signs Modal State
  const [vitalModalVisible, setVitalModalVisible] = useState(false);
  const [vitalForm] = Form.useForm();

  if (!patient) {
    return (
      <Card>
        <Alert message="خطأ" description="ملف المريض المطلوب غير موجود في النظام." type="error" showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/patients')}>
          العودة لسجل المرضى
        </Button>
      </Card>
    );
  }

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'غير محدد';
    const birthYear = new Date(dobString).getFullYear();
    const currentYear = new Date().getFullYear();
    return `${currentYear - birthYear} سنة`;
  };

  const handleSaveSoap = async () => {
    try {
      const values = await soapForm.validateFields();
      addMedicalRecord({
        patientId,
        doctorId: values.doctorId,
        visitType: values.visitType,
        icd10Code: values.icd10Code,
        icd10Desc: values.icd10Desc,
        subjective: values.subjective,
        objective: values.objective,
        assessment: values.assessment,
        plan: values.plan,
      });
      message.success('تمت إضافة السجل الطبي والملاحظات بنجاح');
      soapForm.resetFields();
      setSoapModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveVitals = async () => {
    try {
      const values = await vitalForm.validateFields();
      addVitalSign({
        patientId,
        temperature: Number(values.temperature),
        bpSystolic: Number(values.bpSystolic),
        bpDiastolic: Number(values.bpDiastolic),
        heartRate: Number(values.heartRate),
        respiratoryRate: Number(values.respiratoryRate),
        oxygenSaturation: Number(values.oxygenSaturation),
        recordedBy: values.recordedBy || 'التمريض المسؤول',
      });
      message.success('تم تسجيل العلامات الحيوية بنجاح');
      vitalForm.resetFields();
      setVitalModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const latestVital = vitals[vitals.length - 1];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Patient Header Banner */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={4} style={{ textAlign: 'center' }}>
            <Avatar
              size={96}
              style={{
                backgroundColor: patient.gender === 'MALE' ? '#1890ff' : '#eb2f96',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              icon={<UserOutlined />}
            />
          </Col>

          <Col xs={24} md={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Title level={3} style={{ margin: 0 }}>
                {patient.fullNameAr}
              </Title>
              <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 13, padding: '2px 8px' }}>
                {patient.mrn}
              </Tag>
              {patient.bloodType && (
                <Tag color="green" style={{ fontWeight: 600 }}>
                  فصيلة الدم: {patient.bloodType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}
                </Tag>
              )}
            </div>

            {patient.fullNameEn && (
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
                {patient.fullNameEn}
              </Text>
            )}

            <Space size="large" style={{ marginTop: 12, flexWrap: 'wrap' }}>
              <Text>
                <strong>السن:</strong> {calculateAge(patient.dateOfBirth)} ({patient.gender === 'MALE' ? 'ذكر' : 'أنثى'})
              </Text>
              <Text>
                <strong>الرقم القومي:</strong> <span style={{ fontFamily: 'monospace' }}>{patient.nationalId}</span>
              </Text>
              <Text>
                <strong>الهاتف:</strong> <span dir="ltr">{patient.phone}</span>
              </Text>
              <Text>
                <strong>المحافظة:</strong> {patient.city}
              </Text>
            </Space>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: 'left' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                block
                onClick={() => setSoapModalVisible(true)}
              >
                إضافة فحص سريري / كشف (SOAP Note)
              </Button>
              <Button icon={<HeartOutlined />} block onClick={() => setVitalModalVisible(true)}>
                تسجيل العلامات الحيوية (Vitals)
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Allergy Warning Alert */}
        {patient.allergies && patient.allergies !== 'لا توجد' && (
          <Alert
            message="تحذير طبي عاجل: حساسية دوائية مسجلة"
            description={patient.allergies}
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* Main Tabs Container */}
      <Card bordered={false}>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <UserOutlined /> نظرة عامة
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} lg={14}>
                      <Card title="بيانات الاتصال والطوارئ" size="small" style={{ marginBottom: 16 }}>
                        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                          <Descriptions.Item label="العنوان السكني">{patient.address || '-'}</Descriptions.Item>
                          <Descriptions.Item label="المدينة">{patient.city || '-'}</Descriptions.Item>
                          <Descriptions.Item label="جهة اتصال الطوارئ">{patient.emergencyContact || '-'}</Descriptions.Item>
                          <Descriptions.Item label="هاتف الطوارئ">
                            <span dir="ltr">{patient.emergencyPhone || '-'}</span>
                          </Descriptions.Item>
                          <Descriptions.Item label="تاريخ فتح الملف">
                            {new Date(patient.createdAt).toLocaleDateString('ar-EG')}
                          </Descriptions.Item>
                          <Descriptions.Item label="ملاحظات الملف">{patient.notes || 'لا توجد'}</Descriptions.Item>
                        </Descriptions>
                      </Card>

                      <Card title="أحدث تشخيص سريري وملاحظات العلاج" size="small">
                        {medicalRecords.length > 0 ? (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <Text strong style={{ fontSize: 14 }}>
                                التشخيص: {medicalRecords[0].icd10Desc}
                              </Text>
                              <Tag color="cyan">{medicalRecords[0].icd10Code}</Tag>
                            </div>
                            <Paragraph>
                              <strong>خطة العلاج المقررة: </strong>
                              {medicalRecords[0].plan}
                            </Paragraph>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              الطبيب المعالج: {medicalRecords[0].doctor?.employee?.fullNameAr} | التاريخ:{' '}
                              {new Date(medicalRecords[0].createdAt).toLocaleDateString('ar-EG')}
                            </Text>
                          </div>
                        ) : (
                          <Text type="secondary">لم يتم تسجيل ملاحظات طبية حتى الآن.</Text>
                        )}
                      </Card>
                    </Col>

                    <Col xs={24} lg={10}>
                      <Card
                        title="آخر قياس للعلامات الحيوية"
                        size="small"
                        extra={
                          latestVital && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {new Date(latestVital.recordedAt).toLocaleTimeString('ar-EG')}
                            </Text>
                          )
                        }
                      >
                        {latestVital ? (
                          <Row gutter={[12, 12]}>
                            <Col span={12}>
                              <Card size="small" style={{ background: '#f6ffed', textAlign: 'center' }}>
                                <Text type="secondary">درجة الحرارة</Text>
                                <Title level={4} style={{ margin: '4px 0', color: '#52c41a' }}>
                                  {latestVital.temperature} °C
                                </Title>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card size="small" style={{ background: '#e6f7ff', textAlign: 'center' }}>
                                <Text type="secondary">ضغط الدم</Text>
                                <Title level={4} style={{ margin: '4px 0', color: '#1890ff' }}>
                                  {latestVital.bpSystolic} / {latestVital.bpDiastolic}
                                </Title>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card size="small" style={{ background: '#fff7e6', textAlign: 'center' }}>
                                <Text type="secondary">النبض (Heart Rate)</Text>
                                <Title level={4} style={{ margin: '4px 0', color: '#fa8c16' }}>
                                  {latestVital.heartRate} bpm
                                </Title>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card size="small" style={{ background: '#f9f0ff', textAlign: 'center' }}>
                                <Text type="secondary">تشبع الأكسجين (SpO2)</Text>
                                <Title level={4} style={{ margin: '4px 0', color: '#722ed1' }}>
                                  {latestVital.oxygenSaturation} %
                                </Title>
                              </Card>
                            </Col>
                          </Row>
                        ) : (
                          <Text type="secondary">لا توجد قراءات مسجلة.</Text>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'emr',
              label: (
                <span>
                  <FileTextOutlined /> السجلات الطبية (SOAP) ({medicalRecords.length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setSoapModalVisible(true)}>
                      كتابة كشف / فحص سريري جديد
                    </Button>
                  </div>

                  <Timeline mode="right">
                    {medicalRecords.map((record) => (
                      <Timeline.Item
                        key={record.id}
                        color="blue"
                        dot={<FileTextOutlined style={{ fontSize: 16 }} />}
                      >
                        <Card
                          size="small"
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>
                                كشف سريري - {record.doctor?.employee?.fullNameAr} ({record.doctor?.specialty})
                              </span>
                              <Tag color="blue">{new Date(record.createdAt).toLocaleDateString('ar-EG')}</Tag>
                            </div>
                          }
                          style={{ marginBottom: 8 }}
                        >
                          <div style={{ marginBottom: 6 }}>
                            <Tag color="cyan">ICD-10: {record.icd10Code}</Tag>
                            <Text strong>{record.icd10Desc}</Text>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <Text strong style={{ color: '#1890ff' }}>S (Subjective - شكوى المريض): </Text>
                            <Paragraph>{record.subjective}</Paragraph>

                            <Text strong style={{ color: '#1890ff' }}>O (Objective - الفحص السريري): </Text>
                            <Paragraph>{record.objective}</Paragraph>

                            <Text strong style={{ color: '#1890ff' }}>A (Assessment - التشخيص والتقييم): </Text>
                            <Paragraph>{record.assessment}</Paragraph>

                            <Text strong style={{ color: '#1890ff' }}>P (Plan - خطة العلاج والأدوية): </Text>
                            <Paragraph>{record.plan}</Paragraph>
                          </div>
                        </Card>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              ),
            },
            {
              key: 'appointments',
              label: (
                <span>
                  <CalendarOutlined /> المواعيد والعيادات ({appointments.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={appointments}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    {
                      title: 'تاريخ وتوقيت الموعد',
                      dataIndex: 'scheduledAt',
                      key: 'scheduledAt',
                      render: (d: string) => new Date(d).toLocaleString('ar-EG'),
                    },
                    {
                      title: 'العيادة / الطبيب',
                      dataIndex: ['doctor', 'employee', 'fullNameAr'],
                      key: 'doctor',
                    },
                    {
                      title: 'التخصص',
                      dataIndex: ['doctor', 'specialty'],
                      key: 'specialty',
                    },
                    {
                      title: 'نوع الزيارة',
                      dataIndex: 'type',
                      key: 'type',
                      render: (t: string) => (t === 'CONSULTATION' ? 'كشف أول مرة' : 'إعادة واستشارة'),
                    },
                    {
                      title: 'حالة الموعد',
                      dataIndex: 'status',
                      key: 'status',
                      render: (st: string) => <StatusBadge status={st} />,
                    },
                    {
                      title: 'ملاحظات',
                      dataIndex: 'notes',
                      key: 'notes',
                    },
                  ]}
                />
              ),
            },
            {
              key: 'admissions',
              label: (
                <span>
                  <MedicineBoxOutlined /> التنويم والأسرّة ({admissions.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={admissions}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    {
                      title: 'تاريخ الدخول',
                      dataIndex: 'admittedAt',
                      key: 'admittedAt',
                      render: (d: string) => new Date(d).toLocaleString('ar-EG'),
                    },
                    {
                      title: 'السرير المخصص',
                      dataIndex: ['bed', 'bedNumber'],
                      key: 'bedNumber',
                      render: (b: string) => <Tag color="purple">{b || 'غير محدد'}</Tag>,
                    },
                    {
                      title: 'الطبيب المشرف',
                      dataIndex: ['doctor', 'employee', 'fullNameAr'],
                      key: 'doctor',
                    },
                    {
                      title: 'سبب التنويم',
                      dataIndex: 'admissionReason',
                      key: 'admissionReason',
                    },
                    {
                      title: 'حالة الإقامة',
                      dataIndex: 'status',
                      key: 'status',
                      render: (st: string) => <StatusBadge status={st} />,
                    },
                    {
                      title: 'ملخص الخروج',
                      dataIndex: 'dischargeSummary',
                      key: 'dischargeSummary',
                      render: (sum?: string) => sum || 'المريض مقيم حالياً',
                    },
                  ]}
                />
              ),
            },
            {
              key: 'lab',
              label: (
                <span>
                  <ExperimentOutlined /> المختبر والتحاليل ({labOrders.length})
                </span>
              ),
              children: (
                <div>
                  {labOrders.map((order) => (
                    <Card
                      key={order.id}
                      title={`طلب تحاليل: ${order.orderNumber}`}
                      extra={<StatusBadge status={order.status} />}
                      style={{ marginBottom: 16 }}
                      size="small"
                    >
                      <Table
                        dataSource={order.results}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={[
                          { title: 'اسم الفحص', dataIndex: ['test', 'nameAr'], key: 'testName' },
                          {
                            title: 'النتيجة',
                            dataIndex: 'resultValue',
                            key: 'resultValue',
                            render: (val: string, r: any) => (
                              <Text strong style={{ color: r.isAbnormal ? '#cf1322' : '#389e0d' }}>
                                {val || 'قيد الفحص بالمعمل'}
                              </Text>
                            ),
                          },
                          { title: 'المعدل الطبيعي (Reference)', dataIndex: ['test', 'normalRange'], key: 'normal' },
                          {
                            title: 'التقييم',
                            dataIndex: 'isAbnormal',
                            key: 'isAbnormal',
                            render: (ab: boolean) =>
                              ab ? <Tag color="error">غير طبيعي (Abnormal)</Tag> : <Tag color="success">سليم (Normal)</Tag>,
                          },
                        ]}
                      />
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              key: 'radiology',
              label: (
                <span>
                  <ScanOutlined /> الأشعة والتصوير ({radiologyOrders.length})
                </span>
              ),
              children: (
                <div>
                  {radiologyOrders.map((order) => (
                    <Card
                      key={order.id}
                      title={`فحص أشعة: ${order.type?.nameAr} (${order.orderNumber})`}
                      extra={<StatusBadge status={order.status} />}
                      style={{ marginBottom: 16 }}
                    >
                      <Paragraph>
                        <strong>الدواعي الإكلينيكية: </strong>
                        {order.clinicalInfo}
                      </Paragraph>
                      <Card type="inner" title="تقرير استشاري الأشعة">
                        <Paragraph style={{ whiteSpace: 'pre-line' }}>{order.report || 'التقرير قيد الإعداد'}</Paragraph>
                      </Card>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              key: 'prescriptions',
              label: (
                <span>
                  <ShopOutlined /> الروشتات والعلاج ({prescriptions.length})
                </span>
              ),
              children: (
                <div>
                  {prescriptions.map((pres) => (
                    <Card
                      key={pres.id}
                      title={`روشتة طبية - ${pres.doctor?.employee?.fullNameAr}`}
                      extra={<StatusBadge status={pres.status} />}
                      style={{ marginBottom: 16 }}
                      size="small"
                    >
                      <Table
                        dataSource={pres.items}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        columns={[
                          { title: 'اسم الدواء التجاري', dataIndex: ['medication', 'tradeName'], key: 'med' },
                          { title: 'الجرعة', dataIndex: 'dosage', key: 'dosage' },
                          { title: 'التكرار', dataIndex: 'frequency', key: 'frequency' },
                          { title: 'المدة', dataIndex: 'duration', key: 'duration' },
                          {
                            title: 'حالة الصرف بالصيدلية',
                            dataIndex: 'dispensed',
                            key: 'dispensed',
                            render: (d: boolean) =>
                              d ? <Tag color="success">تم الصرف</Tag> : <Tag color="warning">بانتظار الصرف</Tag>,
                          },
                        ]}
                      />
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              key: 'billing',
              label: (
                <span>
                  <DollarOutlined /> الفواتير والحسابات ({invoices.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={invoices}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'رقم الفاتورة', dataIndex: 'invoiceNumber', key: 'inv' },
                    {
                      title: 'إجمالي القيمة',
                      dataIndex: 'total',
                      key: 'total',
                      render: (v: number) => `${v.toLocaleString()} ج.م`,
                    },
                    {
                      title: 'المسدد فعلياً',
                      dataIndex: 'paid',
                      key: 'paid',
                      render: (v: number) => `${v.toLocaleString()} ج.م`,
                    },
                    {
                      title: 'حالة الفاتورة',
                      dataIndex: 'status',
                      key: 'status',
                      render: (st: string) => <StatusBadge status={st} />,
                    },
                    { title: 'طريقة السداد', dataIndex: 'paymentMethod', key: 'method' },
                  ]}
                />
              ),
            },
            {
              key: 'archive',
              label: (
                <span>
                  <FolderOpenOutlined /> الأرشيف والوثائق المرفقة ({archives.length})
                </span>
              ),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text type="secondary">المستندات، الإقرارات الجراحية، والأشعات المحفوظة رقمياً لهذا المريض</Text>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/archive')}>
                      رفع مستند جديد للأرشيف
                    </Button>
                  </div>

                  <Table
                    dataSource={archives}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      {
                        title: 'عنوان الوثيقة',
                        dataIndex: 'title',
                        key: 'title',
                        render: (t: string, r: any) => (
                          <div>
                            <Text strong>{t}</Text>
                            <div style={{ color: '#8c8c8c', fontSize: 12 }}>{r.description}</div>
                          </div>
                        ),
                      },
                      {
                        title: 'التصنيف',
                        dataIndex: 'category',
                        key: 'category',
                        render: (c: string) => <Tag color="geekblue">{c}</Tag>,
                      },
                      {
                        title: 'اسم الملف',
                        dataIndex: 'fileName',
                        key: 'fileName',
                        render: (fn: string) => <span style={{ fontFamily: 'monospace' }}>{fn}</span>,
                      },
                      {
                        title: 'حجم الملف',
                        dataIndex: 'fileSize',
                        key: 'fileSize',
                        render: (sz: number) => `${(sz / (1024 * 1024)).toFixed(2)} MB`,
                      },
                      {
                        title: 'تاريخ الرفع',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (d: string) => new Date(d).toLocaleDateString('ar-EG'),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* SOAP Note Form Modal */}
      <Modal
        title="كتابة فحص سريري وملاحظات طبية (SOAP Note)"
        open={soapModalVisible}
        onCancel={() => setSoapModalVisible(false)}
        onOk={handleSaveSoap}
        okText="حفظ الملاحظة الطبية"
        cancelText="إلغاء"
        width={720}
      >
        <Form form={soapForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="doctorId" label="الطبيب المعالج" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select placeholder="اختر الطبيب">
                  {doctors.map((doc) => (
                    <Option key={doc.id} value={doc.id}>
                      {doc.employee?.fullNameAr} ({doc.specialty})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="visitType" label="نوع الفحص" initialValue="CONSULTATION">
                <Select>
                  <Option value="CONSULTATION">كشف عيادة</Option>
                  <Option value="FOLLOW_UP">استشارة ومتابعة</Option>
                  <Option value="EMERGENCY">طوارئ</Option>
                  <Option value="PROCEDURE">إجراء تدخلي / جراحي</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="icd10Code" label="كود التشخيص الدولي (ICD-10)" initialValue="E11.9">
                <Input placeholder="e.g. E11.9" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="icd10Desc" label="الوصف التشخيصي" initialValue="Type 2 Diabetes Mellitus">
                <Input placeholder="وصف التشخيص الطبي" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subjective" label="S - شكوى المريض (Subjective)" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="الأعراض التي يشتكي منها المريض..." />
          </Form.Item>

          <Form.Item name="objective" label="O - الفحص السريري ونتائج التحاليل (Objective)">
            <TextArea rows={2} placeholder="العلامات الملاحظة بالفحص المباشر والفحوصات..." />
          </Form.Item>

          <Form.Item name="assessment" label="A - التقييم والتشخيص النهائي (Assessment)">
            <TextArea rows={2} placeholder="تقييم حالة المريض..." />
          </Form.Item>

          <Form.Item name="plan" label="P - خطة العلاج والأدوية (Plan)" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="التوصيات، الأدوية، الفحوصات المطلوبة، موعد المتابعة..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Vital Signs Modal */}
      <Modal
        title="تسجيل العلامات الحيوية (Vital Signs)"
        open={vitalModalVisible}
        onCancel={() => setVitalModalVisible(false)}
        onOk={handleSaveVitals}
        okText="حفظ القراءات"
        cancelText="إلغاء"
        width={560}
      >
        <Form form={vitalForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="temperature" label="درجة الحرارة (°C)" initialValue={37.0} rules={[{ required: true }]}>
                <Input type="number" step="0.1" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="bpSystolic" label="ضغط انقباضي" initialValue={120} rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="bpDiastolic" label="ضغط انبساطي" initialValue={80} rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="heartRate" label="معدل النبض (bpm)" initialValue={75} rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oxygenSaturation" label="تشبع الأكسجين (SpO2 %)" initialValue={98} rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="recordedBy" label="اسم القائم بالقياس" initialValue="التمريض المسؤول">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
