import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ιστορία',
  description: 'Η ιστορία της Μέσης Ημαθίας: Μια κλασική ιστορία επιβίωσης και μεταμόρφωσης στην καρδιά του εύφορου κάμπου.',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
