"use client";

import { useState } from "react";
import { DEVICES, brands, compatible } from "@/lib/fx";
import { OrderLink, appear, chip } from "./OrderLink";

export function CoilFinder() {
  const [brand, setBrand] = useState<string>();
  const [deviceId, setDeviceId] = useState<string>();
  const device = DEVICES.find((d) => d.id === deviceId);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-xs font-semibold tracking-widest text-muted uppercase">1. Brand</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {brands().map((b) => (
            <button key={b} type="button" aria-pressed={brand === b} className={chip(brand === b)} onClick={() => { setBrand(b); setDeviceId(undefined); }}>
              {b}
            </button>
          ))}
        </div>
      </fieldset>
      {brand && (
        <fieldset key={brand} className={appear}>
          <legend className="text-xs font-semibold tracking-widest text-muted uppercase">2. Model</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {DEVICES.filter((d) => d.brand === brand).map((d) => (
              <button key={d.id} type="button" aria-pressed={deviceId === d.id} className={chip(deviceId === d.id)} onClick={() => setDeviceId(d.id)}>
                {d.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div aria-live="polite">
        {device && (
          <div key={device.id} className={appear}>
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">Fits the {device.name}</p>
            <ul className="mt-2 space-y-2">
              {compatible(device.id).map((p) => (
                <li key={p.id} className="rounded-xl border border-line bg-white/[0.04] p-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="mb-2 text-xs text-muted">{p.detail} · in stock</p>
                  <OrderLink text={`Hi, I'd like to order: ${p.name} for my ${device.name}`} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
