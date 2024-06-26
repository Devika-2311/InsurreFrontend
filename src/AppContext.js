import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [suserId, setSuserId] = useState(null);
  const [suserPolicyId, setSuserPolicyId] = useState(null);

  const contextValue = useMemo(() => ({
    suserId,
    setSuserId,
    suserPolicyId,
    setSuserPolicyId
  }), [suserId, suserPolicyId]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};
