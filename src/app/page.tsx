import { redirect } from 'next/navigation';

/**
 * This project is dedicated to a single page. Root just forwards to it so the
 * project's base URL is never a dead end.
 */
export default function HomePage() {
  redirect('/survey/bank-nbfc-preference');
}
