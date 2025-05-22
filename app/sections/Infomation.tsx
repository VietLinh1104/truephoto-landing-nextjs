import { fetchAPI } from '@/lib/api';

interface InfomationData {
    description: string;
}

async function getData(): Promise<InfomationData> {
    const response = await fetchAPI('infomation?populate=*');
    return response.data;
}

export default async function Infomation() {
    const data = await getData();

    return (
        <div className="section">
            <div className="container lg:w-7xl flex flex-col justify-center gap-10 pb-10 !pt-0">
                <div>
                    <h2 className="text-secondary font-w01-rounded-light text-center mb-5">
                        Vancouver & Tri-Cities Trusted <br />
                        <span className="font-w01-rounded-regular text-2xl lg:text-4xl text-primary">
                            Real Estate Media
                        </span> Provider
                    </h2>
                    <p className="lg:w-[736px] text-center mx-auto">{data.description}</p>
                </div>
            </div>
        </div>
    );
} 