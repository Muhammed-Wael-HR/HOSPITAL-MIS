import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Select, Input, Row, Col, message } from 'antd';
import { ExperimentOutlined, PlusOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text } = Typography;
const { Option } = Select;

export const LabOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const labOrders = useHospitalStore((state) => state.labOrders);
  const labTests = useHospitalStore((state) => state.labTests);
  const patients = useHospitalStore((state) => state.patients);
  const doctors = useHospitalStore((state) => state.doctors);

  const createLabOrder = useHospitalStore((state) => state.createLabOrder);
  const enterLabResult = useHospitalStore((state) => state.enterLabResult);
  const approveLabOrder = useHospitalStore((state) => state.approveLabOrder);

  // New Order Modal State
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();

  // Enter Results Modal State
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [resultValues, setResultValues] = useState<{ [testId: number]: { value: string; isAbnormal: boolean } }>({});

  const handleCreateOrder = async () => {
    try {
      const values = await orderForm.validateFields();
      createLabOrder({
        patientId: values.patientId,
        doctorId: values.doctorId,
        testIds: values.testIds,
        priority: values.priority,
        notes: values.notes,
      });
      message.success('تم إنشاء طلب التحاليل وإرساله للمختبر بنجاح');
      orderForm.resetFields();
      setOrderModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openResultModal = (order: any) => {
    setCurrentOrder(order);
    const initial: any = {};
    order.results?.forEach((res: any) => {
      initial[res.testId] = {
        value: res.resultValue || '',
        isAbnormal: res.isAbnormal || false,
      };
    });
    setResultValues(initial);
    setResultModalVisible(true);
  };

  const handleSaveResults = () => {
    if (!currentOrder) return;
    const formatted = Object.keys(resultValues).map((testIdStr) => {
      const testId = Number(testIdStr);
      return {
        testId,
        resultValue: resultValues[testId].value,
        isAbnormal: resultValues[testId].isAbnormal,
      };
    });
    enterLabResult(currentOrder.id, formatted);
    message.success('تم تسجيل وحفظ نتائج الفحوصات المعملية بنجاح');
    setResultModalVisible(false);
  };

  const columns = [
    {
      title: 'رقم الطلب المعملي',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (num: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{num}</Tag>,
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
      title: 'الطبيب الطالب',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
    },
    {
      title: 'الأولوية',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: string) => {
        if (p === 'STAT') return <Tag color="error">طارئ جداً (STAT)</Tag>;
        if (p === 'URGENT') return <Tag color="warning">عاجل (Urgent)</Tag>;
        return <Tag color="default">عادي (Routine)</Tag>;
      },
    },
    {
      title: 'تاريخ الطلب',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      title: 'الحالة المعملية',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'الإجراءات المعملية',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openResultModal(record)}>
            تسجيل النتائج
          </Button>
          {record.status !== 'APPROVED' && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                approveLabOrder(record.id);
                message.success('تم اعتماد نتائج التحاليل رسمياً');
              }}
            >
              اعتماد
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            المختبر والتحاليل الطبية (Laboratory Information System - LIS)
          </Title>
          <Text type="secondary">إدارة أوامر الفحوصات المعملية، تسجيل النتائج، ومقارنتها بالمعدلات الطبيعية</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setOrderModalVisible(true)}>
          طلب تحاليل طبية جديد
        </Button>
      </div>

      <Card bordered={false}>
        <Table
          dataSource={labOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ background: '#fafafa', padding: 12, borderRadius: 6 }}>
                <Table
                  dataSource={record.results}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'اسم الفحص', dataIndex: ['test', 'nameAr'], key: 'name' },
                    {
                      title: 'النتيجة المسجلة',
                      dataIndex: 'resultValue',
                      key: 'val',
                      render: (v: string, r: any) => (
                        <Text strong style={{ color: r.isAbnormal ? '#cf1322' : '#389e0d' }}>
                          {v || 'بانتظار الفحص'}
                        </Text>
                      ),
                    },
                    { title: 'المعدل الطبيعي (Reference)', dataIndex: ['test', 'normalRange'], key: 'norm' },
                    {
                      title: 'التقييم',
                      dataIndex: 'isAbnormal',
                      key: 'ab',
                      render: (ab: boolean) => (ab ? <Tag color="error">غير طبيعي</Tag> : <Tag color="success">طبيعي</Tag>),
                    },
                  ]}
                />
              </div>
            ),
          }}
        />
      </Card>

      {/* New Order Modal */}
      <Modal
        title="طلب تحاليل معملية جديد"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        onOk={handleCreateOrder}
        okText="إرسال الطلب للمعمل"
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
              <Form.Item name="priority" label="أولوية الفحص" initialValue="ROUTINE">
                <Select>
                  <Option value="ROUTINE">عادي (Routine)</Option>
                  <Option value="URGENT">عاجل (Urgent)</Option>
                  <Option value="STAT">طارئ للغاية (STAT)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="testIds" label="التحاليل المطلوبة" rules={[{ required: true, message: 'يرجى اختيار التحاليل' }]}>
            <Select mode="multiple" placeholder="اختر فحصاً أو أكثر...">
              {labTests.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.nameAr} ({t.code}) - {t.price} ج.م
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="ملاحظات سريرية للمعمل">
            <Input placeholder="مثال: مريض سكري صائم، متابعة كلى بعد الجراحة..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Enter Results Modal */}
      <Modal
        title={`تسجيل نتائج التحاليل - طلب رقم (${currentOrder?.orderNumber})`}
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        onOk={handleSaveResults}
        okText="حفظ واعتماد النتائج"
        cancelText="إلغاء"
        width={680}
      >
        <p>يرجى إدخال قيم الفحوصات وتحديد ما إذا كانت النتيجة خارج النطاق الطبيعي:</p>
        {currentOrder?.results?.map((res: any) => (
          <Card key={res.id} size="small" style={{ marginBottom: 12, background: '#fafafa' }}>
            <Row gutter={16} align="middle">
              <Col span={10}>
                <Text strong>{res.test?.nameAr}</Text>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>المعدل: {res.test?.normalRange}</div>
              </Col>
              <Col span={8}>
                <Input
                  placeholder="القيمة المقاسة"
                  value={resultValues[res.testId]?.value || ''}
                  onChange={(e) =>
                    setResultValues({
                      ...resultValues,
                      [res.testId]: {
                        ...resultValues[res.testId],
                        value: e.target.value,
                      },
                    })
                  }
                />
              </Col>
              <Col span={6}>
                <Select
                  value={resultValues[res.testId]?.isAbnormal ? 'ABNORMAL' : 'NORMAL'}
                  onChange={(val) =>
                    setResultValues({
                      ...resultValues,
                      [res.testId]: {
                        ...resultValues[res.testId],
                        isAbnormal: val === 'ABNORMAL',
                      },
                    })
                  }
                  style={{ width: '100%' }}
                >
                  <Option value="NORMAL">طبيعي (Normal)</Option>
                  <Option value="ABNORMAL">غير طبيعي (Abnormal)</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
