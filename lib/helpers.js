const MOSCOW_OFFSET = 10800000; // UTC+3

const ms = (sec) => sec * 1000;

export const formatDate = (timestamp) => {
  const datetime = new Date(ms(timestamp) + MOSCOW_OFFSET);
  const time = `${datetime.getHours()}:${
    datetime.getMinutes() < 10
      ? `0${datetime.getMinutes()}`
      : datetime.getMinutes()
  }`;
  const date = new Date(ms(timestamp)).toLocaleDateString('ru-RU');

  return {
    date,
    time,
  };
};

export const lastUpdated = () => {
  const mscw = Date.now() + MOSCOW_OFFSET;
  const datetime = new Date(mscw);
  const time = `${datetime.getHours()}:${
    datetime.getMinutes() < 10
      ? `0${datetime.getMinutes()}`
      : datetime.getMinutes()
  }`;
  const date = datetime.toLocaleDateString('ru-RU');

  return {
    date,
    time,
  };
};
