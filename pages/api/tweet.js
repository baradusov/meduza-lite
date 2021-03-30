export default async (req, res) => {
  const oEmbedResponse = await fetch(
    `https://publish.twitter.com/oembed?url=${req.query.url}`
  );

  if (oEmbedResponse.ok) {
    const oEmbedData = await oEmbedResponse.json();
    const tweetMediaResponse = await fetch(
      `https://cdn.syndication.twimg.com/tweet?id=${
        req.query.url.split('/status/')[1].split('?')[0]
      }`
    );
    const tweetMediaData = await tweetMediaResponse.json();

    if (tweetMediaData.photos) {
      oEmbedData.photos = tweetMediaData.photos;
    }

    if (tweetMediaData.video) {
      oEmbedData.video = tweetMediaData.video;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(oEmbedData);

    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ error: true });
};
