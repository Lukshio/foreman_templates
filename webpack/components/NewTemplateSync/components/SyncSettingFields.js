import React from 'react';
import { FormGroup, Popover, Button } from '@patternfly/react-core';
import { upperFirst } from 'lodash';
import PropTypes from 'prop-types';
import { HelpIcon } from '@patternfly/react-icons';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import SyncSettingField from './SyncSettingField';

const SyncSettingsFields = ({
  syncType,
  handleChange,
  values,
  original,
  formProps: { isSubmitting },
}) => {
  const modifyDescription = (setting, type) => {
    if (setting.description) {
      let split = setting.description.split('. ');
      if (setting.name === 'repo' && type !== 'export') {
        split = split.slice(0, split.length - 1);
      }

      split = split.join('.<br>');
      return { ...setting, description: split };
    }
    return setting;
  };

  const specializeDescription = (setting, type) => ({
    ...setting,
    description: upperFirst(
      setting.description.replace(/import\/export/i, type)
    ),
  });

  const proxyPolicySelected =
    values.find(s => s.id === 'template_sync_http_proxy_policy')?.value ===
    'selected';

  return (
    <React.Fragment>
      {values
        .filter(
          setting =>
            setting.id !== 'template_sync_http_proxy_id' || proxyPolicySelected
        )
        .map(setting => modifyDescription(setting, syncType))
        .map(setting => specializeDescription(setting, syncType))
        .map((setting, i) => (
          <FormGroup
            label={sprintf(__('%s'), setting.fullName)}
            key={i}
            labelIcon={
              <Popover bodyContent={sprintf(__('%s'), setting.description)}>
                <Button variant="plain" ouiaId={`reset-${setting.fullName}`}>
                  <HelpIcon />
                </Button>
              </Popover>
            }
          >
            <SyncSettingField
              setting={setting}
              disabled={isSubmitting || false}
              resetValue={original[i]?.value}
              handleChange={handleChange}
              index={i}
            />
          </FormGroup>
        ))}
    </React.Fragment>
  );
};

SyncSettingsFields.propTypes = {
  formProps: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  original: PropTypes.array.isRequired,
  syncType: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
};

SyncSettingsFields.defaultProps = {
  formProps: {},
};

export default SyncSettingsFields;
