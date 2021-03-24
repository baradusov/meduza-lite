export default async (req, res) => {
  const ACCESS_TOKEN = `${process.env.INSTAGRAM_APP_ID}|${process.env.INSTAGRAM_CLIENT_TOKEN}`;
  const response = await fetch(
    `https://graph.facebook.com/v10.0/instagram_oembed?url=${req.query.url}&access_token=${ACCESS_TOKEN}`
  );
  const data = await response.json();

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(data);
};
