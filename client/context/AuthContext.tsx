import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from "react";

interface AuthContextType {
  guestMode: boolean;
  setGuestMode: (guest: boolean) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const GUEST_MODE_KEY = "auth_guest_mode";
const WALLET_ADDRESS_KEY = "auth_wallet_address";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guestMode, setGuestModeState] = useState<boolean>(false);
  const [walletAddress, setWalletAddressState] = useState<string | null>(null);
  const [authenticated, setAuthenticatedState] = useState<boolean>(false);
  const [isLoading, setIsLoadingState] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedGuestMode = localStorage.getItem(GUEST_MODE_KEY);
    const storedWalletAddress = localStorage.getItem(WALLET_ADDRESS_KEY);

    if (storedGuestMode !== null) {
      setGuestModeState(JSON.parse(storedGuestMode));
    }
    if (storedWalletAddress) {
      setWalletAddressState(storedWalletAddress);
    }
  }, []);

  // Save guestMode to localStorage
  useEffect(() => {
    localStorage.setItem(GUEST_MODE_KEY, JSON.stringify(guestMode));
  }, [guestMode]);

  // Save walletAddress to localStorage
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem(WALLET_ADDRESS_KEY, walletAddress);
    } else {
      localStorage.removeItem(WALLET_ADDRESS_KEY);
    }
  }, [walletAddress]);

  const setGuestMode = useCallback((guest: boolean) => {
    setGuestModeState(guest);
    // When switching to guest mode, clear wallet address
    if (guest) {
      setWalletAddressState(null);
    }
  }, []);

  const setWalletAddress = useCallback((address: string | null) => {
    setWalletAddressState(address);
    // When connecting wallet, exit guest mode
    if (address) {
      setGuestModeState(false);
    }
  }, []);

  const setAuthenticated = useCallback((auth: boolean) => {
    setAuthenticatedState(auth);
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
  }, []);

  const contextValue = useMemo(
    () => ({
      guestMode,
      setGuestMode,
      walletAddress,
      setWalletAddress,
      authenticated,
      setAuthenticated,
      isLoading,
      setIsLoading,
    }),
    [
      guestMode,
      setGuestMode,
      walletAddress,
      setWalletAddress,
      authenticated,
      setAuthenticated,
      isLoading,
      setIsLoading,
    ],
  ) as AuthContextType;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
