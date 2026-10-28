import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import { Patient } from '../../types';
import { useHospitalStore } from '../../mockData/mockStore';

const { TextArea } = Input;
const { Option } = Select;

interface PatientFormModalProps {
  visible: boolean;
  onClose: () => void;
  patient?: Patient | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({ visible, onClose, patient }) => {
  const [form] = Form.useForm();
  const addPatient = useHospitalStore((state) => state.addPatient);
  const updatePatient = useHospitalStore((state) => state.updatePatient);

  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        gender: 'MALE',
        bloodType: 'O_POSITIVE',
        city: 'القاهرة',
      });
    }
  }, [patient, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };

      if (patient) {
        updatePatient(patient.id, formattedValues);
        message.success('تم تحديث بيانات المريض بنجاح');
      } else {
        const created = addPatient(formattedValues);
        message.success(`تم تسجيل المريض بنجاح برقم ملف: ${created.mrn}`);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title={patient ? 'تعديل بيانات المريض' : 'تسجيل مريض جديد (فتح ملف طبي)'}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={patient ? 'حفظ التعديلات' : 'إنشاء الملف الطبي'}
      cancelText="إلغاء"
      width={780}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullNameAr"
              label="الاسم الكامل (بالعربية)"
              rules={[{ required: true, message: 'يرجى إدخال اسم المريض بالعربية' }]}
            >
              <Input placeholder="مثال: أحمد محمود إبراهيم الشناوي" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="fullNameEn" label="الاسم الكامل (بالإنجليزية)">
              <Input placeholder="e.g. Ahmed Mahmoud Ibrahim" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nationalId"
              label="الرقم القومي (14 رقماً)"
              rules={[
                { required: true, message: 'الرقم القومي مطلوب' },
                { len: 14, message: 'الرقم القومي يجب أن يتكون من 14 رقماً' },
              ]}
            >
              <Input placeholder="29012345678901" maxLength={14} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dateOfBirth" label="تاريخ الميلاد" rules={[{ required: true, message: 'مطلوب' }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="اختر التاريخ" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="gender" label="النوع" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="MALE">ذكر</Radio>
                <Radio value="FEMALE">أنثى</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="bloodType" label="فصيلة الدم">
              <Select placeholder="اختر الفصيلة">
                <Option value="A_POSITIVE">A+</Option>
                <Option value="A_NEGATIVE">A-</Option>
                <Option value="B_POSITIVE">B+</Option>
                <Option value="B_NEGATIVE">B-</Option>
                <Option value="AB_POSITIVE">AB+</Option>
                <Option value="AB_NEGATIVE">AB-</Option>
                <Option value="O_POSITIVE">O+</Option>
                <Option value="O_NEGATIVE">O-</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="phone"
              label="رقم الهاتف الأساسي"
              rules={[{ required: true, message: 'رقم الهاتف مطلوب للتواصل' }]}
            >
              <Input placeholder="01012345678" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone2" label="رقم هاتف بديل">
              <Input placeholder="01234567890" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="address" label="العنوان بالتفصيل">
              <Input placeholder="الحي، اسم الشارع، رقم المبنى" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="city" label="المحافظة / المدينة">
              <Input placeholder="القاهرة / الجيزة / الإسكندرية..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="emergencyContact" label="جهة الاتصال في الطوارئ (الاسم وصفة القرابة)">
              <Input placeholder="مثال: محمود الشناوي (الوالد)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="emergencyPhone" label="هاتف الطوارئ">
              <Input placeholder="01123456789" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="allergies"
          label="الحساسية الدوائية والغذائية المعروفة (تنبيه طبي عاجل)"
          extra="ستظهر هذه المعلومة كتحذير أحمر بارز لجميع الأطباء وهيئة التمريض والصيدلية."
        >
          <TextArea rows={2} placeholder="مثال: حساسية بنسيلين، حساسية من مركبات السلفا، حساسية أسبرين..." />
        </Form.Item>

        <Form.Item name="notes" label="ملاحظات طبية عامة أو تاريخ مرضي مزمن">
          <TextArea rows={2} placeholder="أمراض مزمنة (ضغط، سكر، قلب، ربو)، عمليات سابقة..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
