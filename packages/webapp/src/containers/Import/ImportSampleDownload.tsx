// @ts-nocheck
import { AppToaster, Box, Group } from '@/components';
import {
  Button,
  Intent,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import styles from './ImportSampleDownload.module.scss';
import { useSampleSheetImport } from '@/hooks/query/import';
import { useImportFileContext } from './ImportFileProvider';

export function ImportSampleDownload() {
  const { resource, sampleFileName, exampleTitle, exampleDescription } =
    useImportFileContext();
  const { mutateAsync: downloadSample } = useSampleSheetImport();

  // Handle download button click.
  const handleDownloadBtnClick = (format) => () => {
    downloadSample({
      filename: sampleFileName || `sample-${resource}`,
      resource,
      format: format,
    })
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The sample sheet has been downloaded successfully.',
        });
      })
      .catch((error) => {});
  };

  return (
    <Group className={styles.root} noWrap>
      <Box>
        <h3 className={styles.title}>{exampleTitle}</h3>
        <p className={styles.description}>{exampleDescription}</p>
      </Box>

      <Box className={styles.buttonWrap}>
        <Popover
          content={
            <Menu>
              <MenuItem onClick={handleDownloadBtnClick('csv')} text={'CSV'} />
              <MenuItem
                onClick={handleDownloadBtnClick('xlsx')}
                text={'XLSX'}
              />
            </Menu>
          }
          interactionKind={PopoverInteractionKind.CLICK}
          placement="bottom-start"
          minimal
        >
          <Button minimal outlined>
            Download File
          </Button>
        </Popover>
      </Box>
    </Group>
  );
}
