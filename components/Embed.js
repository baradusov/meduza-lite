const cheerio = require('cheerio');

const Embed = (props) => {
  const { data, isVideo } = props;

  if (isVideo) {
    const $ = cheerio.load(data.html);
    const youtubeUrl = $('iframe').attr('src');
    const pathname = new URL(youtubeUrl).pathname;
    const [_, id] = pathname.split('/embed/');
    const previewImage = (id) =>
      `https://img.youtube.com/vi/${id}/sddefault.jpg`;

    return (
      <div>
        <a
          href={`https:///youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Посмотреть видео на YouTube"
        >
          <img src={previewImage(id)} />
        </a>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https:///youtube.com/watch?v=${id}`}
          >
            Смотреть на Youtube
          </a>
        </p>
        <p dangerouslySetInnerHTML={{ __html: data.caption }} />
      </div>
    );
  }

  const renderEmbed = () => {
    switch (data.provider) {
      case 'youtube': {
        const $ = cheerio.load(data.html);
        const youtubeUrl = $('iframe').attr('src');
        const pathname = new URL(youtubeUrl).pathname;
        const [_, id] = pathname.split('/embed/');
        const previewImage = (id) =>
          `https://img.youtube.com/vi/${id}/sddefault.jpg`;

        return (
          <div>
            <a
              href={`https:///youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Посмотреть видео на YouTube"
            >
              <img src={previewImage(id)} />
            </a>
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https:///youtube.com/watch?v=${id}`}
              >
                Смотреть на Youtube
              </a>
            </p>
          </div>
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
            Посмотреть пост в Instagram
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
            Посмотреть твит
          </a>
        );
      }
      case 'telegram': {
        const $ = cheerio.load(data.html);
        const telegramUrl = $('script').attr('data-telegram-post');

        return (
          <a
            href={`https://t.me${telegramUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Посмотреть пост в Telegram
          </a>
        );
      }
      case 'vk': {
        const $ = cheerio.load(data.html);
        const post = $('div').attr('id');

        if (post) {
          const id = post.split('-');

          return (
            <a
              href={`https://vk.com/wall-${id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginBottom: 10 }}
            >
              Посмотреть в ВК
            </a>
          );
        }

        const videoUrl = $('iframe').attr('src');
        return (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Посмотреть в ВК
          </a>
        );
      }
      case 'facebook': {
        const $ = cheerio.load(data.html);
        const fbUrl = $('.fb-post').attr('data-href');

        return (
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Посмотреть в Facebook
          </a>
        );
      }
      case 'apple_music': {
        const $ = cheerio.load(data.html);
        const appleMusicUrl = $('iframe').attr('src');

        return (
          <a
            href={appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Послушать в Apple Music
          </a>
        );
      }
      default: {
        return (
          <blockquote>
            Здесь должен быть эмбед, но он пока не поддерживается. Придётся
            смотреть на Медузе.
          </blockquote>
        );
      }
    }
  };

  return <div>{renderEmbed()}</div>;
};

export default Embed;
