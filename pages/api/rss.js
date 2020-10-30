import xmlParser from 'fast-xml-parser';
import { getRss, generateRss } from 'lib/api';

export default async (req, res) => {
  const xml = await getRss();
  const rssJson = xmlParser.parse(xml);
  const rss = generateRss(rssJson.rss.channel.item);

  res.setHeader("Content-Type", "application/xml");
  res.status(200).end(rss);
};