import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Γενεαλογικό Δέντρο',
  description: 'Εξερευνήστε το γενεαλογικό δέντρο του Πολιτιστικού Συλλόγου Μέσης και τις οικογένειες της περιοχής.',
};

export default function FamilyTreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
