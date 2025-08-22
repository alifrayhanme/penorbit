

const Title = ({title, css}) => {
  return (
    <h1 className={`font-bold text-3xl md:text-4xl leading-snug mb-4 ${css}`}>
        {title}
    </h1>
  );
};

export default Title;
