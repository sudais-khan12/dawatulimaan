type EventPageProps = {
  params: { slug: string };
};

export default function EventPage({ params }: EventPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-lg border bg-white px-6 py-12 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Event: {params.slug}
        </h1>
      </div>
    </div>
  );
}
