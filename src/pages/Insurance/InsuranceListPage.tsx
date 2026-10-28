import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Select, InputNumber, Row, Col, message } from 'antd';
import { SafetyCertificateOutlined, PlusOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text } = Typography;
const { Option } = Select;

export const InsuranceListPage: React.FC = () => {
  const insuranceCompanies = useHospitalStore((state) => state.insuranceCompanies);
  const claims = useHospitalStore((state) => state.claims);
  const invoices = useHospitalStore((state) => state.invoices);
  const submitClaim = useHospitalStore((state) => state.submitClaim);
  const updateClaimStatus = useHospitalStore((state) => state.updateClaimStatus);

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateClaim = async () => {
    try {
      const values = await form.validateFields();
      submitClaim(values.invoiceId, values.companyId, values.amount);
      message.success('تم رفع مطالبة التأمين الطبي بنجاح');
      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = (claimId: number, amount: number) => {
    updateClaimStatus(claimId, 'APPROVED', amount);
    message.success('تمت الموافقة على مطالبة التأمين وتسجيلها كمعتمدة');
  };

  const companyColumns = [
    { title: 'اسم شركة التأمين', dataIndex: 'nameAr', key: 'name' },
    { title: 'الاسم بالإنجليزية', dataIndex: 'nameEn', key: 'nameEn' },
    { title: 'الخط الساخن', dataIndex: 'phone', key: 'phone' },
    { title: 'مسؤول التعاقدات', dataIndex: 'contactPerson', key: 'person' },
    {
      title: 'نسبة الخصم التعاقدي',
      dataIndex: 'discountRate',
      key: 'discount',
      render: (r?: number) => (r ? `${r}%` : '-'),
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'active',
      render: (a: boolean) => (a ? <Tag color="success">ساري التعاقد</Tag> : <Tag color="default">معلق</Tag>),
    },
  ];

  const claimColumns = [
    {
      title: 'رقم المطالبة',
      dataIndex: 'claimNumber',
      key: 'claimNumber',
      render: (num: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{num}</Tag>,
    },
    {
      title: 'شركة التأمين',
      dataIndex: ['company', 'nameAr'],
      key: 'company',
    },
    {
      title: 'رقم الفاتورة المرتبطة',
      dataIndex: 'invoiceId',
      key: 'invoice',
      render: (invId: number) => {
        const inv = invoices.find((i) => i.id === invId);
        return <Tag>{inv?.invoiceNumber || `#${invId}`}</Tag>;
      },
    },
    {
      title: 'المبلغ المطالب به',
      dataIndex: 'claimedAmount',
      key: 'claimed',
      render: (v: number) => `${v.toLocaleString()} ج.م`,
    },
    {
      title: 'المبلغ المعتمد',
      dataIndex: 'approvedAmount',
      key: 'approved',
      render: (v?: number) => (v ? `${v.toLocaleString()} ج.م` : 'قيد المراجعة'),
    },
    {
      title: 'حالة المطالبة',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'الإجراء',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status !== 'APPROVED' && (
            <Button
              type="primary"
              size="small"
              icon={<FileProtectOutlined />}
              onClick={() => handleApprove(record.id, record.claimedAmount)}
            >
              اعتماد الموافقة
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
            التأمين الصحي والتعاقدات الطبية (Insurance & Claims)
          </Title>
          <Text type="secondary">إدارة عقود شركات التأمين الخاصة (بوبا، أكسا، متلايف) ورفع ومتابعة المطالبات المالية</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setModalVisible(true)}>
          رفع مطالبة تأمين جديدة
        </Button>
      </div>

      <Card title="شركات التأمين والجهات المتعاقدة" bordered={false} style={{ marginBottom: 16 }}>
        <Table dataSource={insuranceCompanies} columns={companyColumns} rowKey="id" pagination={false} size="small" />
      </Card>

      <Card title="سجل مطالبات التأمين المرفوعة" bordered={false}>
        <Table dataSource={claims} columns={claimColumns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      {/* Submit Claim Modal */}
      <Modal
        title="رفع مطالبة تأمين صحي جديدة"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateClaim}
        okText="تقديم المطالبة"
        cancelText="إلغاء"
        width={560}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="companyId" label="شركة التأمين" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر شركة التأمين">
              {insuranceCompanies.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.nameAr}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="invoiceId" label="الفاتورة المراد مطالبتها" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select placeholder="اختر الفاتورة">
              {invoices.map((inv) => (
                <Option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - المريض: {inv.patient?.fullNameAr} ({inv.total} ج.م)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="المبلغ المطالب به (ج.م)" rules={[{ required: true, message: 'مطلوب' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
