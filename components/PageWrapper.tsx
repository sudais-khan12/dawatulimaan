type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      {children}
    </div>
  );
};

export default PageWrapper;
