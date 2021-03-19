const cheerio = require('cheerio');

export const getTweet = async (url) => {
  const response = await fetch(`https://meduza-lite.baradusov.vercel.app/api/tweet?url=${url}`);
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
