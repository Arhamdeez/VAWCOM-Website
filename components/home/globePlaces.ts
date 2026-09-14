import { PROJECTS } from '@/lib/work';

export type GlobePlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  blurb: string;
  projectIds: string[];
};

/** Client markets on the home globe. Add `projectIds` when a public write-up exists. */
export const GLOBE_PLACES: GlobePlace[] = [
  {
    id: 'france',
    name: 'France',
    lat: 46.6,
    lon: 2.2,
    blurb: 'We have worked with clients in France.',
    projectIds: [],
  },
  {
    id: 'germany',
    name: 'Germany',
    lat: 51.2,
    lon: 10.5,
    blurb: 'We have worked with clients in Germany.',
    projectIds: [],
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    lat: 9.1,
    lon: 8.7,
    blurb: 'We have worked with clients in Nigeria.',
    projectIds: [],
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    lat: 30.4,
    lon: 69.3,
    blurb: 'Based in Karachi, with client work across Pakistan.',
    projectIds: ['hisaab'],
  },
];

export function projectsForPlace(place: GlobePlace) {
  return place.projectIds
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter((p): p is (typeof PROJECTS)[number] => !!p);
}
