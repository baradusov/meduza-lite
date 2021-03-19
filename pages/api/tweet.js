export default async (req, res) => {
  const response = await fetch(`https://publish.twitter.com/oembed?url=${req.query.url}`);
  const data = await response.json();

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).json(data);
};
