// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { Button, Intent, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { x } from '@xstyled/emotion';
import { FormattedMessage as T, DrawerBody, DrawerActionsBar } from '@/components';
import { useBulkCreateInviteUsers, useRoles } from '@/hooks/query';
import { useIsDarkMode } from '@/hooks/useDarkMode';
import * as Yup from 'yup';

interface InviteRow {
  id: string;
  email: string;
  roleId: number | '';
}

interface InviteUsersStepProps {
  organizationId?: string;
  onComplete: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const emailValidationSchema = Yup.string()
  .email('Invalid email format')
  .required('Email is required');

export default function InviteUsersStep({ organizationId, onComplete }: InviteUsersStepProps) {
  const isDarkMode = useIsDarkMode();
  const { mutateAsync: bulkInviteMutate, isLoading: isSubmitting } = useBulkCreateInviteUsers();
  const { data: roles, isLoading: isRolesLoading } = useRoles();

  const defaultRoleId = roles?.find(r => r.slug === 'standard')?.id || roles?.[0]?.id || '';

  const [invites, setInvites] = useState<InviteRow[]>([
    { id: generateId(), email: '', roleId: defaultRoleId },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addInviteRow = () => {
    setInvites(prev => [...prev, { id: generateId(), email: '', roleId: defaultRoleId }]);
  };

  const removeInviteRow = (id: string) => {
    setInvites(prev => {
      if (prev.length === 1) {
        return [{ id: generateId(), email: '', roleId: defaultRoleId }];
      }
      return prev.filter(invite => invite.id !== id);
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateInviteRow = (id: string, field: keyof InviteRow, value: string | number) => {
    setInvites(prev =>
      prev.map(invite =>
        invite.id === id ? { ...invite, [field]: value } : invite
      )
    );
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateInvites = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emails: string[] = [];
    let hasValidInvite = false;

    invites.forEach(invite => {
      if (!invite.email.trim() && !invite.roleId) {
        return;
      }

      if (invite.email.trim()) {
        hasValidInvite = true;

        try {
          emailValidationSchema.validateSync(invite.email);
        } catch (error) {
          newErrors[invite.id] = error.message;
        }

        if (emails.includes(invite.email.toLowerCase())) {
          newErrors[invite.id] = newErrors[invite.id] || 'Duplicate email';
        }
        emails.push(invite.email.toLowerCase());
      }

      if (!invite.roleId) {
        newErrors[invite.id] = newErrors[invite.id] || 'Role is required';
      }
    });

    setErrors(newErrors);
    return hasValidInvite && Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInvites()) {
      return;
    }

    const validInvites = invites
      .filter(invite => invite.email.trim() && invite.roleId)
      .map(invite => ({
        email: invite.email.trim(),
        roleId: Number(invite.roleId),
      }));

    if (validInvites.length === 0) {
      onComplete();
      return;
    }

    try {
      await bulkInviteMutate({ invites: validInvites });
      onComplete();
    } catch (error) {
      console.error('Failed to send invites:', error);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      <DrawerBody>
        <x.div maxWidth="600px" w="100%" mx="auto" pt="30px" pb="20px" px="25px">
          <x.h3
            color={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#868f9f'}
            mb="2rem"
            fontWeight={600}
          >
            <T id={'create_workspace.invite.title'} />
          </x.h3>

          <x.p
            fontSize={14}
            mb={4}
            color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#2e4266'}
          >
            <T id={'create_workspace.invite.description'} />
          </x.p>

          <x.div display="flex" flexDirection="column" gap={3}>
            {invites.map((invite, index) => (
              <x.div
                key={invite.id}
                display="flex"
                alignItems="flex-start"
                gap={2}
              >
                <x.div flex={1}>
                  <InputGroup
                    value={invite.email}
                    onChange={(e) => updateInviteRow(invite.id, 'email', e.target.value)}
                    placeholder="Email address"
                    intent={errors[invite.id] ? Intent.DANGER : Intent.NONE}
                  />
                  {errors[invite.id] && (
                    <x.div color="red.500" fontSize={12} mt={1}>
                      {errors[invite.id]}
                    </x.div>
                  )}
                </x.div>

                <x.div width="180px">
                  <Select
                    items={roles || []}
                    itemRenderer={(role, { handleClick, modifiers }) => (
                      <MenuItem
                        key={role.id}
                        text={role.name}
                        onClick={handleClick}
                        active={modifiers.active}
                        disabled={modifiers.disabled}
                      />
                    )}
                    onItemSelect={(role) => updateInviteRow(invite.id, 'roleId', role.id)}
                    popoverProps={{ minimal: true }}
                    disabled={isRolesLoading}
                  >
                    <Button
                      text={roles?.find(r => r.id === invite.roleId)?.name || 'Select role'}
                      rightIcon="chevron-down"
                      fill
                      intent={errors[invite.id] && !invite.roleId ? Intent.DANGER : Intent.NONE}
                    />
                  </Select>
                </x.div>

                <Button
                  icon="cross"
                  minimal
                  onClick={() => removeInviteRow(invite.id)}
                  style={{ marginTop: '4px' }}
                />
              </x.div>
            ))}
          </x.div>

          <x.div mt={4}>
            <Button
              icon="plus"
              minimal
              onClick={addInviteRow}
              disabled={isRolesLoading}
            >
              <T id={'create_workspace.invite.add_another'} />
            </Button>
          </x.div>
        </x.div>
      </DrawerBody>

      <DrawerActionsBar>
        <x.div
          display="flex"
          justifyContent="flex-end"
          gap="10px"
          w="100%"
          maxWidth="600px"
          mx="auto"
          px="25px"
        >
          <Button onClick={handleSkip}>
            <T id={'skip'} />
          </Button>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            <T id={'create_workspace.invite.send_invites'} />
          </Button>
        </x.div>
      </DrawerActionsBar>
    </>
  );
}
