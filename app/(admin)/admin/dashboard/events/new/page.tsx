import EventCreateForm from "./EventCreateForm";

const NewEventPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create event</h1>
        <p className="text-sm text-gray-600">
          Add a new event for attendees to register.
        </p>
      </div>
      <EventCreateForm />
    </div>
  );
};

export default NewEventPage;
