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
    { id: 5, field: 'Contact Us', target: 'email-subscription', type: 'scroll' },
    { id: 2, field: 'Our Services', target: 'services', type: 'scroll' },
    { id: 3, field: 'Our Work', target: '/our-work', type: 'redirect' },
    { id: 4, field: 'Upload', target: '/upload', type: 'redirect' },
  ];

  return <NavbarContent navLinks={navLinks} />;
}
