'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeStorage } from './safe-storage';
import si from './translations/si.json';
import en from './translations/en.json';
import ta from './translations/ta.json';

type Language = 'si' | 'en' | 'ta';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { si, en, ta };

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('si');

    useEffect(() => {
        // Load language from localStorage
        const saved = safeStorage.getItem('floodaid-language') as Language;
        if (saved && ['si', 'en', 'ta'].includes(saved)) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        safeStorage.setItem('floodaid-language', lang);
    };

    const t = (key: string, params?: Record<string, string>): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        let result = value || key;

        if (params && typeof result === 'string') {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                result = result.replace(`{{${paramKey}}}`, paramValue);
            });
        }

        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
