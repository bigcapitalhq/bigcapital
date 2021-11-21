import React from 'react';
import { Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';
import { castArray } from 'lodash';

import { FastField, useFormikContext } from 'formik';
import { whenRtl, whenLtr } from 'utils/styled-components';
import { Icon, Hint, If, Choose } from 'components';
import { useRolesFormContext } from './RolesFormProvider';

const RoleLabelCheckbox = ({ subject, label, description }) => (
  <>
    <LabelCheckbox>
      {/*------------- subject checbox ------------- */}
      <FastField name={subject} type="checkbox">
        {({ form: { setFieldValue, values }, field }) => (
          <Checkbox
            className={'block'}
            inline={true}
            label={label}
            name={subject}
          />
        )}
      </FastField>
      <p>{description}</p>
    </LabelCheckbox>
  </>
);

const AbilitiesList = ({ subject, abilities }) => {
  return (
    <AbilitieList>
      {abilities?.map(({ key, label }) => (
        <FastField name={`permissions.${subject}/${key}`} type="checkbox">
          {({ form: { setFieldValue, values }, field }) => (
            <Checkbox inline={true} label={label} {...field} />
          )}
        </FastField>
      ))}
    </AbilitieList>
  );
};

const ExtraAbilitiesList = ({ subject, extraAbilities }) => {
  return extraAbilities?.map(({ key, label }) => (
    <AbilitieList>
      <FastField name={`permissions.${subject}/${key}`} type="checkbox">
        {({ form: { setFieldValue, values }, field }) => (
          <Checkbox inline={true} label={label} {...field} />
        )}
      </FastField>
    </AbilitieList>
  ));
};

export const RolesPermissionList = () => {
  const { permissionsSchema } = useRolesFormContext();

  return (
    <GroupList>
      <BoxedGroupList>
        {permissionsSchema.map(
          ({
            subject,
            subject_label,
            description,
            abilities,
            extra_abilities,
          }) => {
            const extraAbilitiesList = Array.isArray(extra_abilities)
              ? extra_abilities
              : [];

            const abilitiesList = castArray(abilities) ? abilities : [];

            return (
              <React.Fragment>
                <RoleList>
                  <RoleLabelCheckbox
                    subject={subject}
                    label={subject_label}
                    description={description}
                  />

                  <AbilitiesList subject={subject} abilities={abilitiesList} />
                  <ExtraAbilitiesList
                    subject={subject}
                    extraAbilities={extraAbilitiesList}
                  />
                </RoleList>
              </React.Fragment>
            );
          },
        )}
      </BoxedGroupList>
    </GroupList>
  );
};

const GroupList = styled.div`
  list-style: none;
  border: 1px solid #d2dce2;
  border-radius: 6px;
  font-size: 13px;

  ul:first-child > li:last-child {
    border-bottom: 0;
    border-top: 0;
  }
`;

const BoxedGroupList = styled.ul`
  margin: 0;
  list-style: none;
`;

const RoleList = styled.li`
  display: block;
  padding: 5px 10px;
  margin: 0;
  line-height: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const LabelCheckbox = styled.label`
  > * {
    display: inline-block;
  }
  .block {
    width: 220px;
    padding: 2px 0;
    font-weight: 500;
  }
`;

const AbilitieList = styled.ul`
  list-style: none;
  /* margin-left: 12px; // 10px */
  margin: 0px 10px 0px;

  > li {
    display: inline-block;
    margin-top: 3px;
  }
`;

const AbilitiesChildList = styled.li`
  display: inline-block;
  margin-top: 3px;
`;
