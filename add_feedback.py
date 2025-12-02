import json
import os

# Load translation files
base_path = "client/src/lib/translations"

feedback_translations = {
    "en": {
        "button": "Feedback",
        "title": "Share Your Feedback",
        "description": "Help us improve this website. Your suggestions are valuable.",
        "nameLabel": "Your Name (Optional)",
        "namePlaceholder": "Enter your name",
        "thoughtsLabel": "What do you think about this site?",
        "thoughtsPlaceholder": "Share your thoughts...",
        "improvementsLabel": "What should we improve?",
        "improvementsPlaceholder": "Your suggestions...",
        "submitButton": "Submit Feedback",
        "successMessage": "Thank you for your feedback!",
        "errorMessage": "Failed to submit. Please try again."
    },
    "si": {
        "button": "ප්‍රතිචාර",
        "title": "ඔබේ ප්‍රතිචාර බෙදා ගන්න",
        "description": "මෙම වෙබ් අඩවිය වැඩිදියුණු කිරීමට ඔබේ යෝජනා අපට වැදගත් වේ.",
        "nameLabel": "ඔබේ නම (විකල්ප)",
        "namePlaceholder": "ඔබේ නම ඇතුළත් කරන්න",
        "thoughtsLabel": "මෙම වෙබ් අඩවිය ගැන ඔබ සිතන්නේ කුමක්ද?",
        "thoughtsPlaceholder": "ඔබේ අදහස් බෙදා ගන්න...",
        "improvementsLabel": "අප වැඩිදියුණු කළ යුත්තේ මොනවාද?",
        "improvementsPlaceholder": "ඔබේ යෝජනා...",
        "submitButton": "ප්‍රතිචාරය ඉදිරිපත් කරන්න",
        "successMessage": "ඔබේ ප්‍රතිචාරයට ස්තූතියි!",
        "errorMessage": "ඉදිරිපත් කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න."
    },
    "ta": {
        "button": "கருத்து",
        "title": "உங்கள் கருத்தைப் பகிரவும்",
        "description": "இந்த வலைத்தளத்தை மேம்படுத்த எங்களுக்கு உதவவும். உங்கள் பரிந்துரைகள் மதிப்புமிக்கவை.",
        "nameLabel": "உங்கள் பெயர் (விருப்பம்)",
        "namePlaceholder": "உங்கள் பெயரை உள்ளிடவும்",
        "thoughtsLabel": "இந்த தளத்தைப் பற்றி நீங்கள் என்ன நினைக்கிறீர்கள்?",
        "thoughtsPlaceholder": "உங்கள் எண்ணங்களைப் பகிரவும்...",
        "improvementsLabel": "நாம் எதை மேம்படுத்த வேண்டும்?",
        "improvementsPlaceholder": "உங்கள் பரிந்துரைகள்...",
        "submitButton": "கருத்தை சமர்ப்பிக்கவும்",
        "successMessage": "உங்கள் கருத்துக்கு நன்றி!",
        "errorMessage": "சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
    }
}

for lang, filename in [("en", "en.json"), ("si", "si.json"), ("ta", "ta.json")]:
    file_path = os.path.join(base_path, filename)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add feedback section before districts
    # Create order list with feedback between common and districts
    ordered_data = {}
    for key in data.keys():
        if key == 'districts':
            ordered_data['feedback'] = feedback_translations[lang]
        ordered_data[key] = data[key]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(ordered_data, f, ensure_ascii=False, indent=4)
    
    print(f"Updated {filename}")

print("All translation files updated successfully!")
