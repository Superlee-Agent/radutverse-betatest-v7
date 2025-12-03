import { useCallback, useContext, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { AuthContext } from "@/context/AuthContext";
import { truncateAddress } from "@/lib/ip-assistant/utils";

export const useAuthActions = () => {
  const authContext = useContext(AuthContext);
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  // Get primary wallet address
  const walletAddress = useMemo(() => {
    if (authenticated && wallets && wallets.length > 0) {
      const walletWithAddress = wallets.find((wallet) => wallet.address);
      return walletWithAddress?.address || null;
    }
    return null;
  }, [authenticated, wallets]);

  // Handle wallet button click
  const handleWalletClick = useCallback(() => {
    if (!ready) return;
    if (authenticated) {
      logout();
      authContext?.setAuthenticated(false);
      authContext?.setWalletAddress(null);
    } else {
      void login({ loginMethods: ["wallet"] });
    }
  }, [ready, authenticated, login, logout, authContext]);

  // Handle guest mode toggle
  const handleToggleGuest = useCallback(() => {
    authContext?.setGuestMode(!authContext?.guestMode);
  }, [authContext]);

  // Wallet button text
  const walletButtonText = useMemo(() => {
    return authenticated
      ? "Disconnect"
      : ready
        ? "Connect Wallet"
        : "Loading Wallet";
  }, [authenticated, ready]);

  // Wallet button disabled state
  const walletButtonDisabled = useMemo(() => {
    return !ready && !authenticated;
  }, [ready, authenticated]);

  // Connected address label
  const connectedAddressLabel = useMemo(() => {
    return authenticated && walletAddress
      ? truncateAddress(walletAddress)
      : null;
  }, [authenticated, walletAddress]);

  return {
    guestMode: authContext?.guestMode ?? false,
    authenticated,
    ready,
    walletAddress,
    walletButtonText,
    walletButtonDisabled,
    connectedAddressLabel,
    handleWalletClick,
    handleToggleGuest,
  };
};
