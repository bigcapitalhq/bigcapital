// @ts-nocheck
import { Button, Intent, ProgressBar, Text } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import {
  useCreateOneClickDemo,
  useOneClickDemoSignin,
} from '@/hooks/query/oneclick-demo';
import { Box, Icon, Stack } from '@/components';
import { useJob } from '@/hooks/query';
import style from './OneClickDemoPage.module.scss';

export function OneClickDemoPageContent() {
  const {
    mutateAsync: createOneClickDemo,
    isLoading: isCreateOneClickLoading,
  } = useCreateOneClickDemo();
  const {
    mutateAsync: oneClickDemoSignIn,
    isLoading: isOneclickDemoSigningIn,
  } = useOneClickDemoSignin();

  // Job states.
  const [demoId, setDemoId] = useState<string>('');
  const [buildJobId, setBuildJobId] = useState<string>('');
  const [isJobDone, setIsJobDone] = useState<boolean>(false);

  const {
    data: { running, completed },
  } = useJob(buildJobId, {
    refetchInterval: 2000,
    enabled: !isJobDone && !!buildJobId,
  });

  useEffect(() => {
    if (completed) {
      setIsJobDone(true);
    }
  }, [completed, setIsJobDone]);

  // One the job done request sign-in using the demo id.
  useEffect(() => {
    if (isJobDone) {
      oneClickDemoSignIn({ demoId }).then((res) => {
        debugger;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJobDone]);

  const handleCreateAccountBtnClick = () => {
    createOneClickDemo({})
      .then(({ data: { data } }) => {
        setBuildJobId(data?.build_job?.job_id);
        setDemoId(data?.demo_id);
      })
      .catch(() => {});
  };
  const isLoading = running || isOneclickDemoSigningIn;

  return (
    <Box className={style.root}>
      <Box className={style.inner}>
        <Stack align={'center'} spacing={40}>
          <Icon icon="bigcapital" height={37} width={228} />

          {isLoading && (
            <Stack align={'center'} spacing={15}>
              <ProgressBar stripes value={null} className={style.progressBar} />
              {isOneclickDemoSigningIn && (
                <Text className={style.waitingText}>
                  It's signin-in to your demo account, Just a second!
                </Text>
              )}
              {running && (
                <Text className={style.waitingText}>
                  We're preparing the temporary environment for trial. It
                  typically takes a few seconds. Do not close or refresh the
                  page.
                </Text>
              )}
            </Stack>
          )}
        </Stack>

        {!isLoading && (
          <Button
            className={style.oneClickBtn}
            intent={Intent.NONE}
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
