import React, { Suspense } from "react";
import JobsClient from "./JobsClient";

export const metadata = {
  title: "Search Jobs in the Arab World | Karirak",
  description: "Browse current full-time, part-time, remote, and hybrid job openings across the Arab world.",
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsClient />
    </Suspense>
  );
}
