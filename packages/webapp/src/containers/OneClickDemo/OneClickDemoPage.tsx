import { EnsureOneClickDemoAccountEnabled } from './EnsureOneClickDemoAccountEnabled';
import { OneClickDemoBoot } from './OneClickDemoBoot';
import { OneClickDemoPageContent } from './OneClickDemoPageContent';
import { EnsureAuthNotAuthenticated } from '@/components/Guards/EnsureAuthNotAuthenticated';

export function OneClickDemoPage() {
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
