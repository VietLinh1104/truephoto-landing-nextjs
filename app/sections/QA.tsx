import ToggleContent from '@/app/components/ToggleContent';
import { fetchAPI } from '@/lib/api';

interface Answer {
    title: {
        Title: string;
    };
    description: string;
}

interface QAData {
    description: string;
    answer: Answer[];
}

async function getData(): Promise<QAData> {
    const response = await fetchAPI('section-5?populate=answer.title');
    return response.data;
}

export default async function QA() {
    const data = await getData();
    const answers = data.answer;

    return (
        <div className="section">
            <div className="container lg:w-7xl flex flex-col gap-10">
                <div className="flex flex-col lg:w-[736px] mx-auto">
                    <h4 className="mx-auto mb-3">8 Questions to Ask a <span className="text-primary">Real Estate Photographer</span></h4>
                    <p className="text-lg mx-auto text-center">{data.description}</p>
                </div>

                <div>
                    {answers.map((answer, index) => (
                        <ToggleContent
                            key={index} 
                            title={answer.title.Title}
                        >
                            {answer.description}
                        </ToggleContent>     
                    ))}
                </div>
            </div>
        </div>
    );
} 