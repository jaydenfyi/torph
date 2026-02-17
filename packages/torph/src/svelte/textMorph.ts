import type { Action } from "svelte/action";
import { TextMorph as Morph } from "../lib/text-morph";
import type { TextMorphOptions } from "../lib/text-morph/types";
import type { TextMorphDirectiveParams } from "./types";

const CONFIG_KEYS = [
  "debug",
  "locale",
  "scale",
  "duration",
  "ease",
  "disabled",
  "respectReducedMotion",
  "onAnimationStart",
  "onAnimationComplete",
] as const satisfies (keyof TextMorphOptions)[];

type ActionParams = TextMorphDirectiveParams | undefined;

function pruneNonMorphChildren(node: HTMLElement): void {
  Array.from(node.childNodes).forEach((child) => {
    const isMorphNode =
      child instanceof HTMLElement &&
      (child.hasAttribute("torph-item") || child.hasAttribute("torph-exiting"));

    if (!isMorphNode) {
      child.remove();
    }
  });
}

function toMorphOptions(
  node: HTMLElement,
  params: TextMorphDirectiveParams,
): TextMorphOptions {
  const { text: _text, ...options } = params;
  return {
    element: node,
    ...options,
  };
}

function hasConfigChanges(
  prev: TextMorphDirectiveParams,
  next: TextMorphDirectiveParams,
): boolean {
  return CONFIG_KEYS.some((key) => prev[key] !== next[key]);
}

function normalizeParams(
  params: ActionParams,
  fallbackText: string,
): TextMorphDirectiveParams {
  if (!params) {
    return { text: fallbackText };
  }

  return {
    ...params,
    text: params.text ?? fallbackText,
  };
}

export const textMorph: Action<HTMLElement, ActionParams> = (
  node,
  initialParams,
) => {
  let params = normalizeParams(initialParams, node.textContent ?? "");
  // The action owns this node's content. Prune framework-managed text nodes
  // so morph spans are the only rendered content.
  pruneNonMorphChildren(node);
  let morph = new Morph(toMorphOptions(node, params));
  morph.update(params.text);

  return {
    update(nextParams) {
      const next = normalizeParams(nextParams, params.text);
      const needsRemount = hasConfigChanges(params, next);
      params = next;

      // Svelte may reconcile text children before action updates.
      // Remove non-morph nodes to avoid duplicated visible text.
      pruneNonMorphChildren(node);

      if (needsRemount) {
        morph.destroy();
        morph = new Morph(toMorphOptions(node, params));
      }

      morph.update(params.text);
    },
    destroy() {
      morph.destroy();
    },
  };
};
