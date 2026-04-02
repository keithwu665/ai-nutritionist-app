import { useLanguage } from "@/contexts/LanguageContext";
import { t, Language } from "@shared/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsLanguage() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'en', name: 'English' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.language', language)}</CardTitle>
        <CardDescription>
          {language === 'zh' ? '選擇您偏好的語言' : 'Choose your preferred language'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            variant={language === lang.code ? 'default' : 'outline'}
            className="w-full justify-start"
          >
            <span className="mr-2">{language === lang.code ? '✓' : ''}</span>
            {lang.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
