import React from 'react';
import '@/styles/globals.scss';

export const metadata = {
  title: 'enVId Tech - Home Page',
  description: 'enVId Tech - Personal Webpage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>enVId Tech - Home Page</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
