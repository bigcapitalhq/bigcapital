// @ts-nocheck
import { Button, Intent, ProgressBar, Spinner, Text } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import {
  useCreateOneClickDemo,
  useOneClickDemoSignin,
} from '@/hooks/query/oneclick-demo';
import { Box, Icon, Stack } from '@/components';
import { useJob } from '@/hooks/query';
import style from './OneClickDemoPage.module.scss';

export default function OneClickDemoPage() {
  const {
    mutateAsync: createOneClickDemo,
    isLoading: isCreateOneClickLoading,
  } = useCreateOneClickDemo();
  const { mutateAsync: oneClickDemoSignIn } = useOneClickDemoSignin();
  const [buildJobId, setBuildJobId] = useState<string>('');
  const [demoId, setDemoId] = useState<string>('');

  // Job done state.
  const [isJobDone, setIsJobDone] = useState<boolean>(false);

  const {
    data: { running, queued, failed, completed },
    isFetching: isJobFetching,
  } = useJob(buildJobId, {
    refetchInterval: 2000,
    enabled: !isJobDone && !!buildJobId,
    onSuccess: (res) => {
      if (res.completed) {
        oneClickDemoSignIn({ demoId }).then((res) => {
          debugger;
        });
      }
    },
  });

  useEffect(() => {
    if (completed) {
      setIsJobDone(true);
    }
  }, [completed, setIsJobDone]);

  const handleCreateAccountBtnClick = () => {
    createOneClickDemo({})
      .then((res) => {
        setBuildJobId(res?.data?.data?.build_job?.job_id);
        setDemoId(res?.data?.data?.demo_id);
      })
      .catch(() => {});
  };
  const isLoading = running;

  return (
    <Box className={style.root}>
      <Box className={style.inner}>
        <Stack align={'center'} spacing={40}>
          <Icon icon="bigcapital" height={37} width={228} />

          {isLoading && (
            <Stack align={'center'} spacing={15}>
              <ProgressBar stripes value={null} className={style.progressBar} />
              <Text className={style.waitingText}>
                We're preparing temporary environment for trial, It typically
                take few seconds. Do not close or refresh the page.
              </Text>
            </Stack>
          )}
        </Stack>

        {!isLoading && (
          <Button
            className={style.oneClickBtn}
            intent={Intent.PRIMARY}
            onClick={handleCreateAccountBtnClick}
            loading={isCreateOneClickLoading}
          >
            Create Demo Account
          </Button>
        )}
      </Box>
    </Box>
  );
}
