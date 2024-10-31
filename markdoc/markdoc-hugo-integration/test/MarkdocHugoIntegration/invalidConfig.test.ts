import { MarkdocHugoIntegration } from '../../src';
import { describe, test, expect } from 'vitest';
import { VALID_SITE_DIR } from '../config/constants';

const siteDir = VALID_SITE_DIR;

describe('MarkdocHugoIntegration (optimized Markdown output)', () => {
  const dirs = {
    content: siteDir + '/content',
    options: siteDir + '/preferences_config/options',
    partials: siteDir + '/partials',
    images: siteDir + '/images'
  };

  const invalidHugoConfigs = [
    // no env property
    {
      siteParams: {
        img_url: 'https://example.com'
      },
      languages: ['en'],
      siteConfig: {
        baseURL: 'https://example.com'
      },
      dirs
    },
    // no img_url in siteParamss
    {
      siteParams: {
        irrelevant_key: 'irrelevant_value'
      },
      env: 'development',
      languages: ['en'],
      siteConfig: {
        baseURL: 'https://example.com'
      },
      dirs
    },
    // no branch in siteParams when env is 'preview'
    {
      siteParams: {
        img_url: 'https://example.com'
      },
      env: 'preview',
      languages: ['en'],
      siteConfig: {
        baseURL: 'https://example.com'
      },
      dirs
    }
  ];

  for (const hugoConfig of invalidHugoConfigs) {
    test(`throws an error when provided with Hugo config ${JSON.stringify(
      hugoConfig
    )}`, () => {
      expect(() => {
        // @ts-expect-error, invalidity is intentional
        new MarkdocHugoIntegration({ ...initArgs, hugoConfig });
      }).toThrow();
    });
  }
});
