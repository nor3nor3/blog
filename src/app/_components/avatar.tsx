import Image from "next/image";

type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Image src={picture} className="rounded-full" width={40} height={40} alt={name} />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};

export default Avatar;
