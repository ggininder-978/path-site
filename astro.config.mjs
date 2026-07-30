import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: Replace with the actual domain once purchased
  // This is a placeholder — change only this one line when the domain is finalized
  site: 'https://path-site.com',

  integrations: [
    sitemap(),
  ],

  output: 'static',
});
