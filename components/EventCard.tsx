import Link from "next/link";

type EventCardProps = {
  title: string;
  slug: string;
  date?: string | null;
  location?: string | null;
  description?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return null;
  try {
    const d = new Date(value);
    return d.toISOString().split("T")[0];
  } catch {
    return value;
  }
};

const EventCard = ({ title, slug, date, location, description }: EventCardProps) => {
  const safeDate = formatDate(date);

  return (
    <div className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-700">
          {title}
        </h3>
        {safeDate && (
          <p className="text-sm text-gray-600">
            {safeDate}
          </p>
        )}
        {location && (
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Location:</span> {location}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        )}
      </div>
      <div className="pt-4">
        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
