import { fetchAPI } from '@/lib/api';
import NavbarContent from '../components/NavbarContent';

interface NavLink {
  id: number;
  field: string;
  target: string;
  type: 'scroll' | 'redirect';
}

async function getData(): Promise<NavLink[]> {
  const response = await fetchAPI('categories?populate=*');
  return response.data as NavLink[];
}

export default async function Navbar() {
  const navLinks = await getData();
  return <NavbarContent navLinks={navLinks} />;
}
