export const site = {
  name: 'Nexsus Gaming',
  tag: 'Nexsus',
  tagline: 'نافس. تقدّم. انتمِ.',
  blurb:
    'Nexsus Gaming هو الذراع التنافسي لمجتمع Nexsus على ديسكورد. ننظّم بطولات مفتوحة، وليالي تدريب (سكريم)، وكؤوساً موسمية — وكل شيء يُدار داخل السيرفر.',
  discordInvite: 'https://discord.gg/thenexus',
  discord: {
    members: 12480,
    online: 1937,
    boosts: 14,
  },
  socials: [
    { label: 'ديسكورد', href: 'https://discord.gg/thenexus' },
    { label: 'X', href: 'https://x.com/nexsusgg' },
    { label: 'يوتيوب', href: 'https://youtube.com/@nexsusgg' },
    { label: 'تيك توك', href: 'https://tiktok.com/@nexsusgg' },
  ],
  channels: [
    { name: 'announcements', purpose: 'إعلان الجداول، تغييرات المواعيد، والكشف عن الجوائز.' },
    { name: 'find-a-team', purpose: 'اللاعبون الأحرار والقادة يتواصلون قبل إغلاق التسجيل.' },
    { name: 'scrim-nights', purpose: 'لوبيات تدريب ليلية يستضيفها الطاقم.' },
    { name: 'match-results', purpose: 'صوّر نتيجتك، والطاقم يتحقق منها.' },
    { name: 'support-tickets', purpose: 'النزاعات، والغياب عن المباريات، وتغييرات التشكيلة.' },
  ],
  roles: [
    { name: 'المؤسس', color: 'crimson' as const, desc: 'يدير Nexsus ويعتمد كل لائحة قوانين.' },
    { name: 'مشرف البطولات', color: 'purple' as const, desc: 'يوزّع الفرق في الجدول، ويتحقق من النتائج، ويعالج النزاعات.' },
    { name: 'مشرف', color: 'purple' as const, desc: 'يحافظ على نظافة السيرفر وانطلاق اللوبيات في وقتها.' },
    { name: 'معلّق', color: 'white' as const, desc: 'يبثّ النهائيات ويقدّم تحليل ما بعد المباراة.' },
    { name: 'متنافس', color: 'purple' as const, desc: 'أي لاعب مسجّل في فريق ضمن كأس نشط.' },
  ],
}

export type SiteConfig = typeof site
