import {
  fetchOrganizationSamlSettings,
  samlLoginPath,
  updateOrganizationSamlSettings,
} from '@bigcapital/sdk-ts';
import {
  Button,
  Callout,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { ApiError } from 'openapi-typescript-fetch';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { OrganizationSamlSettingsBody } from '@bigcapital/sdk-ts';
import {
  AppToaster,
  FFormGroup,
  FInputGroup,
  FSwitch,
  FTextArea,
} from '@/components';
import { useAuthOrganizationId } from '@/hooks/state/authentication';
import { useApiFetcher } from '@/hooks/useRequest';
import { useAbilityContext } from '@/hooks/utils';

export function OrganizationSamlSettings() {
  const ability = useAbilityContext();
  const organizationId = useAuthOrganizationId();

  if (!organizationId || !ability.can('manage', 'all')) return null;

  return (
    <Section data-testId="organization-saml-settings">
      <h4>{intl.get('saml.settings_title')}</h4>
      <SamlSettingsForm key={organizationId} organizationId={organizationId} />
    </Section>
  );
}

function SamlSettingsForm({ organizationId }: { organizationId: string }) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const client = useQueryClient();
  const queryKey = ['organization', organizationId, 'saml'] as const;
  const { data, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchOrganizationSamlSettings(fetcher),
    retry: false,
  });
  const { mutateAsync: save } = useMutation({
    mutationFn: (body: OrganizationSamlSettingsBody) =>
      updateOrganizationSamlSettings(fetcher, body),
    onSuccess: (saved) => client.setQueryData(queryKey, saved),
  });

  if (isError) {
    const serviceMessage =
      error instanceof ApiError && error.status === 503
        ? error.data?.message
        : undefined;
    return (
      <Callout intent={Intent.WARNING}>
        <p>
          {typeof serviceMessage === 'string'
            ? serviceMessage
            : intl.get('saml.load_failed')}
        </p>
        <Button onClick={() => refetch()}>{intl.get('saml.try_again')}</Button>
      </Callout>
    );
  }
  if (!data || data.organizationId !== organizationId)
    return <Spinner size={20} />;

  const { enabled, idpEntityId, idpSsoUrl, idpCertificate } = data;
  return (
    <>
      <p className={Classes.TEXT_MUTED}>{intl.get('saml.setup_hint')}</p>
      <FormGroup label={intl.get('saml.entity_id')} labelFor="saml-entity-id">
        <InputGroup
          id="saml-entity-id"
          dir="ltr"
          readOnly
          value={data.entityId}
        />
      </FormGroup>
      <FormGroup label={intl.get('saml.acs_url')} labelFor="saml-acs-url">
        <InputGroup id="saml-acs-url" dir="ltr" readOnly value={data.acsUrl} />
      </FormGroup>
      <Formik<OrganizationSamlSettingsBody>
        initialValues={{ enabled, idpEntityId, idpSsoUrl, idpCertificate }}
        onSubmit={async (values, { resetForm, setStatus }) => {
          const body = {
            enabled: values.enabled,
            idpEntityId: values.idpEntityId.trim(),
            idpSsoUrl: values.idpSsoUrl.trim(),
            idpCertificate: values.idpCertificate.trim(),
          };
          try {
            const saved = await save(body);
            resetForm({
              values: { ...body, idpCertificate: saved.idpCertificate },
            });
            AppToaster.show({
              intent: Intent.SUCCESS,
              message: intl.get('saml.saved'),
            });
          } catch (error) {
            const message =
              error instanceof ApiError && error.status === 400
                ? error.data?.message
                : undefined;
            setStatus(
              typeof message === 'string'
                ? message
                : intl.get('saml.save_failed'),
            );
          }
        }}
      >
        {({ values, dirty, status, isSubmitting }) => (
          <Form>
            <FSwitch
              name="enabled"
              label={intl.get('saml.enable')}
              disabled={isSubmitting}
            />
            <FFormGroup
              name="idpEntityId"
              label={intl.get('saml.idp_entity_id')}
              labelFor="idp-entity-id"
            >
              <FInputGroup
                id="idp-entity-id"
                name="idpEntityId"
                dir="ltr"
                required={values.enabled}
                disabled={isSubmitting}
              />
            </FFormGroup>
            <FFormGroup
              name="idpSsoUrl"
              label={intl.get('saml.idp_sso_url')}
              labelFor="idp-sso-url"
            >
              <FInputGroup
                id="idp-sso-url"
                name="idpSsoUrl"
                dir="ltr"
                type="url"
                pattern="https://.+"
                placeholder="https://"
                required={values.enabled}
                disabled={isSubmitting}
              />
            </FFormGroup>
            <FFormGroup
              name="idpCertificate"
              label={intl.get('saml.idp_certificate')}
              labelFor="idp-certificate"
            >
              <FTextArea
                id="idp-certificate"
                name="idpCertificate"
                dir="ltr"
                rows={5}
                fill
                spellCheck={false}
                placeholder="-----BEGIN CERTIFICATE-----"
                required={values.enabled}
                disabled={isSubmitting}
              />
            </FFormGroup>
            {status && <p role="alert">{status}</p>}
            <Button
              type="submit"
              intent={Intent.PRIMARY}
              disabled={!dirty}
              loading={isSubmitting}
            >
              {intl.get('save')}
            </Button>
          </Form>
        )}
      </Formik>
      {data.enabled && (
        <FormGroup
          label={intl.get('saml.share_url')}
          labelFor="saml-login-url"
          helperText={intl.get('saml.share_hint', { organizationId })}
          style={{ marginTop: 20 }}
        >
          <InputGroup
            id="saml-login-url"
            dir="ltr"
            readOnly
            value={new URL(samlLoginPath(organizationId), data.entityId).href}
          />
        </FormGroup>
      )}
    </>
  );
}

const Section = styled.section`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(127, 127, 127, 0.3);
  max-width: 600px;

  h4 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 500;
  }
`;
