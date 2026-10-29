import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Languages,
  Globe2,
  Brain,
  Code2,
  Atom,
  Calculator,
  Search,
  Sparkles,
  Play,
  RotateCcw,
  Camera,
  Upload,
  Volume2,
  Check,
  Zap,
  HelpCircle,
  Copy,
  Flame,
  Activity,
  Layers,
  Compass,
  Cpu,
  Feather,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { apiRequest } from '../services/api';

interface SubjectInteractiveToolsProps {
  subject?: string;
  currentSubject?: string;
  studentGrade?: string;
  gradeToolsConfig?: Record<string, Record<string, boolean>>;
  role?: 'student' | 'teacher' | 'public';
}

// ==========================================
// 1. معجم الضاد (ARABIC LEXICON & GRAMMAR)
// ==========================================
const ARABIC_LEXICON_DB = [
  { word: 'كَتَبَ', root: 'ك-ت-ب', meaning: 'خطَّ الحروف وجَمَعَ المعاني في الكِتَاب.', gram: 'فعل ماضٍ مبني على الفتح الظاهر.', category: 'معجم وجذور', example: 'كَتَبَ الطالبُ الدَّرْسَ كتابةً بَليغَةً.', synonyms: ['سَطَّرَ', 'دَوَّنَ', 'رَسَمَ'], rhetoric: 'استعارة مكنية في "كتب التاريخ مجده"' },
  { word: 'عَلِمَ', root: 'ع-ل-م', meaning: 'أَدْرَكَ الشيءَ على حَقيقَتِهِ ليَقينٍ.', gram: 'فعل ماضٍ متعدٍّ ينصب مفعولين.', category: 'معجم وجذور', example: 'عَلِمْتُ الحَقَّ واضِحاً كالشَّمْسِ.', synonyms: ['أَدْرَكَ', 'فَهِمَ', 'إِيقان'], rhetoric: 'تشبيه بليغ في "العلم نور"' },
  { word: 'الاستعارة المكنية', root: 'ع-و-ر', meaning: 'تشبيه بليغ حُذِفَ منه المشبه به ورُمِزَ له بشيء من لوازمه.', gram: 'مصطلح بلاغي من علم البيان.', category: 'بلاغة وأدب', example: 'وَاشْتَعَلَ الرَّأْسُ شَيْباً (تشبيه الشيب بالنار وحذف النار).', rhetoric: 'سر جمالها: التجسيم أو التشخيص' },
  { word: 'المفعول المطلق', root: 'ع-ل-ق', meaning: 'مصدر منصوب يُذْكَرُ بعد فعلٍ من لفظه لتأكيده أو بيان نوعه أو عدده.', gram: 'اسم منصوب دائماً.', category: 'ثوابت إعرابية', example: 'انتَصَرَ الجَيْشُ انْتِصاراً عظيمَ القدرِ.', rhetoric: 'يفيد التوكيد وتقوية المعنى' },
  { word: 'بَلَاغَة', root: 'ب-ل-غ', meaning: 'مطابقة الكلام لمقتضى الحال مع فصاحته.', gram: 'مصدر ثلاثي منصوب أو مرفوع حسب موقعه.', category: 'بلاغة وأدب', example: 'البلاغةُ إيجازٌ من غير إخلال وخِطابٌ من غيرِ إسهاب.', synonyms: ['فَصَاحَة', 'بَيَان', 'بَرَاعَة'] },
  { word: 'لَغُوب', root: 'ل-غ-ب', meaning: 'التَّعَبُ والمَشَقَّةُ الشَّديدَةُ.', gram: 'اسم اسم ثلاثي مجرور بالكسرة.', category: 'غريب الألفاظ', example: 'لا يَمَسُّهُمْ فِيهَا نَصَبٌ وَلا يَمَسُّهُمْ فِيهَا لُغُوبٌ.', synonyms: ['إِعْيَاء', 'تَعَب'], rhetoric: 'مبالغة في نفي التعب' },
  { word: 'إِيَّاكَ', root: 'أ-ي-ي', meaning: 'ضمير نصب منفصل يخص التحذير أو الاختصاص.', gram: 'ضمير منفصل مبني في محل نصب مفعول به.', category: 'ثوابت إعرابية', example: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.', rhetoric: 'أسلوب قصر بالتقديم والتأخير يفيد التخصيص والتوكيد' },
  { word: 'الكِتَاب', root: 'ك-ت-ب', meaning: 'مجموعة من الصحف المجلدة تحوي علماً أو أدباً.', gram: 'مبتدأ أو مفعول به حسب الجملة.', category: 'معجم وجذور', example: 'الكِتَابُ خَيْرُ جَلِيسٍ فِي الزَّمَانِ.', synonyms: ['سِفْر', 'مُصْحَف', 'مَجَلَّة'] }
];

function ArabicLexiconModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedWord, setSelectedWord] = useState<typeof ARABIC_LEXICON_DB[0] | null>(ARABIC_LEXICON_DB[0]);

  const categories = ['الكل', 'معجم وجذور', 'ثوابت إعرابية', 'بلاغة وأدب', 'غريب الألفاظ'];

  const filteredWords = ARABIC_LEXICON_DB.filter((item) => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      item.word.includes(searchTerm) ||
      item.root.includes(searchTerm) ||
      item.meaning.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-amber-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-black font-black text-2xl shadow-lg">
              ض
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>معجم الضاد الرقمي وثوابت لغة القرآن</span>
                <span className="badge-pill bg-amber-950/80 text-amber-300 border-amber-500/40 text-[10px]">
                  خاص باللغة العربية ✨
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                ابحث بالجذر اللغوي، الكلمات المعجمية، الثوابت النحوية، وسر الجمال البلاغي بسهولة.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute top-3 right-3 text-amber-400" />
            <input
              type="text"
              placeholder="ابحث بالكلمة أو الجذر اللغوي (مثال: كتب، علم، استعارة، مفعول)..."
              className="input-field pr-9 text-xs font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-md font-black'
                    : 'bg-[#091322] text-slate-300 hover:text-white border border-amber-500/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Words Grid & Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Words List */}
        <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredWords.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-[#091322] rounded-2xl border border-blue-500/20">
              لم نجد نتائج مطابقة لـ "{searchTerm}". جرب البحث بجذر آخر!
            </div>
          ) : (
            filteredWords.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedWord(item)}
                className={`w-full text-right p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedWord?.word === item.word
                    ? 'bg-gradient-to-r from-amber-600/30 to-yellow-600/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/40'
                    : 'bg-[#0b162a] border-blue-500/15 text-slate-300 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div>
                  <h4 className="font-extrabold text-sm text-amber-300">{item.word}</h4>
                  <span className="text-[10px] text-slate-400">الجذر: ({item.root}) • {item.category}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400/60 rotate-180" />
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedWord ? (
            <div className="p-6 rounded-2xl bg-[#0b162a] border border-amber-500/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <div>
                  <span className="badge-pill bg-amber-950/80 text-amber-300 border-amber-500/40 text-xs font-mono">
                    الجذر: {selectedWord.root}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedWord.word}</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-300 text-xs font-bold">
                  {selectedWord.category}
                </span>
              </div>

              {/* Meaning & Grammar */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>المعنى المعجمي والشرح:</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedWord.meaning}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Feather className="w-3.5 h-3.5" />
                    <span>الإعراب والموقع النحوي:</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedWord.gram}</p>
                </div>
              </div>

              {/* Example */}
              <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-1">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>موقع الكلمة في الشواهد والأمثلة:</span>
                </span>
                <p className="text-xs font-bold text-white leading-relaxed italic bg-black/40 p-2.5 rounded-lg border border-emerald-500/20">
                  "{selectedWord.example}"
                </p>
              </div>

              {/* Rhetoric & Synonyms */}
              {selectedWord.rhetoric && (
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>اللمحة البلاغية:</strong> {selectedWord.rhetoric}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-[#0b162a] rounded-2xl border border-blue-500/20">
              اختر كلمة من القائمة لعرض التحليل الإعرابي والمعجمي كاملاً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. DEDICATED LANGUAGE TRANSLATORS (ENGLISH, FRENCH, GERMAN)
// ==========================================

// Built-in Instant Dictionary Fallbacks
const DICTIONARY_DB: Record<string, Record<string, string>> = {
  fr: {
    'bonjour': 'مرحباً / صباح الخير (Bonjour)',
    'bonsoir': 'مساء الخير (Bonsoir)',
    'merci': 'شكراً جزيلاً (Merci)',
    'merci beaucoup': 'شكراً جزيلاً لك (Merci beaucoup)',
    'comment allez-vous': 'كيف حالك؟ (Comment allez-vous?)',
    'salut': 'أهلاً وسهلاً (Salut)',
    'au revoir': 'إلى اللقاء / مع السلامة (Au revoir)',
    'oui': 'نعم (Oui)',
    'non': 'لا (Non)',
    's\'il vous plaît': 'من فضلك / لو سمحت (S\'il vous plaît)',
    'pardon': 'عفواً / معذرة (Pardon)',
    'étudiant': 'طالب / تلميذ (Étudiant)',
    'professeur': 'معلم / أستاذ (Professeur)',
    'école': 'مدرسة (École)',
    'livre': 'كتاب (Livre)',
    'examen': 'امتحان / اختبار (Examen)',
    'مرحبا': 'Bonjour',
    'شكرا': 'Merci',
    'كيف حالك': 'Comment allez-vous?',
    'طالب': 'Étudiant',
    'مدرسة': 'École',
    'كتاب': 'Livre',
    'امتحان': 'Examen',
  },
  en: {
    'hello': 'مرحباً / أهلاً بك (Hello)',
    'good morning': 'صباح الخير (Good morning)',
    'thank you': 'شكراً جزيلاً (Thank you)',
    'how are you': 'كيف حالك؟ (How are you?)',
    'goodbye': 'مع السلامة / إلى اللقاء (Goodbye)',
    'student': 'طالب (Student)',
    'teacher': 'معلم / أستاذ (Teacher)',
    'school': 'مدرسة (School)',
    'book': 'كتاب (Book)',
    'exam': 'امتحان (Exam)',
    'مرحبا': 'Hello',
    'شكرا': 'Thank you',
    'كيف حالك': 'How are you?',
    'طالب': 'Student',
    'مدرسة': 'School',
    'كتاب': 'Book',
  },
  de: {
    'hallo': 'مرحباً (Hallo)',
    'guten tag': 'نهار سعيد / مرحباً (Guten Tag)',
    'danke': 'شكراً (Danke)',
    'auf wiedersehen': 'إلى اللقاء (Auf Wiedersehen)',
    'wie geht es ihnen': 'كيف حالك؟ (Wie geht es Ihnen?)',
    'schüler': 'طالب (Schüler)',
    'lehrer': 'معلم (Lehrer)',
    'schule': 'مدرسة (Schule)',
    'buch': 'كتاب (Buch)',
    'مرحبا': 'Hallo',
    'شكرا': 'Danke',
    'طالب': 'Schüler',
    'مدرسة': 'Schule',
  }
};

function DedicatedLanguageTranslatorModule({ langName, langCode, flag, speakCode }: {
  langName: string;
  langCode: 'fr' | 'en' | 'de';
  flag: string;
  speakCode: string;
}) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [direction, setDirection] = useState<'foreignToAr' | 'arToForeign'>('foreignToAr');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTranslatedText('');
    setSourceText('');
    setImagePreview(null);
  }, [direction]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranslate = async (textToTranslate?: string, imgData?: string) => {
    const q = (textToTranslate !== undefined ? textToTranslate : sourceText).trim();
    if (!q && !imgData) return;

    setLoading(true);
    setTranslatedText(''); // Clear previous result
    let result = '';
    let isAiFallback = false;

    try {
      const dirText = direction === 'foreignToAr'
        ? `قم بترجمة النص التالي أو الصورة المرفقة من اللغة (${langName}) إلى اللغة العربية ترجمة دقيقة وفصيحة مع التشكيل وتوضيح معاني الألفاظ والقواعد.`
        : `قم بترجمة النص التالي من اللغة العربية إلى اللغة (${langName}) مع توضيح طريقة النطق والقواعد النحوية.`;

      const res = await apiRequest('public', '/api/student/ai-chat', {
        question: `${dirText}\nالنص المطلوب ترجمته: ${q}`,
        imageBase64: imgData || undefined,
        history: []
      });

      if (res && (res.reply || res.answer)) {
        result = res.reply || res.answer;
        if (result.includes('أستطيع مساعدتك في شرح دروس المنصة') || result.includes('التركيب النحوي والإعراب')) {
          isAiFallback = true;
        }
      }
    } catch (err) {
      console.warn('Online translation request failed, using local dictionary:', err);
      isAiFallback = true;
    }

    // Use Dictionary/Rule-Based Fallback if online API returned default AI response or failed
    if (!result || isAiFallback || result.includes('حدث خطأ')) {
      const cleanKey = q.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
      const dict = DICTIONARY_DB[langCode] || {};
      const dictMatch = dict[cleanKey];

      if (dictMatch) {
        result = `✨ ترجمة معجمية مباشرة:\n${dictMatch}\n\n💡 ملاحظة: تمت الترجمة باستخدام المعجم المدمج للمادة.`;
      } else if (q) {
        if (direction === 'foreignToAr') {
          result = `✨ ترجمة (${langName} ⬅️ العربية):\n"${q}"\n\n📖 توضيح: لم نتمكن من الوصول للترجمة الذكية الآن، يرجى التأكد من اتصال الإنترنت للحصول على شرح مفصل.`;
        } else {
          result = `✨ ترجمة (العربية ⬅️ ${langName}):\n"${q}"\n\n📖 توضيح: لم نتمكن من الوصول للترجمة الذكية الآن، يرجى التأكد من اتصال الإنترنت للحصول على شرح مفصل.`;
        }
      } else if (imgData) {
        result = `📷 تم استلام الصورة بنجاح! \n\nيرجى التأكد من اتصال الإنترنت ليقوم الذكاء الاصطناعي باستخراج النص وترجمته بدقة عالية.`;
      }
    }

    setTranslatedText(result);
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      handleTranslate('', result);
    };
    reader.readAsDataURL(file);
  };

  const speakText = (text: string, targetSpeakCode: string) => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم النطق الصوتي المباشر');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#~]/g, ''));
      utterance.lang = targetSpeakCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const foreignLabel = `اللغة ${langName}`;

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">
              {flag}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex flex-wrap items-center gap-2">
                <span>مترجم {foreignLabel} والترجمة بالصور</span>
                <span className="badge-pill bg-cyan-950/80 text-cyan-300 border-cyan-500/40 text-[10px]">
                  {foreignLabel} ↔️ العربية
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                ترجمة فورية ونطق صوتي واستخراج النصوص من صور المذكرات والكتب بـ ({foreignLabel}).
              </p>
            </div>
          </div>

          {/* Direction Switch Toggle */}
          <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#081220] p-1 rounded-xl border border-cyan-500/20 shrink-0">
            <button
              type="button"
              onClick={() => setDirection('foreignToAr')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                direction === 'foreignToAr'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {langName} ⬅️ العربية
            </button>
            <button
              type="button"
              onClick={() => setDirection('arToForeign')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                direction === 'arToForeign'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              العربية ⬅️ {langName}
            </button>
          </div>
        </div>
      </div>

      {/* Input & Output Boxes Responsive Grid (Full Mobile Support) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Source Text Area Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0b162a] border border-cyan-500/20 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-cyan-300">
              {direction === 'foreignToAr' ? `النص بـ (${langName})` : 'النص باللغة العربية'}
            </span>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-cyan btn-sm text-[11px] font-bold flex items-center gap-1.5 cursor-pointer py-1.5 px-3"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>رفع صورة ورقة / كتاب</span>
              </button>
            </div>
          </div>

          {imagePreview && (
            <div className="relative inline-block border border-cyan-400/40 rounded-xl overflow-hidden max-h-36">
              <img src={imagePreview} alt="معاينة الصورة" className="h-28 sm:h-32 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <textarea
            rows={5}
            placeholder={
              direction === 'foreignToAr'
                ? `اكتب جملة أو كلمة باللغة ${langName} لترجمتها باللغة العربية...`
                : `اكتب النص العربي للترجمة إلى اللغة ${langName}...`
            }
            className="input-field text-xs sm:text-sm leading-relaxed"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => speakText(sourceText, direction === 'foreignToAr' ? speakCode : 'ar-EG')}
              disabled={!sourceText.trim()}
              className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg cursor-pointer disabled:opacity-30 flex items-center gap-1 text-xs"
              title="استمع للنطق الصوتي"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">نطق</span>
            </button>

            <button
              type="button"
              onClick={() => handleTranslate()}
              disabled={loading || (!sourceText.trim() && !imagePreview)}
              className="btn-gold py-2 px-5 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Languages className="w-4 h-4" />
              <span>{loading ? 'جاري الترجمة...' : 'ترجم الآن'}</span>
            </button>
          </div>
        </div>

        {/* Translation Output Result Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#081220] border border-cyan-500/30 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الترجمة والشرح الفوري:</span>
              </span>
              {translatedText && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(translatedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              )}
            </div>

            <div className="min-h-[120px] p-3.5 rounded-xl bg-[#050b14] border border-cyan-500/15 text-xs sm:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
              {loading ? (
                <div className="flex items-center justify-center h-28 gap-2 text-cyan-300 animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>جاري تحليل وترجمة النص بالذكاء الاصطناعي...</span>
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <span className="text-slate-500 italic">ستظهر نتيجة الترجمة والنطق بالشكل الفصيح هنا...</span>
              )}
            </div>
          </div>

          {translatedText && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => speakText(translatedText, direction === 'foreignToAr' ? 'ar-EG' : speakCode)}
                className="btn-cyan btn-sm text-[11px] font-bold flex items-center gap-1.5 cursor-pointer py-1.5 px-3"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استماع للترجمة الصوتي</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper for selecting English, French, or German Translator based on subject or explicit choice
function MultilingualTranslatorModule({ defaultLang = 'فرنسي' }: { defaultLang?: string }) {
  const [selectedLang, setSelectedLang] = useState<'fr' | 'en' | 'de'>(() => {
    if (defaultLang.includes('فرنس')) return 'fr';
    if (defaultLang.includes('ألمان')) return 'de';
    return 'en';
  });

  return (
    <div className="space-y-4">
      {/* Subject Language Chooser Buttons if teacher teaches foreign languages */}
      <div className="flex items-center justify-center gap-2 bg-[#091322] p-2 rounded-2xl border border-blue-500/20 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setSelectedLang('fr')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedLang === 'fr'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🇫🇷</span>
          <span>المترجم الفرنساوي</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedLang('en')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedLang === 'en'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🇬🇧</span>
          <span>المترجم الإنجليزي</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedLang('de')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedLang === 'de'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🇩🇪</span>
          <span>المترجم الألماني</span>
        </button>
      </div>

      {selectedLang === 'fr' && (
        <DedicatedLanguageTranslatorModule
          langName="الفرنسية"
          langCode="fr"
          flag="🇫🇷"
          speakCode="fr-FR"
        />
      )}

      {selectedLang === 'en' && (
        <DedicatedLanguageTranslatorModule
          langName="الإنكليزية"
          langCode="en"
          flag="🇬🇧"
          speakCode="en-US"
        />
      )}

      {selectedLang === 'de' && (
        <DedicatedLanguageTranslatorModule
          langName="الألمانية"
          langCode="de"
          flag="🇩🇪"
          speakCode="de-DE"
        />
      )}
    </div>
  );
}

// ==========================================
// 3. جغرافيا وتاريخ (3D WORLD MAP & KINGS MUSEUM)
// ==========================================
const KINGS_MUSEUM_DB = [
  { name: 'الملك رمسيس الثاني', title: 'صاحب أول معاهدة سلام في التاريخ وقائد معركة قادش', period: 'الدولة الحديثة - الأسرة 19', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80', desc: 'أحد أعظم ملوك مصر القديمة، شيد معبد أبو سمبل، وخاض معركة قادش الشهيرة ضد الحيثيين ثم عقد أول معاهدة سلام في التاريخ.' },
  { name: 'الملك تحتمس الثالث', title: 'نابليون الشرق القديم ومؤسس أول إمبراطورية مصرية', period: 'الدولة الحديثة - الأسرة 18', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=400&q=80', desc: 'قائد عسكري عبقري انتصر في معركة مجدو، ولم يخسر معركة قط، وأسس أول وأوسع إمبراطورية في التاريخ الامتداد الإفريقي والآسيوي.' },
  { name: 'حجر رشيد والكتابة الهيروغليفية', title: 'مفتاح حل أسرار الحضارة المصرية القديمة', period: 'العصر البطلمي (199 ق.م)', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', desc: 'عثرت عليه الحملة الفرنسية عام 1799م، واستطاع العالم شامبليون فك رموزه ليفتح الباب لمعرفة قراءة التاريخ المصري القديم.' },
  { name: 'الملكة حتشبسوت', title: 'رائدة التجارة والعمارة الفرعونية المتميزة', period: 'الدولة الحديثة - الأسرة 18', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=400&q=80', desc: 'شهد عصرها زهاءً اقتصادياً وتجارياً، وأرسلت البعثات التجارية الشهيرة لبلاد بونت، وبنت معبد الدير البحري بالأقصر.' }
];

function GeoHistoryModule() {
  const [selectedArtifact, setSelectedArtifact] = useState<typeof KINGS_MUSEUM_DB[0]>(KINGS_MUSEUM_DB[0]);
  const [activeTab, setActiveTab] = useState<'museum' | 'globe'>('museum');

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-black font-black shadow-lg">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>المتحف الرقمي التفاعلي وخريطة العالم التاريخية</span>
                <span className="badge-pill bg-amber-950/80 text-amber-300 border-amber-500/40 text-[10px]">
                  خاص بالتاريخ والجغرافيا 🏛️🌍
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                استعراض الملوك والآثار المصرية والخرائط الجغرافية في تجربة تفاعلية شيقة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#081220] p-1.5 rounded-xl border border-amber-500/20">
            <button
              onClick={() => setActiveTab('museum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'museum' ? 'bg-amber-500 text-black font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ متحف الملوك والآثار
            </button>
            <button
              onClick={() => setActiveTab('globe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'globe' ? 'bg-amber-500 text-black font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌍 خريطة التضاريس والحضارات
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'museum' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Artifact Cards */}
          <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {KINGS_MUSEUM_DB.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedArtifact(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedArtifact.name === item.name
                    ? 'bg-amber-950/40 border-amber-400 text-white ring-1 ring-amber-400/50 shadow-lg'
                    : 'bg-[#0b162a] border-blue-500/15 text-slate-300 hover:border-amber-500/30'
                }`}
              >
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-amber-500/30" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs text-amber-300 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.title}</p>
                  <span className="text-[9px] font-mono text-cyan-300">{item.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3D Showcase Panel */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0b162a] border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-amber-500/30 group">
              <img src={selectedArtifact.image} alt={selectedArtifact.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] w-fit mb-1">
                  {selectedArtifact.period}
                </span>
                <h3 className="text-xl font-black text-white">{selectedArtifact.name}</h3>
                <p className="text-xs text-amber-200 font-medium">{selectedArtifact.title}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>التوثيق التاريخي والأهمية المنهجية:</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedArtifact.desc}</p>
            </div>
          </div>
        </div>
      ) : (
        /* World & Topography Map Simulator */
        <div className="p-6 rounded-2xl bg-[#0b162a] border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>خريطة القارات والموقع الجغرافي وحوض النيل</span>
            </h4>
            <span className="text-xs text-cyan-300 font-mono">تفاعلي 3D</span>
          </div>

          <div className="relative h-80 rounded-2xl bg-[#040a14] border border-cyan-500/30 flex items-center justify-center overflow-hidden">
            {/* World Map SVG Canvas Placeholder with animated coordinates */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 400" fill="none">
              <circle cx="400" cy="200" r="180" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" className="animate-spin [animation-duration:30s]" />
              <circle cx="400" cy="200" r="120" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" className="animate-spin [animation-duration:20s]" />
              <path d="M200 150 Q300 100 400 180 T600 220" stroke="#10b981" strokeWidth="3" fill="none" />
              <circle cx="400" cy="180" r="6" fill="#34d399" className="animate-ping" />
              <text x="370" y="160" fill="#34d399" fontSize="12" fontWeight="bold">مصر - نهر النيل</text>
            </svg>
            <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-xl border border-amber-500/30 text-[11px] text-slate-200 space-y-1">
              <p>📍 <strong>الموقع الفلكي لمصر:</strong> بين خطي عرض 22° و 31°36' شمالاً.</p>
              <p>🌊 <strong>المجاري المائية:</strong> نهر النيل، البحر الأحمر، البحر المتوسط.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. فلسفة ومنطق (SOCRATES PHILOSOPHER TALK)
// ==========================================
function SocratesModule() {
  const [dialogText, setDialogText] = useState('أهلاً بك يا صديقي الباحث عن الحقيقة! أنا سقراط، أبحث معك بالمنطق والعقل عن الإجابة الصائبة. ما المسألة الفلسفية أو المغالطة المنطقية التي تريد مناقشتها؟');
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSocratesAsk = async (prompt?: string) => {
    const q = prompt || userQuery;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await apiRequest('public', '/api/student/ai-chat', {
        question: `تحدث بشخصية الفيلسوف اليوناني سقراط بطريقته السقراطية التفاعلية الحكيمة. تناقش مع الطالب بالمنطق الفلسفي بأسلوب مشوق وتوضيح المغالطات المنطقية. السؤال: ${q}`,
        history: []
      });
      setDialogText(res.reply || res.answer || 'الحكمة تبدأ بتساؤل العقل!');
    } catch {
      setDialogText('العقل والمنطق يسعيان دائماً للحقيقة، أعد طرح سؤالك وسنتحاور سوياً!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#101b33] to-[#0c182c] border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
          
          {/* Animated Talking Socrates Character */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-purple-900 to-indigo-950 border-2 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center overflow-hidden">
              <div className="text-6xl animate-bounce [animation-duration:3s]">🏛️</div>
              <span className="text-[10px] font-black text-purple-300 mt-1">سقراط الحكيم</span>
              {loading && <span className="absolute bottom-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" />}
            </div>
            <span className="mt-2 px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold rounded-full">
              تحدث مع الفيلسوف 💬
            </span>
          </div>

          {/* Socrates Dialogue Box */}
          <div className="flex-1 space-y-4 w-full">
            <div className="p-4 rounded-2xl bg-[#081122] border border-purple-500/25 relative">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-purple-500/20 text-xs font-bold text-purple-300">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>حوار سقراط والمنطق الفلسفي:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium whitespace-pre-wrap min-h-[80px]">
                {loading ? 'سقراط يفكر ويتفلسف في مسألتك الآن...' : dialogText}
              </p>
            </div>

            {/* Quick Socratic Dilemmas */}
            <div className="flex flex-wrap gap-2">
              {[
                'ما الفرق بين الرأي والتفكير النقدي؟',
                'اشرح لي مغالطة (رجل القش) بالأمثلة.',
                'هل الأخلاق نسبية أم مطلقة؟',
                'كيف أميز بين الاستنباط والاستقراء؟'
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUserQuery(q);
                    handleSocratesAsk(q);
                  }}
                  className="px-3 py-1.5 bg-[#091324] hover:bg-[#122240] border border-purple-500/30 text-purple-200 text-xs rounded-xl font-bold transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اسأل سقراط في أي معضلة فلسفية أو أسلوب التفكير المنطقي..."
                className="input-field text-xs flex-1"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSocratesAsk()}
              />
              <button
                type="button"
                onClick={() => handleSocratesAsk()}
                disabled={loading || !userQuery.trim()}
                className="btn-purple py-2 px-5 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>حاور الفيلسوف</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. محرر الأكواد والبرمجة (LIVE CODE SANDBOX)
// ==========================================
function CodeSandboxModule() {
  const [language, setLanguage] = useState<'python' | 'js' | 'html'>('js');
  const [code, setCode] = useState<string>(
    '// اكتب كود جافاسكريبت هنا وتصفح النتيجة فوراً:\nconsole.log("أهلاً بك في منصة التعلم الذكي للبرمجة! 🚀");\n\nfunction calculateGrade(score) {\n  return score >= 90 ? "ممتاز مرتفع 🌟" : "جيد جداً 👍";\n}\n\nconsole.log("النتيجة:", calculateGrade(95));'
  );
  const [output, setOutput] = useState<string>('اضغط على "تشغيل الكود" لمعاينة النتيجة...');

  const handleRunCode = () => {
    if (language === 'js') {
      try {
        let logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args: any[]) => logs.push('❌ Error: ' + args.join(' ')),
          warn: (...args: any[]) => logs.push('⚠️ Warning: ' + args.join(' '))
        };
        const runFn = new Function('console', code);
        runFn(customConsole);
        setOutput(logs.join('\n') || 'تم تشغيل الكود بنجاح (بدون مخرجات console.log).');
      } catch (err: any) {
        setOutput(`❌ خطأ برمجي:\n${err.message}`);
      }
    } else if (language === 'html') {
      setOutput('✅ تم تحديث المعاينة الحية للـ HTML/CSS أدناه.');
    } else {
      setOutput(`🐍 بيئة بايثرن النمطية:\nSimulated Output:\n>>> ${code.split('\n').filter(l => l.includes('print')).join('\n') || 'Code executed successfully.'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-black font-black shadow-lg">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>محرر الأكواد والبرمجة التفاعلي (Code Sandbox)</span>
                <span className="badge-pill bg-emerald-950/80 text-emerald-300 border-emerald-500/40 text-[10px]">
                  خاص بالبرمجة والتكنولوجيا 💻
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                كتابة وتشغيل أكواد JavaScript و Python و HTML/CSS حياً مع معاينة النتيجة ومصحح الأخطاء.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#081220] p-1.5 rounded-xl border border-emerald-500/20">
            {(['js', 'python', 'html'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  if (lang === 'js') setCode('console.log("Hello JS World!");');
                  if (lang === 'python') setCode('print("أهلاً بكم في لغة بايثون!")\nscore = 98\nprint("Score:", score)');
                  if (lang === 'html') setCode('<h1 style="color:#0284c7">مرحباً بالبرمجة!</h1>\n<p style="color:#cbd5e1">تصميم صفحة ويب تفاعلية.</p>');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  language === lang ? 'bg-emerald-500 text-black shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Code & Preview Split Pane */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-emerald-300">
              <span>محرر الكود ({language.toUpperCase()}):</span>
              <button
                type="button"
                onClick={handleRunCode}
                className="btn-emerald btn-sm text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل الكود</span>
              </button>
            </div>
            <textarea
              rows={12}
              className="w-full bg-[#050b14] text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-xl border border-emerald-500/30 focus:outline-none focus:border-emerald-400 leading-relaxed shadow-inner"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* Execution Output */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-cyan-300 block">شاشة المخرجات والنتائج الحية (Console Output):</span>
            {language === 'html' ? (
              <div className="h-[280px] bg-white rounded-xl p-4 overflow-auto border border-emerald-500/30">
                <div dangerouslySetInnerHTML={{ __html: code }} />
              </div>
            ) : (
              <pre className="h-[280px] bg-[#040812] text-cyan-200 font-mono text-xs p-4 rounded-xl border border-cyan-500/30 overflow-auto whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. المختبر العلمي الافتراضي (VIRTUAL SCIENCE LAB)
// ==========================================
function VirtualScienceLabModule() {
  const [labType, setLabType] = useState<'chem' | 'physics' | 'bio'>('chem');

  // Chemistry state
  const [chemElem1, setChemElem1] = useState('Na');
  const [chemElem2, setChemElem2] = useState('Cl');
  const [reactionResult, setReactionResult] = useState('2Na + Cl₂ ➡️ 2NaCl (تفاعل تكوين ملح طعام هالوجيني مع انبعاث حراري)');

  // Physics state
  const [circuitClosed, setCircuitClosed] = useState(true);
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(4);

  const currentVal = circuitClosed ? (voltage / resistance).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Atom className="w-6 h-6 animate-spin [animation-duration:10s]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>المختبر العلمي الافتراضي ومحاكاة التجارب</span>
                <span className="badge-pill bg-cyan-950/80 text-cyan-300 border-cyan-500/40 text-[10px]">
                  علوم متكاملة • فيزياء • كيمياء • أحياء 🧪⚡
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                محاكاة التفاعلات الكيميائية، بناء الدوائر الكهربائية، واستكشاف تشريح جسم الإنسان والكائنات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#081220] p-1.5 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => setLabType('chem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                labType === 'chem' ? 'bg-cyan-500 text-black font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧪 معمل الكيمياء
            </button>
            <button
              onClick={() => setLabType('physics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                labType === 'physics' ? 'bg-cyan-500 text-black font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ معمل الفيزياء
            </button>
            <button
              onClick={() => setLabType('bio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                labType === 'bio' ? 'bg-cyan-500 text-black font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧬 الأحياء والجيولوجيا
            </button>
          </div>
        </div>
      </div>

      {labType === 'chem' && (
        /* Chemistry Reaction Simulator */
        <div className="p-6 rounded-2xl bg-[#0b162a] border border-cyan-500/30 shadow-2xl space-y-5">
          <h4 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
            <FlaskIcon className="w-4 h-4 text-cyan-400" />
            <span>محاكاة مزج العناصر والتفاعلات الكيميائية:</span>
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
              <label className="block text-xs font-bold text-slate-300">العنصر الأول:</label>
              <select className="input-field text-xs" value={chemElem1} onChange={(e) => setChemElem1(e.target.value)}>
                <option value="Na">الصوديوم (Na) - فلز نشط</option>
                <option value="HCl">حمض الهيدروكلوريك (HCl)</option>
                <option value="H2">غاز الهيدروجين (H₂)</option>
                <option value="Fe">الحديد (Fe)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
              <label className="block text-xs font-bold text-slate-300">العنصر / المركب الثاني:</label>
              <select className="input-field text-xs" value={chemElem2} onChange={(e) => setChemElem2(e.target.value)}>
                <option value="Cl">الكلور (Cl₂) - لافلز</option>
                <option value="NaOH">هيدروكسيد الصوديوم (NaOH) - قلوي</option>
                <option value="O2">الأكسجين (O₂)</option>
                <option value="CuSO4">كبريتات النحاس (CuSO₄)</option>
              </select>
            </div>
          </div>

          {/* Interactive Flask Visualizer */}
          <div className="p-6 rounded-2xl bg-[#050b14] border border-cyan-500/20 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="relative w-24 h-32 border-b-4 border-l-4 border-r-4 border-cyan-400 rounded-b-3xl overflow-hidden bg-cyan-950/20 flex items-end justify-center">
              <div
                className="w-full bg-gradient-to-t from-cyan-500 via-emerald-400 to-amber-300 transition-all duration-700 animate-pulse"
                style={{ height: '65%' }}
              />
              <span className="absolute top-4 text-xs font-black text-cyan-200">
                {chemElem1} + {chemElem2}
              </span>
            </div>

            <div className="p-3 bg-[#0a1426] rounded-xl border border-cyan-400/40 text-xs font-bold text-emerald-300 max-w-lg">
              {chemElem1 === 'Na' && chemElem2 === 'Cl' && '2Na + Cl₂ ➡️ 2NaCl (تفاعل تكوين ملح طعام هالوجيني بعنف)'}
              {chemElem1 === 'HCl' && chemElem2 === 'NaOH' && 'HCl + NaOH ➡️ NaCl + H₂O (تفاعل تعادل بين حمض وقاعدي يغني عن الدليل)'}
              {chemElem1 === 'H2' && chemElem2 === 'O2' && '2H₂ + O₂ ➡️ 2H₂O (تفاعل تكوين الماء مصحوب بفرقاعة حرارية)'}
              {chemElem1 === 'Fe' && chemElem2 === 'CuSO4' && 'Fe + CuSO₄ ➡️ FeSO₄ + Cu (إحلال بسيط للحديد محل النحاس وترسب أحمر)'}
            </div>
          </div>
        </div>
      )}

      {labType === 'physics' && (
        /* Physics Circuit Simulator */
        <div className="p-6 rounded-2xl bg-[#0b162a] border border-cyan-500/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>محاكاة الدوائر الكهربائية وقانون أوم (V = I × R):</span>
            </h4>
            <button
              type="button"
              onClick={() => setCircuitClosed(!circuitClosed)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black cursor-pointer border transition-all ${
                circuitClosed ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-red-600 text-white border-red-400'
              }`}
            >
              {circuitClosed ? '⚡ المفتاح مغلق (دائرة متصلة)' : '🔴 المفتاح مفتوح (دائرة مقطوعة)'}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
              <label className="block text-xs font-bold text-slate-300">جهد المصدر (V): {voltage} فولط</label>
              <input
                type="range"
                min="1"
                max="48"
                className="w-full accent-cyan-400 cursor-pointer"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
              />
            </div>

            <div className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
              <label className="block text-xs font-bold text-slate-300">المقاومة الكهربائية (R): {resistance} أوم</label>
              <input
                type="range"
                min="1"
                max="20"
                className="w-full accent-amber-400 cursor-pointer"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Circuit Visual Canvas */}
          <div className="p-6 rounded-2xl bg-[#050b14] border border-cyan-500/20 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-8 py-4">
              <div className="p-3 rounded-xl bg-blue-950 border border-blue-400 text-center">
                <span className="text-[10px] text-slate-400 block">شدة التيار (I)</span>
                <span className="text-xl font-black text-cyan-300 font-mono">{currentVal} أومبر</span>
              </div>

              {/* Lamp Bulb */}
              <div className={`w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center transition-all ${
                circuitClosed ? 'bg-amber-400 shadow-[0_0_35px_#f59e0b] text-black font-black' : 'bg-slate-900 text-slate-600'
              }`}>
                💡
              </div>
            </div>
          </div>
        </div>
      )}

      {labType === 'bio' && (
        /* Biology Human Anatomy & Geology */
        <div className="p-6 rounded-2xl bg-[#0b162a] border border-cyan-500/30 shadow-2xl space-y-4">
          <h4 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>محاكاة الأجهزة الحيوية والصخور الجيولوجية:</span>
          </h4>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'الجهاز الدوري والقلب', desc: 'ضخ الدم المؤكسج في الأوعية والشرايين عبر البطين الأيسر والصمامات.', icon: '❤️' },
              { title: 'الجهاز العصبي والدماغ', desc: 'نقل السيال العصبي عبر الخلايا العصبية بسرعة تصل لـ 120 م/ث.', icon: '🧠' },
              { title: 'دور الصخور والجيولوجيا', desc: 'الصخور النارية والمتحولة والرسوبية ودورة الصخور في القشرة الأرضية.', icon: '🌋' }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#070e1c] border border-blue-500/20 space-y-2">
                <span className="text-2xl">{item.icon}</span>
                <h5 className="font-bold text-white text-xs">{item.title}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FlaskIcon(props: any) {
  return <Atom {...props} />;
}

// ==========================================
// 7. الرياضيات (ADVANCED SCIENTIFIC CALCULATOR & GRAPHER)
// ==========================================
function ScientificCalculatorModule() {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [fnExpr, setFnExpr] = useState('x^2 - 4');

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      return;
    }
    if (val === '=') {
      try {
        const cleaned = calcDisplay
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/√/g, 'Math.sqrt');
        const res = Function(`"use strict"; return (${cleaned})`)();
        setCalcDisplay(String(Number(res).toFixed(4)).replace(/\.?0+$/, ''));
      } catch {
        setCalcDisplay('خطأ حسابي');
      }
      return;
    }

    if (calcDisplay === '0' || calcDisplay === 'خطأ حسابي') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(calcDisplay + val);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1d35] via-[#09152a] to-[#0c182c] border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>الآلة الحاسبة العلمية المتطورة والراسم البياني</span>
                <span className="badge-pill bg-cyan-950/80 text-cyan-300 border-cyan-500/40 text-[10px]">
                  خاص بالرياضيات 📐📊
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                حساب الدوال المثلثية واللوغاريتمات ورسم المنحنيات البيانية للدوال في ثوانٍ.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator & Grapher Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Scientific Calculator Pad */}
          <div className="p-5 rounded-2xl bg-[#0b162a] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="p-4 rounded-xl bg-[#040912] border border-cyan-500/30 text-left font-mono text-2xl font-black text-cyan-300 shadow-inner overflow-x-auto">
              {calcDisplay}
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {['sin', 'cos', 'tan', 'C', '√', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'π', '='].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleCalcClick(btn)}
                  className={`p-3 rounded-xl font-mono transition-all cursor-pointer shadow-sm ${
                    btn === '='
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black col-span-1'
                      : btn === 'C'
                      ? 'bg-red-600 text-white font-black'
                      : ['+', '-', '×', '÷'].includes(btn)
                      ? 'bg-amber-600/80 text-white'
                      : 'bg-[#091426] text-slate-200 hover:bg-[#122442]'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Grapher */}
          <div className="p-5 rounded-2xl bg-[#0b162a] border border-cyan-500/30 shadow-xl space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-cyan-300">راسم المنحنيات والدوال f(x):</label>
              <input
                type="text"
                placeholder="مثال: x^2 - 4"
                className="input-field text-xs font-mono"
                value={fnExpr}
                onChange={(e) => setFnExpr(e.target.value)}
              />
            </div>

            <div className="h-64 rounded-xl bg-[#040912] border border-cyan-500/20 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full" viewBox="-100 -100 200 200">
                {/* Grid Lines */}
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#0284c7" strokeWidth="1" />
                <line x1="0" y1="-100" x2="0" y2="100" stroke="#0284c7" strokeWidth="1" />
                {/* Plot Curve */}
                <path
                  d="M -80 64 Q -40 16 0 -10 T 80 64"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400">
                f(x) = {fnExpr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT WRAPPER
// ==========================================
export const SubjectInteractiveTools: React.FC<SubjectInteractiveToolsProps> = ({
  subject,
  currentSubject,
  studentGrade,
  gradeToolsConfig,
  role = 'student'
}) => {
  const initialSub = subject || currentSubject || 'اللغة العربية';
  const [activeSubject, setActiveSubject] = useState<string>(initialSub);

  useEffect(() => {
    const nextSub = subject || currentSubject;
    if (nextSub) setActiveSubject(nextSub);
  }, [subject, currentSubject]);

  const subjectList = [
    { title: 'اللغة العربية', key: 'arabicLexicon', icon: 'ض', color: 'from-amber-600 to-yellow-500' },
    { title: 'لغات أجنبية (فرنسي/إنجليزي/ألماني)', key: 'translator', icon: '🌐', color: 'from-cyan-600 to-blue-600' },
    { title: 'جغرافيا وتاريخ', key: 'geoHistoryMap', icon: '🏛️', color: 'from-amber-700 to-amber-500' },
    { title: 'فلسفة ومنطق', key: 'socratesPhilosophy', icon: '🏛️', color: 'from-purple-600 to-indigo-600' },
    { title: 'برمجة وتكنولوجيا', key: 'codeSandbox', icon: '💻', color: 'from-emerald-600 to-cyan-500' },
    { title: 'علوم متكاملة وفيزياء وكيمياء', key: 'scienceLab', icon: '🧪', color: 'from-cyan-500 to-blue-500' },
    { title: 'رياضيات', key: 'mathCalculator', icon: '📐', color: 'from-blue-600 to-indigo-600' }
  ];

  const normalizedSub = activeSubject.toLowerCase();

  const isArabic = normalizedSub.includes('عرب');
  const isLanguages = normalizedSub.includes('إنجلي') || normalizedSub.includes('فرنس') || normalizedSub.includes('ألمان') || normalizedSub.includes('لغات');
  const isGeoHistory = normalizedSub.includes('جغرافيا') || normalizedSub.includes('تاريخ');
  const isPhilosophy = normalizedSub.includes('فلسف') || normalizedSub.includes('منطق');
  const isCoding = normalizedSub.includes('برمج') || normalizedSub.includes('تكنولوجيا');
  const isScience = normalizedSub.includes('علوم') || normalizedSub.includes('فيزياء') || normalizedSub.includes('كيمياء') || normalizedSub.includes('أحياء') || normalizedSub.includes('جيولوجيا');
  const isMath = normalizedSub.includes('رياضيات') || normalizedSub.includes('حساب');

  // Strict filtering: Only display the tool relevant to the teacher's selected subject
  const relevantSubjectList = subjectList.filter((s) => {
    if (isArabic && s.key === 'arabicLexicon') return true;
    if (isLanguages && s.key === 'translator') return true;
    if (isGeoHistory && s.key === 'geoHistoryMap') return true;
    if (isPhilosophy && s.key === 'socratesPhilosophy') return true;
    if (isCoding && s.key === 'codeSandbox') return true;
    if (isScience && s.key === 'scienceLab') return true;
    if (isMath && s.key === 'mathCalculator') return true;
    if (!isArabic && !isLanguages && !isGeoHistory && !isPhilosophy && !isCoding && !isScience && !isMath && s.key === 'arabicLexicon') return true;
    return false;
  });

  // Check if current active module is disabled for studentGrade
  const currentKey = isArabic
    ? 'arabicLexicon'
    : isLanguages
    ? 'translator'
    : isGeoHistory
    ? 'geoHistoryMap'
    : isPhilosophy
    ? 'socratesPhilosophy'
    : isCoding
    ? 'codeSandbox'
    : isScience
    ? 'scienceLab'
    : isMath
    ? 'mathCalculator'
    : 'arabicLexicon';

  const isToolDisabledForGrade =
    !!studentGrade &&
    !!gradeToolsConfig &&
    gradeToolsConfig[studentGrade]?.[currentKey] === false;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Banner & Quick Tool Switcher */}
      <div className="panel bg-[#0d1728] border border-cyan-500/25 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>أدوات المنصة التفاعلية المخصصة للمادة الدراسية</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              أدوات تفاعلية ذكية مصممة خصيصاً لمساعدة الطالب في المادة المقررة.
            </p>
          </div>

          <span className="badge-pill bg-cyan-950/80 text-cyan-300 border-cyan-500/40 text-xs font-bold">
            التخصص الحالي: {activeSubject}
          </span>
        </div>

        {/* Quick subject tools toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-cyan-500/15">
          {relevantSubjectList.map((s) => {
            const isSelected =
              activeSubject === s.title ||
              (s.title.includes('عرب') && isArabic) ||
              (s.title.includes('لغات') && isLanguages) ||
              (s.title.includes('جغرافيا') && isGeoHistory) ||
              (s.title.includes('فلسف') && isPhilosophy) ||
              (s.title.includes('برمج') && isCoding) ||
              (s.title.includes('علوم') && isScience) ||
              (s.title.includes('رياضيات') && isMath);

            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActiveSubject(s.title)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg border border-cyan-300 ring-2 ring-cyan-400/30'
                    : 'bg-[#081220] text-slate-300 hover:text-white border border-blue-500/15'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render matching interactive module or disabled banner */}
      {isToolDisabledForGrade ? (
        <div className="panel bg-[#0d182a] border border-amber-500/30 p-8 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            🔒
          </div>
          <h3 className="text-lg font-black text-white">هذا القسم غير مفعّل لصفك الدراسي</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            قام المعلم بتخصيص إعدادات أدوات المادة وإيقاف قسم ({activeSubject}) لـ {studentGrade || 'هذا الصف'}. يمكنك التبديل بين بقية الأقسام التفاعلية المتاحة بالأعلى.
          </p>
        </div>
      ) : (
        <>
          {isArabic && <ArabicLexiconModule />}
          {isLanguages && <MultilingualTranslatorModule defaultLang={normalizedSub.includes('فرنس') ? 'فرنسية' : normalizedSub.includes('ألمان') ? 'ألمانية' : 'إنجليزية'} />}
          {isGeoHistory && <GeoHistoryModule />}
          {isPhilosophy && <SocratesModule />}
          {isCoding && <CodeSandboxModule />}
          {isScience && <VirtualScienceLabModule />}
          {isMath && <ScientificCalculatorModule />}

          {/* Fallback if no specific topic match */}
          {!isArabic && !isLanguages && !isGeoHistory && !isPhilosophy && !isCoding && !isScience && !isMath && (
            <ArabicLexiconModule />
          )}
        </>
      )}
    </div>
  );
};
