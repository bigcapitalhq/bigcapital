// @ts-nocheck
import { useEffect, useState } from 'react';
import { Box } from '@/components';
import { useCreateOneClickDemo } from '@/hooks/query/oneclick-demo';
import { Button } from '@blueprintjs/core';
import { useJob } from '@/hooks/query';

export default function OneClickDemoPage() {
  const { mutateAsync: createOneClickDemo } = useCreateOneClickDemo();
  const [buildJobId, setBuildJobId] = useState<string>('');

  const {
    data: { running, queued, failed, completed },
    isFetching: isJobFetching,
  } = useJob(buildJobId, {
    refetchInterval: 2000,
    enabled: !!buildJobId,
  });

  useEffect(() => {
    if (completed) {
    }
  }, [completed]);

  const handleCreateAccountBtnClick = () => {
    createOneClickDemo({})
      .then((res) => {
        setBuildJobId(res?.data?.data?.build_job?.job_id)
      })
      .catch(() => {});
  };

  return (
    <Box>
      {running && (<h1>Building...</h1>)}
      <Button onClick={handleCreateAccountBtnClick}>One-Click Create</Button>
    </Box>
  );
}
