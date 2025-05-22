import { fetchAPI } from '@/lib/api';

interface ContentBlock {
    id: number;
    title: {
        Title: string;
    };
    content: string;
}

interface Section3Data {
    title: {
        Title: string;
    };
    backgroundImage: {
        url: string;
    };
    description: string;
    contentBlock: ContentBlock[];
}

async function getData(): Promise<Section3Data> {
    const response = await fetchAPI('section3?populate[backgroundImage]=true&populate[contentBlock][populate]=title&populate[title]=true');
    return response.data;
}

export default async function Section3() {
    const data = await getData();
    const title = data.title.Title;
    const imgURL = data.backgroundImage.url;
    const description = data.description;
    const contentBlocks = data.contentBlock;

    return (
        <div 
            className="section bg-cover bg-center" 
            style={{ backgroundImage: `url(${imgURL})` }}
        >
            <div className="container lg:w-7xl lg:flex gap-15 items-center">
                <div className="text-white lg:w-1/2 mb-10">
                    <h3 className="mb-1">{title}</h3>
                    <p>{description}</p>
                </div>

                <div className="flex flex-col gap-5 text-white lg:w-1/2">
                    {contentBlocks.map((contentBlock) => (
                        <div key={contentBlock.id} className="bg-[#1a1a1a] bg-opacity-50 px-10 py-5">
                            <h4 className="font-w01">{contentBlock.title.Title}</h4>
                            <p>{contentBlock.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 