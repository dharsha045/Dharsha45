# Implementation Plan: Fix Share Modal Display & Responsive Backdrop Dismiss

Make the **Open on Phone / Share Link dialog** (`ShareAppModal`) fully visible across all mobile screens, add backdrop-click dismissal, Escape key listener, and internal scrolling so content is never cut off on smaller screens.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following requirements:
> - **Target Element**: The "Open on Phone / Share Link" dialog (`ShareAppModal`)
> - **Behavior**: Add backdrop click to close and make the dialog scrollable and fully visible on small mobile screens.

- **Confirmed Decision 1**: Add an interactive backdrop click handler on the fixed outer overlay so tapping anywhere outside the modal card instantly closes it.
- **Confirmed Decision 2**: Stop click event propagation inside the modal content box (`e.stopPropagation()`) so clicking links, copying URLs, or scanning the QR code does not accidentally trigger closing.
- **Confirmed Decision 3**: Add `max-h-[90vh] flex flex-col` to the modal container and make the body scrollable (`overflow-y-auto`) with proper safe padding, ensuring that on phones in landscape or small viewport heights the QR code, link input, and action buttons are 100% visible and accessible.
- **Confirmed Decision 4**: Add a global `Escape` key event listener so desktop and keyboard users can dismiss the modal immediately with Esc.

---

## 1. Overview & Core Concept

- **What It Does**: Prevents the Share modal from being clipped or stuck open on mobile screens. Ensures seamless closing via outside-click, Escape key, or top-right close icon.
- **Key Value**: Flawless mobile viewport support, zero cutoff buttons, and smooth touch-dismiss UX.

---

## 2. Technical Architecture & Component Mapping

```
┌─────────────────────────────────────────────────────────────┐
│ Outer Overlay (fixed inset-0, onClick -> onClose)           │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Modal Card (max-h-[90vh] flex flex-col)             │   │
│   │                                                     │   │
│   │ [Header] LifeLink                      [X Close]    │   │
│   │─────────────────────────────────────────────────────│   │
│   │ [Scrollable Body: overflow-y-auto p-4 sm:p-6]       │   │
│   │ - Info note                                         │   │
│   │ - Responsive QR code (compact on small screens)     │   │
│   │ - Custom URL box + Copy Link button                 │   │
│   │ - Share via WhatsApp & Native Share buttons         │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Components to Update
- `src/components/ShareAppModal.tsx`:
  - Attach `onClick={onClose}` to the outer backdrop with `role="dialog"` and `aria-modal="true"`.
  - Add `onClick={(e) => e.stopPropagation()}` to the inner card.
  - Set `max-h-[90vh] flex flex-col` and scrollable content body (`overflow-y-auto`).
  - Add `useEffect` listener for `keydown` (`Escape` key).
