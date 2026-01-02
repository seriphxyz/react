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
import { SubscribeController, FormController, ReactionsController, CommentsController, } from "@seriphxyz/core";
// Re-export API functions from core
export { fetchPosts, fetchPost, DEFAULT_ENDPOINT, API_PATH, } from "@seriphxyz/core";
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
export function useSubscribe(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const subscribe = useCallback(async (email) => {
        await controllerRef.current?.submit(email);
    }, []);
    const reset = useCallback(() => {
        controllerRef.current?.reset();
    }, []);
    return { ...state, subscribe, reset };
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
export function useForm(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const submit = useCallback(async (data) => {
        await controllerRef.current?.submit(data);
    }, []);
    const reset = useCallback(() => {
        controllerRef.current?.reset();
    }, []);
    return { ...state, submit, reset };
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
export function useReactions(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const addReaction = useCallback(async (type) => {
        await controllerRef.current?.add(type);
    }, []);
    const removeReaction = useCallback(async (type) => {
        await controllerRef.current?.remove(type);
    }, []);
    const refresh = useCallback(async () => {
        await controllerRef.current?.fetch();
    }, []);
    return { ...state, addReaction, removeReaction, refresh };
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
export function useComments(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const postComment = useCallback(async (author, content, options) => {
        await controllerRef.current?.post(author, content, options);
    }, []);
    const refresh = useCallback(async () => {
        await controllerRef.current?.fetch();
    }, []);
    return { ...state, postComment, refresh };
}
