import React from 'react';
import { Modal, Form, Select, Input, Row, Col, message } from 'antd';
import { useHospitalStore } from '../../mockData/mockStore';

const { Option } = Select;
const { TextArea } = Input;

interface AdmissionFormModalProps {
  visible: boolean;
  onClose: () => void;
  selectedBedId?: number;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({ visible, onClose, selectedBedId }) => {
  const [form] = Form.useForm();
  const patients = useHospitalStore((state) => state.patients);
  const doctors = useHospitalStore((state) => state.doctors);
  const beds = useHospitalStore((state) => state.beds);
  const rooms = useHospitalStore((state) => state.rooms);
  const departments = useHospitalStore((state) => state.departments);
  const admitPatient = useHospitalStore((state) => state.admitPatient);

  const availableBeds = beds.filter((b) => b.status === 'AVAILABLE' || b.id === selectedBedId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      admitPatient({
        patientId: values.patientId,
        doctorId: values.doctorId,
        bedId: values.bedId,
        reason: values.reason,
      });
      message.success('تم تسكين وتنويم المريض بنجاح على السرير المختار');
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title="إجراء تنويم وتسكين مريض داخلي (Admission - ADT)"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="تسكين المريض"
      cancelText="إلغاء"
      width={640}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="patientId"
          label="المريض المطلوب تنويمه"
          rules={[{ required: true, message: 'يرجى اختيار المريض' }]}
        >
          <Select
            showSearch
            placeholder="ابحث بالاسم أو رقم الملف..."
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {patients.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.fullNameAr} ({p.mrn})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="doctorId"
              label="الطبيب الاستشاري المسؤول"
              rules={[{ required: true, message: 'مطلوب' }]}
            >
              <Select placeholder="اختر الطبيب">
                {doctors.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.employee?.fullNameAr} ({d.specialty})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bedId"
              label="السرير المتاح للتسكين"
              initialValue={selectedBedId}
              rules={[{ required: true, message: 'مطلوب اختيار السرير' }]}
            >
              <Select placeholder="اختر من الأسرّة الشاغرة">
                {availableBeds.map((bed) => {
                  const room = rooms.find((r) => r.id === bed.roomId);
                  const dept = departments.find((d) => d.id === room?.departmentId);
                  return (
                    <Option key={bed.id} value={bed.id}>
                      {bed.bedNumber} - غرفة {room?.roomNumber} ({dept?.nameAr})
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="reason"
          label="تشخيص الدخول وسبب التنويم"
          rules={[{ required: true, message: 'يرجى كتابة سبب التنويم' }]}
        >
          <TextArea rows={3} placeholder="مثال: متابعة ما بعد جراحة عظام، عناية مركزة لجلطة دماغية، تحضير لعملية جراحية..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
