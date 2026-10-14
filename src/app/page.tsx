import Link from "next/link"
import { Bld, Book, Cart, Cal, Search, Users } from "@/components/ui/Icons"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { FeatureCard } from "@/components/home/FeatureCard"

const features = [
  {
    icon: Bld,
    iconBg: "bg-[#ffecee]",
    iconColor: "text-[#ef4444]",
    title: "Grievance & Service Desk",
    description: "Report issues and track resolution in real-time.",
  },
  {
    icon: Book,
    iconBg: "bg-[#e8f1ff]",
    iconColor: "text-[#3b82f6]",
    title: "Academic Resource Vault",
    description: "Access notes, PYQs, lab manuals and more.",
  },
  {
    icon: Cart,
    iconBg: "bg-[#e4f9ee]",
    iconColor: "text-[#10b981]",
    title: "Student Marketplace",
    description: "Buy, sell and exchange items with verified students.",
  },
  {
    icon: Cal,
    iconBg: "bg-[#f5ebff]",
    iconColor: "text-[#a855f7]",
    title: "Campus Calendar",
    description: "Stay updated with classes, exams, events and deadlines.",
  },
  {
    icon: Search,
    iconBg: "bg-[#fff6dc]",
    iconColor: "text-[#f59e0b]",
    title: "Lost & Found",
    description: "Help campus belongings find their way home.",
  },
  {
    icon: Users,
    iconBg: "bg-[#e9ecff]",
    iconColor: "text-[#6366f1]",
    title: "Student Services",
    description: "Access your profile, notifications, and more.",
  },
]

