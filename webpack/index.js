import componentRegistry from 'foremanReact/components/componentRegistry';
import React from 'react';
import TemplatesRouter from './Router/TemplatesRouter';

const ForemanTemplates = () => <TemplatesRouter />;

componentRegistry.register({
  name: 'ForemanTemplates',
  type: ForemanTemplates,
});

export default ForemanTemplates;
