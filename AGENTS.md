<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Confianza Event's and Entertainment — Official Business Knowledge Base

This document contains the verified business intelligence extracted from official company profiles:
- `MANAGEMENT SERVICE BY CONFIANZA'25.pdf`
- `WEDDINGS PROFILE OF CONFIANZA.pdf_c.pdf`

Every agent working on this codebase MUST use these exact business facts, contacts, services, and brand voice across all text, components, and pages.

---

## 1. Brand Identity & Philosophy
- **Brand Name**: Confianza Event's and Entertainment / Confianza Events
- **Taglines**: 
  - *"Where Weddings Become Stories"*
  - *"Making Your Dream Wedding A Reality"*
- **Core Brand Voice**:
  - *"At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. Meet our team of wedding wizards obsessed with love, laughter, and happily ever afters."*
  - *"For us, your event is no less than our own. To make it a hassle-free and special celebration, we provide end-to-end luxury management."*
  - *"We believe every couple's love story is unique, and that's what inspires us to create truly personalized weddings."*

---

## 2. Key Leadership & Contact Details
- **Founder & Lead Director**: Ashish Wankhede
  - **Phone / WhatsApp**: `+91 7057357240` (also reachable at `+91 9850983389`)
- **Operations & Management Partner**: Rutik Pund
  - **Phone**: `+91 9850983389`
- **Official Email**: `confianzaevents2024@gmail.com`
- **Studio & Office Address**:
  - Indrayani Complex, Near Mr DIY, Warje Jakat Naka, Warje, Pune, Maharashtra - 411052
- **Instagram**: `@confianza_events`

---

## 3. The 10 Core Management Verticals
1. **Hospitality Management**:
   - Royal welcoming of guests upon arrival with traditional aarti & flower showers.
   - Comprehensive guest check-in management, welcome desk, and room allocations.
   - Distribution of customized welcome hampers, itineraries, key jackets, and luggage tags.
   - Dedicated guest concierge for local transportation, accommodations, and itinerary inquiries.
2. **Logistics Management**:
   - End-to-end vendor transit, staging deliveries, setup supervision, and inventory tracking.
   - Venue spatial layout, audio-visual schematics, lighting, and power backup management.
   - Punctual transitions between functions (Mehendi -> Sangeet -> Pheras -> Reception).
   - Valet parking, convoy escorts, and airport/station guest shuttles.
3. **Shadow Management**:
   - Discreet, dedicated personal coordinators assigned to the Bride, Groom, and VIP family members.
   - Keeping the couple on schedule without intruding on special moments.
   - Handling last-minute needs: bridal wardrobe steaming, emergency makeup touch-ups, hydration, and jewelry care.
   - Direct liaison between couple and photographers/planners.
4. **Ritual & Cultural Management**:
   - Authentic coordination of traditional rituals (Baraat, Milni, Varmala, Saptapadi, Pheras, Haldi, Sindoor Daan).
   - Complete priest/pandit coordination and spiritual schedule adherence.
   - Preparation and management of ritual samagri, havan kund, kalash, pooja thalis, and mandap sacred items.
5. **Production & Decor Management**:
   - Bespoke spatial architecture, floral installations, thematic stage design, and mandap engineering.
   - 2D/3D CAD layout visualizations before fabrication.
   - Structural safety compliance, lighting ambience, acoustic calibration, and post-event teardown.
6. **Food & Beverage (F&B) Management**:
   - Master menu curation, live food counter orchestration, and tasting sessions.
   - Beverage and signature cocktail bar management.
   - Strict monitoring of food temperature, hygiene, replenishment, and guest dining satisfaction.
7. **Artist & Entertainment Management**:
   - Booking and coordinating celebrity artists, Sufi/Bollywood live bands, DJs, emcees, folk performers, and choreographers.
   - Handling technical riders, stage sound checks, green room hospitality, and itinerary syncing.
8. **Show Runner & Ground Direction**:
   - Central show director controlling the master minute-by-minute cue sheet.
   - Real-time communication across lighting, sound, hospitality, and catering teams.
   - Instant resolution of on-ground surprises.
9. **Event Stationery & Branding**:
   - Bespoke wedding stationery: personalized itinerary cards, luggage tags, room key jackets, welcome cards, and thematic signage.
10. **Welcome Hostesses & Royal Entourage**:
    - Professional hostesses in coordinated traditional attire.
    - Royal welcoming rituals, rose petal showers, and ushering VIP guests.

---

## 4. 3-Phase Luxury Workflow Methodology
- **Phase 01: Personalized Consultation (60–90 Mins)**:
  - Deep-dive into couple's love story, wedding vision, aesthetic preferences, guest count, and budget allocations.
  - Presenting a customized wedding planning proposal with transparent milestone pricing.
- **Phase 02: Strategic Planning & 3D Spatial Design**:
  - Venue lockdown, vendor negotiations, 3D CAD decor mockups, stationery printing, artist riders, and master timeline drafting.
- **Phase 03: On-Ground Execution & Show Running**:
  - Full deployment of shadow managers, ground directors, hospitality check-in, F&B supervision, and calm, royal execution so the couple and families celebrate as honored guests.

---

# High-Performance Speed & Rendering Architecture Standards
1. **Server In-Memory Caching**: Cache multi-collection reads in memory with 60s TTL; bust immediately on mutations.
2. **MongoDB Connection Pooling**: Use `maxPoolSize: 10`, `minPoolSize: 2`, `connectTimeoutMS: 5000`, `socketTimeoutMS: 30000`, `family: 4` (IPv4).
3. **Data Stream Separation**: Public pages fetch only public site data; admin inbox fetched strictly on-demand.
4. **Dynamic Mutation-Aware Reveal Observers**: All `.reveal` elements are detected dynamically via `MutationObserver` with immediate viewport rect checks.
5. **Skeleton Shimmer Loading States**: Always render skeleton cards during initial loading.
