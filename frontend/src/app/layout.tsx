"use client";
import "./globals.css";

const fonts = '${poppins.variable}';
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>You can also become doctor </title>
      </head>
      <body
        className={`${fonts}`}
      >
        {children}
      </body>
    </html>
  );
}
