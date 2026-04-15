type Props = {
  heading: string;
  description?: string;
  children: React.ReactNode;
};

export default function StepContainer({ heading, description, children }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">{heading}</h2>
      {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </div>
  );
}
