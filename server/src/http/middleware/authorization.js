/* eslint-disable consistent-return */
const authorization = (resourceName) => (...permissions) => (req, res, next) => {
  const { user } = req;
  const onError = () => {
    res.boom.unauthorized();
  };
  user.hasPermissions(resourceName, permissions)
    .then((authorized) => {
      if (!authorized) {
        return onError();
      }
      next();
    }).catch(onError);
};

export default authorization;
