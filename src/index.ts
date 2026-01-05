/**
 * @seriphxyz/react - React hooks for Seriph widgets
 *
 * @example Subscribe form
 * ```tsx
 * import { useSubscribe } from '@seriphxyz/react';
 *
 * function Newsletter() {
 *   const { subscribe, status, error } = useSubscribe({
 *     siteKey: 'your-site-key',
 *   });
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *     const email = new FormData(e.currentTarget).get('email') as string;
 *     subscribe(email);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="email" name="email" required />
 *       <button disabled={status === 'loading'}>
 *         {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
 *       </button>
 *       {status === 'success' && <p>Thanks for subscribing!</p>}
 *       {status === 'error' && <p>Error: {error?.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  SubscribeController,
  FormController,
  ReactionsController,
  CommentsController,
  WaitlistController,
  ViewCountsController,
  FeedbackController,
  PollController,
  AnnouncementsController,
  resolveConfig,
  type SeriphConfig,
  type SubscribeState,
  type FormState,
  type ReactionsState,
  type CommentsState,
  type WaitlistState,
  type ViewCountsState,
  type FeedbackState,
  type PollState,
  type AnnouncementsState,
  type Comment,
  type Announcement,
  type PollWithResults,
  type FeedbackType,
  type ControllerStatus,
} from "@seriphxyz/core";

// Re-export types from core
export type {
  SeriphConfig,
  SubscribeState,
  FormState,
  ReactionsState,
  CommentsState,
  WaitlistState,
  ViewCountsState,
  FeedbackState,
  PollState,
  AnnouncementsState,
  Comment,
  Announcement,
  PollWithResults,
  FeedbackType,
  ReactionCounts,
  SeriphPost,
  FetchPostsOptions,
  FetchPostOptions,
  ControllerStatus,
} from "@seriphxyz/core";

// Re-export API functions and helpers from core
export {
  fetchPosts,
  fetchPost,
  getConfigFromMeta,
  resolveConfig,
  DEFAULT_ENDPOINT,
  API_PATH,
} from "@seriphxyz/core";

// =============================================================================
// Config types - siteKey is optional when using meta tag fallback
// =============================================================================

type OptionalSiteKey<T extends SeriphConfig> = Omit<T, "siteKey"> & {
  /** Site key - optional if <meta name="seriph-site-key"> is set */
  siteKey?: string;
};

// ============================================================================
// useSubscribe
// ============================================================================

export interface UseSubscribeOptions extends OptionalSiteKey<SeriphConfig> {}

export interface UseSubscribeReturn {
  status: ControllerStatus;
  message: string | null;
  error: Error | null;
  subscribe: (email: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling email subscriptions.
 *
 * @example
 * ```tsx
 * const { subscribe, status, message, error } = useSubscribe({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => subscribe('user@example.com')}>Subscribe</button>
 * ```
 */
export function useSubscribe(options: UseSubscribeOptions): UseSubscribeReturn {
  const controllerRef = useRef<SubscribeController | null>(null);
  const [state, setState] = useState<SubscribeState>({
    status: "idle",
    message: null,
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new SubscribeController(config);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);
    return unsubscribe;
  }, [options.siteKey, options.endpoint]);

  const subscribe = useCallback(async (email: string) => {
    await controllerRef.current?.submit(email);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.reset();
  }, []);

  return { ...state, subscribe, reset };
}

// ============================================================================
// useForm
// ============================================================================

export interface UseFormOptions extends OptionalSiteKey<SeriphConfig> {
  /** Form slug/identifier */
  formSlug: string;
}

export interface UseFormReturn {
  status: ControllerStatus;
  message: string | null;
  error: Error | null;
  submit: (data: Record<string, unknown>) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling form submissions.
 *
 * @example
 * ```tsx
 * const { submit, status, error } = useForm({
 *   siteKey: 'your-site-key',
 *   formSlug: 'contact',
 * });
 *
 * const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *   e.preventDefault();
 *   const formData = new FormData(e.currentTarget);
 *   submit(Object.fromEntries(formData));
 * };
 * ```
 */
export function useForm(options: UseFormOptions): UseFormReturn {
  const controllerRef = useRef<FormController | null>(null);
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: null,
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new FormController(config, options.formSlug);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);
    return unsubscribe;
  }, [options.siteKey, options.endpoint, options.formSlug]);

  const submit = useCallback(async (data: Record<string, unknown>) => {
    await controllerRef.current?.submit(data);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.reset();
  }, []);

  return { ...state, submit, reset };
}

