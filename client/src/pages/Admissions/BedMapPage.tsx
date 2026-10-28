import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space, Modal, Input, message, Tooltip } from 'antd';
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SwapOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';
import { AdmissionFormModal } from './AdmissionFormModal';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const BedMapPage: React.FC = () => {
  const navigate = useNavigate();

  const departments = useHospitalStore((state) => state.departments);
  const rooms = useHospitalStore((state) => state.rooms);
  const beds = useHospitalStore((state) => state.beds);
  const admissions = useHospitalStore((state) => state.admissions);
  const dischargePatient = useHospitalStore((state) => state.dischargePatient);

  const [admitModalVisible, setAdmitModalVisible] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState<number | undefined>();

  // Discharge modal state
  const [dischargeModalVisible, setDischargeModalVisible] = useState(false);
  const [currentAdmissionId, setCurrentAdmissionId] = useState<number | null>(null);
  const [dischargeSummary, setDischargeSummary] = useState('');

  const occupiedCount = beds.filter((b) => b.status === 'OCCUPIED').length;
  const availableCount = beds.filter((b) => b.status === 'AVAILABLE').length;
  const maintenanceCount = beds.filter((b) => b.status === 'MAINTENANCE').length;
  const reservedCount = beds.filter((b) => b.status === 'RESERVED').length;

  const handleBedClick = (bed: any) => {
    if (bed.status === 'AVAILABLE') {
      setSelectedBedId(bed.id);
      setAdmitModalVisible(true);
    }
  };

  const openDischargeModal = (admId: number) => {
    setCurrentAdmissionId(admId);
    setDischargeSummary('');
    setDischargeModalVisible(true);
  };

  const handleConfirmDischarge = () => {
    if (currentAdmissionId) {
      dischargePatient(currentAdmissionId, dischargeSummary);
      message.success('تم إنهاء إقامة المريض وإخلاء السرير بنجاح');
      setDischargeModalVisible(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            خريطة الأسرّة التفاعلية (Inpatient Bed Map)
          </Title>
          <Text type="secondary">متابعة لحظية لإشغال أسرّة الأقسام الداخلية، الرعاية المركزة، والطوارئ</Text>
        </div>

        <Space>
          <Button type="primary" icon={<MedicineBoxOutlined />} onClick={() => setAdmitModalVisible(true)}>
            تنويم مريض جديد
          </Button>
          <Button onClick={() => navigate('/admissions/list')}>جدول سجلات التنويم</Button>
        </Space>
      </div>

      {/* Legend Card */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]} align="middle">
          <Col xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: '#52c41a',
                }}
              />
              <Text strong>شاغر ومتاح ({availableCount})</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: '#ff4d4f',
                }}
              />
              <Text strong>مشغول بنزيل ({occupiedCount})</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: '#faad14',
                }}
              />
              <Text strong>محجوز مؤقتاً ({reservedCount})</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: '#d9d9d9',
                }}
              />
              <Text strong>تحت الصيانة والتعقيم ({maintenanceCount})</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Department Bed Grids */}
      {departments
        .filter((dept) => ['INPATIENT', 'ICU', 'EMERGENCY', 'SURGERY'].includes(dept.type))
        .map((dept) => {
          const deptRooms = rooms.filter((r) => r.departmentId === dept.id);
          const deptBeds = beds.filter((b) => deptRooms.some((r) => r.id === b.roomId));

          if (deptBeds.length === 0) return null;

          return (
            <Card
              key={dept.id}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MedicineBoxOutlined style={{ color: '#1890ff' }} />
                  <span>{dept.nameAr}</span>
                  <Tag color="blue">{dept.type}</Tag>
                </div>
              }
              bordered={false}
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                {deptRooms.map((room) => {
                  const roomBeds = beds.filter((b) => b.roomId === room.id);
                  if (roomBeds.length === 0) return null;

                  return (
                    <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        size="small"
                        type="inner"
                        title={`غرفة رقم ${room.roomNumber} (طابق ${room.floor})`}
                        extra={<Tag>{room.roomType}</Tag>}
                      >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          {roomBeds.map((bed) => {
                            const activeAdmission = admissions.find(
                              (a) => a.bedId === bed.id && a.status === 'ADMITTED'
                            );

                            return (
                              <div
                                key={bed.id}
                                style={{
                                  padding: 10,
                                  borderRadius: 8,
                                  border: `2px solid ${
                                    bed.status === 'AVAILABLE'
                                      ? '#52c41a'
                                      : bed.status === 'OCCUPIED'
                                      ? '#ff4d4f'
                                      : bed.status === 'RESERVED'
                                      ? '#faad14'
                                      : '#d9d9d9'
                                  }`,
                                  background:
                                    bed.status === 'AVAILABLE'
                                      ? '#f6ffed'
                                      : bed.status === 'OCCUPIED'
                                      ? '#fff2f0'
                                      : bed.status === 'RESERVED'
                                      ? '#fffbe6'
                                      : '#fafafa',
                                  transition: 'all 0.2s',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text strong style={{ fontSize: 13 }}>
                                    سرير: {bed.bedNumber}
                                  </Text>
                                  {bed.status === 'AVAILABLE' && (
                                    <Tag color="success" icon={<CheckCircleOutlined />}>
                                      شاغر
                                    </Tag>
                                  )}
                                  {bed.status === 'OCCUPIED' && (
                                    <Tag color="error" icon={<CloseCircleOutlined />}>
                                      مشغول
                                    </Tag>
                                  )}
                                  {bed.status === 'MAINTENANCE' && (
                                    <Tag color="default" icon={<ToolOutlined />}>
                                      صيانة
                                    </Tag>
                                  )}
                                  {bed.status === 'RESERVED' && (
                                    <Tag color="warning" icon={<ClockCircleOutlined />}>
                                      محجوز
                                    </Tag>
                                  )}
                                </div>

                                {bed.status === 'OCCUPIED' && activeAdmission && (
                                  <div style={{ marginTop: 8, borderTop: '1px dashed #ffa39e', paddingTop: 6 }}>
                                    <div style={{ fontWeight: 600, color: '#cf1322', fontSize: 13 }}>
                                      {activeAdmission.patient?.fullNameAr}
                                    </div>
                                    <div style={{ color: '#8c8c8c', fontSize: 11, fontFamily: 'monospace' }}>
                                      {activeAdmission.patient?.mrn}
                                    </div>
                                    <div style={{ color: '#595959', fontSize: 11, marginTop: 4 }}>
                                      الطبيب: {activeAdmission.doctor?.employee?.fullNameAr}
                                    </div>

                                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                      <Button
                                        size="small"
                                        type="primary"
                                        ghost
                                        icon={<UserOutlined />}
                                        onClick={() => navigate(`/patients/${activeAdmission.patientId}`)}
                                        style={{ fontSize: 11 }}
                                      >
                                        الملف
                                      </Button>
                                      <Button
                                        size="small"
                                        danger
                                        icon={<ExportOutlined />}
                                        onClick={() => openDischargeModal(activeAdmission.id)}
                                        style={{ fontSize: 11 }}
                                      >
                                        خروج
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {bed.status === 'AVAILABLE' && (
                                  <div style={{ marginTop: 8 }}>
                                    <Button
                                      size="small"
                                      type="dashed"
                                      block
                                      style={{ borderColor: '#52c41a', color: '#52c41a' }}
                                      onClick={() => handleBedClick(bed)}
                                    >
                                      + تسكين مريض
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          );
        })}

      {/* Admission Modal */}
      <AdmissionFormModal
        visible={admitModalVisible}
        onClose={() => setAdmitModalVisible(false)}
        selectedBedId={selectedBedId}
      />

      {/* Discharge Summary Modal */}
      <Modal
        title="إجراء خروج مريض وإنهاء التنويم (Discharge)"
        open={dischargeModalVisible}
        onCancel={() => setDischargeModalVisible(false)}
        onOk={handleConfirmDischarge}
        okText="تأكيد الخروج وإخلاء السرير"
        okType="danger"
        cancelText="إلغاء"
      >
        <p>يرجى كتابة ملخص الحالة الطبية عند الخروج والتوصيات العلاجية:</p>
        <TextArea
          rows={4}
          value={dischargeSummary}
          onChange={(e) => setDischargeSummary(e.target.value)}
          placeholder="مثال: تم الخروج بحالة مستقرة، استقرار العلامات الحيوية، موصى بالراحة وأخذ الأدوية في مواعيدها والمتابعة بالعيادة بعد أسبوع..."
        />
      </Modal>
    </div>
  );
};
