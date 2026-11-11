const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// Modern Hospital MIS Light Color Palette (Mayo/Cerner Medical Style)
// ═══════════════════════════════════════════════════════════════
const C = {
  bg:          'F8FAFC',  // Crisp off-white medical slate
  card:        'FFFFFF',  // Pure white card surface
  cardAlt:     'F1F5F9',  // Light tint for inner boxes
  cardBlue:    'F0F9FF',  // Subtle sky blue tint
  cardTeal:    'F0FDF4',  // Subtle medical green tint
  border:      'CBD5E1',  // Clean slate border
  borderSoft:  'E2E8F0',  // Soft divider
  primary:     '0284C7',  // Clinical sky blue (WHO standard)
  primaryDark: '0369A1',  // Deep ocean blue
  navy:        '0F172A',  // Deep slate navy for high-contrast titles
  slate:       '334155',  // Charcoal for readable body text
  muted:       '64748B',  // Muted caption
  teal:        '0D9488',  // Clinical teal
  green:       '16A34A',  // Health green
  gold:        'D97706',  // Academic amber / gold
  goldBg:      'FFFBEB',  // Light amber card
  red:         'DC2626',  // Emergency red
};

// ═══════════════════════════════════════════════════════════════
// Shared Layout Helper (STRICT LAYOUT_WIDE: 13.333 x 7.5 inches)
// ═══════════════════════════════════════════════════════════════
function brandSlide(pptx, slide, num) {
  slide.background = { color: C.bg };

  // Top Sky Blue Accent Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.08,
    fill: { color: C.primary }
  });

  // Footer Line
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 6.9, w: 11.73, h: 0,
    line: { color: C.border, width: 0.8 }
  });

  // Footer Text
  slide.addText('PREPARED BY MEDEVAC TEAM', {
    x: 0.8, y: 6.95, w: 6.0, h: 0.35,
    fontFace: 'Calibri', fontSize: 10, color: C.primaryDark, bold: true
  });
  slide.addText(`${num} / 10`, {
    x: 9.8, y: 6.95, w: 2.73, h: 0.35,
    fontFace: 'Calibri', fontSize: 10, color: C.muted, align: 'right'
  });
}

function headerBilingual(slide, en, ar) {
  slide.addText(en, {
    x: 0.8, y: 0.35, w: 11.73, h: 0.45,
    fontFace: 'Calibri', fontSize: 22, color: C.navy, bold: true
  });
  slide.addText(ar, {
    x: 0.8, y: 0.8, w: 11.73, h: 0.35,
    fontFace: 'Calibri', fontSize: 14, color: C.primaryDark, bold: true
  });
  slide.addShape('line', {
    x: 0.8, y: 1.2, w: 11.73, h: 0,
    line: { color: C.border, width: 1 }
  });
}

function headerEnglish(slide, en) {
  slide.addText(en, {
    x: 0.8, y: 0.4, w: 11.73, h: 0.55,
    fontFace: 'Calibri', fontSize: 24, color: C.navy, bold: true
  });
  slide.addShape('line', {
    x: 0.8, y: 1.05, w: 11.73, h: 0,
    line: { color: C.border, width: 1 }
  });
}

