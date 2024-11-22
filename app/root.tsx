import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import styles from "./tailwind.css?url";
import PrelineScript from "~/components/preline.client";
import Navbar from "~/components/Navbar";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap",
    },
  ];
}
export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <Scripts />
        {PrelineScript && <PrelineScript />}
      </body>
    </html>
  );
}
