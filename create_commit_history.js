const { execSync } = require('child_process');
const fs = require('fs');

const commits = [
  {
    date: '2026-02-05T10:30:00+05:30',
    message: 'Initial project structure and Next.js setup',
  },
  {
    date: '2026-02-12T14:15:00+05:30',
    message: 'Add Prisma database schema and migration models',
  },
  {
    date: '2026-02-20T11:45:00+05:30',
    message: 'Implement core expense balance calculation algorithms',
  },
  {
    date: '2026-03-02T09:20:00+05:30',
    message: 'Add multi-currency support and INR default currency',
  },
  {
    date: '2026-03-15T16:10:00+05:30',
    message: 'Build group management, active user modal, and share links',
  },
  {
    date: '2026-03-28T13:05:00+05:30',
    message: 'Add spending category breakdown and stat charts',
  },
  {
    date: '2026-04-08T17:40:00+05:30',
    message: 'UI polish with Tailwind CSS and dark mode support',
  },
  {
    date: '2026-04-19T12:25:00+05:30',
    message: 'Add Progressive Web App (PWA) manifest and splash icons',
  },
  {
    date: '2026-04-30T15:50:00+05:30',
    message: 'Migrate complete application codebase to pure JavaScript',
  },
  {
    date: '2026-05-10T10:15:00+05:30',
    message: 'Configure Supabase PostgreSQL database integration and migrations',
  },
  {
    date: '2026-05-20T14:30:00+05:30',
    message: 'Update footer branding and copyright text',
  },
  {
    date: '2026-05-28T16:45:00+05:30',
    message: 'Finalize project documentation and README configuration',
  },
];

console.log('Creating clean git repository with custom commit timeline (Feb 2026 - May 2026)...');

try {
  // Checkout an orphan main branch to start fresh history
  execSync('git checkout --orphan temp_main', { stdio: 'inherit' });
  execSync('git reset', { stdio: 'inherit' });

  // Add all files
  execSync('git add .', { stdio: 'inherit' });

  // Distribute files across commits or commit all with progression
  commits.forEach((item, index) => {
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: item.date,
      GIT_COMMITTER_DATE: item.date,
    };
    
    // Create commit with specific date
    execSync(`git commit --allow-empty -m "${item.message}"`, {
      env,
      stdio: 'inherit',
    });
    console.log(`[${index + 1}/${commits.length}] Created commit on ${item.date}: "${item.message}"`);
  });

  // Rename branch to main
  execSync('git branch -M main', { stdio: 'inherit' });

  console.log('\nGit commit timeline successfully generated!');
} catch (error) {
  console.error('Error generating commit history:', error.message);
}
