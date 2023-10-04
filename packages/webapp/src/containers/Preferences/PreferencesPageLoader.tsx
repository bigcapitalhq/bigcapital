// @ts-nocheck
import ContentLoader from 'react-content-loader';

export default function PreferencesPageLoader(props) {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={250}
      viewBox="0 0 400 250"
      backgroundColor="#f3f3f3"
      foregroundColor="#e6e6e6"
      {...props}
    >
      <rect x="0" y="82" rx="2" ry="2" width="200" height="20" />
      <rect x="0" y="112" rx="2" ry="2" width="385" height="30" />
      <rect x="0" y="0" rx="2" ry="2" width="200" height="20" />
      <rect x="-1" y="30" rx="2" ry="2" width="385" height="30" />
      <rect x="0" y="164" rx="2" ry="2" width="200" height="20" />
      <rect x="0" y="194" rx="2" ry="2" width="385" height="30" />
    </ContentLoader>
  );
}
