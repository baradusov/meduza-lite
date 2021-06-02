import Head from 'next/head';
const { extract } = require('article-parser');
import Page from 'components/Page';

const Lite = (props) => {
  const { data, source } = props;

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
          <p>Облегчить страницу не удалось.</p>
          <p>Эта страница открылась, потому что вы нажали на «⚡».</p>
          <p>
            Робот пытается делать облегчённые версии статей с других сайтов, но
            иногда у него не получается.
          </p>
          <a href={source}>{source}</a>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <Head>
        <title>{data.title} | Meduza, лёгкая версия</title>
      </Head>

      <div style={{ marginBottom: 40, padding: 10, border: '1px solid' }}>
        <p>
          Это облегчённая версия статьи <a href={data.url}>{data.url}</a>.
        </p>
        <p>Она открылась, потому что вы нажали на «⚡».</p>
        <p>
          Робот пытается убирать всё лишнее, но иногда могут оставаться разные
          артефакты или наоборот исчезнуть нужное.
        </p>
      </div>

      <hr />

      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </Page>
  );
};

export const getStaticProps = async ({ params }) => {
  try {
    const { url } = params;
    const articleData = await extract('http://' + url.join('/'));

    return {
      props: {
        data: articleData,
        source: `https://${params.url.join('/')}`,
      },
      revalidate: 60 * 30, // каждые 30 минут
    };
  } catch (error) {
    console.warn('Страница не собралась:', params.url.join('/'));
    console.warn(error);
    return {
      props: {
        data: false,
        source: `https://${params.url.join('/')}`,
      },
      revalidate: 60 * 30, // каждые 30 минут
    };
  }
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const config = {
  unstable_runtimeJS: false,
};

export default Lite;
