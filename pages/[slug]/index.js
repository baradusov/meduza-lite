import Head from 'next/head';
import { getLatestNews } from 'lib/api';
import { formatDate } from 'lib/helpers';
import Page from 'components/Page';
import styles from 'styles/Home.module.css';

const titles = {
  news: 'Новости',
  articles: 'Истории',
  razbor: 'Разбор',
  games: 'Игры',
  shapito: 'Шапито',
  podcasts: 'Подкасты',
};

const ArticlesPage = (props) => {
  const { news, slug } = props;

  return (
    <Page>
      <Head>
        <title>{titles[slug] || 'Новости'} | Meduza, лёгкая версия</title>
      </Head>

      <ul className={styles.list}>
        {news.map((newsItem) => {
          const { title, secondTitle, date, time, url } = newsItem;

          return (
            <li key={url} className={styles.listItem}>
              <a href={url}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.newsTitle}>{title}</h2>
                  {secondTitle && (
                    <p className={styles.secondTitle}>{secondTitle}</p>
                  )}
                </div>
                <p className={styles.newsDate}>
                  {time}, {date}
                </p>
              </a>
            </li>
          );
        })}
      </ul>

      <a href={`${slug}/p/1`}>Следующая страница</a>
    </Page>
  );
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const data = await getLatestNews({ type: slug });

  const news = data.map((item) => {
    const { title, datetime, url, second_title } = item;
    const { date, time } = formatDate(datetime);

    return {
      title,
      secondTitle: second_title || null,
      url,
      time,
      date,
    };
  });

  return {
    props: {
      news,
      slug,
    },
    revalidate: 60 * 30, // каждые 30 минут
  };
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const config = {
  unstable_runtimeJS: false,
};

export default ArticlesPage;
