export const mapperPermissionSchema = (data) => {
  return [data].map(({ permissions }) =>
    Object.keys(permissions).map((item) => {
      const [value, key] = item.split('/');
      return {
        subject: value,
        ability: key,
        value: permissions[item],
      };
    }),
  );
};
