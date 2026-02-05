import { createContext, useContext } from 'react';
const CurrentGroupContext = createContext(null);
export const useCurrentGroup = () => {
    const context = useContext(CurrentGroupContext);
    if (!context)
        throw new Error('Missing context. Should be called inside a CurrentGroupProvider.');
    return context;
};
export const CurrentGroupProvider = ({ children, ...props }) => {
    return (<CurrentGroupContext.Provider value={props}>
      {children}
    </CurrentGroupContext.Provider>);
};
