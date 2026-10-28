import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
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
            <Route index element={<DashboardPage />} />
            <Route path="patients" element={<PatientListPage />} />
            <Route path="patients/:id" element={<PatientProfilePage />} />
            <Route path="appointments" element={<AppointmentListPage />} />
            <Route path="admissions" element={<BedMapPage />} />
            <Route path="admissions/list" element={<AdmissionListPage />} />
            <Route path="medical-records" element={<MedicalRecordListPage />} />
            <Route path="laboratory" element={<LabOrderListPage />} />
            <Route path="radiology" element={<RadiologyOrderListPage />} />
            <Route path="pharmacy" element={<MedicationListPage />} />
            <Route path="pharmacy/prescriptions" element={<PrescriptionListPage />} />
            <Route path="billing" element={<InvoiceListPage />} />
            <Route path="insurance" element={<InsuranceListPage />} />
            <Route path="archive" element={<ArchiveListPage />} />
            <Route path="hr" element={<HRPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
