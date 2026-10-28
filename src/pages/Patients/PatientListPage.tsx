import React, { useState } from 'react';
import { Card, Table, Button, Input, Select, Space, Tag, Modal, Typography, Row, Col, Tooltip } from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types';
import { useHospitalStore } from '../../mockData/mockStore';
import { PatientFormModal } from './PatientFormModal';

const { Title, Text } = Typography;
const { Option } = Select;

export const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [bloodFilter, setBloodFilter] = useState<string>('ALL');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patients = useHospitalStore((state) => state.patients);
  const deletePatient = useHospitalStore((state) => state.deletePatient);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullNameAr.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchText.toLowerCase()) ||
      (patient.nationalId && patient.nationalId.includes(searchText)) ||
      (patient.phone && patient.phone.includes(searchText));

    const matchesGender = genderFilter === 'ALL' || patient.gender === genderFilter;
    const matchesBlood = bloodFilter === 'ALL' || patient.bloodType === bloodFilter;

    return matchesSearch && matchesGender && matchesBlood;
  });

  const handleDelete = (id: number, name: string) => {
    Modal.confirm({
      title: 'تأكيد حذف ملف المريض',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: `هل أنت متأكد من رغبتك في حذف ملف المريض (${name})؟ لن يتم حذف البيانات التاريخية المتعلقة بالفوترة أو التقارير.`,
      okText: 'نعم، حذف',
      okType: 'danger',
      cancelText: 'إلغاء',
      onOk: () => {
        deletePatient(id);
      },
    });
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'غير محدد';
    const birthYear = new Date(dobString).getFullYear();
    const currentYear = new Date().getFullYear();
    return `${currentYear - birthYear} سنة`;
  };

  const columns = [
    {
      title: 'رقم الملف (MRN)',
      dataIndex: 'mrn',
      key: 'mrn',
      render: (mrn: string, record: Patient) => (
        <a onClick={() => navigate(`/patients/${record.id}`)}>
          <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {mrn}
          </Tag>
        </a>
      ),
    },
    {
      title: 'اسم المريض',
      dataIndex: 'fullNameAr',
      key: 'fullNameAr',
      render: (name: string, record: Patient) => (
        <div>
          <a onClick={() => navigate(`/patients/${record.id}`)} style={{ fontWeight: 600, fontSize: 14 }}>
            {name}
          </a>
          {record.fullNameEn && (
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>{record.fullNameEn}</div>
          )}
        </div>
      ),
    },
    {
      title: 'الرقم القومي',
      dataIndex: 'nationalId',
      key: 'nationalId',
      render: (nid?: string) => <Text style={{ fontFamily: 'monospace' }}>{nid || '-'}</Text>,
    },
    {
      title: 'السن / النوع',
      key: 'ageGender',
      render: (_: any, record: Patient) => (
        <span>
          {calculateAge(record.dateOfBirth)} / {record.gender === 'MALE' ? 'ذكر' : 'أنثى'}
        </span>
      ),
    },
    {
      title: 'فصيلة الدم',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (bType?: string) => {
        if (!bType) return '-';
        const formatted = bType.replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
        return <Tag color="green">{formatted}</Tag>;
      },
    },
    {
      title: 'رقم الهاتف',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => <span dir="ltr">{phone || '-'}</span>,
    },
    {
      title: 'تنبيه الحساسية',
      dataIndex: 'allergies',
      key: 'allergies',
      render: (allergies?: string) => {
        if (!allergies || allergies === 'لا توجد' || allergies.includes('لا توجد')) {
          return <Tag color="default">لا توجد</Tag>;
        }
        return (
          <Tooltip title={allergies}>
            <Tag color="error" icon={<WarningOutlined />}>
              حساسية دوائية
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: any, record: Patient) => (
        <Space size="small">
          <Tooltip title="عرض الملف الطبي الشامل">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/patients/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="تعديل البيانات">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPatient(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="حذف الملف">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.fullNameAr)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            سجل المرضى والملفات الطبية (Patients Directory)
          </Title>
          <Text type="secondary">قاعدة بيانات المرضى المسجلين بالمستشفى والعيادات التخصصية</Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => {
            setSelectedPatient(null);
            setModalVisible(true);
          }}
        >
          تسجيل مريض جديد
        </Button>
      </div>

      <Card bordered={false}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={10}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="بحث بالاسم، رقم الملف (MRN)، الرقم القومي، أو الهاتف..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={12} sm={6}>
            <Select
              style={{ width: '100%' }}
              value={genderFilter}
              onChange={setGenderFilter}
              placeholder="تصفية حسب النوع"
            >
              <Option value="ALL">جميع الأنواع</Option>
              <Option value="MALE">ذكور فقط</Option>
              <Option value="FEMALE">إناث فقط</Option>
            </Select>
          </Col>

          <Col xs={12} sm={6}>
            <Select
              style={{ width: '100%' }}
              value={bloodFilter}
              onChange={setBloodFilter}
              placeholder="فصيلة الدم"
            >
              <Option value="ALL">كافة الفصائل</Option>
              <Option value="A_POSITIVE">A+</Option>
              <Option value="A_NEGATIVE">A-</Option>
              <Option value="B_POSITIVE">B+</Option>
              <Option value="B_NEGATIVE">B-</Option>
              <Option value="AB_POSITIVE">AB+</Option>
              <Option value="AB_NEGATIVE">AB-</Option>
              <Option value="O_POSITIVE">O+</Option>
              <Option value="O_NEGATIVE">O-</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={filteredPatients}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: (total) => `إجمالي المرضى: ${total}` }}
        />
      </Card>

      <PatientFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        patient={selectedPatient}
      />
    </div>
  );
};
