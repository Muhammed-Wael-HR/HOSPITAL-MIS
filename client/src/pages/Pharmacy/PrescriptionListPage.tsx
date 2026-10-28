import React from 'react';
import { Card, Table, Button, Tag, Space, Typography, message } from 'antd';
import { ShopOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text } = Typography;

export const PrescriptionListPage: React.FC = () => {
  const navigate = useNavigate();
  const prescriptions = useHospitalStore((state) => state.prescriptions);
  const dispensePrescription = useHospitalStore((state) => state.dispensePrescription);

  const handleDispense = (id: number) => {
    dispensePrescription(id);
    message.success('تم صرف الروشتة وخصم الكميات من رصيد الصيدلية آلياً');
  };

  const columns = [
    {
      title: 'رقم الروشتة',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Tag color="blue">RX-{id}</Tag>,
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
      title: 'الطبيب الكاتب',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
    },
    {
      title: 'تاريخ الوصفة',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      title: 'حالة الصرف',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'إجراءات الصيدلية',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status !== 'DISPENSED' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleDispense(record.id)}
            >
              صرف الأدوية وخصم المخزون
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
            الروشتات وأوامر الصرف الإلكترونية (CPOE & E-Prescriptions)
          </Title>
          <Text type="secondary">أوامر صرف الأدوية الواردة من العيادات والأقسام الداخلية والصرف الآلي</Text>
        </div>

        <Button onClick={() => navigate('/pharmacy')}>سجل الأدوية والمخازن</Button>
      </div>

      <Card bordered={false}>
        <Table
          dataSource={prescriptions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ background: '#fafafa', padding: 12, borderRadius: 6 }}>
                <Table
                  dataSource={record.items}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'اسم الصنف الدوائي', dataIndex: ['medication', 'tradeName'], key: 'trade' },
                    { title: 'الجرعة', dataIndex: 'dosage', key: 'dosage' },
                    { title: 'التكرار', dataIndex: 'frequency', key: 'freq' },
                    { title: 'المدة المقررة', dataIndex: 'duration', key: 'dur' },
                    { title: 'الكمية المطلوبة', dataIndex: 'quantity', key: 'qty' },
                    {
                      title: 'تم الصرف',
                      dataIndex: 'dispensed',
                      key: 'disp',
                      render: (d: boolean) => (d ? <Tag color="success">نعم</Tag> : <Tag color="warning">لا</Tag>),
                    },
                  ]}
                />
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};
