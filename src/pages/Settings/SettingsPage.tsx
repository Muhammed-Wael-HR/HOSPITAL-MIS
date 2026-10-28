import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  message,
  Alert,
  Modal,
  Popconfirm,
  Select,
} from 'antd';
import {
  SettingOutlined,
  MedicineBoxOutlined,
  SaveOutlined,
  ApiOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  ReloadOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useHospitalStore } from '../../mockData/mockStore';
import { useAppStore } from '../../store/appStore';
import { firebaseSync } from '../../services/firebaseSync';
import { Department } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const SettingsPage: React.FC = () => {
  const departments = useHospitalStore((state) => state.departments);
  const addDepartment = useHospitalStore((state) => state.addDepartment);
  const updateDepartment = useHospitalStore((state) => state.updateDepartment);
  const deleteDepartment = useHospitalStore((state) => state.deleteDepartment);

  const {
    hospitalSettings,
    setHospitalSettings,
    adminProfile,
    setAdminProfile,
  } = useAppStore();

  const [hospitalForm] = Form.useForm();
  const [adminForm] = Form.useForm();
  const [deptForm] = Form.useForm();

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Save hospital profile
  const handleSaveHospital = (values: any) => {
    setHospitalSettings(values);
    message.success('تم حفظ وتحديث بيانات المنشأة الطبية بنجاح وانعكست على كافة شاشات النظام فوراً!');
  };

  // Save admin profile
  const handleSaveAdmin = (values: any) => {
    setAdminProfile(values);
    message.success('تم تحديث بيانات المسؤول العام بنجاح');
  };

  // Open department modal for create or edit
  const openDeptModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      deptForm.setFieldsValue(dept);
    } else {
      setEditingDept(null);
      deptForm.resetFields();
      deptForm.setFieldsValue({ type: 'عيادات تخصصية', isActive: true });
    }
    setDeptModalVisible(true);
  };

  // Save department (create / update)
  const handleSaveDept = async () => {
    try {
      const values = await deptForm.validateFields();
      if (editingDept) {
        updateDepartment(editingDept.id, values);
        message.success(`تم تعديل بيانات قسم "${values.nameAr}" بنجاح`);
      } else {
        addDepartment(values);
        message.success(`تمت إضافة قسم "${values.nameAr}" بنجاح`);
      }
      setDeptModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete department
  const handleDeleteDept = (id: number, nameAr: string) => {
    deleteDepartment(id);
    message.success(`تم حذف قسم "${nameAr}" بنجاح`);
  };

  const departmentColumns = [
    {
      title: 'رقم القسم',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      render: (id: number) => <Tag color="geekblue">#{id}</Tag>,
    },
    {
      title: 'اسم القسم بالعربية',
      dataIndex: 'nameAr',
      key: 'ar',
      render: (n: string) => <Text strong>{n}</Text>,
    },
    {
      title: 'الاسم بالإنجليزية',
      dataIndex: 'nameEn',
      key: 'en',
    },
    {
      title: 'النوع الوظيفي',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: 'الوصف وملاحظات العمل',
      dataIndex: 'description',
      key: 'desc',
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'act',
      render: (a: boolean) => (a ? <Tag color="success">نشط ومفعل</Tag> : <Tag>معطل</Tag>),
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      width: 170,
      render: (_: any, record: Department) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openDeptModal(record)}
          >
            تعديل
          </Button>

          <Popconfirm
            title="حذف القسم الطبي"
            description={`هل أنت متأكد من رغبتك في حذف قسم "${record.nameAr}"؟`}
            onConfirm={() => handleDeleteDept(record.id, record.nameAr)}
            okText="نعم، حذف"
            cancelText="إلغاء"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              حذف
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            إعدادات النظام والتهيئة العامة (System Settings & Customization)
          </Title>
          <Text type="secondary">
            إدارة هوية المنشأة الطبية، الأقسام والعيادات، بيانات المدير العام، والربط الحكومي
          </Text>
        </div>
      </div>

      <Card bordered={false}>
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: 'بيانات المنشأة والمستشفى',
              children: (
                <Form
                  form={hospitalForm}
                  layout="vertical"
                  onFinish={handleSaveHospital}
                  initialValues={hospitalSettings}
                >
                  <Alert
                    message="تغيير فوري لاسم وهوية المستشفى"
                    description="أي تعديل في اسم المنشأة ينعكس فوراً ومباشرة على الهيدر، القائمة الجانبية، الفواتير، الأرشيف، وعنوان الصفحة."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="nameAr"
                        label="اسم المنشأة الطبية (بالعربية)"
                        rules={[{ required: true, message: 'مطلوب إدخال اسم المستشفى' }]}
                      >
                        <Input placeholder="مثال: مستشفى النيل التخصصي" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="nameEn" label="اسم المنشأة (بالإنجليزية)">
                        <Input placeholder="مثال: Nile Specialized Hospital" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="taxNumber" label="رقم التسجيل الضريبي (الفاتورة الإلكترونية)">
                        <Input style={{ fontFamily: 'monospace' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="commercialReg" label="رقم السجل التجاري">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="gaharCode" label="كود الاعتماد الصحي (GAHAR)">
                        <Input style={{ fontFamily: 'monospace' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="phone" label="هاتف المستشفى">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="hotline" label="الخط الساخن">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="email" label="البريد الإلكتروني الرسمي">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="address" label="العنوان الجغرافي">
                    <Input />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                    حفظ وتحديث بيانات المنشأة فورا
                  </Button>
                </Form>
              ),
            },
            {
              key: 'departments',
              label: `الأقسام والعيادات الطبية (${departments.length})`,
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <Text type="secondary">
                      يمكنك هنا إضافة أقسام جديدة أو تعديل وحذف الأقسام القائمة مع تحديث فوري للنظام
                    </Text>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => openDeptModal()}
                      size="middle"
                    >
                      + إضافة قسم طبي جديد
                    </Button>
                  </div>
                  <Table
                    dataSource={departments}
                    columns={departmentColumns}
                    rowKey="id"
                    scroll={{ x: 700 }}
                    pagination={{ pageSize: 8 }}
                  />
                </div>
              ),
            },
            {
              key: 'adminProfile',
              label: 'بيانات المدير والحساب (Admin Profile)',
              children: (
                <Form
                  form={adminForm}
                  layout="vertical"
                  onFinish={handleSaveAdmin}
                  initialValues={adminProfile}
                  style={{ maxWidth: 650 }}
                >
                  <Alert
                    message="تخصيص بيانات المسؤول العام للنظام"
                    description="الاسم الظاهر والمسمى الوظيفي يتم عرضه في شريط المهام العلوي وسجلات التدقيق والأمان."
                    type="success"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />

                  <Form.Item
                    name="displayName"
                    label="الاسم الظاهر للمدير / المسؤول"
                    rules={[{ required: true, message: 'يرجى إدخال اسم المدير' }]}
                  >
                    <Input prefix={<UserOutlined />} size="large" />
                  </Form.Item>

                  <Form.Item
                    name="position"
                    label="المسمى الوظيفي"
                    rules={[{ required: true, message: 'يرجى إدخال المسمى الوظيفي' }]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="phone" label="رقم الهاتف">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="email" label="البريد الإلكتروني">
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                    حفظ بيانات المسؤول
                  </Button>
                </Form>
              ),
            },
            {
              key: 'integrations',
              label: (
                <span>
                  <ApiOutlined /> الربط الحكومي والتحول الرقمي بمصر
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message="جاهزية الربط مع المنظومات الرقمية لجمهورية مصر العربية"
                    description="السيستم مهيأ بواجهات برمجة التطبيقات (APIs) اللازمة للتوافق مع أحدث التشريعات المصرية:"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Card
                        title="منظومة الفاتورة والإيصال الإلكتروني"
                        size="small"
                        extra={<Tag color="success">متصل (Connected)</Tag>}
                      >
                        <Paragraph>مصلحة الضرائب المصرية (ETA API v1.0)</Paragraph>
                        <Text type="secondary">
                          إرسال وتشفير الفواتير الطبية لحظياً بختم الـ e-Token المعتمد.
                        </Text>
                      </Card>
                    </Col>

                    <Col xs={24} md={8}>
                      <Card
                        title="التتبع الدوائي (Track & Trace)"
                        size="small"
                        extra={<Tag color="success">متصل (Active)</Tag>}
                      >
                        <Paragraph>هيئة الدواء المصرية (EDA)</Paragraph>
                        <Text type="secondary">
                          قراءة الباركود ثنائي الأبعاد (2D DataMatrix) لصرف الأدوية المسجلة ومنع الغش.
                        </Text>
                      </Card>
                    </Col>

                    <Col xs={24} md={8}>
                      <Card
                        title="منظومة التأمين الصحي الشامل"
                        size="small"
                        extra={<Tag color="processing">جاهز للاعتماد</Tag>}
                      >
                        <Paragraph>الهيئة العامة للاعتماد والرقابة الصحية (GAHAR)</Paragraph>
                        <Text type="secondary">
                          مطابقة المعايير الطبية لتبادل بيانات المرضى والملف الصحي الموحد.
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'cloudDb',
              label: (
                <span>
                  <CloudServerOutlined /> قاعدة البيانات السحابية (Firebase Cloud)
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message="قاعدة البيانات السحابية المباشرة (Real-Time Cloud Firestore)"
                    description="تم ربط النظام بقاعدة بيانات Firebase السحابية الحية، تماماً كمعمارية نظام HR. يتم مزامنة المرضى، الأسرّة، الفواتير، الأقسام، والإعدادات تلقائياً عبر الأجهزة في الوقت الفعلي."
                    type="success"
                    showIcon
                    style={{ marginBottom: 20 }}
                  />

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Card title="حالة الاتصال السحابي (Live Status)" size="small">
                        <Paragraph>
                          <strong>المزود السحابي: </strong>
                          <Tag color="orange">Google Firebase Firestore</Tag>
                        </Paragraph>
                        <Paragraph>
                          <strong>مشروع السحابة: </strong>
                          <Tag color="blue">emak-hr (مجموعة hospital_mis)</Tag>
                        </Paragraph>
                        <Paragraph>
                          <strong>المزامنة اللحظية: </strong>
                          <Tag color="success">مفعلة تلقائياً (Realtime onSnapshot)</Tag>
                        </Paragraph>
                        <Paragraph>
                          <strong>الاستجابة دون إنترنت: </strong>
                          <Tag color="purple">Offline Fallback مدمج</Tag>
                        </Paragraph>

                        <div style={{ marginTop: 16 }}>
                          <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={async () => {
                              await firebaseSync.pushLocalToCloud();
                              message.success('تمت مزامنة ورفع كافة بيانات النظام إلى السحابة بنجاح!');
                            }}
                          >
                            مزامنة ورفع البيانات الحالية للسحابة فوراً
                          </Button>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={12}>
                      <Card title="كيف تعمل المزامنة السحابية مع Vercel؟" size="small">
                        <Paragraph>
                          1. <strong>المزامنة الفورية: </strong>أي مريض جديد، كشف، حجز سرير، أو تعديل في الأقسام واسم المنشأة يُحفظ في السحابة فوراً.
                        </Paragraph>
                        <Paragraph>
                          2. <strong>تحديث شاشات متعددة: </strong>إذا فتحت النظام على هاتفك المحمول والدكتور فتحه من لابتوبه عبر رابط Vercel، تظهر التعديلات لحظياً لدى الطرفين بدون Refresh.
                        </Paragraph>
                        <Paragraph>
                          3. <strong>الأمان والاستقلالية: </strong>بيانات المستشفى محفوظة في مساحة منفصلة (hospital_mis) لضمان عدم التعارض مع أي بيانات أخرى.
                        </Paragraph>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Add / Edit Department Modal */}
      <Modal
        title={editingDept ? `تعديل بيانات القسم: ${editingDept.nameAr}` : 'إضافة قسم طبي / عيادة جديدة'}
        open={deptModalVisible}
        onCancel={() => setDeptModalVisible(false)}
        onOk={handleSaveDept}
        okText={editingDept ? 'تحديث القسم' : 'إضافة القسم'}
        cancelText="إلغاء"
      >
        <Form form={deptForm} layout="vertical">
          <Form.Item
            name="nameAr"
            label="اسم القسم بالعربية"
            rules={[{ required: true, message: 'مطلوب اسم القسم بالعربية' }]}
          >
            <Input placeholder="مثال: قسم طب وجراحة العيون" />
          </Form.Item>

          <Form.Item name="nameEn" label="اسم القسم بالإنجليزية">
            <Input placeholder="مثال: Ophthalmology Department" />
          </Form.Item>

          <Form.Item name="type" label="النوع الوظيفي للقسم" rules={[{ required: true }]}>
            <Select>
              <Option value="عيادات تخصصية">عيادات خارجية وتخصصية</Option>
              <Option value="أقسام حرجة ورعاية">أقسام حرجة وعناية مركزة</Option>
              <Option value="أقسام تنويم وأجنحة">أقسام تنويم داخلي وأجنحة</Option>
              <Option value="تشخيصي ومعملي">تشخيصي ومختبرات</Option>
              <Option value="صيدلي وعلاجي">صيدلي ومستودعات</Option>
              <Option value="طوارئ وإسعاف">طوارئ وإسعاف عاجل</Option>
              <Option value="إداري ومالي">إداري ومالي</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="وصف القسم وتخصصاته">
            <Input.TextArea rows={3} placeholder="نبذة عن الخدمات الطبية المقدمة بالقسم..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
