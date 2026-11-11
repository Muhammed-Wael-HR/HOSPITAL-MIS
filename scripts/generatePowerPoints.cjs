const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// Color Palette Constants
const COLORS = {
  navyDark: '0A192F',      // Primary background
  navyCard: '112240',      // Card background
  navyLight: '233554',     // Border / accent background
  cyanPrimary: '00F2FE',   // Bright tactical cyan
  cyanBlue: '4FACFE',      // Gradient companion
  emeraldGreen: '10B981',  // Success & medical green
  amberWarn: 'F59E0B',     // Warning / attention
  coralRed: 'EF4444',      // Urgent / emergency
  textWhite: 'FFFFFF',     // Main text
  textLight: 'CCD6F6',     // Subtitle text
  textMuted: '8892B0',     // Muted caption
  goldStar: 'FBBF24'       // Academic gold
};

function createBilingualPresentation() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MEDEVAC TEAM';
  pptx.company = 'MEDEVAC OPERATIONS & HOSPITAL MIS';
  pptx.title = 'MEDEVAC MIS - Bilingual Presentation';

  // Common Header & Footer helper
  function addSlideBranding(slide, slideNum, titleEn, titleAr) {
    slide.background = { color: COLORS.navyDark };
    slide.transition = { type: 'fade', duration: 0.8 };

    // Top Accent Glow Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.1,
      fill: { color: COLORS.cyanPrimary },
      line: { color: COLORS.cyanPrimary }
    });

    // Top Category / Header
    if (slideNum > 1) {
      slide.addText([
        { text: `${titleEn}  |  `, options: { fontFace: 'Arial', fontSize: 18, color: COLORS.cyanPrimary, bold: true } },
        { text: titleAr, options: { fontFace: 'Arial', fontSize: 18, color: COLORS.textWhite, bold: true } }
      ], { x: 0.8, y: 0.35, w: 10.5, h: 0.55, margin: 0 });

      // Subtle divider line
      slide.addShape(pptx.ShapeType.line, {
        x: 0.8, y: 0.95, w: 11.7, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });
    }

    // Bottom Footer on EVERY slide
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8, y: 6.9, w: 11.7, h: 0,
      line: { color: COLORS.navyLight, width: 1 }
    });

    slide.addText('PREPARED BY MEDEVAC TEAM', {
      x: 0.8, y: 7.0, w: 5.5, h: 0.35,
      fontFace: 'Arial', fontSize: 10, color: COLORS.cyanBlue, bold: true, margin: 0
    });

    slide.addText(`HOSPITAL INFORMATION SYSTEM (MIS)  •  SLIDE ${slideNum} OF 10`, {
      x: 6.5, y: 7.0, w: 6.0, h: 0.35,
      fontFace: 'Arial', fontSize: 10, color: COLORS.textMuted, align: 'right', margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 1, '', '');

    // Decorative Tactical Shield Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 1.0, w: 11.3, h: 5.5,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.navyLight, width: 1.5 },
      rectRadius: 0.15
    });

    // Top Badge
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.6, y: 1.35, w: 4.1, h: 0.45,
      fill: { color: COLORS.navyLight },
      line: { color: COLORS.cyanPrimary, width: 1 },
      rectRadius: 0.2
    });
    slide.addText('TACTICAL HEALTHCARE INFORMATION SYSTEM', {
      x: 4.6, y: 1.35, w: 4.1, h: 0.45,
      fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
    });

    // Main Titles
    slide.addText('MEDEVAC OPERATIONS & HOSPITAL MIS', {
      x: 1.5, y: 2.05, w: 10.3, h: 0.85,
      fontFace: 'Arial', fontSize: 32, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
    });

    slide.addText('منظومة إدارة معلومات الإخلاء الطبي والمستشفيات التكتيكية الذكية', {
      x: 1.5, y: 2.9, w: 10.3, h: 0.65,
      fontFace: 'Arial', fontSize: 22, color: COLORS.cyanBlue, bold: true, align: 'center', margin: 0
    });

    // Subtitle & Value Proposition
    slide.addText([
      { text: 'A Unified Real-Time MIS Platform for Emergency Triage, Inpatient Logistics & Clinical Governance\n', options: { fontSize: 14, color: COLORS.textLight, bold: true } },
      { text: 'منصة متكاملة لإدارة الطوارئ الطبية والفرز السريري واللوجستيات الميدانية وحوكمة المنشآت الصحية', options: { fontSize: 13, color: COLORS.textMuted } }
    ], { x: 1.8, y: 3.75, w: 9.7, h: 1.1, fontFace: 'Arial', align: 'center' });

    // Time & Purpose Chips
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 3.2, y: 5.15, w: 3.2, h: 0.6,
      fill: { color: '0A2A42' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });
    slide.addText('⏱ 5-Minute Executive Briefing\nعرض موجز مركز (5 دقائق)', {
      x: 3.2, y: 5.15, w: 3.2, h: 0.6,
      fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, align: 'center', margin: 0
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.9, y: 5.15, w: 3.2, h: 0.6,
      fill: { color: '063327' },
      line: { color: COLORS.emeraldGreen, width: 1 },
      rectRadius: 0.1
    });
    slide.addText('🛡 Zero Data-Loss Architecture\nبنية فائقة الموثوقية والأمان', {
      x: 6.9, y: 5.15, w: 3.2, h: 0.6,
      fontFace: 'Arial', fontSize: 11, color: COLORS.emeraldGreen, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 2: Creators & Academic Supervision
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 2, 'Project Authors & Academic Supervision', 'فريق العمل والإشراف الأكاديمي');

    // Left Column: Team Members Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.25, w: 6.3, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.navyLight, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('👨‍💻 PREPARED BY: MEDEVAC TEAM (5 MEMBERS)', {
      x: 1.1, y: 1.45, w: 5.7, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.cyanPrimary, bold: true, margin: 0
    });
    slide.addText('إعداد فريق العمل الطبي والتطويري', {
      x: 1.1, y: 1.85, w: 5.7, h: 0.35,
      fontFace: 'Arial', fontSize: 12, color: COLORS.textMuted, margin: 0
    });

    const members = [
      { en: '1. Muhammed Wael Mohamed', ar: 'محمد وائل محمد', role: 'Team Lead & Full-Stack Architect' },
      { en: '2. Ahmed Mohamed Abdelmageed', ar: 'احمد محمد عبدالمجيد', role: 'Database & Backend Specialist' },
      { en: '3. Yazan Waleed', ar: 'يزن وليد', role: 'Clinical Workflows & UI Engineer' },
      { en: '4. Mariam Yasser', ar: 'مريم ياسر', role: 'Quality Assurance & Business Analyst' },
      { en: '5. Nayera Hussein', ar: 'نيرة حسين', role: 'Medical Records & Security Specialist' }
    ];

    let memberY = 2.35;
    members.forEach(m => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: memberY, w: 5.8, h: 0.72,
        fill: { color: COLORS.navyLight },
        line: { color: '2D4373', width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${m.en}  `, options: { fontFace: 'Arial', fontSize: 13, color: COLORS.textWhite, bold: true } },
        { text: `(${m.ar})\n`, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.cyanBlue } },
        { text: m.role, options: { fontFace: 'Arial', fontSize: 10, color: COLORS.textMuted } }
      ], { x: 1.2, y: memberY + 0.06, w: 5.5, h: 0.6, margin: 0 });

      memberY += 0.82;
    });

    // Right Column: Academic Supervision Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.4, y: 1.25, w: 5.1, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.goldStar, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText('⭐ ACADEMIC SUPERVISION', {
      x: 7.7, y: 1.5, w: 4.5, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.goldStar, bold: true, margin: 0
    });
    slide.addText('تحت إشراف وتوجيه أستاذ المادة', {
      x: 7.7, y: 1.9, w: 4.5, h: 0.35,
      fontFace: 'Arial', fontSize: 12, color: COLORS.textMuted, margin: 0
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.7, y: 2.45, w: 4.5, h: 1.6,
      fill: { color: '2A2412' },
      line: { color: COLORS.goldStar, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addText('UNDER THE SUPERVISION OF:', {
      x: 7.9, y: 2.6, w: 4.1, h: 0.3,
      fontFace: 'Arial', fontSize: 11, color: COLORS.goldStar, bold: true, align: 'center', margin: 0
    });

    slide.addText('Dr. Mahmoud Saad', {
      x: 7.9, y: 2.95, w: 4.1, h: 0.5,
      fontFace: 'Arial', fontSize: 22, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
    });

    slide.addText('دكتور محمود سعد', {
      x: 7.9, y: 3.48, w: 4.1, h: 0.4,
      fontFace: 'Arial', fontSize: 18, color: COLORS.goldStar, bold: true, align: 'center', margin: 0
    });

    slide.addText([
      { text: 'Department: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Medical Informatics & Healthcare Systems\n\n' },
      { text: 'Project Focus: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Hospital Information Systems (MIS), Rapid Medical Triage, Emergency Evacuation Operations & Multi-Admin RBAC' }
    ], { x: 7.7, y: 4.3, w: 4.5, h: 2.0, fontFace: 'Arial', fontSize: 12, color: COLORS.textLight });
  }

  // ==========================================
  // SLIDE 3: Problem Statement & MIS Solution
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 3, 'The Strategic Healthcare Problem & MIS Solution', 'المشكلة الاستراتيجية والحل الرقمي');

    // Left Card: The Bottlenecks
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.25, w: 5.6, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.coralRed, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('❌ TRADITIONAL HEALTHCARE CHALLENGES\nتحديات الأنظمة الورقية والتقليدية', {
      x: 1.1, y: 1.45, w: 5.0, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.coralRed, bold: true, margin: 0
    });

    const problems = [
      { title: 'Triage Delays & Lost Golden Hour', ar: 'تأخر الفرز وضياع الساعة الذهبية لإنقاذ الحالات' },
      { title: 'Fragmented Paper Patient Records', ar: 'تشتت السجلات الطبية الورقية وصعوبة الوصول إليها' },
      { title: 'Blind Bed & ICU Capacity', ar: 'غياب الرؤية اللحظية لشاغر الأسرة والعناية المركزة' },
      { title: 'Billing Leakage & Diagnostic Chaos', ar: 'تسرب الإيرادات وتأخر تقارير المختبر والأشعة' }
    ];

    let pY = 2.25;
    problems.forEach((p, idx) => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: pY, w: 5.1, h: 0.95,
        fill: { color: '281318' },
        line: { color: '4A1D24', width: 1 },
        rectRadius: 0.08
      });
      slide.addText([
        { text: `⚠️ ${p.title}\n`, options: { fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, bold: true } },
        { text: p.ar, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.textMuted } }
      ], { x: 1.2, y: pY + 0.1, w: 4.8, h: 0.75, margin: 0 });
      pY += 1.05;
    });

    // Right Card: The MEDEVAC Solution
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.9, y: 1.25, w: 5.6, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('✅ THE MEDEVAC MIS PLATFORM SOLUTION\nحلول منظومة الإخلاء الطبي الذكية', {
      x: 7.2, y: 1.45, w: 5.0, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    const solutions = [
      { title: 'Sub-Second Triage & Allergy Warnings', ar: 'فرز لحظي وتنبيه فوري لفصائل الدم والحساسية القاتلة' },
      { title: 'Unified Electronic Health Records (EHR)', ar: 'ملف طبي إلكتروني موحد يوثق كافة الزيارات والتشخيصات' },
      { title: 'Live Interactive Bed Matrix', ar: 'خريطة أسرّة حية للأقسام والعناية المركزة والعمليات' },
      { title: 'End-to-End Automated Revenue Cycle', ar: 'فوترة آلية متصلة بالصيدلية والمختبر والأشعة دون تسريب' }
    ];

    let sY = 2.25;
    solutions.forEach((s, idx) => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 7.15, y: sY, w: 5.1, h: 0.95,
        fill: { color: '0E2E23' },
        line: { color: '1C5440', width: 1 },
        rectRadius: 0.08
      });
      slide.addText([
        { text: `🛡 ${s.title}\n`, options: { fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, bold: true } },
        { text: s.ar, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.textMuted } }
      ], { x: 7.3, y: sY + 0.1, w: 4.8, h: 0.75, margin: 0 });
      sY += 1.05;
    });
  }

  // ==========================================
  // SLIDE 4: Architecture & Data Flow
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 4, '3-Tier System Architecture & Real-Time Data Pipeline', 'معمارية النظام ثلاثية الطبقات وتدفق البيانات');

    const tiers = [
      {
        num: 'TIER 1',
        title: 'Presentation & UI Layer',
        ar: 'طبقة واجهة المستخدم التفاعلية',
        color: COLORS.cyanPrimary,
        desc: '• React 18 & Ant Design System\n• Responsive Mobile-First Layout\n• Real-Time Visual Alert Badges\n• Interactive System Navigation Map'
      },
      {
        num: 'TIER 2',
        title: 'Application & Business Logic',
        ar: 'طبقة منطق الأعمال والتحكم',
        color: COLORS.cyanBlue,
        desc: '• Zustand Reactive Global Store\n• Multi-Admin RBAC Security Engine\n• Clinical Order Dispatcher (SOAP/ICD)\n• Instant Admin Profile Synchronizer'
      },
      {
        num: 'TIER 3',
        title: 'Persistence & Cloud Engine',
        ar: 'طبقة البيانات والاستدامة الدائمة',
        color: COLORS.emeraldGreen,
        desc: '• Dual Engine: LocalStorage Zero-Loss\n• Google Firebase Cloud Sync\n• Isolated IFrame PDF Reporting\n• Multi-Table Excel Data Pipeline'
      }
    ];

    tiers.forEach((t, i) => {
      const x = 0.8 + i * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 5.1,
        fill: { color: COLORS.navyCard },
        line: { color: t.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fill: { color: COLORS.navyLight },
        line: { color: t.color, width: 1 },
        rectRadius: 0.1
      });
      slide.addText(t.num, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fontFace: 'Arial', fontSize: 12, color: t.color, bold: true, align: 'center', margin: 0
      });

      slide.addText(t.title, {
        x: x + 0.2, y: 2.2, w: 3.3, h: 0.55,
        fontFace: 'Arial', fontSize: 14, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(t.ar, {
        x: x + 0.2, y: 2.75, w: 3.3, h: 0.45,
        fontFace: 'Arial', fontSize: 12, color: COLORS.cyanBlue, align: 'center', margin: 0
      });

      slide.addShape(pptx.ShapeType.line, {
        x: x + 0.5, y: 3.3, w: 2.7, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });

      slide.addText(t.desc, {
        x: x + 0.3, y: 3.5, w: 3.1, h: 2.7,
        fontFace: 'Arial', fontSize: 12, color: COLORS.textLight, margin: 0
      });
    });
  }

  // ==========================================
  // SLIDE 5: Patient Lifecycle & Triage
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 5, 'Patient Intake, Emergency Triage & EHR Lifecycle', 'دورة حياة المريض والفرز التكتيكي والسجلات');

    const steps = [
      {
        step: 'STEP 1',
        title: 'Intake & Verification',
        ar: 'الاستقبال والتحقق من الهوية',
        details: '• National ID & MRN Generation\n• 14-digit Egyptian ID parsing\n• Instant duplicate detection'
      },
      {
        step: 'STEP 2',
        title: 'Tactical Triage',
        ar: 'الفرز والإنذار المبكر',
        details: '• Critical blood type matching\n• Allergy flagging (Penicillin, etc.)\n• Emergency contact logging'
      },
      {
        step: 'STEP 3',
        title: 'Clinical Consultation',
        ar: 'الكشف السريري والتشخيص',
        details: '• Specialty routing (10+ clinics)\n• Doctor appointment slotting\n• SOAP notes & ICD-10 encoding'
      },
      {
        step: 'STEP 4',
        title: 'Continuous EHR',
        ar: 'السجل الطبي المستمر',
        details: '• Complete medical visit history\n• Longitudinal diagnostic chart\n• Encrypted patient archiving'
      }
    ];

    steps.forEach((s, idx) => {
      const x = 0.8 + idx * 3.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.4, w: 2.75, h: 4.0,
        fill: { color: COLORS.navyCard },
        line: { color: COLORS.navyLight, width: 1.2 },
        rectRadius: 0.12
      });

      slide.addText(s.step, {
        x: x + 0.2, y: 1.6, w: 2.35, h: 0.35,
        fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
      });

      slide.addText(s.title, {
        x: x + 0.1, y: 2.0, w: 2.55, h: 0.5,
        fontFace: 'Arial', fontSize: 13, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(s.ar, {
        x: x + 0.1, y: 2.5, w: 2.55, h: 0.45,
        fontFace: 'Arial', fontSize: 11, color: COLORS.cyanBlue, align: 'center', margin: 0
      });

      slide.addText(s.details, {
        x: x + 0.2, y: 3.1, w: 2.35, h: 2.1,
        fontFace: 'Arial', fontSize: 11, color: COLORS.textLight, margin: 0
      });

      // Flow Arrow
      if (idx < 3) {
        slide.addText('➔', {
          x: x + 2.65, y: 3.0, w: 0.4, h: 0.5,
          fontFace: 'Arial', fontSize: 20, color: COLORS.cyanPrimary, align: 'center', margin: 0
        });
      }
    });

    // Bottom Summary Banner
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.65, w: 11.7, h: 0.95,
      fill: { color: '0D2438' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });

    slide.addText([
      { text: 'Clinical Safety Standard: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Every patient is protected with automated allergy cross-matching before doctor prescriptions are processed.  |  ' },
      { text: 'معيار السلامة: حماية تلقائية تمنع صرف أي دواء يتعارض مع حساسية المريض المسجلة.', options: { color: COLORS.textLight } }
    ], { x: 1.1, y: 5.75, w: 11.1, h: 0.75, fontFace: 'Arial', fontSize: 11, color: COLORS.textWhite, margin: 0 });
  }

  // ==========================================
  // SLIDE 6: Diagnostic Workflows (LIS, RIS, Pharmacy)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 6, 'Clinical Diagnostics: LIS, RIS & Smart Pharmacy', 'التكامل الإكلينيكي: المختبر، الأشعة، والصيدلية الذكية');

    const diagModules = [
      {
        icon: '🔬',
        nameEn: 'Laboratory System (LIS)',
        nameAr: 'المختبر المركزي والتحاليل',
        color: COLORS.cyanPrimary,
        features: [
          '• CBC, Lipid Profiles, HbA1c, Stool Culture',
          '• STAT (Emergency) vs Routine Prioritization',
          '• Automated Abnormal Range Detection',
          '• Real-time Doctor Result Notification'
        ]
      },
      {
        icon: '🩻',
        nameEn: 'Radiology System (RIS)',
        nameAr: 'الأشعة والتصوير الطبي',
        color: COLORS.cyanBlue,
        features: [
          '• X-Ray, CT, MRI, Ultrasound & ECHO',
          '• Digital Modality Scheduling & Routing',
          '• Radiologist Diagnostic Report Engine',
          '• Urgent Trauma & Triage Prioritization'
        ]
      },
      {
        icon: '💊',
        nameEn: 'Digital Pharmacy & Stock',
        nameAr: 'الصيدلية وإدارة المخزون الدوائي',
        color: COLORS.emeraldGreen,
        features: [
          '• Direct Prescription Electronic Dispensing',
          '• Minimum Stock Threshold Alerts',
          '• Patient Allergy Interaction Cross-Check',
          '• Full Expiry & Movement Audit Trail'
        ]
      }
    ];

    diagModules.forEach((m, i) => {
      const x = 0.8 + i * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 5.1,
        fill: { color: COLORS.navyCard },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(m.icon, {
        x: x + 1.2, y: 1.55, w: 1.3, h: 0.7,
        fontFace: 'Arial', fontSize: 32, align: 'center', margin: 0
      });

      slide.addText(m.nameEn, {
        x: x + 0.2, y: 2.35, w: 3.3, h: 0.45,
        fontFace: 'Arial', fontSize: 14, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(m.nameAr, {
        x: x + 0.2, y: 2.8, w: 3.3, h: 0.4,
        fontFace: 'Arial', fontSize: 12, color: m.color, align: 'center', margin: 0
      });

      slide.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 3.3, w: 2.9, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });

      slide.addText(m.features.join('\n\n'), {
        x: x + 0.3, y: 3.55, w: 3.1, h: 2.7,
        fontFace: 'Arial', fontSize: 11, color: COLORS.textLight, margin: 0
      });
    });
  }

  // ==========================================
  // SLIDE 7: Bed Logistics & Evacuation
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 7, 'Inpatient Bed Logistics & Evacuation Readiness', 'إدارة الأسرّة والتنويم والجاهزية للإخلاء الطبي');

    // Left Box: Dynamic Bed Matrix
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.8, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🛏 DYNAMIC BED CAPACITY MATRIX\nخريطة الطاقة الاستيعابية للأسرّة الحية', {
      x: 1.1, y: 1.55, w: 6.2, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    const bedCategories = [
      { name: 'Intensive Care Unit (ICU)', count: '12 Beds', status: '83% Occupied (Critical Ready)', color: COLORS.coralRed },
      { name: 'Emergency & Trauma Ward', count: '20 Beds', status: 'Active Surge Allocation', color: COLORS.amberWarn },
      { name: 'Surgical & Inpatient Ward', count: '45 Beds', status: 'Standard Admission Flow', color: COLORS.emeraldGreen },
      { name: 'Private / Isolation Units', count: '10 Beds', status: 'Infection Control Protocol', color: COLORS.cyanBlue }
    ];

    let bY = 2.4;
    bedCategories.forEach(b => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: bY, w: 6.2, h: 0.8,
        fill: { color: COLORS.navyLight },
        line: { color: b.color, width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${b.name}  `, options: { fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, bold: true } },
        { text: `[${b.count}]\n`, options: { fontFace: 'Arial', fontSize: 11, color: b.color, bold: true } },
        { text: b.status, options: { fontFace: 'Arial', fontSize: 10, color: COLORS.textMuted } }
      ], { x: 1.3, y: bY + 0.1, w: 5.8, h: 0.6, margin: 0 });

      bY += 0.95;
    });

    // Right Box: Tactical Evacuation Protocol
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.35, w: 4.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🚁 MEDEVAC READINESS PROTOCOL\nبروتوكول جاهزية الإخلاء الطبي', {
      x: 8.1, y: 1.55, w: 4.2, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    slide.addText([
      { text: '1. Instant Triage Pre-Notification\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Pre-arrival notification from field medical helicopters allows bed reservation before landing.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '2. Rapid Ward Transfers\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'One-click patient transfer between Emergency, Operating Theatres, and ICU.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '3. Discharge & Audit Tracking\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Complete discharge documentation ensuring bed sanitization and re-entry into available pool.', options: { color: COLORS.textLight, fontSize: 11 } }
    ], { x: 8.1, y: 2.35, w: 4.2, h: 3.9, fontFace: 'Arial', margin: 0 });
  }

  // ==========================================
  // SLIDE 8: Financial Management & Invoicing
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 8, 'Financial Governance & Automated Medical Invoicing', 'الحوكمة المالية والفوترة الطبية الآلية');

    const pillars = [
      {
        title: 'Auto-Consolidation',
        ar: 'الدمج الآلي للخدمات',
        desc: 'Consultations, lab diagnostics, radiology imaging, medications, and bed stay fees automatically assemble into unified invoices (INV-901 ... INV-915).'
      },
      {
        title: 'Multi-Channel Settlement',
        ar: 'تعدد قنوات السداد المعتمدة',
        desc: 'Flexible payment channels: Cash, Medical Insurance claims with deductibles, and Electronic Credit Cards with complete receipt verification.'
      },
      {
        title: 'Zero Revenue Leakage',
        ar: 'منع تسريب الإيرادات',
        desc: 'Unpaid invoice tracking, insurance co-pay tracking, and end-of-day reconciliation summaries for financial transparency and auditing.'
      }
    ];

    pillars.forEach((p, idx) => {
      const x = 0.8 + idx * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 4.0,
        fill: { color: COLORS.navyCard },
        line: { color: COLORS.navyLight, width: 1.2 },
        rectRadius: 0.15
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fill: { color: COLORS.navyLight },
        line: { color: COLORS.cyanPrimary, width: 1 },
        rectRadius: 0.08
      });
      slide.addText(`PILLAR ${idx + 1}`, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
      });

      slide.addText(p.title, {
        x: x + 0.2, y: 2.2, w: 3.3, h: 0.45,
        fontFace: 'Arial', fontSize: 14, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(p.ar, {
        x: x + 0.2, y: 2.65, w: 3.3, h: 0.4,
        fontFace: 'Arial', fontSize: 12, color: COLORS.cyanBlue, align: 'center', margin: 0
      });

      slide.addText(p.desc, {
        x: x + 0.3, y: 3.2, w: 3.1, h: 1.9,
        fontFace: 'Arial', fontSize: 11, color: COLORS.textLight, margin: 0
      });
    });

    // Metric Summary Bar
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.65, w: 11.7, h: 0.95,
      fill: { color: '172A45' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });

    slide.addText([
      { text: 'Financial Auditing Standard: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Invoices cannot be altered after status changes to "Paid" without authorized supervisor elevation.  |  ' },
      { text: 'حوكمة المحاسبة: لا يمكن تعديل الفاتورة بعد السداد إلا بصلاحية مدير معتمد.', options: { color: COLORS.textLight } }
    ], { x: 1.1, y: 5.75, w: 11.1, h: 0.75, fontFace: 'Arial', fontSize: 11, color: COLORS.textWhite, margin: 0 });
  }

  // ==========================================
  // SLIDE 9: Multi-Admin RBAC & Security
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 9, 'Multi-Admin RBAC Governance & Dynamic Identity', 'الأمان، الحوكمة وإدارة صلاحيات المشرفين المتعددين');

    // Left Column: RBAC Matrix
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.8, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🔐 ROLE-BASED ACCESS CONTROL (RBAC)\nمصفوفة الصلاحيات والحماية متعددة المستويات', {
      x: 1.1, y: 1.55, w: 6.2, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    const roles = [
      { role: 'SUPER ADMIN (Lead Commander)', access: 'Full unconstrained system authority & DB exports', color: COLORS.goldStar },
      { role: 'SUB-ADMINS (Operations)', access: 'Custom departmental access (configurable per module)', color: COLORS.cyanPrimary },
      { role: 'DOCTORS & CLINICIANS', access: 'EHR, diagnosis, lab/radiology orders, prescriptions', color: COLORS.cyanBlue },
      { role: 'RECEPTION & FINANCE', access: 'Patient intake, appointment booking, billing & cashier', color: COLORS.emeraldGreen }
    ];

    let rY = 2.4;
    roles.forEach(r => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: rY, w: 6.2, h: 0.8,
        fill: { color: COLORS.navyLight },
        line: { color: r.color, width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${r.role}\n`, options: { fontFace: 'Arial', fontSize: 11, color: r.color, bold: true } },
        { text: r.access, options: { fontFace: 'Arial', fontSize: 10, color: COLORS.textLight } }
      ], { x: 1.3, y: rY + 0.1, w: 5.8, h: 0.6, margin: 0 });

      rY += 0.95;
    });

    // Right Column: Dynamic Live Identity
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.35, w: 4.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.goldStar, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('⚡ REACTIVE IDENTITY ENGINE\nالتحديث اللحظي لبيانات المسؤولين', {
      x: 8.1, y: 1.55, w: 4.2, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.goldStar, bold: true, margin: 0
    });

    slide.addText([
      { text: '• Zero-Downtime Profile Sync:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Admin name and credential updates instantly sync to the top-header navigation without requiring page reloads.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '• Dual Persistence Guarantee:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'All admin changes are permanently written to browser local storage and guarded against legacy database overwrite.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '• Granular Module Switches:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Primary Admin can grant or revoke any of the 14 system modules per user with instant enforcement.', options: { color: COLORS.textLight, fontSize: 11 } }
    ], { x: 8.1, y: 2.35, w: 4.2, h: 3.9, fontFace: 'Arial', margin: 0 });
  }

  // ==========================================
  // SLIDE 10: Operational Impact & References
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 10, 'Operational Impact, Future Roadmap & References', 'الأثر التشغيلي، آفاق التطوير والمراجع الأكاديمية');

    // Left Box: Measurable Outcomes
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('📊 MEASURABLE IMPACT METRICS\nمؤشرات الأثر التشغيلي المحققة', {
      x: 1.1, y: 1.55, w: 5.0, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    const metrics = [
      { val: '65% ⬇', label: 'Reduction in Emergency Triage Delay', ar: 'انخفاض زمن فرز الطوارئ' },
      { val: '100% 📄', label: 'Paperless Clinical Documentation', ar: 'توثيق رقمي كامل بدون ورق' },
      { val: '0% 🛡', label: 'Zero Data Loss (Dual Persistence)', ar: 'حماية كاملة من فقدان البيانات' },
      { val: '<1s ⚡', label: 'EHR Instant Retrieval Time', ar: 'استرجاع فوري لملف المريض' }
    ];

    let mY = 2.35;
    metrics.forEach(m => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: mY, w: 5.0, h: 0.8,
        fill: { color: COLORS.navyLight },
        line: { color: COLORS.cyanBlue, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(m.val, {
        x: 1.2, y: mY + 0.1, w: 1.2, h: 0.6,
        fontFace: 'Arial', fontSize: 16, color: COLORS.cyanPrimary, bold: true, margin: 0
      });

      slide.addText([
        { text: `${m.label}\n`, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.textWhite, bold: true } },
        { text: m.ar, options: { fontFace: 'Arial', fontSize: 10, color: COLORS.textMuted } }
      ], { x: 2.45, y: mY + 0.08, w: 3.5, h: 0.65, margin: 0 });

      mY += 0.95;
    });

    // Right Box: Academic References & Roadmap
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.35, w: 5.7, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('📚 ACADEMIC REFERENCES & FUTURE ROADMAP\nالمراجع العلمية وخارطة التطوير القادمة', {
      x: 7.1, y: 1.55, w: 5.1, h: 0.7,
      fontFace: 'Arial', fontSize: 13, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    slide.addText([
      { text: 'Future Innovation Roadmap:\n', options: { bold: true, color: COLORS.goldStar, fontSize: 12 } },
      { text: '• AI-driven triage prioritization for mass-casualty incidents.\n• IoT ambulance telemetry integration for real-time vitals broadcasting.\n• Biometric smart patient identification card integration.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: 'Academic & International Standards References:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: '1. HIMSS EMRAM Model (Electronic Medical Record Adoption Model, Stage 6/7 Requirements).\n2. World Health Organization (WHO) Global Strategy on Digital Health (2020-2025).\n3. Health Level Seven International (HL7 FHIR Release 4) for Clinical Data Interoperability.\n4. Shortliffe & Cimino (Eds.), Biomedical Informatics: Computer Applications in Health Care and Biomedicine (Springer).', options: { color: COLORS.textMuted, fontSize: 10 } }
    ], { x: 7.1, y: 2.35, w: 5.1, h: 3.9, fontFace: 'Arial', margin: 0 });
  }

  return pptx;
}

function createEnglishPresentation() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'MEDEVAC TEAM';
  pptx.company = 'MEDEVAC OPERATIONS & HOSPITAL MIS';
  pptx.title = 'MEDEVAC MIS - Executive English Presentation';

  function addSlideBranding(slide, slideNum, titleEn) {
    slide.background = { color: COLORS.navyDark };
    slide.transition = { type: 'fade', duration: 0.8 };

    // Top Accent Glow Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.1,
      fill: { color: COLORS.cyanPrimary },
      line: { color: COLORS.cyanPrimary }
    });

    if (slideNum > 1) {
      slide.addText(titleEn, {
        x: 0.8, y: 0.35, w: 11.5, h: 0.55,
        fontFace: 'Arial', fontSize: 20, color: COLORS.cyanPrimary, bold: true, margin: 0
      });

      slide.addShape(pptx.ShapeType.line, {
        x: 0.8, y: 0.95, w: 11.7, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });
    }

    // Bottom Footer on EVERY slide
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8, y: 6.9, w: 11.7, h: 0,
      line: { color: COLORS.navyLight, width: 1 }
    });

    slide.addText('PREPARED BY MEDEVAC TEAM', {
      x: 0.8, y: 7.0, w: 5.5, h: 0.35,
      fontFace: 'Arial', fontSize: 10, color: COLORS.cyanBlue, bold: true, margin: 0
    });

    slide.addText(`HOSPITAL INFORMATION SYSTEM (MIS)  •  SLIDE ${slideNum} OF 10`, {
      x: 6.5, y: 7.0, w: 6.0, h: 0.35,
      fontFace: 'Arial', fontSize: 10, color: COLORS.textMuted, align: 'right', margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 1, '');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 1.0, w: 11.3, h: 5.5,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.navyLight, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.3, y: 1.4, w: 4.7, h: 0.45,
      fill: { color: COLORS.navyLight },
      line: { color: COLORS.cyanPrimary, width: 1 },
      rectRadius: 0.2
    });
    slide.addText('NEXT-GENERATION HEALTHCARE INFORMATION SYSTEM', {
      x: 4.3, y: 1.4, w: 4.7, h: 0.45,
      fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
    });

    slide.addText('MEDEVAC OPERATIONS & HOSPITAL MIS', {
      x: 1.5, y: 2.2, w: 10.3, h: 0.9,
      fontFace: 'Arial', fontSize: 34, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
    });

    slide.addText('Tactical Evacuation Management, Rapid Clinical Triage & Inpatient Governance', {
      x: 1.5, y: 3.2, w: 10.3, h: 0.6,
      fontFace: 'Arial', fontSize: 18, color: COLORS.cyanBlue, bold: true, align: 'center', margin: 0
    });

    slide.addText('An Enterprise Platform Engineered to Deliver Sub-Second Patient Data Retrieval, Zero-Loss Dual Persistence, and Integrated Clinical Decision Support.', {
      x: 2.0, y: 3.9, w: 9.3, h: 0.9,
      fontFace: 'Arial', fontSize: 13, color: COLORS.textLight, align: 'center'
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 3.4, y: 5.1, w: 3.0, h: 0.6,
      fill: { color: '0A2A42' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });
    slide.addText('⏱ 5-Minute Executive Briefing', {
      x: 3.4, y: 5.1, w: 3.0, h: 0.6,
      fontFace: 'Arial', fontSize: 12, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.9, y: 5.1, w: 3.0, h: 0.6,
      fill: { color: '063327' },
      line: { color: COLORS.emeraldGreen, width: 1 },
      rectRadius: 0.1
    });
    slide.addText('🛡 Zero Data-Loss Resilience', {
      x: 6.9, y: 5.1, w: 3.0, h: 0.6,
      fontFace: 'Arial', fontSize: 12, color: COLORS.emeraldGreen, bold: true, align: 'center', margin: 0
    });
  }

  // ==========================================
  // SLIDE 2: Project Authors & Academic Supervision
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 2, 'Project Authors & Academic Supervision');

    // Left Column: Team
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.25, w: 6.3, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.navyLight, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('👨‍💻 PREPARED BY: MEDEVAC TEAM (5 MEMBERS)', {
      x: 1.1, y: 1.5, w: 5.7, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    const members = [
      { name: '1. Muhammed Wael Mohamed', role: 'Team Lead & Full-Stack Architect' },
      { name: '2. Ahmed Mohamed Abdelmageed', role: 'Database & Cloud Integration Specialist' },
      { name: '3. Yazan Waleed', role: 'Clinical Workflows & UI/UX Engineer' },
      { name: '4. Mariam Yasser', role: 'Quality Assurance & Business Analyst' },
      { name: '5. Nayera Hussein', role: 'Health Informatics & Security Specialist' }
    ];

    let mY = 2.2;
    members.forEach(m => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: mY, w: 5.8, h: 0.75,
        fill: { color: COLORS.navyLight },
        line: { color: '2D4373', width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${m.name}\n`, options: { fontFace: 'Arial', fontSize: 13, color: COLORS.textWhite, bold: true } },
        { text: m.role, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.cyanBlue } }
      ], { x: 1.25, y: mY + 0.1, w: 5.4, h: 0.6, margin: 0 });

      mY += 0.85;
    });

    // Right Column: Supervision
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.4, y: 1.25, w: 5.1, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.goldStar, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText('⭐ ACADEMIC SUPERVISION', {
      x: 7.7, y: 1.5, w: 4.5, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.goldStar, bold: true, margin: 0
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.7, y: 2.25, w: 4.5, h: 1.5,
      fill: { color: '2A2412' },
      line: { color: COLORS.goldStar, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addText('UNDER THE SUPERVISION OF:', {
      x: 7.9, y: 2.45, w: 4.1, h: 0.3,
      fontFace: 'Arial', fontSize: 11, color: COLORS.goldStar, bold: true, align: 'center', margin: 0
    });

    slide.addText('Dr. Mahmoud Saad', {
      x: 7.9, y: 2.85, w: 4.1, h: 0.6,
      fontFace: 'Arial', fontSize: 24, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
    });

    slide.addText([
      { text: 'Academic Institution: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Faculty of Computers & Artificial Intelligence / Healthcare Informatics\n\n' },
      { text: 'Core Field: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Hospital Information Systems (MIS), Rapid Emergency Triage, Tactical Evacuation Logistics & Role-Based Access Control' }
    ], { x: 7.7, y: 4.05, w: 4.5, h: 2.2, fontFace: 'Arial', fontSize: 12, color: COLORS.textLight });
  }

  // ==========================================
  // SLIDE 3: Problem Statement (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 3, 'The Strategic Healthcare Bottleneck & The MIS Solution');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.25, w: 5.6, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.coralRed, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('❌ TRADITIONAL HEALTHCARE BOTTLENECKS', {
      x: 1.1, y: 1.5, w: 5.0, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.coralRed, bold: true, margin: 0
    });

    const problems = [
      { title: 'Triage Delays & Lost Golden Hour', desc: 'Paper queues cause fatal delays during critical emergency triage and evacuation transfer.' },
      { title: 'Fragmented Paper Patient Records', desc: 'Missing allergy or history charts risk catastrophic medication and drug interaction errors.' },
      { title: 'Bed Availability Blind Spots', desc: 'No live visibility into ICU and ward capacity creates dangerous transfer delays.' },
      { title: 'Billing Leakage & Diagnostic Friction', desc: 'Uncoordinated lab and pharmacy orders lead to revenue loss and untracked debts.' }
    ];

    let pY = 2.15;
    problems.forEach(p => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.05, y: pY, w: 5.1, h: 1.0,
        fill: { color: '281318' },
        line: { color: '4A1D24', width: 1 },
        rectRadius: 0.08
      });
      slide.addText([
        { text: `⚠️ ${p.title}\n`, options: { fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, bold: true } },
        { text: p.desc, options: { fontFace: 'Arial', fontSize: 10.5, color: COLORS.textLight } }
      ], { x: 1.2, y: pY + 0.1, w: 4.8, h: 0.8, margin: 0 });
      pY += 1.1;
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.9, y: 1.25, w: 5.6, h: 5.3,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('✅ THE MEDEVAC MIS PLATFORM SOLUTION', {
      x: 7.2, y: 1.5, w: 5.0, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    const solutions = [
      { title: 'Sub-Second Triage & Instant Allergy Alerts', desc: 'Automated warnings for Penicillin, Sulfa, and Contrast dye before any order is written.' },
      { title: 'Unified Electronic Health Records (EHR)', desc: 'Single longitudinal record consolidating visits, diagnostics, and doctor notes.' },
      { title: 'Live Interactive Bed Matrix', desc: 'Real-time color-coded capacity tracking across ICU, Wards, and Operating Rooms.' },
      { title: 'End-to-End Automated Revenue Cycle', desc: 'Direct billing integration with Cash, Insurance Claims, and Card payments.' }
    ];

    let sY = 2.15;
    solutions.forEach(s => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 7.15, y: sY, w: 5.1, h: 1.0,
        fill: { color: '0E2E23' },
        line: { color: '1C5440', width: 1 },
        rectRadius: 0.08
      });
      slide.addText([
        { text: `🛡 ${s.title}\n`, options: { fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, bold: true } },
        { text: s.desc, options: { fontFace: 'Arial', fontSize: 10.5, color: COLORS.textLight } }
      ], { x: 7.3, y: sY + 0.1, w: 4.8, h: 0.8, margin: 0 });
      sY += 1.1;
    });
  }

  // ==========================================
  // SLIDE 4: Architecture (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 4, '3-Tier System Architecture & Real-Time Data Pipeline');

    const tiers = [
      {
        num: 'TIER 1',
        title: 'Presentation & UI Layer',
        color: COLORS.cyanPrimary,
        desc: '• React 18 & Ant Design Enterprise\n• Responsive Mobile & Desktop Layout\n• Real-Time Alert & Status Badges\n• Interactive System Navigation Map\n• High-Contrast Medical Tactical Theme'
      },
      {
        num: 'TIER 2',
        title: 'Application & Business Logic',
        color: COLORS.cyanBlue,
        desc: '• Zustand Reactive State Machine\n• Multi-Admin RBAC Permission Engine\n• Clinical Order Pipeline (LIS/RIS/Rx)\n• Live Reactive Admin Profile Sync\n• Input Validation & Duplicate Guards'
      },
      {
        num: 'TIER 3',
        title: 'Persistence & Cloud Engine',
        color: COLORS.emeraldGreen,
        desc: '• Dual Engine: LocalStorage Zero-Loss\n• Google Firebase Cloud Synchronization\n• Isolated IFrame PDF Print Engine\n• Multi-Sheet Excel Data Pipeline\n• Anti-Overwrite Cloud Data Shields'
      }
    ];

    tiers.forEach((t, i) => {
      const x = 0.8 + i * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 5.1,
        fill: { color: COLORS.navyCard },
        line: { color: t.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fill: { color: COLORS.navyLight },
        line: { color: t.color, width: 1 },
        rectRadius: 0.1
      });
      slide.addText(t.num, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fontFace: 'Arial', fontSize: 12, color: t.color, bold: true, align: 'center', margin: 0
      });

      slide.addText(t.title, {
        x: x + 0.2, y: 2.2, w: 3.3, h: 0.6,
        fontFace: 'Arial', fontSize: 15, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addShape(pptx.ShapeType.line, {
        x: x + 0.5, y: 2.95, w: 2.7, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });

      slide.addText(t.desc, {
        x: x + 0.3, y: 3.2, w: 3.1, h: 3.0,
        fontFace: 'Arial', fontSize: 12, color: COLORS.textLight, margin: 0
      });
    });
  }

  // ==========================================
  // SLIDE 5: Patient Lifecycle & Triage (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 5, 'Patient Intake, Emergency Triage & EHR Lifecycle');

    const steps = [
      {
        step: 'STAGE 1',
        title: 'Intake & Verification',
        details: '• National ID Parsing (14-digit Egyptian ID)\n• Automated MRN Generation (PAT-001 ... PAT-015)\n• Demographic & Contact Recording'
      },
      {
        step: 'STAGE 2',
        title: 'Tactical Triage',
        details: '• Blood Group Identification (A+, O-, AB+)\n• Severe Allergy Flagging (Penicillin, Sulfa)\n• Emergency Next-of-Kin Contact Logging'
      },
      {
        step: 'STAGE 3',
        title: 'Clinical Consultation',
        details: '• Routing to 10+ Speciality Clinics\n• Structured SOAP Clinical Records\n• ICD-10 International Codification'
      },
      {
        step: 'STAGE 4',
        title: 'Longitudinal EHR',
        details: '• Real-Time Medical History Log\n• Diagnostic Order Attachment\n• Digital Archive & Document Security'
      }
    ];

    steps.forEach((s, idx) => {
      const x = 0.8 + idx * 3.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.4, w: 2.75, h: 4.0,
        fill: { color: COLORS.navyCard },
        line: { color: COLORS.navyLight, width: 1.2 },
        rectRadius: 0.12
      });

      slide.addText(s.step, {
        x: x + 0.2, y: 1.6, w: 2.35, h: 0.35,
        fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
      });

      slide.addText(s.title, {
        x: x + 0.1, y: 2.05, w: 2.55, h: 0.55,
        fontFace: 'Arial', fontSize: 14, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(s.details, {
        x: x + 0.2, y: 2.8, w: 2.35, h: 2.4,
        fontFace: 'Arial', fontSize: 11, color: COLORS.textLight, margin: 0
      });

      if (idx < 3) {
        slide.addText('➔', {
          x: x + 2.65, y: 3.0, w: 0.4, h: 0.5,
          fontFace: 'Arial', fontSize: 20, color: COLORS.cyanPrimary, align: 'center', margin: 0
        });
      }
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.65, w: 11.7, h: 0.95,
      fill: { color: '0D2438' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });

    slide.addText([
      { text: 'Clinical Safety Guarantee: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'The system automatically halts doctor prescriptions if an active allergy (e.g., Penicillin) matches the prescribed antibiotic molecule.' }
    ], { x: 1.1, y: 5.75, w: 11.1, h: 0.75, fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, margin: 0 });
  }

  // ==========================================
  // SLIDE 6: Diagnostic Workflows (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 6, 'Clinical Diagnostics: LIS, RIS & Smart Pharmacy Integration');

    const diagModules = [
      {
        icon: '🔬',
        name: 'Laboratory System (LIS)',
        color: COLORS.cyanPrimary,
        features: [
          '• Automated Order Dispatch (ORD-501 ... ORD-520)',
          '• CBC, Stool Analysis, Lipid Profiles, HbA1c',
          '• STAT (Emergency) vs Routine Worklists',
          '• High-Low Critical Result Value Highlighting',
          '• Direct Integration with Patient Electronic File'
        ]
      },
      {
        icon: '🩻',
        name: 'Radiology System (RIS)',
        color: COLORS.cyanBlue,
        features: [
          '• Modality Routing: X-Ray, Ultrasound, CT, MRI',
          '• Emergency Trauma Scan Prioritization',
          '• Digital Radiologist Report & Findings Entry',
          '• Seamless Medical Record Association',
          '• Inpatient & Outpatient Image Dispatch'
        ]
      },
      {
        icon: '💊',
        name: 'Smart Pharmacy & Stock',
        color: COLORS.emeraldGreen,
        features: [
          '• Direct Prescription Electronic Dispensing',
          '• Safety Warning on Patient Allergies',
          '• Automatic Stock Re-order Threshold Warnings',
          '• Real-Time Medication Valuation & Pricing',
          '• Complete Batch & Expiry Tracking'
        ]
      }
    ];

    diagModules.forEach((m, i) => {
      const x = 0.8 + i * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 5.1,
        fill: { color: COLORS.navyCard },
        line: { color: m.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(m.icon, {
        x: x + 1.2, y: 1.6, w: 1.3, h: 0.7,
        fontFace: 'Arial', fontSize: 34, align: 'center', margin: 0
      });

      slide.addText(m.name, {
        x: x + 0.2, y: 2.4, w: 3.3, h: 0.5,
        fontFace: 'Arial', fontSize: 15, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addShape(pptx.ShapeType.line, {
        x: x + 0.4, y: 3.0, w: 2.9, h: 0,
        line: { color: COLORS.navyLight, width: 1 }
      });

      slide.addText(m.features.join('\n\n'), {
        x: x + 0.3, y: 3.2, w: 3.1, h: 3.0,
        fontFace: 'Arial', fontSize: 11, color: COLORS.textLight, margin: 0
      });
    });
  }

  // ==========================================
  // SLIDE 7: Bed Logistics (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 7, 'Inpatient Bed Logistics & Tactical Evacuation Readiness');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.8, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🛏 DYNAMIC BED CAPACITY MATRIX', {
      x: 1.1, y: 1.55, w: 6.2, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    const bedCategories = [
      { name: 'Intensive Care Unit (ICU)', count: '12 Beds', status: '83% Occupied (Critical Ready Reserve)', color: COLORS.coralRed },
      { name: 'Emergency & Trauma Ward', count: '20 Beds', status: 'Rapid Triage Surge Management', color: COLORS.amberWarn },
      { name: 'Surgical & General Inpatient', count: '45 Beds', status: 'Standard Inpatient Admission Flow', color: COLORS.emeraldGreen },
      { name: 'Private & Isolation Suites', count: '10 Beds', status: 'Strict Infection Control Protocols', color: COLORS.cyanBlue }
    ];

    let bY = 2.3;
    bedCategories.forEach(b => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: bY, w: 6.2, h: 0.85,
        fill: { color: COLORS.navyLight },
        line: { color: b.color, width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${b.name}  `, options: { fontFace: 'Arial', fontSize: 13, color: COLORS.textWhite, bold: true } },
        { text: `[${b.count}]\n`, options: { fontFace: 'Arial', fontSize: 11, color: b.color, bold: true } },
        { text: b.status, options: { fontFace: 'Arial', fontSize: 10.5, color: COLORS.textMuted } }
      ], { x: 1.3, y: bY + 0.1, w: 5.8, h: 0.65, margin: 0 });

      bY += 1.0;
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.35, w: 4.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🚁 MEDEVAC READINESS PROTOCOL', {
      x: 8.1, y: 1.55, w: 4.2, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    slide.addText([
      { text: '1. Inbound Helicopter Pre-Arrival:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Flight crew transmits triage data in-flight; ER teams lock an ICU bed before touchdown.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '2. Instant Inter-Ward Transfers:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'One-click patient relocation between Operating Rooms, Trauma bays, and Recovery.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '3. Automated Discharge & Sanitization:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Upon discharge, bed status shifts to "Maintenance" until housekeeping confirms sanitized ready-state.', options: { color: COLORS.textLight, fontSize: 11 } }
    ], { x: 8.1, y: 2.25, w: 4.2, h: 4.0, fontFace: 'Arial', margin: 0 });
  }

  // ==========================================
  // SLIDE 8: Financial Management (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 8, 'Financial Governance & Automated Medical Invoicing');

    const pillars = [
      {
        title: 'Auto-Consolidation',
        desc: 'All consultation fees, lab panels, radiology imaging, prescribed medications, and inpatient room charges automatically compile into unified patient invoices (INV-901 ... INV-915).'
      },
      {
        title: 'Multi-Channel Settlement',
        desc: 'Seamless multi-channel payment handling supporting Cash, Medical Insurance claims with deductibles, and Point-of-Sale Electronic Credit Cards with instant receipt issuance.'
      },
      {
        title: 'Zero Revenue Leakage',
        desc: 'Real-time unpaid balance alerts, insurance co-pay tracking, and automated shift-end reconciliation reports ensuring complete financial audit integrity and zero revenue leakage.'
      }
    ];

    pillars.forEach((p, idx) => {
      const x = 0.8 + idx * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 3.7, h: 4.0,
        fill: { color: COLORS.navyCard },
        line: { color: COLORS.navyLight, width: 1.2 },
        rectRadius: 0.15
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fill: { color: COLORS.navyLight },
        line: { color: COLORS.cyanPrimary, width: 1 },
        rectRadius: 0.08
      });
      slide.addText(`PILLAR ${idx + 1}`, {
        x: x + 0.3, y: 1.6, w: 3.1, h: 0.45,
        fontFace: 'Arial', fontSize: 11, color: COLORS.cyanPrimary, bold: true, align: 'center', margin: 0
      });

      slide.addText(p.title, {
        x: x + 0.2, y: 2.25, w: 3.3, h: 0.5,
        fontFace: 'Arial', fontSize: 15, color: COLORS.textWhite, bold: true, align: 'center', margin: 0
      });

      slide.addText(p.desc, {
        x: x + 0.3, y: 2.95, w: 3.1, h: 2.2,
        fontFace: 'Arial', fontSize: 11.5, color: COLORS.textLight, margin: 0
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 5.65, w: 11.7, h: 0.95,
      fill: { color: '172A45' },
      line: { color: COLORS.cyanBlue, width: 1 },
      rectRadius: 0.1
    });

    slide.addText([
      { text: 'Financial Integrity Standard: ', options: { bold: true, color: COLORS.cyanPrimary } },
      { text: 'Once an invoice status is finalized to "Paid", all line-items are locked and require authenticated supervisor credentials to issue adjustments or refunds.' }
    ], { x: 1.1, y: 5.75, w: 11.1, h: 0.75, fontFace: 'Arial', fontSize: 12, color: COLORS.textWhite, margin: 0 });
  }

  // ==========================================
  // SLIDE 9: Multi-Admin RBAC (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 9, 'Multi-Admin RBAC Governance & Dynamic Identity Engine');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 6.8, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('🔐 ROLE-BASED ACCESS CONTROL (RBAC)', {
      x: 1.1, y: 1.55, w: 6.2, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    const roles = [
      { role: 'SUPER ADMIN (Lead Commander)', access: 'Unrestricted system authority, facility branding, database exports & audit logs.', color: COLORS.goldStar },
      { role: 'SUB-ADMINS (Operations)', access: 'Custom departmental authority with granular per-module access rights.', color: COLORS.cyanPrimary },
      { role: 'DOCTORS & CLINICIANS', access: 'EHR records, SOAP clinical entry, lab/radiology ordering, electronic prescriptions.', color: COLORS.cyanBlue },
      { role: 'RECEPTION & CASHIER', access: 'Patient intake, appointment booking, bed assignments, cashiering & receipts.', color: COLORS.emeraldGreen }
    ];

    let rY = 2.25;
    roles.forEach(r => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: rY, w: 6.2, h: 0.85,
        fill: { color: COLORS.navyLight },
        line: { color: r.color, width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: `${r.role}\n`, options: { fontFace: 'Arial', fontSize: 11, color: r.color, bold: true } },
        { text: r.access, options: { fontFace: 'Arial', fontSize: 10.5, color: COLORS.textLight } }
      ], { x: 1.3, y: rY + 0.1, w: 5.8, h: 0.65, margin: 0 });

      rY += 1.0;
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.9, y: 1.35, w: 4.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.goldStar, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('⚡ REACTIVE IDENTITY ENGINE', {
      x: 8.1, y: 1.55, w: 4.2, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.goldStar, bold: true, margin: 0
    });

    slide.addText([
      { text: '• Zero-Downtime Profile Synchronization:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Modifications to administrator credentials and names immediately reflect across the top navigation bar without requiring a session logout or browser refresh.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '• Guaranteed Dual Persistence:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Changes permanently commit to local storage and are guarded against cloud rollback or stale database overwrites.\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: '• Granular 14-Module Permission Matrix:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: 'Lead administrators can toggle user access across all 14 independent system modules with instant runtime enforcement.', options: { color: COLORS.textLight, fontSize: 11 } }
    ], { x: 8.1, y: 2.25, w: 4.2, h: 4.0, fontFace: 'Arial', margin: 0 });
  }

  // ==========================================
  // SLIDE 10: Operational Impact & References (English)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideBranding(slide, 10, 'Operational Impact, Future Roadmap & Academic References');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: 1.35, w: 5.6, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.emeraldGreen, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('📊 MEASURABLE IMPACT METRICS', {
      x: 1.1, y: 1.55, w: 5.0, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.emeraldGreen, bold: true, margin: 0
    });

    const metrics = [
      { val: '65% ⬇', label: 'Reduction in Emergency Triage Delay', desc: 'Accelerating critical patient intervention during the Golden Hour.' },
      { val: '100% 📄', label: 'Paperless Clinical Operations', desc: 'Complete digital documentation across all hospital departments.' },
      { val: '0% 🛡', label: 'Zero Data Loss Guarantee', desc: 'Dual-layer persistence preventing accidental information loss.' },
      { val: '<1s ⚡', label: 'Sub-Second EHR Retrieval', desc: 'Instant access to vital history, allergies, and diagnostic results.' }
    ];

    let mY = 2.25;
    metrics.forEach(m => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1, y: mY, w: 5.0, h: 0.85,
        fill: { color: COLORS.navyLight },
        line: { color: COLORS.cyanBlue, width: 1 },
        rectRadius: 0.08
      });

      slide.addText(m.val, {
        x: 1.2, y: mY + 0.12, w: 1.2, h: 0.6,
        fontFace: 'Arial', fontSize: 16, color: COLORS.cyanPrimary, bold: true, margin: 0
      });

      slide.addText([
        { text: `${m.label}\n`, options: { fontFace: 'Arial', fontSize: 11, color: COLORS.textWhite, bold: true } },
        { text: m.desc, options: { fontFace: 'Arial', fontSize: 9.5, color: COLORS.textMuted } }
      ], { x: 2.45, y: mY + 0.08, w: 3.5, h: 0.7, margin: 0 });

      mY += 1.0;
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.35, w: 5.7, h: 5.2,
      fill: { color: COLORS.navyCard },
      line: { color: COLORS.cyanPrimary, width: 1.2 },
      rectRadius: 0.15
    });

    slide.addText('📚 ACADEMIC REFERENCES & ROADMAP', {
      x: 7.1, y: 1.55, w: 5.1, h: 0.45,
      fontFace: 'Arial', fontSize: 14, color: COLORS.cyanPrimary, bold: true, margin: 0
    });

    slide.addText([
      { text: 'Future Innovation Roadmap:\n', options: { bold: true, color: COLORS.goldStar, fontSize: 12 } },
      { text: '• AI-Assisted Triage Prioritization for Mass Casualty Events\n• IoT Telemetry Integration: Direct vitals sync from ambulance monitors\n• Smart Biometric Health Card authentication\n\n', options: { color: COLORS.textLight, fontSize: 11 } },
      { text: 'Academic & International Standard References:\n', options: { bold: true, color: COLORS.cyanPrimary, fontSize: 12 } },
      { text: '1. HIMSS Electronic Medical Record Adoption Model (EMRAM Stage 6/7 Guidelines).\n2. World Health Organization (WHO): Global Strategy on Digital Health 2020–2025.\n3. Health Level Seven International (HL7 FHIR Release 4) for Clinical Data Interoperability.\n4. Shortliffe & Cimino (Eds.), Biomedical Informatics: Computer Applications in Health Care and Biomedicine (Springer).', options: { color: COLORS.textMuted, fontSize: 10 } }
    ], { x: 7.1, y: 2.25, w: 5.1, h: 4.0, fontFace: 'Arial', margin: 0 });
  }

  return pptx;
}

async function run() {
  const desktopDir = 'C:\\Users\\Emak\\Desktop';
  const bilingualPath = path.join(desktopDir, 'MEDEVAC_MIS_Presentation_Bilingual.pptx');
  const englishPath = path.join(desktopDir, 'MEDEVAC_MIS_Presentation_English.pptx');

  console.log('Generating Bilingual Presentation...');
  const bilingualPptx = createBilingualPresentation();
  await bilingualPptx.writeFile({ fileName: bilingualPath });
  console.log(`Saved Bilingual Presentation to: ${bilingualPath}`);

  console.log('Generating English Presentation...');
  const englishPptx = createEnglishPresentation();
  await englishPptx.writeFile({ fileName: englishPath });
  console.log(`Saved English Presentation to: ${englishPath}`);
}

run().catch(err => {
  console.error('Error generating presentations:', err);
  process.exit(1);
});
