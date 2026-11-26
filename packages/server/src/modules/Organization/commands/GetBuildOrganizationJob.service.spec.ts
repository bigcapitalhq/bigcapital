import { HttpStatus } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Organization.constants';
import { GetBuildOrganizationBuildJob } from './GetBuildOrganizationJob.service';

interface IMakeServiceOptions {
  job?: Record<string, any> | null;
  tenant?: Record<string, any> | null;
  membership?: Record<string, any> | null;
}

const makeJob = (overrides: Record<string, any> = {}) => ({
  id: '123',
  data: { organizationId: 'org-1', userId: 1 },
  progress: 50,
  getState: jest.fn().mockResolvedValue('active'),
  ...overrides,
});

const createService = ({
  job = makeJob(),
  tenant = { id: 10, organizationId: 'org-1' },
  membership = { userId: 1, tenantId: 10, role: 'owner' },
}: IMakeServiceOptions = {}) => {
  const queue = {
    getJob: jest.fn().mockResolvedValue(job),
  };
  const tenantModel = {
    query: jest.fn(() => ({
      findOne: jest.fn().mockResolvedValue(tenant),
    })),
  };
  const userTenantModel = {
    query: jest.fn(() => ({
      findOne: jest.fn().mockResolvedValue(membership),
    })),
  };
  const service = new GetBuildOrganizationBuildJob(
    queue as any,
    userTenantModel as any,
    tenantModel as any,
  );

  return { service, queue, tenantModel, userTenantModel };
};

describe('GetBuildOrganizationBuildJob', () => {
  it('returns the build job details for a member of the organization', async () => {
    const { service, tenantModel, userTenantModel } = createService();

    const details = await service.getJobDetails('123', 1);

    expect(details).toEqual({
      id: '123',
      state: 'active',
      progress: 50,
      isCompleted: false,
      isRunning: true,
      isWaiting: false,
      isFailed: false,
    });
    expect(tenantModel.query).toHaveBeenCalled();
    expect(userTenantModel.query).toHaveBeenCalled();
  });

  it('throws a not found error when the user is not a member of the organization', async () => {
    const { service } = createService({ membership: null });

    await expect(service.getJobDetails('123', 2)).rejects.toMatchObject({
      errorType: ERRORS.JOB_NOT_FOUND,
    });
  });

  it('throws a not found error when the job organization does not exist', async () => {
    const { service } = createService({ tenant: null });

    await expect(service.getJobDetails('123', 1)).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it('throws a not found error when the job does not exist', async () => {
    const { service, tenantModel } = createService({ job: null });

    await expect(service.getJobDetails('999', 1)).rejects.toMatchObject({
      errorType: ERRORS.JOB_NOT_FOUND,
    });
    expect(tenantModel.query).not.toHaveBeenCalled();
  });

  it('throws a not found error when the job has no organization id', async () => {
    const { service } = createService({
      job: makeJob({ data: { userId: 1 } }),
    });

    await expect(service.getJobDetails('123', 1)).rejects.toMatchObject({
      errorType: ERRORS.JOB_NOT_FOUND,
    });
  });

  it('responds with a 404 status to avoid leaking the job existence', async () => {
    const { service } = createService({ membership: null });

    await expect(service.getJobDetails('123', 2)).rejects.toMatchObject({
      httpStatus: HttpStatus.NOT_FOUND,
    });
  });
});
