import { mergeConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import config from './vite.config.js';

export default mergeConfig(config, {
  plugins: [basicSsl()],
});
