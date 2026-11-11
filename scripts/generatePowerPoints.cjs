const PptxGenJS = require('pptxgenjs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// Professional Hospital MIS Color Palette
// ═══════════════════════════════════════════════════════════════
const C = {
  bg:       '0C1929',  // Deep hospital navy
  card:     '132D4A',  // Card surface
  border:   '1B4065',  // Border accent
  primary:  '00A3E0',  // Medical sky blue (WHO standard)
  teal:     '009B8D',  // Teal (clinical)
  white:    'FFFFFF',
  light:    'D6E8F5',  // Light blue text
  muted:    '7FA7C7',  // Muted caption
  green:    '28A745',  // Success / health
  gold:     'F0C040',  // Academic gold
  red:      'DC3545',  // Alert / emergency
  dark:     '0A1628',  // Deepest bg
};

// ═══════════════════════════════════════════════════════════════
// Shared Helpers
// ═══════════════════════════════════════════════════════════════

function brandSlide(pptx, slide, num) {
  slide.background = { color: C.bg };
  // PptxGenJS does not support morph natively — use smooth fade
  slide.transition = { type: 'fade', duration: 0.7 };

  // Top cyan accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.08,
    fill: { color: C.primary }
  });

  // Footer line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6, y: 7.0, w: 12.1, h: 0,
    line: { color: C.border, width: 0.8 }
  });

  // Footer text
  slide.addText('PREPARED BY MEDEVAC TEAM', {
    x: 0.6, y: 7.05, w: 6, h: 0.3,
    fontFace: 'Calibri', fontSize: 9, color: C.primary, bold: true
  });
  slide.addText(`${num} / 10`, {
    x: 10, y: 7.05, w: 2.7, h: 0.3,
    fontFace: 'Calibri', fontSize: 9, color: C.muted, align: 'right'
  });
}

function sectionHeader(slide, textEn, textAr) {
  // Only English for English pres, both for bilingual — handled by caller
  slide.addText(textEn, {
    x: 0.6, y: 0.3, w: 12, h: 0.55,
    fontFace: 'Calibri', fontSize: 24, color: C.primary, bold: true
  });
  if (textAr) {
    slide.addText(textAr, {
      x: 0.6, y: 0.85, w: 12, h: 0.4,
      fontFace: 'Calibri', fontSize: 16, color: C.light
    });
  }
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6, y: textAr ? 1.3 : 0.95, w: 12.1, h: 0,
    line: { color: C.border, width: 1 }
  });
}

// We need pptx in scope for sectionHeader — will inline instead.

