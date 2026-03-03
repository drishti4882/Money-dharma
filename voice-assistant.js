/* ============================================
   MoneyDharma — Voice Assistant
   Dharma: Your Financial Guide
   ============================================ */

var vaOpen = false;
var vaListening = false;
var vaRecognition = null;
var vaSpeaking = false;
var vaLang = "en";
var vaHistory = [];
var vaGreeted = false;

// ===== KNOWLEDGE BASE =====
var vaKnowledge = {

  greetings: {
    en: [
      "Namaste! 🙏 I'm Dharma, your financial guide. How can I help you today?",
      "Hello! Welcome to MoneyDharma. Ask me anything about money, savings, or government schemes!",
      "Hi there! I'm here to help you with budgeting, savings, UPI, loans, and more."
    ],
    hi: [
      "नमस्ते! 🙏 मैं धर्मा हूँ, आपका वित्तीय मार्गदर्शक। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      "नमस्ते! मनीधर्मा में आपका स्वागत है। पैसे, बचत या सरकारी योजनाओं के बारे में कुछ भी पूछें!",
      "नमस्ते! मैं बजट, बचत, UPI, लोन और बहुत कुछ में आपकी मदद के लिए यहाँ हूँ।"
    ]
  },

  topics: {

    budget: {
      keywords: ["budget", "budgeting", "expense", "expenses", "income", "spending", "खर्च", "बजट", "आय", "खर्चा", "पैसा कहाँ जाता"],
      response: {
        en: "Great question about budgeting!\n\n" +
            "📌 **50-30-20 Rule:**\n" +
            "• 50% for needs (food, rent, transport)\n" +
            "• 30% for wants (clothes, entertainment)\n" +
            "• 20% for savings\n\n" +
            "📌 **Track Daily Expenses:** Write down every rupee you spend for one week.\n\n" +
            "📌 **Use our Budget Planner tool** to calculate your savings.\n\n" +
            "Want me to open the Budget Planner?",
        hi: "बजट के बारे में बहुत अच्छा सवाल!\n\n" +
            "📌 **50-30-20 नियम:**\n" +
            "• 50% ज़रूरतों के लिए (खाना, किराया, यातायात)\n" +
            "• 30% इच्छाओं के लिए (कपड़े, मनोरंजन)\n" +
            "• 20% बचत के लिए\n\n" +
            "📌 **रोज़ के खर्चे लिखें:** एक हफ़्ते तक हर रुपया लिखें।\n\n" +
            "📌 **हमारा बजट प्लानर टूल** इस्तेमाल करें।\n\n" +
            "क्या आप चाहते हैं कि मैं बजट प्लानर खोलूँ?"
      },
      action: "tools"
    },

    savings: {
      keywords: ["save", "saving", "savings", "बचत", "बचाना", "पैसे बचाएं", "save money", "how to save", "कैसे बचाएं"],
      response: {
        en: "Smart savings tips:\n\n" +
            "💰 **Start Small:** Even ₹10 per day = ₹3,650 per year!\n\n" +
            "💰 **Pay Yourself First:** Save before spending.\n\n" +
            "💰 **Use a Savings Jar:** Keep a jar at home for daily savings.\n\n" +
            "💰 **Set a Goal:** Save for something specific like emergency fund or education.\n\n" +
            "Want to set up a savings goal?",
        hi: "बचत के स्मार्ट सुझाव:\n\n" +
            "💰 **छोटी शुरुआत करें:** रोज़ ₹10 भी = साल में ₹3,650!\n\n" +
            "💰 **पहले बचाएं:** खर्च करने से पहले बचत करें।\n\n" +
            "💰 **बचत का डिब्बा:** घर पर रोज़ बचत के लिए एक डिब्बा रखें।\n\n" +
            "💰 **लक्ष्य रखें:** आपातकालीन कोष या शिक्षा के लिए बचत करें।\n\n" +
            "क्या आप बचत का लक्ष्य बनाना चाहते हैं?"
      },
      action: "tools"
    },

    upi: {
      keywords: ["upi", "phonepe", "google pay", "gpay", "paytm", "digital payment", "online payment", "यूपीआई", "फोनपे", "गूगल पे", "डिजिटल भुगतान"],
      response: {
        en: "UPI Safety Guide:\n\n" +
            "📱 **UPI PIN is like ATM PIN** — Never share it!\n\n" +
            "📱 **QR Code:**\n" +
            "• Scan to PAY\n" +
            "• NEVER scan to RECEIVE money\n\n" +
            "📱 **Safety Rules:**\n" +
            "• No bank will call asking for PIN or OTP\n" +
            "• Never click unknown links\n" +
            "• Verify receiver's name before paying\n\n" +
            "📱 **Money stuck?** Call 1800-120-1740 (NPCI)",
        hi: "UPI सुरक्षा गाइड:\n\n" +
            "📱 **UPI PIN ATM PIN जैसा है** — किसी को न बताएं!\n\n" +
            "📱 **QR कोड:**\n" +
            "• भुगतान के लिए स्कैन करें\n" +
            "• पैसे प्राप्त करने के लिए कभी स्कैन नहीं\n\n" +
            "📱 **सुरक्षा नियम:**\n" +
            "• बैंक कभी PIN या OTP नहीं पूछता\n" +
            "• अनजान लिंक पर क्लिक न करें\n" +
            "• भुगतान से पहले नाम जाँचें\n\n" +
            "📱 **पैसा अटका?** 1800-120-1740 पर कॉल करें"
      },
      action: "learn"
    },

    loan: {
      keywords: ["loan", "borrow", "debt", "emi", "interest", "लोन", "कर्ज", "उधार", "ब्याज", "किस्त"],
      response: {
        en: "Important about loans:\n\n" +
            "🏦 **Good vs Bad Loans:**\n" +
            "✅ Good: Education, home, business (from banks)\n" +
            "❌ Bad: Moneylender, app loans with 100%+ interest\n\n" +
            "🏦 **Before Any Loan:**\n" +
            "• Compare 3+ banks\n" +
            "• Read ALL terms\n" +
            "• Check total repayment, not just EMI\n" +
            "• Never borrow to repay another loan\n\n" +
            "🏦 **Mudra Yojana:** Up to ₹10 lakh without collateral",
        hi: "लोन के बारे में ज़रूरी बातें:\n\n" +
            "🏦 **अच्छा बनाम बुरा लोन:**\n" +
            "✅ अच्छा: शिक्षा, होम, बिज़नेस (बैंकों से)\n" +
            "❌ बुरा: साहूकार, 100%+ ब्याज वाले ऐप लोन\n\n" +
            "🏦 **लोन लेने से पहले:**\n" +
            "• 3+ बैंकों से तुलना करें\n" +
            "• सब शर्तें पढ़ें\n" +
            "• कुल चुकौती जाँचें\n" +
            "• दूसरा लोन चुकाने के लिए उधार न लें\n\n" +
            "🏦 **मुद्रा योजना:** बिना गारंटी ₹10 लाख तक"
      },
      action: "learn"
    },

    schemes: {
      keywords: ["scheme", "schemes", "government", "yojana", "jan dhan", "mudra", "sukanya", "pm", "सरकारी", "योजना", "जन धन", "मुद्रा", "सुकन्या"],
      response: {
        en: "Key Government Schemes:\n\n" +
            "🏦 **Jan Dhan Yojana:**\n" +
            "• Zero balance account + Free debit card + ₹2L insurance\n\n" +
            "💼 **Mudra Yojana:**\n" +
            "• Business loans up to ₹10 lakh, no collateral\n\n" +
            "👧 **Sukanya Samriddhi:**\n" +
            "• For daughter's future, 8% interest, start with ₹250\n\n" +
            "🛡️ **PM Jeevan Jyoti Bima:**\n" +
            "• ₹2 lakh life insurance at ₹436/year\n\n" +
            "Want me to show how to apply?",
        hi: "प्रमुख सरकारी योजनाएं:\n\n" +
            "🏦 **जन धन योजना:**\n" +
            "• शून्य बैलेंस खाता + मुफ़्त डेबिट कार्ड + ₹2L बीमा\n\n" +
            "💼 **मुद्रा योजना:**\n" +
            "• ₹10 लाख तक बिज़नेस लोन, बिना गारंटी\n\n" +
            "👧 **सुकन्या समृद्धि:**\n" +
            "• बेटी के भविष्य के लिए, 8% ब्याज, ₹250 से शुरू\n\n" +
            "🛡️ **PM जीवन ज्योति बीमा:**\n" +
            "• ₹436/साल में ₹2 लाख जीवन बीमा\n\n" +
            "आवेदन करना बताऊँ?"
      },
      action: "schemes"
    },

    fraud: {
      keywords: ["fraud", "scam", "cheat", "fake", "theft", "hack", "धोखा", "ठगी", "चोरी", "फ्रॉड", "स्कैम"],
      response: {
        en: "🚨 Protect from fraud!\n\n" +
            "🛡️ **Never Share:** OTP, UPI PIN, Bank password, ATM PIN\n\n" +
            "🛡️ **Common Scams:**\n" +
            "• 'You won lottery!' — FAKE\n" +
            "• 'KYC update, click link' — FAKE\n" +
            "• 'Send ₹10 get ₹10,000' — SCAM\n\n" +
            "🛡️ **If Fraud Happens:**\n" +
            "• Call bank IMMEDIATELY\n" +
            "• Dial 1930 (Cyber Crime Helpline)\n" +
            "• Visit cybercrime.gov.in\n\n" +
            "NO bank employee will EVER ask for PIN or OTP!",
        hi: "🚨 धोखाधड़ी से बचें!\n\n" +
            "🛡️ **कभी न बताएं:** OTP, UPI PIN, बैंक पासवर्ड, ATM PIN\n\n" +
            "🛡️ **आम धोखे:**\n" +
            "• 'लॉटरी जीती!' — झूठ\n" +
            "• 'KYC अपडेट, लिंक क्लिक करें' — फ्रॉड\n" +
            "• '₹10 भेजें ₹10,000 पाएं' — ठगी\n\n" +
            "🛡️ **धोखा हो जाए:**\n" +
            "• तुरंत बैंक को कॉल करें\n" +
            "• 1930 डायल करें\n" +
            "• cybercrime.gov.in पर शिकायत\n\n" +
            "कोई बैंक कर्मचारी कभी PIN या OTP नहीं पूछता!"
      },
      action: "learn"
    },

    shg: {
      keywords: ["shg", "self help", "group saving", "mahila", "women group", "स्वयं सहायता", "महिला समूह"],
      response: {
        en: "Self-Help Groups (SHGs):\n\n" +
            "👥 **How They Work:**\n" +
            "• 10-20 women form a group\n" +
            "• Everyone saves fixed amount weekly\n" +
            "• Members can borrow from pool\n" +
            "• Lower interest than moneylenders\n\n" +
            "👥 **Benefits:** Regular savings, emergency loans, financial confidence\n\n" +
            "Contact your local Panchayat or NRLM office to join.",
        hi: "स्वयं सहायता समूह (SHG):\n\n" +
            "👥 **कैसे काम करते हैं:**\n" +
            "• 10-20 महिलाएं समूह बनाती हैं\n" +
            "• सभी हर हफ़्ते तय राशि बचाती हैं\n" +
            "• सदस्य समूह से उधार ले सकती हैं\n" +
            "• साहूकार से कम ब्याज\n\n" +
            "👥 **फ़ायदे:** नियमित बचत, आपातकालीन लोन, आत्मविश्वास\n\n" +
            "अपनी पंचायत या NRLM कार्यालय से संपर्क करें।"
      },
      action: "learn"
    },

    bank: {
      keywords: ["bank", "account", "open account", "atm", "debit card", "बैंक", "खाता", "एटीएम"],
      response: {
        en: "Opening a Bank Account:\n\n" +
            "🏦 **You Need:**\n" +
            "• Aadhaar Card\n" +
            "• PAN Card (if available)\n" +
            "• Passport-size photo\n" +
            "• ₹0 (Jan Dhan is free!)\n\n" +
            "🏦 **Steps:**\n" +
            "1. Visit nearest bank\n" +
            "2. Ask for account form\n" +
            "3. Fill with staff help\n" +
            "4. Get passbook + card in 7 days\n\n" +
            "🏦 **ATM Tips:** Cover keypad, never let strangers help, take card back.",
        hi: "बैंक खाता खोलना:\n\n" +
            "🏦 **क्या चाहिए:**\n" +
            "• आधार कार्ड\n" +
            "• पैन कार्ड (अगर हो)\n" +
            "• पासपोर्ट साइज़ फ़ोटो\n" +
            "• ₹0 (जन धन मुफ़्त!)\n\n" +
            "🏦 **कदम:**\n" +
            "1. नज़दीकी बैंक जाएं\n" +
            "2. खाता फ़ॉर्म माँगें\n" +
            "3. स्टाफ की मदद से भरें\n" +
            "4. 7 दिन में पासबुक + कार्ड\n\n" +
            "🏦 **ATM:** कीपैड ढकें, अजनबी की मदद न लें।"
      },
      action: "learn"
    },

    help: {
      keywords: ["help", "what can you do", "commands", "मदद", "सहायता", "क्या कर सकते", "कैसे", "how"],
      response: {
        en: "I can help with:\n\n" +
            "📚 **Learning:** Any financial topic\n" +
            "📊 **Budget:** Plan your expenses\n" +
            "💰 **Savings:** Tips to save money\n" +
            "📱 **UPI/Digital:** Safe payments\n" +
            "🏛️ **Schemes:** Government schemes\n" +
            "🛡️ **Fraud:** How to stay safe\n" +
            "🏦 **Banking:** Account & ATM help\n\n" +
            "Type or use 🎤 to speak!",
        hi: "मैं इनमें मदद कर सकता हूँ:\n\n" +
            "📚 **सीखना:** कोई भी वित्तीय विषय\n" +
            "📊 **बजट:** खर्चों की योजना\n" +
            "💰 **बचत:** पैसे बचाने के सुझाव\n" +
            "📱 **UPI/डिजिटल:** सुरक्षित भुगतान\n" +
            "🏛️ **योजनाएं:** सरकारी योजनाएं\n" +
            "🛡️ **धोखाधड़ी:** सुरक्षित रहें\n" +
            "🏦 **बैंकिंग:** खाता और ATM मदद\n\n" +
            "टाइप करें या 🎤 से बोलें!"
      },
      action: null
    }
  },

  fallback: {
    en: [
      "I'm not sure about that. I can help with budgeting, savings, UPI, loans, or government schemes. What would you like to know?",
      "I didn't understand. Try asking about savings, budget, UPI safety, or government schemes!",
      "I'm best at helping with money topics. Ask about savings, loans, or schemes!"
    ],
    hi: [
      "मुझे इसकी जानकारी नहीं है। मैं बजट, बचत, UPI, लोन या सरकारी योजनाओं में मदद कर सकता हूँ।",
      "मैं समझ नहीं पाया। बचत, बजट, UPI या सरकारी योजनाओं के बारे में पूछें!",
      "मैं पैसों के विषयों में सबसे अच्छा हूँ। बचत, लोन या योजनाओं के बारे में पूछें!"
    ]
  }
};

