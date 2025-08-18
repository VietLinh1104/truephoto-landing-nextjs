import NavbarContent from '../components/NavbarContent';

interface NavLink {
  id: number;
  field: string;
  target: string;
  type: 'scroll' | 'redirect';
}

export default async function Navbar() {
  // Fix cứng dữ liệu tạm thời
  const navLinks: NavLink[] = [
    { id: 1, field: 'Home', target: '/', type: 'redirect' },
    { id: 2, field: 'Our Services', target: 'services', type: 'scroll' },
    { id: 3, field: 'Upload', target: '/upload', type: 'redirect' },
    // { id: 4, field: 'Our Work', target: 'contact', type: 'scroll' },
  ];

  return <NavbarContent navLinks={navLinks} />;
}
