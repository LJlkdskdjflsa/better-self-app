const { isTaiwanPlatform } = require('~/utils/isTaiwanPlatform');

const i18nConfig = {
  locales: isTaiwanPlatform() ? ['zh'] : ['en', 'fr', 'nl', 'ja', 'pt'],
  defaultLocale: isTaiwanPlatform() ? 'zh' : 'en',
};

module.exports = i18nConfig;
