import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Space, Typography, Modal, Form, Select, Row, Col, message } from 'antd';
import { FileTextOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const MedicalRecordListPage: React.FC = () => {
  const navigate = useNavigate();
  const medicalRecords = useHospitalStore((state) => state.medicalRecords);
  const patients = useHospitalStore((state) => state.patients);
  const doctors = useHospitalStore((state) => state.doctors);
  const addMedicalRecord = useHospitalStore((state) => state.addMedicalRecord);

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredRecords = medicalRecords.filter((rec) => {
    const pName = rec.patient?.fullNameAr || '';
    const dName = rec.doctor?.employee?.fullNameAr || '';
    const code = rec.icd10Code || '';
    const desc = rec.icd10Desc || '';
    const query = searchText.toLowerCase();
    return (
      pName.toLowerCase().includes(query) ||
      dName.toLowerCase().includes(query) ||
      code.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query)
    );
  });

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      addMedicalRecord({
        patientId: values.patientId,
        doctorId: values.doctorId,
        visitType: values.visitType,
        icd10Code: values.icd10Code,
        icd10Desc: values.icd10Desc,
        subjective: values.subjective,
        objective: values.objective,
        assessment: values.assessment,
        plan: values.plan,
      });
      message.success('تمت إضافة السجل الطبي بنجاح');
      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: 'تاريخ الفحص',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      title: 'المريض',
      dataIndex: ['patient', 'fullNameAr'],
      key: 'patient',
      render: (name: string, record: any) => (
        <div>
          <a onClick={() => navigate(`/patients/${record.patientId}`)} style={{ fontWeight: 600 }}>
            {name}
          </a>
          <div style={{ color: '#8c8c8c', fontSize: 11 }}>{record.patient?.mrn}</div>
        </div>
      ),
    },
    {
      title: 'الطبيب المعالج',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
      render: (name: string, record: any) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 11 }}>{record.doctor?.specialty}</div>
        </div>
      ),
    },
    {
      title: 'كود التشخيص الدولي (ICD-10)',
      dataIndex: 'icd10Code',
      key: 'icd10Code',
      render: (code: string, record: any) => (
        <div>
          <Tag color="cyan" style={{ fontFamily: 'monospace' }}>
            {code}
          </Tag>
          <div style={{ fontSize: 12 }}>{record.icd10Desc}</div>
        </div>
      ),
    },
    {
      title: 'الخطة العلاجية (Plan)',
      dataIndex: 'plan',
      key: 'plan',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            السجلات الطبية والملاحظات السريرية (Electronic Medical Records - EMR)
          </Title>
          <Text type="secondary">أرشيف الكشوفات السريرية، الملاحظات التمريضية، والتشخيص الدولي ICD-10</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setModalVisible(true)}>
          تسجيل كشف سريري جديد (SOAP)
        </Button>
      </div>

      <Card bordered={false}>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="بحث بالمريض، الطبيب، كود ICD-10، أو التشخيص..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '8px 16px', background: '#fafafa', borderRadius: 6 }}>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong style={{ color: '#1890ff' }}>
                      S (Subjective - شكوى المريض):
                    </Text>
                    <Paragraph style={{ margin: 0 }}>{record.subjective || 'لم تسجل'}</Paragraph>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ color: '#1890ff' }}>
                      O (Objective - الفحص السريري):
                    </Text>
                    <Paragraph style={{ margin: 0 }}>{record.objective || 'لم تسجل'}</Paragraph>
                  </Col>
                  <Col span={12} style={{ marginTop: 8 }}>
                    <Text strong style={{ color: '#1890ff' }}>
                      A (Assessment - التشخيص والتقييم):
                    </Text>
                    <Paragraph style={{ margin: 0 }}>{record.assessment || 'لم تسجل'}</Paragraph>
                  </Col>
                  <Col span={12} style={{ marginTop: 8 }}>
                    <Text strong style={{ color: '#1890ff' }}>
                      P (Plan - خطة العلاج والأدوية):
                    </Text>
                    <Paragraph style={{ margin: 0 }}>{record.plan || 'لم تسجل'}</Paragraph>
                  </Col>
                </Row>
              </div>
            ),
          }}
        />
      </Card>

      {/* SOAP Modal */}
      <Modal
        title="كتابة فحص سريري وملاحظات طبية (SOAP Note)"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleCreate}
        okText="حفظ الملاحظة الطبية"
        cancelText="إلغاء"
        width={720}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="patientId" label="المريض" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select showSearch placeholder="اختر المريض">
                  {patients.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.fullNameAr} ({p.mrn})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="doctorId" label="الطبيب المعالج" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select placeholder="اختر الطبيب">
                  {doctors.map((d) => (
                    <Option key={d.id} value={d.id}>
                      {d.employee?.fullNameAr} ({d.specialty})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="icd10Code" label="كود ICD-10" initialValue="I10">
                <Input placeholder="e.g. I10" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="icd10Desc" label="التشخيص الطبي" initialValue="Essential (primary) hypertension">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subjective" label="S - شكوى المريض (Subjective)" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="الأعراض التي يشتكي منها المريض..." />
          </Form.Item>

          <Form.Item name="objective" label="O - الفحص السريري ونتائج التحاليل (Objective)">
            <TextArea rows={2} placeholder="العلامات الملاحظة بالفحص المباشر..." />
          </Form.Item>

          <Form.Item name="assessment" label="A - التقييم والتشخيص النهائي (Assessment)">
            <TextArea rows={2} placeholder="تقييم حالة المريض..." />
          </Form.Item>

          <Form.Item name="plan" label="P - خطة العلاج والأدوية (Plan)" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="التوصيات، الأدوية، الفحوصات المطلوبة، موعد المتابعة..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
