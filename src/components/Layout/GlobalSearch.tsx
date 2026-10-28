import React, { useState } from 'react';
import { AutoComplete, Input, Typography, Space } from 'antd';
import { SearchOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useHospitalStore } from '../../mockData/mockStore';

const { Text } = Typography;

export const GlobalSearch: React.FC = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const patients = useHospitalStore((state) => state.patients);

  const options = patients
    .filter(
      (p) =>
        p.fullNameAr.toLowerCase().includes(value.toLowerCase()) ||
        p.mrn.toLowerCase().includes(value.toLowerCase()) ||
        (p.nationalId && p.nationalId.includes(value)) ||
        (p.phone && p.phone.includes(value))
    )
    .slice(0, 6)
    .map((patient) => ({
      value: patient.id.toString(),
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
          <Space>
            <UserOutlined style={{ color: '#1890ff' }} />
            <Text strong>{patient.fullNameAr}</Text>
          </Space>
          <Space>
            <IdcardOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontFamily: 'monospace' }}>
              {patient.mrn}
            </Text>
          </Space>
        </div>
      ),
    }));

  const handleSelect = (patientId: string) => {
    setValue('');
    navigate(`/patients/${patientId}`);
  };

  return (
    <AutoComplete
      className="global-search-bar"
      style={{ width: '100%', maxWidth: 320, minWidth: 100 }}
      options={value ? options : []}
      onSelect={handleSelect}
      onSearch={setValue}
      value={value}
    >
      <Input
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        placeholder="بحث سريع عن مريض (اسم / ملف / هاتف)..."
        allowClear
      />
    </AutoComplete>
  );
};
