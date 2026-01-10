import UserCreateForm from "./UserCreateForm";

const UserCreatePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create admin user</h1>
        <p className="text-sm text-gray-600">
          Add a new admin account with email and password.
        </p>
      </div>
      <UserCreateForm />
    </div>
  );
};

export default UserCreatePage;
