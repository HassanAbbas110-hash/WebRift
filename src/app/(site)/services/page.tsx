import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { extras, products } from "@/data/catalogue";
import { CtaSection } from "@/components/sections/CtaSection";
import { ServicesCatalogue, ServicesFromUrl } from "@/components/sections/ServicesCatalogue";

export const metadata: Metadata = {
  title: "Services",
  description: `All ${products.length} WebRift tools for local shops: storefronts, Google Maps, loyalty cards, review management, reports and stock control. Prices in rand.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">Services</p>
          <h1 className="font-display mt-3 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            {products.length} tools. <span className="text-grad">Pick what your shop needs.</span>
          </h1>
          <p className="mt-5 text-lg text-muted">
            Every price is our suggested starting price in rand, excluding VAT, next to what the market typically charges. Add anything to your quote in one tap.
          </p>
        </header>
        <div className="mt-12">
          <Suspense fallback={<ServicesCatalogue />}>
            <ServicesFromUrl />
          </Suspense>
        </div>

        <section className="mt-24">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Optional extras</h2>
          <p className="mt-2 text-muted">Bigger builds for specific shops. Priced to your setup.</p>
          <div className="card relative mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className="p-4 font-medium">Extra</th>
                  <th scope="col" className="p-4 font-medium">Best for</th>
                  <th scope="col" className="p-4 font-medium">Price</th>
                  <th scope="col" className="p-4"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {extras.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 font-semibold">{e.name}</th>
                    <td className="p-4 text-muted">{e.bestFor}</td>
                    <td className="p-4 text-cyan">Quote on request</td>
                    <td className="p-4 text-right">
                      <Link href={`/quote?x=${e.id}`} className="text-sm font-semibold whitespace-nowrap hover:text-cyan">Add to quote +</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <CtaSection />
    </>
  );
}
