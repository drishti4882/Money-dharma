/* ============================================
   MoneyDharma — Complete Script
   Voice Narration + Hindi/English Translation
   ============================================ */

// ===== GLOBAL STATE =====
var completedLessons = 0;
var selectedGoal = "";
var audioEnabled = false;
var largeText = false;
var goalsStarted = 0;
var skillsLearned = 0;
var currentLang = "en";
var isSpeaking = false;
var speechSynth = window.speechSynthesis;

// ============================================
// TRANSLATIONS
// ============================================
var translations = {

  // ----- NAVBAR -----
  "nav_home": {
    en: "🏠 Home",
    hi: "🏠 होम"
  },
  "nav_learn": {
    en: "📚 Learn",
    hi: "📚 सीखें"
  },
  "nav_tools": {
    en: "🛠️ Tools",
    hi: "🛠️ उपकरण"
  },
  "nav_schemes": {
    en: "🏛️ Schemes",
    hi: "🏛️ सरकारी योजनाएं"
  },
  "nav_progress": {
    en: "📊 My Progress",
    hi: "📊 मेरी प्रगति"
  },
  "btn_login": {
    en: "Login",
    hi: "लॉगिन"
  },
  "btn_get_started": {
    en: "Get Started",
    hi: "शुरू करें"
  },

  // ----- HERO -----
  "hero_title": {
    en: 'Your Journey to <span>Financial Freedom</span> Starts Here',
    hi: 'आपकी <span>आर्थिक आज़ादी</span> की यात्रा यहाँ से शुरू होती है'
  },
  "hero_desc": {
    en: "MoneyDharma helps you understand money, build savings, and create a secure future — no matter where you start. Simple lessons, practical tools, and guidance designed for real life.",
    hi: "मनीधर्मा आपको पैसे समझने, बचत करने और सुरक्षित भविष्य बनाने में मदद करता है — चाहे आप कहीं से भी शुरू करें। सरल पाठ, व्यावहारिक उपकरण और असली ज़िंदगी के लिए मार्गदर्शन।"
  },
  "btn_start_free": {
    en: "🚀 Start Learning Free",
    hi: "🚀 मुफ़्त सीखना शुरू करें"
  },
  "btn_explore": {
    en: "📖 Explore Lessons",
    hi: "📖 पाठ देखें"
  },

  // ----- STATS -----
  "stat_learners": {
    en: "Learners Empowered",
    hi: "सशक्त शिक्षार्थी"
  },
  "stat_lessons": {
    en: "Bite-sized Lessons",
    hi: "छोटे-छोटे पाठ"
  },
  "stat_languages": {
    en: "Indian Languages",
    hi: "भारतीय भाषाएं"
  },
  "stat_free": {
    en: "Free Forever",
    hi: "हमेशा मुफ़्त"
  },

  // ----- FEATURES -----
  "features_badge": {
    en: "✨ Why MoneyDharma?",
    hi: "✨ मनीधर्मा क्यों?"
  },
  "features_title": {
    en: "Built for Real People, Real Lives",
    hi: "असली लोगों के लिए, असली ज़िंदगी के लिए"
  },
  "features_desc": {
    en: "We understand that financial education should be simple, practical, and respectful of your experience.",
    hi: "हम समझते हैं कि वित्तीय शिक्षा सरल, व्यावहारिक और आपके अनुभव का सम्मान करने वाली होनी चाहिए।"
  },
  "feat_simple_title": {
    en: "Simple Lessons",
    hi: "सरल पाठ"
  },
  "feat_simple_desc": {
    en: "No confusing jargon. Learn through stories, videos, and audio in your own language.",
    hi: "कोई भ्रामक शब्दावली नहीं। अपनी भाषा में कहानियों, वीडियो और ऑडियो से सीखें।"
  },
  "feat_tools_title": {
    en: "Practical Tools",
    hi: "व्यावहारिक उपकरण"
  },
  "feat_tools_desc": {
    en: "Budget planners and savings trackers designed for irregular incomes and daily needs.",
    hi: "अनियमित आय और दैनिक ज़रूरतों के लिए बजट प्लानर और बचत ट्रैकर।"
  },
  "feat_schemes_title": {
    en: "Government Schemes",
    hi: "सरकारी योजनाएं"
  },
  "feat_schemes_desc": {
    en: "Learn about Jan Dhan, Mudra, and other schemes that can help you and your family.",
    hi: "जन धन, मुद्रा और अन्य योजनाओं के बारे में जानें जो आपके और आपके परिवार की मदद कर सकती हैं।"
  },
  "feat_digital_title": {
    en: "Digital Banking Guide",
    hi: "डिजिटल बैंकिंग गाइड"
  },
  "feat_digital_desc": {
    en: "Step-by-step guidance on using UPI, ATMs, and mobile banking safely and confidently.",
    hi: "UPI, ATM और मोबाइल बैंकिंग को सुरक्षित रूप से उपयोग करने की चरण-दर-चरण मार्गदर्शिका।"
  },
  "feat_community_title": {
    en: "Community Focused",
    hi: "समुदाय केंद्रित"
  },
  "feat_community_desc": {
    en: "Designed with SHG members, daily wage workers, and youth from all backgrounds in mind.",
    hi: "SHG सदस्यों, दैनिक मज़दूरों और सभी पृष्ठभूमि के युवाओं को ध्यान में रखकर बनाया गया।"
  },
  "feat_offline_title": {
    en: "Works Offline",
    hi: "ऑफ़लाइन काम करता है"
  },
  "feat_offline_desc": {
    en: "Download lessons to learn anytime, anywhere — even without internet connection.",
    hi: "पाठ डाउनलोड करें और कभी भी, कहीं भी सीखें — इंटरनेट के बिना भी।"
  },

  // ----- CTA -----
  "cta_badge": {
    en: "🌟 Ready to Begin?",
    hi: "🌟 शुरू करने के लिए तैयार?"
  },
  "cta_title": {
    en: "Small financial steps today create strong futures tomorrow.",
    hi: "आज के छोटे आर्थिक कदम कल का मज़बूत भविष्य बनाते हैं।"
  },
  "cta_desc": {
    en: "Join thousands of learners who are building confidence with money. It's free, it's simple, and it's made for you.",
    hi: "हज़ारों शिक्षार्थियों से जुड़ें जो पैसे के साथ आत्मविश्वास बना रहे हैं। यह मुफ़्त है, सरल है और आपके लिए बना है।"
  },
  "cta_btn": {
    en: "🌱 Start My Learning Journey",
    hi: "🌱 मेरी सीखने की यात्रा शुरू करें"
  },

  // ----- ONBOARDING -----
  "onboard_title": {
    en: "Welcome to MoneyDharma",
    hi: "मनीधर्मा में आपका स्वागत है"
  },
  "onboard_desc": {
    en: "Let us personalise your learning journey. Tell us about yourself so we can guide you better.",
    hi: "हमें अपनी सीखने की यात्रा को व्यक्तिगत बनाने दें। अपने बारे में बताएं ताकि हम आपका बेहतर मार्गदर्शन कर सकें।"
  },
  "profile_worker_title": {
    en: "Daily Wage Worker",
    hi: "दैनिक मज़दूर"
  },
  "profile_worker_desc": {
    en: "Manage expenses and avoid debt with practical tips for irregular income.",
    hi: "अनियमित आय के लिए व्यावहारिक सुझावों से खर्चे प्रबंधित करें और कर्ज़ से बचें।"
  },
  "profile_women_title": {
    en: "Rural Women / SHG Member",
    hi: "ग्रामीण महिला / SHG सदस्य"
  },
  "profile_women_desc": {
    en: "Build confidence in handling finances, savings groups, and banking.",
    hi: "वित्त, बचत समूहों और बैंकिंग को संभालने में आत्मविश्वास बनाएं।"
  },
  "profile_bank_title": {
    en: "New Bank User",
    hi: "नया बैंक उपयोगकर्ता"
  },
  "profile_bank_desc": {
    en: "Learn UPI, ATM, and digital banking safely with step-by-step guidance.",
    hi: "चरण-दर-चरण मार्गदर्शन के साथ UPI, ATM और डिजिटल बैंकिंग सुरक्षित रूप से सीखें।"
  },
  "profile_youth_title": {
    en: "Youth from Low-Income Family",
    hi: "कम आय वाले परिवार का युवा"
  },
  "profile_youth_desc": {
    en: "Develop savings habits, credit awareness, and plan for your future.",
    hi: "बचत की आदतें, क्रेडिट जागरूकता विकसित करें और अपने भविष्य की योजना बनाएं।"
  },
  "btn_start_journey": {
    en: "🚀 Start My Learning Journey",
    hi: "🚀 मेरी सीखने की यात्रा शुरू करें"
  },

  // ----- DASHBOARD -----
  "dash_welcome": {
    en: "Welcome back! 🙏",
    hi: "वापस स्वागत है! 🙏"
  },
  "dash_progress": {
    en: "You're making great progress on your financial learning journey.",
    hi: "आप अपनी वित्तीय सीखने की यात्रा में बहुत अच्छी प्रगति कर रहे हैं।"
  },
  "dash_tip": {
    en: "💡 Small financial steps today create strong futures tomorrow.",
    hi: "💡 आज के छोटे आर्थिक कदम कल का मज़बूत भविष्य बनाते हैं।"
  },
  "dash_quick": {
    en: "⚡ Quick Access",
    hi: "⚡ त्वरित पहुँच"
  },
  "dash_continue": {
    en: "Continue Last Lesson",
    hi: "अंतिम पाठ जारी रखें"
  },
  "dash_budget": {
    en: "Open Budget Planner",
    hi: "बजट प्लानर खोलें"
  },
  "dash_savings": {
    en: "View Savings Goal",
    hi: "बचत लक्ष्य देखें"
  },
  "dash_offline": {
    en: "Download Offline Content",
    hi: "ऑफ़लाइन सामग्री डाउनलोड करें"
  },
  "dash_suggested": {
    en: "📌 Suggested for You",
    hi: "📌 आपके लिए सुझाव"
  },

  // ----- LEARN -----
  "learn_badge": {
    en: "📚 Learn",
    hi: "📚 सीखें"
  },
  "learn_title": {
    en: "Your Learning Modules",
    hi: "आपके सीखने के मॉड्यूल"
  },
  "learn_desc": {
    en: "Each lesson is short, simple, and designed to help you take action in your daily life.",
    hi: "प्रत्येक पाठ छोटा, सरल है और आपके दैनिक जीवन में कार्रवाई करने में मदद करने के लिए बनाया गया है।"
  },
  "mod1_title": {
    en: "Where Does My Money Go?",
    hi: "मेरा पैसा कहाँ जाता है?"
  },
  "mod1_desc": {
    en: "Understand your spending patterns and find small ways to save every day.",
    hi: "अपने खर्च के पैटर्न को समझें और हर दिन बचत के छोटे तरीके खोजें।"
  },
  "mod2_title": {
    en: "Saving with Irregular Income",
    hi: "अनियमित आय से बचत"
  },
  "mod2_desc": {
    en: "Practical strategies for saving when your income changes week to week.",
    hi: "जब आपकी आय हर हफ़्ते बदलती है तब बचत की व्यावहारिक रणनीतियाँ।"
  },
  "mod3_title": {
    en: "Using UPI and ATMs Safely",
    hi: "UPI और ATM का सुरक्षित उपयोग"
  },
  "mod3_desc": {
    en: "Step-by-step guide to digital payments without fear of losing money.",
    hi: "पैसे खोने के डर के बिना डिजिटल भुगतान की चरण-दर-चरण मार्गदर्शिका।"
  },
  "mod4_title": {
    en: "Understanding Loans Before Borrowing",
    hi: "उधार लेने से पहले लोन समझें"
  },
  "mod4_desc": {
    en: "Know the difference between helpful loans and harmful debt traps.",
    hi: "सहायक लोन और हानिकारक कर्ज़ जाल के बीच अंतर जानें।"
  },
  "mod5_title": {
    en: "How SHGs Help You Save",
    hi: "SHG बचत में कैसे मदद करते हैं"
  },
  "mod5_desc": {
    en: "Learn how Self-Help Groups work and how they can strengthen your finances.",
    hi: "जानें कि स्वयं सहायता समूह कैसे काम करते हैं और वे आपके वित्त को कैसे मज़बूत कर सकते हैं।"
  },
  "mod6_title": {
    en: "Protecting Yourself from Fraud",
    hi: "धोखाधड़ी से खुद को बचाएं"
  },
  "mod6_desc": {
    en: "Recognise common financial scams and keep your money safe.",
    hi: "आम वित्तीय घोटालों को पहचानें और अपने पैसे सुरक्षित रखें।"
  },
  "btn_watch": {
    en: "▶️ Watch",
    hi: "▶️ देखें"
  },
  "btn_listen": {
    en: "🔊 Listen",
    hi: "🔊 सुनें"
  },
  "btn_complete": {
    en: "✓ Complete",
    hi: "✓ पूरा करें"
  },
  "btn_done": {
    en: "✅ Done",
    hi: "✅ हो गया"
  },

  // ----- TOOLS -----
  "tools_badge": {
    en: "🛠️ Tools",
    hi: "🛠️ उपकरण"
  },
  "tools_title": {
    en: "Your Financial Tools",
    hi: "आपके वित्तीय उपकरण"
  },
  "tools_desc": {
    en: "Simple tools to help you plan your money and build savings step by step.",
    hi: "अपने पैसे की योजना बनाने और कदम-दर-कदम बचत बनाने के सरल उपकरण।"
  },
  "budget_title": {
    en: "📊 Budget Planner",
    hi: "📊 बजट प्लानर"
  },
  "budget_desc": {
    en: "Enter your income and expenses to see how much you can save.",
    hi: "अपनी आय और खर्चे दर्ज करें और देखें कि आप कितना बचा सकते हैं।"
  },
  "budget_income": {
    en: "Monthly / Weekly Income (₹)",
    hi: "मासिक / साप्ताहिक आय (₹)"
  },
  "budget_expenses": {
    en: "Your Expenses",
    hi: "आपके खर्चे"
  },
  "btn_add_expense": {
    en: "+ Add Another Expense",
    hi: "+ और खर्चा जोड़ें"
  },
  "btn_calculate": {
    en: "Calculate My Budget",
    hi: "मेरा बजट गणना करें"
  },
  "savings_title": {
    en: "🎯 Savings Goal Tracker",
    hi: "🎯 बचत लक्ष्य ट्रैकर"
  },
  "savings_desc": {
    en: "Choose a goal and track your progress towards it.",
    hi: "एक लक्ष्य चुनें और उसकी ओर अपनी प्रगति ट्रैक करें।"
  },
  "goal_education": {
    en: "Education",
    hi: "शिक्षा"
  },
  "goal_emergency": {
    en: "Emergency Fund",
    hi: "आपातकालीन कोष"
  },
  "goal_family": {
    en: "Family Needs",
    hi: "परिवार की ज़रूरतें"
  },
  "goal_business": {
    en: "Small Business",
    hi: "छोटा व्यापार"
  },
  "savings_target": {
    en: "How much do you want to save? (₹)",
    hi: "आप कितना बचाना चाहते हैं? (₹)"
  },
  "savings_weekly": {
    en: "How much can you save per week? (₹)",
    hi: "आप प्रति सप्ताह कितना बचा सकते हैं? (₹)"
  },
  "btn_start_saving": {
    en: "🎯 Start Saving",
    hi: "🎯 बचत शुरू करें"
  },

  // ----- SCHEMES -----
  "schemes_badge": {
    en: "🏛️ Government Schemes",
    hi: "🏛️ सरकारी योजनाएं"
  },
  "schemes_title": {
    en: "Schemes That Can Help You",
    hi: "योजनाएं जो आपकी मदद कर सकती हैं"
  },
  "schemes_desc": {
    en: "The government offers many programs to support your financial journey. Here are the most useful ones.",
    hi: "सरकार आपकी वित्तीय यात्रा में सहायता के लिए कई कार्यक्रम प्रदान करती है। यहाँ सबसे उपयोगी योजनाएं हैं।"
  },
  "scheme1_title": {
    en: "Pradhan Mantri Jan Dhan Yojana",
    hi: "प्रधानमंत्री जन धन योजना"
  },
  "scheme1_desc": {
    en: "Open a bank account with zero balance and get access to banking services, insurance, and more.",
    hi: "शून्य बैलेंस से बैंक खाता खोलें और बैंकिंग सेवाओं, बीमा आदि तक पहुँच प्राप्त करें।"
  },
  "scheme2_title": {
    en: "Pradhan Mantri Mudra Yojana",
    hi: "प्रधानमंत्री मुद्रा योजना"
  },
  "scheme2_desc": {
    en: "Get small business loans without collateral to start or grow your own business.",
    hi: "बिना गारंटी के छोटे व्यापार ऋण प्राप्त करें अपना व्यापार शुरू या बढ़ाने के लिए।"
  },
  "scheme3_title": {
    en: "Sukanya Samriddhi Yojana",
    hi: "सुकन्या समृद्धि योजना"
  },
  "scheme3_desc": {
    en: "Save for your daughter's education and marriage with high interest rates and tax benefits.",
    hi: "उच्च ब्याज दरों और कर लाभों के साथ अपनी बेटी की शिक्षा और विवाह के लिए बचत करें।"
  },
  "scheme4_title": {
    en: "PM Jeevan Jyoti Bima Yojana",
    hi: "पीएम जीवन ज्योति बीमा योजना"
  },
  "scheme4_desc": {
    en: "Life insurance cover of ₹2 lakh at just ₹436 per year — affordable protection for your family.",
    hi: "केवल ₹436 प्रति वर्ष में ₹2 लाख का जीवन बीमा — आपके परिवार की सस्ती सुरक्षा।"
  },
  "btn_learn_apply": {
    en: "📋 Learn How to Apply",
    hi: "📋 आवेदन कैसे करें जानें"
  },

  // ----- PROGRESS -----
  "progress_badge": {
    en: "📊 My Progress",
    hi: "📊 मेरी प्रगति"
  },
  "progress_title": {
    en: "Your Learning Journey",
    hi: "आपकी सीखने की यात्रा"
  },
  "progress_desc": {
    en: "See how far you've come. Every step counts!",
    hi: "देखें आप कितना आगे आ गए हैं। हर कदम मायने रखता है!"
  },
  "progress_lessons": {
    en: "Lessons Completed",
    hi: "पूरे किए पाठ"
  },
  "progress_goals": {
    en: "Savings Goals Started",
    hi: "बचत लक्ष्य शुरू किए"
  },
  "progress_skills": {
    en: "Skills Learned",
    hi: "सीखे गए कौशल"
  },
  "progress_detail": {
    en: "📈 Detailed Progress",
    hi: "📈 विस्तृत प्रगति"
  },
  "bar_basics": {
    en: "Financial Basics",
    hi: "वित्तीय मूल बातें"
  },
  "bar_savings": {
    en: "Savings Skills",
    hi: "बचत कौशल"
  },
  "bar_digital": {
    en: "Digital Banking",
    hi: "डिजिटल बैंकिंग"
  },
  "bar_schemes": {
    en: "Government Schemes",
    hi: "सरकारी योजनाएं"
  },
  "encourage_title": {
    en: "You are building lifelong financial confidence!",
    hi: "आप जीवनभर का वित्तीय आत्मविश्वास बना रहे हैं!"
  },
  "encourage_desc": {
    en: "Keep going — every lesson you complete brings you closer to financial freedom. Your family's future is brighter because of your effort today.",
    hi: "जारी रखें — हर पाठ जो आप पूरा करते हैं, आपको आर्थिक आज़ादी के करीब लाता है। आज आपके प्रयास से आपके परिवार का भविष्य उज्जवल है।"
  },

  // ----- FOOTER -----
  "footer_about": {
    en: "Financial Wisdom for Everyday Life. We believe everyone deserves to understand money and build a secure future, regardless of background or income level.",
    hi: "रोज़मर्रा की ज़िंदगी के लिए वित्तीय ज्ञान। हम मानते हैं कि हर किसी को पैसे समझने और सुरक्षित भविष्य बनाने का अधिकार है, चाहे पृष्ठभूमि या आय स्तर कुछ भी हो।"
  },
  "footer_learn": {
    en: "Learn",
    hi: "सीखें"
  },
  "footer_tools": {
    en: "Tools",
    hi: "उपकरण"
  },
  "footer_support": {
    en: "Support",
    hi: "सहायता"
  },
  "footer_copyright": {
    en: "© 2025 MoneyDharma. Made with 💚 for India's communities. Free & Open for All.",
    hi: "© 2025 मनीधर्मा। भारत के समुदायों के लिए 💚 से बनाया गया। सभी के लिए मुफ़्त।"
  },

  // ----- VOICE NARRATION -----
  "voice_welcome": {
    en: "Welcome to MoneyDharma. Your journey to financial freedom starts here.",
    hi: "मनीधर्मा में आपका स्वागत है। आपकी आर्थिक आज़ादी की यात्रा यहाँ से शुरू होती है।"
  },
  "voice_home": {
    en: "You are on the home page. MoneyDharma helps you understand money and build savings.",
    hi: "आप होम पेज पर हैं। मनीधर्मा आपको पैसे समझने और बचत बनाने में मदद करता है।"
  },
  "voice_learn": {
    en: "Welcome to the learning section. Here you can watch videos, listen to lessons, and complete modules.",
    hi: "सीखने के खंड में आपका स्वागत है। यहाँ आप वीडियो देख सकते हैं, पाठ सुन सकते हैं और मॉड्यूल पूरे कर सकते हैं।"
  },
  "voice_tools": {
    en: "Welcome to financial tools. Use the budget planner and savings goal tracker.",
    hi: "वित्तीय उपकरणों में आपका स्वागत है। बजट प्लानर और बचत लक्ष्य ट्रैकर का उपयोग करें।"
  },
  "voice_schemes": {
    en: "Government schemes section. Learn about schemes that can benefit you and your family.",
    hi: "सरकारी योजनाएं खंड। उन योजनाओं के बारे में जानें जो आपके और आपके परिवार को लाभ पहुँचा सकती हैं।"
  },
  "voice_progress": {
    en: "Your progress page. See how many lessons you have completed.",
    hi: "आपका प्रगति पृष्ठ। देखें कि आपने कितने पाठ पूरे किए हैं।"
  },
  "voice_lesson_complete": {
    en: "Great job! You completed a lesson. Keep going!",
    hi: "बहुत बढ़िया! आपने एक पाठ पूरा किया। जारी रखें!"
  }
};

