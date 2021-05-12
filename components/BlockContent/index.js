import Embed from 'components/Embed';
import Table from 'components/Table';
import styles from './index.module.css';

const BlockContent = (props) => {
  const { blocks, isVideo } = props;
  const prependHost = (url) => {
    return url.includes('https://meduza.io') ? url : `https://meduza.io/${url}`;
  };
  const replaceOriginalUrlWithLite = (blockData) => {
    return blockData.replace(/https:\/\/meduza.io\//g, '/');
  };

  return (
    <div className={styles.content}>
      {blocks.map((block) => {
        if (block.only_on === 'mobile') return;

        switch (block.type) {
          case 'lead': {
            return (
              <p
                className={styles.lead}
                key={block.id}
                dangerouslySetInnerHTML={{
                  __html: replaceOriginalUrlWithLite(block.data),
                }}
              />
            );
          }
          case 'blockquote': {
            return (
              <blockquote
                className={styles.blockquote}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );
          }
          case 'h2': {
            return (
              <h2
                className={styles.sectionTitle}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );
          }
          case 'h3': {
            return (
              <h3
                className={styles.sectionTitle}
                key={block.id}
                dangerouslySetInnerHTML={{
                  __html: replaceOriginalUrlWithLite(block.data),
                }}
              />
            );
          }
          case 'h4': {
            return (
              <h4
                className={styles.sectionTitle}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );
          }
          case 'card_title': {
            return (
              <h3
                className={styles.sectionTitle}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }
          case 'p': {
            return (
              <p
                className={styles.newsText}
                key={block.id}
                dangerouslySetInnerHTML={{
                  __html: replaceOriginalUrlWithLite(block.data || ''),
                }}
              />
            );
          }
          case 'context_p': {
            return (
              <p
                className={styles.contextText}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );
          }
          case 'image': {
            return (
              <figure className={styles.figure} key={block.id}>
                <img src={prependHost(block.data.large_url)} />
                <figcaption>
                  {block.data.caption && (
                    <p
                      className={styles.caption}
                      dangerouslySetInnerHTML={{ __html: block.data.caption }}
                    />
                  )}
                  {block.data.credit && (
                    <p
                      className={styles.credit}
                      dangerouslySetInnerHTML={{ __html: block.data.credit }}
                    />
                  )}
                </figcaption>
              </figure>
            );
          }
          case 'dots_on_image': {
            return (
              <>
                <figure className={styles.figure} key={block.id}>
                  <img src={prependHost(block.data.optimized.original)} />
                  <figcaption>
                    {block.data.caption && (
                      <p
                        className={styles.caption}
                        dangerouslySetInnerHTML={{ __html: block.data.caption }}
                      />
                    )}
                    {block.data.credit && (
                      <p
                        className={styles.credit}
                        dangerouslySetInnerHTML={{ __html: block.data.credit }}
                      />
                    )}
                  </figcaption>
                </figure>

                {block.data.dots.map((dot) => {
                  return (
                    <div className={styles.spoiler} key={dot.id}>
                      <details open>
                        <summary style={{ cursor: 'pointer' }}>
                          {dot.title}
                        </summary>
                        <div dangerouslySetInnerHTML={{ __html: dot.body }} />
                      </details>
                    </div>
                  );
                })}
              </>
            );
          }
          case 'quote': {
            return (
              <blockquote
                className={styles.blockquote}
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );
          }
          case 'ul': {
            return (
              <ul key={block.id}>
                {block.data.map((item, index) => {
                  return (
                    <li
                      className={styles.listItem}
                      key={index}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  );
                })}
              </ul>
            );
          }
          case 'ol': {
            return (
              <ol key={block.id}>
                {block.data.map((item, index) => {
                  return (
                    <li
                      className={styles.listItem}
                      key={index}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  );
                })}
              </ol>
            );
          }
          case 'spoiler': {
            return (
              <div className={styles.spoiler} key={block.id}>
                {block.title && (
                  <h3 className={styles.spolerTitle}>{block.title}</h3>
                )}
                <details>
                  <summary style={{ cursor: 'pointer' }}>
                    {block.btn_title}
                  </summary>
                  <BlockContent blocks={block.blocks} />
                </details>
              </div>
            );
          }
          case 'table': {
            return <Table key={block.id} data={block} />;
          }
          case 'start_game_btn': {
            return (
              <a href={`https://meduza.io/${block.data.material_url}`}>
                Играть на Медузе
              </a>
            );
          }
          case 'grouped': {
            return <BlockContent blocks={block.data} />;
          }
          case 'embed_code':
          case 'embed': {
            return <Embed key={block.id} data={block.data} isVideo={isVideo} />;
          }
        }
      })}
    </div>
  );
};

export default BlockContent;
