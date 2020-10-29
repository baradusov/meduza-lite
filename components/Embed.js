const Embed = (props) => {
  const { data } = props;

  const renderEmbed = () => {
    switch (data.provider) {
      case 'instagram': {
        return null;
      }
    }
  };

  return <div>{renderEmbed()}</div>;
};

export default Embed;
