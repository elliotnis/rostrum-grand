import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

// Animate presentation groups, leaving article prose, forms and navigation immediately usable.
const REVEAL_TARGETS = [
  ".intro-grid",
  ".perspective-principles",
  ".section-heading",
  ".strategy-card",
  ".process-tabs",
  ".create-image",
  ".create-copy",
  ".connection-copy",
  ".connection-diagram",
  ".insight-card",
  ".philanthropy-teaser > .container",
  ".connect-band > .container",
  ".universe-intro",
  ".strategy-section",
  ".lab-tab-heading",
  ".alpha-criteria",
  ".lab-diligence-intro",
  ".lab-pillar-grid",
  ".distribution-world",
  ".vision-layout",
  ".values-layout",
  ".story-layout",
  ".global-section > .container",
  ".team-card",
  ".giving-row",
  ".archive-card",
  ".related-grid > a",
  ".contact-city",
].join(", ");
const STAGGERED_TARGETS =
  ".strategy-card, .insight-card, .team-card, .archive-card, .related-grid > a";

export function PageMotion({ paused }: { paused: boolean }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (paused || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const hero = document.querySelector<HTMLElement>(
      "#main-content > .home-hero, #main-content > .page-hero, #main-content > .article-header, #main-content > .contact-page",
    );
    // Setting the same attribute again does not replay an entrance when a dialog closes.
    hero?.setAttribute("data-motion-enter", "");
  }, [pathname, paused]);

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (
      !root ||
      !("IntersectionObserver" in window) ||
      !("animate" in HTMLElement.prototype)
    ) {
      return;
    }

    const preference = window.matchMedia(REDUCED_MOTION_QUERY);
    let disposed = false;
    const registered = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();

    const showImmediately = (target: HTMLElement) => {
      const animation = animations.get(target);
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animations.delete(target);
      }
      target.dataset.motionState = "visible";
    };

    const reveal = (target: HTMLElement) => {
      if (
        preference.matches ||
        target.contains(document.activeElement) ||
        target.getBoundingClientRect().bottom <= 0
      ) {
        showImmediately(target);
        return;
      }

      const siblings = Array.from(target.parentElement?.children ?? []);
      const order = target.matches(STAGGERED_TARGETS)
        ? Math.max(0, siblings.indexOf(target)) % 3
        : 0;
      target.dataset.motionState = "revealing";
      // Content stays visible until it enters the viewport. No CSS hides pending elements.
      // The individual translate property preserves the existing hover transforms.
      const animation = target.animate(
        [
          { opacity: 0, translate: "0 14px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: 480,
          delay: order * 50,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      );
      animations.set(target, animation);
      animation.onfinish = () => {
        animations.delete(target);
        target.dataset.motionState = "visible";
        animation.cancel();
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (disposed) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          observer.unobserve(target);
          reveal(target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );

    const collect = () => {
      if (disposed) return;
      for (const target of registered) {
        if (!root.contains(target)) {
          observer.unobserve(target);
          showImmediately(target);
          registered.delete(target);
        }
      }
      root.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach((target) => {
        if (
          registered.has(target) ||
          target.parentElement?.closest("[data-motion-target]")
        ) {
          return;
        }
        const bounds = target.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;

        registered.add(target);
        target.setAttribute("data-motion-target", "");
        if (preference.matches || bounds.top < window.innerHeight - 24) {
          showImmediately(target);
        } else {
          target.dataset.motionState = "pending";
          observer.observe(target);
        }
      });
    };

    const handleFocus = (event: FocusEvent) => {
      const target = (event.target as Element).closest<HTMLElement>(
        "[data-motion-target]",
      );
      if (!target) return;
      observer.unobserve(target);
      showImmediately(target);
    };
    const handlePreference = () => {
      if (!preference.matches) return;
      observer.disconnect();
      registered.forEach(showImmediately);
      root.querySelectorAll("[data-motion-enter]").forEach((hero) => {
        hero.removeAttribute("data-motion-enter");
      });
    };

    collect();
    // Newly loaded articles, archive results and tab contents receive the same treatment.
    const mutations = new MutationObserver(collect);
    mutations.observe(root, { childList: true, subtree: true });
    root.addEventListener("focusin", handleFocus);
    preference.addEventListener("change", handlePreference);

    return () => {
      disposed = true;
      observer.disconnect();
      mutations.disconnect();
      root.removeEventListener("focusin", handleFocus);
      preference.removeEventListener("change", handlePreference);
      registered.forEach((target) => {
        showImmediately(target);
        target.removeAttribute("data-motion-target");
        target.removeAttribute("data-motion-state");
      });
      animations.clear();
    };
  }, [pathname]);

  return null;
}
