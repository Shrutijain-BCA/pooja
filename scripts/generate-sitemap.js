
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const env = loadEnv('production', process.cwd(), 'VITE_');

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

const BASE_URL = 'https://panditpoojaseva.com';

async function generateSitemap() {
  const [poojasResult, statesResult, locationsResult] =
    await Promise.all([
      supabase.from('poojas').select('slug').eq('is_active', true),
      supabase.from('states').select('id, slug').eq('is_active', true),
      supabase.from('locations').select('slug, state_id').eq('is_active', true)
    ]);

  if (poojasResult.error || statesResult.error || locationsResult.error) {
    throw new Error('Could not fetch sitemap data from Supabase');
  }

  const urls = [
    '/',
    '/explore-poojas',
    '/festive-specials',
    '/locations',
    '/find-a-pooja',
    '/about',
    '/contact',
    ...poojasResult.data.map(p => `/poojas/${p.slug}`),
    ...statesResult.data.map(s => `/locations/${s.slug}`),
  ];

  const stateMap = new Map(
    statesResult.data.map(s => [s.id, s.slug])
  );

  for (const location of locationsResult.data) {
    const stateSlug = stateMap.get(location.state_id);

    if (stateSlug) {
      urls.push(
        `/locations/${stateSlug}/${location.slug}`
      );
    }
  }

  const uniqueUrls = [...new Set(urls)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');

  fs.writeFileSync(outputPath, xml);

  console.log(`Sitemap generated with ${uniqueUrls.length} URLs`);
}

generateSitemap().catch(error => {
  console.error(error);
  process.exit(1);
});
