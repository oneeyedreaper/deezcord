interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex justify-center items-center h-full">{children}</div>
  );
}