// ============================================
// SETUP ON PAGE LOAD
// ============================================
document.addEventListener("DOMContentLoaded", function() {

  // Sync language
  if (typeof currentLang !== "undefined") {
    vaLang = currentLang;
  }

  // Setup speech recognition
  setupSpeechRecognition();

  // Show hint bubble after 3 seconds
  setTimeout(function() {
    var fab = document.getElementById("vaFab");
    if (fab && !vaGreeted) {
      fab.classList.add("va-hint");
      setTimeout(function() {
        fab.classList.remove("va-hint");
      }, 5000);
    }
  }, 3000);
});

// ============================================
// SPEECH RECOGNITION
// ============================================
function setupSpeechRecognition() {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported");
    return;
  }

  vaRecognition = new SpeechRecognition();
  vaRecognition.continuous = false;
  vaRecognition.interimResults = true;

  vaRecognition.onstart = function() {
    vaListening = true;
    updateMicUI(true);
    updateVAStatus(vaLang === "hi" ? "सुन रहा हूँ..." : "Listening...");
  };

  vaRecognition.onresult = function(event) {
    var transcript = "";
    for (var i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    var input = document.getElementById("vaTextInput");
    if (input) input.value = transcript;

    if (event.results[event.results.length - 1].isFinal) {
      processVAInput(transcript.trim());
    }
  };

  vaRecognition.onerror = function(event) {
    vaListening = false;
    updateMicUI(false);
    updateVAStatus(vaLang === "hi" ? "तैयार" : "Ready");

    if (event.error === "not-allowed") {
      addVAMessage("assistant", vaLang === "hi"
        ? "माइक्रोफ़ोन की अनुमति चाहिए। ब्राउज़र सेटिंग्स में अनुमति दें।"
        : "Microphone permission needed. Allow in browser settings.");
    }
  };

  vaRecognition.onend = function() {
    vaListening = false;
    updateMicUI(false);
    updateVAStatus(vaLang === "hi" ? "तैयार" : "Ready");
  };
}

