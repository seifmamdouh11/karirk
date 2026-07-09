import React, { Suspense } from "react";
import PostsClient from "./PostsClient";

export const metadata = {
  title: "Career Articles and Advice | Karirak",
  description: "Read expert career advice, hiring tips, and industry insights for professionals in the Arab world.",
};

export default function PostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsClient />
    </Suspense>
  );
}
