import type { Metadata } from 'next';
import { SampleQuestionsPageClient } from './SampleQuestionsPageClient';

export const metadata: Metadata = {
  title: 'Sample Questions | Bank vs NBFC Preference Survey | Ken Research',
  description: 'Preview sample questions across all eight themes of the Bank vs NBFC Preference Survey.',
};

export default function SampleQuestionsPage() {
  return <SampleQuestionsPageClient />;
}
