import ScrollLink from "../components/ScrollLink";

interface Service {
  id: number;
  idField: string;
  description: string;
}

interface FooterData {
  col_1: string;
  emailContact: string;
  address: string;
  phoneNumber: string;
  our_services: Service[];
}

export default async function Footer() {
  // Fix cứng dữ liệu
  const data: FooterData = {
    col_1: "TRUE PHOTO",
    emailContact: "sales@truediting.com",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    phoneNumber: "0123 456 789",
    our_services: [
      { id: 1, idField: "wedding-photography", description: "Chụp ảnh cưới" },
      { id: 2, idField: "event-photos", description: "Chụp ảnh sự kiện" },
      { id: 3, idField: "studio-shoot", description: "Chụp ảnh studio" },
    ],
  };

  return (
    <footer className="section">
      <div className="container pt-0 lg:w-7xl md:flex justify-between">
        <div className="mb-5">
          <h1 className="text-primary text-2xl font-bold py-5">{data.col_1}</h1>
          <h4>
            Hours of Operation: <span className="text-primary">24/7</span>
          </h4>
        </div>

        <div className="flex flex-col mb-5">
          <h4 className="mb-1">Services</h4>
          {data.our_services?.map((service) => (
            <ScrollLink
              key={service.id}
              type="scroll" // hoặc "redirect" nếu muốn sang trang khác
              target={service.idField}
              className="hover:text-primary transition-colors capitalize"
            >
              {service.idField.replace(/-/g, " ")}
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
          <p className="mt-1">{data.phoneNumber}</p>
          <p>{data.address}</p>
        </div>
      </div>
    </footer>
  );
}
