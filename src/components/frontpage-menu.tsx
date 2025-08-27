import { CalendarIcon, ChatBubbleIcon, ClockIcon, PersonIcon, ReaderIcon, StarIcon } from "@radix-ui/react-icons"
import { div } from "framer-motion/client"
import { BentoCard, BentoGrid } from "@/components/bento-grid"
import { Marquee } from "@/components/marquee"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const highscores = [
  {
    name: "Experience",
    score: "#119 Level 1080",
    achievement: "Core Wetterwachs",
  },
  {
    name: "Magic Level",
    score: "#120 Mlvl 122",
    achievement: "Kaelas Flameborn",
  },
  {
    name: "Sword Fighting",
    score: "#4 134",
    achievement: "Core Wetterwachs",
  },
  {
    name: "Axe Fighting",
    score: "#16 128",
    achievement: "Rhateus",
  },
  {
    name: "Club Fighting",
    score: "#58 122",
    achievement: "Core Wetterwachs",
  },
]

const features = [
  {
    Icon: CalendarIcon,
    name: "Events",
    description: "Track upcoming events",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "View Events",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
  {
    Icon: ClockIcon,
    name: "Timeline",
    description: "Browse the history of Red Rose",
    href: "#",
    cta: "View Timeline",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out group-hover:scale-105 opacity-20">
          <div className="space-y-4 p-18">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
              <div className="h-2 bg-rose-300 rounded w-32"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
              <div className="h-2 bg-pink-300 rounded w-40"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
              <div className="h-2 bg-rose-300 rounded w-28"></div>
            </div>
          </div>
        </div>
        {/* <div
          className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 rounded-lg opacity-80"
          style={{
            backgroundImage: 'url(/old_rr_screenshot.PNG)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label="Red Rose Timeline"
        /> */}
      </div>
    ),
  },
  {
    Icon: PersonIcon,
    name: "Roster",
    description: "View guild members, their vocations, and current status",
    href: "#",
    cta: "View Roster",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90">
        <div className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out group-hover:scale-90 opacity-20">
          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="bg-rose-100 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-rose-300 rounded-full mx-auto mb-1"></div>
              <div className="h-1 bg-rose-400 rounded w-full mb-1"></div>
              <div className="h-1 bg-rose-300 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="bg-pink-100 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-pink-300 rounded-full mx-auto mb-1"></div>
              <div className="h-1 bg-pink-400 rounded w-full mb-1"></div>
              <div className="h-1 bg-pink-300 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="bg-rose-100 rounded-lg p-2 text-center">
              <div className="w-8 h-8 bg-rose-300 rounded-full mx-auto mb-1"></div>
              <div className="h-1 bg-rose-400 rounded w-full mb-1"></div>
              <div className="h-1 bg-rose-300 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
        {/* <div
          className="absolute right-2 top-4 h-[300px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90 rounded-lg opacity-80"
          style={{
            backgroundImage: 'url(/tibia_vocations.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label="Guild Roster"
        /> */}
      </div>
    ),
  },
  {
    Icon: ReaderIcon,
    name: "Codex",
    description: "Read our codex",
    href: "#",
    cta: "Read More",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="text-center space-y-4 p-8">
          <div
            className="mx-auto mb-4"
            style={{
              width: 50,
              height: 50,
              backgroundImage: 'url(./public/Red_Rose.gif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
            }}
          />          
          <div className="text-sm text-muted-foreground max-w-md">
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: StarIcon,
    name: "Highscores",
    description: "Track members high scores",
    href: "/highscores",
    cta: "View Rankings",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {highscores.map((player, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">{player.name}</figcaption>
                <p className="text-xs font-medium text-amber-500">{player.score}</p>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{player.achievement}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: ChatBubbleIcon,
    name: "Forums",
    description: "Join discussions, connect with members and apply to the guild",
    href: "https://redrose-guild.com/",
    cta: "Visit Forums",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="grid grid-cols-2 gap-4 p-6 w-full">
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="h-2 bg-primary/60 rounded w-3/4"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-2/3"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="h-2 bg-red-500/60 rounded w-2/3"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-3/4"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="h-2 bg-amber-500/60 rounded w-1/2"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-full"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="h-2 bg-blue-500/60 rounded w-4/5"></div>
            <div className="h-1.5 bg-muted-foreground/40 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function FrontpageMenu() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