// ============================================
// VOICE NARRATION SYSTEM
// ============================================

function speak(text) {
  // Stop any current speech
  stopSpeaking();

  if (!speechSynth) {
    console.warn("Speech synthesis not supported");
    return;
  }

  var utterance = new SpeechSynthesisUtterance(text);

  // Set language
  if (currentLang === "hi") {
    utterance.lang = "hi-IN";
  } else {
    utterance.lang = "en-IN";
  }

  // Set properties
  utterance.rate = 0.9;    // slightly slower for clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a good voice
  var voices = speechSynth.getVoices();
  var targetLang = currentLang === "hi" ? "hi" : "en";

  for (var i = 0; i < voices.length; i++) {
    if (voices[i].lang.indexOf(targetLang) !== -1) {
      utterance.voice = voices[i];
      break;
    }
  }

  utterance.onstart = function() {
    isSpeaking = true;
    updateSpeakButtons(true);
  };

  utterance.onend = function() {
    isSpeaking = false;
    updateSpeakButtons(false);
  };

  utterance.onerror = function() {
    isSpeaking = false;
    updateSpeakButtons(false);
  };

  speechSynth.speak(utterance);
}

function stopSpeaking() {
  if (speechSynth) {
    speechSynth.cancel();
  }
  isSpeaking = false;
  updateSpeakButtons(false);
}

