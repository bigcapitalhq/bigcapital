import { Box, Group, Icon, Stack } from '@/components';
import {
  AnchorButton,
  Button,
  Checkbox,
  Classes,
  Intent,
  Tab,
  Tabs,
  Tag,
  Text,
} from '@blueprintjs/core';
import styles from './CategorizeTransactionAside.module.scss';

interface AsideProps {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

function Aside({ title, onClose, children }: AsideProps) {
  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Box>
      <Group position="apart" className={styles.asideHeader}>
        {title}
        <Button
          aria-label="Close"
          className={Classes.DIALOG_CLOSE_BUTTON}
          icon={<Icon icon={'smallCross'} color={'#000'} />}
          minimal={true}
          onClick={handleClose}
        />
      </Group>
      <Box>{children}</Box>
    </Box>
  );
}

export function CategorizeTransactionAside() {
  return (
    <Aside title={'Categorize Bank Transaction'}>
      <Tabs large className={styles.tabs}>
        <Tab
          id="categorize"
          title="Categorize Transaction"
          panel={<CategorizeBankTransactionContent />}
        />
        <Tab
          id="matching"
          title="Matching Transaction"
          panel={<MatchingBankTransactionContent />}
        />
      </Tabs>
    </Aside>
  );
}

export function MatchingBankTransactionContent() {
  return (
    <Box>
      <Box className={styles.matchBar}>
        <Group spacing={6}>
          <h2 className={styles.matchBarTitle}>Perfect Matchines</h2>
          <Tag minimal intent={Intent.SUCCESS}>
            2
          </Tag>
        </Group>
      </Box>

      <Stack spacing={9} style={{ padding: 15 }}>
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
      </Stack>

      <Box className={styles.matchBar}>
        <Stack spacing={2}>
          <h2 className={styles.matchBarTitle}>Perfect Matches</h2>
          <Text style={{ fontSize: 12, color: '#5C7080' }}>
            Transactions up to 20 Aug 2019
          </Text>
        </Stack>
      </Box>

      <Stack spacing={9} style={{ padding: 15 }}>
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
        <MatchTransaction label={''} date={''} />
      </Stack>

      <MatchTransactionFooter />
    </Box>
  );
}

export function CategorizeBankTransactionContent() {
  return <h1>Categorizing</h1>;
}

interface MatchTransactionProps {
  label: string;
  date: string;
}

function MatchTransaction({ label, date }: MatchTransactionProps) {
  return (
    <Group className={styles.transaction} position="apart">
      <Stack spacing={3}>
        <span>Expense for $10,000</span>
        <Text style={{ fontSize: 12, color: '#5C7080' }}>
          Date: 02/02/2020{' '}
        </Text>
      </Stack>

      <Checkbox className={styles.checkbox} />
    </Group>
  );
}

function MatchTransactionFooter() {
  return (
    <Box>
      <Box className={styles.footerTotal}>
        <Group>
          <AnchorButton small minimal intent={Intent.PRIMARY}>
            Add Reconcile Transaction +
          </AnchorButton>
          <Text>Pending $10,000</Text>
        </Group>
      </Box>

      <Box className={styles.footerActions}>
        <Group>
          <Button intent={Intent.PRIMARY}>Match</Button>
          <Button>Cancel</Button>
        </Group>
      </Box>
    </Box>
  );
}