// ═══════════════════════════════════════════════════════════════
// BILINGUAL PRESENTATION (Arabic + English)
// ═══════════════════════════════════════════════════════════════
function buildBilingual() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MEDEVAC TEAM';
  pptx.title = 'Hospital Management Information System (MIS)';

  const hdr = (slide, en, ar) => {
    slide.addText(en, {
      x: 0.6, y: 0.3, w: 12, h: 0.55,
      fontFace: 'Calibri', fontSize: 24, color: C.primary, bold: true
    });
    slide.addText(ar, {
      x: 0.6, y: 0.82, w: 12, h: 0.4,
      fontFace: 'Calibri', fontSize: 15, color: C.light
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.6, y: 1.28, w: 12.1, h: 0,
      line: { color: C.border, width: 1 }
    });
  };

  // ── SLIDE 1 ── Title ──────────────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 1);

    // MEDEVAC TEAM Badge at Top
    s.addShape(pptx.ShapeType.roundRect, {
      x: 4.8, y: 0.5, w: 3.7, h: 0.5,
      fill: { color: C.dark },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.1
    });
    s.addText('MEDEVAC TEAM', {
      x: 4.8, y: 0.5, w: 3.7, h: 0.5,
      fontFace: 'Calibri', fontSize: 16, color: C.primary, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.25, w: 10.3, h: 4.9,
      fill: { color: C.card },
      line: { color: C.border, width: 1.5 },
      rectRadius: 0.2
    });

    s.addText('Hospital Management\nInformation System', {
      x: 1.8, y: 1.5, w: 9.7, h: 2.1,
      fontFace: 'Calibri', fontSize: 44, color: C.white, bold: true, align: 'center', lineSpacingMultiple: 1.1
    });

    s.addText('(HIS / MIS)', {
      x: 1.8, y: 3.45, w: 9.7, h: 0.65,
      fontFace: 'Calibri', fontSize: 28, color: C.primary, bold: true, align: 'center'
    });

    s.addText('نظام إدارة المعلومات الصحية في المستشفيات', {
      x: 1.8, y: 4.2, w: 9.7, h: 0.6,
      fontFace: 'Calibri', fontSize: 22, color: C.light, align: 'center'
    });

    // Dept & University
    s.addShape(pptx.ShapeType.roundRect, {
      x: 2.5, y: 5.15, w: 8.3, h: 0.7,
      fill: { color: C.dark },
      line: { color: C.primary, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Management Department  •  Faculty of Applied Health Sciences  •  Beni-Suef University', {
      x: 2.5, y: 5.15, w: 8.3, h: 0.7,
      fontFace: 'Calibri', fontSize: 13, color: C.primary, bold: true, align: 'center'
    });
  }

  // ── SLIDE 2 ── Team & Supervision ─────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 2);
    hdr(s, 'Project Team & Academic Supervision', 'فريق العمل والإشراف الأكاديمي');

    // Team Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 6.3, h: 5.0,
      fill: { color: C.card },
      line: { color: C.border, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText('PREPARED BY  MEDEVAC TEAM', {
      x: 0.9, y: 1.75, w: 5.7, h: 0.5,
      fontFace: 'Calibri', fontSize: 16, color: C.primary, bold: true
    });

    const names = [
      'Muhammed Wael Mohamed',
      'Ahmed Mohamed Abdelmageed',
      'Yazan Waleed',
      'Mariam Yasser',
      'Nayera Hussein',
    ];
    let ny = 2.5;
    names.forEach((n, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: ny, w: 5.7, h: 0.6,
        fill: { color: C.dark },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.  ${n}`, {
        x: 1.1, y: ny + 0.05, w: 5.3, h: 0.5,
        fontFace: 'Calibri', fontSize: 17, color: C.white, bold: true
      });
      ny += 0.72;
    });

    // Supervision Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.3, y: 1.55, w: 5.4, h: 5.0,
      fill: { color: C.card },
      line: { color: C.gold, width: 1.5 },
      rectRadius: 0.15
    });

    s.addText('UNDER THE SUPERVISION OF', {
      x: 7.6, y: 1.75, w: 4.8, h: 0.5,
      fontFace: 'Calibri', fontSize: 14, color: C.gold, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.6, y: 2.5, w: 4.8, h: 1.6,
      fill: { color: '1A1505' },
      line: { color: C.gold, width: 1 },
      rectRadius: 0.12
    });
    s.addText('Dr. Mahmoud Saad', {
      x: 7.6, y: 2.65, w: 4.8, h: 0.7,
      fontFace: 'Calibri', fontSize: 26, color: C.white, bold: true, align: 'center'
    });
    s.addText('Teaching Assistant (معيد المادة)', {
      x: 7.6, y: 3.35, w: 4.8, h: 0.5,
      fontFace: 'Calibri', fontSize: 15, color: C.gold, align: 'center'
    });

    s.addText([
      { text: 'Department:\n', options: { bold: true, color: C.primary, fontSize: 14 } },
      { text: 'Management Department\n\n', options: { color: C.light, fontSize: 14 } },
      { text: 'Faculty:\n', options: { bold: true, color: C.primary, fontSize: 14 } },
      { text: 'Faculty of Applied Health Sciences\n\n', options: { color: C.light, fontSize: 14 } },
      { text: 'University:\n', options: { bold: true, color: C.primary, fontSize: 14 } },
      { text: 'Beni-Suef University', options: { color: C.light, fontSize: 14 } },
    ], { x: 7.8, y: 4.3, w: 4.4, h: 2.2, fontFace: 'Calibri' });
  }

  // ── SLIDE 3 ── What is HIS/MIS? ───────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 3);
    hdr(s, 'What is a Hospital Information System?', 'ما هو نظام المعلومات الصحية في المستشفيات؟');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 12.1, h: 2.2,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText([
      { text: 'A Hospital Information System (HIS/MIS) ', options: { bold: true, color: C.primary, fontSize: 20 } },
      { text: 'is a comprehensive, integrated software system designed to manage all the aspects of a hospital\'s operation, including medical, administrative, financial, and legal functions.', options: { color: C.white, fontSize: 20 } },
    ], { x: 1.0, y: 1.7, w: 11.3, h: 1.0, fontFace: 'Calibri', lineSpacingMultiple: 1.2 });

    s.addText('نظام حاسوبي شامل ومتكامل مصمم لإدارة جميع جوانب العمل داخل المنشأة الصحية: الطبية والإدارية والمالية والقانونية.', {
      x: 1.0, y: 2.85, w: 11.3, h: 0.65,
      fontFace: 'Calibri', fontSize: 16, color: C.muted, lineSpacingMultiple: 1.2
    });

    // Key Objectives
    const objectives = [
      { en: 'Improve Patient Safety & Clinical Outcomes', ar: 'تحسين سلامة المرضى ونتائج العلاج' },
      { en: 'Streamline Administrative & Financial Workflows', ar: 'تنظيم سير العمل الإداري والمالي' },
      { en: 'Enable Evidence-Based Clinical Decision Making', ar: 'دعم القرارات الطبية المبنية على الأدلة' },
      { en: 'Ensure Regulatory Compliance & Data Security', ar: 'ضمان الامتثال التنظيمي وأمن البيانات' },
    ];

    let oy = 4.05;
    objectives.forEach((o, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y: oy, w: 12.1, h: 0.68,
        fill: { color: C.card },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText([
        { text: `${i + 1}.  ${o.en}`, options: { bold: true, color: C.white, fontSize: 17 } },
        { text: `    —  ${o.ar}`, options: { color: C.muted, fontSize: 13 } },
      ], { x: 0.9, y: oy + 0.08, w: 11.5, h: 0.5, fontFace: 'Calibri' });
      oy += 0.78;
    });
  }

  // ── SLIDE 4 ── Core Modules Overview ──────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 4);
    hdr(s, 'Core Modules of a Hospital MIS', 'الوحدات الأساسية لنظام المعلومات الصحية');

    const modules = [
      { name: 'Patient Registration\n(تسجيل المرضى)', color: C.primary },
      { name: 'Appointments\n(إدارة المواعيد)', color: '0E86C8' },
      { name: 'Inpatient & Beds\n(التنويم والأسرّة)', color: C.teal },
      { name: 'Electronic Medical\nRecords (EMR)', color: C.green },
      { name: 'Laboratory (LIS)\n(المختبر)', color: '7C3AED' },
      { name: 'Radiology (RIS)\n(الأشعة)', color: '8B5CF6' },
      { name: 'Pharmacy & Stock\n(الصيدلية والمخزون)', color: 'D97706' },
      { name: 'Billing & Finance\n(الفوترة والمالية)', color: 'DC2626' },
      { name: 'Insurance & Claims\n(التأمين والمطالبات)', color: 'B45309' },
      { name: 'HR & Staff\n(شؤون الموظفين)', color: '0D9488' },
      { name: 'Archive & DMS\n(الأرشيف والوثائق)', color: '0284C7' },
      { name: 'RBAC & Security\n(الأمان والصلاحيات)', color: C.red },
    ];

    modules.forEach((m, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 0.6 + col * 3.15;
      const y = 1.55 + row * 1.8;

      s.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.9, h: 1.55,
        fill: { color: C.card },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.12
      });

      s.addText(m.name, {
        x: x + 0.15, y: y + 0.2, w: 2.6, h: 1.1,
        fontFace: 'Calibri', fontSize: 15, color: C.white, bold: true, align: 'center', valign: 'middle'
      });
    });
  }

  // ── SLIDE 5 ── Patient Management & EHR ───────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 5);
    hdr(s, 'Patient Registration & Electronic Health Records', 'تسجيل المرضى والسجلات الطبية الإلكترونية');

    // Left column
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 5.9, h: 5.0,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText('Patient Registration Module\nوحدة تسجيل المرضى', {
      x: 0.9, y: 1.7, w: 5.3, h: 0.8,
      fontFace: 'Calibri', fontSize: 18, color: C.primary, bold: true
    });

    s.addText([
      { text: '•  Unique Medical Record Number (MRN) Generation\n', options: { fontSize: 16 } },
      { text: '•  Demographic & Contact Data Collection\n', options: { fontSize: 16 } },
      { text: '•  National ID Verification & Parsing\n', options: { fontSize: 16 } },
      { text: '•  Blood Type & Allergy Documentation\n', options: { fontSize: 16 } },
      { text: '•  Emergency Contact Registration\n', options: { fontSize: 16 } },
      { text: '•  Insurance Card Linkage\n', options: { fontSize: 16 } },
      { text: '•  Duplicate Patient Detection', options: { fontSize: 16 } },
    ], { x: 0.9, y: 2.65, w: 5.3, h: 3.6, fontFace: 'Calibri', color: C.light, lineSpacingMultiple: 1.4 });

    // Right column
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.55, w: 5.9, h: 5.0,
      fill: { color: C.card },
      line: { color: C.green, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText('Electronic Health Records (EHR)\nالسجلات الطبية الإلكترونية', {
      x: 7.1, y: 1.7, w: 5.3, h: 0.8,
      fontFace: 'Calibri', fontSize: 18, color: C.green, bold: true
    });

    s.addText([
      { text: '•  SOAP Clinical Documentation Format\n', options: { fontSize: 16 } },
      { text: '•  ICD-10 International Diagnosis Coding\n', options: { fontSize: 16 } },
      { text: '•  Complete Visit & Encounter History\n', options: { fontSize: 16 } },
      { text: '•  Vital Signs Monitoring & Charting\n', options: { fontSize: 16 } },
      { text: '•  Physician Order Entry (CPOE)\n', options: { fontSize: 16 } },
      { text: '•  Longitudinal Patient Timeline\n', options: { fontSize: 16 } },
      { text: '•  Secure Digital Archival', options: { fontSize: 16 } },
    ], { x: 7.1, y: 2.65, w: 5.3, h: 3.6, fontFace: 'Calibri', color: C.light, lineSpacingMultiple: 1.4 });
  }

  // ── SLIDE 6 ── Clinical Diagnostics ───────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 6);
    hdr(s, 'Clinical Diagnostics: LIS, RIS & Pharmacy', 'التشخيص الإكلينيكي: المختبر والأشعة والصيدلية');

    const cols = [
      {
        title: 'Laboratory (LIS)',
        ar: 'المختبر المركزي',
        color: '7C3AED',
        items: '•  CBC, Chemistry Panels\n•  Microbiology & Culture\n•  STAT vs Routine Priority\n•  Abnormal Result Alerts\n•  Auto-Verified Reporting',
      },
      {
        title: 'Radiology (RIS)',
        ar: 'الأشعة والتصوير',
        color: C.primary,
        items: '•  X-Ray, CT, MRI, U/S\n•  ECHO & ECG Modalities\n•  Radiologist Report Entry\n•  DICOM Image Integration\n•  Urgent Scan Prioritization',
      },
      {
        title: 'Pharmacy & Stock',
        ar: 'الصيدلية والمخزون الدوائي',
        color: C.teal,
        items: '•  E-Prescription Dispensing\n•  Drug-Allergy Interaction\n•  Min. Stock Threshold Alerts\n•  Controlled Drug Tracking\n•  Batch & Expiry Management',
      },
    ];

    cols.forEach((c, i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.55, w: 3.85, h: 5.0,
        fill: { color: C.card },
        line: { color: c.color, width: 1.5 },
        rectRadius: 0.15
      });
      s.addText(c.title, {
        x: x + 0.2, y: 1.75, w: 3.45, h: 0.5,
        fontFace: 'Calibri', fontSize: 20, color: C.white, bold: true, align: 'center'
      });
      s.addText(c.ar, {
        x: x + 0.2, y: 2.25, w: 3.45, h: 0.4,
        fontFace: 'Calibri', fontSize: 14, color: c.color, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.8, w: 3.05, h: 0,
        line: { color: C.border, width: 1 }
      });
      s.addText(c.items, {
        x: x + 0.3, y: 3.0, w: 3.25, h: 3.3,
        fontFace: 'Calibri', fontSize: 16, color: C.light, lineSpacingMultiple: 1.5
      });
    });
  }

  // ── SLIDE 7 ── Inpatient & Bed Management ─────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 7);
    hdr(s, 'Inpatient Admission & Bed Management', 'إدارة التنويم والطاقة الاستيعابية للأسرّة');

    // Left: Bed Matrix
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 7.0, h: 5.0,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText('Real-Time Bed Capacity Matrix\nمصفوفة الأسرّة اللحظية', {
      x: 0.9, y: 1.7, w: 6.4, h: 0.8,
      fontFace: 'Calibri', fontSize: 18, color: C.primary, bold: true
    });

    const wards = [
      { name: 'Intensive Care Unit (ICU) — العناية المركزة', color: C.red },
      { name: 'Emergency Ward — قسم الطوارئ والاستقبال', color: 'D97706' },
      { name: 'Surgical & General — الأقسام الداخلية والجراحة', color: C.green },
      { name: 'Private & Isolation — الإقامة الخاصة والعزل', color: C.primary },
    ];
    let wy = 2.65;
    wards.forEach(w => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: wy, w: 6.4, h: 0.7,
        fill: { color: C.dark },
        line: { color: w.color, width: 1 },
        rectRadius: 0.08
      });
      s.addText(w.name, {
        x: 1.1, y: wy + 0.1, w: 6.0, h: 0.5,
        fontFace: 'Calibri', fontSize: 16, color: C.white, bold: true
      });
      wy += 0.85;
    });

    // Right: Functions
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.55, w: 4.8, h: 5.0,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Key Functions\nالوظائف الرئيسية', {
      x: 8.2, y: 1.7, w: 4.2, h: 0.7,
      fontFace: 'Calibri', fontSize: 18, color: C.teal, bold: true
    });

    s.addText([
      { text: '•  Admission, Transfer & Discharge (ADT)\n\n', options: { fontSize: 16 } },
      { text: '•  Bed Availability Color Coding\n\n', options: { fontSize: 16 } },
      { text: '•  Ward Census & Occupancy Rate\n\n', options: { fontSize: 16 } },
      { text: '•  Housekeeping Status Tracking\n\n', options: { fontSize: 16 } },
      { text: '•  Inter-Ward Patient Transfers\n\n', options: { fontSize: 16 } },
      { text: '•  Discharge Summary & Billing', options: { fontSize: 16 } },
    ], { x: 8.2, y: 2.55, w: 4.2, h: 3.8, fontFace: 'Calibri', color: C.light });
  }

  // ── SLIDE 8 ── Financial Management ───────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 8);
    hdr(s, 'Financial Management & Medical Billing', 'الإدارة المالية والفوترة الطبية');

    const pillars = [
      {
        title: 'Revenue Cycle\nManagement',
        ar: 'إدارة دورة الإيرادات',
        color: C.primary,
        desc: '•  Auto-consolidation of all\n   service charges into one\n   unified patient invoice\n\n•  Real-time revenue tracking\n   and shift-end reconciliation',
      },
      {
        title: 'Multi-Channel\nPayment',
        ar: 'تعدد قنوات السداد',
        color: C.teal,
        desc: '•  Cash, Credit Card, and\n   Medical Insurance support\n\n•  Automated co-pay and\n   deductible calculation\n\n•  Digital receipt issuance',
      },
      {
        title: 'Insurance Claims\nProcessing',
        ar: 'معالجة مطالبات التأمين',
        color: C.gold,
        desc: '•  Pre-authorization and\n   eligibility verification\n\n•  Claim submission tracking\n\n•  Denial management and\n   appeals workflow',
      },
    ];

    pillars.forEach((p, i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.55, w: 3.85, h: 5.0,
        fill: { color: C.card },
        line: { color: p.color, width: 1.5 },
        rectRadius: 0.15
      });
      s.addText(p.title, {
        x: x + 0.2, y: 1.7, w: 3.45, h: 0.9,
        fontFace: 'Calibri', fontSize: 20, color: C.white, bold: true, align: 'center'
      });
      s.addText(p.ar, {
        x: x + 0.2, y: 2.6, w: 3.45, h: 0.4,
        fontFace: 'Calibri', fontSize: 14, color: p.color, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 3.15, w: 3.05, h: 0,
        line: { color: C.border, width: 1 }
      });
      s.addText(p.desc, {
        x: x + 0.3, y: 3.3, w: 3.25, h: 3.0,
        fontFace: 'Calibri', fontSize: 15, color: C.light, lineSpacingMultiple: 1.3
      });
    });
  }

  // ── SLIDE 9 ── Security & RBAC ────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 9);
    hdr(s, 'System Security & Role-Based Access Control', 'أمان النظام وإدارة الصلاحيات المتعددة');

    // RBAC Matrix
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 6.8, h: 5.0,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });

    s.addText('Role-Based Access Control (RBAC)\nنظام التحكم بالصلاحيات حسب الدور الوظيفي', {
      x: 0.9, y: 1.7, w: 6.2, h: 0.8,
      fontFace: 'Calibri', fontSize: 17, color: C.primary, bold: true
    });

    const roles = [
      { role: 'System Administrator', access: 'Full system authority, user management, audit logs', color: C.gold },
      { role: 'Physicians & Clinicians', access: 'EHR, diagnosis, lab/radiology orders, prescriptions', color: C.primary },
      { role: 'Nursing Staff', access: 'Vital signs, medication administration, care plans', color: C.teal },
      { role: 'Reception & Billing', access: 'Patient intake, appointments, invoicing, payments', color: C.green },
    ];
    let ry = 2.65;
    roles.forEach(r => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: ry, w: 6.2, h: 0.75,
        fill: { color: C.dark },
        line: { color: r.color, width: 1 },
        rectRadius: 0.08
      });
      s.addText([
        { text: `${r.role}\n`, options: { bold: true, color: r.color, fontSize: 15 } },
        { text: r.access, options: { color: C.light, fontSize: 13 } },
      ], { x: 1.1, y: ry + 0.07, w: 5.8, h: 0.6, fontFace: 'Calibri' });
      ry += 0.88;
    });

    // Architecture
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.7, y: 1.55, w: 5.0, h: 5.0,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Security Architecture\nمعمارية الأمان', {
      x: 8.0, y: 1.7, w: 4.4, h: 0.7,
      fontFace: 'Calibri', fontSize: 17, color: C.teal, bold: true
    });

    s.addText([
      { text: '•  Encrypted Authentication\n\n', options: { bold: true, fontSize: 16 } },
      { text: '•  Session-Based Access Tokens\n\n', options: { fontSize: 16 } },
      { text: '•  Granular Module Permissions\n   (14 independent modules)\n\n', options: { fontSize: 16 } },
      { text: '•  Complete Audit Trail Logging\n\n', options: { fontSize: 16 } },
      { text: '•  Data Encryption at Rest\n   and in Transit\n\n', options: { fontSize: 16 } },
      { text: '•  HIPAA Compliance Standards', options: { fontSize: 16 } },
    ], { x: 8.0, y: 2.55, w: 4.4, h: 3.8, fontFace: 'Calibri', color: C.light });
  }

  // ── SLIDE 10 ── Benefits & References ─────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 10);
    hdr(s, 'Benefits of HIS Implementation & References', 'فوائد تطبيق النظام والمراجع العلمية');

    // Benefits
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.55, w: 6.2, h: 5.0,
      fill: { color: C.card },
      line: { color: C.green, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Key Benefits of HIS\nالفوائد الرئيسية لنظام المعلومات الصحية', {
      x: 0.9, y: 1.7, w: 5.6, h: 0.8,
      fontFace: 'Calibri', fontSize: 17, color: C.green, bold: true
    });

    const benefits = [
      'Reduced Medical Errors & Improved Patient Safety',
      '100% Paperless Clinical Documentation',
      'Faster Clinical Decision-Making (Sub-Second EHR)',
      'Transparent Revenue Cycle & Zero Billing Leakage',
      'Regulatory Compliance (HIPAA, WHO Standards)',
      'Interoperability & Cross-Department Data Flow',
    ];
    let by = 2.65;
    benefits.forEach((b, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: by, w: 5.6, h: 0.55,
        fill: { color: C.dark },
        line: { color: C.border, width: 1 },
        rectRadius: 0.06
      });
      s.addText(`${i + 1}.  ${b}`, {
        x: 1.1, y: by + 0.06, w: 5.2, h: 0.42,
        fontFace: 'Calibri', fontSize: 14, color: C.white, bold: true
      });
      by += 0.65;
    });

    // References
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: 1.55, w: 5.6, h: 5.0,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Academic References\nالمراجع العلمية المعتمدة', {
      x: 7.4, y: 1.7, w: 5.0, h: 0.8,
      fontFace: 'Calibri', fontSize: 17, color: C.primary, bold: true
    });

    s.addText([
      { text: '1. ', options: { bold: true, color: C.primary } },
      { text: 'HIMSS EMRAM: Electronic Medical Record Adoption Model (Stage 6/7).\n\n' },
      { text: '2. ', options: { bold: true, color: C.primary } },
      { text: 'WHO: Global Strategy on Digital Health 2020–2025.\n\n' },
      { text: '3. ', options: { bold: true, color: C.primary } },
      { text: 'HL7 FHIR R4: Health Level Seven International, Fast Healthcare Interoperability Resources.\n\n' },
      { text: '4. ', options: { bold: true, color: C.primary } },
      { text: 'Shortliffe & Cimino, Biomedical Informatics (Springer, 4th Ed.).\n\n' },
      { text: '5. ', options: { bold: true, color: C.primary } },
      { text: 'Wager, Lee & Glaser, Health Care Information Systems (Jossey-Bass, 4th Ed.).' },
    ], { x: 7.4, y: 2.65, w: 5.0, h: 3.7, fontFace: 'Calibri', fontSize: 13, color: C.light, lineSpacingMultiple: 1.2 });
  }

  return pptx;
}

// ═══════════════════════════════════════════════════════════════
// ENGLISH-ONLY PRESENTATION
// ═══════════════════════════════════════════════════════════════
function buildEnglish() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MEDEVAC TEAM';
  pptx.title = 'Hospital Management Information System (MIS)';

  const hdr = (slide, en) => {
    slide.addText(en, {
      x: 0.6, y: 0.3, w: 12, h: 0.6,
      fontFace: 'Calibri', fontSize: 26, color: C.primary, bold: true
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.6, y: 0.98, w: 12.1, h: 0,
      line: { color: C.border, width: 1 }
    });
  };

  // ── SLIDE 1 ── Title ──────────────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 1);

    // MEDEVAC TEAM Badge at Top
    s.addShape(pptx.ShapeType.roundRect, {
      x: 4.8, y: 0.5, w: 3.7, h: 0.5,
      fill: { color: C.dark },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.1
    });
    s.addText('MEDEVAC TEAM', {
      x: 4.8, y: 0.5, w: 3.7, h: 0.5,
      fontFace: 'Calibri', fontSize: 16, color: C.primary, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.5, y: 1.25, w: 10.3, h: 4.8,
      fill: { color: C.card },
      line: { color: C.border, width: 1.5 },
      rectRadius: 0.2
    });

    s.addText('Hospital Management\nInformation System', {
      x: 1.8, y: 1.6, w: 9.7, h: 2.2,
      fontFace: 'Calibri', fontSize: 46, color: C.white, bold: true, align: 'center', lineSpacingMultiple: 1.1
    });

    s.addText('(HIS / MIS)', {
      x: 1.8, y: 3.6, w: 9.7, h: 0.7,
      fontFace: 'Calibri', fontSize: 30, color: C.primary, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 2.5, y: 4.8, w: 8.3, h: 0.7,
      fill: { color: C.dark },
      line: { color: C.primary, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Management Department  •  Faculty of Applied Health Sciences  •  Beni-Suef University', {
      x: 2.5, y: 4.8, w: 8.3, h: 0.7,
      fontFace: 'Calibri', fontSize: 14, color: C.primary, bold: true, align: 'center'
    });
  }

  // ── SLIDE 2 ── Team & Supervision ─────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 2);
    hdr(s, 'Project Team & Academic Supervision');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 6.3, h: 5.3,
      fill: { color: C.card },
      line: { color: C.border, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('PREPARED BY  MEDEVAC TEAM', {
      x: 0.9, y: 1.5, w: 5.7, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.primary, bold: true
    });

    const names = [
      'Muhammed Wael Mohamed',
      'Ahmed Mohamed Abdelmageed',
      'Yazan Waleed',
      'Mariam Yasser',
      'Nayera Hussein',
    ];
    let ny = 2.3;
    names.forEach((n, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: ny, w: 5.7, h: 0.65,
        fill: { color: C.dark },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.  ${n}`, {
        x: 1.15, y: ny + 0.08, w: 5.2, h: 0.5,
        fontFace: 'Calibri', fontSize: 18, color: C.white, bold: true
      });
      ny += 0.78;
    });

    // Supervision
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.3, y: 1.3, w: 5.4, h: 5.3,
      fill: { color: C.card },
      line: { color: C.gold, width: 1.5 },
      rectRadius: 0.15
    });
    s.addText('UNDER THE SUPERVISION OF', {
      x: 7.6, y: 1.5, w: 4.8, h: 0.5,
      fontFace: 'Calibri', fontSize: 15, color: C.gold, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.7, y: 2.3, w: 4.6, h: 1.5,
      fill: { color: '1A1505' },
      line: { color: C.gold, width: 1 },
      rectRadius: 0.12
    });
    s.addText('Dr. Mahmoud Saad', {
      x: 7.7, y: 2.45, w: 4.6, h: 0.7,
      fontFace: 'Calibri', fontSize: 28, color: C.white, bold: true, align: 'center'
    });
    s.addText('Teaching Assistant', {
      x: 7.7, y: 3.15, w: 4.6, h: 0.45,
      fontFace: 'Calibri', fontSize: 16, color: C.gold, align: 'center'
    });

    s.addText([
      { text: 'Department: ', options: { bold: true, color: C.primary, fontSize: 15 } },
      { text: 'Management Department\n\n', options: { fontSize: 15 } },
      { text: 'Faculty: ', options: { bold: true, color: C.primary, fontSize: 15 } },
      { text: 'Faculty of Applied Health Sciences\n\n', options: { fontSize: 15 } },
      { text: 'University: ', options: { bold: true, color: C.primary, fontSize: 15 } },
      { text: 'Beni-Suef University', options: { fontSize: 15 } },
    ], { x: 7.9, y: 4.1, w: 4.2, h: 2.3, fontFace: 'Calibri', color: C.light });
  }

  // ── SLIDE 3 ── What is HIS/MIS? ───────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 3);
    hdr(s, 'What is a Hospital Information System?');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 12.1, h: 1.8,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText([
      { text: 'A Hospital Information System (HIS) ', options: { bold: true, color: C.primary, fontSize: 22 } },
      { text: 'is a comprehensive, integrated software platform designed to manage all aspects of a hospital\'s operation — medical, administrative, financial, and legal — through a centralized digital infrastructure.', options: { color: C.white, fontSize: 20 } },
    ], { x: 1.0, y: 1.45, w: 11.3, h: 1.4, fontFace: 'Calibri', lineSpacingMultiple: 1.2 });

    const objs = [
      'Improve Patient Safety & Clinical Outcomes',
      'Streamline Administrative & Financial Workflows',
      'Enable Evidence-Based Clinical Decision Making',
      'Ensure Regulatory Compliance & Data Security',
      'Facilitate Inter-Department Communication & Data Flow',
    ];
    let oy = 3.4;
    objs.forEach((o, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y: oy, w: 12.1, h: 0.7,
        fill: { color: C.card },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.   ${o}`, {
        x: 0.9, y: oy + 0.1, w: 11.5, h: 0.5,
        fontFace: 'Calibri', fontSize: 19, color: C.white, bold: true
      });
      oy += 0.82;
    });
  }

  // ── SLIDE 4 ── Core Modules ───────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 4);
    hdr(s, 'Core Modules of a Hospital MIS');

    const modules = [
      { name: 'Patient\nRegistration', color: C.primary },
      { name: 'Appointment\nScheduling', color: '0E86C8' },
      { name: 'Inpatient &\nBed Management', color: C.teal },
      { name: 'Electronic Medical\nRecords (EMR)', color: C.green },
      { name: 'Laboratory\nSystem (LIS)', color: '7C3AED' },
      { name: 'Radiology\nSystem (RIS)', color: '8B5CF6' },
      { name: 'Pharmacy &\nStock Control', color: 'D97706' },
      { name: 'Billing &\nFinance', color: 'DC2626' },
      { name: 'Insurance &\nClaims', color: 'B45309' },
      { name: 'HR & Staff\nManagement', color: '0D9488' },
      { name: 'Document\nArchive (DMS)', color: '0284C7' },
      { name: 'RBAC &\nSecurity', color: C.red },
    ];

    modules.forEach((m, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 0.6 + col * 3.15;
      const y = 1.3 + row * 1.85;

      s.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.9, h: 1.6,
        fill: { color: C.card },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.12
      });
      s.addText(m.name, {
        x: x + 0.15, y: y + 0.2, w: 2.6, h: 1.2,
        fontFace: 'Calibri', fontSize: 17, color: C.white, bold: true, align: 'center', valign: 'middle'
      });
    });
  }

  // ── SLIDE 5 ── Patient & EHR ──────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 5);
    hdr(s, 'Patient Registration & Electronic Health Records');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 5.9, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Patient Registration', {
      x: 0.9, y: 1.45, w: 5.3, h: 0.55,
      fontFace: 'Calibri', fontSize: 22, color: C.primary, bold: true
    });
    s.addText([
      { text: '•  Unique MRN Generation\n\n' },
      { text: '•  Demographics & Contact Data\n\n' },
      { text: '•  National ID Verification\n\n' },
      { text: '•  Blood Type & Allergy Flags\n\n' },
      { text: '•  Emergency Contact Records\n\n' },
      { text: '•  Insurance Card Linkage\n\n' },
      { text: '•  Duplicate Detection' },
    ], { x: 0.9, y: 2.15, w: 5.3, h: 4.2, fontFace: 'Calibri', fontSize: 17, color: C.light, lineSpacingMultiple: 1.1 });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.3, w: 5.9, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Electronic Health Records (EHR)', {
      x: 7.1, y: 1.45, w: 5.3, h: 0.55,
      fontFace: 'Calibri', fontSize: 22, color: C.green, bold: true
    });
    s.addText([
      { text: '•  SOAP Clinical Documentation\n\n' },
      { text: '•  ICD-10 Diagnosis Coding\n\n' },
      { text: '•  Visit & Encounter History\n\n' },
      { text: '•  Vital Signs Charting\n\n' },
      { text: '•  Physician Order Entry (CPOE)\n\n' },
      { text: '•  Longitudinal Patient Timeline\n\n' },
      { text: '•  Secure Digital Archival' },
    ], { x: 7.1, y: 2.15, w: 5.3, h: 4.2, fontFace: 'Calibri', fontSize: 17, color: C.light, lineSpacingMultiple: 1.1 });
  }

  // ── SLIDE 6 ── Diagnostics ────────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 6);
    hdr(s, 'Clinical Diagnostics: LIS, RIS & Pharmacy');

    const cols = [
      {
        title: 'Laboratory (LIS)',
        color: '7C3AED',
        items: '•  CBC, Chemistry Panels\n\n•  Microbiology & Culture\n\n•  STAT vs Routine Priority\n\n•  Abnormal Result Alerts\n\n•  Auto-Verified Reporting',
      },
      {
        title: 'Radiology (RIS)',
        color: C.primary,
        items: '•  X-Ray, CT, MRI, U/S\n\n•  ECHO & ECG Modalities\n\n•  Radiologist Report Entry\n\n•  DICOM Image Integration\n\n•  Urgent Scan Prioritization',
      },
      {
        title: 'Pharmacy & Stock',
        color: C.teal,
        items: '•  E-Prescription Dispensing\n\n•  Drug-Allergy Cross-Check\n\n•  Min. Stock Threshold Alert\n\n•  Controlled Drug Tracking\n\n•  Batch & Expiry Audit',
      },
    ];
    cols.forEach((c, i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.3, w: 3.85, h: 5.3,
        fill: { color: C.card },
        line: { color: c.color, width: 1.5 },
        rectRadius: 0.15
      });
      s.addText(c.title, {
        x: x + 0.2, y: 1.5, w: 3.45, h: 0.6,
        fontFace: 'Calibri', fontSize: 22, color: C.white, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.25, w: 3.05, h: 0,
        line: { color: C.border, width: 1 }
      });
      s.addText(c.items, {
        x: x + 0.3, y: 2.45, w: 3.25, h: 3.9,
        fontFace: 'Calibri', fontSize: 17, color: C.light, lineSpacingMultiple: 1.1
      });
    });
  }

  // ── SLIDE 7 ── Inpatient & Beds ───────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 7);
    hdr(s, 'Inpatient Admission & Bed Management');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 7.0, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Real-Time Bed Capacity Matrix', {
      x: 0.9, y: 1.5, w: 6.4, h: 0.55,
      fontFace: 'Calibri', fontSize: 20, color: C.primary, bold: true
    });

    const wards = [
      { name: 'Intensive Care Unit (ICU)', color: C.red },
      { name: 'Emergency & Trauma Ward', color: 'D97706' },
      { name: 'Surgical & General Inpatient', color: C.green },
      { name: 'Private & Isolation Suites', color: C.primary },
    ];
    let wy = 2.25;
    wards.forEach(w => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: wy, w: 6.4, h: 0.75,
        fill: { color: C.dark },
        line: { color: w.color, width: 1 },
        rectRadius: 0.08
      });
      s.addText(w.name, {
        x: 1.15, y: wy + 0.12, w: 5.9, h: 0.5,
        fontFace: 'Calibri', fontSize: 18, color: C.white, bold: true
      });
      wy += 0.9;
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.3, w: 4.8, h: 5.3,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Key Functions', {
      x: 8.2, y: 1.5, w: 4.2, h: 0.5,
      fontFace: 'Calibri', fontSize: 20, color: C.teal, bold: true
    });
    s.addText([
      { text: '•  Admission, Transfer &\n   Discharge (ADT)\n\n' },
      { text: '•  Bed Color-Coded Status\n\n' },
      { text: '•  Ward Census & Occupancy\n\n' },
      { text: '•  Housekeeping Tracking\n\n' },
      { text: '•  Inter-Ward Transfers\n\n' },
      { text: '•  Discharge Summary & Billing' },
    ], { x: 8.2, y: 2.15, w: 4.2, h: 4.2, fontFace: 'Calibri', fontSize: 17, color: C.light, lineSpacingMultiple: 1.1 });
  }

  // ── SLIDE 8 ── Financial ──────────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 8);
    hdr(s, 'Financial Management & Medical Billing');

    const pillars = [
      {
        title: 'Revenue Cycle\nManagement',
        color: C.primary,
        desc: '•  Auto-consolidation of all\n   service charges into one\n   unified patient invoice\n\n•  Real-time revenue tracking\n   and reconciliation reports',
      },
      {
        title: 'Multi-Channel\nPayment',
        color: C.teal,
        desc: '•  Cash, Credit Card, and\n   Medical Insurance support\n\n•  Co-pay and deductible\n   calculation\n\n•  Digital receipt issuance',
      },
      {
        title: 'Insurance Claims\nProcessing',
        color: C.gold,
        desc: '•  Pre-authorization and\n   eligibility verification\n\n•  Claim submission tracking\n\n•  Denial management and\n   appeals workflow',
      },
    ];
    pillars.forEach((p, i) => {
      const x = 0.6 + i * 4.15;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.3, w: 3.85, h: 5.3,
        fill: { color: C.card },
        line: { color: p.color, width: 1.5 },
        rectRadius: 0.15
      });
      s.addText(p.title, {
        x: x + 0.2, y: 1.5, w: 3.45, h: 1.0,
        fontFace: 'Calibri', fontSize: 22, color: C.white, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.65, w: 3.05, h: 0,
        line: { color: C.border, width: 1 }
      });
      s.addText(p.desc, {
        x: x + 0.3, y: 2.85, w: 3.25, h: 3.5,
        fontFace: 'Calibri', fontSize: 16, color: C.light, lineSpacingMultiple: 1.3
      });
    });
  }

  // ── SLIDE 9 ── Security & RBAC ────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 9);
    hdr(s, 'System Security & Role-Based Access Control');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 6.8, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Role-Based Access Control (RBAC)', {
      x: 0.9, y: 1.5, w: 6.2, h: 0.55,
      fontFace: 'Calibri', fontSize: 20, color: C.primary, bold: true
    });

    const roles = [
      { role: 'System Administrator', access: 'Full authority, user management, audit logs', color: C.gold },
      { role: 'Physicians & Clinicians', access: 'EHR, diagnosis, orders, prescriptions', color: C.primary },
      { role: 'Nursing Staff', access: 'Vital signs, medication, care plans', color: C.teal },
      { role: 'Reception & Billing', access: 'Intake, appointments, invoicing, payments', color: C.green },
    ];
    let ry = 2.25;
    roles.forEach(r => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: ry, w: 6.2, h: 0.8,
        fill: { color: C.dark },
        line: { color: r.color, width: 1 },
        rectRadius: 0.08
      });
      s.addText([
        { text: `${r.role}\n`, options: { bold: true, color: r.color, fontSize: 17 } },
        { text: r.access, options: { color: C.light, fontSize: 14 } },
      ], { x: 1.15, y: ry + 0.08, w: 5.7, h: 0.65, fontFace: 'Calibri' });
      ry += 0.95;
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.7, y: 1.3, w: 5.0, h: 5.3,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Security Architecture', {
      x: 8.0, y: 1.5, w: 4.4, h: 0.5,
      fontFace: 'Calibri', fontSize: 20, color: C.teal, bold: true
    });
    s.addText([
      { text: '•  Encrypted Authentication\n\n' },
      { text: '•  Session-Based Access Tokens\n\n' },
      { text: '•  Granular Module-Level\n   Permissions\n\n' },
      { text: '•  Complete Audit Trail Logging\n\n' },
      { text: '•  Data Encryption at Rest\n   and in Transit\n\n' },
      { text: '•  HIPAA Compliance Standards' },
    ], { x: 8.0, y: 2.2, w: 4.4, h: 4.2, fontFace: 'Calibri', fontSize: 17, color: C.light, lineSpacingMultiple: 1.1 });
  }

  // ── SLIDE 10 ── Benefits & References ─────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 10);
    hdr(s, 'Benefits of HIS Implementation & References');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 1.3, w: 6.2, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Key Benefits', {
      x: 0.9, y: 1.5, w: 5.6, h: 0.5,
      fontFace: 'Calibri', fontSize: 22, color: C.green, bold: true
    });

    const bens = [
      'Reduced Medical Errors & Improved Safety',
      '100% Paperless Clinical Documentation',
      'Faster Clinical Decision-Making',
      'Transparent Revenue & Zero Billing Leakage',
      'Regulatory Compliance (HIPAA, WHO)',
      'Cross-Department Data Interoperability',
    ];
    let by = 2.2;
    bens.forEach((b, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.9, y: by, w: 5.6, h: 0.6,
        fill: { color: C.dark },
        line: { color: C.border, width: 1 },
        rectRadius: 0.06
      });
      s.addText(`${i + 1}.  ${b}`, {
        x: 1.15, y: by + 0.08, w: 5.1, h: 0.44,
        fontFace: 'Calibri', fontSize: 16, color: C.white, bold: true
      });
      by += 0.72;
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: 1.3, w: 5.6, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.2 },
      rectRadius: 0.15
    });
    s.addText('Academic References', {
      x: 7.4, y: 1.5, w: 5.0, h: 0.5,
      fontFace: 'Calibri', fontSize: 22, color: C.primary, bold: true
    });
    s.addText([
      { text: '1.  ', options: { bold: true, color: C.primary } },
      { text: 'HIMSS EMRAM: Electronic Medical Record Adoption Model.\n\n' },
      { text: '2.  ', options: { bold: true, color: C.primary } },
      { text: 'WHO: Global Strategy on Digital Health 2020–2025.\n\n' },
      { text: '3.  ', options: { bold: true, color: C.primary } },
      { text: 'HL7 FHIR R4: Fast Healthcare Interoperability Resources.\n\n' },
      { text: '4.  ', options: { bold: true, color: C.primary } },
      { text: 'Shortliffe & Cimino, Biomedical Informatics (Springer).\n\n' },
      { text: '5.  ', options: { bold: true, color: C.primary } },
      { text: 'Wager, Lee & Glaser, Health Care Information Systems (Jossey-Bass).' },
    ], { x: 7.4, y: 2.2, w: 5.0, h: 4.2, fontFace: 'Calibri', fontSize: 14, color: C.light, lineSpacingMultiple: 1.25 });
  }

  return pptx;
}

// ═══════════════════════════════════════════════════════════════
// INJECT NATIVE MORPH TRANSITIONS
// ═══════════════════════════════════════════════════════════════
async function injectMorph(filePath) {
  const JSZip = require('jszip');
  const fs = require('fs');
  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);

  const morphXml = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">' +
    '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">' +
    '<p:transition spd="slow" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" p14:dur="1500">' +
    '<p159:morph option="byObject"/>' +
    '</p:transition>' +
    '</mc:Choice>' +
    '<mc:Fallback>' +
    '<p:transition spd="slow">' +
    '<p:fade/>' +
    '</p:transition>' +
    '</mc:Fallback>' +
    '</mc:AlternateContent>';

  const slideFiles = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f));
  for (const slidePath of slideFiles) {
    let xml = await zip.file(slidePath).async('string');

    // Add namespaces to <p:sld>
    if (!xml.includes('xmlns:mc=')) {
      xml = xml.replace('<p:sld ', '<p:sld xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" mc:Ignorable="p14 p159" ');
    }

    // Remove any existing transition or AlternateContent
    xml = xml.replace(/<mc:AlternateContent[\s\S]*?<\/mc:AlternateContent>/g, '');
    xml = xml.replace(/<p:transition[\s\S]*?<\/p:transition>/g, '');

    // Insert Morph right after <p:clrMapOvr>...</p:clrMapOvr>
    if (xml.includes('</p:clrMapOvr>')) {
      xml = xml.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + morphXml);
    } else {
      xml = xml.replace('</p:sld>', morphXml + '</p:sld>');
    }

    zip.file(slidePath, xml);
  }

  const outBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(filePath, outBuf);
  console.log(`  ✓ Morph transitions injected into ${slideFiles.length} slides for ${path.basename(filePath)}`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
  const desktop = 'C:\\Users\\Emak\\Desktop';

  console.log('Building Bilingual (Arabic + English) Presentation...');
  const bi = buildBilingual();
  const biPath = path.join(desktop, 'MEDEVAC_MIS_Presentation_Bilingual.pptx');
  await bi.writeFile({ fileName: biPath });
  console.log('  → Saved:', biPath);
  await injectMorph(biPath);

  console.log('Building English-Only Presentation...');
  const en = buildEnglish();
  const enPath = path.join(desktop, 'MEDEVAC_MIS_Presentation_English.pptx');
  await en.writeFile({ fileName: enPath });
  console.log('  → Saved:', enPath);
  await injectMorph(enPath);

  // Copy to public for website download
  const fs = require('fs');
  const pubDir = path.join(__dirname, '..', 'public');
  fs.copyFileSync(biPath, path.join(pubDir, 'MEDEVAC_MIS_Presentation_Bilingual.pptx'));
  fs.copyFileSync(enPath, path.join(pubDir, 'MEDEVAC_MIS_Presentation_English.pptx'));
  console.log('  → Copied to public/ for website download.');
  console.log('\nDone! Both presentations generated successfully with native Morph transitions.');
}

main().catch(err => { console.error(err); process.exit(1); });
