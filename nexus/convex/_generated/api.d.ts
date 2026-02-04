/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities_index from "../activities/index.js";
import type * as agents_index from "../agents/index.js";
import type * as messages_index from "../messages/index.js";
import type * as notifications_index from "../notifications/index.js";
import type * as standup_index from "../standup/index.js";
import type * as tasks_index from "../tasks/index.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "activities/index": typeof activities_index;
  "agents/index": typeof agents_index;
  "messages/index": typeof messages_index;
  "notifications/index": typeof notifications_index;
  "standup/index": typeof standup_index;
  "tasks/index": typeof tasks_index;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
