import React, { useContext, useEffect, useState } from 'react';
import { compose } from 'redux';
import {
  useForemanLocation,
  useForemanOrganization,
} from 'foremanReact/Root/Context/ForemanContext';
import { translate as __ } from 'foremanReact/common/I18n';
import { APIActions } from 'foremanReact/redux/API';
import { deepPropsToCamelCase } from 'foremanReact/common/helpers';

import {
  Form,
  FormGroup,
  ActionGroup,
  Button,
  Radio,
} from '@patternfly/react-core';
import { TemplateSyncContext } from '../../../TemplateSyncContext';
import SyncSettingsFields from '../SyncSettingFields';
import { SYNC_RESULT_URL, SYNC_SETTINGS_FORM_SUBMIT } from '../../../../consts';

const NewTemplateSyncForm = () => {
  const {
    apiResponse,
    dispatch,
    setReceivedTemplates,
    history,
    setIsTemplatesLoading,
    isTemplatesLoading,
  } = useContext(TemplateSyncContext);
  const { apiUrls, settings, userPermissions } = apiResponse;

  const allowedSyncType = (currentUserPermissions, radioAttrs) =>
    currentUserPermissions[radioAttrs.permission];

  const radioButtons = [
    { label: __('Import'), value: 'import', permission: 'import' },
    { label: __('Export'), value: 'export', permission: 'export' },
  ];

  const [syncType, setSyncType] = useState(
    radioButtons.find(radioAttrs =>
      allowedSyncType(userPermissions, radioAttrs)
    ).value
  );

  const updateSyncType = event => {
    setSyncType(event.target.value);
  };

  const permitRadioButtons = buttons =>
    buttons.filter(buttonAttrs =>
      allowedSyncType(userPermissions, buttonAttrs)
    );

  const initRadioButtons = templateSyncType =>
    permitRadioButtons(radioButtons).map(buttonAttrs => ({
      get checked() {
        return buttonAttrs.value === templateSyncType;
      },
      onChange: updateSyncType,
      ...buttonAttrs,
    }));

  const addTaxParams = (key, currentTax) => params => {
    if (currentTax && currentTax.id) {
      return { ...params, [key]: [currentTax.id] };
    }
    return params;
  };

  const addOrgParams = addTaxParams(
    'organization_ids',
    useForemanOrganization()
  );
  const addLocParams = addTaxParams('location_ids', useForemanLocation());
  const settingsAry = syncType === 'import' ? settings.import : settings.export;

  const [values, setValues] = useState(settingsAry);

  const transformValues = () =>
    values.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

  const handleSubmit = () => {
    const url = syncType === 'import' ? apiUrls.importUrl : apiUrls.exportUrl;
    setIsTemplatesLoading(true);
    return dispatch(
      APIActions.post({
        key: SYNC_SETTINGS_FORM_SUBMIT,
        url,
        params: {
          ...compose(addLocParams, addOrgParams)(transformValues()),
        },
        handleSuccess: response => {
          setReceivedTemplates(deepPropsToCamelCase(response.data));
          history.replace({ pathname: `/${SYNC_RESULT_URL}` });
        },
        successToast: () => __('Data was successfully imported.'),
        errorToast: ({ response }) =>
          // eslint-disable-next-line camelcase
          response?.data?.error?.full_messages?.[0] || response,
      })
    );
  };

  useEffect(() => {
    setValues(settingsAry);
  }, [settingsAry, syncType]);

  const handleChange = (index, value) => {
    const newValue = {
      ...values[index],
      value,
    };
    setValues(items => items.map((item, i) => (i === index ? newValue : item)));
  };

  return (
    <Form isHorizontal id="sync-form">
      <FormGroup isInline hasNoPaddingTop>
        {initRadioButtons(syncType).map(radio => (
          <Radio
            id={radio.value}
            key={radio.value}
            label={radio.label}
            isChecked={radio.value === syncType}
            onChange={() => setSyncType(radio.value)}
          />
        ))}
      </FormGroup>
      {settings.import.length > 0 && settings.export.length > 0 && (
        <SyncSettingsFields
          handleChange={handleChange}
          values={values}
          syncType={syncType}
          submit={handleSubmit}
          original={settingsAry}
        />
      )}
      <ActionGroup>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={isTemplatesLoading}
          isDisabled={isTemplatesLoading}
        >
          {__('Submit')}
        </Button>
        <Button variant="link">{__('Cancel')}</Button>
      </ActionGroup>
    </Form>
  );
};

export default NewTemplateSyncForm;
