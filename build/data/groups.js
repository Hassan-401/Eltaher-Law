/* تجميع مجالات العمل وترتيب عرضها.
   هذا الملف هو المرجع الوحيد لترتيب المجالات في:
   القائمة المنسدلة، وصفحة مجالات العمل، والصفحة الرئيسية، والفوتر.

   لإضافة مجال جديد: أضف محتواه في services.js ثم ضع الـslug هنا
   في المجموعة المناسبة — وإلا سيتوقف البناء وينبّهك. */

module.exports = [
  {
    key: 'afrad',
    title: 'قضايا الأفراد والمعاملات المدنية',
    sub: 'كل ما يمس حقوق الفرد وأسرته وأمواله الخاصة',
    icon: 'scales',
    slugs: ['madani', 'taawidat', 'osra', 'mawareeth']
  },
  {
    key: 'sharikat',
    title: 'الشركات والاستثمار العقاري والتجاري',
    sub: 'خدمات أصحاب الأعمال والمنشآت والمستثمرين',
    icon: 'briefcase',
    slugs: ['aqari', 'sharikat', 'omali', 'mokawalat', 'melkeya']
  },
  {
    key: 'gnaey',
    title: 'الجنايات والقضاء الإداري والمالي',
    sub: 'الدفاع الجنائي والمنازعات مع الجهات والبنوك',
    icon: 'shield',
    slugs: ['ganayat', 'gonah', 'cyber', 'edari', 'daraeb', 'bank', 'gomrok']
  },
  {
    key: 'fad',
    title: 'فض النزاعات وإنفاذ الأحكام',
    sub: 'من الاستشارة الوقائية حتى تنفيذ الحكم',
    icon: 'chat',
    slugs: ['tanfiz', 'estisharat']
  }
];