function updateSpeakButtons(speaking) {
  var btn = document.getElementById("voiceToggleBtn");
  if (btn) {
    if (speaking) {
      btn.innerHTML = "⏹️ Stop";
      btn.classList.add("speaking");
    } else {
      btn.innerHTML = "🔊 " + (currentLang === "hi" ? "सुनें" : "Listen");
      btn.classList.remove("speaking");
    }
  }
}

// Speak a specific translation key
function speakKey(key) {
  var text = getTranslation(key);
  if (text) {
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, "");
    speak(text);
  }
}

// Narrate current page
function narratePage(pageName) {
  if (!audioEnabled) return;

  var voiceKey = "voice_" + pageName;
  if (translations[voiceKey]) {
    speakKey(voiceKey);
  }
}

// Read any text on click
function speakText(text) {
  if (isSpeaking) {
    stopSpeaking();
  } else {
    speak(text);
  }
}

// Narrate a module lesson
function narrateLesson(moduleNum) {
  var titleKey = "mod" + moduleNum + "_title";
  var descKey = "mod" + moduleNum + "_desc";

  var title = getTranslation(titleKey);
  var desc = getTranslation(descKey);

  var fullText = title + ". " + desc;
  speak(fullText);
}

// ============================================
// TRANSLATION SYSTEM
// ============================================

