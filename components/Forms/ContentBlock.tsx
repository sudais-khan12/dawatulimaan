import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ContentFieldConfig } from "@/lib/forms/types";

type ContentBlockProps = {
  field: ContentFieldConfig;
};

const ContentBlock = ({ field }: ContentBlockProps) => {
  if (field.type === "heading") {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          {field.content}
        </h2>
      </div>
    );
  }

  if (field.type === "notice") {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertDescription className="text-yellow-900">
          {field.content}
        </AlertDescription>
      </Alert>
    );
  }

  return <p className="text-sm text-muted-foreground">{field.content}</p>;
};

export default ContentBlock;
