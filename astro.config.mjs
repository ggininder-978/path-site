import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: Replace with the actual domain once purchased
  // 之後購買正式網域後，只需更改這一行
  site: 'https://path-site-gilt.vercel.app',

  integrations: [
    sitemap(),
  ],

  output: 'static',
});
