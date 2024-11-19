import { x } from '@xstyled/emotion';
import { Stack, StackProps } from '@/components';

interface SendMailReceiptProps extends StackProps {
  children: React.ReactNode;
}

export function SendMailReceipt({
  children,
  ...restProps
}: SendMailReceiptProps) {
  return (
    <Stack
      bg="white"
      w={'100%'}
      maxWidth={'500px'}
      p={'35px 25px'}
      borderRadius={'5px'}
      boxShadow={'0 10px 15px rgba(0, 0, 0, 0.05)'}
      color={'black'}
      {...restProps}
    ></Stack>
  );
}

interface SendMailReceiptCompanyLogoProps extends StackProps {
  src: string;
}

function SendMailReceiptCompanyLogo({
  src,
  ...props
}: SendMailReceiptCompanyLogoProps) {
  return (
    <x.div
      h="90px"
      w="90px"
      mx="auto"
      borderRadius="3px"
      backgroundRepeat="no-repeat"
      backgroundPosition="center center"
      backgroundSize="contain"
      backgroundImage={`url("${src}")`}
      {...props}
    ></x.div>
  );
}

SendMailReceipt.CompanyLogo = SendMailReceiptCompanyLogo;
