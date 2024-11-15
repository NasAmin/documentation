import { z } from 'zod';
import { SNAKE_CASE_REGEX, FILTER_OPTIONS_ID_REGEX } from './../regexes';

/**
 * The configuration of an individual page filter,
 * as defined in the front matter of a document.
 */
export const PageFilterConfigSchema = z
  .object({
    display_name: z.string(),
    id: z.string().regex(SNAKE_CASE_REGEX),
    options_source: z.string().regex(FILTER_OPTIONS_ID_REGEX),
    default_value: z.string().regex(SNAKE_CASE_REGEX).optional()
  })
  .strict();

/**
 * The configuration of an individual page filter,
 * minified in order to reduce the load time of the HTML file
 * it's embedded in.
 */
export const MinifiedPageFilterConfigSchema = z
  .object({
    n: z.string(), // display name
    i: z.string().regex(SNAKE_CASE_REGEX), // id
    o: z.string().regex(FILTER_OPTIONS_ID_REGEX), // options source
    d: z.string().regex(SNAKE_CASE_REGEX).optional() // default value
  })
  .strict();

/**
 * The configuration of an individual page filter,
 * minified in order to reduce the load time of the HTML file
 * it's embedded in.
 *
 * To keep Zod out of the browser bundle,
 * this type is defined independently of Zod,
 * rather than being derived directly from the schema,
 * which is the usual approach and would be less redundant.
 *
 * @example
 * {
 *   n: "Database",             // filter display name
 *   i: "database",             // filter ID
 *   o: "dbm_database_options", // filter source ID
 *   d: "postgres"              // filter default value
 * }
 */
export interface MinifiedPageFilterConfig {
  n: string; // display name
  i: string; // ID
  o: string; // options source
  d?: string; // default value
}

/**
 * An array of minified filter configurations,
 * used to represent all available filters on the page
 * in a compact format to reduce HTML load time.
 *
 * To keep Zod out of the browser bundle,
 * this type is defined independently of Zod,
 * rather than being derived directly from the schema,
 * which is the usual approach and would be less redundant.
 */
export const MinifiedPageFiltersConfigSchema = z.array(MinifiedPageFilterConfigSchema);

/**
 * An array of minified filter configurations,
 * used to represent all available filters on the page
 * in a compact format to reduce HTML load time.
 */
export type MinifiedPageFiltersConfig = Array<MinifiedPageFilterConfig>;

/**
 * The configuration of an individual page filter,
 * as defined in the front matter of a document.
 *
 * @example
 * {
 *   display_name: "Database",
 *   id: "database",
 *   options_source: "dbm_database_options",
 *   default_value: "postgres" // optional override
 * }
 */
export type PageFilterConfig = z.infer<typeof PageFilterConfigSchema>;

/**
 * The list of page filters, as defined in the front matter
 * of a document, validated as a whole.
 */
export const PageFiltersConfigSchema = z
  .array(PageFilterConfigSchema)
  .refine((filtersConfig) => {
    // Page filter names must be unique within a page
    const filterNames = filtersConfig.map((filterConfig) => filterConfig.display_name);
    const uniqueFilterNames = new Set(filterNames);
    if (filterNames.length !== uniqueFilterNames.size) {
      console.error('Duplicate page filter display names found in list:', filterNames);
      return false;
    }

    // Placeholders must refer to a valid filter name
    // that is defined earlier in the list than the placeholder
    const definedParamNames = new Set();
    for (const filterConfig of filtersConfig) {
      definedParamNames.add(filterConfig.display_name);
      const bracketedPlaceholders = filterConfig.display_name.match(/<([a-z0-9_]+)>/g);
      if (bracketedPlaceholders) {
        for (const placeholder of bracketedPlaceholders) {
          const paramName = placeholder.slice(1, -1);
          if (!definedParamNames.has(paramName)) {
            console.error(`Invalid placeholder reference found: ${placeholder}`);
            return false;
          }
        }
      }
    }

    return true;
  });

/**
 * The list of page filters, as defined in the front matter
 * of a document.
 */
export type PageFiltersConfig = z.infer<typeof PageFiltersConfigSchema>;

/**
 * The list of further reading links, as parsed directly from
 * the front matter YAML of a given file.
 */
export const FurtherReadingConfigSchema = z
  .array(
    z
      .object({
        link: z.string(),
        text: z.string(),
        tag: z.string().optional()
      })
      .strict()
  )
  .min(1);

/**
 * The list of further reading links, as parsed directly from
 * the front matter YAML of a given file.
 *
 * @example
 * [
 *   {
 *     link: "https://exampleblogpost.com",
 *     text: "Example blog post",
 *     tag: "blog"
 *   },
 *   {
 *     link: "https://random.com",
 *     text: "Some random link with no applicable tag"
 *   }
 * ]
 */
export type FurtherReadingConfig = z.infer<typeof FurtherReadingConfigSchema>;

/**
 * The front matter of a document required by the integration
 * (additional keys are allowed in the front matter YAML,
 * but are ignored by the integration).
 */
export const FrontmatterSchema = z.object({
  title: z.string(),
  page_filters: PageFiltersConfigSchema.optional(),
  further_reading: FurtherReadingConfigSchema.optional()
});

/**
 * The front matter of a document required by the integration
 * (additional keys are allowed in the front matter YAML,
 * but are ignored by the integration).
 *
 * @example
 * {
 *   title: "Decorative Painting Tips",
 *   page_filters: [
 *     {
 *       display_name: "Color",
 *       id: "color",
 *       options_source: "color_options"
 *     },
 *     {
 *       display_name: "Finish",
 *       id: "finish",
 *       options_source: "paint_finish_options"
 *     },
 *     {
 *       display_name: "Paint color",
 *       id: "paint_color",
 *       options_source: "<FINISH>_<COLOR>_paint_options"
 *     }
 *   ]
 * }
 */
export type Frontmatter = z.infer<typeof FrontmatterSchema>;
