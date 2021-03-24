export default async (req, res) => {
  const ACCESS_TOKEN = '447462349794836|b92a816fdd5423732343d9f4663bc45e';
  const response = await fetch(
    `https://graph.facebook.com/v10.0/instagram_oembed?url=${req.query.url}&access_token=${ACCESS_TOKEN}`
  );
  const data = await response.json();

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(data);
};
