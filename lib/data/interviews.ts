import type { Interview } from "@/lib/types";

/**
 * Long-form interviews with artists. Each entry becomes a page at
 * `/interviews/[slug]` rendered by `app/interviews/[slug]/page.tsx`.
 *
 * Format is inspired by Ricky Retouch's own work: a dark phosphor-grid
 * transcript — indexed question/answer cells, monospace readouts,
 * section-break plates showing silent looping wedges from the series.
 *
 * The section-break media list is traversed in order as the reader
 * descends; we pick a set of wedges that drifts across the palette
 * zones (green → amber → cyan → rose) so the color register shifts
 * as the conversation moves through its sections.
 */
export const interviews: Interview[] = [
  {
    slug: "ricky-retouch",
    artistName: "Ricky Retouch",
    artistSlug: "ricky-retouch",
    title: "Unknown Variables",
    exhibitionSlug: "split-logic",
    exhibitionTitle: "Split Logic",
    interviewer: "Ivan Zhyzhkevych",
    interviewerRole: "Curator",
    number: "001",
    date: "May 2026",
    preamble:
      "A conversation with Ricky Retouch on grids, loops, typography, and the ghost of a system that could have existed. Recorded ahead of Split Logic.",
    heroVideo: "/images/ricky-retouch/split-logic-hero-blur.mp4",
    heroPoster: "/images/ricky-retouch/split-logic-hero-blur.jpg",
    sections: [
      {
        label: "SEC.01",
        title: "Through the grid",
        code: "CRX",
        breakVideo: "/images/ricky-retouch/works/wedge-01.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-01.jpg",
        questions: [
          {
            code: "CL",
            value: "8.040",
            q: "Do you remember the first time a grid actually clicked for you — not as design but as something you wanted to stay inside?",
            a: "",
          },
          {
            code: "ZF",
            value: "4.92",
            q: "What is it about dividing a space that keeps pulling you back?",
            a: "",
          },
          {
            code: "GC",
            value: "11.36",
            q: "When you&rsquo;re working, do you feel like you&rsquo;re organizing something, or uncovering something already there?",
            a: "",
          },
          {
            code: "KO",
            value: "6.18",
            q: "The pieces feel like they&rsquo;re tracking something just out of reach. Do you ever imagine what they&rsquo;re actually measuring?",
            a: "",
          },
          {
            code: "HXP",
            value: "9.74",
            q: "When something in the system starts to drift or break, what tells you to follow it rather than correct it?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.02",
        title: "Building with the system",
        code: "BLD",
        breakVideo: "/images/ricky-retouch/works/wedge-03.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-03.jpg",
        questions: [
          {
            code: "XM",
            value: "5.50",
            q: "What made you commit to Houdini? Was there a moment where it gave you something other tools couldn&rsquo;t?",
            a: "",
          },
          {
            code: "WBP",
            value: "7.82",
            q: "Early on, did it feel intuitive, or did you have to push through a long period of resistance?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.03",
        title: "Holding the loop",
        code: "LUP",
        breakVideo: "/images/ricky-retouch/works/wedge-05.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-05.jpg",
        questions: [
          {
            code: "ZH",
            value: "12.04",
            q: "At what point does something you&rsquo;re watching shift from &ldquo;just running&rdquo; into something you want to hold onto?",
            a: "",
          },
          {
            code: "MCI",
            value: "4.41",
            q: "Do you recognize a loop as something already present in the system, or something you have to carve out?",
            a: "",
          },
          {
            code: "HTX",
            value: "8.434",
            q: "When you&rsquo;re isolating a sequence, what allows it to withstand repetition?",
            a: "",
          },
          {
            code: "OC",
            value: "10.49",
            q: "When you watch the same loop repeatedly, what are you looking for to decide if it holds?",
            a: "",
          },
          {
            code: "OK",
            value: "6.27",
            q: "When a loop repeats over time, does it become clearer to you, or start to lose something?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.04",
        title: "Selecting",
        code: "SEL",
        breakVideo: "/images/ricky-retouch/works/wedge-07.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-07.jpg",
        questions: [
          {
            code: "BN",
            value: "9.18",
            q: "When you&rsquo;re selecting outputs, are you choosing a moment or a behavior over time? And do you ever lean toward something quieter because it holds up better under repetition?",
            a: "",
          },
          {
            code: "DDH",
            value: "4.85",
            q: "How much do you intervene after the system runs? Where does selection end and composition begin for you?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.05",
        title: "Space, motion, light",
        code: "LUM",
        breakVideo: "/images/ricky-retouch/works/wedge-09.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-09.jpg",
        questions: [
          {
            code: "TWH",
            value: "7.31",
            q: "At what point did that dimensional quality become important, rather than incidental?",
            a: "",
          },
          {
            code: "AXA",
            value: "13.06",
            q: "The dots moving along the lines start to feel less like markers and more like signals. Do you think of them as having roles within the system?",
            a: "",
          },
          {
            code: "CR",
            value: "5.64",
            q: "The flicker and glow feel very specific, almost like phosphor lighting on older displays. What draws you to that kind of luminous surface?",
            a: "",
          },
          {
            code: "PSG",
            value: "11.92",
            q: "What is the world behind the color theory within the series?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.06",
        title: "Language within",
        code: "LNG",
        breakVideo: "/images/ricky-retouch/works/wedge-11.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-11.jpg",
        questions: [
          {
            code: "VL",
            value: "8.49",
            q: "The typography feels tightly integrated into the system rather than laid on top. At what point does type enter the work for you?",
            a: "",
          },
          {
            code: "VY",
            value: "4.07",
            q: "What makes a typeface feel right inside these systems? Is it about legibility, rhythm, or something more atmospheric?",
            a: "",
          },
          {
            code: "UX",
            value: "10.18",
            q: "The labels and numbers feel partly functional and partly abstract. Do they begin with meaning, or become meaningful through placement?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.07",
        title: "Memory and reference",
        code: "MEM",
        breakVideo: "/images/ricky-retouch/works/wedge-13.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-13.jpg",
        questions: [
          {
            code: "YHN",
            value: "6.74",
            q: "Was there a specific film, interface, or visual environment that still lingers in how these pieces look or behave?",
            a: "",
          },
          {
            code: "ZDM",
            value: "9.33",
            q: "What feels missing from contemporary digital imagery that makes you return to this older visual language?",
            a: "",
          },
          {
            code: "JHK",
            value: "5.21",
            q: "The work carries a sense of a system that could have existed but didn&rsquo;t. What draws you toward that kind of almost-history?",
            a: "",
          },
        ],
      },
      {
        label: "SEC.08",
        title: "Perception over time",
        code: "PER",
        breakVideo: "/images/ricky-retouch/interview/sec-08-perception.mp4",
        breakPoster: "/images/ricky-retouch/interview/sec-08-perception.jpg",
        questions: [
          {
            code: "DBK",
            value: "11.45",
            q: "When watching a loop repeat, does your perception of the piece change over time?",
            a: "",
          },
          {
            code: "ZQ",
            value: "4.62",
            q: "Do you think of these as images, or as time-based objects that happen to repeat?",
            a: "",
          },
          {
            code: "CZE",
            value: "8.07",
            q: "Your earlier works &ldquo;Low Language&rdquo; and &ldquo;New North&rdquo; had a more paper-like surface. How did you arrive at this more screen-based, luminous direction?",
            a: "",
          },
        ],
      },
    ],
  },
];

export const getInterview = (slug: string) =>
  interviews.find((i) => i.slug === slug);

export const getInterviewsList = () => interviews;
