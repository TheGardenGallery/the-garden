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
            q: "Do you remember the first time a grid actually clicked for you, not as design but as something you wanted to stay inside?",
            a: "I don&rsquo;t remember the first time, but my love for grids goes back to my early graphic design days, 15-20 years ago. I discovered Swiss-style design back then, and grid-based design has remained an interest ever since.",
          },
          {
            code: "ZF",
            value: "4.92",
            q: "What is it about dividing a space that keeps pulling you back?",
            a: "It scratches an itch. There&rsquo;s just something in me loves grids and straight lines, and negative space. Over the years, I&rsquo;ve found that dividing space and playing with layout is a way to achieve visual complexity, which is the end goal.",
          },
          {
            code: "GC",
            value: "11.36",
            q: "When you&rsquo;re working, do you feel like you&rsquo;re organizing something, or uncovering something already there?",
            a: "Both, in certain ways. I&rsquo;m organizing various parts of the algorithm, and in doing that, it often spits out something great that I didn&rsquo;t expect.",
          },
          {
            code: "KO",
            value: "6.18",
            q: "The pieces feel like they&rsquo;re tracking something just out of reach. Do you ever imagine what they&rsquo;re actually measuring?",
            a: "I do. There isn&rsquo;t one answer, but I often imagined software that&rsquo;s measuring a nuclear reactor or some newly discovered unknown force. Something about tech from the 60s, 70s, or 80s measuring things it wasn&rsquo;t created for fascinates me.",
          },
          {
            code: "HXP",
            value: "9.74",
            q: "When something in the system starts to drift or break, what tells you to follow it rather than correct it?",
            a: "When it breaks beautifully. I don&rsquo;t know how to put it into words, but I just know it when I see it. I&rsquo;m always open to happy accidents.",
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
            a: "That&rsquo;s exactly what happened. I started out with graphic design, but after some years I felt that I could be doing more artistically, so I tried out 3D art using 3ds Max. I made some really interesting stuff with it, but I still felt limited. I moved on to Cinema 4D and it was a similar story for about 2 years. Once, I tried to create something simple in C4D, and it took 2 weeks of work. The end result still wasn&rsquo;t what I expected, so I tried it in Houdini. I recreated the C4D project in Houdini, and it took 30 minutes. I was hooked.",
          },
          {
            code: "WBP",
            value: "7.82",
            q: "Early on, did it feel intuitive, or did you have to push through a long period of resistance?",
            a: "Houdini does not feel intuitive at all if you&rsquo;re not familiar with it. It&rsquo;s like learning a new language. Your brain has to learn a completely new, non-destructive way of thinking about art and creation. It took about a year just to get used to the way that it wants you to think.",
          },
        ],
      },
      {
        label: "SEC.03",
        title: "Selecting",
        code: "SEL",
        breakVideo: "/images/ricky-retouch/works/wedge-07.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-07.jpg",
        questions: [
          {
            code: "BN",
            value: "9.18",
            q: "When you&rsquo;re selecting outputs, are you choosing a moment or a behavior over time? And do you ever lean toward something quieter because it holds up better under repetition?",
            a: "Sometimes I&rsquo;m choosing a moment, but most of the time I&rsquo;m choosing based on behavior over time. There are outputs that are quiet in the selection, but I&rsquo;ve had to discard many from the selection because they were a little too quiet or too tame.",
          },
          {
            code: "DDH",
            value: "4.85",
            q: "How much do you intervene after the system runs? Where does selection end and composition begin for you?",
            a: "I think the composition or creation phase is over when I feel there is nothing more to add to or subtract from the algorithm. The selection phase is always ongoing, from the first usable outputs until the last output is chosen.",
          },
        ],
      },
      {
        label: "SEC.04",
        title: "Space, motion, light",
        code: "LUM",
        breakVideo: "/images/ricky-retouch/works/wedge-09.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-09.jpg",
        questions: [
          {
            code: "AXA",
            value: "13.06",
            q: "The dots moving along the lines start to feel less like markers and more like signals. Do you think of them as having roles within the system?",
            a: "Yes. The dots, or &ldquo;walkers&rdquo; as I call them, have the central role in a lot of the pieces. They&rsquo;re supposed to represent the thing that&rsquo;s being measured.",
          },
          {
            code: "CR",
            value: "5.64",
            q: "The flicker and glow feel very specific, almost like phosphor lighting on older displays. What draws you to that kind of luminous surface?",
            a: "It reminds me of the screens that I grew up using, so there&rsquo;s a bit of a nostalgia to it.",
          },
          {
            code: "PSG",
            value: "11.92",
            q: "What is the world behind the color theory within the series?",
            a: "These are individual colors and color palettes that I&rsquo;ve developed over the years. There are a few constants. White is used to &ldquo;tie&rdquo; various colors together, and black is used to ground lighter/brighter colors. Overall, I&rsquo;m trying to recreate the look of a terminal and keep it familiar while still playing with it a bit.",
          },
        ],
      },
      {
        label: "SEC.05",
        title: "Language within",
        code: "LNG",
        breakVideo: "/images/ricky-retouch/works/wedge-11.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-11.jpg",
        questions: [
          {
            code: "VL",
            value: "8.49",
            q: "The typography feels tightly integrated into the system rather than laid on top. At what point does type enter the work for you?",
            a: "It&rsquo;s a central part of the collection. Before I added in the walkers or the noise fields, I had the typographic elements representing measurement.",
          },
          {
            code: "VY",
            value: "4.07",
            q: "What makes a typeface feel right inside these systems? Is it about legibility, rhythm, or something more atmospheric?",
            a: "It&rsquo;s more about how it feels. The collection is meant to feel like an old terminal screen that&rsquo;s measuring something unknown, so I was fine with some type elements not being fully legible. I was more concerned with the layout, the overall feeling, and how the values looked while counting.",
          },
        ],
      },
      {
        label: "SEC.06",
        title: "Memory and reference",
        code: "MEM",
        breakVideo: "/images/ricky-retouch/works/wedge-13.mp4",
        breakPoster: "/images/ricky-retouch/works/wedge-13.jpg",
        questions: [
          {
            code: "ZDM",
            value: "9.33",
            q: "What feels missing from contemporary digital imagery that makes you return to this older visual language?",
            a: "I don&rsquo;t think I feel that anything is missing. I just enjoy creating texture procedurally. In my previous collection, &ldquo;New North,&rdquo; that texture was paper-like. In this collection, it&rsquo;s more digital. Being able to add texture to my work like this really adds something special.",
          },
          {
            code: "JHK",
            value: "5.21",
            q: "The work carries a sense of a system that could have existed but didn&rsquo;t. What draws you toward that kind of almost-history?",
            a: "It&rsquo;s a little bit of escapism. Imagining these glowing screens that come from a different reality, measuring things that are unknown, is just fun.",
          },
        ],
      },
      {
        label: "SEC.07",
        title: "Perception over time",
        code: "PER",
        breakVideo: "/images/ricky-retouch/interview/sec-08-perception.mp4",
        breakPoster: "/images/ricky-retouch/interview/sec-08-perception.jpg",
        questions: [
          {
            code: "ZQ",
            value: "4.62",
            q: "Do you think of these as images, or as time-based objects that happen to repeat?",
            a: "I would say time-based objects. I want the pieces to be seen as moments in time that are being measured.",
          },
          {
            code: "CZE",
            value: "8.07",
            q: "Your earlier works &ldquo;Low Language&rdquo; and &ldquo;New North&rdquo; had a more paper-like surface. How did you arrive at this more screen-based, luminous direction?",
            a: "I loved the textures and the amount of detail I was able to put into those collections, so I wanted to create something similar but different. I thought about it for a bit, started playing with some ideas, and eventually settled on this CRT terminal look.",
          },
        ],
      },
    ],
  },
];

export const getInterview = (slug: string) =>
  interviews.find((i) => i.slug === slug);

export const getInterviewsList = () => interviews;
