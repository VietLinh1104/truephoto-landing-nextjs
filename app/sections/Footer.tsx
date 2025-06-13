
import { fetchAPI } from "@/lib/api";
import ScrollLink from "../components/ScrollLink";

interface Service {
  id: number;
  idField: string;
  description: string;
}

interface Footer {
  col_1: string;
  emailContact: string;
  address: string;
  phoneNumber: string;
  our_services: Service[];
}

async function getData(): Promise<Footer> {
  const response = await fetchAPI('footer?populate=*');
  return response.data as Footer;
}

export default async function Footer() {
  const data = await getData();

  return ( 
    <footer className="section">
      <div className="container pt-0 lg:w-7xl md:flex justify-between">
        <div className="mb-5">
          <h4>Hours of Operation: <span className="text-primary">24/7</span></h4>
        </div>

        <div className="flex flex-col mb-5">
          <h4 className="mb-1">Services</h4>
          {data.our_services?.map((service) => (
    <ScrollLink
        key={service.id}
        type="scroll" // hoặc "redirect" nếu bạn muốn sang trang khác
        target={service.idField}
        className="hover:text-primary transition-colors capitalize"
        >
        {service.idField.replace(/-/g, ' ')}
        </ScrollLink>
    ))}

        </div>

        <div className="flex flex-col">
          <h4 className="mb-1">Contact</h4>
          <a 
            href={`mailto:${data.emailContact}`}
            className="hover:text-primary transition-colors"
          >
            {data.emailContact}
          </a>
        </div>
      </div>
    </footer>
  );
}
