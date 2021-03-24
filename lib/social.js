const cheerio = require('cheerio');

const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://meduza-lite.baradusov.vercel.app';

/**
 *
 * Твиттер
 *
 */

export const getTweet = async (url) => {
  const response = await fetch(`${HOST}/api/tweet?url=${url}`); // FIXME
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
  const response = await fetch(`${HOST}/api/instagram?url=${url}`); // FIXME
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
 * Замена эмбедов
 *
 */

// FIXME Много мутирования хихи
export const withStaticEmbeds = async (data) => {
  const contentData =
    data.content.blocks || data.content.slides || data.content.cards;

  await Promise.all(contentData.map(replaceWithStaticTweets)); // FIXME Объединить реплэйсы
  await Promise.all(contentData.map(replaceWithStaticInstagramPosts));

  return data;
};