// ============================================
// VOICE INPUT TOGGLE
// ============================================
function toggleVoiceInput() {
  if (!vaRecognition) {
    addVAMessage("assistant", vaLang === "hi"
      ? "आपका ब्राउज़र वॉइस सपोर्ट नहीं करता। Chrome इस्तेमाल करें।"
      : "Your browser doesn't support voice. Please use Chrome.");
    return;
  }

  if (vaListening) {
    vaRecognition.stop();
  } else {
    if (typeof stopSpeaking === "function") stopSpeaking();
    vaRecognition.lang = vaLang === "hi" ? "hi-IN" : "en-IN";
    try {
      vaRecognition.start();
    } catch (e) {
      console.error("Mic error:", e);
    }
  }
}

// ============================================
// TOGGLE PANEL
// ============================================
function toggleVAPanel() {
  var panel = document.getElementById("vaPanel");
  var fab = document.getElementById("vaFab");
  var fabIcon = document.getElementById("vaFabIcon");

  vaOpen = !vaOpen;

  if (vaOpen) {
    panel.classList.add("open");
    fab.classList.add("active");
    fabIcon.textContent = "✕";

    if (!vaGreeted) {
      vaGreeted = true;
      var greetings = vaKnowledge.greetings[vaLang];
      var greeting = greetings[Math.floor(Math.random() * greetings.length)];
      setTimeout(function() {
        addVAMessage("assistant", greeting);
        if (typeof speak === "function") speak(greeting);
      }, 500);
    }

    setTimeout(function() {
      var input = document.getElementById("vaTextInput");
      if (input) input.focus();
    }, 600);
  } else {
    panel.classList.remove("open");
    fab.classList.remove("active");
    fabIcon.textContent = "🪷";
    if (typeof stopSpeaking === "function") stopSpeaking();
    if (vaListening && vaRecognition) vaRecognition.stop();
  }
}

