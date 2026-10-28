import FaqItem from './FaqItem';

type Faq = { q: string; a: string; link?: { label: string; href: string } };

/**
 * FAQs in two independent columns (one column on phones). Each card sits directly under the one above
 * it in its own column, so every gap is the same however many are open. A shared grid row would hold
 * the shorter card's neighbour at the taller height and leave uneven gaps.
 */
export default function FaqGrid({ items }: { items: readonly Faq[] }) {
  const render = (list: readonly Faq[]) =>
    list.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} link={item.link} />);

  return (
    <>
      <div className="flex flex-col gap-4 sm:hidden">{render(items)}</div>
      <div className="hidden items-start gap-4 sm:flex">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {render(items.filter((_, i) => i % 2 === 0))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {render(items.filter((_, i) => i % 2 === 1))}
        </div>
      </div>
    </>
  );
}
