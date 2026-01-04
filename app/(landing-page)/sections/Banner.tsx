import { fetchAPI } from '@/lib/api';
import BannerContent from '../components/BannerContent';

interface BannerData {
    video: Array<{
        url: string;
    }>;
    subtitle: string;
    title: string;
    descriptions: string;
    button: {
        URL: string;
        Text: string;
    };
}

async function getData(): Promise<BannerData> {
    const response = await fetchAPI('about?populate=*');
    return response.data as BannerData;
}

export default async function Banner() {
    const data = await getData();
    return <BannerContent data={data} />;
} 