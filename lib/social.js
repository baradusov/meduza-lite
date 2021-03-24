const cheerio = require('cheerio');

const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `https://meduza-lite.vercel.app`; // FIXME process.env.VERCEL_URL чёт не катит

/**
 *
 * Твиттер
 *
 */

export const getTweet = async (url) => {
  const response = await fetch(`${HOST}/api/tweet?url=${url}`);
  const data = await response.json();

  return data;
};

const prepareStaticTweet = async (data) => {
  const $ = cheerio.load(data.html);
  const link = $('a').filter((i, el) =>
    $(el).attr('href').includes('twitter.com')
  );
  const twitterUrl = $(link).attr('href') || $('[media-url]').attr('media-url');
  const oEmbedTweet = await getTweet(twitterUrl);
  const $tweet = cheerio.load(oEmbedTweet.html);
  const $tweetWithoutScript = $tweet('blockquote');

  return $tweetWithoutScript.html();
};

const replaceWithStaticTweets = async (block) => {
  if (block.type === 'embed' && block.data.provider === 'twitter') {
    block.data.html = await prepareStaticTweet(block.data);
  }

  return block;
};

/**
 *
 * Инстаграм
 *
 */

export const getInstagramPost = async (url) => {
  const response = await fetch(`${HOST}/api/instagram?url=${url}`);
  const data = await response.json();

  return data;
};

export const prepareStaticInstagramPost = async (data) => {
  const $ = cheerio.load(data.html);
  const instagramUrl = $('a').attr('href');
  const {
    thumbnail_url: imageUrl,
    author_name: author,
  } = await getInstagramPost(instagramUrl);

  return { provider: 'instagram', imageUrl, author, instagramUrl };
};

const replaceWithStaticInstagramPosts = async (block) => {
  if (block.type === 'embed' && block.data.provider === 'instagram') {
    block.data = await prepareStaticInstagramPost(block.data);
  }

  return block;
};

/**
 *
 * Телеграм
 *
 */

export const getTelegramPost = async (url) => {
  const response = await fetch(`${url}?embed=1`);
  const data = await response.text();

  return data;
};

export const prepareStaticTelegramPost = async (data) => {
  const $ = cheerio.load(data.html);
  const telegramUrl = $('script').attr('data-telegram-post')
    ? `https://t.me${$('script').attr('data-telegram-post')}`
    : $('[media-url]').attr('media-url');
  const telegramEmbedDocument = await getTelegramPost(telegramUrl);
  const $tgEmbedDoc = cheerio.load(telegramEmbedDocument);
  const html = $tgEmbedDoc('.tgme_widget_message_text').html();
  const channel = $tgEmbedDoc('.tgme_widget_message_author').html();

  return { provider: 'telegram', html, telegramUrl, channel };
};

const replaceWithStaticTelegramPosts = async (block) => {
  if (block.type === 'embed' && block.data.provider === 'telegram') {
    block.data = await prepareStaticTelegramPost(block.data);
  }

  return block;
};

/**
 *
 * Замена эмбедов
 *
 */

// FIXME Много мутирования хихи
export const withStaticEmbeds = async (data) => {
  const contentData =
    data.content.blocks || data.content.slides || data.content.cards;

  await Promise.all(contentData.map(replaceWithStaticTweets)); // FIXME Объединить реплэйсы
  await Promise.all(contentData.map(replaceWithStaticInstagramPosts));
  await Promise.all(contentData.map(replaceWithStaticTelegramPosts));

  return data;
};
