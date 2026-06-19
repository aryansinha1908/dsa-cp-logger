import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (url.includes('leetcode.com')) {
      return await fetchLeetCodeData(url);
    } else if (url.includes('codeforces.com')) {
      return await fetchCodeforcesData(url);
    }

    return NextResponse.json({ error: 'Platform not supported' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

async function fetchLeetCodeData(url: string) {
  try {
    const match = url.match(/problems\/([^\/]+)/);
    if (!match) throw new Error('Invalid LeetCode URL');
    const titleSlug = match[1];

    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          title
          difficulty
          topicTags {
            name
          }
        }
      }
    `;

    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { titleSlug }
    });

    const data = res.data.data.question;
    
    return NextResponse.json({
      title: data.title,
      platform: 'LeetCode',
      difficulty: data.difficulty,
      tags: data.topicTags.map((t: any) => t.name)
    });
  } catch (error) {
    throw new Error('Failed to fetch from LeetCode');
  }
}

async function fetchCodeforcesData(url: string) {
  try {
    // URL forms: 
    // https://codeforces.com/problemset/problem/1900/A
    // https://codeforces.com/contest/1900/problem/A
    let contestId, index;
    const problemsetMatch = url.match(/problemset\/problem\/(\d+)\/([A-Z0-9]+)/);
    const contestMatch = url.match(/contest\/(\d+)\/problem\/([A-Z0-9]+)/);

    if (problemsetMatch) {
      contestId = problemsetMatch[1];
      index = problemsetMatch[2];
    } else if (contestMatch) {
      contestId = contestMatch[1];
      index = contestMatch[2];
    } else {
      throw new Error('Invalid Codeforces URL');
    }

    // Fetch contest standings with 1 row to get problem metadata
    const res = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    const problems = res.data.result.problems;
    const problem = problems.find((p: any) => p.index === index);

    if (!problem) throw new Error('Problem not found');

    return NextResponse.json({
      title: problem.name,
      platform: 'Codeforces',
      difficulty: problem.rating ? problem.rating.toString() : 'Unrated',
      tags: problem.tags || []
    });
  } catch (error) {
    throw new Error('Failed to fetch from Codeforces');
  }
}
