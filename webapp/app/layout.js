import "./globals.css";

export const metadata = {
  title: "kerjakita — trusted pros near you",
  description: "Book trusted local pros in a few taps. Aircon, plumbing, car, cleaning & more, within 5 km of you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
