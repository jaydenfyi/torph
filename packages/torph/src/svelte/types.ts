import type { Action } from "svelte/action";
import type { ComponentType, SvelteComponent } from "svelte";
import type { TextMorphOptions } from "../lib/text-morph/types";

export interface TextMorphProps extends Omit<TextMorphOptions, "element"> {
  text: string;
  class?: string;
  style?: string;
  as?: string;
}

export interface TextMorphDirectiveParams
  extends Omit<TextMorphOptions, "element"> {
  text: string;
}

export type TextMorphAction = Action<
  HTMLElement,
  TextMorphDirectiveParams | undefined
>;

export declare const TextMorph: ComponentType<SvelteComponent>;
export declare const textMorph: TextMorphAction;
