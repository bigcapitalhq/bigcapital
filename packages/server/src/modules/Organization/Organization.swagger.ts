export const OrganizationBuildResponseExample = {
  type: 'success',
  code: 'ORGANIZATION.DATABASE.INITIALIZED',
  message: 'The organization database has been initialized.',
  data: {
    job_id: '1',
  },
};

export const OrganizationBuiltResponseExample = {
  errors: [
    {
      statusCode: 500,
      type: 'TENANT_ALREADY_BUILT',
      message: null,
    },
  ],
};
