interface LemonSqueezyEvent {
  event: string;
  data?: unknown;
}

interface LemonSqueezyConfig {
  eventHandler: (event: LemonSqueezyEvent) => void;
}

interface LemonSqueezy {
  Setup: (config: LemonSqueezyConfig) => void;
  Url: {
    Open: (url?: string) => void;
  };
}

interface Window {
  LemonSqueezy?: LemonSqueezy;
}
