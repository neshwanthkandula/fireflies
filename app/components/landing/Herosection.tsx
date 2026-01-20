"use client";

import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Play,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "../../../components/ui/animated-gradient-text";

const Herosection = () => {
  const { isSignedIn } = useUser();

  return (
    <div>
      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Meeting Bot</span>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Button asChild className="bg-blue-600">
                  <Link href="/home" >Dashboard</Link>
                </Button>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="bg-black/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Sign in
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Get started
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="group relative mx-auto flex w-fit items-center justify-center rounded-full px-4 py-1.5 mb-4">
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#3b82f6]/50 via-[#1d4ed8]/50 to-[#3b82f6]/50 bg-[length:300%_100%] p-[1px]"
              )}
            />
            <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            <hr className="mx-2 h-4 w-px bg-neutral-500" />
            <AnimatedGradientText className="text-sm font-medium text-gray-300">
              AI-Powered Meeting Assistant
            </AnimatedGradientText>
            <ChevronRight className="ml-1 w-4 h-4 stroke-neutral-500" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Transform Your Meetings with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-400">
            Automatic summaries, action items, and intelligent insights for every
            meeting. Never miss important details again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isSignedIn ? (
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4"
              >
                <Link
                  href="/home"
                  className="group flex items-center justify-center"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 group"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignUpButton>
            )}

            <Button
              variant="outline"
              size="lg"
              className="border-gray-700 bg-black/50 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Herosection;
