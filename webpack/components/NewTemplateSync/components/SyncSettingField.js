import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { RedoIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  TextInput,
  Checkbox,
  Button,
  Tooltip,
  Grid,
  GridItem,
  FormSelectOption,
  FormSelect,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { validateRepository } from './NewTemplateSyncForm/NewTemplateSyncFormHelpers';
import { TemplateSyncContext } from '../../TemplateSyncContext';

const SyncSettingField = ({
  setting,
  disabled,
  handleChange,
  index,
  resetValue,
}) => {
  const [validated, setValidated] = useState('');
  const { apiResponse } = useContext(TemplateSyncContext);

  useEffect(() => {
    if (setting.name === 'repo')
      setValidated(
        validateRepository(setting.value, apiResponse.validationData.repo)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localHandler = (_event, value) => {
    handleChange(index, value);
    if (setting.name === 'repo') {
      setValidated(validateRepository(value, apiResponse.validationData.repo));
    }
  };

  const props = {
    isDisabled: disabled,
    isRequired: setting.required,
    id: setting.fullName,
    ouiaId: setting.fullName,
    key: `input-${setting.fullName}`,
    value: setting.value,
    onChange: localHandler,
    validated,
  };

  const inputField = () => {
    if (setting.settingsType === 'boolean') {
      return <Checkbox {...props} isChecked={setting.value} />;
    } else if (setting.selection.length !== 0) {
      return (
        <FormSelect {...props} className="without_select2">
          {setting.selection.map((option, optionIndex) => (
            <FormSelectOption
              key={optionIndex}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      );
    }
    return (
      <>
        <TextInput {...props} />
        {validated === 'error' && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                icon={<ExclamationCircleIcon />}
                variant={validated}
              >
                {__('Invalid URL')}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </>
    );
  };

  return (
    <Grid>
      <GridItem span={8}>{inputField()}</GridItem>
      <GridItem span={2}>
        <Tooltip content={sprintf(__('%s'), setting.description)}>
          <Button
            onClick={() => handleChange(index, resetValue)}
            variant="control"
          >
            <RedoIcon />
          </Button>
        </Tooltip>
      </GridItem>
    </Grid>
  );
};

SyncSettingField.propTypes = {
  setting: PropTypes.object.isRequired,
  resetValue: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default SyncSettingField;
