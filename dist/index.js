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
import { SubscribeController, FormController, ReactionsController, CommentsController, WaitlistController, ViewCountsController, FeedbackController, PollController, AnnouncementsController, resolveConfig, } from "@seriphxyz/core";
// Re-export API functions and helpers from core
export { fetchPosts, fetchPost, getConfigFromMeta, resolveConfig, DEFAULT_ENDPOINT, API_PATH, } from "@seriphxyz/core";
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
        const config = resolveConfig(options);
        const controller = new SubscribeController(config);
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
        const config = resolveConfig(options);
        const controller = new FormController(config, options.formSlug);
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
    const postComment = useCallback(async (author, content, options) => {
        await controllerRef.current?.post(author, content, options);
    }, []);
    const refresh = useCallback(async () => {
        await controllerRef.current?.fetch();
    }, []);
    return { ...state, postComment, refresh };
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
export function useWaitlist(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const join = useCallback(async (email, opts) => {
        await controllerRef.current?.join(email, opts);
    }, []);
    const reset = useCallback(() => {
        controllerRef.current?.reset();
    }, []);
    return { ...state, join, reset };
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
export function useViews(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
export function useFeedback(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const submit = useCallback(async (type, content, opts) => {
        await controllerRef.current?.submit(type, content, opts);
    }, []);
    const reset = useCallback(() => {
        controllerRef.current?.reset();
    }, []);
    return { ...state, submit, reset };
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
export function usePoll(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const vote = useCallback(async (selectedOptions) => {
        await controllerRef.current?.vote(selectedOptions);
    }, []);
    const refresh = useCallback(async () => {
        await controllerRef.current?.fetch();
    }, []);
    const hasVoted = controllerRef.current?.hasVoted() ?? false;
    return { ...state, vote, hasVoted, refresh };
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
export function useAnnouncements(options) {
    const controllerRef = useRef(null);
    const [state, setState] = useState({
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
    const dismiss = useCallback(async (announcementId) => {
        await controllerRef.current?.dismiss(announcementId);
    }, []);
    const refresh = useCallback(async () => {
        await controllerRef.current?.fetch();
    }, []);
    // Return only visible (non-dismissed) announcements
    const visibleAnnouncements = controllerRef.current?.getVisibleAnnouncements() ?? [];
    return { announcements: visibleAnnouncements, status: state.status, error: state.error, dismiss, refresh };
}
