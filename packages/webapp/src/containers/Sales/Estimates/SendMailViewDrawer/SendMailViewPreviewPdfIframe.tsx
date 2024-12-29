import { css } from '@emotion/css';
import clsx from 'classnames';

interface SendMailViewPreviewPdfIframeProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {}

export const SendMailViewPreviewPdfIframe = ({
  ...props
}: SendMailViewPreviewPdfIframeProps) => {
  return (
    <iframe
      title={'invoice-pdf-preview'}
      {...props}
      className={clsx(
        css`
          height: 1123px;
          width: 794px;
          border: 0;
          border-radius: 5px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
          margin: 0 auto;
        `,
        props.className,
      )}
    />
  );
};
