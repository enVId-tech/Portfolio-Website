import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://etran.dev';
    const currentDate = new Date();

    return [
        // {
        //     url: baseUrl,
        //     lastModified: currentDate,
        //     changeFrequency: 'weekly',
        //     priority: 1,
        // },
        // {
        //     url: `${baseUrl}/blogs`,
        //     lastModified: currentDate,
        //     changeFrequency: 'daily',
        //     priority: 0.8,
        // },
        // {
        //     url: `${baseUrl}/register`,
        //     lastModified: currentDate,
        //     changeFrequency: 'monthly',
        //     priority: 0.3,
        // },
    ];
}
