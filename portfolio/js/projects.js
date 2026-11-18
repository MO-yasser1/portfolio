/**
 * ============================================================================
 * projects.js — قائمة "نماذج من أعمالي"
 * ----------------------------------------------------------------------------
 * لإضافة مشروع جديد: انسخ أي بلوك { ... } بالكامل والصقه في آخر القائمة
 * (قبل علامة ] الأخيرة) ثم عدّل بياناته. الصفحة تبني الكارت تلقائيًا.
 *
 * الحقول:
 *   status  : 'wip'  = قيد التطوير   |   'live' = منشور (يظهر بنقطة خضراء)
 *   id      : أي اسم إنجليزي قصير غير مكرر (مثل 'clinic-site'). للتنظيم فقط ولا يظهر.
 *   device  : 'browser' = شاشة كمبيوتر  |  'phone' = موبايل  |  'none' = صورتك Mockup جاهزة بدون إطار
 *   mockup  : شكل النموذج الافتراضي (لو مفيش صورة): 'menu' | 'website' | 'dashboard'
 *   tone    : لون الخلفية خلف الصورة: 'teal' | 'warm' | 'deep'
 *   image   : مسار صورة المشروع (لقطة شاشة). مثال: 'images/projects/my-menu.png'
 *             اتركه '' ليظهر النموذج المرسوم تلقائيًا.
 *             أفضل مقاس: لقطة شاشة كاملة الطول (عرض 1400px للموقع / 750px للموبايل).
 *   link    : رابط المشروع الحي. اتركه '' لو لسه مفيش رابط.
 *   ar / en : النصوص بالعربية والإنجليزية (category, title, desc, tags)
 * ============================================================================
 */
/**
 * شكل العرض:
 *   'auto'    = كروت كبيرة حتى 4 مشاريع، وتتحول تلقائيًا لكروت أصغر لو زادت عن 4 (الموصى به)
 *   'large'   = كروت كبيرة دائمًا
 *   'compact' = كروت صغيرة دائمًا (واحد يمين وواحد يسار)
 */
window.PROJECTS_LAYOUT = 'compact';

window.PROJECTS = [
  {
    id: 'digital-menu',
    status: 'live',
    device: 'phone',
    mockup: 'menu',
    tone: 'teal',
    image: '',
    link: 'https://linguini-menu.pages.dev/',
    ar: {
      category: 'حلول المطاعم والكافيهات',
      title: 'منصة المنيو الرقمي وإدارة الطلبات',
      desc: 'حل متكامل للمطاعم يتيح تصفح قائمة الطعام بالصور والأسعار عبر رمز QR مع ربط مباشر بطلب الواتساب وتحديث سلس للأصناف.',
      tags: ['QR Code', 'منيو تفاعلي', 'واجهة متجاوبة']
    },
    en: {
      category: 'Restaurant & café solutions',
      title: 'Digital menu & order management platform',
      desc: 'A complete restaurant solution to browse the menu with photos and prices via QR code, with direct WhatsApp ordering and easy item updates.',
      tags: ['QR Code', 'Interactive menu', 'Responsive UI']
    }
  },
  {
    id: 'business-website',
    status: 'wip',
    device: 'browser',
    mockup: 'website',
    tone: 'warm',
    image: '',
    link: '',
    ar: {
      category: 'مواقع الأعمال',
      title: 'موقع تعريفي وخدمي متكامل',
      desc: 'تصميم موقع إلكتروني احترافي لعرض خدمات ونشاط الشركة مع صفحات مخصصة للخدمات، ونموذج تواصل سريع، وتوافق تام مع محركات البحث.',
      tags: ['موقع أعمال', 'Landing Page', 'SEO Friendly']
    },
    en: {
      category: 'Business websites',
      title: 'Complete company & services website',
      desc: "A professional website presenting the company's services and activity, with dedicated service pages, a quick contact form, and full search-engine friendliness.",
      tags: ['Business site', 'Landing Page', 'SEO Friendly']
    }
  },
  {
    id: 'sales-system',
    status: 'wip',
    device: 'browser',
    mockup: 'dashboard',
    tone: 'deep',
    image: '',
    link: '',
    ar: {
      category: 'أنظمة الأعمال المخصصة',
      title: 'نظام متابعة الطلبات والمبيعات',
      desc: 'نظام عملي مبسط لإدارة العمليات اليومية للنشاط التجاري، تسجيل حركة المبيعات، ومتابعة فواتير العملاء بدقة وسهولة.',
      tags: ['إدارة مبيعات', 'حلول مخصصة', 'لوحة تحكم']
    },
    en: {
      category: 'Custom business systems',
      title: 'Orders & sales tracking system',
      desc: "A simple, practical system to manage a business's daily operations, record sales activity and track customer invoices accurately and easily.",
      tags: ['Sales management', 'Custom solutions', 'Dashboard']
    }
  }
];
