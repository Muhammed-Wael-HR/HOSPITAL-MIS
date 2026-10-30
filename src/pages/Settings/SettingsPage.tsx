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
  Checkbox,
  Switch,
  Tooltip,
  Divider,
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
  TeamOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  LockOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useHospitalStore } from '../../mockData/mockStore';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { firebaseSync } from '../../services/firebaseSync';
import { Department, User, ALL_SYSTEM_MODULES } from '../../types';
import { DatabaseExportModal } from '../../components/DatabaseExport/DatabaseExportModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const SettingsPage: React.FC = () => {
  const departments = useHospitalStore((state) => state.departments);
  const addDepartment = useHospitalStore((state) => state.addDepartment);
  const updateDepartment = useHospitalStore((state) => state.updateDepartment);
  const deleteDepartment = useHospitalStore((state) => state.deleteDepartment);

  const users = useHospitalStore((state) => state.users);
  const addUser = useHospitalStore((state) => state.addUser);
  const updateUser = useHospitalStore((state) => state.updateUser);
  const deleteUser = useHospitalStore((state) => state.deleteUser);
  const toggleUserStatus = useHospitalStore((state) => state.toggleUserStatus);

  const {
    hospitalSettings,
    setHospitalSettings,
    adminProfile,
    setAdminProfile,
  } = useAppStore();

  const [hospitalForm] = Form.useForm();
  const [adminForm] = Form.useForm();
  const [deptForm] = Form.useForm();
  const [userForm] = Form.useForm();

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Save hospital profile
  const handleSaveHospital = (values: any) => {
    setHospitalSettings(values);
    message.success('تم حفظ وتحديث بيانات المنشأة الطبية بنجاح وانعكست على كافة شاشات النظام فوراً!');
  };

  // Save admin profile
  const handleSaveAdmin = (values: any) => {
    setAdminProfile(values);
    // Update active logged in user
    useAuthStore.getState().updateCurrentUser({
      fullName: values.displayName,
    });
    // Update super admin in users list
    const superAdmin = users.find((u) => u.isSuperAdmin);
    if (superAdmin) {
      updateUser(superAdmin.id, {
        fullName: values.displayName,
      });
    }
    message.success('تم تحديث بيانات المسؤول العام بنجاح وظهرت فوراً في الشريط العلوي وسجلات النظام!');
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

  const handleApplyPreset = (preset: 'ALL' | 'RECEPTION' | 'BILLING' | 'PHARMACY' | 'DOCTOR' | 'ARCHIVE') => {
    let perms: string[] = [];
    switch (preset) {
      case 'ALL':
        perms = ALL_SYSTEM_MODULES.map((m) => m.key);
        break;
      case 'RECEPTION':
        perms = ['dashboard', 'patients', 'appointments', 'admissions'];
        break;
      case 'BILLING':
        perms = ['dashboard', 'billing', 'insurance', 'reports'];
        break;
      case 'PHARMACY':
        perms = ['dashboard', 'pharmacy', 'reports'];
        break;
      case 'DOCTOR':
        perms = ['dashboard', 'patients', 'appointments', 'admissions', 'medical_records', 'laboratory', 'radiology'];
        break;
      case 'ARCHIVE':
        perms = ['dashboard', 'archive', 'patients'];
        break;
    }
    setSelectedPermissions(perms);
    userForm.setFieldsValue({ permissions: perms });
    message.info('تم تطبيق قالب الصلاحيات المحدد بنجاح');
  };

  const openUserModal = (targetUser?: User) => {
    if (targetUser) {
      setEditingUser(targetUser);
      setSelectedPermissions(targetUser.permissions || []);
      userForm.setFieldsValue({
        username: targetUser.username,
        fullName: targetUser.fullName,
        password: targetUser.password || '',
        role: targetUser.role,
        phone: targetUser.phone,
        notes: targetUser.notes,
        isActive: targetUser.isActive,
        permissions: targetUser.permissions || [],
      });
    } else {
      setEditingUser(null);
      const defaultPerms = ['dashboard', 'patients'];
      setSelectedPermissions(defaultPerms);
      userForm.resetFields();
      userForm.setFieldsValue({
        role: 'ADMIN',
        isActive: true,
        permissions: defaultPerms,
      });
    }
    setUserModalVisible(true);
  };

  const handleSaveUser = async () => {
    try {
      const values = await userForm.validateFields();
      const perms = selectedPermissions.length > 0 ? selectedPermissions : ['dashboard'];

      if (editingUser) {
        updateUser(editingUser.id, {
          username: values.username,
          fullName: values.fullName,
          password: values.password || editingUser.password,
          role: values.role,
          phone: values.phone,
          notes: values.notes,
          isActive: values.isActive,
          permissions: perms,
        });
        message.success(`تم تحديث بيانات وصلاحيات المسؤول "${values.fullName}" بنجاح!`);
      } else {
        addUser({
          username: values.username,
          fullName: values.fullName,
          password: values.password || '123456',
          role: values.role || 'ADMIN',
          phone: values.phone,
          notes: values.notes,
          isActive: values.isActive !== undefined ? values.isActive : true,
          permissions: perms,
        });
        message.success(`تم إنشاء حساب المسؤول الجديد "${values.fullName}" بنجاح! يمكنه الآن تسجيل الدخول مباشرة.`);
      }
      setUserModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const userColumns = [
    {
      title: 'اسم الدخول (Username)',
      dataIndex: 'username',
      key: 'username',
      render: (u: string, record: User) => (
        <Space>
          {record.isSuperAdmin ? (
            <CrownOutlined style={{ color: '#faad14', fontSize: 16 }} />
          ) : (
            <UserOutlined style={{ color: '#1890ff' }} />
          )}
          <Text strong style={{ fontFamily: 'monospace', fontSize: 14 }}>
            {u}
          </Text>
          {record.isSuperAdmin && <Tag color="gold">المسؤول الأساسي</Tag>}
        </Space>
      ),
    },
    {
      title: 'الاسم الكامل للمسؤول',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'كلمة المرور',
      dataIndex: 'password',
      key: 'password',
      render: (pass: string) => (
        <Tag color="purple" style={{ fontFamily: 'monospace', fontSize: 12 }}>
          <KeyOutlined style={{ marginRight: 4 }} />
          {pass || 'password123'}
        </Tag>
      ),
    },
    {
      title: 'الدور الوظيفي',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: User) => (
        <Tag color={record.isSuperAdmin ? 'red' : record.role === 'DOCTOR' ? 'cyan' : record.role === 'ACCOUNTANT' ? 'green' : 'blue'}>
          {record.isSuperAdmin ? 'المدير العام (Super Admin)' : role}
        </Tag>
      ),
    },
    {
      title: 'الأقسام والصلاحيات الممنوحة',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[], record: User) => {
        if (record.isSuperAdmin) {
          return <Tag color="success">كامل صلاحيات النظام (14 قسماً)</Tag>;
        }
        if (!perms || perms.length === 0) {
          return <Tag color="default">لا توجد صلاحيات</Tag>;
        }
        return (
          <Space wrap size={[0, 4]}>
            {perms.map((p) => {
              const mod = ALL_SYSTEM_MODULES.find((m) => m.key === p);
              return (
                <Tag key={p} color="cyan">
                  {mod?.nameAr || p}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (act: boolean, record: User) => (
        <Switch
          checked={act}
          disabled={record.isSuperAdmin}
          checkedChildren="نشط"
          unCheckedChildren="معطل"
          onChange={() => toggleUserStatus(record.id)}
        />
      ),
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openUserModal(record)}
          >
            تعديل
          </Button>

          {!record.isSuperAdmin && (
            <Popconfirm
              title="تأكيد حذف حساب المسؤول"
              description={`هل أنت متأكد من حذف حساب "${record.fullName}" (${record.username}) نهائياً؟`}
              onConfirm={() => {
                deleteUser(record.id);
                message.success('تم حذف الحساب بنجاح');
              }}
              okText="نعم، حذف"
              cancelText="إلغاء"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                حذف
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            إعدادات النظام والتهيئة العامة (System Settings & Customization)
          </Title>
          <Text type="secondary">
            إدارة هوية المنشأة الطبية، حسابات المسؤولين والصلاحيات، الأقسام والعيادات، واستخراج قاعدة البيانات
          </Text>
        </div>

        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<FilePdfOutlined />}
            size="large"
            onClick={() => setExportModalVisible(true)}
          >
            استخراج قاعدة البيانات كاملة (PDF)
          </Button>
        </Space>
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
              key: 'usersManagement',
              label: (
                <span>
                  <TeamOutlined /> مسؤولي النظام والصلاحيات ({users.length})
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message="نظام إدارة المسؤولين والصلاحيات والتحكم بالدخول (Role-Based Access Control - RBAC)"
                    description="أنت بصفتك المدير العام والمسؤول الأساسي للنظام، تمتلك الصلاحية الكاملة لإنشاء حسابات جديدة، تعيين اسم مستخدم وكلمة مرور خاصة لكل موظف أو طبيب أو مسؤول، وتحديد الأقسام التي يحق له فقط فتحها واستخدامها."
                    type="success"
                    showIcon
                    icon={<SafetyCertificateOutlined />}
                    style={{ marginBottom: 20 }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>حسابات مسؤولي النظام والموظفين المصرح لهم</Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        كل مسؤول يسجل دخوله ببياناته الخاصة ويدخل فقط على الأقسام المحددة له في الجدول أدناه.
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => openUserModal()}
                    >
                      + إضافة مسؤول / مستخدم جديد
                    </Button>
                  </div>

                  <Table
                    dataSource={users}
                    columns={userColumns}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    pagination={{ pageSize: 8 }}
                  />
                </div>
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

      {/* Add / Edit Admin User Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>{editingUser ? `تعديل بيانات وصلاحيات المسؤول: ${editingUser.fullName}` : 'إضافة حساب مسؤول / مستخدم جديد'}</span>
          </div>
        }
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        onOk={handleSaveUser}
        okText={editingUser ? 'حفظ وتحديث الصلاحيات' : 'إنشاء حساب المسؤول'}
        cancelText="إلغاء"
        width={720}
      >
        <Form form={userForm} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="اسم المستخدم (Username - للدخول)"
                rules={[{ required: true, message: 'اسم المستخدم مطلوب للدخول' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  placeholder="مثال: reception2, dr_ahmed..."
                  disabled={editingUser?.isSuperAdmin}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="الاسم الكامل للمسؤول / الموظف"
                rules={[{ required: true, message: 'الاسم الكامل مطلوب' }]}
              >
                <Input placeholder="مثال: د. أحمد حسام، أ. مروة كمال..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="كلمة المرور الخاصة به (Password)"
                rules={[{ required: true, message: 'كلمة المرور مطلوبة' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder="أدخل الرقم السري للحساب"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="role"
                label="الدور الوظيفي"
                rules={[{ required: true, message: 'الدور الوظيفي مطلوب' }]}
              >
                <Select disabled={editingUser?.isSuperAdmin}>
                  <Option value="ADMIN">مسؤول إداري عام (Admin)</Option>
                  <Option value="DOCTOR">طبيب بشري / استشاري (Doctor)</Option>
                  <Option value="NURSE">طاقم تمريض (Nurse)</Option>
                  <Option value="PHARMACIST">صيدلي (Pharmacist)</Option>
                  <Option value="LAB_TECH">فني مختبر ومعمل (Lab Tech)</Option>
                  <Option value="RADIOLOGY_TECH">فني أشعة وتصوير (Radiology Tech)</Option>
                  <Option value="ACCOUNTANT">محاسب ومسؤول فوترة (Accountant)</Option>
                  <Option value="RECEPTIONIST">مسؤول استقبال وعيادات (Receptionist)</Option>
                  <Option value="ARCHIVIST">أمين ومسؤول الأرشيف (Archivist)</Option>
                  <Option value="HR">مسؤول شؤون عاملين (HR)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="رقم الهاتف">
                <Input placeholder="01012345678" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="notes" label="ملاحظات أو القسم الإداري التابع له">
                <Input placeholder="مثال: عيادات الدور الأول، صيدلية الطوارئ..." />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          {/* Granular Permissions Section */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                <SafetyCertificateOutlined /> حدد الأقسام المسموح له بفتحها واستخدامها (Granular Permissions):
              </Text>
              <Space wrap size="small">
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('ALL')}>كامل الصلاحيات</Button>
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('RECEPTION')}>استقبال</Button>
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('BILLING')}>حسابات</Button>
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('PHARMACY')}>صيدلية</Button>
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('DOCTOR')}>طبيب</Button>
                <Button size="small" type="dashed" onClick={() => handleApplyPreset('ARCHIVE')}>أرشيف</Button>
              </Space>
            </div>

            <Checkbox.Group
              value={selectedPermissions}
              onChange={(checkedValues) => setSelectedPermissions(checkedValues as string[])}
              style={{ width: '100%' }}
            >
              <Row gutter={[12, 10]}>
                {ALL_SYSTEM_MODULES.map((mod) => (
                  <Col key={mod.key} xs={24} sm={12}>
                    <Card size="small" style={{ borderRadius: 6, background: selectedPermissions.includes(mod.key) ? '#f0f5ff' : '#fafafa' }}>
                      <Checkbox value={mod.key} style={{ fontWeight: 600 }}>
                        {mod.nameAr}
                      </Checkbox>
                      <div style={{ fontSize: 11, color: '#8c8c8c', marginRight: 24 }}>
                        {mod.descriptionAr}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
        </Form>
      </Modal>

      {/* Database PDF Export Modal */}
      <DatabaseExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />
    </div>
  );
};
