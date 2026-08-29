'use strict';
module.exports = [
  {
    slug: 'glove-failures',
    title: 'Why Gloves Kept Failing Every Mission',
    dek: 'Seventy years and three space programs. The same subsystem remained the single most persistent mission limiter: the glove.',
    publishDate: '2026-08-29',
    lastModified: '2026-08-29',
    author: 'Metakosmos Group',
    relatedSuits: ['gemini-g4c', 'apollo-a7l', 'apollo-a7lb', 'shuttle-emu', 'enhanced-emu', 'berkut'],
    relatedFailures: ['FAIL-002', 'FAIL-005', 'FAIL-006'],
    body: `
<p class="edit-body">Every space program that has put humans outside a vehicle has produced the same finding: the glove is the hardest problem in the suit. Not the life support system, not the helmet, not the pressure bladder. The glove.</p>

<p class="edit-body">The reason is physics. A pressurised glove opposes every finger movement. At 4.3 psi — the standard US EVA pressure — an open hand requires roughly 30 Newton-metres of torque to close into a fist. Over a six-hour EVA, that cumulative load is the mechanical equivalent of several hundred hand-grip repetitions at maximum effort. Blisters, nail avulsion, and hand fatigue were documented from Gemini onward and have never been fully eliminated.</p>

<h2 class="sh" style="font-size:1.4rem;margin:2rem 0 1rem">Gemini: The First Documentation</h2>

<p class="edit-body">Ed White's Gemini IV EVA in June 1965 was the first US spacewalk. The mission report flagged glove performance as a limiting factor within minutes of egress. White's gloves provided inadequate thermal insulation at the finger tips and the pressure-induced stiffness reduced grip dexterity faster than predicted. FAIL-002 documents the full engineering finding: root cause was insufficient thermal insulation at finger joints combined with pressure stiffness uncharacterised at mission duration.</p>

<p class="edit-body">The corrective action was to increase insulation layering in the A5L and A7L glove families — which introduced a new problem. Each additional layer reduced tactile feedback. By Apollo, astronauts reported difficulty distinguishing between switch positions by touch alone during EVA. The engineering community had traded one failure mode for another.</p>

<h2 class="sh" style="font-size:1.4rem;margin:2rem 0 1rem">Soviet parallel: BERKUT and Leonov</h2>

<p class="edit-body">Alexei Leonov's Voskhod 2 EVA in March 1965 produced the Soviet programme's first documented glove failure (FAIL-005). The BERKUT suit's gloves were soft-construction with double rubber bladders. During the twelve-minute EVA, suit over-pressurisation caused the gloves to balloon rigidly. Leonov could not actuate the airlock hatch with his hands in that state and had to partially deflate the suit to regain mobility — a decision that brought him to the edge of hypoxia.</p>

<p class="edit-body">The Soviet response was architectural rather than incremental: all subsequent EVA suits in the Orlan family use a rear-entry hard upper torso with integrated gloves on rotating wrist disconnects, reducing the pressure differential the glove assembly must sustain. This is still the Orlan design today. The US programme took a different path — modular gloves with standardised wrist disconnects — which created a supply chain dependency that persists into the Enhanced EMU era.</p>

<h2 class="sh" style="font-size:1.4rem;margin:2rem 0 1rem">EMU Pre-Phase VI: The Nail Avulsion Problem</h2>

<p class="edit-body">FAIL-006 — EMU Pre-Phase VI glove injuries — represents the most extensively documented glove failure series in the archive. Between 1998 and 2012, multiple ISS EVA crewmembers experienced fingernail delamination (nail avulsion) caused by repetitive contact between the fingertip and the glove's inner pressure bladder. The injury is not catastrophic but is mission-limiting: severe enough cases result in early EVA termination.</p>

<p class="edit-body">The Phase VI glove, introduced in 2009, redesigned the fingertip geometry to eliminate the contact point. Incident frequency dropped significantly post-introduction. The lesson — that fingertip fit is as critical as bulk glove pressure performance — had been visible in the data from Gemini onward but required four decades of operational evidence before it drove a redesign.</p>

<h2 class="sh" style="font-size:1.4rem;margin:2rem 0 1rem">The unsolved problem</h2>

<p class="edit-body">The torque-thermal paradox at the finger joint level has not been resolved. Thinner materials reduce resistance torque but reduce thermal insulation and abrasion resistance. Thicker materials solve thermal and durability problems but reintroduce the pressure-stiffness that limited Gemini. No material combination deployed in operational suits has broken this trade-off.</p>

<p class="edit-body">AxEMU and the xEMU before it both identified glove performance as a primary design driver. Neither programme has published a solution that differs fundamentally from the Phase VI approach. For the lunar south pole — which simultaneously presents cold-shadow temperatures below -170°C and direct sun temperatures above +120°C — the existing thermal range of any operational glove design is insufficient.</p>

<p class="edit-body">Seventy years of documented failures, three sovereign programmes, twelve distinct glove development lines in the archive. The glove remains open.</p>
`
  }
];
