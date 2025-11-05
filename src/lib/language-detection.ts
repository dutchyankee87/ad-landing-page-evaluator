// Language detection and localization utilities

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  culturalContext: string[];
  adCopyTips: string[];
  ctaPreferences: string[];
  trustSignals: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, Language> = {
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    culturalContext: ['Direct communication', 'Individual benefits', 'Time efficiency'],
    adCopyTips: [
      'Use clear, direct headlines',
      'Emphasize individual benefits and ROI',
      'Include specific numbers and percentages',
      'Use action-oriented verbs'
    ],
    ctaPreferences: ['Get Started', 'Try Free', 'Learn More', 'Sign Up Now'],
    trustSignals: ['Customer testimonials', 'Money-back guarantee', 'Security badges', 'Industry awards']
  },
  'es': {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Latin America/Spain',
    culturalContext: ['Family-oriented', 'Relationship-focused', 'Community values'],
    adCopyTips: [
      'Emphasize family and community benefits',
      'Use warm, personal language',
      'Include emotional appeals',
      'Mention shared values and traditions'
    ],
    ctaPreferences: ['Comenzar', 'Probar Gratis', 'Más Información', 'Únete Ahora'],
    trustSignals: ['Testimonios familiares', 'Garantía de satisfacción', 'Certificaciones locales', 'Presencia comunitaria']
  },
  'fr': {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'France/Francophone',
    culturalContext: ['Quality appreciation', 'Sophisticated communication', 'Cultural refinement'],
    adCopyTips: [
      'Emphasize quality and craftsmanship',
      'Use elegant, sophisticated language',
      'Highlight exclusivity and refinement',
      'Include cultural and artistic elements'
    ],
    ctaPreferences: ['Commencer', 'Essai Gratuit', 'En Savoir Plus', 'Rejoindre'],
    trustSignals: ['Certifications de qualité', 'Héritage et tradition', 'Recommandations d\'experts', 'Labels français']
  },
  'de': {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany/DACH',
    culturalContext: ['Efficiency focus', 'Detail-oriented', 'Quality and precision'],
    adCopyTips: [
      'Provide detailed specifications',
      'Emphasize engineering and quality',
      'Use logical, systematic arguments',
      'Include technical details and certifications'
    ],
    ctaPreferences: ['Jetzt Starten', 'Kostenlos Testen', 'Mehr Erfahren', 'Jetzt Anmelden'],
    trustSignals: ['TÜV-Zertifizierungen', 'Made in Germany', 'Technische Spezifikationen', 'Industriestandards']
  },
  'it': {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'Italy',
    culturalContext: ['Style and aesthetics', 'Passion-driven', 'Relationship importance'],
    adCopyTips: [
      'Emphasize style and beauty',
      'Use passionate, expressive language',
      'Highlight craftsmanship and tradition',
      'Include emotional and sensory appeals'
    ],
    ctaPreferences: ['Inizia Ora', 'Prova Gratis', 'Scopri di Più', 'Iscriviti'],
    trustSignals: ['Made in Italy', 'Tradizione artigianale', 'Testimonianze appassionate', 'Certificazioni di qualità']
  },
  'pt': {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil/Portugal',
    culturalContext: ['Warmth and hospitality', 'Relationship-centered', 'Emotional connection'],
    adCopyTips: [
      'Use warm, friendly language',
      'Emphasize relationships and community',
      'Include emotional storytelling',
      'Highlight personal benefits and growth'
    ],
    ctaPreferences: ['Começar', 'Teste Grátis', 'Saiba Mais', 'Cadastre-se'],
    trustSignals: ['Depoimentos calorosos', 'Garantia de satisfação', 'Comunidade ativa', 'Certificações locais']
  },
  'nl': {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'Netherlands',
    culturalContext: ['Directness and honesty', 'Practical approach', 'Value consciousness'],
    adCopyTips: [
      'Be direct and honest',
      'Emphasize practical benefits',
      'Include clear value propositions',
      'Use straightforward, no-nonsense language'
    ],
    ctaPreferences: ['Begin Nu', 'Gratis Proberen', 'Meer Info', 'Aanmelden'],
    trustSignals: ['Eerlijke beoordelingen', 'Transparante prijzen', 'Nederlandse kwaliteit', 'Praktische resultaten']
  }
};

// Simple language detection based on common words
export const detectLanguage = (text: string): string => {
  const normalizedText = text.toLowerCase();
  
  // Language-specific common words and patterns
  const languagePatterns = {
    'es': ['y', 'el', 'la', 'de', 'que', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'cómo', 'más', 'gratis', 'ahora', 'precio'],
    'fr': ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus', 'prix', 'gratuit'],
    'de': ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass', 'kostenlos', 'jetzt', 'preis'],
    'it': ['il', 'di', 'che', 'e', 'la', 'a', 'per', 'in', 'un', 'è', 'da', 'con', 'le', 'si', 'dei', 'non', 'una', 'alla', 'del', 'nel', 'come', 'più', 'gratis', 'ora', 'prezzo'],
    'pt': ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'grátis', 'agora', 'preço'],
    'nl': ['de', 'van', 'het', 'een', 'en', 'dat', 'die', 'te', 'in', 'voor', 'is', 'op', 'met', 'als', 'zijn', 'er', 'maar', 'om', 'door', 'over', 'ze', 'zich', 'bij', 'ook', 'tot', 'je', 'mij', 'nu', 'gratis', 'prijs']
  };
  
  let bestMatch = 'en';
  let highestScore = 0;
  
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    const matches = patterns.filter(pattern => {
      // Check for whole word matches
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      return regex.test(normalizedText);
    });
    
    const score = matches.length;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = lang;
    }
  }
  
  return bestMatch;
};

export const getLanguageConfig = (languageCode: string): Language => {
  return SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES['en'];
};

export const generateLocalizedRecommendations = (
  language: Language,
  elementType: 'headline' | 'cta' | 'body' | 'trust_signals'
): string[] => {
  switch (elementType) {
    case 'headline':
      return language.adCopyTips.slice(0, 2);
    case 'cta':
      return [`Consider using: "${language.ctaPreferences[0]}" or "${language.ctaPreferences[1]}"`];
    case 'body':
      return language.adCopyTips.slice(2);
    case 'trust_signals':
      return language.trustSignals;
    default:
      return language.adCopyTips;
  }
};

export const getCulturalInsights = (language: Language): string[] => {
  return language.culturalContext;
};

// Enhanced recommendation generator that considers cultural context
export const generateCulturallyAwareRecommendation = (
  baseRecommendation: string,
  language: Language,
  elementType: string
): string => {
  const culturalPrefix = {
    'es': `Para audiencias hispanohablantes: ${baseRecommendation}. Considera enfatizar valores familiares y comunitarios.`,
    'fr': `Pour les audiences francophones: ${baseRecommendation}. Mettez l'accent sur la qualité et le raffinement.`,
    'de': `Für deutschsprachige Zielgruppen: ${baseRecommendation}. Betonen Sie Effizienz und technische Details.`,
    'it': `Per il pubblico italiano: ${baseRecommendation}. Enfatizza stile, passione e tradizione artigianale.`,
    'pt': `Para audiências lusófonas: ${baseRecommendation}. Destaque o calor humano e os benefícios relacionais.`,
    'nl': `Voor Nederlandse doelgroepen: ${baseRecommendation}. Wees direct en benadruk praktische voordelen.`
  };
  
  return culturalPrefix[language.code as keyof typeof culturalPrefix] || baseRecommendation;
};