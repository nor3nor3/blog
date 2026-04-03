import Link from "next/link";

const Header = () => {
  return (
    <div className="mb-16 mt-8">
      <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-stone-500 hover:text-orange-500 transition-colors">
        ← 전체 목록
      </Link>
    </div>
  );
};

export default Header;