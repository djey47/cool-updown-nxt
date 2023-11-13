import { API_CONFIG } from '../common/api';
import type { Config } from '../model/configuration';

export async function getConfiguration() {
  const response = await fetch(API_CONFIG);
  
  // console.log({ response });

  const config = await response.json();

  // FIXME Fake added id for every device, based on index
  const typedConfig = config.configuration as Config;
  typedConfig.devices = typedConfig.devices.map((di, index) => {
    return {
      ...di,
      id: String(index),
    };
  });

  // console.log({ typedConfig });

  return typedConfig;
}
