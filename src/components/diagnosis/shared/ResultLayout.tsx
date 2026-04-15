import Disclaimer from '@/components/common/Disclaimer';

type Props = {
  hero: React.ReactNode;
  children: React.ReactNode;
};

export default function ResultLayout({ hero, children }: Props) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {hero}
      {children}
      <Disclaimer />
    </div>
  );
}
