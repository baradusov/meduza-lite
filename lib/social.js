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

  if (oEmbedTweet.error) {
    return {
      provider: 'twitter',
      html: `<p>Закрытый аккаунт или твит удалён, <a href="${twitterUrl}">посмотреть в Твиттере</a>.</p>`,
    };
  }

  const $tweet = cheerio.load(oEmbedTweet.html);
  const $tweetWithoutScript = $tweet('blockquote');

  return {
    provider: 'twitter',
    html: $tweetWithoutScript.html(),
    url: twitterUrl,
    author: oEmbedTweet.author_name,
    photos: oEmbedTweet.photos || null,
    video: oEmbedTweet.video || null,
  };
};

const replaceWithStaticTweets = async (block) => {
  if (block.type === 'embed' && block.data.provider === 'twitter') {
    block.data = await prepareStaticTweet(block.data);
  }

  return block;
};

/**
 *
 * Тикток
 *
 */

export const getTiktok = async (url) => {
  const response = await fetch(`${HOST}/api/tiktok?url=${url}`);
  const data = await response.json();

  return data;
};

const prepareStaticTiktok = async (data) => {
  const $ = cheerio.load(data.html);
  let tiktokUrl;

  if ($('.tiktok-embed').attr('cite')) {
    tiktokUrl = $('.tiktok-embed').attr('cite');
  } else {
    const videoId = $('tik-tok').attr('name');
    tiktokUrl = `https://www.tiktok.com/@${data.credit}/video/${videoId}`;
  }

  const oEmbedTiktok = await getTiktok(tiktokUrl);
  const $tiktok = cheerio.load(oEmbedTiktok.html);
  const $tiktokWithoutScript = $tiktok('blockquote');
  const html = $tiktokWithoutScript.html();

  return {
    provider: 'tiktok',
    html,
    url: tiktokUrl,
    title: oEmbedTiktok.title,
    author: oEmbedTiktok.author_name,
    thumbnail: oEmbedTiktok.thumbnail_url,
  };
};

const replaceWithStaticTiktoks = async (block) => {
  if (block.type === 'embed' && block.data.provider === 'tiktok') {
    block.data = await prepareStaticTiktok(block.data);
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
  const url = $('script').attr('data-telegram-post')
    ? `https://t.me${$('script').attr('data-telegram-post')}`
    : $('[media-url]').attr('media-url');
  const telegramEmbedDocument = await getTelegramPost(url);
  const $tgEmbedDoc = cheerio.load(telegramEmbedDocument);
  const html = $tgEmbedDoc('.tgme_widget_message_text').html();
  const author = $tgEmbedDoc('.tgme_widget_message_author').html();
  const bgImageStyle = $tgEmbedDoc('.tgme_widget_message_photo_wrap').css(
    'background-image'
  );
  const image = bgImageStyle ? bgImageStyle.split("'")[1] : null;

  return { provider: 'telegram', html, url, author, image };
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

// FIXME очень страшный код, что делаать
export const withStaticEmbeds = async (data) => {
  if (data.content.slides || data.content.cards) {
    const contentData = data.content.slides || data.content.cards;

    await Promise.all([
      ...contentData.map(
        async (slide) =>
          await Promise.all([
            ...slide.blocks.map(replaceWithStaticTweets),
            ...slide.blocks.map(replaceWithStaticInstagramPosts),
            ...slide.blocks.map(replaceWithStaticTelegramPosts),
            ...slide.blocks.map(replaceWithStaticTiktoks),
          ])
      ),
    ]);
  } else {
    await Promise.all([
      ...data.content.blocks.map(replaceWithStaticTweets),
      ...data.content.blocks.map(replaceWithStaticInstagramPosts),
      ...data.content.blocks.map(replaceWithStaticTelegramPosts),
      ...data.content.blocks.map(replaceWithStaticTiktoks),
    ]);
  }

  return data;
};
