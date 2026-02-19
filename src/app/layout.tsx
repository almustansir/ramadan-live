import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ramadan Live",
  description: "Accurate Ramadan timetable & Islamic utilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-emerald-50 text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
