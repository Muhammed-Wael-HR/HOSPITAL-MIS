import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Select, Input, Row, Col, Alert, message, InputNumber } from 'antd';
import { ShopOutlined, PlusOutlined, AlertOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';

const { Title, Text } = Typography;
const { Option } = Select;

export const MedicationListPage: React.FC = () => {
  const navigate = useNavigate();
  const medications = useHospitalStore((state) => state.medications);
  const addMedication = useHospitalStore((state) => state.addMedication);
  const updateStock = useHospitalStore((state) => state.updateStock);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<number | null>(null);
  const [stockChange, setStockChange] = useState<number>(50);

  const [form] = Form.useForm();

  const lowStockMeds = medications.filter((m) => m.currentStock <= m.minimumStock);

  const handleCreateMed = async () => {
    try {
      const values = await form.validateFields();
      addMedication(values);
      message.success('تمت إضافة الصنف الدوائي للمخزن بنجاح');
      form.resetFields();
      setAddModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = () => {
    if (selectedMedId) {
      updateStock(selectedMedId, stockChange);
      message.success('تم تحديث رصيد الصنف الدوائي بنجاح');
      setStockModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'كود الصنف',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag style={{ fontFamily: 'monospace' }}>{code}</Tag>,
    },
    {
      title: 'الاسم التجاري',
      dataIndex: 'tradeName',
      key: 'tradeName',
      render: (name: string, record: any) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{record.genericName}</div>
        </div>
      ),
    },
    {
      title: 'الشكل الصيدلي',
      dataIndex: 'form',
      key: 'form',
      render: (f: string) => <Tag color="cyan">{f}</Tag>,
    },
    {
      title: 'الرصيد الحالي',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock: number, record: any) => {
        const isLow = stock <= record.minimumStock;
        return (
          <Space>
            <Text strong style={{ color: isLow ? '#cf1322' : '#389e0d', fontSize: 14 }}>
              {stock} وحدة
            </Text>
            {isLow && <Tag color="error">أقل من حد الطلب</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'حد الأمان (Min)',
      dataIndex: 'minimumStock',
      key: 'minimumStock',
      render: (min: number) => `${min} وحدة`,
    },
    {
      title: 'السعر للجمهور',
      dataIndex: 'price',
      key: 'price',
      render: (p: number) => `${p.toFixed(2)} ج.م`,
    },
    {
      title: 'تاريخ الصلاحية',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (d?: string) => d || '-',
    },
    {
      title: 'الرقابة الدوائية',
      dataIndex: 'isControlled',
      key: 'isControlled',
      render: (ctrl: boolean) =>
        ctrl ? <Tag color="magenta">جدول مخدرات</Tag> : <Tag color="default">عادي</Tag>,
    },
    {
      title: 'تعديل المخزون',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          size="small"
          onClick={() => {
            setSelectedMedId(record.id);
            setStockChange(50);
            setStockModalVisible(true);
          }}
        >
          توريد / صرف مخزن
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            الصيدلية الإكلينيكية والمخزون الدوائي (Pharmacy & Inventory)
          </Title>
          <Text type="secondary">كتالوج الأدوية، تتبع الأرصدة، تنبيهات الصلاحية وحد إعادة الطلب الدوائي</Text>
        </div>

        <Space>
          <Button icon={<ReconciliationOutlined />} onClick={() => navigate('/pharmacy/prescriptions')}>
            الروشتات وأوامر الصرف
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setAddModalVisible(true)}>
            إضافة صنف دوائي جديد
          </Button>
        </Space>
      </div>

      {lowStockMeds.length > 0 && (
        <Alert
          message={`تنبيه نقص المخزون الدوائي: يوجد ${lowStockMeds.length} صنف دون حد الأمان الطبي`}
          description={
            <div>
              الأصناف التي تحتاج لتوريد عاجل:{' '}
              {lowStockMeds.map((m) => (
                <Tag key={m.id} color="error" style={{ margin: '2px 4px' }}>
                  {m.tradeName} (المتبقي: {m.currentStock})
                </Tag>
              ))}
            </div>
          }
          type="warning"
          showIcon
          icon={<AlertOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card bordered={false}>
        <Table dataSource={medications} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      {/* Add Medication Modal */}
      <Modal
        title="إضافة صنف دوائي جديد"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleCreateMed}
        okText="حفظ وإضافة للمخزن"
        cancelText="إلغاء"
        width={680}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tradeName" label="الاسم التجاري (Trade Name)" rules={[{ required: true }]}>
                <Input placeholder="مثال: كونكور 5 مجم أقراص" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genericName" label="الاسم العلمي (Generic Name)" rules={[{ required: true }]}>
                <Input placeholder="مثال: Bisoprolol 5mg" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="form" label="الشكل الصيدلي" initialValue="TABLET">
                <Select>
                  <Option value="TABLET">أقراص (Tablet)</Option>
                  <Option value="CAPSULE">كبسولات (Capsule)</Option>
                  <Option value="INJECTION">حقن وأمبولات (Injection)</Option>
                  <Option value="SYRUP">شراب (Syrup)</Option>
                  <Option value="CREAM">كريم / مرهم (Cream)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="سعر الجمهور (ج.م)" initialValue={50}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="currentStock" label="الرصيد الابتدائي (وحدة)" initialValue={100}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minimumStock" label="حد الطلب الأدنى (Min Stock)" initialValue={20}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="التصنيف الدوائي" initialValue="أدوية عامة">
                <Input placeholder="مضادات حيوية، مسكنات، قلب وضغط..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        title="تعديل رصيد المخزن (توريد / تسوية مخزنية)"
        open={stockModalVisible}
        onCancel={() => setStockModalVisible(false)}
        onOk={handleUpdateStock}
        okText="تطبيق الحركة المخزنية"
        cancelText="إلغاء"
      >
        <p>حدد الكمية المراد إضافتها للرصيد (أو إدخال رقم سالب للخصم):</p>
        <InputNumber
          style={{ width: '100%' }}
          value={stockChange}
          onChange={(val) => setStockChange(val || 0)}
          placeholder="أدخل الكمية..."
        />
      </Modal>
    </div>
  );
};
