/* ==========================================================================
   Site content. Edit this file to add news or publications —
   both index.html and publications.html render from it.
   ========================================================================== */

/* News, newest first. `html` may contain links. */
window.NEWS = [
  {
    date: "Sep 2026",
    html: 'Our paper <a href="publications.html#artcrafter">ArtCrafter</a> is accepted to <b>NeurIPS 2026</b>! 🎉'
  },
  {
    date: "Jun 2026",
    html: '<a href="publications.html#showflow">ShowFlow</a> is accepted to <b>Neurocomputing 2026</b>. Finally, the son found his way home ^^'
  },
  {
    date: "Oct 2025",
    html: 'Honored to be named one of the <b>Top 5 Excellent Research Residents of the Year 2025</b> at Qualcomm AI Research. <a href="https://www.facebook.com/share/p/18G2y2piyW/" target="_blank" rel="noopener">Announcement</a>'
  },
  {
    date: "Jun 2025",
    html: 'Our paper <a href="publications.html#csd-var">CSD-VAR</a> is accepted to <b>ICCV 2025</b>. See you in Hawaii 🌺'
  },
  {
    date: "Apr 2025",
    html: 'Started as a Research Resident at <a href="https://www.qualcomm.com/research/artificial-intelligence" target="_blank" rel="noopener">Qualcomm AI Research</a>.'
  },
  {
    date: "Nov 2024",
    html: '<a href="https://arxiv.org/abs/2506.18493" target="_blank" rel="noopener">ShowFlow</a> is released, a unified image personalization framework from single- to condition-free multi-concept generation.'
  },
  {
    date: "Aug 2024",
    html: 'Defended my undergraduate thesis on image personalization and joined VinAI Research. Grateful to everyone who supported me along the way!'
  },
  {
    date: "Mar 2024",
    html: 'Our paper <a href="publications.html#artvista">ARtVista</a> is accepted to <b>CHI 2024</b> (Late-Breaking Work). 🎨'
  }
];

/* Publications, in display order. `*` after a name = equal contribution.
   teaser: "name" → looping video assets/img/teasers/name.mp4 (+ .jpg poster)
           { img: "file.jpg" } → still image;  { kind: "artcrafter" } → animated 3D reconstruction
   links:  { label, url } or { label, soon: true } for a "coming soon" badge */
window.PUBS = [
  {
    id: "artcrafter",
    short: "ArtCrafter",
    title: "ArtCrafter: Feed-Forward Generation of Articulated 3D Object with Analytic Joint Derivation",
    authors: ["Minh Canh Tu*", "Quang-Binh Nguyen*", "Khoi Nguyen"],
    venue: "NeurIPS 2026",
    venueFull: "Advances in Neural Information Processing Systems (NeurIPS), 2026",
    status: "accepted",
    teaser: { kind: "artcrafter" },
    links: [
      { label: "PDF", soon: true }
    ],
    tldr: "How can we generate a 3D object that actually moves, like a cabinet with a swinging door, from just two images of it closed and open? Learning articulation directly needs hand-annotated data, which remains scarce. ArtCrafter generates each part in both states and derives every joint analytically from how the part moves between them, so the model only needs to learn geometry, where strong 3D priors already exist."
  },
  {
    id: "showflow",
    short: "ShowFlow",
    title: "ShowFlow: From Robust Single Concept to Condition-Free Multi-Concept Generation",
    authors: ["Trong-Vu Hoang*", "Quang-Binh Nguyen*", "Thanh-Toan Do", "Tam V. Nguyen", "Minh-Triet Tran", "Trung-Nghia Le"],
    venue: "Neurocomputing 2026 · Q1 · IF 6.7",
    venueFull: "Neurocomputing, 2026 (Q1, Impact Factor 6.7)",
    status: "accepted",
    teaser: "demo_showflow",
    links: [
      { label: "Paper", url: "https://www.sciencedirect.com/science/article/abs/pii/S0925231226021144" },
      { label: "arXiv", url: "https://arxiv.org/abs/2506.18493" }
    ],
    tldr: "Can a model learn a specific person or object from a few reference images and generate it in unseen contexts? With so little data, fine-tuning tends to memorize the images rather than the identity. ShowFlow keeps the learned identity anchored to the model's prior semantics, both during fine-tuning and at inference, so it captures only what makes the subject distinct, from a single concept up to condition-free multi-concept generation."
  },
  {
    id: "csd-var",
    short: "CSD-VAR",
    title: "CSD-VAR: Content-Style Decomposition in Visual Autoregressive Models",
    authors: ["Quang-Binh Nguyen", "Minh Luu", "Quang Nguyen", "Anh Tran", "Khoi Nguyen"],
    venue: "ICCV 2025",
    venueFull: "International Conference on Computer Vision (ICCV), 2025",
    status: "accepted",
    teaser: "demo_csdvar",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2507.13984" },
      { label: "Project", url: "https://nqbinhcs.github.io/csd-var-page/" },
      { label: "Code", url: "https://github.com/visual-ar-group/CSD-VAR" }
    ],
    tldr: "Can we separate a subject from its artistic style when a single image shows both at once? The two are tightly entangled, and with only one example a model easily mixes them up. CSD-VAR builds on how visual autoregressive models draw from coarse to fine: early scales already carry style, later scales carry content, so it teaches each at the scale that naturally holds it."
  },
  {
    id: "scalebyscale",
    short: "ScaleByScale",
    title: "ScaleByScale: Understanding and Improving Test-Time Scaling for Visual Autoregressive Models",
    authors: ["Quang-Binh Nguyen*", "Minh Canh Tu*", "Khoi Nguyen"],
    venue: "Under review",
    venueFull: "Under review",
    status: "review",
    teaser: { img: "scalebyscale.jpg", alt: "ScaleByScale teaser: coarse-to-fine generation of visual autoregressive models with test-time scaling, and a GenEval vs. TFLOPS chart" },
    links: [
      { label: "Paper", url: "https://drive.google.com/file/d/1tD4dLZ5M6ajQLWhVuutdVLjI6_Jj1--L/view?usp=sharing" }
    ],
    tldr: "How much can we get from a model's built-in structure without retraining it at all? The common recipe of generating many images and keeping the best is expensive and ignores how the image is formed. ScaleByScale instead searches through the model's own coarse-to-fine generation stages, keeping the most promising partial image and refining it, so the output follows complex descriptions far more faithfully."
  },
  {
    id: "artvista",
    short: "ARtVista",
    title: "ARtVista: Gateway To Empower Anyone Into Artist",
    authors: ["Trong-Vu Hoang*", "Quang-Binh Nguyen*", "Duy-Nam Ly", "Khanh-Duy Le", "Tam V. Nguyen", "Minh-Triet Tran", "Trung-Nghia Le"],
    venue: "CHI 2024 · LBW",
    venueFull: "ACM CHI Conference on Human Factors in Computing Systems, Late-Breaking Work, 2024",
    status: "accepted",
    teaser: "demo_artvista",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2403.08876" },
      { label: "Video", url: "https://www.youtube.com/watch?v=vpL-Ttvp6Ds" }
    ],
    tldr: "How can people who cannot draw still paint what they imagine? Powerful generative models exist, but they are hard for non-experts to steer toward the picture in their head. ARtVista wraps diffusion-based art-style transfer in an interactive system, so anyone can turn a rough idea into artist-quality images."
  }
];
