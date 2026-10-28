"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    window.location.replace("/admin/start.html");
  }, []);

  return (
    <p style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      Opening the site admin…
    </p>
  );
}
