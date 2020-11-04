const cheerio = require('cheerio');

const Embed = (props) => {
  const { data } = props;

  const renderEmbed = () => {
    switch (data.provider) {
      case 'youtube': {
        const $ = cheerio.load(data.html);
        const youtubeUrl = $('iframe').attr('src');

        return (
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Смотреть на YouTube
          </a>
        );
      }
      case 'instagram': {
        const $ = cheerio.load(data.html);
        const instagramUrl = $('a').attr('href');

        return (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Смотреть фото в Instagram
          </a>
        );
      }
      case 'twitter': {
        const $ = cheerio.load(data.html);
        const link = $('a').filter((i, el) =>
          $(el).attr('href').includes('twitter.com')
        );
        const twitterUrl = $(link).attr('href');

        return (
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Смотреть твит в Twitter
          </a>
        );
      }
      default: {
        return (
          <blockquote>Здесь должен быть эмбед, но он пока не поддерживается. Придётся смотреть на Медузе.</blockquote>
        );
      }
    }
  };

  return <div>{renderEmbed()}</div>;
};

export default Embed;
