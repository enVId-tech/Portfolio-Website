import { NextResponse } from 'next/server';

/**
 * Cron job endpoint to periodically refresh the server-side projects cache
 * This should be called by an external cron service (e.g., Vercel Cron, GitHub Actions)
 * or a scheduled task to ensure the cache stays fresh.
 * 
 * Schedule recommendation: Every 15 minutes
 */
export async function GET(request: Request) {
    try {
        // Verify the request is from a trusted source (optional but recommended)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('[CRON] Starting projects cache refresh...');

        // Force refresh the projects cache by calling the projects API endpoint
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        // Refresh for both filter modes to ensure cache is up-to-date
        const excludeResponse = await fetch(`${baseUrl}/api/projects?filterMode=exclude&forceRefresh=true`, {
            cache: 'no-store'
        });
        
        const includeResponse = await fetch(`${baseUrl}/api/projects?filterMode=include&forceRefresh=true`, {
            cache: 'no-store'
        });

        const excludeData = await excludeResponse.json();
        const includeData = await includeResponse.json();

        const results = {
            exclude: {
                success: excludeData.success,
                projectCount: excludeData.projects?.length || 0,
                cached: excludeData.cached,
                timestamp: excludeData.timestamp
            },
            include: {
                success: includeData.success,
                projectCount: includeData.projects?.length || 0,
                cached: includeData.cached,
                timestamp: includeData.timestamp
            }
        };

        console.log('[CRON] Projects cache refresh completed:', results);

        return NextResponse.json({
            success: true,
            message: 'Projects cache refreshed successfully',
            results,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[CRON] Error refreshing projects cache:', error);
        
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to refresh cache',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// Also support POST for compatibility with some cron services
export async function POST(request: Request) {
    return GET(request);
}
