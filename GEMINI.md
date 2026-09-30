# Confianza Event's and Entertainment — Project Business Knowledge & Architecture Standards

## Official Business Dossier
- **Brand**: Confianza Event's and Entertainment ("Where Weddings Become Stories")
- **Founder & Director**: Ashish Wankhede (`+91 7057357240`, `+91 9850983389`)
- **Operations Partner**: Rutik Pund (`+91 9850983389`)
- **Email**: `confianzaevents2024@gmail.com`
- **Address**: Indrayani Complex, Near Mr DIY, Warje Jakat Naka, Warje, Pune, Maharashtra - 411052
- **Philosophy**: "For us, your event is no less than our own. We believe every couple's love story is unique and deserves a heartfelt, personalized celebration."
- **10 Core Management Verticals**:
  1. Hospitality Management (Check-in, welcome packets, itineraries, key jackets)
  2. Logistics Management (Deliveries, layout, AV, transitions, guest shuttles & valet)
  3. Shadow Management (Dedicated bridal/groom shadowing, schedule, wardrobe & touch-ups)
  4. Ritual & Cultural Management (Baraat, Milni, Varmala, Saptapadi, Pandits, Havan Samagri)
  5. Production & Decor Management (Floral architecture, 2D/3D layouts, stage & mandap fabrication)
  6. Food & Beverage (F&B) Management (Menu curation, bar service, guest dining oversight)
  7. Artist & Entertainment Management (Musicians, DJs, Emcees, Singers, technical riders)
  8. Show Runner & Ground Direction (Minute-by-minute master cue sheet, real-time sync)
  9. Event Stationery & Branding (Custom luggage tags, welcome cards, key jackets, itineraries)
  10. Welcome Hostesses (Traditional attire, flower showers, royal aarti welcome)
- **3-Phase Methodology**:
  - Phase 01: Consultation (60–90 Mins Vision & Budget Session)
  - Phase 02: Strategic Planning & 3D Spatial Design
  - Phase 03: On-Ground Execution & Show Running

## Mandatory Speed & Rendering Architecture Standards
1. **In-Memory API Caching**: Cache aggregated site reads (60s TTL); bust cache on mutations.
2. **MongoDB Connection Pooling**: `maxPoolSize: 10`, `minPoolSize: 2`, `family: 4` (IPv4).
3. **Data Stream Separation**: Public visitors fetch only public data; inquiries fetched on-demand for admin.
4. **Dynamic Reveal Observers**: `MutationObserver` on `useReveal` with viewport rect checks.
5. **Skeleton Shimmer Loaders**: Render skeleton placeholders during initial loading.
