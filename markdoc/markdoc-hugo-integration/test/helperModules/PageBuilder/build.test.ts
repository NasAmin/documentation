import { describe, test, expect } from 'vitest';
import { MdocFileParser } from '../../../src/helperModules/MdocFileParser';
import { PageBuilder } from '../../../src/helperModules/PageBuilder';
import { YamlConfigParser } from '../../../src/helperModules/YamlConfigParser';
import {
  VALID_CONTENT_DIR,
  VALID_PARTIALS_DIR,
  VALID_FILTERS_CONFIG_DIR,
  SNAPSHOTS_DIR
} from '../../config/constants';
import { PageFiltersManifestSchema } from '../../../src/schemas/pageFilters';
import {
  mockHugoGlobalConfig,
  mockPageConfig
} from '../../mocks/valid/integrationConfig';

describe('PageBuilder.build', () => {
  const LANG_DIR = VALID_FILTERS_CONFIG_DIR + '/en';
  const testFilePath = VALID_CONTENT_DIR + '/en/primary_colors.mdoc';
  const allowlist = YamlConfigParser.loadAllowlistFromLangDir(LANG_DIR);
  const filterOptionsConfig = YamlConfigParser.loadFiltersConfigFromLangDir({
    dir: LANG_DIR,
    allowlist
  });

  const sanitizedMarkdocFilename = testFilePath.replace(VALID_CONTENT_DIR, '');

  const parsedFile = MdocFileParser.parseMdocFile({
    file: testFilePath,
    partialsDir: VALID_PARTIALS_DIR
  });

  const filterOptionsConfigForPage = YamlConfigParser.getFilterOptionsForPage(
    parsedFile.frontmatter,
    filterOptionsConfig
  );

  const draftFiltersManifest = YamlConfigParser.buildPageFiltersManifest({
    frontmatter: parsedFile.frontmatter,
    filterOptionsConfig: filterOptionsConfig,
    allowlist
  });

  const filtersManifest = PageFiltersManifestSchema.parse(draftFiltersManifest);

  const { html } = PageBuilder.build({
    parsedFile,
    filterOptionsConfig: filterOptionsConfigForPage,
    hugoConfig: { global: mockHugoGlobalConfig, page: mockPageConfig },
    filtersManifest: filtersManifest
  });

  test(`builds a Markdown string for ${sanitizedMarkdocFilename} that matches the snapshot`, () => {
    expect(html).toMatchFileSnapshot(
      `${SNAPSHOTS_DIR}/helperModules/PageBuilder/${sanitizedMarkdocFilename}/compiledHtml.snap.html`
    );
  });
});
