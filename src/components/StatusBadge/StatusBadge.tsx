import React from 'react';
import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
  type?: 'appointment' | 'admission' | 'bed' | 'lab' | 'radiology' | 'invoice' | 'claim';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getTagConfig = () => {
    switch (status) {
      // Bed Status
      case 'AVAILABLE':
        return { color: 'success', text: 'شاغر ومتاح' };
      case 'OCCUPIED':
        return { color: 'error', text: 'مشغول' };
      case 'MAINTENANCE':
        return { color: 'default', text: 'صيانة وتطهير' };
      case 'RESERVED':
        return { color: 'warning', text: 'محجوز مؤقتاً' };

      // Appointment Status
      case 'SCHEDULED':
        return { color: 'blue', text: 'مجدول' };
      case 'WAITING':
        return { color: 'orange', text: 'في الانتظار' };
      case 'IN_PROGRESS':
        return { color: 'processing', text: 'جاري الكشف' };
      case 'COMPLETED':
        return { color: 'green', text: 'مكتمل' };
      case 'CANCELLED':
        return { color: 'red', text: 'ملغي' };
      case 'NO_SHOW':
        return { color: 'default', text: 'لم يحضر' };

      // Admission Status
      case 'ADMITTED':
        return { color: 'volcano', text: 'منوم حالياً' };
      case 'TRANSFERRED':
        return { color: 'geekblue', text: 'تم النقل' };
      case 'DISCHARGED':
        return { color: 'green', text: 'تم الخروج' };

      // Lab & Radiology Status
      case 'PENDING':
        return { color: 'gold', text: 'قيد الانتظار' };
      case 'SAMPLE_COLLECTED':
        return { color: 'cyan', text: 'سُحبت العينة' };
      case 'APPROVED':
        return { color: 'success', text: 'معتمد رسمياً' };
      case 'REPORTED':
        return { color: 'purple', text: 'كُتب التقرير' };

      // Invoice & Claim Status
      case 'PAID':
        return { color: 'green', text: 'مدفوع بالكامل' };
      case 'PARTIALLY_PAID':
        return { color: 'orange', text: 'مدفوع جزئياً' };
      case 'DRAFT':
        return { color: 'default', text: 'مسودة' };
      case 'ISSUED':
        return { color: 'blue', text: 'صادرة' };
      case 'SUBMITTED':
        return { color: 'processing', text: 'مُقدمة للشركة' };
      case 'UNDER_REVIEW':
        return { color: 'warning', text: 'قيد المراجعة' };
      case 'REJECTED':
        return { color: 'error', text: 'مرفوضة' };

      default:
        return { color: 'default', text: status };
    }
  };

  const config = getTagConfig();
  return <Tag color={config.color}>{config.text}</Tag>;
};
