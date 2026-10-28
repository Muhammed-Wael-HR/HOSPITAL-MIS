import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Typography,
  Space,
  Modal,
  Form,
  Upload,
  Table,
  Radio,
  Tooltip,
  message,
  Divider,
} from 'antd';
import {
  FolderOpenOutlined,
  UploadOutlined,
  SearchOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { useAppStore } from '../../store/appStore';
import { Archive } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export const ArchiveListPage: React.FC = () => {
  const navigate = useNavigate();
  const hospitalSettings = useAppStore((state) => state.hospitalSettings);
  const adminProfile = useAppStore((state) => state.adminProfile);
  const archives = useHospitalStore((state) => state.archives);
  const patients = useHospitalStore((state) => state.patients);
  const addArchiveDocument = useHospitalStore((state) => state.addArchiveDocument);
  const deleteArchiveDocument = useHospitalStore((state) => state.deleteArchiveDocument);

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Archive | null>(null);

  const [uploadForm] = Form.useForm();

  const filteredArchives = archives.filter((doc) => {
    const query = searchText.toLowerCase();
    const matchesSearch =
      doc.title.toLowerCase().includes(query) ||
      (doc.description && doc.description.toLowerCase().includes(query)) ||
      (doc.tags && doc.tags.toLowerCase().includes(query)) ||
      doc.fileName.toLowerCase().includes(query) ||
      (doc.patient?.fullNameAr && doc.patient.fullNameAr.toLowerCase().includes(query));

    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = async () => {
    try {
      const values = await uploadForm.validateFields();
      addArchiveDocument({
        patientId: values.patientId,
        title: values.title,
        description: values.description,
        category: values.category,
        fileType: values.fileType || 'application/pdf',
        fileName: values.fileName || `Document_${Date.now()}.pdf`,
        fileSize: Math.floor(Math.random() * 3000000) + 500000,
        tags: values.tags,
      });

      message.success('تمت أرشفة وتأمين الوثيقة الطبية بنجاح');
      uploadForm.resetFields();
      setUploadModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openPreview = (doc: Archive) => {
    setSelectedDoc(doc);
    setPreviewModalVisible(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FilePdfOutlined style={{ fontSize: 36, color: '#ff4d4f' }} />;
    }
    if (fileType.includes('image') || fileType.includes('jpeg') || fileType.includes('png')) {
      return <FileImageOutlined style={{ fontSize: 36, color: '#1890ff' }} />;
    }
    return <FileTextOutlined style={{ fontSize: 36, color: '#52c41a' }} />;
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'SURGICAL_CONSENT':
        return { label: 'إقرار وموافقة جراحية', color: 'volcano' };
      case 'MEDICAL_REPORT':
        return { label: 'تقرير طبي استشاري', color: 'blue' };
      case 'RADIOLOGY_IMAGE':
        return { label: 'أشعة وتصوير رقمي', color: 'purple' };
      case 'LAB_RESULT':
        return { label: 'نتائج تحاليل خارجية', color: 'green' };
      case 'INSURANCE_DOCUMENT':
        return { label: 'وثيقة تأمين صحي', color: 'cyan' };
      case 'DISCHARGE_SUMMARY':
        return { label: 'ملخص خروج نهائي', color: 'magenta' };
      case 'ID_DOCUMENT':
        return { label: 'إثبات هوية ورقم قومي', color: 'orange' };
      case 'CONTRACT':
        return { label: 'سياسات واعتماد مستشفى', color: 'geekblue' };
      default:
        return { label: cat, color: 'default' };
    }
  };

  const tableColumns = [
    {
      title: 'النوع',
      dataIndex: 'fileType',
      key: 'type',
      width: 60,
      render: (t: string) => (t.includes('pdf') ? <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} /> : <FileImageOutlined style={{ color: '#1890ff', fontSize: 20 }} />),
    },
    {
      title: 'عنوان المستند',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, r: Archive) => (
        <div>
          <a onClick={() => openPreview(r)} style={{ fontWeight: 600 }}>
            {title}
          </a>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>{r.description}</div>
        </div>
      ),
    },
    {
      title: 'التصنيف الأرشيفي',
      dataIndex: 'category',
      key: 'cat',
      render: (cat: string) => {
        const conf = getCategoryLabel(cat);
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: 'المريض المرتبط',
      dataIndex: ['patient', 'fullNameAr'],
      key: 'patient',
      render: (name?: string, r?: Archive) =>
        name ? (
          <div>
            <a onClick={() => navigate(`/patients/${r?.patientId}`)}>{name}</a>
            <div style={{ color: '#8c8c8c', fontSize: 11 }}>{r?.patient?.mrn}</div>
          </div>
        ) : (
          <Tag color="default">وثيقة مستشفى عامة</Tag>
        ),
    },
    {
      title: 'تاريخ الأرشفة',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => new Date(d).toLocaleDateString('ar-EG'),
    },
    {
      title: 'الحجم',
      dataIndex: 'fileSize',
      key: 'size',
      render: (sz: number) => `${(sz / (1024 * 1024)).toFixed(2)} MB`,
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: any, r: Archive) => (
        <Space>
          <Tooltip title="معاينة الوثيقة">
            <Button size="small" icon={<EyeOutlined />} onClick={() => openPreview(r)} />
          </Tooltip>
          <Tooltip title="تحميل">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => message.info(`جاري تحميل الملف: ${r.fileName}`)}
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteArchiveDocument(r.id);
                message.success('تم حذف المستند من الأرشيف');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            الأرشيف الطبي وإدارة الوثائق (Archive & Medical DMS)
          </Title>
          <Text type="secondary">
            المستودع الرقمي المركزي للتقارير الطبية، الإقرارات الموقعة، نتائج الفحوصات الخارجية، والوثائق الإدارية
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UploadOutlined />}
          size="large"
          onClick={() => setUploadModalVisible(true)}
        >
          أرشفة مستند جديد
        </Button>
      </div>

      {/* Security & Compliance Banner */}
      <Card
        size="small"
        style={{
          background: 'linear-gradient(90deg, #f0f5ff 0%, #e6f7ff 100%)',
          borderColor: '#adc6ff',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <SafetyCertificateOutlined style={{ fontSize: 24, color: '#2f54eb' }} />
            <div>
              <Text strong style={{ color: '#1d39c4' }}>
                نظام الأرشفة المشفر ومتوافق مع معايير الهيئة العامة للاعتماد الصحي (GAHAR)
              </Text>
              <div style={{ fontSize: 12, color: '#595959' }}>
                جميع الملفات مؤمنة ببروتوكولات التشفير، ويتم تسجيل سجل تدقيق (Audit Access Log) لكل عملية فتح أو تحميل.
              </div>
            </div>
          </Space>
          <Tag color="blue" icon={<LockOutlined />}>
            تشفير عالي الأمان (256-bit)
          </Tag>
        </div>
      </Card>

      {/* Filter and View Mode Controls */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={10}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="بحث في الأرشيف (العنوان، المريض، الكلمات المفتاحية، اسم الملف)..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={16} sm={10}>
            <Select
              style={{ width: '100%' }}
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              <Option value="ALL">كافة تصنيفات الأرشيف ({archives.length})</Option>
              <Option value="SURGICAL_CONSENT">إقرارات وموافقات جراحية</Option>
              <Option value="MEDICAL_REPORT">تقارير طبية واستشارية</Option>
              <Option value="RADIOLOGY_IMAGE">أشعة وفحوصات رقمية</Option>
              <Option value="LAB_RESULT">تحاليل طبية خارجية</Option>
              <Option value="INSURANCE_DOCUMENT">وثائق وبطاقات تأمين</Option>
              <Option value="DISCHARGE_SUMMARY">ملخصات خروج</Option>
              <Option value="ID_DOCUMENT">إثباتات هوية ورقم قومي</Option>
              <Option value="CONTRACT">سياسات واعتمادات المستشفى</Option>
            </Select>
          </Col>

          <Col xs={8} sm={4} style={{ textAlign: 'left' }}>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="table">
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <Row gutter={[16, 16]}>
          {filteredArchives.map((doc) => {
            const catConf = getCategoryLabel(doc.category);
            return (
              <Col key={doc.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 8,
                  }}
                  actions={[
                    <Tooltip title="معاينة الملف">
                      <EyeOutlined key="preview" onClick={() => openPreview(doc)} />
                    </Tooltip>,
                    <Tooltip title="تحميل الملف">
                      <DownloadOutlined
                        key="download"
                        onClick={() => message.info(`جاري تحميل: ${doc.fileName}`)}
                      />
                    </Tooltip>,
                    <Tooltip title="حذف من الأرشيف">
                      <DeleteOutlined
                        key="delete"
                        style={{ color: '#ff4d4f' }}
                        onClick={() => {
                          deleteArchiveDocument(doc.id);
                          message.success('تم حذف المستند');
                        }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>{getFileIcon(doc.fileType)}</div>

                  <div style={{ minHeight: 90 }}>
                    <Tag color={catConf.color} style={{ marginBottom: 6 }}>
                      {catConf.label}
                    </Tag>
                    <Title level={5} style={{ margin: '4px 0 6px 0', fontSize: 14 }}>
                      {doc.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.description}
                    </Text>
                  </div>

                  <Divider style={{ margin: '12px 0 8px 0' }} />

                  <div>
                    {doc.patient ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <UserOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                        <Text strong style={{ fontSize: 12 }}>
                          {doc.patient.fullNameAr}
                        </Text>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                        وثيقة مستشفى عامة
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c8c8c' }}>
                      <span>{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card bordered={false}>
          <Table dataSource={filteredArchives} columns={tableColumns} rowKey="id" pagination={{ pageSize: 8 }} />
        </Card>
      )}

      {/* Upload Archive Document Modal */}
      <Modal
        title="أرشفة وثيقة طبية أو إدارية جديدة"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onOk={handleUploadSubmit}
        okText="حفظ وتأمين في الأرشيف"
        cancelText="إلغاء"
        width={680}
      >
        <Form form={uploadForm} layout="vertical">
          <Form.Item name="title" label="عنوان الوثيقة" rules={[{ required: true, message: 'عنوان الوثيقة مطلوب' }]}>
            <Input placeholder="مثال: إقرار موافقة مستنيرة على جراحة عظام، تقرير رنين مغناطيسي..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="التصنيف الأرشيفي" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select placeholder="اختر التصنيف">
                  <Option value="SURGICAL_CONSENT">إقرار وموافقة جراحية</Option>
                  <Option value="MEDICAL_REPORT">تقرير طبي استشاري</Option>
                  <Option value="RADIOLOGY_IMAGE">أشعة وفحوصات رقمية</Option>
                  <Option value="LAB_RESULT">نتائج تحاليل خارجية</Option>
                  <Option value="INSURANCE_DOCUMENT">وثيقة وبطاقة تأمين صحي</Option>
                  <Option value="DISCHARGE_SUMMARY">ملخص خروج نهائي</Option>
                  <Option value="ID_DOCUMENT">إثبات هوية ورقم قومي</Option>
                  <Option value="CONTRACT">سياسات واعتمادات المستشفى</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="patientId" label="المريض المرتبط (اختياري)">
                <Select showSearch allowClear placeholder="اختر المريض (إن وجد)">
                  {patients.map((p) => (
                    <Option key={p.id} value={p.id}>
                      {p.fullNameAr} ({p.mrn})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="الوصف وتفاصيل الوثيقة">
            <TextArea rows={2} placeholder="تفاصيل المحتوى، اسم الطبيب الموقع، الجهة الصادر عنها..." />
          </Form.Item>

          <Form.Item name="tags" label="الكلمات المفتاحية (Tags)">
            <Input placeholder="مثال: جراحة, عظام, تخدير كلي, موافقة رسمية" />
          </Form.Item>

          <Form.Item label="الملف المرفوع">
            <Dragger beforeUpload={() => false} maxCount={1}>
              <p className="ant-upload-drag-icon">
                <FolderOpenOutlined style={{ fontSize: 40, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">اضغط هنا أو اسحب الملف لرفعه للأرشيف</p>
              <p className="ant-upload-hint">يدعم ملفات PDF، صور الأشعة (JPG, PNG)، ومستندات Word بحد أقصى 50MB</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Document Preview & Access Log Modal */}
      <Modal
        title={`معاينة الوثيقة الأرشيفية: ${selectedDoc?.title}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            إغلاق
          </Button>,
          <Button
            key="dl"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => message.success(`جاري تحميل ${selectedDoc?.fileName}`)}
          >
            تحميل الوثيقة
          </Button>,
        ]}
        width={780}
      >
        {selectedDoc && (
          <div>
            {/* Metadata Card */}
            <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">التصنيف: </Text>
                  <Tag color={getCategoryLabel(selectedDoc.category).color}>
                    {getCategoryLabel(selectedDoc.category).label}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text type="secondary">تاريخ الأرشفة: </Text>
                  <Text strong>{new Date(selectedDoc.createdAt).toLocaleDateString('ar-EG')}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">اسم الملف: </Text>
                  <Text style={{ fontFamily: 'monospace' }}>{selectedDoc.fileName}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">حجم الملف: </Text>
                  <Text>{(selectedDoc.fileSize / (1024 * 1024)).toFixed(2)} MB</Text>
                </Col>
                <Col span={24}>
                  <Text type="secondary">الوصف: </Text>
                  <Text>{selectedDoc.description}</Text>
                </Col>
              </Row>
            </Card>

            {/* Document Viewer Frame (Simulated interactive preview) */}
            <div
              style={{
                height: 380,
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '90%',
                  height: '85%',
                  background: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: 4,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1890ff', paddingBottom: 12 }}>
                    <div>
                      <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                        {hospitalSettings.nameAr} - الأرشيف الطبي المركزي
                      </Title>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        وثيقة رسمية مؤرشفة رقمياً - غير قابلة للتعديل
                      </Text>
                    </div>
                    <Tag color="blue" icon={<LockOutlined />}>
                      معتمد ومختوم إلكترونياً
                    </Tag>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <Title level={4}>{selectedDoc.title}</Title>
                    <Paragraph>{selectedDoc.description}</Paragraph>
                    {selectedDoc.patient && (
                      <Paragraph>
                        <strong>المريض: </strong>{selectedDoc.patient.fullNameAr} (رقم الملف: {selectedDoc.patient.mrn})
                      </Paragraph>
                    )}
                    <Paragraph type="secondary">
                      الكلمات المفتاحية: {selectedDoc.tags || 'لا توجد'}
                    </Paragraph>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #d9d9d9', paddingTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    رقم الوثيقة الأرشيفي: DOC-ARCH-{selectedDoc.id.toString().padStart(6, '0')}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    تاريخ المعاينة الحالية: {new Date().toLocaleString('ar-EG')}
                  </Text>
                </div>
              </div>
            </div>

            {/* Audit Log / Access Record */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>سجل الاطلاع والأمان (Security & Audit Log)</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                تم تسجيل عملية الاطلاع الحالية بواسطة: {adminProfile.displayName} ({adminProfile.position}) بتاريخ{' '}
                {new Date().toLocaleString('ar-EG')}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
