import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://hacker-news.firebaseio.com/v0/topstories.json', () =>
    HttpResponse.json([1,2,3,4,5])
  ),
  http.get('https://hacker-news.firebaseio.com/v0/newstories.json', () =>
    HttpResponse.json([101,102,103])
  ),
  http.get('https://hacker-news.firebaseio.com/v0/item/:id.json', ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      title: `Story ${params.id}`,
      by: 'tester',
      score: 42,
      time: Math.floor(Date.now()/1000) - 3600,
      url: 'https://example.com'
    })
  ),
];
