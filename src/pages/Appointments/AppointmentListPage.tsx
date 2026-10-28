import React, { useState } from 'react';
import { Card, Table, Button, Select, Space, Tag, Typography, Row, Col, Dropdown, message } from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { AppointmentFormModal } from './AppointmentFormModal';

const { Title, Text } = Typography;
const { Option } = Select;

export const AppointmentListPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');

  const appointments = useHospitalStore((state) => state.appointments);
  const doctors = useHospitalStore((state) => state.doctors);
  const updateStatus = useHospitalStore((state) => state.updateAppointmentStatus);

  const filteredAppointments = appointments.filter((app) => {
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchDoctor = doctorFilter === 'ALL' || app.doctorId.toString() === doctorFilter;
    return matchStatus && matchDoctor;
  });

  const handleStatusChange = (id: number, status: any) => {
    updateStatus(id, status);
    message.success('تم تحديث حالة الموعد');
  };

  const columns = [
    {
      title: 'رقم الموعد',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Tag color="blue">#{id}</Tag>,
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
      title: 'تاريخ وتوقيت الموعد',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (d: string) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {new Date(d).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      title: 'العيادة / الطبيب',
      dataIndex: ['doctor', 'employee', 'fullNameAr'],
      key: 'doctor',
      render: (name: string, record: any) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{record.doctor?.specialty}</div>
        </div>
      ),
    },
    {
      title: 'نوع الكشف',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => {
        switch (t) {
          case 'CONSULTATION':
            return <Tag color="cyan">كشف أول مرة</Tag>;
          case 'FOLLOW_UP':
            return <Tag color="geekblue">استشارة ومتابعة</Tag>;
          case 'EMERGENCY':
            return <Tag color="red">طوارئ</Tag>;
          default:
            return <Tag>{t}</Tag>;
        }
      },
    },
    {
      title: 'الحالة الحالية',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'ملاحظات',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes?: string) => notes || '-',
    },
    {
      title: 'تحديث الحالة',
      key: 'actions',
      render: (_: any, record: any) => {
        const items = [
          {
            key: 'IN_PROGRESS',
            icon: <PlayCircleOutlined style={{ color: '#1890ff' }} />,
            label: 'جاري الكشف الآن',
            onClick: () => handleStatusChange(record.id, 'IN_PROGRESS'),
          },
          {
            key: 'COMPLETED',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            label: 'اكتمل الكشف',
            onClick: () => handleStatusChange(record.id, 'COMPLETED'),
          },
          {
            key: 'CANCELLED',
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            label: 'إلغاء الموعد',
            onClick: () => handleStatusChange(record.id, 'CANCELLED'),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button size="small">تغيير الحالة</Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            إدارة المواعيد والعيادات الخارجية (Appointments Management)
          </Title>
          <Text type="secondary">جدولة حجوزات العيادات الخارجية ومتابعة تدفق غرف الكشف</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setModalVisible(true)}>
          حجز موعد جديد
        </Button>
      </div>

      <Card bordered={false}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="تصفية حسب الحالة"
            >
              <Option value="ALL">كافة الحالات</Option>
              <Option value="SCHEDULED">مجدول</Option>
              <Option value="WAITING">في الانتظار</Option>
              <Option value="IN_PROGRESS">جاري الكشف</Option>
              <Option value="COMPLETED">مكتمل</Option>
              <Option value="CANCELLED">ملغي</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              value={doctorFilter}
              onChange={setDoctorFilter}
              placeholder="تصفية حسب الطبيب"
            >
              <Option value="ALL">كافة الأطباء والعيادات</Option>
              {doctors.map((d) => (
                <Option key={d.id} value={d.id.toString()}>
                  {d.employee?.fullNameAr} ({d.specialty})
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table dataSource={filteredAppointments} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      <AppointmentFormModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
};
