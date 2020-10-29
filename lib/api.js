export const getLatestNews = async () => {
  const response = await fetch(
    `https://meduza.io/api/w5/search?chrono=news&page=0&per_page=24&locale=ru`
  );
  const { documents } = await response.json();
  const normalizedData = Object.values(documents).sort(
    (current, next) => next.datetime - current.datetime
  );

  return normalizedData;
};

export const getArticle = async (url) => {
  const response = await fetch(`https://meduza.io/api/w5/${url}`);
  const { root } = await response.json();

  return root;
};

export const getRss = async () => {
  const response = await fetch('https://meduza.io/rss/all');
  const text = await response.text();

  return text;
};
