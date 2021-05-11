export default async (req, res) => {
  try {
    const response = await fetch(
      `https://www.tiktok.com/oembed?url=${req.query.url}`
    );
    const data = await response.json();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};