export default function LandingPage() {
  return (
    <>
      <div className="land min-h-screen flex flex-col overflow-hidden text-[var(--color-ink)]">
        <header className="flex items-center justify-between w-full max-w-[1280px] mx-auto py-[22px] px-[32px]">
          <Link
            href="/"
            className="flex items-center gap-[10px] font-bold text-[20px]"
          >
            <i className="w-[30px] h-[30px] rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center not-italic text-[15px]">
              C
            </i>
            CampusCore
          </Link>
          <nav className="hidden lg:flex gap-[36px] text-[15px] text-[var(--color-mut)]">
            <Link href="#" className="text-[var(--color-navy)] font-semibold">
              Home
            </Link>
            <Link href="#features">Features</Link>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
          </nav>
          <div className="flex gap-[14px] items-center">
            <ThemeToggle className="w-[44px] h-[28px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] flex items-center justify-center text-[var(--color-ink)]" />
            <Link
              href="/login"
              className="px-[26px] py-[12px] rounded-full bg-[var(--color-navy)] text-white font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.3)]"
            >
              Login
            </Link>
          </div>
        </header>

        <section className="flex-1 w-full max-w-[1280px] mx-auto py-[50px] pb-[10vh] lg:pb-[15vh] px-[32px] grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-[40px] items-center">
          <div>
            <span className="inline-block px-[16px] py-[6px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[var(--color-navy)] text-[14px] mb-[28px]">
              Your Campus. One Platform.
            </span>
            <h1 className="text-[clamp(38px,5vw,58px)] leading-[1.1] tracking-[-1.5px] font-bold">
              Everything You Need,
              <br />
              As a{" "}
              <span className="bg-gradient-to-r from-[var(--color-blue-ref)] to-[#a855f7] bg-clip-text text-transparent">
                Student.
              </span>
            </h1>
            <p className="text-[var(--color-mut)] max-w-[440px] my-[24px] mb-[30px] text-[18px]">
              CampusCore is a unified campus portal that brings together student
              services, resources, marketplace, events and more, all in one
              place.
            </p>
            <div className="flex flex-wrap gap-[14px] mb-[44px]">
              <Link
                href="/login"
                className="px-[26px] py-[12px] rounded-full bg-[var(--color-navy)] text-white font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.3)]"
              >
                Get Started →
              </Link>
              <Link
                href="#features"
                className="px-[26px] py-[12px] rounded-full bg-[var(--color-card-ref)] text-[var(--color-ink)] border border-[var(--color-line)] font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.3)]"
              >
                Learn More ▷
              </Link>
            </div>
            <div className="flex gap-[40px]">
              <div>
                <b className="text-[18px] block">5+</b>
                <small className="text-[var(--color-mut)] text-[14px]">
                  Campus Services
                </small>
              </div>
              <div>
                <b className="text-[18px] block">10K+</b>
                <small className="text-[var(--color-mut)] text-[14px]">
                  Active Students
                </small>
              </div>
              <div>
                <b className="text-[18px] block">24/7</b>
                <small className="text-[var(--color-mut)] text-[14px]">
                  Access Anywhere
                </small>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] shadow-[0_30px_70px_rgba(59,90,200,0.22)] dark:shadow-[0_30px_70px_rgba(255,255,255,0.05)] grid grid-cols-1 sm:grid-cols-[150px_1fr] overflow-hidden text-[10px] transform-none lg:transform-[perspective(1400px)_rotateY(-9deg)_rotateX(3deg)]"
              aria-hidden="true"
            >
              <div className="hidden sm:flex flex-col gap-[3px] p-[12px_10px] border-r border-[var(--color-line)]">
                <b className="text-[11px] mb-[8px]">CampusCore</b>
                <span className="p-[6px_8px] rounded-[7px] bg-gradient-to-r from-[var(--color-navy)] to-[#2f4fb5] text-white flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Dashboard
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Tickets
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Academic Vault
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Marketplace
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Calendar
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Lost &amp; Found
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Notifications
                </span>
                <span className="p-[6px_8px] rounded-[7px] text-[var(--color-mut)] flex gap-[6px] items-center before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:border-[1.5px] before:border-current">
                  Profile
                </span>
                <img
                  src="/assets/promo.png"
                  alt=""
                  className="mt-[12px] w-full rounded-[8px]"
                />
              </div>
              <div className="p-[14px] grid gap-[10px] content-start min-w-0">
                <h4 className="text-[15px] font-semibold text-[var(--color-navy)]">
                  Good morning, Nimish 👋
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[6px]">
                  <div className="rounded-[9px] p-[8px] border border-[var(--color-line)] text-[var(--color-mut)] bg-gradient-to-br from-[var(--color-rd)] to-[var(--color-card-ref)] before:content-[''] before:block before:w-[16px] before:h-[16px] before:rounded-[5px] before:bg-[var(--color-card-ref)] before:mb-[6px] before:shadow-[0_1px_4px_rgba(30,58,138,0.15)]">
                    <b className="block text-[16px] text-[var(--color-ink)]">
                      3
                    </b>
                    Open Tickets
                  </div>
                  <div className="rounded-[9px] p-[8px] border border-[var(--color-line)] text-[var(--color-mut)] bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] before:content-[''] before:block before:w-[16px] before:h-[16px] before:rounded-[5px] before:bg-[var(--color-card-ref)] before:mb-[6px] before:shadow-[0_1px_4px_rgba(30,58,138,0.15)]">
                    <b className="block text-[16px] text-[var(--color-ink)]">
                      24
                    </b>
                    Resources
                  </div>
                  <div className="rounded-[9px] p-[8px] border border-[var(--color-line)] text-[var(--color-mut)] bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] before:content-[''] before:block before:w-[16px] before:h-[16px] before:rounded-[5px] before:bg-[var(--color-card-ref)] before:mb-[6px] before:shadow-[0_1px_4px_rgba(30,58,138,0.15)]">
                    <b className="block text-[16px] text-[var(--color-ink)]">
                      5
                    </b>
                    My Listings
                  </div>
                  <div className="rounded-[9px] p-[8px] border border-[var(--color-line)] text-[var(--color-mut)] bg-gradient-to-br from-[var(--color-pu)] to-[var(--color-card-ref)] before:content-[''] before:block before:w-[16px] before:h-[16px] before:rounded-[5px] before:bg-[var(--color-card-ref)] before:mb-[6px] before:shadow-[0_1px_4px_rgba(30,58,138,0.15)]">
                    <b className="block text-[16px] text-[var(--color-ink)]">
                      4
                    </b>
                    Events
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[6px]">
                  <div className="rounded-[9px] border border-[var(--color-line)] text-center p-[11px_4px] font-semibold text-[#e11d48]">
                    Raise Issue
                  </div>
                  <div className="rounded-[9px] border border-[var(--color-line)] text-center p-[11px_4px] font-semibold text-[#2563eb]">
                    Find Resources
                  </div>
                  <div className="rounded-[9px] border border-[var(--color-line)] text-center p-[11px_4px] font-semibold text-[#16a34a]">
                    Sell an Item
                  </div>
                  <div className="rounded-[9px] border border-[var(--color-line)] text-center p-[11px_4px] font-semibold text-[#9333ea]">
                    Report Lost
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-[8px]">
                  <div className="border border-[var(--color-line)] rounded-[10px] p-[10px] grid gap-[7px] content-start">
                    <b className="text-[12px]">Today's Schedule</b>
                    <i className="not-italic border border-[var(--color-line)] bg-[var(--color-bg)] rounded-[6px] p-[5px_8px] flex justify-between">
                      Data Structures
                      <span className="text-[var(--color-mut)]">10:00 AM</span>
                    </i>
                    <i className="not-italic border border-[var(--color-line)] bg-[var(--color-bg)] rounded-[6px] p-[5px_8px] flex justify-between">
                      Database Management
                      <span className="text-[var(--color-mut)]">12:00 PM</span>
                    </i>
                    <i className="not-italic border border-[var(--color-line)] bg-[var(--color-bg)] rounded-[6px] p-[5px_8px] flex justify-between">
                      Free Time
                      <span className="text-[var(--color-mut)]">2:00 PM</span>
                    </i>
                  </div>
                  <div className="bg-[#111a38] text-white rounded-[10px] p-[10px] grid gap-[6px] content-start">
                    <b className="text-[12px]">🔥 Campus Pulse</b>
                    <i className="not-italic border border-[rgba(255,255,255,0.12)] rounded-[6px] p-[5px_8px] flex justify-between">
                      DBMS PYQs
                    </i>
                    <i className="not-italic border border-[rgba(255,255,255,0.12)] rounded-[6px] p-[5px_8px] flex justify-between">
                      Hackathon 2026
                    </i>
                    <i className="not-italic border border-[rgba(255,255,255,0.12)] rounded-[6px] p-[5px_8px] flex justify-between">
                      New OS Notes
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="bg-[var(--color-card-ref)] text-[var(--color-ink)]"
        id="features"
      >
        <div className="max-w-[1180px] mx-auto py-[90px] px-[32px] md:py-[60px] md:px-[20px] text-center">
          <h2 className="text-[clamp(30px,4vw,40px)] tracking-[-1px] font-bold">
            Why CampusCore?
          </h2>
          <p className="text-[var(--color-mut)] text-[18px] my-[12px] mb-[56px]">
            Everything a student needs, in one simple platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] text-left">
            {features.map((feat) => (
              <FeatureCard
                key={feat.title}
                icon={feat.icon}
                iconBg={feat.iconBg}
                iconColor={feat.iconColor}
                title={feat.title}
                description={feat.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