// ============================================================================
// useReactions
// ============================================================================

export interface UseReactionsOptions extends OptionalSiteKey<SeriphConfig> {
  /** Content identifier (e.g., post slug) */
  contentId: string;
  /** Auto-fetch reactions on mount (default: true) */
  autoFetch?: boolean;
}

export interface UseReactionsReturn {
  counts: Record<string, number>;
  userReactions: string[];
  status: ControllerStatus;
  error: Error | null;
  addReaction: (type: string) => Promise<void>;
  removeReaction: (type: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for handling reactions (likes, claps, etc.).
 *
 * @example
 * ```tsx
 * const { counts, userReactions, addReaction, removeReaction } = useReactions({
 *   siteKey: 'your-site-key',
 *   contentId: 'my-post-slug',
 * });
 *
 * <button onClick={() => addReaction('like')}>
 *   Like ({counts.like || 0})
 * </button>
 * ```
 */
export function useReactions(options: UseReactionsOptions): UseReactionsReturn {
  const controllerRef = useRef<ReactionsController | null>(null);
  const [state, setState] = useState<ReactionsState>({
    counts: {},
    userReactions: [],
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new ReactionsController(config, options.contentId);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);

    // Auto-fetch on mount (default: true)
    if (options.autoFetch !== false) {
      controller.fetch();
    }

    return unsubscribe;
  }, [options.siteKey, options.endpoint, options.contentId]);

  const addReaction = useCallback(async (type: string) => {
    await controllerRef.current?.add(type);
  }, []);

  const removeReaction = useCallback(async (type: string) => {
    await controllerRef.current?.remove(type);
  }, []);

  const refresh = useCallback(async () => {
    await controllerRef.current?.fetch();
  }, []);

  return { ...state, addReaction, removeReaction, refresh };
}

// ============================================================================
// useComments
// ============================================================================

export interface UseCommentsOptions extends OptionalSiteKey<SeriphConfig> {
  /** Content identifier (e.g., post slug) */
  contentId: string;
  /** Auto-fetch comments on mount (default: true) */
  autoFetch?: boolean;
}

export interface UseCommentsReturn {
  comments: Comment[];
  status: ControllerStatus;
  error: Error | null;
  postComment: (author: string, content: string, options?: { authorEmail?: string; parentId?: string }) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for handling comments.
 *
 * @example
 * ```tsx
 * const { comments, status, postComment } = useComments({
 *   siteKey: 'your-site-key',
 *   contentId: 'my-post-slug',
 * });
 *
 * {comments.map(comment => (
 *   <div key={comment.id}>
 *     <strong>{comment.authorName}</strong>: {comment.content}
 *   </div>
 * ))}
 *
 * <button onClick={() => postComment('Anonymous', 'Great post!')}>
 *   Add Comment
 * </button>
 * ```
 */
export function useComments(options: UseCommentsOptions): UseCommentsReturn {
  const controllerRef = useRef<CommentsController | null>(null);
  const [state, setState] = useState<CommentsState>({
    comments: [],
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new CommentsController(config, options.contentId);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);

    // Auto-fetch on mount (default: true)
    if (options.autoFetch !== false) {
      controller.fetch();
    }

    return unsubscribe;
  }, [options.siteKey, options.endpoint, options.contentId]);

  const postComment = useCallback(async (author: string, content: string, options?: { authorEmail?: string; parentId?: string }) => {
    await controllerRef.current?.post(author, content, options);
  }, []);

