export const DISTRICTS = [
    { value: 'colombo', label: 'කොළඹ' },
    { value: 'gampaha', label: 'ගම්පහ' },
    { value: 'kalutara', label: 'කළුතර' },
    { value: 'kandy', label: 'මහනුවර' },
    { value: 'matale', label: 'මාතලේ' },
    { value: 'nuwara-eliya', label: 'නුවර එළිය' },
    { value: 'galle', label: 'ගාල්ල' },
    { value: 'matara', label: 'මාතර' },
    { value: 'hambantota', label: 'හම්බන්තොට' },
    { value: 'jaffna', label: 'යාපනය' },
    { value: 'kilinochchi', label: 'කිලිනොච්චි' },
    { value: 'mannar', label: 'මන්නාරම' },
    { value: 'vavuniya', label: 'වව්නියාව' },
    { value: 'mullaitivu', label: 'මුලතිව්' },
    { value: 'batticaloa', label: 'මඩකලපුව' },
    { value: 'ampara', label: 'අම්පාර' },
    { value: 'trincomalee', label: 'ත්‍රිකුණාමලය' },
    { value: 'kurunegala', label: 'කුරුණෑගල' },
    { value: 'puttalam', label: 'පුත්තලම' },
    { value: 'anuradhapura', label: 'අනුරාධපුරය' },
    { value: 'polonnaruwa', label: 'පොළොන්නරුව' },
    { value: 'badulla', label: 'බදුල්ල' },
    { value: 'monaragala', label: 'මොණරාගල' },
    { value: 'ratnapura', label: 'රත්නපුර' },
    { value: 'kegalle', label: 'කෑගල්ල' },
];

export const getDistrictLabel = (value: string) => {
    const district = DISTRICTS.find(d => d.value === value);
    return district ? district.label : value;
};
