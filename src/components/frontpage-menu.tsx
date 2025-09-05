import { CalendarIcon, ChatBubbleIcon, ClockIcon, GearIcon, PersonIcon, ReaderIcon, StarIcon } from "@radix-ui/react-icons"
import { TrophyIcon } from "lucide-react"
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
    className: "col-span-2 lg:col-span-1",
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
    className: "col-span-2 lg:col-span-2",
    background: (
      <div className="absolute inset-0 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110">
        <div 
          className="w-full h-full bg-cover bg-center filter sepia-[0.3] hue-rotate-[315deg] saturate-150"
          style={{
            backgroundImage: 'url("/old_rr_screenshot.PNG")',
          }} 
        />
      </div>
    ),
  },
  {
    Icon: PersonIcon,
    name: "Roster",
    description: "View guild members, their vocations, and current status",
    href: "/roster",
    cta: "View Roster",
    className: "col-span-2 lg:col-span-2",
    background: (
      <div className="absolute inset-0 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110">
        <div 
          className="w-full h-full bg-center filter sepia-[0.3]"
          style={{
            backgroundImage: 'url("/vocations.png")',
          }} 
        />
      </div>
    ),
  },
  {
    Icon: ReaderIcon,
    name: "Codex",
    description: "Read our codex",
    href: "https://www.redrose-guild.com/viewtopic.php?t=61&sid=77e793602bfe2fcbea1791cd7739464f",
    cta: "Read More",
    className: "col-span-2 lg:col-span-1",
    background: (
      <div className="absolute inset-0 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-70">
        <div
          className="w-full opacity-40 h-full bg-cover bg-center filter sepia-[0.3]"
          style={{
            backgroundImage: 'url("/Red_Rose.gif")',
          }} 
        />
      </div>
    ),
  },
  {
    Icon: StarIcon,
    name: "Highscores",
    description: "Track members high scores",
    href: "/highscores",
    cta: "View Rankings",
    className: "col-span-2 lg:col-span-2",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {highscores.map((player) => (
          <figure
            key={player.name}
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
    Icon: TrophyIcon,
    name: "Weekly Leaderboard",
    description: "This week's top levelers",
    href: "/gains",
    cta: "View Leaderboard",
    className: "col-span-2 lg:col-span-1",
    background: (
<div></div>
    ),
  },
  {
    Icon: ChatBubbleIcon,
    name: "Forums",
    description: "Join the discussions on our forum",
    href: "https://redrose-guild.com/",
    cta: "Visit Forums",
    className: "col-span-4 lg:col-span-2",
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
    {
    Icon: GearIcon,
    name: "Tools",
    description: "Useful Tibia tools",
    href: "#",
    cta: "View Tools",
    className: "col-span-2 lg:col-span-1",
    background: (
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="grid grid-cols-2 gap-3 p-6 w-full max-w-sm">
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 aspect-square flex flex-col justify-center items-center">
            <div className="w-6 h-6 bg-primary/60 rounded-md"></div>
            <div className="h-1 bg-muted-foreground/40 rounded w-3/4"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 aspect-square flex flex-col justify-center items-center">
            <div className="w-6 h-6 bg-blue-500/60 rounded-md"></div>
            <div className="h-1 bg-muted-foreground/40 rounded w-2/3"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 aspect-square flex flex-col justify-center items-center">
            <div className="w-6 h-6 bg-amber-500/60 rounded-md"></div>
            <div className="h-1 bg-muted-foreground/40 rounded w-4/5"></div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 aspect-square flex flex-col justify-center items-center">
            <div className="w-6 h-6 bg-green-500/60 rounded-md"></div>
            <div className="h-1 bg-muted-foreground/40 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ),
  }
]

export default function FrontpageMenu() {
  return (
    <BentoGrid>
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  )
}