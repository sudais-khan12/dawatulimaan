type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f5f8fb] to-white text-gray-900 antialiased">
      {children}
    </div>
  );
};

export default PageWrapper;