// ============================================
// SEND MESSAGE
// ============================================
function sendVAMessage() {
  var input = document.getElementById("vaTextInput");
  var text = input.value.trim();
  if (!text) return;
  input.value = "";
  processVAInput(text);
}

// ============================================
// PROCESS INPUT
// ============================================
function processVAInput(text) {
  if (!text) return;

  addVAMessage("user", text);
  showTyping();

  setTimeout(function() {
    hideTyping();
    var response = findResponse(text);
    addVAMessage("assistant", response.text);

    // Speak response
    if (typeof speak === "function") {
      var shortText = response.text.replace(/\n/g, ". ").replace(/\*\*/g, "").replace(/[•📌💰📱🏦🛡️👥🚨✅❌]/g, "");
      if (shortText.length > 300) shortText = shortText.substring(0, 300) + "...";
      speak(shortText);
    }

    // Navigate if action exists
    if (response.action) {
      setTimeout(function() {
        if (typeof showPage === "function") showPage(response.action);
      }, 2000);
    }
  }, 800 + Math.random() * 700);
}

// ============================================
// FIND RESPONSE
// ============================================
function findResponse(input) {
  var lowerInput = input.toLowerCase();
  var bestMatch = null;
  var bestScore = 0;

  var topicKeys = Object.keys(vaKnowledge.topics);
  for (var i = 0; i < topicKeys.length; i++) {
    var topic = vaKnowledge.topics[topicKeys[i]];
    var score = 0;
    for (var j = 0; j < topic.keywords.length; j++) {
      if (lowerInput.indexOf(topic.keywords[j].toLowerCase()) !== -1) {
        score += topic.keywords[j].length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      text: bestMatch.response[vaLang] || bestMatch.response["en"],
      action: bestMatch.action
    };
  }

  // Greetings
  var greetWords = ["hello", "hi", "hey", "namaste", "नमस्ते", "हैलो", "हाय"];
  for (var k = 0; k < greetWords.length; k++) {
    if (lowerInput.indexOf(greetWords[k]) !== -1) {
      var g = vaKnowledge.greetings[vaLang];
      return { text: g[Math.floor(Math.random() * g.length)], action: null };
    }
  }

  // Thank you
  var thankWords = ["thank", "thanks", "धन्यवाद", "शुक्रिया"];
  for (var t = 0; t < thankWords.length; t++) {
    if (lowerInput.indexOf(thankWords[t]) !== -1) {
      return {
        text: vaLang === "hi" ? "आपका स्वागत है! 🙏 और कोई सवाल हो तो पूछें।" : "You're welcome! 🙏 Ask more anytime.",
        action: null
      };
    }
  }

  // Fallback
  var fb = vaKnowledge.fallback[vaLang];
  return { text: fb[Math.floor(Math.random() * fb.length)], action: null };
}

// ============================================
// QUICK ACTIONS
// ============================================
function vaQuickAction(action) {
  var messages = {
    learn: { en: "I want to start learning", hi: "मैं सीखना शुरू करना चाहता हूँ" },
    budget: { en: "Help me with budgeting", hi: "बजट बनाने में मदद करें" },
    savings: { en: "How can I save money?", hi: "मैं पैसे कैसे बचा सकता हूँ?" },
    schemes: { en: "Tell me about government schemes", hi: "सरकारी योजनाओं के बारे में बताएं" },
    upi: { en: "How to use UPI safely?", hi: "UPI सुरक्षित कैसे इस्तेमाल करें?" },
    fraud: { en: "How to protect from fraud?", hi: "धोखाधड़ी से कैसे बचें?" }
  };
  var msg = messages[action] ? messages[action][vaLang] : action;
  processVAInput(msg);
}

// ============================================
// UI FUNCTIONS
// ============================================

function addVAMessage(sender, text) {
  var chat = document.getElementById("vaChat");
  if (!chat) return;

  var msgDiv = document.createElement("div");
  msgDiv.className = "va-message va-" + sender;

  var avatar = sender === "assistant" ? "🪷" : "👤";
  var formattedText = formatVAText(text);

  msgDiv.innerHTML =
    '<div class="va-msg-avatar">' + avatar + '</div>' +
    '<div class="va-msg-content">' +
      '<div class="va-msg-bubble">' + formattedText + '</div>' +
      '<div class="va-msg-time">' + getTimeString() + '</div>' +
    '</div>';

  if (sender === "assistant") {
    var speakBtn = document.createElement("button");
    speakBtn.className = "va-msg-speak";
    speakBtn.innerHTML = "🔊";
    speakBtn.title = "Listen";
    speakBtn.onclick = function() {
      var cleanText = text.replace(/\*\*/g, "").replace(/[•📌💰📱🏦🛡️👥🚨✅❌🏠📚🛠️📊]/g, "");
      if (cleanText.length > 300) cleanText = cleanText.substring(0, 300);
      if (typeof speak === "function") speak(cleanText);
    };
    msgDiv.querySelector(".va-msg-content").appendChild(speakBtn);
  }

  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  var chat = document.getElementById("vaChat");
  if (!chat) return;
  var typing = document.createElement("div");
  typing.className = "va-message va-assistant va-typing-msg";
  typing.id = "vaTypingIndicator";
  typing.innerHTML =
    '<div class="va-msg-avatar">🪷</div>' +
    '<div class="va-msg-content"><div class="va-msg-bubble">' +
    '<div class="va-typing"><span></span><span></span><span></span></div>' +
    '</div></div>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
  var el = document.getElementById("vaTypingIndicator");
  if (el) el.remove();
}

function formatVAText(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\n/g, '<br>');
  text = text.replace(/• /g, '&nbsp;&nbsp;• ');
  return text;
}

