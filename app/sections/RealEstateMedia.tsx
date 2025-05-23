import { fetchAPI } from '@/lib/api';
import Card1 from '@/app/components/Card1';

interface Card {
    image: Array<{
        url: string;
    }>;
    title: {
        Title: string;
    };
    subtitle: {
        Title: string;
    };
    button: {
        Text: string;
    };
    description: string;
}

async function getData(): Promise<Card[]> {
    const response = await fetchAPI('card-sections?populate=*');
    return response.data as Card[];
}

export default async function RealEstateMedia() {
    const data = await getData();

    return (
        <div className="section">
            <div className="container pt-0 lg:w-7xl flex flex-col justify-center gap-10">
            {data.map((card, index) => (
                <Card1 
                    key={index}
                    imgSrc={card.image[0].url}
                    className=""
                    title={card.title.Title}
                    subtitle={card.subtitle.Title}
                    buttonText={card.button.Text}
                    order={index} // ✅ sửa ở đây
                >
                    {card.description}
                </Card1>
            ))}

            </div>
        </div>
    );
} 