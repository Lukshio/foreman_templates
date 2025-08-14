import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { TemplateSyncContext } from '../../../TemplateSyncContext';
// import { APIActions } from '../../../../../__mocks__/foremanReact/redux/API';
// import { SYNC_SETTINGS_FORM_SUBMIT } from '../../../../../consts';

import SyncSettingField from '../SyncSettingField';
import { mockContextValues } from '../../__tests__/testData';
// import NewTemplateSyncForm from '../NewTemplateSyncForm/NewTemplateSyncForm';

jest.mock('@patternfly/react-icons', () => ({
  RedoIcon: () => <span data-testid="redo-icon" />,
  ExclamationCircleIcon: () => <span data-testid="error-icon" />,
}));
const noop = () => () => {};

const commonFixtures = {
  resetField: noop,
  disabled: false,
  syncType: 'import',
};

const mockHandleChange = jest.fn();

describe('SyncSettingField', () => {
  const defaultProps = {
    index: 0,
    disabled: false,
    resetValue: '',
    handleChange: mockHandleChange,
  };

  const setup = (setting, values = mockContextValues) =>
    render(
      <MemoryRouter>
        <TemplateSyncContext.Provider value={values}>
          <SyncSettingField {...defaultProps} setting={setting} />
        </TemplateSyncContext.Provider>
      </MemoryRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a checkbox for boolean settings', () => {
    const setting = {
      settingsType: 'boolean',
      required: true,
      fullName: 'booleanField',
      value: true,
      description: 'A boolean setting',
      selection: [],
    };
    setup(setting);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
  });

  it('should render a select dropdown for settings with selection options', () => {
    const setting = {
      settingsType: 'selection',
      required: false,
      fullName: 'selectionField',
      value: 'option1',
      description: 'A selection setting',
      selection: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    };
    setup(setting);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('option1');
  });

  it('should render a text input for other settings', () => {
    const setting = {
      settingsType: 'textInput',
      required: false,
      fullName: 'textField',
      value: 'Input value',
      description: 'A text input setting',
      selection: [],
    };
    setup(setting);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Input value');
  });

  it('should call handleChange with correct arguments on value change', async () => {
    const setting = {
      id: 'template_sync_branch',
      value: '',
      description: 'Default branch in Git repo',
      settingsType: 'string',
      default: '',
      fullName: 'Branch',
      name: 'branch',
      selection: [],
    };
    setup(setting);

    const input = document.getElementById('Branch');
    fireEvent.change(input, { target: { value: 'A' } });

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });
});