  const refresh = useCallback(async () => {
    await controllerRef.current?.fetch();
  }, []);

  return { ...state, postComment, refresh };
}

// ============================================================================
// useWaitlist
// ============================================================================

export interface UseWaitlistOptions extends OptionalSiteKey<SeriphConfig> {}

export interface UseWaitlistReturn {
  status: ControllerStatus;
  message: string | null;
  position: number | null;
  error: Error | null;
  join: (email: string, options?: { name?: string; source?: string }) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling waitlist signups.
 *
 * @example
 * ```tsx
 * const { join, status, message, position } = useWaitlist({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => join('user@example.com')}>Join Waitlist</button>
 * {status === 'success' && <p>You're #{position} on the list!</p>}
 * ```
 */
export function useWaitlist(options: UseWaitlistOptions): UseWaitlistReturn {
  const controllerRef = useRef<WaitlistController | null>(null);
  const [state, setState] = useState<WaitlistState>({
    status: "idle",
    message: null,
    position: null,
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new WaitlistController(config);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);
    return unsubscribe;
  }, [options.siteKey, options.endpoint]);

  const join = useCallback(async (email: string, opts?: { name?: string; source?: string }) => {
    await controllerRef.current?.join(email, opts);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.reset();
  }, []);

  return { ...state, join, reset };
}

// ============================================================================
// useViews
// ============================================================================

export interface UseViewsOptions extends OptionalSiteKey<SeriphConfig> {
  /** Page identifier (e.g., slug or URL path) */
  pageId: string;
  /** Auto-record view on mount (default: true) */
  autoRecord?: boolean;
}

export interface UseViewsReturn {
  views: number;
  uniqueVisitors: number;
  status: ControllerStatus;
  error: Error | null;
  record: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for tracking and displaying page views.
 *
 * @example
 * ```tsx
 * const { views, uniqueVisitors } = useViews({
 *   siteKey: 'your-site-key',
 *   pageId: '/blog/my-post',
 * });
 *
 * <span>{views} views ({uniqueVisitors} unique)</span>
 * ```
 */
export function useViews(options: UseViewsOptions): UseViewsReturn {
  const controllerRef = useRef<ViewCountsController | null>(null);
  const [state, setState] = useState<ViewCountsState>({
    pageId: options.pageId,
    views: 0,
    uniqueVisitors: 0,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new ViewCountsController(config, options.pageId);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);

    // Auto-record view on mount (default: true)
    if (options.autoRecord !== false) {
      controller.record();
    }

    return unsubscribe;
  }, [options.siteKey, options.endpoint, options.pageId]);

  const record = useCallback(async () => {
    await controllerRef.current?.record();
  }, []);

  const refresh = useCallback(async () => {
    await controllerRef.current?.fetch();
  }, []);

  return { views: state.views, uniqueVisitors: state.uniqueVisitors, status: state.status, error: state.error, record, refresh };
}

// ============================================================================
// useFeedback
// ============================================================================

export interface UseFeedbackOptions extends OptionalSiteKey<SeriphConfig> {}

export interface UseFeedbackReturn {
  status: ControllerStatus;
  message: string | null;
  error: Error | null;
  submit: (type: FeedbackType, content: string, options?: { email?: string; pageUrl?: string }) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for handling feedback submissions.
 *
 * @example
 * ```tsx
 * const { submit, status } = useFeedback({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => submit('feature', 'Add dark mode!')}>
 *   Submit Feedback
 * </button>
 * ```
 */
export function useFeedback(options: UseFeedbackOptions): UseFeedbackReturn {
  const controllerRef = useRef<FeedbackController | null>(null);
  const [state, setState] = useState<FeedbackState>({
    status: "idle",
    message: null,
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new FeedbackController(config);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);
    return unsubscribe;
  }, [options.siteKey, options.endpoint]);

  const submit = useCallback(async (type: FeedbackType, content: string, opts?: { email?: string; pageUrl?: string }) => {
    await controllerRef.current?.submit(type, content, opts);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.reset();
  }, []);

