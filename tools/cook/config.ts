import { type Config, type Exercise } from './core.ts';

const exercises: Exercise[] = [
  {
    id: '101-recipe-search',
    name: '101 - Recipe Search',
  },
  {
    id: '102-click-never-lands',
    name: '102 - The Click That Never Lands',
  },
  {
    id: '201-fake',
    name: '201 - Fake',
  },
  {
    id: '202-contract',
    name: '202 - Contract (bonus)',
  },
  {
    id: '301-angular-testing-skill',
    name: '301 - Angular Testing Skill',
  },
  {
    id: '302-runtime-truth-with-cdp',
    name: '302 - Runtime Truth with CDP',
  },
  {
    id: '401-review-fatigue',
    name: '401 - Review Fatigue',
  },
  {
    id: '402-charted-design',
    name: '402 - Charted Design',
  },
  {
    id: '403-charted-implementation',
    name: '403 - Charted Implementation',
  },
  {
    id: '404-charted-autopilot',
    name: '404 - Charted Autopilot',
  },
];

export const config: Config = {
  base: 'main',
  exercises,
};
