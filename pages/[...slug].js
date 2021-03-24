import Head from 'next/head';
import { getArticle, getLatestNews } from 'lib/api';
import { formatDate } from 'lib/helpers';
import { withStaticEmbeds } from 'lib/social';
import Page from 'components/Page';
import BlockContent from 'components/BlockContent';
import styles from 'styles/Home.module.css';

const News = (props) => {
  const { data } = props;

  if (!data) {
    return (
      <Page>
        <Head>
          <title>Meduza, лёгкая версия</title>
        </Head>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p style={{ textAlign: 'center' }}>Такой страницы не существует.</p>
        </div>
      </Page>
    );
  }

  const renderContent = () => {
    if (data.video) {
      return <BlockContent blocks={data.content.blocks} isVideo />;
    }

    if (data.content.blocks) {
      return <BlockContent blocks={data.content.blocks} />;
    }

    if (data.content.slides) {
      return data.content.slides.map((slide) => (
        <BlockContent blocks={slide.blocks} />
      ));
    }

    if (data.content.cards) {
      return data.content.cards.map((card) => (
        <BlockContent blocks={card.blocks} />
      ));
    }

    return (
      <>
        <p>Этот формат Медузы пока не поддерживается. </p>
        <a href={`https://meduza.io/${data.url}`}>Читайте на Медузе.</a>
      </>
    );
  };

  return (
    <Page>
      <Head>
        <title>{data.title} | Meduza, лёгкая версия</title>
      </Head>
      <div className={styles.titleContainer}>
        <h2 className={styles.newsTitle}>{data.title}</h2>
        {data.secondTitle && (
          <p className={styles.secondTitle}>{data.secondTitle}</p>
        )}
      </div>
      <div className={styles.subtitle}>
        <p className={styles.newsDate}>
          {data.time}, {data.date}
        </p>
        <a href={`https://meduza.io/${data.url}`}>Читать на Медузе.</a>
      </div>

      {renderContent()}
    </Page>
  );
};

export const getStaticProps = async ({ params }) => {
  try {
    const { slug } = params;
    const articleData = await getArticle(slug.join('/'));
    const articleDataWithStaticEmbeds = await withStaticEmbeds(articleData); // FIXME Есть не только твиттер
    const { date, time } = formatDate(articleData.datetime);

    return {
      props: {
        data: {
          ...articleDataWithStaticEmbeds, 
          date,
          time,
        },
      },
      revalidate: 60 * 30, // каждые 30 минут
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: false,
      },
      revalidate: 60 * 30, // каждые 30 минут
    };
  }
};

export const getStaticPaths = async () => {
  const news = await getLatestNews();

  const paths = news.map(({ url }) => ({
    params: {
      slug: url.split('/'),
    },
  }));

  return { paths, fallback: 'blocking' };
};

export const config = {
  unstable_runtimeJS: false,
};

export default News;
