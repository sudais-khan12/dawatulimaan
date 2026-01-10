import Link from "next/link";

type EventCardProps = {
  title: string;
  slug: string;
  date?: string | null;
  location?: string | null;
  description?: string | null;
};

const EventCard = ({ title, slug, date, location, description }: EventCardProps) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {date && (
          <p className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString()}
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
          className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
