import UserCreateForm from "./UserCreateForm";

const UserCreatePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create admin user
        </h1>
        <p className="text-sm text-gray-600">
          Add an admin email to the allowlist for magic-link login.
        </p>
      </div>
      <UserCreateForm />
    </div>
  );
};

export default UserCreatePage;
