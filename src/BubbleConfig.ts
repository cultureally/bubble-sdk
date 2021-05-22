interface IBubbleConfig {
  app: string;
  appVersion?: string;
  apiKey: string;
}

class BubbleConfigManager {
  config: IBubbleConfig | null = null;

  get(): IBubbleConfig {
    if (!this.config) {
      throw new Error(
        "Must initialize bubble-sdk with BubbleConfig.update before you make any API requests."
      );
    }
    return this.config;
  }

  update(config: IBubbleConfig) {
    this.config = config;
  }
}

const BubbleConfig = new BubbleConfigManager();
export default BubbleConfig;
