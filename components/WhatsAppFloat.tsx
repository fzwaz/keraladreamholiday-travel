import { SITE } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[80] flex items-center gap-2.5 rounded-full bg-[#3FA76B] px-[22px] py-[14px] text-sm font-medium text-white shadow-[0_8px_24px_rgba(31,51,36,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#369460] max-sm:bottom-[18px] max-sm:right-[18px] max-sm:px-[14px]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.87.5 3.62 1.4 5.14L2 22l5.13-1.5a9.9 9.9 0 004.9 1.3h.01c5.46 0 9.9-4.45 9.9-9.9C21.94 6.45 17.5 2 12.04 2zm5.8 14.2c-.24.7-1.4 1.34-1.93 1.4-.5.06-1.1.09-1.78-.11-.4-.13-.93-.3-1.6-.6-2.8-1.2-4.63-4-4.77-4.19-.14-.19-1.14-1.52-1.14-2.9s.72-2.05.98-2.33c.24-.27.53-.34.7-.34l.5.01c.16 0 .38-.06.6.46.24.57.8 1.98.87 2.12.07.14.11.3.02.48-.1.19-.14.3-.28.46-.14.16-.3.36-.42.48-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2 1.1.98 2.03 1.29 2.31 1.43.28.14.44.12.6-.07.17-.19.72-.84.91-1.13.19-.28.38-.24.63-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.13.07.7-.16 1.39z" />
      </svg>
      <span className="max-sm:hidden">How can I help you?</span>
    </a>
  );
}
