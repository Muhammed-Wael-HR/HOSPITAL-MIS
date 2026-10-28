import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Select, Input, Row, Col, message } from 'antd';
import { ScanOutlined, PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const RadiologyOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const radiologyOrders = useHospitalStore((state) => state.radiologyOrders);
  const radiologyTypes = useHospitalStore((state) => state.radiologyTypes);
  const patients = useHospitalStore((state) => state.patients);
  const doctors = useHospitalStore((state) => state.doctors);

  const createRadiologyOrder = useHospitalStore((state) => state.createRadiologyOrder);
  const addRadiologyReport = useHospitalStore((state) => state.addRadiologyReport);

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [reportText, setReportText] = useState('');

  const [orderForm] = Form.useForm();

  const handleCreateOrder = async () => {
    try {
      const values = await orderForm.validateFields();
      createRadiologyOrder({
        patientId: values.patientId,
        doctorId: values.doctorId,
        typeId: values.typeId,
        clinicalInfo: values.clinicalInfo,
      });
      message.success('تم إنشاء طلب فحص الأشعة بنجاح');
      orderForm.resetFields();
      setOrderModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openReportModal = (orderId: number, currentRep?: string) => {
    setSelectedOrderId(orderId);
    setReportText(currentRep || '');
    setReportModalVisible(true);
  };

  const handleSaveReport = () => {
    if (selectedOrderId) {
      addRadiologyReport(selectedOrderId, reportText);
      message.success('تم حفظ تقرير الأشعة التشخيصي بنجاح');
      setReportModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'رقم الفحص الإشعاعي',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (num: string) => <Tag color="purple" style={{ fontFamily: 'monospace' }}>{num}</Tag>,
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
      title: 'نوع الفحص',
      dataIndex: ['type', 'nameAr'],
      key: 'type',
      render: (typeName: string, record: any) => (
        <div>
          <Text strong>{typeName}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 11 }}>{record.type?.category}</div>
        </div>
      ),
    },
    {
      title: 'الدواعي الطبية (Clinical Indication)',
      dataIndex: 'clinicalInfo',
      key: 'clinicalInfo',
      ellipsis: true,
    },
    {
      title: 'تاريخ الفحص',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'تقرير الاستشاري',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          type={record.status === 'REPORTED' ? 'default' : 'primary'}
          icon={<FileDoneOutlined />}
          onClick={() => openReportModal(record.id, record.report)}
        >
          {record.status === 'REPORTED' ? 'تعديل التقرير' : 'كتابة التقرير'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            الأشعة والتصوير الطبي (Radiology Information System - RIS)
          </Title>
          <Text type="secondary">جدولة فحوصات الرنين، الأشعة المقطعية، الأشعة السينية، وإعداد التقارير الطبية</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setOrderModalVisible(true)}>
          طلب فحص أشعة جديد
        </Button>
      </div>

      <Card bordered={false}>
        <Table
          dataSource={radiologyOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ background: '#fafafa', padding: 16, borderRadius: 6 }}>
                <Title level={5}>التقرير التشخيصي المعتمد:</Title>
                <Paragraph style={{ whiteSpace: 'pre-line' }}>{record.report || 'لم يتم تحرير التقرير بعد'}</Paragraph>
              </div>
            ),
          }}
        />
      </Card>

      {/* Order Modal */}
      <Modal
        title="طلب فحص أشعة جديد"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        onOk={handleCreateOrder}
        okText="تأكيد طلب الأشعة"
        cancelText="إلغاء"
        width={640}
      >
        <Form form={orderForm} layout="vertical">
          <Form.Item name="patientId" label="المريض" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select showSearch placeholder="ابحث عن المريض...">
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullNameAr} ({p.mrn})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
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

            <Col span={12}>
              <Form.Item name="typeId" label="نوع فحص الأشعة" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select placeholder="اختر نوع الأشعة">
                  {radiologyTypes.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.nameAr} - {t.price} ج.م
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="clinicalInfo" label="الدواعي السريرية ومكان العضو المفحوص">
            <TextArea rows={3} placeholder="مثال: اشتباه كسر بالساعد الأيمن، صداع مستمر مع فقدان توازن، فحص روتيني للصدر..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Report Modal */}
      <Modal
        title="كتابة تقرير الأشعة التشخيصي"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        onOk={handleSaveReport}
        okText="اعتماد وحفظ التقرير"
        cancelText="إلغاء"
        width={680}
      >
        <Paragraph type="secondary">
          اكتب نتائج الفحص والنتائج الإشعاعية والتوصيات الطبية:
        </Paragraph>
        <TextArea
          rows={6}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="نتائج الفحص الإشعاعي بالتفصيل..."
        />
      </Modal>
    </div>
  );
};
