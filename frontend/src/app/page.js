"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import hiringHero from "@/assets/illustrations/hiring_hero.png";

export default function Home() {
  const smarterWord = "SMARTER";
  const typewriterText = "sorting hassle.";

  // Typewriter states
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Typewriter effect loop
  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing letters
        setDisplayedText(typewriterText.substring(0, displayedText.length + 1));

        if (displayedText === typewriterText) {
          // Pause when word is complete before erasing
          setTypingSpeed(2500);
          setIsDeleting(true);
        } else {
          setTypingSpeed(120); // standard typing speed
        }
      } else {
        // Erasing letters
        setDisplayedText(typewriterText.substring(0, displayedText.length - 1));

        if (displayedText === "") {
          setIsDeleting(false);
          setTypingSpeed(600); // pause when empty before typing again
        } else {
          setTypingSpeed(60); // faster deleting speed
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, typingSpeed]);

  // Framer Motion variants for SMARTER looping wave
  const letterVariants = {
    animate: (index) => ({
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.15,
      },
    }),
  };

  return (
    <div className="relative min-h-screen bg-[#e8f2fe] text-slate-800 overflow-x-hidden font-sans">
      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#d0e5fc] rounded-full filter blur-xl opacity-70 -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#d8ebff] rounded-full filter blur-2xl opacity-60 -z-10" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#e0efff] rounded-full filter blur-lg opacity-80 -z-10" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-xl shadow-md">
              H
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              HireQuest
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#" className="hover:text-blue-600 transition-colors">
              ABOUT US
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              SERVICES
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              CONTACT
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Action trigger button */}
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.DASHBOARD}
              className={buttonVariants({
                variant: "default",
                className: "bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 shadow-md",
              })}
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* Hero split-layout */}
        <main className="grid gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-140px)] py-8">
          {/* Left Column */}
          <div className="space-y-6 max-w-xl">
            <h2 className="text-blue-600 text-lg md:text-xl font-bold tracking-wide uppercase">
              Hiring Automation
            </h2>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              RECRUIT <br />
              <span className="inline-flex text-blue-600 select-none">
                {smarterWord.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    animate="animate"
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Top-aligned paragraph height locker wrapper */}
            <div className="min-h-[150px] sm:min-h-[120px] md:min-h-[85px] block">
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                Streamline your hiring workflow with HireQuest. Automate candidate screening by creating interactive assessments, sending test links directly to applicants' emails, and tracking real-time analytics in a unified HR dashboard. Identify top talent instantly without the manual{" "}
                <br className="sm:hidden" />
                <span className="block sm:inline font-bold text-blue-600 select-none min-h-[1.5em] sm:min-h-0">
                  {displayedText || "\u00A0"}
                </span>
              </p>
            </div>

            <div className="pt-4">
              <Link
                href={ROUTES.DASHBOARD}
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide text-sm px-8 py-6 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105",
                })}
              >
                GET STARTED AS HR
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center items-center py-4">
            <div className="relative w-full max-w-md h-[300px] sm:h-[400px] drop-shadow-xl hover:scale-102 transition-transform duration-500">
              <Image
                src={hiringHero}
                alt="HR hiring automation team illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
