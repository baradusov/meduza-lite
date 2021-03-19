const cheerio = require('cheerio');

export const getTweet = async (url) => {
  const host =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://meduza-lite.vercel.app';
  const response = await fetch(`${host}/api/tweet?url=${url}`); // FIXME
  const data = await response.json();

  return data;
};

export const withStaticTweets = async (data) => {
  const prepareStaticTweet = async (data) => {
    const $ = cheerio.load(data.html);
    const link = $('a').filter((i, el) =>
      $(el).attr('href').includes('twitter.com')
    );
    const twitterUrl =
      $(link).attr('href') || $('[media-url]').attr('media-url');
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

  const blocksWithStaticTweets = await Promise.all(
    data.content.blocks.map(replaceWithStaticTweets)
  );

  data.content.blocks = blocksWithStaticTweets;

  return data;
};