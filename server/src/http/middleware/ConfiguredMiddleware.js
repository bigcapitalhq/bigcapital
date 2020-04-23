
// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
  const { Option } = req.models;
  const option = await Option.query().where('key', 'app_configured');

  if (option.getMeta('app_configured', false)) {
    return res.res(400).send({
      errors: [{ type: 'TENANT.NOT.CONFIGURED', code: 700 }],
    });
  }
  next();
};
