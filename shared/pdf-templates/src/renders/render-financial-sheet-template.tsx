import {
  FinancialSheetTemplate,
  FinancialSheetTemplateProps,
} from '../components/FinancialSheetTemplate';
import { renderSSR } from './render-ssr';

export const renderFinancialSheetTemplateHtml = (
  props: FinancialSheetTemplateProps
) => {
  return renderSSR(
    <FinancialSheetTemplate {...props} />
  );
};

