import os
import json

dict_dir = r"c:\Capstone Project\frontend\src\dictionaries"
os.makedirs(dict_dir, exist_ok=True)

dicts = {
    "en": {
        "header": {"schemes": "Schemes", "dashboard": "Dashboard", "about": "About", "login": "Login", "logout": "Logout"},
        "dashboard": {
            "greeting": "Hi, {name} 👋",
            "question": "What would you like to do?",
            "card_scholarships": "Scholarships",
            "card_schemes": "Government Schemes",
            "card_saved": "My Saved Schemes",
            "card_checklist": "My Checklist",
            "card_chat": "Ask AI",
            "card_profile": "My Profile"
        },
        "landing": {
            "badge": "Powered by Advanced Agentic AI",
            "title": "Find the Right Government Scheme in Minutes",
            "subtitle": "SchemePilot AI instantly matches you with the exact schemes you are eligible for.",
            "cta": "Get Started Now",
            "browse": "Browse Schemes"
        }
    },
    "hi": {
        "header": {"schemes": "योजनाएं", "dashboard": "डैशबोर्ड", "about": "हमारे बारे में", "login": "लॉग इन", "logout": "लॉग आउट"},
        "dashboard": {
            "greeting": "नमस्ते, {name} 👋",
            "question": "आप क्या करना चाहेंगे?",
            "card_scholarships": "छात्रवृत्ति",
            "card_schemes": "सरकारी योजनाएं",
            "card_saved": "मेरी सहेजी गई योजनाएं",
            "card_checklist": "मेरी चेकलिस्ट",
            "card_chat": "एआई से पूछें",
            "card_profile": "मेरी प्रोफ़ाइल"
        },
        "landing": {
            "badge": "उन्नत एआई द्वारा संचालित",
            "title": "मिनटों में सही सरकारी योजना खोजें",
            "subtitle": "SchemePilot AI तुरंत आपको उन सटीक योजनाओं से मिलाता है जिनके लिए आप पात्र हैं।",
            "cta": "अभी शुरू करें",
            "browse": "योजनाएं ब्राउज़ करें"
        }
    },
    "mr": {
        "header": {"schemes": "योजना", "dashboard": "डॅशबोर्ड", "about": "आमच्याबद्दल", "login": "लॉगिन", "logout": "लॉगआउट"},
        "dashboard": {
            "greeting": "नमस्कार, {name} 👋",
            "question": "तुम्हाला काय करायला आवडेल?",
            "card_scholarships": "शिष्यवृत्ती",
            "card_schemes": "सरकारी योजना",
            "card_saved": "माझ्या जतन केलेल्या योजना",
            "card_checklist": "माझी चेकलिस्ट",
            "card_chat": "AI ला विचारा",
            "card_profile": "माझे प्रोफाइल"
        },
        "landing": {
            "badge": "प्रगत AI द्वारे समर्थित",
            "title": "मिनिटांत योग्य सरकारी योजना शोधा",
            "subtitle": "SchemePilot AI तुम्हाला त्वरित त्या योजनांशी जोडतो ज्यासाठी तुम्ही पात्र आहात.",
            "cta": "आता सुरू करा",
            "browse": "योजना ब्राउझ करा"
        }
    },
    "ta": {
        "header": {"schemes": "திட்டங்கள்", "dashboard": "கட்டுப்பாட்டு அறை", "about": "எங்களை பற்றி", "login": "உள்நுழைய", "logout": "வெளியேறு"},
        "dashboard": {
            "greeting": "வணக்கம், {name} 👋",
            "question": "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
            "card_scholarships": "கல்வி உதவித்தொகை",
            "card_schemes": "அரசு திட்டங்கள்",
            "card_saved": "எனது சேமிக்கப்பட்ட திட்டங்கள்",
            "card_checklist": "எனது சரிபார்ப்பு பட்டியல்",
            "card_chat": "AI விடம் கேளுங்கள்",
            "card_profile": "எனது சுயவிவரம்"
        },
        "landing": {
            "badge": "மேம்பட்ட AI மூலம் இயக்கப்படுகிறது",
            "title": "சில நிமிடங்களில் சரியான அரசு திட்டத்தை கண்டறியுங்கள்",
            "subtitle": "நீங்கள் தகுதியுடைய சரியான திட்டங்களுடன் SchemePilot AI உங்களை உடனடியாக இணைக்கிறது.",
            "cta": "இப்போது தொடங்குங்கள்",
            "browse": "திட்டங்களை உலாவுக"
        }
    },
    "te": {
        "header": {"schemes": "పథకాలు", "dashboard": "డాష్‌బోర్డ్", "about": "మా గురించి", "login": "లాగిన్", "logout": "లాగౌట్"},
        "dashboard": {
            "greeting": "నమస్తే, {name} 👋",
            "question": "మీరు ఏమి చేయాలనుకుంటున్నారు?",
            "card_scholarships": "స్కాలర్షిప్లు",
            "card_schemes": "ప్రభుత్వ పథకాలు",
            "card_saved": "నా సేవ్ చేసిన పథకాలు",
            "card_checklist": "నా చెక్‌లిస్ట్",
            "card_chat": "AI ని అడగండి",
            "card_profile": "నా ప్రొఫైల్"
        },
        "landing": {
            "badge": "అధునాతన AI ద్వారా ఆధారితం",
            "title": "నిమిషాల్లో సరైన ప్రభుత్వ పథకాన్ని కనుగొనండి",
            "subtitle": "SchemePilot AI మీరు అర్హులైన ఖచ్చితమైన పథకాలతో మిమ్మల్ని తక్షణమే సరిపోలుస్తుంది.",
            "cta": "ఇప్పుడే ప్రారంభించండి",
            "browse": "పథకాలను బ్రౌజ్ చేయండి"
        }
    },
    "or": {
        "header": {"schemes": "ଯୋଜନା", "dashboard": "ଡ୍ୟାସବୋର୍ଡ", "about": "ଆମ ବିଷୟରେ", "login": "ଲଗଇନ୍", "logout": "ଲଗଆଉଟ୍"},
        "dashboard": {
            "greeting": "ନମସ୍କାର, {name} 👋",
            "question": "ଆପଣ କ'ଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି?",
            "card_scholarships": "ଛାତ୍ରବୃତ୍ତି",
            "card_schemes": "ସରକାରୀ ଯୋଜନା",
            "card_saved": "ମୋର ସଂରକ୍ଷିତ ଯୋଜନା",
            "card_checklist": "ମୋର ଚେକଲିଷ୍ଟ",
            "card_chat": "AI କୁ ପଚାରନ୍ତୁ",
            "card_profile": "ମୋର ପ୍ରୋଫାଇଲ୍"
        },
        "landing": {
            "badge": "ଉନ୍ନତ AI ଦ୍ୱାରା ପରିଚାଳିତ |",
            "title": "ମିନିଟ୍ ମଧ୍ୟରେ ସଠିକ୍ ସରକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ",
            "subtitle": "SchemePilot AI ଆପଣଙ୍କୁ ତୁରନ୍ତ ସେହି ଯୋଜନା ସହିତ ଯୋଡିଥାଏ ଯାହା ପାଇଁ ଆପଣ ଯୋଗ୍ୟ ଅଟନ୍ତି।",
            "cta": "ବର୍ତ୍ତମାନ ଆରମ୍ଭ କରନ୍ତୁ",
            "browse": "ଯୋଜନା ବ୍ରାଉଜ୍ କରନ୍ତୁ"
        }
    }
}

for lang, data in dicts.items():
    with open(os.path.join(dict_dir, f"{lang}.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Dictionaries created successfully!")
