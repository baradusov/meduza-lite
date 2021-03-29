const cheerio = require('cheerio');
import Tweet from 'components/Tweet';
import InstagramPost from 'components/InstagramPost';
import TelegramPost from 'components/TelegramPost';
import Tiktok from 'components/Tiktok';

const replaceOriginalUrlWithLite = (blockData) => {
  return blockData.replace(/https:\/\/meduza.io\//g, '/');
};

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
        <p dangerouslySetInnerHTML={{ __html: replaceOriginalUrlWithLite(data.caption) }} />
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
        if (data.html) {
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

        return <InstagramPost instagramPost={data} />;
      }
      case 'twitter': {
        return <Tweet tweet={data} />;
      }
      case 'telegram': {
        return <TelegramPost telegramPost={data} />;
      }
      case 'tiktok': {
        return <Tiktok tiktok={data} />;
      }
      case 'vk': {
        const $ = cheerio.load(data.html);
        const post = $('div').attr('id');
        if (post) {
          const id = post.split('-')[1];

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
      case 'reddit': {
        const $ = cheerio.load(data.html);
        const redditUrl = $('a').attr('href');

        return (
          <a
            href={redditUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginBottom: 10 }}
          >
            Смотреть на Реддите
          </a>
        );
      }
      case 'meduza': {
        return (
          <p>
            Здесь должна быть форма от Медузы. Если хотите заполнить её,
            придётся открыть статью на Медузе.
          </p>
        );
      }
      case 'custom': {
        const $ = cheerio.load(data.html);
        const embedUrl = $('iframe').attr('src') || $('a').attr('href');

        if (embedUrl) {
          const { host } = new URL(embedUrl);

          if (host.includes('meduza.io')) {
            return (
              <p>
                Здесь должна быть форма от Медузы. Если хотите заполнить её,
                придётся открыть статью на Медузе.
              </p>
            );
          }

          return (
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginBottom: 10 }}
            >
              Открыть пост на {host}
            </a>
          );
        }

        return null;
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
