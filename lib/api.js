export const getLatestNews = async ({ page = 0, type = 'news' } = {}) => {
  const response = await fetch(
    `https://meduza.io/api/w5/search?chrono=${type}&page=${page}&per_page=24&locale=ru`
  );
  const { documents } = await response.json();
  const normalizedData = Object.values(documents).sort(
    (current, next) => next.datetime - current.datetime
  );

  return normalizedData;
};

export const getArticle = async (url) => {
  const response = await fetch(`https://meduza.io/api/w5/${url}`);
  const { root } = await response.json();

  return root;
};

export const getRss = async () => {
  const response = await fetch('https://meduza.io/rss/all');
  const text = await response.text();

  return text;
};

export const generateRss = (items) => {
  const xml = `<?xml version="1.0"?>
  <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
      <title>Meduza Lite</title>
      <description>Лёгкая версия meduza.io</description>
      <link>https://meduza-lite.vercel.app</link>
      <language>ru</language>
      <atom:link href="https://meduza-lite.vercel.app/api/rss" rel="self" type="application/rss+xml"/>
      ${items
        .map((item) => {
          return `
          <item>
            <title><![CDATA[${item.title}]]></title>
            <link>${item.link.replace(
              'https://meduza.io',
              'https://meduza-lite.vercel.app'
            )}</link>
            <guid>${item.guid.replace(
              'https://meduza.io',
              'https://meduza-lite.vercel.app'
            )}</guid>
            <description><![CDATA[${item.description}]]></description>
            <pubDate>${item.pubDate}</pubDate>
          </item>
        `;
        })
        .join('')}
    </channel>
  </rss>`;

  return xml;
};