function getTimeString() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m + ' ' + ampm;
}

function updateMicUI(listening) {
  var btn = document.getElementById("vaMicBtn");
  var icon = document.getElementById("vaMicIcon");
  var waves = document.getElementById("vaMicWaves");
  if (listening) {
    btn.classList.add("listening");
    icon.textContent = "⏹️";
    waves.classList.add("active");
  } else {
    btn.classList.remove("listening");
    icon.textContent = "🎤";
    waves.classList.remove("active");
  }
}

function updateVAStatus(text) {
  var s = document.getElementById("vaStatus");
  if (s) s.textContent = text;
}

function toggleVALang() {
  vaLang = vaLang === "en" ? "hi" : "en";

  if (typeof currentLang !== "undefined") currentLang = vaLang;
  if (typeof switchLanguage === "function") switchLanguage(vaLang);

  // Update lang selector dropdown too
  var langSelector = document.getElementById("langSelector");
  if (langSelector) langSelector.value = vaLang;

  var langBtn = document.getElementById("vaLangToggle");
  if (langBtn) {
    langBtn.textContent = vaLang === "en" ? "EN/हि" : "हि/EN";
    langBtn.classList.toggle("active-hi", vaLang === "hi");
  }

  var name = document.getElementById("vaAssistantName");
  if (name) name.textContent = vaLang === "hi" ? "धर्मा सहायक" : "Dharma Assistant";

  var input = document.getElementById("vaTextInput");
  if (input) input.placeholder = vaLang === "hi" ? "टाइप करें या बोलें..." : "Type or speak...";

  updateVAStatus(vaLang === "hi" ? "तैयार" : "Ready");

  // Update quick buttons
  var quickBtns = document.querySelectorAll(".va-quick-btn");
  quickBtns.forEach(function(btn) {
    var text = btn.getAttribute("data-va-" + vaLang);
    if (text) {
      var emoji = btn.textContent.substring(0, 2);
      btn.textContent = emoji + " " + text;
    }
  });

  var msg = vaLang === "hi" ? "भाषा हिंदी में बदली गई" : "Language changed to English";
  addVAMessage("assistant", msg);
  if (typeof speak === "function") speak(msg);
}