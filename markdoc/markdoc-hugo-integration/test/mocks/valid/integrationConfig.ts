import { HugoGlobalConfig } from '../../../src/schemas/config/hugo';
import { IntegrationConfig } from '../../../src/schemas/config/integration';
import { VALID_SITE_DIR } from '../../config/constants';
import { HugoFunctions } from '../../../src/helperModules/HugoFunctions';

const mockIntegrationConfig: IntegrationConfig = {
  siteParams: { img_url: 'https://example.com' },
  env: 'development',
  languages: ['en', 'ja'],
  siteConfig: {
    baseURL: 'https://example.com/'
  },
  siteDir: VALID_SITE_DIR,
  i18n: {
    en: {
      example_key: {
        other: 'test'
      }
    },
    ja: {
      example_key: {
        other: 'テスト'
      }
    }
  }
};

const mockHugoGlobalConfig: HugoGlobalConfig = {
  ...mockIntegrationConfig,
  dirs: HugoFunctions.getSubdirsByType(VALID_SITE_DIR),
  i18n: {
    en: {
      example_key: {
        other: 'test'
      }
    },
    ja: {
      example_key: {
        other: 'テスト'
      }
    }
  }
};

export { mockHugoGlobalConfig, mockIntegrationConfig };
