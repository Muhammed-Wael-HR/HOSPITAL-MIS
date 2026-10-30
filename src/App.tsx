import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme, Result, Card, Button } from 'antd';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';

import { useAppStore } from './store/appStore';
import { useAuthStore } from './store/authStore';

import { MainLayout } from './components/Layout/MainLayout';
import { LoginPage } from './pages/Auth/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { PatientListPage } from './pages/Patients/PatientListPage';
import { PatientProfilePage } from './pages/Patients/PatientProfilePage';
import { AppointmentListPage } from './pages/Appointments/AppointmentListPage';
import { BedMapPage } from './pages/Admissions/BedMapPage';
import { AdmissionListPage } from './pages/Admissions/AdmissionListPage';
import { MedicalRecordListPage } from './pages/MedicalRecords/MedicalRecordListPage';
import { LabOrderListPage } from './pages/Laboratory/LabOrderListPage';
import { RadiologyOrderListPage } from './pages/Radiology/RadiologyOrderListPage';
import { MedicationListPage } from './pages/Pharmacy/MedicationListPage';
import { PrescriptionListPage } from './pages/Pharmacy/PrescriptionListPage';
import { InvoiceListPage } from './pages/Billing/InvoiceListPage';
import { InsuranceListPage } from './pages/Insurance/InsuranceListPage';
import { ArchiveListPage } from './pages/Archive/ArchiveListPage';
import { HRPage } from './pages/HR/HRPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PermissionRoute: React.FC<{ moduleKey: string; children: React.ReactNode }> = ({ moduleKey, children }) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  if (!hasPermission(moduleKey)) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <Card style={{ maxWidth: 520, margin: '0 auto', borderRadius: 12 }}>
          <Result
            status="403"
            title="403 - غير مصرح بالوصول"
            subTitle="عذراً، هذا الحساب لا يمتلك صلاحية الوصول إلى هذا القسم الطبي أو الإداري. يرجى التواصل مع المدير العام للمستشفى لتعديل صلاحيات حسابك."
            extra={
              <Button type="primary" onClick={() => (window.location.hash = '#/')}>
                العودة للوحة الرئيسية
              </Button>
            }
          />
        </Card>
      </div>
    );
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  const { language, direction, theme, hospitalSettings } = useAppStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    dayjs.locale(language === 'ar' ? 'ar' : 'en');
    document.title = `${hospitalSettings.nameAr} - نظام المعلومات الصحي المتكامل (HIS/MIS)`;
  }, [direction, language, hospitalSettings.nameAr]);

  return (
    <ConfigProvider
      direction={direction}
      locale={language === 'ar' ? arEG : enUS}
      theme={{
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily: "'Noto Sans Arabic', 'Inter', -apple-system, sans-serif",
        },
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PermissionRoute moduleKey="dashboard"><DashboardPage /></PermissionRoute>} />
            <Route path="patients" element={<PermissionRoute moduleKey="patients"><PatientListPage /></PermissionRoute>} />
            <Route path="patients/:id" element={<PermissionRoute moduleKey="patients"><PatientProfilePage /></PermissionRoute>} />
            <Route path="appointments" element={<PermissionRoute moduleKey="appointments"><AppointmentListPage /></PermissionRoute>} />
            <Route path="admissions" element={<PermissionRoute moduleKey="admissions"><BedMapPage /></PermissionRoute>} />
            <Route path="admissions/list" element={<PermissionRoute moduleKey="admissions"><AdmissionListPage /></PermissionRoute>} />
            <Route path="medical-records" element={<PermissionRoute moduleKey="medical_records"><MedicalRecordListPage /></PermissionRoute>} />
            <Route path="laboratory" element={<PermissionRoute moduleKey="laboratory"><LabOrderListPage /></PermissionRoute>} />
            <Route path="radiology" element={<PermissionRoute moduleKey="radiology"><RadiologyOrderListPage /></PermissionRoute>} />
            <Route path="pharmacy" element={<PermissionRoute moduleKey="pharmacy"><MedicationListPage /></PermissionRoute>} />
            <Route path="pharmacy/prescriptions" element={<PermissionRoute moduleKey="pharmacy"><PrescriptionListPage /></PermissionRoute>} />
            <Route path="billing" element={<PermissionRoute moduleKey="billing"><InvoiceListPage /></PermissionRoute>} />
            <Route path="insurance" element={<PermissionRoute moduleKey="insurance"><InsuranceListPage /></PermissionRoute>} />
            <Route path="archive" element={<PermissionRoute moduleKey="archive"><ArchiveListPage /></PermissionRoute>} />
            <Route path="hr" element={<PermissionRoute moduleKey="hr"><HRPage /></PermissionRoute>} />
            <Route path="reports" element={<PermissionRoute moduleKey="reports"><ReportsPage /></PermissionRoute>} />
            <Route path="settings" element={<PermissionRoute moduleKey="settings"><SettingsPage /></PermissionRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
