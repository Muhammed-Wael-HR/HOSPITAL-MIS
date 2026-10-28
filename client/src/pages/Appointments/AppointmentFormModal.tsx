import React from 'react';
import { Modal, Form, Select, DatePicker, Input, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { useHospitalStore } from '../../mockData/mockStore';

const { Option } = Select;
const { TextArea } = Input;

interface AppointmentFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const patients = useHospitalStore((state) => state.patients);
  const doctors = useHospitalStore((state) => state.doctors);
  const addAppointment = useHospitalStore((state) => state.addAppointment);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addAppointment({
        patientId: values.patientId,
        doctorId: values.doctorId,
        scheduledAt: values.scheduledAt.toISOString(),
        type: values.type,
        notes: values.notes,
      });
      message.success('تم حجز الموعد بنجاح');
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title="حجز موعد عيادة جديد"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="تأكيد الحجز"
      cancelText="إلغاء"
      width={640}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="patientId"
          label="المريض"
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
              label="العيادة / الطبيب المعالج"
              rules={[{ required: true, message: 'يرجى اختيار الطبيب' }]}
            >
              <Select placeholder="اختر الطبيب والتخصص">
                {doctors.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.employee?.fullNameAr} - {d.specialty}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="نوع الكشف"
              initialValue="CONSULTATION"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="CONSULTATION">كشف أول مرة (Consultation)</Option>
                <Option value="FOLLOW_UP">استشارة ومتابعة (Follow-up)</Option>
                <Option value="EMERGENCY">كشف طارئ (Emergency)</Option>
                <Option value="PROCEDURE">إجراء علاجي (Procedure)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="scheduledAt"
          label="تاريخ وتوقيت الموعد"
          rules={[{ required: true, message: 'يرجى تحديد الموعد' }]}
          initialValue={dayjs()}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="notes" label="ملاحظات أو شكوى المريض المبدئية">
          <TextArea rows={2} placeholder="سبب الزيارة أو ملاحظات موظف الاستقبال..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
