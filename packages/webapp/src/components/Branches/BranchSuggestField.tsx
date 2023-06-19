// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';

import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

/**
 * branch suggest field.
 * @returns
 */
export function BranchSuggestField({
  branches,
  initialBranchId,
  selectedBranchId,
  defaultSelectText = intl.get('select_branch'),
  popoverFill = false,
  onBranchSelected,
  ...suggestProps
}) {
  const initialBranch = React.useMemo(
    () => branches.find((b) => b.id === initialBranchId),
    [initialBranchId, branches],
  );

  const [selectedBranch, setSelectedBranch] = React.useState(
    initialBranch || null,
  );

  React.useEffect(() => {
    if (typeof selectedBranchId !== 'undefined') {
      const branch = selectedBranchId
        ? branches.find((a) => a.id === selectedBranchId)
        : null;
      setSelectedBranch(branch);
    }
  }, [selectedBranchId, branches, setSelectedBranch]);

  /**
   *
   * @param {*} branch
   * @returns
   */
  const branchItemRenderer = (branch, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        // active={modifiers.active}
        disabled={modifiers.disabled}
        label={branch.code}
        key={branch.id}
        onClick={handleClick}
        text={branch.name}
      />
    );
  };

  /**
   *
   * @param {*} query
   * @param {*} branch
   * @param {*} _index
   * @param {*} exactMatch
   * @returns
   */
  const branchItemPredicate = (query, branch, _index, exactMatch) => {
    const normalizedTitle = branch.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${branch.code}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  /**
   *
   * @param {*} branch
   * @returns
   */
  const branchItemSelect = React.useCallback(
    (branch) => {
      if (branch.id) {
        setSelectedBranch({ ...branch });
        onBranchSelected && onBranchSelected(branch);
      }
    },
    [setSelectedBranch, onBranchSelected],
  );

  /**
   *
   * @param {*} inputValue
   * @returns
   */
  const branchInputValueRenderer = (inputValue) => {
    if (inputValue) {
      return inputValue.name.toString();
    }
    return '';
  };

  return (
    <Suggest
      items={branches}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={branchItemRenderer}
      itemPredicate={branchItemPredicate}
      onItemSelect={branchItemSelect}
      selectedItem={selectedBranch}
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose={true}
      fill={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      inputValueRenderer={branchInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...suggestProps}
    />
  );
}
