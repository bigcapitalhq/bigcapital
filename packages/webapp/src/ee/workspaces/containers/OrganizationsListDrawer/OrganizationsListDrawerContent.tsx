// @ts-nocheck
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import { debounce } from 'lodash';
import * as R from 'ramda';
import React, { useState, useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
import { OrganizationsListDrawerHeader } from './OrganizationsListDrawerHeader';
import OrganizationsListTable from './OrganizationsListTable';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import {
  useWorkspaces,
  useSetDefaultWorkspace,
} from '@/ee/workspaces/hooks/query';
import { useAuthOrganizationId } from '@/hooks/state';

import '@/ee/workspaces/style/containers/Workspaces/OrganizationsListDrawer.scss';

const organizationsDrawerSearchFormGroupCss = css`
  margin: 0 !important;
  flex: 1;
  max-width: 200px;
  min-width: 160px;
`;

const organizationsDrawerInputSearchCss = css`
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #fff;
  box-shadow: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  .bp4-icon {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus,
  &.bp4-active {
    border-color: rgba(17, 131, 218, 0.55);
    box-shadow: 0 0 0 1px rgba(17, 131, 218, 0.35);
  }
`;

const organizationsDrawerCreateBtnCss = css`
  flex-shrink: 0 !important;
  color: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;

  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.06) !important;
  }
`;

/**
 * Organizations list drawer content.
 */
function OrganizationsListDrawerContentRoot({ closeDrawer, openDrawer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const activeOrganizationId = useAuthOrganizationId();
  const setDefaultWorkspace = useSetDefaultWorkspace();
  const { data: workspaces, isLoading } = useWorkspaces({
    includeInactive: true,
  });

  const isCurrentOrgDefault = useMemo(() => {
    return (
      workspaces?.find((w) => w.organizationId === activeOrganizationId)
        ?.isDefault ?? false
    );
  }, [workspaces, activeOrganizationId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 200),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  const filteredWorkspaces = useMemo(() => {
    if (!debouncedSearch) return workspaces || [];
    const query = debouncedSearch.toLowerCase();
    return (workspaces || []).filter((workspace) =>
      workspace.metadata?.name?.toLowerCase().includes(query),
    );
  }, [workspaces, debouncedSearch]);

  const handleClose = () => {
    closeDrawer(DRAWERS.ORGANIZATIONS_LIST);
  };

  const handleCreateWorkspace = () => {
    closeDrawer(DRAWERS.ORGANIZATIONS_LIST);
    setTimeout(() => {
      openDrawer(DRAWERS.CREATE_WORKSPACE);
    }, 300);
  };

  return (
    <x.div display="flex" flexDirection="column" height="100%" minHeight={0}>
      <OrganizationsListDrawerHeader
        isCurrentOrgDefault={isCurrentOrgDefault}
        activeOrganizationId={activeOrganizationId}
        onSetDefaultWorkspace={(organizationId) =>
          setDefaultWorkspace.mutate({ organizationId })
        }
        onClose={handleClose}
      />

      <x.div
        flex={1}
        overflow="auto"
        minHeight={0}
        w={'100%'}
        maxWidth={'1000px'}
        mx="auto"
        pt={10}
      >
        <x.div
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          gap="16px"
          mb="16px"
        >
          <x.h2
            m={0}
            fontSize="20px"
            fontWeight={400}
            color="#fff"
            letterSpacing="-0.02em"
          >
            {intl.get('workspaces.organizations_list_count_title', {
              count: filteredWorkspaces.length,
            })}
          </x.h2>
          <x.div
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            gap="10px"
            flex={1}
            justifyContent="flex-end"
            minWidth={0}
          >
            <FormGroup
              label={null}
              className={organizationsDrawerSearchFormGroupCss}
            >
              <InputGroup
                leftIcon="search"
                placeholder={intl.get('workspaces.search_workspaces_short', {
                  fallback: 'Search...',
                })}
                value={searchQuery}
                onChange={handleSearchChange}
                className={organizationsDrawerInputSearchCss}
              />
            </FormGroup>
          </x.div>
        </x.div>

        <OrganizationsListTable
          workspaces={filteredWorkspaces}
          isLoading={isLoading}
          onClose={handleClose}
        />
      </x.div>
    </x.div>
  );
}

export const OrganizationsListDrawerContent = R.compose(withDrawerActions)(
  OrganizationsListDrawerContentRoot,
);
