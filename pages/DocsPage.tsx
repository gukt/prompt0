import { SidebarLayout } from '@/components/layout/SidebarLayout';

export function DocsPage() {
  return (
    <SidebarLayout>
      <h1 className="text-lg font-semibold">Documentation</h1>
      <p className="text-muted-foreground">This is docs page.</p>
    </SidebarLayout>
  );
}
