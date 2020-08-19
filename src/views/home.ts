import { Link } from '@app/domain';
import { View } from '@app/views/types';

type linksBySource = Array<{ source: string; links: Array<Link> }>;

const HOME_VIEW_LOCATION = 'templates/home.handlebars';

export function renderHomeView(links: Array<Link>): View {
  const aggregatedLinks = links.reduce<linksBySource>((acc, curr) => {
    const source = acc.find((e) => e.source === curr.source);
    if (source) {
      source.links.push(curr);
    } else {
      acc.push({ source: curr.source, links: [curr] });
    }
    return acc;
  }, []);

  return { templateLocation: HOME_VIEW_LOCATION, data: { sources: aggregatedLinks } };
}
