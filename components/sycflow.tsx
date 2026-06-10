"use client";

/*
 * SycFlow — Sycamore's operational area: the agent demo + business flow
 * (everything from the old "internal portal", minus the client portal, which
 * now lives behind the header's Internal/Client-portal toggle).
 */
import { AgentsWorkspace } from "@/components/agents-workspace";

export function SycFlow() {
  return <AgentsWorkspace />;
}
