import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ιστορία',
  description: 'Ανακαλύψτε το χρονικό της Μέσης. Από τους προϊστορικούς οικισμούς του Αλιάκμονα μέχρι το σημερινό οικισμό.',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
