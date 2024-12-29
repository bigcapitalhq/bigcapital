import { Container, Section } from '@react-email/components';
import { CSSProperties } from 'react';

interface EmailTemplateProps {
  children: React.ReactNode;
}
export function EmailTemplate({ children }: EmailTemplateProps) {
  return <Container style={containerStyle}>{children}</Container>;
}

EmailTemplate.CompanyLogo = ({ src }: { src: string }) => {
  return (
    <Section style={logoSectionStyle}>
      <div
        style={{
          ...companyLogoStyle,
          backgroundImage: `url("${src}")`,
        }}
      ></div>
    </Section>
  );
};

const containerStyle: CSSProperties = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '500px',
  padding: '30px 20px',
  color: '#000',
};

const companyLogoStyle = {
  height: 90,
  width: 90,
  borderRadius: '3px',
  marginLeft: 'auto',
  marginRight: 'auto',
  textIndent: '-999999px',
  overflow: 'hidden',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'contain',
};

const logoSectionStyle = {
  marginBottom: '15px',
};
