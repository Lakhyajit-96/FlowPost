import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { RecentPostsTable } from "./components/recent-posts-table"
import { SectionCards } from "./components/section-cards"

import postsData from "./data/posts-data.json"

export default function Page() {
  return (
    <>
      {/* Page Title and Description */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-muted-foreground">Track your social media performance across all platforms</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <SectionCards />
        <ChartAreaInteractive />
      </div>
      <div className="@container/main px-4 lg:px-6">
        <RecentPostsTable data={postsData} />
      </div>
    </>
  )
}
