import "./globals.css";

export const metadata = {
  title: "WIAL Global",
  description: "Global WIAL platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
<body className="bg-[#eef2f7] text-slate-900">
  {children}
</body>
    </html>
  );
}