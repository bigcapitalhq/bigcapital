export type DisplayNameSource = {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
};

type DisplayNameFormat = {
  format: string;
  fields: Array<keyof DisplayNameSource>;
  required: number[];
};

const FORMATS: DisplayNameFormat[] = [
  {
    format: '{1} {2} {3}',
    fields: ['salutation', 'firstName', 'lastName'],
    required: [1],
  },
  { format: '{1} {2}', fields: ['firstName', 'lastName'], required: [] },
  { format: '{1}, {2}', fields: ['firstName', 'lastName'], required: [1, 2] },
  { format: '{1}', fields: ['companyName'], required: [1] },
];

export function resolveDisplayName(
  format: string,
  source: DisplayNameSource,
): string {
  const formatOption = FORMATS.find(({ format: f }) => f === format);
  if (!formatOption) return '';

  const values = formatOption.fields.map((field) => source[field]);
  let label = format;

  values.forEach((value, index) => {
    const replaceWith = value || '';
    label = label.replace(`{${index + 1}}`, replaceWith).trim();
  });
  return label.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
}

export function resolveDisplayNameOptions(
  source: DisplayNameSource,
): Array<{ format: string; label: string }> {
  return FORMATS.filter(
    ({ fields, required }) =>
      !required.some((position) => !source[fields[position - 1]]),
  )
    .map(({ format }) => ({
      format,
      label: resolveDisplayName(format, source),
    }))
    .filter(({ label }) => Boolean(label));
}

export function inferDisplayNameFormat(
  source: DisplayNameSource & { displayName?: string },
): string {
  if (!source.displayName) return '';

  const matching = resolveDisplayNameOptions(source).find(
    ({ label }) => label === source.displayName,
  );
  return matching?.format ?? '';
}
