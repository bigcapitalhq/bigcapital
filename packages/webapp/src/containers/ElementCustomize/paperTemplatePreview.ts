import { pick } from 'lodash';

const excludedKeys = new Set(['templateName', 'companyLogoKey']);

/**
 * The paper template card style used by the customize previews.
 * The shared templates own the document styles; this only adds the preview
 * card decoration around them.
 */
export const paperTemplatePreviewStyle = {
  borderRadius: 5,
  boxShadow:
    'inset 0 4px 0 0 var(--invoice-primary-color), 0 10px 15px rgba(0, 0, 0, 0.05)',
};

/**
 * Picks the shared template props from the branding state and form values.
 * The form initial values define the supported template props; the remaining
 * branding fields are added explicitly.
 */
export function pickPaperTemplateProps<T extends object>(
  source: Record<string, unknown>,
  initialValues: Record<string, unknown>,
): T {
  const keys = [
    ...Object.keys(initialValues).filter((key) => !excludedKeys.has(key)),
    'companyAddress',
  ];

  return pick(source, keys) as T;
}
