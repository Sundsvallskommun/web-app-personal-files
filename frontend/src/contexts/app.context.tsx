import { createContext, useContext, useState } from 'react';

export interface AppContextInterface {
  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>({
  isCookieConsentOpen: true,
  setIsCookieConsentOpen: () => {},
  setDefaults: () => {},
});

export function AppWrapper({ children }: React.PropsWithChildren<{}>) {
  const contextDefaults = {
    isCookieConsentOpen: true,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
  };
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        setDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