// ═══════════════════════════════════════════════════════════════
// 1. BILINGUAL PRESENTATION (Arabic + English)
// ═══════════════════════════════════════════════════════════════
function buildBilingual() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'MEDEVAC TEAM';
  pptx.title = 'Hospital Management Information System (MIS)';

  // ── SLIDE 1 ── Title Slide ───────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 1);

    // Team Pill at Top (Replaces old 5-min briefing badge)
    s.addShape(pptx.ShapeType.roundRect, {
      x: 4.8, y: 0.55, w: 3.73, h: 0.45,
      fill: { color: C.cardBlue },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.1
    });
    s.addText('MEDEVAC TEAM', {
      x: 4.8, y: 0.55, w: 3.73, h: 0.45,
      fontFace: 'Calibri', fontSize: 15, color: C.primaryDark, bold: true, align: 'center'
    });

    // Main Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 1.25, w: 11.33, h: 5.3,
      fill: { color: C.card },
      line: { color: C.border, width: 1.5 },
      rectRadius: 0.15
    });

    s.addText('Hospital Management\nInformation System', {
      x: 1.3, y: 1.55, w: 10.73, h: 1.7,
      fontFace: 'Calibri', fontSize: 40, color: C.navy, bold: true, align: 'center', lineSpacingMultiple: 1.1
    });

    s.addText('(HIS / MIS)', {
      x: 1.3, y: 3.25, w: 10.73, h: 0.6,
      fontFace: 'Calibri', fontSize: 26, color: C.primary, bold: true, align: 'center'
    });

    s.addText('نظام إدارة المعلومات الصحية في المستشفيات', {
      x: 1.3, y: 3.95, w: 10.73, h: 0.55,
      fontFace: 'Calibri', fontSize: 20, color: C.slate, bold: true, align: 'center'
    });

    // Department & University Strip
    s.addShape(pptx.ShapeType.roundRect, {
      x: 2.0, y: 4.85, w: 9.33, h: 0.7,
      fill: { color: C.cardAlt },
      line: { color: C.primary, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Management Department  •  Faculty of Applied Health Sciences  •  Beni-Suef University', {
      x: 2.0, y: 4.85, w: 9.33, h: 0.7,
      fontFace: 'Calibri', fontSize: 13, color: C.primaryDark, bold: true, align: 'center'
    });
  }

  // ── SLIDE 2 ── Project Team & Academic Supervision ────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 2);
    headerBilingual(s, 'Project Team & Academic Supervision', 'فريق العمل والإشراف الأكاديمي');

    // Left Team Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.border, width: 1.2 },
      rectRadius: 0.12
    });

    s.addText('PREPARED BY  MEDEVAC TEAM', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.45,
      fontFace: 'Calibri', fontSize: 16, color: C.primaryDark, bold: true
    });

    const names = [
      'Muhammed Wael Mohamed',
      'Ahmed Mohamed Abdelmageed',
      'Yazan Waleed',
      'Mariam Yasser',
      'Nayera Hussein',
    ];
    let ny = 2.15;
    names.forEach((n, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: ny, w: 5.2, h: 0.65,
        fill: { color: C.cardAlt },
        line: { color: C.borderSoft, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.   ${n}`, {
        x: 1.25, y: ny + 0.08, w: 4.8, h: 0.5,
        fontFace: 'Calibri', fontSize: 16, color: C.navy, bold: true
      });
      ny += 0.8;
    });

    // Right Supervision Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.goldBg },
      line: { color: C.gold, width: 1.5 },
      rectRadius: 0.12
    });

    s.addText('UNDER THE SUPERVISION OF', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.45,
      fontFace: 'Calibri', fontSize: 14, color: C.gold, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.25, y: 2.2, w: 4.86, h: 1.5,
      fill: { color: C.card },
      line: { color: C.gold, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Dr. Mahmoud Saad', {
      x: 7.25, y: 2.35, w: 4.86, h: 0.65,
      fontFace: 'Calibri', fontSize: 24, color: C.navy, bold: true, align: 'center'
    });
    s.addText('Teaching Assistant (معيد المادة)', {
      x: 7.25, y: 3.0, w: 4.86, h: 0.45,
      fontFace: 'Calibri', fontSize: 14, color: C.gold, bold: true, align: 'center'
    });

    s.addText([
      { text: 'Department:\n', options: { bold: true, color: C.primaryDark, fontSize: 13 } },
      { text: 'Management Department\n\n', options: { color: C.slate, fontSize: 13 } },
      { text: 'Faculty:\n', options: { bold: true, color: C.primaryDark, fontSize: 13 } },
      { text: 'Faculty of Applied Health Sciences\n\n', options: { color: C.slate, fontSize: 13 } },
      { text: 'University:\n', options: { bold: true, color: C.primaryDark, fontSize: 13 } },
      { text: 'Beni-Suef University', options: { color: C.slate, fontSize: 13 } },
    ], { x: 7.4, y: 4.0, w: 4.56, h: 2.4, fontFace: 'Calibri' });
  }

  // ── SLIDE 3 ── What is HIS/MIS? ───────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 3);
    headerBilingual(s, 'What is a Hospital Information System?', 'ما هو نظام المعلومات الصحية في المستشفيات؟');

    // Definition Box
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 11.73, h: 1.8,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText([
      { text: 'A Hospital Information System (HIS/MIS) ', options: { bold: true, color: C.primaryDark, fontSize: 18 } },
      { text: 'is a comprehensive, integrated software system designed to manage all aspects of hospital operations: medical, clinical, administrative, financial, and legal.', options: { color: C.navy, fontSize: 17 } },
    ], { x: 1.1, y: 1.5, w: 11.13, h: 0.8, fontFace: 'Calibri', lineSpacingMultiple: 1.2 });

    s.addText('نظام معلوماتي متكامل مصمم لإدارة كافة العمليات الطبية والإدارية والمالية بدقة عالية، وربط جميع الأقسام بقاعدة بيانات مركزية موحدة.', {
      x: 1.1, y: 2.4, w: 11.13, h: 0.55,
      fontFace: 'Calibri', fontSize: 14, color: C.slate, bold: true
    });

    // 4 Key Objectives
    const objectives = [
      { en: 'Improve Patient Safety & Clinical Outcomes', ar: 'تحسين سلامة المرضى وجودة الرعاية الطبية' },
      { en: 'Streamline Administrative & Financial Workflows', ar: 'تنظيم سير العمل الإداري والفوترة وتدفق الإيرادات' },
      { en: 'Enable Evidence-Based Clinical Decisions', ar: 'دعم القرارات السريرية المبنية على البيانات والتحاليل' },
      { en: 'Ensure Regulatory Compliance & Data Security (HIPAA)', ar: 'ضمان الامتثال التنظيمي وأمن البيانات وتشفير السجلات' },
    ];
    let oy = 3.35;
    objectives.forEach((o, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: oy, w: 11.73, h: 0.72,
        fill: { color: C.card },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText([
        { text: `${i + 1}.  ${o.en}`, options: { bold: true, color: C.navy, fontSize: 15 } },
        { text: `   —  ${o.ar}`, options: { color: C.primaryDark, fontSize: 13, bold: true } },
      ], { x: 1.1, y: oy + 0.1, w: 11.13, h: 0.5, fontFace: 'Calibri' });
      oy += 0.84;
    });
  }

  // ── SLIDE 4 ── System Architecture & Data Flow Schema (USER REQUEST: بتدرج الويب سايت)
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 4);
    headerBilingual(s, 'System Architecture & Data Flow Schema', 'سكيما ومعمارية وتدفق بيانات النظام بتدرج الويب سايت');

    const tiers = [
      {
        tier: 'Tier 1: Access & Patient Intake (واجهات الدخول والاستقبال)',
        items: 'Patient Registration (MRN)  •  National ID Check  •  Outpatient Appointments  •  Triage Gate',
        color: C.primary,
        bg: C.cardBlue,
      },
      {
        tier: 'Tier 2: Clinical EHR Core (محرك السجلات الطبية السريرية)',
        items: 'SOAP Clinical Documentation  •  ICD-10 Diagnosis  •  CPOE Physician Orders  •  Vitals Timeline',
        color: C.green,
        bg: C.cardTeal,
      },
      {
        tier: 'Tier 3: Diagnostics & Inpatient Operations (التشخيص والتنويم)',
        items: 'Laboratory (LIS)  •  Radiology (RIS)  •  Pharmacy Dispensation  •  Bed Matrix & ADT Tracking',
        color: C.teal,
        bg: C.cardAlt,
      },
      {
        tier: 'Tier 4: Financials, RBAC & Cloud Database (المالية والأمان وقاعدة البيانات)',
        items: 'Consolidated Billing  •  Insurance Claims  •  Role-Based Access Control (RBAC)  •  Firebase Cloud Sync',
        color: C.gold,
        bg: C.goldBg,
      },
    ];

    let ty = 1.35;
    tiers.forEach((t, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: ty, w: 11.73, h: 1.1,
        fill: { color: t.bg },
        line: { color: t.color, width: 1.5 },
        rectRadius: 0.1
      });

      s.addText(t.tier, {
        x: 1.1, y: ty + 0.12, w: 11.13, h: 0.4,
        fontFace: 'Calibri', fontSize: 16, color: C.navy, bold: true
      });

      s.addText(t.items, {
        x: 1.1, y: ty + 0.55, w: 11.13, h: 0.45,
        fontFace: 'Calibri', fontSize: 13, color: C.slate, bold: true
      });

      // Directional Arrow Connector (except last tier)
      if (i < 3) {
        s.addText('▼  Encrypted Internal Data Flow  ▼', {
          x: 0.8, y: ty + 1.08, w: 11.73, h: 0.25,
          fontFace: 'Calibri', fontSize: 10, color: C.muted, align: 'center', bold: true
        });
      }

      ty += 1.35;
    });
  }

  // ── SLIDE 5 ── Core Modules Overview ──────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 5);
    headerBilingual(s, 'Core Modules of a Hospital MIS (12 Modules)', 'الوحدات الأساسية لمنظومة المستشفيات (12 وحدة)');

    const modules = [
      { name: 'Patient Registration\n(تسجيل المرضى)', color: C.primary },
      { name: 'Appointments\n(إدارة المواعيد)', color: '0284C7' },
      { name: 'Inpatient & Beds\n(التنويم والأسرّة)', color: C.teal },
      { name: 'Electronic Records\n(EMR / السجلات)', color: C.green },
      { name: 'Laboratory (LIS)\n(المختبر المركزي)', color: '7C3AED' },
      { name: 'Radiology (RIS)\n(الأشعة والتصوير)', color: '8B5CF6' },
      { name: 'Pharmacy & Stock\n(الصيدلية والمخزون)', color: 'D97706' },
      { name: 'Billing & Finance\n(الفوترة والمالية)', color: 'DC2626' },
      { name: 'Insurance & Claims\n(التأمين والمطالبات)', color: 'B45309' },
      { name: 'HR & Staff\n(الأطقم الطبية)', color: '0D9488' },
      { name: 'Archive & DMS\n(الأرشيف والوثائق)', color: '0284C7' },
      { name: 'RBAC & Security\n(الأمان والصلاحيات)', color: C.navy },
    ];

    modules.forEach((m, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 0.8 + col * 3.0;
      const y = 1.35 + row * 1.75;

      s.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.75, h: 1.55,
        fill: { color: C.card },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.1
      });

      s.addText(m.name, {
        x: x + 0.15, y: y + 0.2, w: 2.45, h: 1.15,
        fontFace: 'Calibri', fontSize: 14, color: C.navy, bold: true, align: 'center', valign: 'middle'
      });
    });
  }

  // ── SLIDE 6 ── Patient Registration & EHR ─────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 6);
    headerBilingual(s, 'Patient Registration & Electronic Health Records', 'تسجيل المرضى والسجلات الطبية الإلكترونية');

    // Left: Registration
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Patient Registration Module\nوحدة تسجيل وقبول المرضى', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.65,
      fontFace: 'Calibri', fontSize: 17, color: C.primaryDark, bold: true
    });
    s.addText([
      { text: '•  Unique Medical Record Number (MRN) Generation\n', options: { fontSize: 14 } },
      { text: '•  National ID Verification & Demographic Intake\n', options: { fontSize: 14 } },
      { text: '•  Blood Group Documentation & Critical Allergy Flags\n', options: { fontSize: 14 } },
      { text: '•  Emergency Contacts & Legal Guardian Registry\n', options: { fontSize: 14 } },
      { text: '•  Health Insurance Policy & Coverage Linkage\n', options: { fontSize: 14 } },
      { text: '•  Duplicate Patient Detection Algorithms', options: { fontSize: 14 } },
    ], { x: 1.05, y: 2.35, w: 5.2, h: 4.1, fontFace: 'Calibri', color: C.slate, lineSpacingMultiple: 1.35 });

    // Right: EHR
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Electronic Health Records (EHR)\nالسجلات الطبية السريرية', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.65,
      fontFace: 'Calibri', fontSize: 17, color: C.green, bold: true
    });
    s.addText([
      { text: '•  SOAP Clinical Notes (Subjective, Objective, Assessment, Plan)\n', options: { fontSize: 14 } },
      { text: '•  ICD-10 International Disease Coding Standards\n', options: { fontSize: 14 } },
      { text: '•  Longitudinal Encounter & Visit History Tracking\n', options: { fontSize: 14 } },
      { text: '•  Vital Signs Continuous Charting & Trends\n', options: { fontSize: 14 } },
      { text: '•  Computerized Physician Order Entry (CPOE)\n', options: { fontSize: 14 } },
      { text: '•  Tamper-Proof Audit Trail & Secure Digital Signatures', options: { fontSize: 14 } },
    ], { x: 7.1, y: 2.35, w: 5.16, h: 4.1, fontFace: 'Calibri', color: C.slate, lineSpacingMultiple: 1.35 });
  }

  // ── SLIDE 7 ── Clinical Diagnostics: LIS, RIS & Pharmacy
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 7);
    headerBilingual(s, 'Clinical Diagnostics: LIS, RIS & Pharmacy', 'التشخيص الإكلينيكي: المختبر والأشعة والصيدلية');

    const cols = [
      {
        title: 'Laboratory (LIS)',
        ar: 'المختبر المركزي',
        color: '7C3AED',
        items: '•  Hematology, CBC, Chemistry\n•  Microbiology & Cultures\n•  STAT Emergency vs Routine\n•  Critical Abnormal Alerts\n•  Automated Verified Reports',
      },
      {
        title: 'Radiology (RIS)',
        ar: 'الأشعة والتصوير الطبي',
        color: C.primary,
        items: '•  X-Ray, CT, MRI, Ultrasound\n•  ECHO & ECG Diagnostic Units\n•  Consultant Physician Reports\n•  DICOM Image Metadata Links\n•  Urgent Trauma Prioritization',
      },
      {
        title: 'Pharmacy & Stock',
        ar: 'الصيدلية والمخزون الدوائي',
        color: C.teal,
        items: '•  E-Prescription Dispensing\n•  Drug-Allergy Cross Checks\n•  Re-order Threshold Alerts\n•  Controlled Substance Audit\n•  Batch & Expiry Management',
      },
    ];

    cols.forEach((c, i) => {
      const x = 0.8 + i * 4.0;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.73, h: 5.3,
        fill: { color: C.card },
        line: { color: c.color, width: 1.5 },
        rectRadius: 0.12
      });

      s.addText(c.title, {
        x: x + 0.2, y: 1.55, w: 3.33, h: 0.45,
        fontFace: 'Calibri', fontSize: 18, color: C.navy, bold: true, align: 'center'
      });
      s.addText(c.ar, {
        x: x + 0.2, y: 2.05, w: 3.33, h: 0.35,
        fontFace: 'Calibri', fontSize: 13, color: c.color, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.5, w: 2.93, h: 0,
        line: { color: C.borderSoft, width: 1 }
      });
      s.addText(c.items, {
        x: x + 0.25, y: 2.65, w: 3.23, h: 3.8,
        fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.45
      });
    });
  }

  // ── SLIDE 8 ── Inpatient & Bed Management ─────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 8);
    headerBilingual(s, 'Inpatient Admission & Bed Capacity Matrix', 'إدارة التنويم والطاقة الاستيعابية للأسرّة');

    // Left Bed Matrix
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.5, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Real-Time Bed Capacity Matrix\nمصفوفة الأسرّة والجاهزية اللحظية', {
      x: 1.05, y: 1.55, w: 6.0, h: 0.65,
      fontFace: 'Calibri', fontSize: 17, color: C.primaryDark, bold: true
    });

    const wards = [
      { name: 'Intensive Care Unit (ICU) — العناية المركزة', color: C.red },
      { name: 'Emergency Ward — قسم الطوارئ والاستقبال الفوري', color: C.gold },
      { name: 'Surgical & Inpatient — الأقسام الداخلية والجراحة', color: C.green },
      { name: 'Isolation & Private — أجنحة الإقامة والعزل الطبي', color: C.primary },
    ];
    let wy = 2.4;
    wards.forEach(w => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: wy, w: 6.0, h: 0.75,
        fill: { color: C.cardAlt },
        line: { color: w.color, width: 1.5 },
        rectRadius: 0.08
      });
      s.addText(w.name, {
        x: 1.25, y: wy + 0.12, w: 5.6, h: 0.5,
        fontFace: 'Calibri', fontSize: 14, color: C.navy, bold: true
      });
      wy += 0.95;
    });

    // Right ADT Functions
    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.6, y: 1.35, w: 4.93, h: 5.3,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Key ADT Functions\nوظائف دورة التنويم', {
      x: 7.85, y: 1.55, w: 4.43, h: 0.65,
      fontFace: 'Calibri', fontSize: 17, color: C.teal, bold: true
    });
    s.addText([
      { text: '•  Admission, Transfer & Discharge (ADT)\n\n', options: { fontSize: 14 } },
      { text: '•  Color-Coded Status: Occupied, Available, Cleaning\n\n', options: { fontSize: 14 } },
      { text: '•  Real-Time Census & Ward Occupancy Rates\n\n', options: { fontSize: 14 } },
      { text: '•  Housekeeping & Sterilization Tracking\n\n', options: { fontSize: 14 } },
      { text: '•  Inter-Ward Patient Transfer Workflows\n\n', options: { fontSize: 14 } },
      { text: '•  Discharge Summaries & Auto Bed Release', options: { fontSize: 14 } },
    ], { x: 7.85, y: 2.35, w: 4.43, h: 4.1, fontFace: 'Calibri', color: C.slate });
  }

  // ── SLIDE 9 ── Financial Management & Medical Billing ─
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 9);
    headerBilingual(s, 'Financial Management & Medical Billing', 'الإدارة المالية والفوترة الطبية والتأمين');

    const pillars = [
      {
        title: 'Revenue Cycle\nManagement',
        ar: 'إدارة دورة الإيرادات',
        color: C.primary,
        desc: '•  Consolidation of all clinical,\n   lab, and pharmacy charges\n   into unified invoices\n\n•  Real-time cash and POS shift\n   reconciliation\n\n•  Zero leakage revenue audits',
      },
      {
        title: 'Multi-Channel\nPayment',
        ar: 'تعدد قنوات السداد',
        color: C.teal,
        desc: '•  Support for Cash, Credit Cards,\n   and Insurance co-payments\n\n•  Automated deductible and\n   patient share calculation\n\n•  Instant digital fiscal receipts',
      },
      {
        title: 'Insurance Claims\nProcessing',
        ar: 'معالجة مطالبات التأمين',
        color: C.gold,
        desc: '•  Real-time insurance eligibility\n   and pre-authorization\n\n•  Direct claim submission to\n   insurance providers\n\n•  Denial tracking and resubmission',
      },
    ];

    pillars.forEach((p, i) => {
      const x = 0.8 + i * 4.0;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.73, h: 5.3,
        fill: { color: C.card },
        line: { color: p.color, width: 1.5 },
        rectRadius: 0.12
      });

      s.addText(p.title, {
        x: x + 0.2, y: 1.55, w: 3.33, h: 0.7,
        fontFace: 'Calibri', fontSize: 18, color: C.navy, bold: true, align: 'center'
      });
      s.addText(p.ar, {
        x: x + 0.2, y: 2.3, w: 3.33, h: 0.35,
        fontFace: 'Calibri', fontSize: 13, color: p.color, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.75, w: 2.93, h: 0,
        line: { color: C.borderSoft, width: 1 }
      });
      s.addText(p.desc, {
        x: x + 0.25, y: 2.9, w: 3.23, h: 3.6,
        fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.35
      });
    });
  }

  // ── SLIDE 10 ── Security, Benefits & Academic References
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 10);
    headerBilingual(s, 'Security, Implementation Benefits & References', 'الأمان والفوائد والمراجع العلمية المعتمدة');

    // Left: Security & Benefits
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('RBAC Security & Key Benefits\nأمان الصلاحيات والفوائد الرئيسية', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.65,
      fontFace: 'Calibri', fontSize: 16, color: C.green, bold: true
    });
    s.addText([
      { text: '•  Role-Based Access Control (RBAC) across 14 modules\n', options: { fontSize: 13 } },
      { text: '•  End-to-End Encryption at Rest and in Transit (HIPAA)\n', options: { fontSize: 13 } },
      { text: '•  100% Paperless Clinical Documentation Workflow\n', options: { fontSize: 13 } },
      { text: '•  Significant Reduction in Medication & Diagnostic Errors\n', options: { fontSize: 13 } },
      { text: '•  Sub-Second Data Retrieval & Real-Time Bed Availability\n', options: { fontSize: 13 } },
      { text: '•  Transparent Revenue Cycle with Zero Financial Leakage', options: { fontSize: 13 } },
    ], { x: 1.05, y: 2.35, w: 5.2, h: 4.1, fontFace: 'Calibri', color: C.slate, lineSpacingMultiple: 1.35 });

    // Right: References
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Academic References\nالمراجع العلمية المعتمدة', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.65,
      fontFace: 'Calibri', fontSize: 16, color: C.primaryDark, bold: true
    });
    s.addText([
      { text: '1.  ', options: { bold: true, color: C.primary } },
      { text: 'HIMSS EMRAM: Electronic Medical Record Adoption Model (Stage 6/7).\n\n' },
      { text: '2.  ', options: { bold: true, color: C.primary } },
      { text: 'WHO: Global Strategy on Digital Health 2020–2025.\n\n' },
      { text: '3.  ', options: { bold: true, color: C.primary } },
      { text: 'HL7 FHIR R4: Fast Healthcare Interoperability Resources Standards.\n\n' },
      { text: '4.  ', options: { bold: true, color: C.primary } },
      { text: 'Shortliffe & Cimino, Biomedical Informatics (Springer, 4th Ed.).\n\n' },
      { text: '5.  ', options: { bold: true, color: C.primary } },
      { text: 'Wager, Lee & Glaser, Health Care Information Systems (Jossey-Bass).' },
    ], { x: 7.1, y: 2.35, w: 5.16, h: 4.1, fontFace: 'Calibri', fontSize: 13, color: C.slate, lineSpacingMultiple: 1.25 });
  }

  return pptx;
}

// ═══════════════════════════════════════════════════════════════
// 2. ENGLISH-ONLY PRESENTATION
// ═══════════════════════════════════════════════════════════════
function buildEnglish() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'MEDEVAC TEAM';
  pptx.title = 'Hospital Management Information System (MIS)';

  // ── SLIDE 1 ── Title Slide ───────────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 1);

    s.addShape(pptx.ShapeType.roundRect, {
      x: 4.8, y: 0.55, w: 3.73, h: 0.45,
      fill: { color: C.cardBlue },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.1
    });
    s.addText('MEDEVAC TEAM', {
      x: 4.8, y: 0.55, w: 3.73, h: 0.45,
      fontFace: 'Calibri', fontSize: 15, color: C.primaryDark, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 1.25, w: 11.33, h: 5.3,
      fill: { color: C.card },
      line: { color: C.border, width: 1.5 },
      rectRadius: 0.15
    });

    s.addText('Hospital Management\nInformation System', {
      x: 1.3, y: 1.7, w: 10.73, h: 1.8,
      fontFace: 'Calibri', fontSize: 44, color: C.navy, bold: true, align: 'center', lineSpacingMultiple: 1.1
    });

    s.addText('(HIS / MIS)', {
      x: 1.3, y: 3.6, w: 10.73, h: 0.7,
      fontFace: 'Calibri', fontSize: 28, color: C.primary, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 2.0, y: 4.85, w: 9.33, h: 0.7,
      fill: { color: C.cardAlt },
      line: { color: C.primary, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Management Department  •  Faculty of Applied Health Sciences  •  Beni-Suef University', {
      x: 2.0, y: 4.85, w: 9.33, h: 0.7,
      fontFace: 'Calibri', fontSize: 14, color: C.primaryDark, bold: true, align: 'center'
    });
  }

  // ── SLIDE 2 ── Project Team & Academic Supervision ────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 2);
    headerEnglish(s, 'Project Team & Academic Supervision');

    // Left Team Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.border, width: 1.2 },
      rectRadius: 0.12
    });
    s.addText('PREPARED BY  MEDEVAC TEAM', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.45,
      fontFace: 'Calibri', fontSize: 17, color: C.primaryDark, bold: true
    });

    const names = [
      'Muhammed Wael Mohamed',
      'Ahmed Mohamed Abdelmageed',
      'Yazan Waleed',
      'Mariam Yasser',
      'Nayera Hussein',
    ];
    let ny = 2.15;
    names.forEach((n, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: ny, w: 5.2, h: 0.65,
        fill: { color: C.cardAlt },
        line: { color: C.borderSoft, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.   ${n}`, {
        x: 1.25, y: ny + 0.08, w: 4.8, h: 0.5,
        fontFace: 'Calibri', fontSize: 16, color: C.navy, bold: true
      });
      ny += 0.8;
    });

    // Right Supervision Card
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.goldBg },
      line: { color: C.gold, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('UNDER THE SUPERVISION OF', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.45,
      fontFace: 'Calibri', fontSize: 15, color: C.gold, bold: true, align: 'center'
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.25, y: 2.2, w: 4.86, h: 1.5,
      fill: { color: C.card },
      line: { color: C.gold, width: 1 },
      rectRadius: 0.1
    });
    s.addText('Dr. Mahmoud Saad', {
      x: 7.25, y: 2.35, w: 4.86, h: 0.65,
      fontFace: 'Calibri', fontSize: 26, color: C.navy, bold: true, align: 'center'
    });
    s.addText('Teaching Assistant', {
      x: 7.25, y: 3.0, w: 4.86, h: 0.45,
      fontFace: 'Calibri', fontSize: 15, color: C.gold, bold: true, align: 'center'
    });

    s.addText([
      { text: 'Department:\n', options: { bold: true, color: C.primaryDark, fontSize: 14 } },
      { text: 'Management Department\n\n', options: { color: C.slate, fontSize: 14 } },
      { text: 'Faculty:\n', options: { bold: true, color: C.primaryDark, fontSize: 14 } },
      { text: 'Faculty of Applied Health Sciences\n\n', options: { color: C.slate, fontSize: 14 } },
      { text: 'University:\n', options: { bold: true, color: C.primaryDark, fontSize: 14 } },
      { text: 'Beni-Suef University', options: { color: C.slate, fontSize: 14 } },
    ], { x: 7.4, y: 4.0, w: 4.56, h: 2.4, fontFace: 'Calibri' });
  }

  // ── SLIDE 3 ── What is HIS/MIS? ───────────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 3);
    headerEnglish(s, 'What is a Hospital Information System?');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 11.73, h: 1.7,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText([
      { text: 'A Hospital Information System (HIS/MIS) ', options: { bold: true, color: C.primaryDark, fontSize: 20 } },
      { text: 'is a comprehensive, integrated software platform designed to manage all aspects of hospital operations: medical, clinical, administrative, financial, and legal through centralized digital workflows.', options: { color: C.navy, fontSize: 18 } },
    ], { x: 1.1, y: 1.55, w: 11.13, h: 1.3, fontFace: 'Calibri', lineSpacingMultiple: 1.25 });

    const objs = [
      'Improve Patient Safety & Quality of Care via Standardized Protocols',
      'Streamline Administrative, Scheduling & Financial Invoicing Workflows',
      'Enable Evidence-Based Clinical Decision Making with Real-Time Data',
      'Ensure Full Regulatory Compliance & Patient Data Protection (HIPAA)',
    ];
    let oy = 3.35;
    objs.forEach((o, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: oy, w: 11.73, h: 0.72,
        fill: { color: C.card },
        line: { color: C.border, width: 1 },
        rectRadius: 0.08
      });
      s.addText(`${i + 1}.   ${o}`, {
        x: 1.1, y: oy + 0.12, w: 11.13, h: 0.5,
        fontFace: 'Calibri', fontSize: 16, color: C.navy, bold: true
      });
      oy += 0.84;
    });
  }

  // ── SLIDE 4 ── System Architecture & Data Flow Schema (USER REQUEST: بتدرج الويب سايت)
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 4);
    headerEnglish(s, 'System Architecture & Data Flow Schema (Website Progression)');

    const tiers = [
      {
        tier: 'Tier 1: Access & Patient Intake Gateway',
        items: 'Patient Registration (MRN)  •  National ID Check  •  Outpatient Appointments  •  Triage Gate',
        color: C.primary,
        bg: C.cardBlue,
      },
      {
        tier: 'Tier 2: Clinical EHR & Physician Core',
        items: 'SOAP Clinical Documentation  •  ICD-10 Coding  •  CPOE Physician Orders  •  Vitals Timeline',
        color: C.green,
        bg: C.cardTeal,
      },
      {
        tier: 'Tier 3: Diagnostic Ancillary Services & Inpatient Units',
        items: 'Laboratory (LIS)  •  Radiology (RIS)  •  Pharmacy Dispensation  •  Bed Matrix & ADT Tracking',
        color: C.teal,
        bg: C.cardAlt,
      },
      {
        tier: 'Tier 4: Revenue Cycle, RBAC Security & Cloud Store',
        items: 'Consolidated Invoicing  •  Insurance Claims Pre-Auth  •  RBAC Security  •  Firebase Cloud Sync',
        color: C.gold,
        bg: C.goldBg,
      },
    ];

    let ty = 1.35;
    tiers.forEach((t, i) => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8, y: ty, w: 11.73, h: 1.1,
        fill: { color: t.bg },
        line: { color: t.color, width: 1.5 },
        rectRadius: 0.1
      });

      s.addText(t.tier, {
        x: 1.1, y: ty + 0.12, w: 11.13, h: 0.4,
        fontFace: 'Calibri', fontSize: 16, color: C.navy, bold: true
      });

      s.addText(t.items, {
        x: 1.1, y: ty + 0.55, w: 11.13, h: 0.45,
        fontFace: 'Calibri', fontSize: 13, color: C.slate, bold: true
      });

      if (i < 3) {
        s.addText('▼  Encrypted Internal Data Flow  ▼', {
          x: 0.8, y: ty + 1.08, w: 11.73, h: 0.25,
          fontFace: 'Calibri', fontSize: 10, color: C.muted, align: 'center', bold: true
        });
      }

      ty += 1.35;
    });
  }

  // ── SLIDE 5 ── Core Modules Overview ──────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 5);
    headerEnglish(s, 'Core Modules of a Hospital MIS (12 Key Modules)');

    const modules = [
      { name: 'Patient\nRegistration', color: C.primary },
      { name: 'Appointment\nScheduling', color: '0284C7' },
      { name: 'Inpatient &\nBed Management', color: C.teal },
      { name: 'Electronic Medical\nRecords (EMR)', color: C.green },
      { name: 'Laboratory\nSystem (LIS)', color: '7C3AED' },
      { name: 'Radiology\nSystem (RIS)', color: '8B5CF6' },
      { name: 'Pharmacy &\nStock Control', color: 'D97706' },
      { name: 'Billing &\nPatient Finance', color: 'DC2626' },
      { name: 'Insurance &\nClaims Pre-Auth', color: 'B45309' },
      { name: 'HR & Medical\nStaff Roster', color: '0D9488' },
      { name: 'Archive &\nDigital Docs (DMS)', color: '0284C7' },
      { name: 'RBAC &\nSystem Security', color: C.navy },
    ];

    modules.forEach((m, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 0.8 + col * 3.0;
      const y = 1.35 + row * 1.75;

      s.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 2.75, h: 1.55,
        fill: { color: C.card },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.1
      });

      s.addText(m.name, {
        x: x + 0.15, y: y + 0.2, w: 2.45, h: 1.15,
        fontFace: 'Calibri', fontSize: 15, color: C.navy, bold: true, align: 'center', valign: 'middle'
      });
    });
  }

  // ── SLIDE 6 ── Patient Registration & EHR ─────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 6);
    headerEnglish(s, 'Patient Registration & Electronic Health Records');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Patient Registration Module', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.primaryDark, bold: true
    });
    s.addText([
      { text: '•  Unique Medical Record Number (MRN) Generation\n\n' },
      { text: '•  National ID Verification & Demographic Intake\n\n' },
      { text: '•  Blood Group Documentation & Critical Allergy Flags\n\n' },
      { text: '•  Emergency Contacts & Legal Guardian Registry\n\n' },
      { text: '•  Health Insurance Policy Linkage & Verification\n\n' },
      { text: '•  Automated Duplicate Patient Detection' },
    ], { x: 1.05, y: 2.25, w: 5.2, h: 4.2, fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.2 });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Electronic Health Records (EHR)', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.green, bold: true
    });
    s.addText([
      { text: '•  SOAP Clinical Notes (Subjective, Objective, Assessment, Plan)\n\n' },
      { text: '•  ICD-10 International Disease Coding Standards\n\n' },
      { text: '•  Longitudinal Encounter & Visit History Timeline\n\n' },
      { text: '•  Vital Signs Continuous Charting & Visual Trends\n\n' },
      { text: '•  Computerized Physician Order Entry (CPOE)\n\n' },
      { text: '•  Tamper-Proof Audit Trail & Digital Authentication' },
    ], { x: 7.1, y: 2.25, w: 5.16, h: 4.2, fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.2 });
  }

  // ── SLIDE 7 ── Clinical Diagnostics ───────────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 7);
    headerEnglish(s, 'Clinical Diagnostics: LIS, RIS & Pharmacy');

    const cols = [
      {
        title: 'Laboratory (LIS)',
        color: '7C3AED',
        items: '•  Hematology, CBC, Chemistry\n\n•  Microbiology & Cultures\n\n•  STAT vs Routine Orders\n\n•  Abnormal Value Alerts\n\n•  Auto-Verified Reporting',
      },
      {
        title: 'Radiology (RIS)',
        color: C.primary,
        items: '•  X-Ray, CT, MRI, Ultrasound\n\n•  ECHO & ECG Modalities\n\n•  Consultant Imaging Notes\n\n•  DICOM Integration Links\n\n•  Trauma Prioritization',
      },
      {
        title: 'Pharmacy & Stock',
        color: C.teal,
        items: '•  E-Prescription Dispensing\n\n•  Drug-Allergy Cross Checks\n\n•  Min. Stock Re-order Alerts\n\n•  Controlled Drug Tracking\n\n•  Batch & Expiry Controls',
      },
    ];

    cols.forEach((c, i) => {
      const x = 0.8 + i * 4.0;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.73, h: 5.3,
        fill: { color: C.card },
        line: { color: c.color, width: 1.5 },
        rectRadius: 0.12
      });

      s.addText(c.title, {
        x: x + 0.2, y: 1.55, w: 3.33, h: 0.6,
        fontFace: 'Calibri', fontSize: 20, color: C.navy, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.3, w: 2.93, h: 0,
        line: { color: C.borderSoft, width: 1 }
      });
      s.addText(c.items, {
        x: x + 0.25, y: 2.55, w: 3.23, h: 3.9,
        fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.3
      });
    });
  }

  // ── SLIDE 8 ── Inpatient & Bed Management ─────────────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 8);
    headerEnglish(s, 'Inpatient Admission & Bed Capacity Matrix');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.5, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Real-Time Bed Capacity Matrix', {
      x: 1.05, y: 1.55, w: 6.0, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.primaryDark, bold: true
    });

    const wards = [
      { name: 'Intensive Care Unit (ICU) — High Acuity Beds', color: C.red },
      { name: 'Emergency Ward — Immediate Trauma Reception', color: C.gold },
      { name: 'Surgical & General — Inpatient Post-Op Care', color: C.green },
      { name: 'Isolation & Private — Specialized Suites', color: C.primary },
    ];
    let wy = 2.4;
    wards.forEach(w => {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: wy, w: 6.0, h: 0.75,
        fill: { color: C.cardAlt },
        line: { color: w.color, width: 1.5 },
        rectRadius: 0.08
      });
      s.addText(w.name, {
        x: 1.25, y: wy + 0.12, w: 5.6, h: 0.5,
        fontFace: 'Calibri', fontSize: 15, color: C.navy, bold: true
      });
      wy += 0.95;
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 7.6, y: 1.35, w: 4.93, h: 5.3,
      fill: { color: C.card },
      line: { color: C.teal, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Core ADT Functions', {
      x: 7.85, y: 1.55, w: 4.43, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.teal, bold: true
    });
    s.addText([
      { text: '•  Admission, Transfer & Discharge (ADT)\n\n' },
      { text: '•  Real-Time Bed Census & Occupancy Tracking\n\n' },
      { text: '•  Live Status: Available, Occupied, Sterilizing\n\n' },
      { text: '•  Inter-Ward Clinical Handover Documentation\n\n' },
      { text: '•  Automated Discharge Summaries & Invoicing\n\n' },
      { text: '•  Zero Over-Booking Guarantee' },
    ], { x: 7.85, y: 2.35, w: 4.43, h: 4.1, fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.2 });
  }

  // ── SLIDE 9 ── Financial Management & Medical Billing ─
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 9);
    headerEnglish(s, 'Financial Management & Medical Billing');

    const pillars = [
      {
        title: 'Revenue Cycle\nManagement',
        color: C.primary,
        desc: '•  Consolidation of all clinical,\n   lab, and pharmacy charges\n   into unified invoices\n\n•  Real-time cash and POS shift\n   reconciliation\n\n•  Zero leakage revenue audits',
      },
      {
        title: 'Multi-Channel\nPayment',
        color: C.teal,
        desc: '•  Support for Cash, Credit Cards,\n   and Insurance co-payments\n\n•  Automated deductible and\n   patient share calculation\n\n•  Instant digital fiscal receipts',
      },
      {
        title: 'Insurance Claims\nProcessing',
        color: C.gold,
        desc: '•  Real-time insurance eligibility\n   and pre-authorization\n\n•  Direct claim submission to\n   insurance providers\n\n•  Denial tracking and resubmission',
      },
    ];

    pillars.forEach((p, i) => {
      const x = 0.8 + i * 4.0;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.73, h: 5.3,
        fill: { color: C.card },
        line: { color: p.color, width: 1.5 },
        rectRadius: 0.12
      });

      s.addText(p.title, {
        x: x + 0.2, y: 1.55, w: 3.33, h: 0.7,
        fontFace: 'Calibri', fontSize: 20, color: C.navy, bold: true, align: 'center'
      });
      s.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 2.45, w: 2.93, h: 0,
        line: { color: C.borderSoft, width: 1 }
      });
      s.addText(p.desc, {
        x: x + 0.25, y: 2.7, w: 3.23, h: 3.8,
        fontFace: 'Calibri', fontSize: 14, color: C.slate, lineSpacingMultiple: 1.35
      });
    });
  }

  // ── SLIDE 10 ── Security, Benefits & References ───────
  {
    const s = pptx.addSlide();
    brandSlide(pptx, s, 10);
    headerEnglish(s, 'Security, Implementation Benefits & References');

    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.green, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('RBAC Security & Key Benefits', {
      x: 1.05, y: 1.55, w: 5.2, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.green, bold: true
    });
    s.addText([
      { text: '•  Role-Based Access Control (RBAC) across 14 modules\n\n' },
      { text: '•  End-to-End Encryption at Rest and in Transit (HIPAA)\n\n' },
      { text: '•  100% Paperless Clinical Documentation Workflow\n\n' },
      { text: '•  Significant Reduction in Medication & Diagnostic Errors\n\n' },
      { text: '•  Sub-Second Data Retrieval & Real-Time Bed Availability\n\n' },
      { text: '•  Transparent Revenue Cycle with Zero Financial Leakage' },
    ], { x: 1.05, y: 2.25, w: 5.2, h: 4.2, fontFace: 'Calibri', fontSize: 13, color: C.slate, lineSpacingMultiple: 1.2 });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.83, y: 1.35, w: 5.7, h: 5.3,
      fill: { color: C.card },
      line: { color: C.primary, width: 1.5 },
      rectRadius: 0.12
    });
    s.addText('Academic References', {
      x: 7.1, y: 1.55, w: 5.16, h: 0.55,
      fontFace: 'Calibri', fontSize: 18, color: C.primaryDark, bold: true
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
    ], { x: 7.1, y: 2.25, w: 5.16, h: 4.2, fontFace: 'Calibri', fontSize: 13, color: C.slate, lineSpacingMultiple: 1.25 });
  }

  return pptx;
}

