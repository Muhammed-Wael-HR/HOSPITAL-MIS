import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Select, Input, Row, Col, InputNumber, message, Divider } from 'antd';
import { DollarOutlined, PlusOutlined, PrinterOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { useAppStore } from '../../store/appStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const hospitalSettings = useAppStore((state) => state.hospitalSettings);
  const invoices = useHospitalStore((state) => state.invoices);
  const patients = useHospitalStore((state) => state.patients);
  const createInvoice = useHospitalStore((state) => state.createInvoice);
  const payInvoice = useHospitalStore((state) => state.payInvoice);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<any>('CASH');
  const [payRef, setPayRef] = useState<string>('');

  const [form] = Form.useForm();

  const handleCreateInvoice = async () => {
    try {
      const values = await form.validateFields();
      const unitPrice = Number(values.unitPrice) || 0;
      const qty = Number(values.quantity) || 1;
      const subtotal = unitPrice * qty;
      const discount = Number(values.discount) || 0;
      const total = Math.max(0, subtotal - discount);

      createInvoice({
        patientId: values.patientId,
        subtotal,
        discount,
        tax: 0,
        total,
        paid: 0,
        status: 'ISSUED',
        paymentMethod: values.paymentMethod,
        notes: values.notes,
        items: [
          {
            id: Date.now(),
            invoiceId: 0,
            description: values.description,
            category: values.category || 'خدمات عامة',
            quantity: qty,
            unitPrice,
            total,
          },
        ],
      });

      message.success('تم إصدار الفاتورة الطبية بنجاح');
      form.resetFields();
      setCreateModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openPayModal = (inv: any) => {
    setSelectedInvoice(inv);
    const remaining = Number(inv.total) - Number(inv.paid);
    setPayAmount(remaining > 0 ? remaining : 0);
    setPayMethod('CASH');
    setPayRef('');
    setPayModalVisible(true);
  };

  const handleConfirmPay = () => {
    if (selectedInvoice && payAmount > 0) {
      payInvoice(selectedInvoice.id, payAmount, payMethod, payRef);
      message.success('تم تحصيل الدفعة بنجاح وتحديث حالة الفاتورة');
      setPayModalVisible(false);
    }
  };

  const openPreviewModal = (inv: any) => {
    setSelectedInvoice(inv);
    setPreviewModalVisible(true);
  };

  const columns = [
    {
      title: 'رقم الفاتورة',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
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
      title: 'إجمالي القيمة',
      dataIndex: 'total',
      key: 'total',
      render: (tot: number) => <Text strong>{tot.toLocaleString()} ج.م</Text>,
    },
    {
      title: 'المسدد فعلياً',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid: number) => <span style={{ color: '#52c41a' }}>{paid.toLocaleString()} ج.م</span>,
    },
    {
      title: 'المتبقي',
      key: 'remaining',
      render: (_: any, r: any) => {
        const rem = Number(r.total) - Number(r.paid);
        return <span style={{ color: rem > 0 ? '#ff4d4f' : '#8c8c8c', fontWeight: 600 }}>{rem.toLocaleString()} ج.م</span>;
      },
    },
    {
      title: 'طريقة الدفع',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (m: string) => <Tag>{m}</Tag>,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'الإجراءات المالية',
      key: 'actions',
      render: (_: any, record: any) => {
        const rem = Number(record.total) - Number(record.paid);
        return (
          <Space>
            {rem > 0 && (
              <Button size="small" type="primary" icon={<CreditCardOutlined />} onClick={() => openPayModal(record)}>
                سداد
              </Button>
            )}
            <Button size="small" icon={<PrinterOutlined />} onClick={() => openPreviewModal(record)}>
              معاينة وطباعة
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            الفوترة والحسابات الطبية (Billing & Invoices)
          </Title>
          <Text type="secondary">إصدار مطالبات الخدمات الطبية، تحصيل الدفعات، والربط المحاسبي</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setCreateModalVisible(true)}>
          إصدار فاتورة جديدة
        </Button>
      </div>

      <Card bordered={false}>
        <Table dataSource={invoices} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        title="إصدار فاتورة علاجية جديدة"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreateInvoice}
        okText="إصدار الفاتورة"
        cancelText="إلغاء"
        width={680}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="patientId" label="المريض" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select showSearch placeholder="اختر المريض">
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullNameAr} ({p.mrn})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="description" label="بند الخدمة الطبية" rules={[{ required: true }]}>
                <Input placeholder="مثال: كشف عيادة استشاري، عملية جراحية، إقامة..." />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="category" label="التصنيف المالي" initialValue="كشوفات">
                <Select>
                  <Option value="كشوفات">كشوفات وعيادات</Option>
                  <Option value="عمليات">عمليات جراحية</Option>
                  <Option value="إقامة">إقامة وأسرّة</Option>
                  <Option value="معمل">تحاليل طبية</Option>
                  <Option value="أشعة">أشعة وتصوير</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="unitPrice" label="سعر الوحدة (ج.م)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="الكمية" initialValue={1}>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount" label="خصم (ج.م)" initialValue={0}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="paymentMethod" label="طريقة السداد المتوقعة" initialValue="CASH">
            <Select>
              <Option value="CASH">نقدي (Cash)</Option>
              <Option value="CARD">بطاقة بنكية / فيزا (Card)</Option>
              <Option value="INSURANCE">تأمين صحي / تعاقدات (Insurance)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="ملاحظات الفاتورة">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Pay Modal */}
      <Modal
        title={`تحصيل دفعة مالية - فاتورة رقم (${selectedInvoice?.invoiceNumber})`}
        open={payModalVisible}
        onCancel={() => setPayModalVisible(false)}
        onOk={handleConfirmPay}
        okText="تأكيد التحصيل"
        cancelText="إلغاء"
      >
        <p>المريض: <strong>{selectedInvoice?.patient?.fullNameAr}</strong></p>
        <p>إجمالي الفاتورة: <strong>{selectedInvoice?.total?.toLocaleString()} ج.م</strong> | المسدد سابقاً: <strong>{selectedInvoice?.paid?.toLocaleString()} ج.م</strong></p>

        <Form layout="vertical">
          <Form.Item label="المبلغ المراد تحصيله (ج.م)" required>
            <InputNumber
              style={{ width: '100%' }}
              value={payAmount}
              onChange={(v) => setPayAmount(v || 0)}
              min={1}
            />
          </Form.Item>

          <Form.Item label="طريقة الدفع" required>
            <Select value={payMethod} onChange={setPayMethod}>
              <Option value="CASH">نقدي (Cash)</Option>
              <Option value="CARD">بطاقة بنكية (POS / Visa / Mastercard)</Option>
              <Option value="INSURANCE">تأمين طبي (Insurance)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="رقم إيصال الدفع / مرجع العملية">
            <Input
              value={payRef}
              onChange={(e) => setPayRef(e.target.value)}
              placeholder="مثال: رقم إيصال الـ POS أو رقم الشيك..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Print Preview Modal */}
      <Modal
        title="معاينة الفاتورة الرسمية للطباعة"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            إغلاق
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            طباعة الفاتورة
          </Button>,
        ]}
        width={720}
      >
        {selectedInvoice && (
          <div style={{ padding: 20, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1890ff', paddingBottom: 16 }}>
              <div>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  {hospitalSettings.nameAr}
                </Title>
                <Text type="secondary">{hospitalSettings.address} | هاتف: {hospitalSettings.phone} | الخط الساخن: {hospitalSettings.hotline}</Text>
              </div>
              <div style={{ textAlign: 'left' }}>
                <Title level={4} style={{ margin: 0 }}>
                  فاتورة علاجية
                </Title>
                <Tag color="blue">{selectedInvoice.invoiceNumber}</Tag>
              </div>
            </div>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text><strong>اسم المريض: </strong>{selectedInvoice.patient?.fullNameAr}</Text>
                <br />
                <Text><strong>رقم الملف (MRN): </strong>{selectedInvoice.patient?.mrn}</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Text><strong>تاريخ الإصدار: </strong>{new Date(selectedInvoice.createdAt).toLocaleDateString('ar-EG')}</Text>
                <br />
                <Text><strong>حالة السداد: </strong><StatusBadge status={selectedInvoice.status} /></Text>
              </Col>
            </Row>

            <Divider />

            <Table
              dataSource={selectedInvoice.items}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: 'البند الطبي / الخدمة', dataIndex: 'description', key: 'desc' },
                { title: 'الكمية', dataIndex: 'quantity', key: 'qty' },
                { title: 'سعر الوحدة', dataIndex: 'unitPrice', key: 'price', render: (v: number) => `${v.toLocaleString()} ج.م` },
                { title: 'الإجمالي', dataIndex: 'total', key: 'tot', render: (v: number) => `${v.toLocaleString()} ج.م` },
              ]}
            />

            <div style={{ marginTop: 20, textAlign: 'left' }}>
              <Paragraph style={{ margin: '4px 0' }}>الإجمالي الفرعي: <strong>{selectedInvoice.subtotal?.toLocaleString()} ج.م</strong></Paragraph>
              <Paragraph style={{ margin: '4px 0' }}>الخصم: <strong>{selectedInvoice.discount?.toLocaleString()} ج.م</strong></Paragraph>
              <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                الصافي المطلوب: {selectedInvoice.total?.toLocaleString()} ج.م
              </Title>
              <Text type="success"><strong>المدفوع: </strong>{selectedInvoice.paid?.toLocaleString()} ج.م</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
