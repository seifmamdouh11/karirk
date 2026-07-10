import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Post from '@/models/Post';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://karirak.com';

  try {
    await connectDB();

    const [jobs, posts, categories] = await Promise.all([
      Job.find({ status: 'active' }).select('slug updatedAt').lean(),
      Post.find({ status: 'published' }).select('slug updatedAt').lean(),
      Category.find().select('slug').lean(),
    ]);

    const jobUrls: MetadataRoute.Sitemap = jobs.map((job: any) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const postUrls: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/jobs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];

    return [...staticUrls, ...categoryUrls, ...postUrls, ...jobUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static URLs if DB connection fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/jobs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}
