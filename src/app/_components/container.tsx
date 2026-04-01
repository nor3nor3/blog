type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="max-w-5xl mx-auto px-8 md:px-12">{children}</div>;
};

export default Container;
