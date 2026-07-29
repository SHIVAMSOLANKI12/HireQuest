const AssessmentRuntimeHeader = ({ title, status }) => {
  return (
    <header className="sticky top-0 z-20 border-b bg-background shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Assessment
          </p>
          <h1 className="mt-0.5 truncate text-xl font-semibold">
            {title}
          </h1>
        </div>

        <div className="flex-shrink-0 rounded-full border bg-muted px-3 py-1 text-sm font-medium">
          {status}
        </div>
      </div>
    </header>
  );
};

export default AssessmentRuntimeHeader;