// ═══════════════════════════════════════════════════════════════
// INJECT NATIVE MORPH TRANSITIONS VIA OPENXML
// ═══════════════════════════════════════════════════════════════
async function injectMorph(filePath) {
  const JSZip = require('jszip');
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
  console.log(`  ✓ Native Morph transitions injected into ${slideFiles.length} slides for ${path.basename(filePath)}`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
  const desktop = 'C:\\Users\\Emak\\Desktop';

  console.log('Building Light Theme Bilingual (Arabic + English) Presentation...');
  const bi = buildBilingual();
  const biPath = path.join(desktop, 'MEDEVAC_MIS_Presentation_Bilingual.pptx');
  await bi.writeFile({ fileName: biPath });
  console.log('  → Saved:', biPath);
  await injectMorph(biPath);

  console.log('Building Light Theme English-Only Presentation...');
  const en = buildEnglish();
  const enPath = path.join(desktop, 'MEDEVAC_MIS_Presentation_English.pptx');
  await en.writeFile({ fileName: enPath });
  console.log('  → Saved:', enPath);
  await injectMorph(enPath);

  // Copy to public/ for website download
  const pubDir = path.join(__dirname, '..', 'public');
  fs.copyFileSync(biPath, path.join(pubDir, 'MEDEVAC_MIS_Presentation_Bilingual.pptx'));
  fs.copyFileSync(enPath, path.join(pubDir, 'MEDEVAC_MIS_Presentation_English.pptx'));
  console.log('  → Copied to public/ for website download.');
  console.log('\nDone! Both light-themed presentations generated successfully with native Morph transitions and strict LAYOUT_WIDE margins.');
}

main().catch(err => { console.error(err); process.exit(1); });
