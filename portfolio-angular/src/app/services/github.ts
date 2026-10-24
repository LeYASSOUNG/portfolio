import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface RepoStats {
  stars: number;
  forks: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com/repos/';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async getRepoStats(repoPath: string): Promise<RepoStats> {
    const cacheKey = `gh_stats_${repoPath}`;
    const cachedStats = this.getCachedStats(cacheKey);
    if (cachedStats) return cachedStats;

    return this.fetchLiveStats(repoPath, cacheKey);
  }

  private getCachedStats(cacheKey: string): RepoStats | null {
    if (!this.isBrowser) return null;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    const CACHE_DURATION_MS = 3600000;
    return Date.now() - timestamp > CACHE_DURATION_MS ? null : data;
  }

  private async fetchLiveStats(repoPath: string, cacheKey: string): Promise<RepoStats> {
    const fallback: RepoStats = { stars: 0, forks: 0 };

    if (!this.isBrowser) return fallback;

    const cachedStr = localStorage.getItem(cacheKey);
    const localFallback = cachedStr ? JSON.parse(cachedStr).data : fallback;

    try {
      const controller = new AbortController();
      const FETCH_TIMEOUT_MS = 5000;
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const response = await fetch(`${this.API_URL}${repoPath}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      return await this.handleResponse(response, repoPath, cacheKey, localFallback);
    } catch (error: any) {
      this.handleFetchError(error, repoPath);
      return localFallback;
    }
  }

  private async handleResponse(
    response: Response,
    repoPath: string,
    cacheKey: string,
    fallback: RepoStats,
  ): Promise<RepoStats> {
    const HTTP_NOT_FOUND = 404;
    const HTTP_FORBIDDEN = 403;

    if (response.status === HTTP_NOT_FOUND) {
      console.warn(`GitHub repository '${repoPath}' not found.`);
      return { stars: 0, forks: 0 };
    }
    if (response.status === HTTP_FORBIDDEN) {
      if (fallback.stars > 0 || fallback.forks > 0) return fallback;
      throw new Error('Rate limit exceeded');
    }
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

    const data = await response.json();
    const stats = { stars: data.stargazers_count || 0, forks: data.forks_count || 0 };
    if (this.isBrowser) {
      localStorage.setItem(cacheKey, JSON.stringify({ data: stats, timestamp: Date.now() }));
    }
    return stats;
  }

  private handleFetchError(error: any, repoPath: string): void {
    if (error.name === 'AbortError') {
      console.warn(`GitHub API request timed out for ${repoPath}.`);
    } else {
      console.warn(`Could not fetch live GitHub stats for ${repoPath}. Error: ${error.message}`);
    }
  }
}
