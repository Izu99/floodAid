import json
import os

def update_json_generic(file_path, updates):
    print(f"Updating {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for key, value in updates.items():
            keys = key.split('.')
            current = data
            for k in keys[:-1]:
                if k not in current:
                    current[k] = {}
                current = current[k]
            current[keys[-1]] = value
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Successfully saved {file_path}")
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

# Add page instruction
update_json_generic('client/src/lib/translations/si.json', {
    'helpRequests.pageInstruction': 'කරුණාකර උදව් ලැබුණු පසු මෙහි තත්වය යාවත්කාලීන කරන්න. එය අන් අය

ගේ කාලය නාස්ති නොවන ලෙස උදව් කරයි.'
})

update_json_generic('client/src/lib/translations/en.json', {
    'helpRequests.pageInstruction': 'Please update the status of this request once you have received help. It will give someone else a chance.'
})

update_json_generic('client/src/lib/translations/ta.json', {
    'helpRequests.pageInstruction': 'உதவி பெற்றவுடன் இந்த கோரிக்கையின் நிலையை புதுப்பிக்கவும். அது மற்றவர்களுக்கு வாய்ப்பளிக்கும்.'
})
