import { PageHeader, EmptyState } from "@jdcpuwiz/homelab-ui";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="__APP_NAME__"
        description="Scaffolded from homelab-ui-starter."
      />
      <EmptyState
        icon={<Sparkles className="h-10 w-10" />}
        title="You're up and running."
        message="Edit app/page.tsx, components/AppShell.tsx, and prisma/schema.prisma to start building. See README.md for the deploy path."
      />
    </div>
  );
}
