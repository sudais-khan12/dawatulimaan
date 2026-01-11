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
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-200/60 ring-1 ring-black/5 transition hover:-translate-y-1.5 hover:shadow-xl">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary">
          {title}
        </h3>
        {safeDate && (
          <p className="text-sm font-medium text-slate-700">
            {safeDate}
          </p>
        )}
        {location && (
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">Location:</span> {location}
          </p>
        )}
        {description && (
          <p className="text-sm text-slate-600 line-clamp-3">{description}</p>
        )}
      </div>
      <div className="pt-4">
        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/92"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