function getTranslation(key) {
  if (translations[key] && translations[key][currentLang]) {
    return translations[key][currentLang];
  }
  // Fallback to English
  if (translations[key] && translations[key]["en"]) {
    return translations[key]["en"];
  }
  return key;
}

function applyTranslations() {
  // Get all elements with data-translate attribute
  var elements = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < elements.length; i++) {
    var key = elements[i].getAttribute("data-i18n");
    var translation = getTranslation(key);
    if (elements[i].tagName === "INPUT" || elements[i].tagName === "TEXTAREA") {
      elements[i].placeholder = translation;
    } else {
      elements[i].innerHTML = translation;
    }
  }
}

function switchLanguage(lang) {
  currentLang = lang;
  stopSpeaking();
  applyTranslations();

  // Narrate language change
  if (audioEnabled) {
    var msg = lang === "hi"
      ? "भाषा हिंदी में बदल दी गई है"
      : "Language changed to English";
    setTimeout(function() { speak(msg); }, 300);
  }
}

// ============================================
// PAGE NAVIGATION
// ============================================
function showPage(pageName) {
  var allPages = document.querySelectorAll(".page-section");
  allPages.forEach(function(page) {
    page.classList.remove("active");
  });

  var targetPage = document.getElementById("page-" + pageName);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  var allNavLinks = document.querySelectorAll(".nav-links a");
  allNavLinks.forEach(function(link) {
    link.classList.remove("active");
    if (link.dataset.page === pageName) {
      link.classList.add("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Narrate page if audio enabled
  narratePage(pageName);
}

// ============================================
// NAVBAR SCROLL
// ============================================
window.addEventListener("scroll", function() {
  var navbar = document.getElementById("navbar");
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ============================================
// PROFILE SELECTION
// ============================================
function selectProfile(card) {
  var allCards = document.querySelectorAll(".profile-card");
  allCards.forEach(function(c) {
    c.classList.remove("selected");
  });
  card.classList.add("selected");

  // Narrate selected profile
  if (audioEnabled) {
    var h3 = card.querySelector("h3");
    if (h3) {
      speak(currentLang === "hi"
        ? "आपने चुना: " + h3.textContent
        : "You selected: " + h3.textContent);
    }
  }
}

// ============================================
// START JOURNEY
// ============================================
function startJourney() {
  var selectedCard = document.querySelector(".profile-card.selected");
  if (!selectedCard) {
    var msg = currentLang === "hi"
      ? "कृपया एक प्रोफ़ाइल चुनें जो आपका सबसे अच्छा वर्णन करे।"
      : "Please select a profile that best describes you.";
    alert(msg);
    if (audioEnabled) speak(msg);
    return;
  }

  showPage("dashboard");
  openModal("successModal");

  var title = currentLang === "hi" ? "🎉 मनीधर्मा में आपका स्वागत है!" : "🎉 Welcome to MoneyDharma!";
  var message = currentLang === "hi"
    ? "आपकी व्यक्तिगत सीखने की यात्रा तैयार हो गई है। चलिए आपका वित्तीय आत्मविश्वास बनाना शुरू करते हैं!"
    : "Your personalised learning journey has been created. Let's start building your financial confidence!";

  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;

  if (audioEnabled) speak(message);
}

// ============================================
// MODALS
// ============================================
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  stopSpeaking();
}

// ============================================
// LOGIN
// ============================================
function loginUser() {
  var phone = document.getElementById("loginPhone");
  var password = document.getElementById("loginPassword");

  if (!phone || !password) {
    openModal("loginModal");
    return;
  }

  if (!phone.value || !password.value) {
    var msg = currentLang === "hi"
      ? "कृपया अपना फ़ोन नंबर और पासवर्ड दर्ज करें।"
      : "Please enter your phone number and password.";
    alert(msg);
    return;
  }

  closeModal("loginModal");
  showPage("dashboard");

  openModal("successModal");
  var title = currentLang === "hi" ? "🙏 वापस स्वागत है!" : "🙏 Welcome Back!";
  var message = currentLang === "hi"
    ? "आपको फिर से देखकर खुशी हुई। अपनी सीखने की यात्रा जारी रखें!"
    : "Great to see you again. Continue your learning journey!";

  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;
  if (audioEnabled) speak(message);
}

// ============================================
// BUDGET PLANNER
// ============================================
function addExpenseRow() {
  var list = document.getElementById("expenseList");
  var row = document.createElement("div");
  row.className = "expense-row";

  var namePlaceholder = currentLang === "hi" ? "खर्चे का नाम" : "Expense name";
  var amountPlaceholder = currentLang === "hi" ? "राशि (₹)" : "Amount (₹)";

  row.innerHTML =
    '<input type="text" placeholder="' + namePlaceholder + '" class="expense-name">' +
    '<input type="number" placeholder="' + amountPlaceholder + '" class="expense-amount" min="0">';
  list.appendChild(row);
}

function calculateBudget() {
  var incomeInput = document.getElementById("incomeInput");
  var income = parseFloat(incomeInput.value) || 0;
  var expenseAmounts = document.querySelectorAll(".expense-amount");
  var totalExpenses = 0;

  expenseAmounts.forEach(function(input) {
    totalExpenses += parseFloat(input.value) || 0;
  });

  var remaining = income - totalExpenses;
  var resultDiv = document.getElementById("budgetResult");
  resultDiv.style.display = "block";

  if (income === 0) {
    var msg = currentLang === "hi" ? "⚠️ कृपया पहले अपनी आय दर्ज करें।" : "⚠️ Please enter your income first.";
    resultDiv.className = "budget-result negative";
    resultDiv.innerHTML = msg;
    if (audioEnabled) speak(msg);
    return;
  }

  if (remaining >= 0) {
    var saveMsg = currentLang === "hi"
      ? "✅ आप ₹" + remaining.toLocaleString("en-IN") + " बचा सकते हैं!"
      : "✅ You can save ₹" + remaining.toLocaleString("en-IN") + "!";

    var tipMsg = currentLang === "hi"
      ? "💡 थोड़ी-थोड़ी बचत भी बड़ा फ़र्क लाती है!"
      : "💡 Even saving a little regularly makes a big difference!";

    resultDiv.className = "budget-result positive";
    resultDiv.innerHTML = "<strong>" + saveMsg + "</strong><br><small class='result-tip'>" + tipMsg + "</small>";
    if (audioEnabled) speak(saveMsg);
  } else {
    var overMsg = currentLang === "hi"
      ? "⚠️ आपके खर्चे आय से ₹" + Math.abs(remaining).toLocaleString("en-IN") + " ज़्यादा हैं।"
      : "⚠️ Your expenses exceed income by ₹" + Math.abs(remaining).toLocaleString("en-IN") + ".";

    resultDiv.className = "budget-result negative";
    resultDiv.innerHTML = "<strong>" + overMsg + "</strong>";
    if (audioEnabled) speak(overMsg);
  }

  updateSkills();
}

// ============================================
// SAVINGS GOAL
// ============================================
function selectSavingsGoal(element, goal) {
  var allOptions = document.querySelectorAll(".savings-option");
  allOptions.forEach(function(opt) {
    opt.classList.remove("selected");
  });
  element.classList.add("selected");
  selectedGoal = goal;
}

function startSaving() {
  var target = parseFloat(document.getElementById("savingsTarget").value) || 0;
  var weekly = parseFloat(document.getElementById("savingsWeekly").value) || 0;
  var resultDiv = document.getElementById("savingsResult");

  if (!selectedGoal) {
    var msg = currentLang === "hi" ? "कृपया पहले एक बचत लक्ष्य चुनें।" : "Please select a savings goal first.";
    alert(msg);
    return;
  }
  if (target === 0 || weekly === 0) {
    var msg2 = currentLang === "hi"
      ? "कृपया लक्ष्य राशि और साप्ताहिक बचत दोनों दर्ज करें।"
      : "Please enter both your target amount and weekly savings.";
    alert(msg2);
    return;
  }

  var weeks = Math.ceil(target / weekly);
  var months = (weeks / 4.33).toFixed(1);

  var resultText = currentLang === "hi"
    ? 'हर हफ़्ते ₹' + weekly.toLocaleString("en-IN") + ' बचाकर, आप लगभग ' + weeks + ' हफ़्तों (~' + months + ' महीनों) में ₹' + target.toLocaleString("en-IN") + ' के लक्ष्य तक पहुँच जाएंगे!'
    : 'By saving ₹' + weekly.toLocaleString("en-IN") + ' every week, you\'ll reach ₹' + target.toLocaleString("en-IN") + ' in about ' + weeks + ' weeks (~' + months + ' months)!';

  var encourageText = currentLang === "hi"
    ? "💪 यह पूरी तरह से संभव है। आप कर सकते हैं!"
    : "💪 That's completely achievable. You've got this!";

  resultDiv.style.display = "block";
  resultDiv.innerHTML =
    '<h4>🎯 ' + selectedGoal + '</h4>' +
    '<p>' + resultText + '</p>' +
    '<p class="savings-encouragement">' + encourageText + '</p>';

  goalsStarted++;
  document.getElementById("goalsCount").textContent = goalsStarted;
  updateProgressBars();

  if (audioEnabled) speak(resultText);
}

// ============================================
// MARK COMPLETE
// ============================================
function markComplete(btn) {
  if (btn.classList.contains("completed")) return;

  btn.classList.add("completed");
  btn.innerHTML = getTranslation("btn_done");

  completedLessons++;
  document.getElementById("lessonsCount").textContent = completedLessons;
  updateSkills();
  updateProgressBars();

  openModal("successModal");

  var title = currentLang === "hi" ? "🎉 पाठ पूरा हुआ!" : "🎉 Lesson Complete!";
  var message = currentLang === "hi"
    ? "बहुत बढ़िया! आपने " + completedLessons + " पाठ पूरे किए। सीखते रहें!"
    : "Great work! You've completed " + completedLessons + " lesson" + (completedLessons > 1 ? "s" : "") + ". Keep learning!";

  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;

  if (audioEnabled) speakKey("voice_lesson_complete");
}

// ============================================
// PROGRESS UPDATE
// ============================================
function updateSkills() {
  skillsLearned = Math.min(completedLessons + goalsStarted, 10);
  document.getElementById("skillsCount").textContent = skillsLearned;
}

function updateProgressBars() {
  var basicsPercent = Math.min(Math.round((completedLessons / 6) * 100), 100);
  var savingsPercent = Math.min(Math.round(((completedLessons + goalsStarted) / 6) * 80), 100);
  var digitalPercent = Math.min(Math.round((completedLessons / 6) * 60), 100);
  var schemesPercent = Math.min(Math.round((completedLessons / 6) * 50), 100);

  var barBasics = document.getElementById("barBasics");
  var barSavings = document.getElementById("barSavings");
  var barDigital = document.getElementById("barDigital");
  var barSchemes = document.getElementById("barSchemes");

  if (barBasics) barBasics.style.width = basicsPercent + "%";
  if (barSavings) barSavings.style.width = savingsPercent + "%";
  if (barDigital) barDigital.style.width = digitalPercent + "%";
  if (barSchemes) barSchemes.style.width = schemesPercent + "%";

  var pB = document.getElementById("progressBasics");
  var pS = document.getElementById("progressSavings");
  var pD = document.getElementById("progressDigital");
  var pSc = document.getElementById("progressSchemes");

  if (pB) pB.textContent = basicsPercent + "%";
  if (pS) pS.textContent = savingsPercent + "%";
  if (pD) pD.textContent = digitalPercent + "%";
  if (pSc) pSc.textContent = schemesPercent + "%";
}

// ============================================
// ACCESSIBILITY
// ============================================
function toggleA11yPanel() {
  document.getElementById("a11yPanel").classList.toggle("open");
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  var msg = audioEnabled
    ? (currentLang === "hi" ? "🔊 ऑडियो मार्गदर्शन चालू किया गया।" : "🔊 Audio guidance enabled.")
    : (currentLang === "hi" ? "🔇 ऑडियो मार्गदर्शन बंद किया गया।" : "🔇 Audio guidance disabled.");

  alert(msg);
  if (audioEnabled) speak(msg);
}

function toggleTextSize() {
  largeText = !largeText;
  document.documentElement.classList.toggle("large-text", largeText);
  var msg = largeText
    ? (currentLang === "hi" ? "🔤 टेक्स्ट का आकार बढ़ाया गया।" : "🔤 Text size increased.")
    : (currentLang === "hi" ? "🔤 टेक्स्ट का आकार वापस किया गया।" : "🔤 Text size restored.");
  alert(msg);
}

function focusLangSelector() {
  document.getElementById("langSelector").focus();
}

function downloadOffline() {
  var msg = currentLang === "hi"
    ? "📥 ऑफ़लाइन उपयोग के लिए पाठ डाउनलोड हो रहे हैं..."
    : "📥 Downloading lessons for offline use...";
  alert(msg);
}

function playAudio() {
  if (isSpeaking) {
    stopSpeaking();
    return;
  }

  var msg = currentLang === "hi"
    ? "यह पाठ आपको पैसों की बुनियादी बातें सिखाएगा। अपनी आय और खर्चों को समझना सबसे पहला कदम है।"
    : "This lesson will teach you the basics of money management. Understanding your income and expenses is the first step.";
  speak(msg);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🌱 MoneyDharma — Financial Wisdom for Everyday Life");

  // Close modal on overlay click
  var allOverlays = document.querySelectorAll(".modal-overlay");
  allOverlays.forEach(function(overlay) {
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
        stopSpeaking();
      }
    });
  });

  // Language selector
  var langSelector = document.getElementById("langSelector");
  if (langSelector) {
    langSelector.addEventListener("change", function() {
      switchLanguage(this.value);
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay").forEach(function(m) {
        m.classList.remove("open");
      });
      document.body.style.overflow = "";
      document.getElementById("a11yPanel").classList.remove("open");
      stopSpeaking();
    }
  });

  // Load voices for speech synthesis
  if (speechSynth) {
    speechSynth.getVoices();
    speechSynth.onvoiceschanged = function() {
      speechSynth.getVoices();
    };
  }

  // Apply initial translations
  applyTranslations();
  updateProgressBars();
});