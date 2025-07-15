import React, { useContext } from 'react';
import { Skeleton } from '@patternfly/react-core';
import PermissionDenied from '../components/PermissionDenied';
import { TemplateSyncContext } from '../components/TemplateSyncContext';

const isAllowed = perms => !!(perms?.import || perms?.export);

const protectedComponent = Wrapped => props => {
  const { apiResponse } = useContext(TemplateSyncContext);
  const perms = apiResponse?.userPermissions;

  if (!perms) return <Skeleton height="100%" screenreaderText="Loading ..." />;

  return isAllowed(perms) ? (
    <Wrapped {...props} />
  ) : (
    <PermissionDenied {...props} />
  );
};

export default protectedComponent;
