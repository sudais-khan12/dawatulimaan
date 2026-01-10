import { Button } from "@/components/ui/button";
import { sendDemoEventEmails } from "./actions/send-event-emails";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-600">
        High-level snapshot of admin activity will appear here.
      </p>

      <form action={sendDemoEventEmails} className="pt-2">
        <Button type="submit">Send demo event emails</Button>
      </form>
    </div>
  );
};

export default AdminDashboardPage;
