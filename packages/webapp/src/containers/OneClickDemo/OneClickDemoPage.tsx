import { EnsureAuthNotAuthenticated } from '@/components/Guards/EnsureAuthNotAuthenticated';
import { EnsureOneClickDemoAccountEnabled } from './EnsureOneClickDemoAccountEnabled';
import { OneClickDemoBoot } from './OneClickDemoBoot';
import { OneClickDemoPageContent } from './OneClickDemoPageContent';

export default function OneClickDemoPage() {
  return (
    <EnsureAuthNotAuthenticated>
      <OneClickDemoBoot>
        <EnsureOneClickDemoAccountEnabled>
          <OneClickDemoPageContent />
        </EnsureOneClickDemoAccountEnabled>
      </OneClickDemoBoot>
    </EnsureAuthNotAuthenticated>
  );
}
