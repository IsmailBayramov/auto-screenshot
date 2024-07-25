import { NextResponse } from 'next/server';
import { formatISO, parseISO } from 'date-fns';

export async function POST(req) {
    try {
        const { schedule } = await req.json();
        const [start, end] = schedule.split('-');

        // Получаем текущую дату в формате YYYY-MM-DD
        const today = formatISO(new Date(), { representation: 'date' });

        // Создаем даты для начала и конца времени
        const startTime = parseISO(`${today}T${start}:00`).getTime();
        const endTime = parseISO(`${today}T${end}:00`).getTime();

        if (endTime <= startTime) {
            return NextResponse.json({ message: 'Invalid time range' }, { status: 400 });
        }

        const generateRandomTimes = (count) => {
            const times = [];
            for (let i = 0; i < count; i++) {
                const randomTime = startTime + Math.random() * (endTime - startTime);
                times.push(formatISO(new Date(randomTime)));
            }
            return times.sort();
        };

        const sendRandomRequests = async () => {
            const randomTimes = generateRandomTimes(3);
            const now = Date.now();
            // const port = process.env.PORT || 3000;
            // const baseUrl = `${process.env.BASE_URL || 'http://localhost'}:${port}`;
            const baseUrl = 'http://localhost:3523';

            const requests = randomTimes.map((time) => {
                const randomTime = new Date(time).getTime();
                const delay = randomTime - now;
                if (delay > 0) {
                    return new Promise((resolve) => setTimeout(async () => {
                        try {
                            await fetch(`${baseUrl}/api/screenshot`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            resolve();
                        } catch (error) {
                            console.error('Error sending request:', error);
                            resolve();
                        }
                    }, delay));
                } else {
                    console.log('Random time already passed:', time);
                    return Promise.resolve();
                }
            });
            await Promise.all(requests);
        };

        await sendRandomRequests();

        return NextResponse.json({ message: 'Requests scheduled' }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
