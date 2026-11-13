# WebRift cinematic motion implementation plan

Goal: add a distinctive scroll-driven project collision/assembly sequence, layered hero movement, animated gallery transitions and a keyboard-accessible image viewer, with site-wide adaptive Lite mode.

Approved direction: retain branding, copy, services and pricing. Existing GSAP and Motion dependencies are sufficient; no physics engine, smooth-scroll hijacking or new libraries. The collision effect is a choreographed animation of actual project previews, not a simulation. Normal document scrolling remains native.

- [ ] Write and demonstrate failing policy tests for reduced motion, device/network signals, saved overrides, unavailable signals and sustained slow frames.
- [ ] Implement a reactive shared Auto/Full/Lite preference; default SSR is static, preferences persist when storage works, and all existing FX observe the same mode. Reduced motion and data saving are hard limits.
- [ ] Add a lazily enhanced project convergence/impact/fan-out scene with a usable static fallback and cleanup on resize, route departure or Lite switching.
- [ ] Add hero parallax/reveal, gallery layout transitions and a native-dialog image viewer with keyboard navigation and restored focus.
- [ ] Run tests, lint, types and production build; browser-check Full, Lite, persistence, image viewer, quote totals and navigation; publish a reviewed Git-backed build and verify live.

Risks to check: no hidden content before JS; Lite toggles remove pinning and transforms; links keep working; a native dialog traps focus and Escape closes; unknown hardware defaults conservatively; hidden-tab pauses must not trigger false performance downgrade. No database, auth, pricing or dependency changes.
