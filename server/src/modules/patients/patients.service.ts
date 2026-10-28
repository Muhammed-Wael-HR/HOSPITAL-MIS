// =============================================================
// Patients Service
// Business logic for patient management
// =============================================================

import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { Prisma } from '@prisma/client';

/**
 * Generate a unique Medical Record Number
 * Format: MRN-YYYYMMDD-XXXX (sequential)
 */
const generateMRN = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `MRN-${dateStr}-`;

  // Find the last MRN with today's date prefix
  const lastPatient = await prisma.patient.findFirst({
    where: { mrn: { startsWith: prefix } },
    orderBy: { mrn: 'desc' },
  });

  let seq = 1;
  if (lastPatient) {
    const lastSeq = parseInt(lastPatient.mrn.split('-').pop() || '0');
    seq = lastSeq + 1;
  }

  return `${prefix}${seq.toString().padStart(4, '0')}`;
};

/**
 * List patients with pagination, search, and filters
 */
export const listPatients = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  isActive?: string;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = {};

  // Search by name, MRN, nationalId, or phone
  if (query.search) {
    where.OR = [
      { fullNameAr: { contains: query.search, mode: 'insensitive' } },
      { fullNameEn: { contains: query.search, mode: 'insensitive' } },
      { mrn: { contains: query.search, mode: 'insensitive' } },
      { nationalId: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search } },
    ];
  }

  if (query.gender) {
    where.gender = query.gender as 'MALE' | 'FEMALE';
  }

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        mrn: true,
        nationalId: true,
        fullNameAr: true,
        fullNameEn: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        phone: true,
        city: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single patient by ID with all related data counts
 */
export const getPatientById = async (id: number) => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        take: 5,
        orderBy: { scheduledAt: 'desc' },
        include: {
          doctor: {
            include: { employee: { select: { fullNameAr: true, fullNameEn: true } } },
          },
        },
      },
      admissions: {
        take: 5,
        orderBy: { admittedAt: 'desc' },
        include: {
          doctor: {
            include: { employee: { select: { fullNameAr: true, fullNameEn: true } } },
          },
          bed: { include: { room: true } },
        },
      },
      insuranceCards: {
        include: { company: true },
      },
      _count: {
        select: {
          appointments: true,
          admissions: true,
          medicalRecords: true,
          labOrders: true,
          radiologyOrders: true,
          prescriptions: true,
          invoices: true,
        },
      },
    },
  });

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return patient;
};

/**
 * Create a new patient with auto-generated MRN
 */
export const createPatient = async (data: {
  nationalId?: string;
  fullNameAr: string;
  fullNameEn?: string;
  dateOfBirth?: string;
  gender: string;
  bloodType?: string;
  allergies?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}) => {
  // Check for duplicate national ID
  if (data.nationalId) {
    const existing = await prisma.patient.findUnique({
      where: { nationalId: data.nationalId },
    });
    if (existing) {
      throw new AppError('A patient with this National ID already exists', 409);
    }
  }

  const mrn = await generateMRN();

  const patient = await prisma.patient.create({
    data: {
      mrn,
      nationalId: data.nationalId || null,
      fullNameAr: data.fullNameAr,
      fullNameEn: data.fullNameEn || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender as 'MALE' | 'FEMALE',
      bloodType: data.bloodType as any || null,
      allergies: data.allergies || null,
      phone: data.phone || null,
      phone2: data.phone2 || null,
      email: data.email || null,
      address: data.address || null,
      city: data.city || null,
      emergencyContact: data.emergencyContact || null,
      emergencyPhone: data.emergencyPhone || null,
      notes: data.notes || null,
    },
  });

  return patient;
};

/**
 * Update patient data
 */
export const updatePatient = async (id: number, data: Record<string, unknown>) => {
  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Patient not found', 404);
  }

  // Check national ID uniqueness if being updated
  if (data.nationalId && data.nationalId !== existing.nationalId) {
    const dup = await prisma.patient.findUnique({
      where: { nationalId: data.nationalId as string },
    });
    if (dup) {
      throw new AppError('A patient with this National ID already exists', 409);
    }
  }

  // Transform dateOfBirth if provided
  if (data.dateOfBirth && typeof data.dateOfBirth === 'string') {
    data.dateOfBirth = new Date(data.dateOfBirth);
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: data as Prisma.PatientUpdateInput,
  });

  return patient;
};

/**
 * Soft delete a patient (set isActive to false)
 */
export const deletePatient = async (id: number) => {
  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Patient not found', 404);
  }

  await prisma.patient.update({
    where: { id },
    data: { isActive: false },
  });

  return { message: 'Patient deactivated successfully' };
};

/**
 * Get a patient's complete timeline (appointments, admissions, records, labs, radiology, prescriptions)
 */
export const getPatientTimeline = async (patientId: number) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  const [appointments, admissions, medicalRecords, labOrders, radiologyOrders, prescriptions] =
    await Promise.all([
      prisma.appointment.findMany({
        where: { patientId },
        orderBy: { scheduledAt: 'desc' },
        include: {
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
        },
      }),
      prisma.admission.findMany({
        where: { patientId },
        orderBy: { admittedAt: 'desc' },
        include: {
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
          bed: { include: { room: true } },
        },
      }),
      prisma.medicalRecord.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
        },
      }),
      prisma.labOrder.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
          results: { include: { test: true } },
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
        },
      }),
      prisma.radiologyOrder.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
          type: true,
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
        },
      }),
      prisma.prescription.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { medication: true } },
          doctor: { include: { employee: { select: { fullNameAr: true } } } },
        },
      }),
    ]);

  // Merge and sort by date
  type TimelineItem = {
    type: string;
    date: Date;
    data: unknown;
  };

  const timeline: TimelineItem[] = [
    ...appointments.map((a) => ({ type: 'appointment', date: a.scheduledAt, data: a })),
    ...admissions.map((a) => ({ type: 'admission', date: a.admittedAt, data: a })),
    ...medicalRecords.map((r) => ({ type: 'medical_record', date: r.createdAt, data: r })),
    ...labOrders.map((l) => ({ type: 'lab_order', date: l.createdAt, data: l })),
    ...radiologyOrders.map((r) => ({ type: 'radiology_order', date: r.createdAt, data: r })),
    ...prescriptions.map((p) => ({ type: 'prescription', date: p.createdAt, data: p })),
  ];

  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  return timeline;
};