  return { ...state, submit, reset };
}

// ============================================================================
// usePoll
// ============================================================================

export interface UsePollOptions extends OptionalSiteKey<SeriphConfig> {
  /** Poll slug */
  slug: string;
  /** Auto-fetch poll on mount (default: true) */
  autoFetch?: boolean;
}

export interface UsePollReturn {
  poll: PollWithResults | null;
  status: ControllerStatus;
  error: Error | null;
  vote: (selectedOptions: string[]) => Promise<void>;
  hasVoted: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for displaying and voting on polls.
 *
 * @example
 * ```tsx
 * const { poll, vote, hasVoted } = usePoll({
 *   siteKey: 'your-site-key',
 *   slug: 'favorite-framework',
 * });
 *
 * {poll && (
 *   <div>
 *     <h3>{poll.question}</h3>
 *     {poll.options.map(opt => (
 *       <button key={opt.id} onClick={() => vote([opt.id])} disabled={hasVoted}>
 *         {opt.text} ({poll.results[opt.id] || 0} votes)
 *       </button>
 *     ))}
 *   </div>
 * )}
 * ```
 */
export function usePoll(options: UsePollOptions): UsePollReturn {
  const controllerRef = useRef<PollController | null>(null);
  const [state, setState] = useState<PollState>({
    poll: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new PollController(config, options.slug);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);

    // Auto-fetch on mount (default: true)
    if (options.autoFetch !== false) {
      controller.fetch();
    }

    return unsubscribe;
  }, [options.siteKey, options.endpoint, options.slug]);

  const vote = useCallback(async (selectedOptions: string[]) => {
    await controllerRef.current?.vote(selectedOptions);
  }, []);

  const refresh = useCallback(async () => {
    await controllerRef.current?.fetch();
  }, []);

  const hasVoted = controllerRef.current?.hasVoted() ?? false;

  return { ...state, vote, hasVoted, refresh };
}

// ============================================================================
// useAnnouncements
// ============================================================================

export interface UseAnnouncementsOptions extends OptionalSiteKey<SeriphConfig> {
  /** Auto-fetch announcements on mount (default: true) */
  autoFetch?: boolean;
}

export interface UseAnnouncementsReturn {
  announcements: Announcement[];
  status: ControllerStatus;
  error: Error | null;
  dismiss: (announcementId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for displaying site announcements.
 *
 * @example
 * ```tsx
 * const { announcements, dismiss } = useAnnouncements({
 *   siteKey: 'your-site-key',
 * });
 *
 * {announcements.map(ann => (
 *   <div key={ann.id} className={`announcement-${ann.announcementType}`}>
 *     {ann.content}
 *     {ann.isDismissible && (
 *       <button onClick={() => dismiss(ann.id)}>Dismiss</button>
 *     )}
 *   </div>
 * ))}
 * ```
 */
export function useAnnouncements(options: UseAnnouncementsOptions): UseAnnouncementsReturn {
  const controllerRef = useRef<AnnouncementsController | null>(null);
  const [state, setState] = useState<AnnouncementsState>({
    announcements: [],
    dismissed: new Set(),
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const config = resolveConfig(options);
    const controller = new AnnouncementsController(config);
    controllerRef.current = controller;

    const unsubscribe = controller.subscribe(setState);

    // Auto-fetch on mount (default: true)
    if (options.autoFetch !== false) {
      controller.fetch();
    }

    return unsubscribe;
  }, [options.siteKey, options.endpoint]);

  const dismiss = useCallback(async (announcementId: number) => {
    await controllerRef.current?.dismiss(announcementId);
  }, []);

  const refresh = useCallback(async () => {
    await controllerRef.current?.fetch();
  }, []);

  // Return only visible (non-dismissed) announcements
  const visibleAnnouncements = controllerRef.current?.getVisibleAnnouncements() ?? [];

  return { announcements: visibleAnnouncements, status: state.status, error: state.error, dismiss, refresh };
}
