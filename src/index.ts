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
  type SeriphConfig,
  type SubscribeState,
  type FormState,
  type ReactionsState,
  type CommentsState,
  type Comment,
  type ControllerStatus,
} from "@seriphxyz/core";

// Re-export types from core
export type {
  SeriphConfig,
  SubscribeState,
  FormState,
  ReactionsState,
  CommentsState,
  Comment,
  ReactionCounts,
  SeriphPost,
  FetchPostsOptions,
  FetchPostOptions,
  ControllerStatus,
} from "@seriphxyz/core";

// Re-export API functions from core
export {
  fetchPosts,
  fetchPost,
  DEFAULT_ENDPOINT,
  API_PATH,
} from "@seriphxyz/core";

// ============================================================================
// useSubscribe
// ============================================================================

export interface UseSubscribeOptions extends SeriphConfig {}

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
    const controller = new SubscribeController(options);
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

export interface UseFormOptions extends SeriphConfig {
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
    const controller = new FormController(options, options.formSlug);
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

export interface UseReactionsOptions extends SeriphConfig {
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
    const controller = new ReactionsController(options, options.contentId);
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

export interface UseCommentsOptions extends SeriphConfig {
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
    const controller = new CommentsController(options, options.contentId);
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
