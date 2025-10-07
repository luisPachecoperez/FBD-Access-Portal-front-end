export interface GoogleAccounts {
  id: {
    initialize: (options: unknown) => void;
    renderButton: (element: HTMLElement, options: unknown) => void;
    revoke?: (email: string, callback: () => void) => void;
    cancel?: () => void;
  };
}

export interface GoogleWindow extends Window {
  google?: {
    accounts: GoogleAccounts;
  };
}
