import React from 'react';
import { Card, Table, Button, Tag, Space, Typography } from 'antd';
import { MedicineBoxOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

const { Title, Text } = Typography;

export const AdmissionListPage: React.FC = () => {
  const navigate = useNavigate();
  const admissions = useHospitalStore((state) => state.admissions);

  const columns = [
    {
      title: 'رقم الإقامة',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Tag color="blue">ADM-{id}</Tag>,
    },
    {
      title: 'اسم المريض',
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
      title: 'السرير المخصص',
      dataIndex: ['bed', 'bedNumber'],
      key: 'bed',
      render: (bedNum?: string) => <Tag color="purple">{bedNum || 'غير محدد'}</Tag>,
    },
    {
      title: 'الطبيب المشرف',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
    },
    {
      title: 'تاريخ الدخول',
      dataIndex: 'admittedAt',
      key: 'admittedAt',
      render: (d: string) => new Date(d).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      title: 'تاريخ الخروج',
      dataIndex: 'dischargedAt',
      key: 'dischargedAt',
      render: (d?: string) => (d ? new Date(d).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }) : 'مقيم حالياً'),
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
    {
      title: 'سبب التنويم',
      dataIndex: 'admissionReason',
      key: 'admissionReason',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            سجلات التنويم الداخلي (Inpatient Admissions Log)
          </Title>
          <Text type="secondary">قائمة بجميع حركات دخول وخروج المرضى من الأقسام الداخلية</Text>
        </div>

        <Button type="primary" icon={<AppstoreOutlined />} onClick={() => navigate('/admissions')}>
          العودة لخريطة الأسرّة
        </Button>
      </div>

      <Card bordered={false}>
        <Table dataSource={admissions} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>
    </div>
  );
};
