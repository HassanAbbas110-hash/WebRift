import { waLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with WebRift on WhatsApp"
      data-fab
      className="group fixed right-5 bottom-5 z-50 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.7)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
    >
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25d366] opacity-40 motion-safe:animate-ping [animation-duration:2.5s]" />
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" className="relative">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.56.94.95-3.47-.23-.36a9.4 9.4 0 1 1 7.99 4.41zm8-17.4A11.3 11.3 0 0 0 12.05.8C5.8.8.72 5.88.72 12.13c0 2 .52 3.95 1.52 5.66L.62 23.7l6.05-1.59a11.3 11.3 0 0 0 5.38 1.37h.01c6.24 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01z" />
      </svg>
    </a>
  );
}
