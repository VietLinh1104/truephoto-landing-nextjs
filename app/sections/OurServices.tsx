import Card2 from '@/app/components/Card2';
import { fetchAPI } from '@/lib/api';

interface Card {
    image: Array<{
        url: string;
    }>;
    title: {
        Title: string;
    };
    button: {
        Text: string;
    };
    description: string;
}

async function getData(): Promise<Card[]> {
    const response = await fetchAPI('card-section-2s?populate=*');
    return response.data as Card[];
}

export default async function OurServices() {
    const data = await getData();

    function checkNumber(num: number): number {
        if (num === 0) {
            return 0;
        } else {
            return num % 2 === 0 ? 0 : 1;
        }
    }

    return (
        <div className="section">
            <div className="container lg:w-7xl pt-0 flex flex-col justify-center gap-20">
                <h2 className="text-primary mx-auto">Our Services</h2>

                {data.map((card, index) => (
                    <Card2 
                        key={index}
                        imgSrc={card.image[0].url}
                        className=""
                        title={card.title.Title}
                        buttonText={card.button.Text}
                        order={checkNumber(index)}
                    >
                        {card.description}
                    </Card2>
                ))}
            </div>
        </div>
    );
} 