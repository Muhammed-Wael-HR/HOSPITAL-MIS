import React, { useState } from 'react';
import { Card, Table, Tabs, Tag, Space, Typography, Button, Modal, Form, Input, Select, InputNumber, Row, Col, message } from 'antd';
import { TeamOutlined, UserAddOutlined, IdcardOutlined, ScheduleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useHospitalStore } from '../../mockData/mockStore';

const { Title, Text } = Typography;
const { Option } = Select;

export const HRPage: React.FC = () => {
  const employees = useHospitalStore((state) => state.employees);
  const doctors = useHospitalStore((state) => state.doctors);

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddEmployee = async () => {
    try {
      const values = await form.validateFields();
      message.success(`تم تسجيل الموظف (${values.fullNameAr}) بنجاح وإضافته للكادر الطبي`);
      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const employeeColumns = [
    {
      title: 'الاسم الكامل',
      dataIndex: 'fullNameAr',
      key: 'name',
      render: (name: string, r: any) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{r.fullNameEn}</div>
        </div>
      ),
    },
    { title: 'المسمى الوظيفي', dataIndex: 'position', key: 'pos' },
    { title: 'القسم', dataIndex: 'departmentName', key: 'dept' },
    { title: 'رقم الهاتف', dataIndex: 'phone', key: 'phone', render: (p?: string) => <span dir="ltr">{p || '-'}</span> },
    { title: 'البريد المؤسسي', dataIndex: 'email', key: 'email' },
    {
      title: 'الراتب الأساسي',
      dataIndex: 'salary',
      key: 'salary',
      render: (s?: number) => (s ? `${s.toLocaleString()} ج.م` : '-'),
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'active',
      render: (a: boolean) => (a ? <Tag color="success">على رأس العمل</Tag> : <Tag color="default">إجازة</Tag>),
    },
  ];

  const doctorColumns = [
    {
      title: 'اسم الطبيب',
      dataIndex: ['employee', 'fullNameAr'],
      key: 'docName',
      render: (name: string, r: any) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{r.employee?.fullNameEn}</div>
        </div>
      ),
    },
    { title: 'التخصص الدقيق', dataIndex: 'specialty', key: 'spec' },
    {
      title: 'رقم ترخيص مزاولة المهنة (نقابة الأطباء)',
      dataIndex: 'licenseNumber',
      key: 'lic',
      render: (lic?: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{lic || '-'}</Tag>,
    },
    {
      title: 'قيمة كشف العيادة',
      dataIndex: 'consultationFee',
      key: 'fee',
      render: (fee?: number) => `${fee || 0} ج.م`,
    },
    {
      title: 'القسم التابع له',
      dataIndex: ['employee', 'departmentName'],
      key: 'dept',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            إدارة الموارد البشرية والكوادر الطبية (Medical Staff & HR)
          </Title>
          <Text type="secondary">قاعدة بيانات الأطباء والاستشاريين، هيئة التمريض، والإداريين وجداول المناوبات</Text>
        </div>

        <Button type="primary" icon={<UserAddOutlined />} size="large" onClick={() => setModalVisible(true)}>
          إضافة موظف / طبيب جديد
        </Button>
      </div>

      <Card bordered={false}>
        <Tabs
          defaultActiveKey="doctors"
          items={[
            {
              key: 'doctors',
              label: (
                <span>
                  <IdcardOutlined /> الأطباء والاستشاريون ({doctors.length})
                </span>
              ),
              children: <Table dataSource={doctors} columns={doctorColumns} rowKey="id" pagination={false} />,
            },
            {
              key: 'employees',
              label: (
                <span>
                  <TeamOutlined /> كافة الكوادر والموظفين ({employees.length})
                </span>
              ),
              children: <Table dataSource={employees} columns={employeeColumns} rowKey="id" pagination={false} />,
            },
            {
              key: 'shifts',
              label: (
                <span>
                  <ScheduleOutlined /> جدول النوبتجيات والمناوبات
                </span>
              ),
              children: (
                <div style={{ padding: 16 }}>
                  <Title level={5}>جدول نوبتجيات الطوارئ والعناية المركزة لهذا الأسبوع:</Title>
                  <Table
                    dataSource={[
                      { day: 'السبت', shift: 'صباحي (8 ص - 4 م)', doc: 'د. طارق المنشاوي', nurse: 'هيئة تمريض أ' },
                      { day: 'السبت', shift: 'مسائي (4 م - 12 ص)', doc: 'د. أحمد سعيد', nurse: 'هيئة تمريض ب' },
                      { day: 'الأحد', shift: 'صباحي (8 ص - 4 م)', doc: 'د. منى إبراهيم', nurse: 'هيئة تمريض أ' },
                      { day: 'الأحد', shift: 'مسائي (4 م - 12 ص)', doc: 'د. سارة الشريف', nurse: 'هيئة تمريض ج' },
                    ]}
                    columns={[
                      { title: 'اليوم', dataIndex: 'day', key: 'day' },
                      { title: 'الوردية (Shift)', dataIndex: 'shift', key: 'shift' },
                      { title: 'الطبيب المسؤول', dataIndex: 'doc', key: 'doc' },
                      { title: 'طاقم التمريض', dataIndex: 'nurse', key: 'nurse' },
                    ]}
                    pagination={false}
                    rowKey="day"
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Add Employee Modal */}
      <Modal
        title="تسجيل موظف أو كادر طبي جديد"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddEmployee}
        okText="تسجيل الموظف"
        cancelText="إلغاء"
        width={640}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullNameAr" label="الاسم الكامل بالعربية" rules={[{ required: true }]}>
                <Input placeholder="مثال: د. حسام فتحي النجار" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fullNameEn" label="الاسم الكامل بالإنجليزية">
                <Input placeholder="Dr. Hossam Fathy" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="position" label="المسمى الوظيفي" rules={[{ required: true }]}>
                <Input placeholder="أخصائي جراحة عامة / ممرض أول / موظف استقبال..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="departmentName" label="القسم التابع له" rules={[{ required: true }]}>
                <Select placeholder="اختر القسم">
                  <Option value="قسم الباطنة العامة والسكري">قسم الباطنة العامة والسكري</Option>
                  <Option value="قسم جراحة العظام والعمود الفقري">قسم جراحة العظام والعمود الفقري</Option>
                  <Option value="العناية المركزة (ICU)">العناية المركزة (ICU)</Option>
                  <Option value="المختبر والتحاليل الطبية">المختبر والتحاليل الطبية</Option>
                  <Option value="الأشعة التشخيصية والتداخلية">الأشعة التشخيصية والتداخلية</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="رقم الهاتف">
                <Input placeholder="010XXXXXXXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salary" label="الراتب الشهري (ج.م)">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
