/* Public GitHub data only. Secrets are used only in request headers and never saved. */
const fs = require('node:fs');
const path = require('node:path');
const { calendarFromHTML, summarizeCalendar, languageSummary, dateKey } = require('./profile-data.cjs');
const { makeCover, makeLinkButton, makeLanguageBadges, makeDashboard, makeTechMeters, makeSnakeSVG } = require('./design-art.cjs');
const { makeSnakeGIF } = require('./render-arcade.cjs');
const root = path.resolve(__dirname, '..');
const username = process.env.PROFILE_USERNAME || 'Tharindu336';
if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) throw new Error('Invalid GitHub username.');
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { 'User-Agent': 'Tharindu-Profile-Dashboard', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}) for ${new URL(url).pathname}. Existing generated assets were preserved.`);
  return response;
}
async function collect() {
  const user = await (await request(`https://api.github.com/users/${username}`)).json();
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await (await request(`https://api.github.com/users/${username}/repos?type=owner&per_page=100&page=${page}`)).json();
    repos.push(...batch); if (batch.length < 100) break;
    if (page === 10) throw new Error('Repository pagination limit exceeded; refusing partial totals.');
  }
  const own = repos.filter(r => !r.fork), languages = [];
  // Small concurrency batches respect unauthenticated rate limits.
  for (let i = 0; i < own.length; i += 4) languages.push(...await Promise.all(own.slice(i, i + 4).map(async repo => (await request(repo.languages_url)).json())));
  let days, source;
  if (token) {
    try {
      const query = 'query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}';
      const payload = await (await request('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify({ query, variables: { login: username } }) })).json();
      if (payload.errors || !payload.data?.user) throw new Error('Contribution query unavailable');
      days = payload.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(w => w.contributionDays).filter(d => d.date <= dateKey(Date.now())).map(d => ({ date: d.date, count: d.contributionCount })).slice(-365);
      source = 'GitHub GraphQL contribution calendar';
    } catch { console.log('GraphQL unavailable; using the public GitHub contribution calendar.'); }
  }
  if (!days) {
    const response = await request(`https://github.com/users/${username}/contributions`, { headers: { Accept: 'text/html', Authorization: '' } });
    days = calendarFromHTML(await response.text()); source = 'Public GitHub contribution calendar';
  }
  if (days.length < 300) throw new Error('Contribution calendar incomplete.');
  const data = {
    username, generatedAt: new Date().toISOString(), calendarSource: source,
    user: { name: user.name || username, url: user.html_url, publicRepos: user.public_repos, followers: user.followers, following: user.following, joined: user.created_at },
    stats: { ...summarizeCalendar(days), stars: own.reduce((n, r) => n + r.stargazers_count, 0), forks: own.reduce((n, r) => n + r.forks_count, 0), ownRepos: own.length },
    days, languages: languageSummary(languages), languageScope: 'Language bytes across owned public repositories; Jupyter Notebook files excluded.',
    recent: own.sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 5).map(r => ({ name: r.name, url: r.html_url, pushedAt: r.pushed_at, language: r.language }))
  };
  return data;
}
async function main() {
  const data = process.argv.includes('--cached') ? JSON.parse(fs.readFileSync(path.join(root, 'generated/profile-data.json'), 'utf8')) : await collect();
  // Render in memory before replacing the last known good snapshot.
  const dashboard = makeDashboard(data), snake = makeSnakeSVG(), gif = makeSnakeGIF();
  fs.mkdirSync(path.join(root, 'generated'), { recursive: true });
  const files = {
    'generated/profile-data.json': JSON.stringify(data, null, 2) + '\n',
    'profile-data.js': 'window.GITHUB_PROFILE = ' + JSON.stringify(data).replaceAll('<', '\\u003c') + ';\n',
    'profile-cover.svg': makeCover(),
    'profile-link-portfolio.svg': makeLinkButton('portfolio'),
    'profile-link-connect.svg': makeLinkButton('connect'),
    'profile-languages.svg': makeLanguageBadges(data),
    'profile-activity.svg': dashboard,
    'profile-tech.svg': makeTechMeters(data),
    'profile-snake-still.svg': snake,
    'profile-snake.gif': gif
  };
  for (const [file, contents] of Object.entries(files)) fs.writeFileSync(path.join(root, file), contents);
  console.log(`Generated dashboard: ${data.stats.total} contributions, ${data.stats.ownRepos} owned public repos, ${data.languages.length} languages. Snapshot ${data.generatedAt}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
